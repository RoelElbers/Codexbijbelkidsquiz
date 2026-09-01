/* ============================================================================
   test-ontgrendel.js — voortgang zetten zonder te spelen
   ----------------------------------------------------------------------------
   TESTHULPMIDDEL. Dit bestand hoort bij het kladblok en wordt nergens door
   index.html ingeladen. Het is bedoeld om met de hand in de browserconsole te
   plakken terwijl de Bijbelkidsquiz openstaat.

   GEBRUIK
     1. Open het spel in de browser en log in op het profiel dat u wilt testen.
     2. Open de console (F12) en plak dit hele bestand erin. Er gebeurt dan nog
        niets; er komen alleen drie functies beschikbaar.
     3. Roep aan wat u nodig hebt:

          ontgrendelSchat()   de drie schatkisten op "verdiend" en de Verborgen
                              Schat op ontdekt. Genoeg om de diamanten kist te
                              kunnen spelen én de naslagpagina te openen.

          ontgrendelAlles()   hetzelfde, plus alle 18 boeken op goud en alle 54
                              schildpunten gevuld. Daarmee staan ook Advanced en
                              Expert overal open.

          wisAlles()          alle voortgang van het actieve profiel wissen,
                              terug naar nul. Het profiel zelf blijft bestaan,
                              net als de geluidsinstelling.

     4. HERLAAD DE PAGINA (F5). Het spel leest localStorage bij het opstarten;
        zonder herladen ziet u de wijziging niet.

   WELK PROFIEL IS ACTIEF?
     Alle voortgang staat onder sleutels met de prefix speler_<id>_ . Het id van
     het profiel dat nu speelt vraagt u zo op:

          localStorage.getItem("bkq_actiefProfiel")

     En de bijbehorende naam:

          JSON.parse(localStorage.getItem("bkq_profielen"))

     Is er nog geen actief profiel — bijvoorbeeld voordat er ooit een speler is
     aangemaakt — dan stoppen alle drie de functies met een melding. Ze schrijven
     dan bewust niets, want een sleutel zonder id (speler__kist_brons) wordt bij
     het aanmaken van een echt profiel niet meeverhuisd.

   WAT DEZE FUNCTIES NIET AANRAKEN
     De globale sleutels blijven ongemoeid: bkq_profielen, bkq_actiefProfiel,
     geluidAan en afstel_zaalposities_v1.
   ========================================================================== */

(function () {
    "use strict";

    // Het spel definieert deze lijsten zelf. Staan ze er (dit bestand wordt in de
    // console van de spelpagina geplakt), dan gebruiken we die — zo blijft dit
    // script vanzelf gelijklopen als er een boek bij komt. Anders vallen we terug
    // op een kopie van de stand van nu.
    var BOEKEN = (typeof boekNaarKey !== "undefined")
        ? Object.keys(boekNaarKey).map(function (n) { return boekNaarKey[n]; })
        : ["matteus", "marcus", "lucas", "johannes", "handelingen", "romeinen",
           "korintiers", "galaten", "efeziers", "filippenzen", "kolossenzen_filemon",
           "tessalonicenzen", "timoteus_titus", "hebreeen", "jakobus",
           "petrus_judas", "johannesbrieven", "openbaring"];

    var KISTEN = (typeof alleKistKeys !== "undefined")
        ? alleKistKeys.slice()
        : ["brons", "zilver", "goud"];

    var NIVEAUS = (typeof niveauKeys !== "undefined")
        ? niveauKeys.slice()
        : ["beginner", "advanced", "expert"];

    // --- gedeelde hulpjes ---------------------------------------------------

    // Geeft het actieve profiel-id, of null met een melding als er geen is.
    function actiefId() {
        var id = localStorage.getItem("bkq_actiefProfiel");
        if (!id) {
            console.warn(
                "Geen actief profiel — er is niets gewijzigd.\n" +
                "Start het spel, maak of kies een speler, en probeer het opnieuw.\n" +
                'Controleren kan met: localStorage.getItem("bkq_actiefProfiel")'
            );
            return null;
        }
        return id;
    }

    function naamVan(id) {
        try {
            var lijst = JSON.parse(localStorage.getItem("bkq_profielen")) || [];
            for (var i = 0; i < lijst.length; i++) {
                if (lijst[i].id === id) return lijst[i].naam || "(naamloos)";
            }
        } catch (e) { /* kapot register: dan maar zonder naam */ }
        return "(niet in het register)";
    }

    function zet(id, sleutel, waarde) {
        localStorage.setItem("speler_" + id + "_" + sleutel, waarde);
    }

    function slot(id, regels, aantal, werkwoord) {
        console.log(
            "Profiel: " + naamVan(id) + "  (" + id + ")\n" +
            regels.join("\n") + "\n" +
            "-> " + aantal + " sleutel" + (aantal === 1 ? "" : "s") + " " + werkwoord + ".\n" +
            "HERLAAD DE PAGINA (F5) om het in het spel te zien."
        );
    }

    // --- 1. de drie kisten + de Verborgen Schat ------------------------------

    function ontgrendelSchat() {
        var id = actiefId();
        if (!id) return;

        var n = 0;
        KISTEN.forEach(function (k) { zet(id, "kist_" + k, "verdiend"); n++; });
        zet(id, "verborgenschat_voltooid", "waar"); n++;

        slot(id, [
            "  " + KISTEN.length + " schatkisten op \"verdiend\": " + KISTEN.join(", "),
            "  verborgenschat_voltooid op \"waar\""
        ], n, "gezet");
    }

    // --- 2. alles: kisten, schat, trofeeën en schildpunten -------------------

    function ontgrendelAlles() {
        var id = actiefId();
        if (!id) return;

        var n = 0;
        KISTEN.forEach(function (k) { zet(id, "kist_" + k, "verdiend"); n++; });
        zet(id, "verborgenschat_voltooid", "waar"); n++;

        BOEKEN.forEach(function (boek) {
            zet(id, "trofee_" + boek, "goud"); n++;
            NIVEAUS.forEach(function (niveau) {
                zet(id, "schildpunt_" + boek + "_" + niveau, "1"); n++;
            });
        });

        slot(id, [
            "  " + KISTEN.length + " schatkisten op \"verdiend\"",
            "  verborgenschat_voltooid op \"waar\"",
            "  " + BOEKEN.length + " trofeeën op \"goud\"",
            "  " + (BOEKEN.length * NIVEAUS.length) + " schildpunten gevuld"
        ], n, "gezet");
    }

    // --- 3. alle voortgang van dit profiel wissen ---------------------------

    function wisAlles() {
        var id = actiefId();
        if (!id) return;

        // Eerst verzamelen, dan pas wissen: removeItem verschuift de index.
        var prefix = "speler_" + id + "_";
        var teWissen = [];
        for (var i = 0; i < localStorage.length; i++) {
            var k = localStorage.key(i);
            if (k && k.indexOf(prefix) === 0) teWissen.push(k);
        }
        teWissen.forEach(function (k) { localStorage.removeItem(k); });

        if (teWissen.length === 0) {
            console.log(
                "Profiel: " + naamVan(id) + "  (" + id + ")\n" +
                "  Er stond nog geen voortgang onder dit profiel.\n" +
                "-> 0 sleutels gewist."
            );
            return;
        }

        slot(id, [
            "  alles met de prefix " + prefix,
            "  (globale sleutels blijven staan: bkq_profielen, bkq_actiefProfiel, geluidAan)"
        ], teWissen.length, "gewist");
    }

    // Beschikbaar maken in de console. Bewust op window en niet als losse
    // functieverklaring: zo kunt u dit bestand een tweede keer plakken zonder
    // "already declared"-fout.
    window.ontgrendelSchat = ontgrendelSchat;
    window.ontgrendelAlles = ontgrendelAlles;
    window.wisAlles = wisAlles;

    console.log(
        "test-ontgrendel geladen. Beschikbaar:\n" +
        "  ontgrendelSchat()   3 kisten + Verborgen Schat\n" +
        "  ontgrendelAlles()   idem + " + BOEKEN.length + " trofeeën op goud + " +
            (BOEKEN.length * NIVEAUS.length) + " schildpunten\n" +
        "  wisAlles()          alle voortgang van dit profiel wissen\n" +
        "Na afloop de pagina herladen (F5)."
    );
})();
