// =========================
// lang/nl.js — Nederlandse labels
// Eerste taalbestand van het project; de rest van de app is voorlopig nog
// hardcoded Nederlands. Dit bestand zet teksten die we meertalig willen houden
// los van de logica/afbeeldingen, zodat er later een tweede taal naast kan.
//
// Nu: de korte boekafkortingen voor de NT-prijzenkast op scherm 2. Gekeyd op de
// `basis` van de trofee (de bestandsnaam-slug, zoals in de vitrineconfigs), niet
// op de localStorage-sleutel — zo kan de kast-renderer ze direct opzoeken via
// nis.basis. De volledige namen blijven in de Schatkamer/vitrineconfigs.
// =========================
const NL = {
    afkortingen: {
        "handelingen":         "Hand.",
        "romeinen":            "Rom.",
        "korintiers":          "1-2 Kor.",
        "galaten":             "Gal.",
        "efeziers":            "Ef.",
        "filippenzen":         "Fil.",
        "kolossenzen-filemon": "Kol. & Flm.",
        "tessalonicenzen":     "1-2 Tess.",
        "timoteus-titus":      "Tim. & Tit.",
        "hebreeen":            "Heb.",
        "jakobus":             "Jak.",
        "petrus-judas":        "Petr. & Jud.",
        "johannesbrieven":     "1-3 Joh.",
        "openbaring":          "Op."
    },

    // =====================================================================
    // Steun-scherm (Instellingen → Over dit spel → Steun de Bijbelkidsquiz)
    //
    // LET OP: alle zinnen hieronder zijn OPVULTEKST om de opmaak te kunnen
    // beoordelen. Ze worden later door de echte teksten vervangen.
    //
    // Het scherm wordt uit deze data opgebouwd door vulSteunScherm() in
    // script.js, zodat er voor een tweede taal geen HTML bij hoeft:
    //   blokken[].kop   = kopje boven het blok
    //   blokken[].items = tekstregels. Een gewone string wordt een alinea;
    //                     een item {datum, tekst} krijgt de datum in goud
    //                     vooraan, net als de lemma's in het woordenboek.
    //   blokken[].link  = optionele knop onder het blok, opent in nieuw tabblad
    // Nieuwste voortgangsbericht bovenaan zetten.
    // =====================================================================
    steun: {
        titel: "Steun de Bijbelkidsquiz",
        terugBoven: "← Terug",
        terugOnder: "Terug",
        kvk: "KVK: 42107479",
        blokken: [
            {
                kop: "Wat is dit",
                items: [
                    "De Bijbelkidsquiz is een spel waarmee kinderen de Bijbel leren kennen door te spelen. Ruim achthonderd vragen over het hele Nieuwe Testament, verdeeld over achttien quizzen op drie niveaus, met trofeeën om te verdienen en een schatkamer om te vullen.",
                    "De quiz is bewust breed opgezet. De vragen gaan over wat katholieken, protestanten en evangelischen samen in de Bijbel lezen, en de antwoorden komen uit de Bijbeltekst zelf.",
                    "Spelen is gratis. Er is geen account, geen reclame en er wordt niets over je bijgehouden."
                ]
            },
            {
                kop: "Waar we nu staan",
                nieuwsteUpdate: true,
                meerLabel: "Bekijk alle updates"
            },
            {
                kop: "Wat er nog komt",
                items: [
                    "Muziek en geluid onder het spel, zodat de wereld van de quiz ook te horen is.",
                    "Korte animatiefilmpjes over de Bijbel, zodat het spel meer wordt dan tekst op een scherm.",
                    "Een nieuwe manier om beloond te worden voor wat je hebt geleerd, naast de trofeeën en de schatkisten die er nu zijn."
                ]
            },
            {
                kop: "Hoe u kunt helpen",
                items: [
                    "De Bijbelkidsquiz is er, en spelen kost niets. Dat blijft zo.",
                    "Wie het spel waardeert en wil bijdragen aan wat er nog komt, is van harte welkom. U kiest zelf welk bedrag u geeft."
                ],
                link: {
                    label: "Lees hoe u kunt steunen",
                    url: "steunen.html"
                }
            }
        ]
    },

    // =====================================================================
    // Updates-scherm (Steun → Bekijk alle updates)
    //
    // Het volledige voortgangsoverzicht. Nieuwste bovenaan: items[0] is
    // tegelijk het bericht dat op het steunscherm zelf blijft staan. Een
    // nieuwe maand toevoegen = er hier eentje bovenaan bij zetten, verder
    // niets. OPVULTEKST, wordt later vervangen.
    // =====================================================================
    updates: {
        titel: "Waar we nu staan",
        terugBoven: "\u2190 Terug",
        terugOnder: "Terug",
        intro: "Hier komt elke maand een kort bericht bij over waar het project staat. Het nieuwste bericht staat bovenaan.",
        items: [
            { datum: "Juli 2026", tekst: "De Bijbelkidsquiz is online gegaan op bijbelkidsquiz.nl. Nieuw logo, en een contactpagina, privacyverklaring en steunpagina toegevoegd." }
        ]
    }
};
