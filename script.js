// --- Testversie -------------------------------------------------------------
// Toont een rustig "TESTVERSIE"-lint op het startscherm zolang dit true is.
// Bij de echte launch: op false zetten en het lint verdwijnt volledig.
const BETA_MODUS = true;

// --- Donatie-lantaarn (linksonder op het startscherm) -----------------------
// De lantaarn is klikbaar en voelt klikbaar (warme hover-gloed), maar donaties
// staan nog UIT. Zodra de donatiepagina live is (bunq of Mollie): DONATIE_ACTIEF
// op true en DONATIE_URL invullen — dat is de enige plek die je hoeft te wijzigen.
// Uit  -> klik toont een in-stijl melding ("binnenkort mogelijk").
// Aan  -> klik opent DONATIE_URL in een nieuw tabblad via openTabblad().
const DONATIE_ACTIEF = false;
const DONATIE_URL = "";

// --- Geluid -----------------------------------------------------------------
// Eenvoudig klikgeluid, in code opgewekt — geen geluidsbestand nodig, werkt ook
// via file:///. De AAN/UIT-stand wordt onthouden in localStorage (standaard aan).
let audioCtx = null;
let geluidAan = (localStorage.getItem("geluidAan") !== "uit");

function speelKlik() {
    if (!geluidAan) return;
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === "suspended") audioCtx.resume();
        const t = audioCtx.currentTime;
        const duur = 0.05;
        // Zachte, korte ruis door een laagdoorlaatfilter = een rustig "tok",
        // zonder de scherpe hoge tik. Zachte aanzet en uitloop maken het vriendelijk.
        const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * duur), audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const bron = audioCtx.createBufferSource();
        bron.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 1100;
        const gain = audioCtx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.10, t + 0.006);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + duur);
        bron.connect(filter);
        filter.connect(gain);
        gain.connect(audioCtx.destination);
        bron.start(t);
        bron.stop(t + duur);
    } catch (e) {
        // Lukt audio niet, dan gewoon negeren.
    }
}

// Eén luisteraar voor alle klikbare elementen, zodat we niet elke knop apart
// hoeven aan te passen.
document.addEventListener("click", (e) => {
    if (e.target.closest("button, [onclick]")) {
        speelKlik();
    }
});

const fullscreenBtn = document.getElementById("fullscreen-btn");

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// Op apparaten zonder Fullscreen-API (o.a. Safari op iPhone) doet de knop niets;
// verberg hem dan zodat er geen dode knop op het scherm staat.
if (!document.fullscreenEnabled) {
    fullscreenBtn.style.display = "none";
}

// Nette labels voor de niveaus (intern: beginner/advanced/expert)
const niveauLabels = {
    beginner: "Beginner",
    advanced: "Advanced",
    expert: "Expert"
};

/* Opent een URL in een nieuw tabblad.
   Bewust GEEN derde argument aan window.open: elke featuresstring —
   ook alleen "noopener" — laat de browser een popup openen in plaats
   van een tabblad. De koppeling met dit venster verbreken we daarom
   achteraf met opener = null. */
function openTabblad(url) {
    const nieuw = window.open(url, "_blank");
    if (nieuw) {
        try { nieuw.opener = null; } catch (e) { /* cross-origin: browser regelt het zelf */ }
    }
}

// Hulpfunctie die 10 placeholdervragen maakt voor een boek + niveau.
// Deze vervangen we later door echte vragen.
function maakPlaceholders(boek, niveau) {
    const set = [];

    for (let i = 1; i <= 10; i++) {
        set.push({
            vraag: `Placeholdervraag ${i} – ${boek} (${niveauLabels[niveau]})`,
            antwoorden: ["Antwoord A", "Antwoord B", "Antwoord C", "Antwoord D"],
            correct: "Antwoord A"
        });
    }

    return set;
}

// Vragen georganiseerd per boek en per niveau: vragenData[boek][niveau]
const vragenData = {
    "Matteüs": {
        beginner: [
            {
                vraag: "In welke stad werd Jezus geboren?",
                antwoorden: ["Nazaret", "Betlehem", "Jeruzalem", "Kafarnaüm"],
                correct: "Betlehem",
                bijbelplaats: "Matteüs 2:1"
            },
            {
                vraag: "Hoeveel leerlingen (apostelen) koos Jezus uit om hem te volgen?",
                antwoorden: ["7", "10", "12", "40"],
                correct: "12",
                bijbelplaats: "Matteüs 10:1-4"
            },
            {
                vraag: "Wie doopte Jezus in de rivier de Jordaan?",
                antwoorden: ["Petrus", "Zijn eigen vader Jozef", "Johannes de Doper", "Paulus"],
                correct: "Johannes de Doper",
                bijbelplaats: "Matteüs 3:13-17"
            },
            {
                vraag: "Wat was het beroep van Matteüs voordat hij Jezus volgde?",
                antwoorden: ["Visser", "Timmerman", "Belastingontvanger", "Herder"],
                correct: "Belastingontvanger",
                bijbelplaats: "Matteüs 9:9"
            },
            {
                vraag: "Hoe heet het gebed dat Jezus zijn leerlingen leerde bidden?",
                antwoorden: ["Het Onzevader", "Het Weesgegroet", "De Geloofsbelijdenis", "Het Avondgebed"],
                correct: "Het Onzevader",
                bijbelplaats: "Matteüs 6:9-13"
            },
            {
                vraag: "Wie kwamen er na de geboorte van Jezus naar hem op zoek, geleid door een ster?",
                antwoorden: ["Herders", "Wijzen uit het oosten", "Engelen", "Priesters uit de grote tempel"],
                correct: "Wijzen uit het oosten",
                bijbelplaats: "Matteüs 2:1-2"
            },
            {
                vraag: "Wat deed Jezus toen er een storm op het meer was en de leerlingen bang werden?",
                antwoorden: ["Hij sliep gewoon verder", "Hij maakte dat de storm ging liggen", "Hij verliet de boot en liep over het water naar de overkant", "Hij nam het stuur over en leidde de boot veilig naar de haven"],
                correct: "Hij maakte dat de storm ging liggen",
                bijbelplaats: "Matteüs 8:23-27"
            },
            {
                vraag: "Wat gebeurde er toen Jezus gedoopt werd?",
                antwoorden: ["Er kwam een storm op", "De hemel ging open en er daalde een duif neer", "Er verscheen een grote regenboog aan de hemel", "Er klonk een bazuin"],
                correct: "De hemel ging open en er daalde een duif neer",
                bijbelplaats: "Matteüs 3:16"
            },
            {
                vraag: "Hoeveel dagen vastte Jezus in de woestijn voordat hij op de proef werd gesteld?",
                antwoorden: ["7 dagen", "12 dagen", "40 dagen", "100 dagen"],
                correct: "40 dagen",
                bijbelplaats: "Matteüs 4:1-2"
            },
            {
                vraag: "Welke leerling liep een stukje over het water naar Jezus toe, maar begon te zinken toen hij bang werd?",
                antwoorden: ["Johannes", "Petrus", "Andreas", "Jakobus"],
                correct: "Petrus",
                bijbelplaats: "Matteüs 14:28-31"
            },
            {
                vraag: "Welke leerling verraadde Jezus voor dertig zilverstukken?",
                antwoorden: ["Petrus", "Tomas", "Judas Iskariot", "Filippus"],
                correct: "Judas Iskariot",
                bijbelplaats: "Matteüs 26:14-16"
            },
            {
                vraag: "Wat antwoordde Jezus toen hem werd gevraagd wat het grootste gebod is?",
                antwoorden: ["Heb God lief, en je naaste als jezelf", "Breng elke dag trouw een offer in de tempel", "Eer je vader en moeder", "Houd de sabbat heilig"],
                correct: "Heb God lief, en je naaste als jezelf",
                bijbelplaats: "Matteüs 22:37-39"
            }
        ],
        advanced: [
            {
                vraag: "Wie was de Romeinse landvoogd die uiteindelijk besliste over de kruisiging van Jezus?",
                antwoorden: ["Herodes", "Pontius Pilatus", "Kajafas", "Augustus"],
                correct: "Pontius Pilatus",
                bijbelplaats: "Matteüs 27:11-26"
            },
            {
                vraag: "Het zaad viel in de gelijkenis van de zaaier op vier plekken. Welke plek hoort daar niet bij?",
                antwoorden: ["Op het pad", "Op de rotsbodem", "Tussen de distels", "In het water"],
                correct: "In het water",
                bijbelplaats: "Matteüs 13:3-8"
            },
            {
                vraag: "Wat gebeurde er op het moment dat Jezus aan het kruis stierf?",
                antwoorden: ["Er kwamen allemaal duiven aangevlogen", "Het werd donker en het voorhangsel van de tempel scheurde", "Er verscheen een regenboog", "Alle vogels in de wijde omgeving begonnen tegelijk te zingen"],
                correct: "Het werd donker en het voorhangsel van de tempel scheurde",
                bijbelplaats: "Matteüs 27:45-51"
            },
            {
                vraag: "Wat deed Petrus drie keer voordat de haan kraaide, zoals Jezus had voorspeld?",
                antwoorden: ["Hij viel in slaap", "Hij ontkende dat hij Jezus kende", "Hij vluchtte weg", "Hij vocht met een soldaat"],
                correct: "Hij ontkende dat hij Jezus kende",
                bijbelplaats: "Matteüs 26:69-75"
            },
            {
                vraag: "In de gelijkenis van de talenten: wat deed de dienaar die maar één talent had gekregen?",
                antwoorden: ["Hij verdubbelde het", "Hij begroef het in de grond", "Hij gaf het weg", "Hij ging ermee gokken en had alles verloren"],
                correct: "Hij begroef het in de grond",
                bijbelplaats: "Matteüs 25:14-30"
            },
            {
                vraag: "Wat zei Jezus dat je moest doen als iemand je op de ene wang slaat?",
                antwoorden: ["Terugslaan", "De andere wang ook toekeren", "Weglopen", "De ander meteen bij de rechter aanklagen"],
                correct: "De andere wang ook toekeren",
                bijbelplaats: "Matteüs 5:39"
            },
            {
                vraag: "Een engel waarschuwde Jozef in een droom dat koning Herodes het kind Jezus zocht. Wat moest hij doen?",
                antwoorden: ["Met Maria en het kind naar Egypte vluchten", "Het kind in het geheim bij familie in Nazaret verbergen", "Zo snel mogelijk naar koning Herodes gaan", "Met het gezin de bergen bij Betlehem in trekken"],
                correct: "Met Maria en het kind naar Egypte vluchten",
                bijbelplaats: "Matteüs 2:13"
            },
            {
                vraag: "Wat was de laatste opdracht die Jezus aan zijn leerlingen gaf, ook wel het zendingsbevel genoemd?",
                antwoorden: ["Bouw een tempel", "Maak alle volken tot leerlingen en doop hen", "Blijf voortaan allemaal samen in de stad Jeruzalem wonen", "Schrijf een boek"],
                correct: "Maak alle volken tot leerlingen en doop hen",
                bijbelplaats: "Matteüs 28:18-20"
            },
            {
                vraag: "Welke drie geschenken brachten de wijzen uit het oosten aan het kind Jezus?",
                antwoorden: ["Goud, wierook en mirre", "Brood, wijn en olie", "Goud, zilver en koper", "Water, zout en graan"],
                correct: "Goud, wierook en mirre",
                bijbelplaats: "Matteüs 2:11"
            },
            {
                vraag: "Wat at Johannes de Doper in de woestijn?",
                antwoorden: ["Brood en vis", "Sprinkhanen en wilde honing", "Vijgen en dadels", "Niets, hij vastte altijd"],
                correct: "Sprinkhanen en wilde honing",
                bijbelplaats: "Matteüs 3:4"
            }
        ],
        expert: [
            {
                vraag: "Wie verschenen er naast Jezus toen hij op de berg van gedaante veranderde?",
                antwoorden: ["Mozes en Abraham", "Mozes en Elia", "Twee aartsengelen", "Elia en Abraham"],
                correct: "Mozes en Elia",
                bijbelplaats: "Matteüs 17:3"
            },
            {
                vraag: "Wat vroeg de moeder van Jakobus en Johannes aan Jezus voor haar zonen?",
                antwoorden: ["Of ze wat meer mochten uitrusten, want ze was bang dat haar zonen te vermoeid waren", "Of ze links en rechts van hem mochten zitten in zijn koninkrijk", "Of ze naar huis mochten", "Of ze meer brood kregen"],
                correct: "Of ze links en rechts van hem mochten zitten in zijn koninkrijk",
                bijbelplaats: "Matteüs 20:20-21"
            },
            {
                vraag: "Met welke maaltijd, een Joods feest, vierde Jezus het laatste avondmaal met zijn leerlingen?",
                antwoorden: ["Het Loofhuttenfeest", "Het Pesach (Paasmaal)", "Het Wekenfeest", "De sabbatsmaaltijd"],
                correct: "Het Pesach (Paasmaal)",
                bijbelplaats: "Matteüs 26:17"
            },
            {
                vraag: "Waarmee begint het evangelie van Matteüs?",
                antwoorden: ["Met een geslachtsregister vanaf Abraham", "Met de schepping", "Met de aankondiging van de engel aan Maria", "Met een lied"],
                correct: "Met een geslachtsregister vanaf Abraham",
                bijbelplaats: "Matteüs 1:1-17"
            },
            {
                vraag: "Het geslachtsregister van Matteüs is verdeeld in drie groepen. Hoeveel generaties telt elke groep?",
                antwoorden: ["7", "10", "14", "21"],
                correct: "14",
                bijbelplaats: "Matteüs 1:17"
            },
            {
                vraag: "Welke profeet wordt aangehaald: De maagd zal zwanger zijn en een zoon baren, en men zal hem Immanuël noemen?",
                antwoorden: ["Jesaja", "Jeremia", "Daniël", "Maleachi"],
                correct: "Jesaja",
                bijbelplaats: "Matteüs 1:22-23"
            },
            {
                vraag: "Wat betekent de naam Immanuël, die in Matteüs wordt uitgelegd?",
                antwoorden: ["Redder", "God met ons", "Koning der koningen", "Vredevorst"],
                correct: "God met ons",
                bijbelplaats: "Matteüs 1:23"
            },
            {
                vraag: "Welke twee broers, vissers, riep Jezus als eersten om hem te volgen?",
                antwoorden: ["Petrus en Andreas", "Jakobus en Johannes", "Filippus en Bartolomeüs", "Tomas en Matteüs"],
                correct: "Petrus en Andreas",
                bijbelplaats: "Matteüs 4:18-20"
            },
            {
                vraag: "Hoe groot was de schuld van de dienaar in de gelijkenis van de onbarmhartige dienaar?",
                antwoorden: ["Honderd denarie", "Duizend talenten", "Tienduizend talenten", "Honderd talenten"],
                correct: "Tienduizend talenten",
                bijbelplaats: "Matteüs 18:24"
            },
            {
                vraag: "Op welk moment van de nacht kwam Jezus over het water naar de leerlingen toe, volgens Matteüs?",
                antwoorden: ["Vlak na het invallen van de duisternis, aan het begin van de avond", "Tijdens de vierde nachtwaak, aan het einde van de nacht", "Rond middernacht", "Bij het eerste hanengekraai"],
                correct: "Tijdens de vierde nachtwaak, aan het einde van de nacht",
                bijbelplaats: "Matteüs 14:25",
                uitleg: `In Jezus' tijd verdeelden de Romeinen de nacht in vier 'nachtwaken'. Zo wisten de wachters wanneer ze elkaar moesten aflossen. De nacht liep van zonsondergang tot zonsopgang, en die werd in vier gelijke stukken verdeeld — in de winter waren die stukken dus wat langer dan in de zomer.

Rond de lente, de tijd waarin dit verhaal speelt, kwam het ongeveer hierop neer:
1e nachtwaak: 18.00 – 21.00 uur
2e nachtwaak: 21.00 – 24.00 uur
3e nachtwaak: 24.00 – 3.00 uur
4e nachtwaak: 3.00 – 6.00 uur

Jezus kwam dus in de vierde nachtwaak over het water lopen: helemaal aan het einde van de nacht, vlak voordat het licht werd.`
            },
            {
                vraag: "Welke lengtemaat gebruikt Jezus in de Bergrede, als hij zegt dat niemand door bezorgdheid iets aan zijn leven kan toevoegen?",
                antwoorden: ["Een el", "Een stadie", "Een mijl", "Een voet"],
                correct: "Een el",
                bijbelplaats: "Matteüs 6:27"
            },
            {
                vraag: "Een denarie was een Romeinse zilveren munt. Hoeveel was die ongeveer waard?",
                antwoorden: ["Het loon voor één dag werk", "Het loon voor één uur", "Het loon voor één jaar", "Niets, het was de kleinste munt"],
                correct: "Het loon voor één dag werk",
                bijbelplaats: "Matteüs 20:2"
            },
            {
                vraag: "Ongeveer hoeveel daglonen was één talent waard?",
                antwoorden: ["Ongeveer 10 daglonen", "Ongeveer 100 daglonen", "Ongeveer 6000 daglonen", "Ongeveer 1000 daglonen"],
                correct: "Ongeveer 6000 daglonen",
                bijbelplaats: "Matteüs 25:15"
            },
            {
                vraag: "In de gelijkenis van het zuurdesem mengt een vrouw zuurdesem door 'drie maten' (sata) meel. Wat valt op aan die hoeveelheid?",
                antwoorden: ["Het was een heel grote hoeveelheid, genoeg om voor heel veel mensen brood te bakken", "Het was ongeveer precies de hoeveelheid meel die een gewoon gezin op één hele dag opat", "Het was precies genoeg voor één broodje", "Het was te weinig om brood van te bakken"],
                correct: "Het was een heel grote hoeveelheid, genoeg om voor heel veel mensen brood te bakken",
                bijbelplaats: "Matteüs 13:33"
            },
            {
                vraag: "Jozef was op aarde de vader van Jezus. Maar wie was Jozefs eigen vader — dus de opa van Jezus van vaderskant?",
                antwoorden: ["Jakob", "Mattan", "Eleazar", "Achim"],
                correct: "Jakob",
                bijbelplaats: "Matteüs 1:16",
                uitleg: "Jakob! In het evangelie van Matteüs staat: \"Jakob was de vader van Jozef.\" En Jozef was de man van Maria. Jozef was niet de biologische vader van Jezus, maar door God uitgekozen om zijn vader op aarde te zijn."
            }
        ]
    },
    "Marcus": {
        beginner: [
            {
                vraag: "Wie doopte Jezus in de rivier de Jordaan?",
                antwoorden: ["Jozef", "Johannes de Doper", "Mozes", "Zacharias"],
                correct: "Johannes de Doper",
                bijbelplaats: "Marcus 1:9"
            },
            {
                vraag: "Met wie eet Jezus aan tafel, tot afkeer van de Farizeeën?",
                antwoorden: ["Met de Sadduceeën", "Met tollenaars en zondaars", "Met priesters", "Met soldaten"],
                correct: "Met tollenaars en zondaars",
                bijbelplaats: "Marcus 2:15-16"
            },
            {
                vraag: "Hoeveel apostelen koos Jezus uit om hem te vergezellen?",
                antwoorden: ["7", "10", "12", "40"],
                correct: "12",
                bijbelplaats: "Marcus 3:13-19"
            },
            {
                vraag: "Wat deed Jezus met het dochtertje van Jaïrus, dat was overleden?",
                antwoorden: ["Hij begroef haar", "Hij nam haar bij de hand en zei 'Talita koemi' (Meisje, sta op) en ze stond op", "Hij gaf haar medicijnen", "Hij pakte haar bij de hand en beloofde dat de dokters haar snel beter zouden maken"],
                correct: "Hij nam haar bij de hand en zei 'Talita koemi' (Meisje, sta op) en ze stond op",
                bijbelplaats: "Marcus 5:41-42"
            },
            {
                vraag: "Wat deed Jezus toen mensen kinderen bij hem brachten en de leerlingen dat wilden tegenhouden?",
                antwoorden: ["Hij liet hen wegsturen", "Hij omarmde de kinderen en zegende hen", "Hij gaf de leerlingen gelijk", "Hij stuurde de kinderen weg om verder te kunnen preken"],
                correct: "Hij omarmde de kinderen en zegende hen",
                bijbelplaats: "Marcus 10:13-16"
            },
            {
                vraag: "Op welk dier reed Jezus toen hij Jeruzalem binnenkwam?",
                antwoorden: ["Een paard", "Een kameel", "Een veulen van een ezel", "Een groot wit strijdpaard"],
                correct: "Een veulen van een ezel",
                bijbelplaats: "Marcus 11:7",
                uitleg: "Een koning die ten oorlog trok kwam meestal op een paard. Jezus koos bewust een ezel — een teken van vrede. Zo liet hij zien wat voor koning hij wilde zijn."
            },
            {
                vraag: "Wat deed Jezus in de tempel in Jeruzalem, kort na zijn intocht, wat ophef veroorzaakte?",
                antwoorden: ["Hij ging stil bidden", "Hij joeg de geldwisselaars en duivenverkopers eruit", "Hij gaf een lange toespraak", "Hij deelde brood en geld uit aan alle arme mensen daar"],
                correct: "Hij joeg de geldwisselaars en duivenverkopers eruit",
                bijbelplaats: "Marcus 11:15-17"
            },
            {
                vraag: "Wat at en dronk Jezus met zijn leerlingen tijdens het laatste avondmaal, met de woorden 'Dit is mijn lichaam' en 'Dit is mijn bloed'?",
                antwoorden: ["Brood en wijn", "Vis en water", "Vijgen en honing", "Druiven en olie"],
                correct: "Brood en wijn",
                bijbelplaats: "Marcus 14:22-24"
            },
            {
                vraag: "Waar werd Jezus gekruisigd, volgens Marcus?",
                antwoorden: ["Op de Olijfberg", "Op Golgota, wat 'schedelplaats' betekent", "In de tuin van Getsemane bij de olijfbomen", "Bij de Jordaan"],
                correct: "Op Golgota, wat 'schedelplaats' betekent",
                bijbelplaats: "Marcus 15:22"
            }
        ],
        advanced: [
            {
                vraag: "Wat zei Petrus toen Jezus aan zijn leerlingen vroeg wie hij volgens hen was?",
                antwoorden: ["U bent een profeet", "U bent de messias", "U bent Mozes' opvolger", "U bent de zoon van Jozef"],
                correct: "U bent de messias",
                bijbelplaats: "Marcus 8:29"
            },
            {
                vraag: "Wat zei Jezus dat iemand moet doen die hem wil volgen?",
                antwoorden: ["Veel bezit verzamelen", "Zichzelf verloochenen en zijn kruis op zich nemen", "Op een berg gaan wonen", "Elke dag naar de tempel in Jeruzalem gaan om daar te bidden"],
                correct: "Zichzelf verloochenen en zijn kruis op zich nemen",
                bijbelplaats: "Marcus 8:34"
            },
            {
                vraag: "Wat deden de leerlingen toen Jezus over het water op hen toe kwam?",
                antwoorden: ["Ze sprongen overboord en zwommen naar Jezus toe", "Ze schreeuwden van angst, want ze dachten dat het een spook was", "Ze roeiden zo hard mogelijk de andere kant op", "Ze schreeuwden naar hem en vroegen wie hij was"],
                correct: "Ze schreeuwden van angst, want ze dachten dat het een spook was",
                bijbelplaats: "Marcus 6:49-50"
            },
            {
                vraag: "Wat antwoordde Jezus toen iemand hem vroeg wat het belangrijkste gebod was?",
                antwoorden: ["Heb de Heer uw God lief met heel uw hart en uw naaste als uzelf", "Houd je aan alle voorschriften over rein en onrein voedsel", "Eer uw vader en moeder", "Houd de sabbat heilig"],
                correct: "Heb de Heer uw God lief met heel uw hart en uw naaste als uzelf",
                bijbelplaats: "Marcus 12:29-31"
            },
            {
                vraag: "Wat deed Jezus met een vijgenboom die geen vruchten droeg, vlak voor de tempelreiniging?",
                antwoorden: ["Hij plukte er bladeren af", "Hij vervloekte hem waarna de boom verdorde", "Hij plantte er een nieuwe boom naast die wél vruchten droeg", "Hij liet hem met rust"],
                correct: "Hij vervloekte hem waarna de boom verdorde",
                bijbelplaats: "Marcus 11:12-14, 20-21"
            },
            {
                vraag: "Wat zag Jezus een arme weduwe in de tempel doen, wat hij prees als groter dan wat alle rijken gaven?",
                antwoorden: ["Ze bad lang", "Ze gaf twee penningen, alles wat ze had", "Ze zong vaak mooie liederen in de tempel", "Ze maakte de tempel schoon"],
                correct: "Ze gaf twee penningen, alles wat ze had",
                bijbelplaats: "Marcus 12:41-44",
                uitleg: "Twee penningen waren samen maar heel weinig waard — omgerekend zo'n anderhalf tot twee euro. Eén zo'n muntje was het allerkleinste dat er was. Toch prees Jezus haar het meest, want de rijken gaven van hun overvloed, maar zij gaf alles wat ze had."
            },
            {
                vraag: "Welke leerling sprak Jezus rechtstreeks aan toen hij zijn leerlingen in Getsemane slapend aantrof?",
                antwoorden: ["Judas", "Petrus", "Tomas", "Johannes"],
                correct: "Petrus",
                bijbelplaats: "Marcus 14:37"
            },
            {
                vraag: "Op welk uur van de dag werd het donker terwijl Jezus aan het kruis hing, volgens Marcus?",
                antwoorden: ["Vanaf het derde uur (9 uur 's morgens)", "Vanaf het zesde uur (12 uur 's middags)", "Vanaf het negende uur (3 uur 's middags)", "Vanaf zonsondergang"],
                correct: "Vanaf het zesde uur (12 uur 's middags)",
                bijbelplaats: "Marcus 15:33",
                uitleg: `In Jezus' tijd telde men de uren van de dag vanaf zonsopgang. Het eerste uur begon dus zodra het licht werd, en de twaalf uren liepen door tot zonsondergang. Het zesde uur is daarmee het middelste uur van de dag: rond de middag.

Jezus werd gekruisigd rond het Pesachfeest, in het voorjaar. Dag en nacht zijn dan bijna even lang, dus het zesde uur viel toen inderdaad rond 12 uur 's middags. De duisternis hield aan tot het negende uur: ongeveer 3 uur 's middags.`
            },
            {
                vraag: "Wat zei de Romeinse hoofdman die bij het kruis stond, toen Jezus stierf?",
                antwoorden: ["Hij was een goed mens", "Werkelijk deze mens was Gods Zoon", "Wat een trieste dag", "Dit was vast een groot profeet uit vroeger tijden"],
                correct: "Werkelijk deze mens was Gods Zoon",
                bijbelplaats: "Marcus 15:39"
            },
            {
                vraag: "Wat gebeurde er nadat Jezus de wind en de golven had toegesproken?",
                antwoorden: ["De storm ging liggen, maar pas na een uur", "Het werd meteen helemaal stil op het meer", "De regen hield op, maar de wind bleef waaien", "De boot werd toch omvergeblazen en ze vielen in het water"],
                correct: "Het werd meteen helemaal stil op het meer",
                bijbelplaats: "Marcus 4:39"
            }
        ],
        expert: [
            {
                vraag: "Wat is een opvallend woord dat in het evangelie van Marcus heel vaak voorkomt, en dat de snelheid van zijn verhaal aangeeft?",
                antwoorden: ["Vrede", "Meteen (of terstond)", "Wacht", "Dat mag je niet doen"],
                correct: "Meteen (of terstond)",
                bijbelplaats: "Marcus 1:10, 1:18 en vele andere plaatsen"
            },
            {
                vraag: "Waar begint het Marcus-evangelie mee?",
                antwoorden: ["Het begin van het verhaal van Jezus", "Het begin van het evangelie van Jezus Christus de Zoon van God", "Het geslachtsregister van Jezus, helemaal terug tot aan koning David", "Lang geleden"],
                correct: "Het begin van het evangelie van Jezus Christus de Zoon van God",
                bijbelplaats: "Marcus 1:1"
            },
            {
                vraag: "Jezus wekte het dochtertje van Jaïrus op. Hoe oud was dit meisje?",
                antwoorden: ["Vijf jaar", "Twaalf jaar", "Zestien jaar", "Acht jaar"],
                correct: "Twaalf jaar",
                bijbelplaats: "Marcus 5:42"
            },
            {
                vraag: "Hoe noemde de bezetene in het gebied van de Gerasenen de demonen die in hem zaten?",
                antwoorden: ["Wij zijn de heersers van heel dit gebied", "Legioen want we zijn met velen", "Storm", "Beëlzebul"],
                correct: "Legioen want we zijn met velen",
                bijbelplaats: "Marcus 5:9"
            },
            {
                vraag: "Welke gelijkenis vertelde Jezus over een man die zaad zaaide op vier verschillende soorten grond?",
                antwoorden: ["De gelijkenis van de verloren zoon", "De gelijkenis van de zaaier", "De gelijkenis van de talenten", "De gelijkenis van de wijngaard"],
                correct: "De gelijkenis van de zaaier",
                bijbelplaats: "Marcus 4:3-9"
            },
            {
                vraag: "Marcus opent met een citaat dat hij toeschrijft aan de profeet Jesaja. De regel 'een stem roept in de woestijn, maak de weg van de Heer gereed' komt inderdaad uit Jesaja. Maar de andere regel — 'Ik zend mijn bode voor je uit, hij zal een weg voor je banen' — komt uit een ander Bijbelboek. Welk?",
                antwoorden: ["Jeremia", "Maleachi", "Daniël", "Ezechiël"],
                correct: "Maleachi",
                bijbelplaats: "Marcus 1:2-3 (samengesteld uit Maleachi 3:1 en Jesaja 40:3)"
            },
            {
                vraag: "Komen Lazarus en zijn zusters Marta en Maria voor in het Marcus-evangelie?",
                antwoorden: ["Ja, alle drie komen ze meerdere keren in het Marcus-evangelie voor", "Alleen Lazarus", "Alleen Marta en Maria", "Nee, ze komen niet in Marcus voor (wel in Lucas en Johannes)"],
                correct: "Nee, ze komen niet in Marcus voor (wel in Lucas en Johannes)",
                bijbelplaats: "Lucas 10:38-42 · Johannes 11"
            },
            {
                vraag: "Welk Aramees woord sprak Jezus uit toen hij het dochtertje van Jaïrus opwekte uit de dood?",
                antwoorden: ["Korban", "Talita koemi (Meisje, sta op)", "Effata", "Maranata"],
                correct: "Talita koemi (Meisje, sta op)",
                bijbelplaats: "Marcus 5:41"
            },
            {
                vraag: "Welke drie leerlingen nam Jezus mee de berg op bij zijn verheerlijking, en ook mee naar Getsemane?",
                antwoorden: ["Petrus, Andreas en Filippus", "Petrus, Jakobus en Johannes", "Petrus, Johannes en Matteüs", "Jakobus, Johannes en Tomas"],
                correct: "Petrus, Jakobus en Johannes",
                bijbelplaats: "Marcus 9:2 en 14:33"
            },
            {
                vraag: "Jezus riep aan het kruis in zijn eigen taal: 'Eloï, Eloï, lema sabachtani.' Wat betekenen deze woorden?",
                antwoorden: ["In uw handen leg ik mijn geest, o hemelse Vader", "Mijn God, mijn God, waarom hebt U mij verlaten?", "Geprezen zij Uw heilige naam", "Vergeef ons onze schulden"],
                correct: "Mijn God, mijn God, waarom hebt U mij verlaten?",
                bijbelplaats: "Marcus 15:34"
            },
            {
                vraag: "Met welke munt liet Jezus de strikvraag over belasting aan de keizer beantwoorden — de munt met de afbeelding van de keizer erop?",
                antwoorden: ["Een denarie", "Een talent", "Een pond", "Een penning"],
                correct: "Een denarie",
                bijbelplaats: "Marcus 12:15-16"
            },
            {
                vraag: "De arme weduwe gooide twee van de allerkleinste muntjes in de offerkist. Hoe heetten die muntjes?",
                antwoorden: ["Denarie", "Penningen (lepta)", "Ponden", "Talenten"],
                correct: "Penningen (lepta)",
                bijbelplaats: "Marcus 12:42"
            },
            {
                vraag: "De Romeinen verdeelden de nacht in 'nachtwaken'. In hoeveel wachten, en hoe lang duurde elk ongeveer?",
                antwoorden: ["Vier wachten van elk ongeveer drie uur", "Drie wachten van elk ongeveer vier uur", "Twee wachten van elk ongeveer zes uur", "Zes wachten van elk ongeveer twee uur"],
                correct: "Vier wachten van elk ongeveer drie uur",
                bijbelplaats: "Marcus 13:35",
                uitleg: `De Romeinen verdeelden de nacht — van zonsondergang tot zonsopgang — in vier gelijke stukken, de 'nachtwaken'. Zo wisten de wachters wanneer ze elkaar moesten aflossen.

Omdat de nacht in de winter langer is dan in de zomer, duurde een nachtwaak niet altijd even lang: in de winter bijna drieënhalf uur, in de zomer nog geen tweeënhalf. Gemiddeld over het jaar kwam het uit op ongeveer drie uur.

Later in Marcus noemt Jezus deze vier wachten stuk voor stuk, als beeld voor waakzaam blijven.`
            },
            {
                vraag: "Hoe lang was Israël in de tijd van de Bijbel ongeveer van noord naar zuid?",
                antwoorden: ["Ongeveer 120 kilometer", "Ongeveer 400 kilometer", "Ongeveer 240 kilometer", "Ongeveer 750 kilometer"],
                correct: "Ongeveer 240 kilometer",
                uitleg: "Israël was in de tijd van de Bijbel verrassend klein. Van het noorden (de stad Dan) tot het zuiden (de stad Berseba) was het ongeveer 240 kilometer — in de Bijbel heet dat \"van Dan tot Berseba\". Van west naar oost, van de zee tot de Jordaan, was het nog veel smaller: soms maar 50 tot 90 kilometer. Je kon het dus in een paar dagen te voet doorkruisen. Daardoor kon Jezus in zijn leven veel verschillende plaatsen bezoeken."
            },
            {
                vraag: "In de Bijbel lezen we dat Jezus soms een hoge berg opging. Wat is de hoogste berg van Israël?",
                antwoorden: ["De berg Tabor", "De berg Sinaï, in de woestijn van Egypte", "De berg Hermon", "De Olijfberg"],
                correct: "De berg Hermon",
                uitleg: "De hoogste berg in het noorden van Israël is de Hermon, ongeveer 2.800 meter hoog — zo hoog dat er zelfs sneeuw op ligt. De andere bergen zijn veel lager. De berg Tabor, die vaak bij het verhaal van de gedaanteverandering wordt genoemd, is maar ongeveer 575 meter. De Olijfberg bij Jeruzalem, bekend van Palmpasen en de hof van Getsemane, is nog lager: ongeveer 800 meter, maar hij steekt maar zo'n honderd meter boven de stad uit. En de beroemde berg Sinaï, waar Mozes de tien geboden kreeg, is met ongeveer 2.300 meter ook hoog. Wel is niet helemaal zeker welke berg de echte Sinaï is; meestal wordt de Jebel Musa in de Sinaï-woestijn aangewezen. In elk geval ligt die berg niet in Israël zelf, maar ver weg in de woestijn."
            }
        ]
    },
    "Lucas": {
        beginner: [
            {
                vraag: "Welke engel kondigde aan Maria aan dat zij de moeder van Jezus zou worden?",
                antwoorden: ["Michaël", "Gabriël", "Rafaël", "Uriël"],
                correct: "Gabriël",
                bijbelplaats: "Lucas 1:26-28"
            },
            {
                vraag: "Wie was de oude priester die hoorde dat hij en zijn vrouw Elisabet op hun oude dag een zoon zouden krijgen, Johannes de Doper?",
                antwoorden: ["Zacharias", "Simeon", "Eli", "Aäron"],
                correct: "Zacharias",
                bijbelplaats: "Lucas 1:5-13"
            },
            {
                vraag: "Hoe heette de moeder van Johannes de Doper, een familielid van Maria?",
                antwoorden: ["Marta", "Hanna", "Elisabet", "Salome"],
                correct: "Elisabet",
                bijbelplaats: "Lucas 1:36"
            },
            {
                vraag: "Waarom moesten Jozef en Maria naar Betlehem reizen volgens Lucas?",
                antwoorden: ["Voor een bruiloft", "Voor een volkstelling die keizer Augustus had bevolen", "Op vakantie", "Voor het grote jaarlijkse feest in de tempel van Jeruzalem"],
                correct: "Voor een volkstelling die keizer Augustus had bevolen",
                bijbelplaats: "Lucas 2:1-5"
            },
            {
                vraag: "Waarin werd het pasgeboren kindje Jezus gelegd?",
                antwoorden: ["In een wieg", "Op een bed", "In een voederbak (kribbe)", "In een mooi versierd houten wiegje"],
                correct: "In een voederbak (kribbe)",
                bijbelplaats: "Lucas 2:7"
            },
            {
                vraag: "Aan wie verschenen de engelen om als eersten te vertellen dat Jezus geboren was?",
                antwoorden: ["Aan koningen", "Aan priesters", "Aan herders in het veld", "Aan vissers aan de oever van een meer"],
                correct: "Aan herders in het veld",
                bijbelplaats: "Lucas 2:8-14"
            },
            {
                vraag: "Wat deed Jezus toen hij twaalf jaar oud was, en zijn ouders hem na drie dagen zoeken terugvonden in Jeruzalem?",
                antwoorden: ["Hij hielp in een winkel", "Hij zat in de tempel tussen de leraren, hij luisterde en stelde vragen", "Hij hielp een timmerman in zijn werkplaats met het zagen en schaven van hout", "Hij speelde met andere kinderen"],
                correct: "Hij zat in de tempel tussen de leraren, hij luisterde en stelde vragen",
                bijbelplaats: "Lucas 2:41-47"
            },
            {
                vraag: "Wat gebeurde er toen Simon (Petrus) op aanwijzing van Jezus zijn netten uitwierp na een nacht zonder vangst?",
                antwoorden: ["Ze vingen weer helemaal niets, precies zoals de hele nacht ervoor", "Ze vingen zoveel vissen dat de netten dreigden te scheuren", "Ze vingen alleen kleine visjes", "Ze vingen één heel grote vis"],
                correct: "Ze vingen zoveel vissen dat de netten dreigden te scheuren",
                bijbelplaats: "Lucas 5:1-7"
            },
            {
                vraag: "Welke gelijkenis vertelde Jezus over een man uit Samaria die een gewonde reiziger hielp die door rovers was overvallen?",
                antwoorden: ["De verloren zoon", "De barmhartige Samaritaan", "De rijke man en Lazarus", "De zaaier"],
                correct: "De barmhartige Samaritaan",
                bijbelplaats: "Lucas 10:30-37"
            },
            {
                vraag: "Bij welke twee zussen kwam Jezus op bezoek, waarbij Marta druk in de weer was en Maria aan zijn voeten zat te luisteren?",
                antwoorden: ["Lea en Rachel", "Marta en Maria", "Hanna en Naomi", "Mirjam en Sara"],
                correct: "Marta en Maria",
                bijbelplaats: "Lucas 10:38-42"
            }
        ],
        advanced: [
            {
                vraag: "Hoe heette de oude man in de tempel die het kindje Jezus in zijn armen nam en God prees?",
                antwoorden: ["Zacharias", "Simeon", "Mozes", "Aäron"],
                correct: "Simeon",
                bijbelplaats: "Lucas 2:25-32"
            },
            {
                vraag: "Welke gelijkenis vertelde Jezus over een jongste zoon die zijn erfdeel opmaakte en uiteindelijk terugkeerde naar zijn vader?",
                antwoorden: ["De verloren zoon", "De barmhartige Samaritaan", "De rijke dwaas", "De talenten"],
                correct: "De verloren zoon",
                bijbelplaats: "Lucas 15:11-32"
            },
            {
                vraag: "Wat deed de vader in de gelijkenis van de verloren zoon toen hij zijn zoon zag terugkomen?",
                antwoorden: ["Hij weigerde hem binnen te laten", "Hij rende hem tegemoet, omhelsde hem en kuste hem", "Hij vroeg eerst waar al het geld was gebleven", "Hij stuurde hem weg"],
                correct: "Hij rende hem tegemoet, omhelsde hem en kuste hem",
                bijbelplaats: "Lucas 15:20"
            },
            {
                vraag: "Wat liet de vader doen toen de verloren zoon thuiskwam?",
                antwoorden: ["Hij gaf hem werk", "Hij liet het gemeste kalf slachten en hield een feestmaal", "Hij gaf iedereen de opdracht om hem te negeren", "Hij stuurde hem terug waar hij vandaan gekomen was"],
                correct: "Hij liet het gemeste kalf slachten en hield een feestmaal",
                bijbelplaats: "Lucas 15:23"
            },
            {
                vraag: "Hoe reageerde de oudste broer toen hij hoorde dat zijn jongere broer was teruggekomen?",
                antwoorden: ["Hij was blij", "Hij was boos en wilde niet naar binnen gaan", "Hij was verbaasd en kon het niet geloven dat hij terug was", "Hij ging weg"],
                correct: "Hij was boos en wilde niet naar binnen gaan",
                bijbelplaats: "Lucas 15:28"
            },
            {
                vraag: "Hoe heette de kleine tollenaar die in een boom klom om Jezus te kunnen zien?",
                antwoorden: ["Bartimeüs", "Zacheüs", "Levi", "Nikodemus"],
                correct: "Zacheüs",
                bijbelplaats: "Lucas 19:1-4"
            },
            {
                vraag: "Wat deed Zacheüs nadat Jezus bij hem te gast was geweest?",
                antwoorden: ["Hij gaf de helft van zijn bezit aan de armen en betaalde vier keer terug aan wie hij had afgeperst", "Hij beloofde plechtig beterschap, maar hield stiekem toch al zijn afgeperste geld gewoon voor zichzelf", "Hij hield alles voor zichzelf", "Hij werd priester"],
                correct: "Hij gaf de helft van zijn bezit aan de armen en betaalde vier keer terug aan wie hij had afgeperst",
                bijbelplaats: "Lucas 19:8"
            },
            {
                vraag: "Wat zei Jezus tegen één van de misdadigers die naast hem was gekruisigd en die om hem vroeg?",
                antwoorden: ["Vandaag zul je met mij in het paradijs zijn", "Je krijgt wat je verdiend hebt", "Vraag het straks maar aan God zelf, niet aan mij", "Daar kan ik nu niets aan doen"],
                correct: "Vandaag zul je met mij in het paradijs zijn",
                bijbelplaats: "Lucas 23:43"
            },
            {
                vraag: "Wat gebeurde er toen twee leerlingen op weg waren naar het dorp Emmaüs, na de opstanding?",
                antwoorden: ["Ze zagen in de verte twee engelen die hun de weg naar huis wezen", "Jezus zelf kwam met hen meelopen, maar ze herkenden hem pas toen hij het brood brak", "Ze raakten verdwaald", "Ze kwamen Petrus tegen"],
                correct: "Jezus zelf kwam met hen meelopen, maar ze herkenden hem pas toen hij het brood brak",
                bijbelplaats: "Lucas 24:13-31"
            },
            {
                vraag: "In de gelijkenis van de barmhartige Samaritaan: wie kwamen er als eerste langs de gewonde man maar hielpen hem niet?",
                antwoorden: ["Een priester en een Leviet", "Een koning en een soldaat", "Een tollenaar en een visser", "Twee herders"],
                correct: "Een priester en een Leviet",
                bijbelplaats: "Lucas 10:31-32"
            }
        ],
        expert: [
            {
            vraag: "Lucas begint zijn evangelie met een korte opdracht aan een man die Theofilus heet. Daarin legt hij uit waarom hij dit boek geschreven heeft: hij heeft alles zorgvuldig nagegaan en met ooggetuigen gesproken. Wat wilde Lucas daarmee bereiken?",
            antwoorden: ["Dat Theofilus zeker zou weten dat wat hij geleerd had betrouwbaar is", "Dat Theofilus hem rijk zou belonen voor al het werk dat hij had gedaan", "Dat Theofilus het boek zou voorlezen in de tempel", "Dat Theofilus zelf ook een evangelie zou schrijven"],
            correct: "Dat Theofilus zeker zou weten dat wat hij geleerd had betrouwbaar is",
            bijbelplaats: "Lucas 1:1-4"
        },
            {
                vraag: "Hoe heet de beroemde lofzang van Maria, waarin zij God prijst nadat de engel haar de geboorte van Jezus had aangekondigd?",
                antwoorden: ["Het Benedictus", "Het Magnificat", "Het Nunc Dimittis", "Het Gloria"],
                correct: "Het Magnificat",
                bijbelplaats: "Lucas 1:46-55"
            },
            {
                vraag: "Hoe heet de lofzang van Zacharias, die hij uitsprak toen zijn tong weer losliet bij de geboorte van zijn zoon Johannes?",
                antwoorden: ["Het Benedictus", "Het Magnificat", "Het Te Deum", "Het Sanctus"],
                correct: "Het Benedictus",
                bijbelplaats: "Lucas 1:67-79"
            },
            {
                vraag: "Hoe heet de lofzang van Simeon, die hij uitsprak toen hij het kindje Jezus in zijn armen had?",
                antwoorden: ["Het Magnificat", "Het Benedictus", "Het Nunc Dimittis", "Het Te Deum"],
                correct: "Het Nunc Dimittis",
                bijbelplaats: "Lucas 2:29-32"
            },
            {
                vraag: "Wat overkwam Zacharias toen hij de engel Gabriël niet geloofde over de geboorte van zijn zoon?",
                antwoorden: ["Hij werd blind", "Hij kon niet meer spreken tot zijn zoon werd geboren", "Hij viel flauw", "Hij kon niet meer horen totdat het kind een naam had gekregen"],
                correct: "Hij kon niet meer spreken tot zijn zoon werd geboren",
                bijbelplaats: "Lucas 1:18-22"
            },
            {
                vraag: "Welke profeet wordt geciteerd over Johannes de Doper, die 'een stem die roept in de woestijn' is?",
                antwoorden: ["Mozes", "Jesaja", "Daniël", "Elia"],
                correct: "Jesaja",
                bijbelplaats: "Lucas 3:4-6"
            },
            {
                vraag: "Het geslachtsregister in Lucas gaat verder terug dan dat in Matteüs. Tot wie gaat het terug?",
                antwoorden: ["Tot Abraham", "Tot David", "Tot Adam", "Tot Noach"],
                correct: "Tot Adam",
                bijbelplaats: "Lucas 3:23-38"
            },
            {
                vraag: "Hoeveel andere leerlingen, naast de twaalf apostelen, zond Jezus uit, twee aan twee, om hem voor te gaan?",
                antwoorden: ["24", "40", "72", "100"],
                correct: "72",
                bijbelplaats: "Lucas 10:1",
                uitleg: "Sommige heel oude handschriften zeggen \"zeventig\", andere \"tweeënzeventig\". Daarom staat het in de ene Bijbel net iets anders dan in de andere: in de Nieuwe Bijbelvertaling en in de katholieke traditie lees je 72, en in de Statenvertaling 70. De getallen liggen zó dicht bij elkaar dat beide goed zijn."
            },
            {
                vraag: "Hoe heette de bedelaar in de gelijkenis over de rijke man, die in de schoot van Abraham terechtkwam?",
                antwoorden: ["Bartimeüs", "Lazarus", "Zacheüs", "Simeon"],
                correct: "Lazarus",
                bijbelplaats: "Lucas 16:20"
            },
            {
                vraag: "Hoeveel melaatsen genas Jezus tegelijk, waarvan er maar één terugkwam om God te danken (een Samaritaan)?",
                antwoorden: ["5", "7", "10", "12"],
                correct: "10",
                bijbelplaats: "Lucas 17:11-19"
            },
            {
                vraag: "Hoeveel geld gaf de barmhartige Samaritaan aan de waard om voor de gewonde man te zorgen?",
                antwoorden: ["Eén denarie", "Twee denarie", "Tien denarie", "Honderd denarie"],
                correct: "Twee denarie",
                bijbelplaats: "Lucas 10:35"
            },
            {
                vraag: "In de gelijkenis van de ponden geeft een edelman zijn dienaren geld om mee te handelen. Welke geldmaat deelde hij uit?",
                antwoorden: ["Een talent", "Een pond (mina)", "Een denarie", "Een penning"],
                correct: "Een pond (mina)",
                bijbelplaats: "Lucas 19:13"
            },
            {
                vraag: "Hoe ver lag het dorp Emmaüs van Jeruzalem, volgens Lucas?",
                antwoorden: ["Tien stadiën", "Zestig stadiën", "Honderd stadiën", "Tweehonderd stadiën"],
                correct: "Zestig stadiën",
                bijbelplaats: "Lucas 24:13"
            },
            {
                vraag: "In de gelijkenis van de onrechtvaardige rentmeester laat de rentmeester twee schuldenaren hun schuld verlagen. Waarin waren die schulden uitgedrukt?",
                antwoorden: ["Goud en zilver", "Olie en tarwe", "Wijn en brood", "Geld en land"],
                correct: "Olie en tarwe",
                bijbelplaats: "Lucas 16:6-7"
            },
            {
                vraag: "In de gelijkenis van de ponden deelt een edelman 'ponden' (mina) uit. Hoeveel daglonen was één pond waard?",
                antwoorden: ["Ongeveer 100 daglonen", "Ongeveer 6000 daglonen", "Eén dagloon", "Ongeveer 1000 daglonen"],
                correct: "Ongeveer 100 daglonen",
                bijbelplaats: "Lucas 19:13"
            },
            {
                vraag: "Een 'stadie' was een afstandsmaat. Ongeveer hoe lang was één stadie?",
                antwoorden: ["Ongeveer 10 meter", "Ongeveer 185 meter", "Ongeveer 1 kilometer", "Ongeveer 5 kilometer"],
                correct: "Ongeveer 185 meter",
                bijbelplaats: "Lucas 24:13"
            },
            {
                vraag: "In de gelijkenis van de onrechtvaardige rentmeester was iemand 'honderd vat (bato) olie' schuldig. Ongeveer hoeveel liter was één vat?",
                antwoorden: ["Ongeveer 1 liter", "Ongeveer 22 liter", "Ongeveer 100 liter", "Ongeveer 1000 liter"],
                correct: "Ongeveer 22 liter",
                bijbelplaats: "Lucas 16:6"
            },
            {
                vraag: "Een 'kor' was de grootste inhoudsmaat in de gelijkenissen. Hoe groot was die ongeveer?",
                antwoorden: ["Ongeveer tien keer zo groot als een vat", "Ongeveer even groot als een vat", "Kleiner dan een vat", "Ongeveer honderd keer zo groot als een vat"],
                correct: "Ongeveer tien keer zo groot als een vat",
                bijbelplaats: "Lucas 16:7"
            }
        ]
    },
    "Johannes": {
        beginner: [
            {
                vraag: "Hoe noemde Johannes de Doper Jezus toen hij hem zag aankomen?",
                antwoorden: ["De koning der Joden", "Het Lam van God dat de zonde van de wereld wegneemt", "De grote profeet die door Mozes lang geleden was beloofd", "De rabbi"],
                correct: "Het Lam van God dat de zonde van de wereld wegneemt",
                bijbelplaats: "Johannes 1:29"
            },
            {
                vraag: "Bij welke gelegenheid veranderde Jezus water in wijn?",
                antwoorden: ["Bij een begrafenis", "Bij een bruiloft in Kana", "In de tempel", "Bij een feest in Jeruzalem"],
                correct: "Bij een bruiloft in Kana",
                bijbelplaats: "Johannes 2:1-11"
            },
            {
                vraag: "Met wie sprak Jezus bij een waterput in Samaria?",
                antwoorden: ["Een Samaritaanse vrouw", "Maria", "Marta", "De moeder van Johannes de Doper"],
                correct: "Een Samaritaanse vrouw",
                bijbelplaats: "Johannes 4:5-26"
            },
            {
                vraag: "Wat deed Jezus voor de man die al vanaf zijn geboorte blind was?",
                antwoorden: ["Hij luisterde naar wat de man te zeggen had", "Hij genas hem zodat hij kon zien", "Hij stuurde hem naar de tempel", "Hij liep door"],
                correct: "Hij genas hem zodat hij kon zien",
                bijbelplaats: "Johannes 9:1-7"
            },
            {
                vraag: "Van wie waren de vijf broden en twee vissen die Jezus gebruikte om de vijfduizend te voeden?",
                antwoorden: ["Van een jongen", "Van een priester", "Van een visser", "Van Petrus"],
                correct: "Van een jongen",
                bijbelplaats: "Johannes 6:9"
            },
            {
                vraag: "Welke vriend van Jezus uit Betanië werd door Jezus opgewekt nadat hij al vier dagen in het graf lag?",
                antwoorden: ["Petrus", "Lazarus", "Johannes", "Nikodemus"],
                correct: "Lazarus",
                bijbelplaats: "Johannes 11:1-44"
            },
            {
                vraag: "Wat zagen de leerlingen Jezus doen toen zij 's avonds in de boot het meer overstaken?",
                antwoorden: ["Vissen vangen", "Over het water lopen", "Slapen aan de oever", "In een andere boot stappen"],
                correct: "Over het water lopen",
                bijbelplaats: "Johannes 6:16-21"
            },
            {
                vraag: "Welke leerling protesteerde tegen het feit dat Jezus zijn voeten wilde wassen?",
                antwoorden: ["Judas", "Petrus", "Tomas", "Andreas"],
                correct: "Petrus",
                bijbelplaats: "Johannes 13:6-8"
            }
        ],
        advanced: [
            {
                vraag: "Hoe begint het evangelie van Johannes?",
                antwoorden: ["Met de geboorte van Jezus", "Met de woorden 'In het begin was het Woord'", "Met een geslachtsregister", "Met de vlucht van Jozef en Maria naar het land Egypte"],
                correct: "Met de woorden 'In het begin was het Woord'",
                bijbelplaats: "Johannes 1:1"
            },
            {
                vraag: "Jezus belooft de Samaritaanse vrouw 'levend water'. Wat krijgt degene die daarvan drinkt?",
                antwoorden: ["Eeuwig leven", "Een lang leven op aarde", "Grote rijkdom", "Genezing van ziekten"],
                correct: "Eeuwig leven",
                bijbelplaats: "Johannes 4:13-14"
            },
            {
                vraag: "Hoeveel mensen voedde Jezus met vijf gerstebroden en twee vissen, volgens Johannes?",
                antwoorden: ["Ongeveer 1000", "Ongeveer 2000", "Ongeveer 5000", "Ongeveer 10.000"],
                correct: "Ongeveer 5000",
                bijbelplaats: "Johannes 6:1-13"
            },
            {
                vraag: "Wat zei Jezus tegen Marta voordat hij Lazarus opwekte?",
                antwoorden: ["Ik ben de weg en de waarheid", "Ik ben de opstanding en het leven", "Ik ben de goede herder", "Ik ben het licht van de wereld"],
                correct: "Ik ben de opstanding en het leven",
                bijbelplaats: "Johannes 11:25"
            },
            {
                vraag: "Wat zei Jezus dat aan zijn leerlingen kenmerkend zou zijn voor zijn volgelingen?",
                antwoorden: ["Dat ze veel bidden", "Dat ze elkaar liefhebben", "Dat ze veel kennis hebben", "Dat ze rijk zijn"],
                correct: "Dat ze elkaar liefhebben",
                bijbelplaats: "Johannes 13:34-35"
            },
            {
                vraag: "Wat beloofde Jezus aan zijn leerlingen te zenden na zijn vertrek, ook wel 'de Trooster' of 'de Pleitbezorger' genoemd?",
                antwoorden: ["Engelen", "De heilige Geest", "Een profeet", "Een nieuw boek"],
                correct: "De heilige Geest",
                bijbelplaats: "Johannes 14:16-17, 14:26"
            },
            {
                vraag: "Wat schreef Pilatus op het bordje boven het kruis, in drie talen?",
                antwoorden: ["Misdadiger", "Jezus van Nazaret, de koning van de Joden", "Gekruisigd op streng bevel van de Romeinse keizer", "De Zoon van God"],
                correct: "Jezus van Nazaret, de koning van de Joden",
                bijbelplaats: "Johannes 19:19-20"
            },
            {
                vraag: "Wat zei Jezus drie keer tegen Petrus na de opstanding bij het meer, na de wonderbaarlijke visvangst?",
                antwoorden: ["Volg mij", "Heb je mij lief? Zorg voor mijn schapen", "Vrees niet", "Ga nu de hele wijde wereld in en vertel over mij"],
                correct: "Heb je mij lief? Zorg voor mijn schapen",
                bijbelplaats: "Johannes 21:15-17"
            }
        ],
        expert: [
            {
                vraag: "Wat antwoordde Jezus toen Tomas vroeg hoe de leerlingen de weg naar de Vader konden kennen?",
                antwoorden: ["Ik ben de goede herder", "Ik ben de weg, de waarheid en het leven", "Ik ben het brood des levens", "Ik ben de opstanding en het eeuwige leven"],
                correct: "Ik ben de weg, de waarheid en het leven",
                bijbelplaats: "Johannes 14:5-6"
            },
            {
                vraag: "Hoeveel dagen lag Lazarus al in het graf toen Jezus kwam om hem op te wekken?",
                antwoorden: ["1 dag", "2 dagen", "4 dagen", "7 dagen"],
                correct: "4 dagen",
                bijbelplaats: "Johannes 11:17"
            },
            {
                vraag: "Welke leerling vroeg in de afscheidsrede: 'Heer, laat ons de Vader zien'?",
                antwoorden: ["Petrus", "Filippus", "Tomas", "Judas"],
                correct: "Filippus",
                bijbelplaats: "Johannes 14:8"
            },
            {
                vraag: "Het evangelie van Johannes beschrijft zeven bijzondere wonderen van Jezus. Welk wonder was het eerste?",
                antwoorden: ["De genezing van de blindgeborene", "De bruiloft te Kana, water in wijn", "De opwekking van Lazarus", "De wonderbaarlijke visvangst"],
                correct: "De bruiloft te Kana, water in wijn",
                bijbelplaats: "Johannes 2:1-11"
            },
            {
                vraag: "Hoeveel stenen watervaten stonden er bij de bruiloft in Kana?",
                antwoorden: ["3", "6", "7", "12"],
                correct: "6",
                bijbelplaats: "Johannes 2:6",
                uitleg: "Elk vat kon twee tot drie metreten bevatten — ongeveer 75 tot 115 liter per vat. Samen dus een enorme hoeveelheid wijn."
            },
            {
                vraag: "Hoeveel vissen telde de wonderbaarlijke vangst toen de leerlingen na de opstanding het net binnenhaalden?",
                antwoorden: ["99", "120", "153", "500"],
                correct: "153",
                bijbelplaats: "Johannes 21:11"
            },
            {
                vraag: "Wat was de bijnaam (in het Aramees: Kefas) die Jezus aan Simon Petrus gaf, toen Andreas hem bij Jezus bracht?",
                antwoorden: ["De rots", "De vurige", "De zoon van Zebedeüs", "De visser"],
                correct: "De rots",
                bijbelplaats: "Johannes 1:42"
            },
            {
                vraag: "Hoe heette de man bij het bad van Betesda in Jeruzalem die al 38 jaar verlamd was en door Jezus genezen werd?",
                antwoorden: ["Bartimeüs", "Een man die niet bij naam wordt genoemd", "Lazarus", "Nikodemus"],
                correct: "Een man die niet bij naam wordt genoemd",
                bijbelplaats: "Johannes 5:1-9"
            },
            {
                vraag: "Filippus bracht zijn vriend Natanaël bij Jezus. Nog voordat ze ook maar één woord met elkaar hadden gewisseld, zei Jezus iets waardoor Natanaël stomverbaasd was: Jezus bleek hem al eerder gezien te hebben. Wat zei Jezus tegen hem?",
                antwoorden: ["Dat hij hem onder de vijgenboom had zien zitten", "Dat hij hem in de tempel had zien bidden", "Dat hij hem op de markt had gezien", "Dat hij hem aan het werk had gezien"],
                correct: "Dat hij hem onder de vijgenboom had zien zitten",
                bijbelplaats: "Johannes 1:47-49",
                uitleg: "Een vijgenboom gaf koele schaduw, en het was een geliefde plek om rustig te zitten lezen en bidden. Natanaël begreep meteen: deze man kent mij, terwijl we elkaar nooit ontmoet hebben."
            },
            {
                vraag: "Volgens Johannes was er één leerling die 'de leerling van wie Jezus hield' werd genoemd. Wie wordt daarmee bedoeld, volgens de traditie?",
                antwoorden: ["Petrus", "Johannes", "Andreas", "Tomas"],
                correct: "Johannes",
                bijbelplaats: "Johannes 13:23, 19:26",
                uitleg: "Deze leerling wordt nooit bij naam genoemd. Volgens de traditie is het Johannes zelf, de schrijver van dit evangelie."
            },
            {
                vraag: "Na zijn opstanding stond Jezus op een ochtend onverwachts aan de oever, terwijl de leerlingen nog aan het vissen waren. Ze zagen wel iemand staan, maar herkenden hem eerst niet. Hoe groot was de afstand tussen hun boot en de oever, volgens Johannes?",
                antwoorden: ["Vijftig el (ruim twintig meter)", "Honderd el (ongeveer vijftig meter)", "Tweehonderd el (ongeveer honderd meter)", "Vijfhonderd el (ruim tweehonderd meter)"],
                correct: "Tweehonderd el (ongeveer honderd meter)",
                bijbelplaats: "Johannes 21:8",
                uitleg: "Een el was ongeveer een halve meter, de lengte van een onderarm. Tweehonderd el is dus zo'n honderd meter — de lengte van een voetbalveld. Op die afstand zie je wel iemand staan, maar kun je geen gezichten herkennen. Pas toen het net vol zat, wist Johannes het zeker: het is de Heer."
            },
            {
                vraag: "Je kunt in de Dode Zee gaan zwemmen zonder ooit te zinken: je blijft er vanzelf drijven, alsof het water je draagt. Hoe kan dat?",
                antwoorden: ["Er zit zoveel zout in het water dat het je omhoog duwt", "Het water is er zo koud dat het je omhoog stuwt", "Er borrelt van onderaf steeds lucht uit de bodem omhoog", "Het meer is overal zo ondiep dat je gewoon kunt staan"],
                correct: "Er zit zoveel zout in het water dat het je omhoog duwt",
                uitleg: "Het water zit zó vol zout dat er geen vis of plant in kan leven — vandaar de naam. Ze ligt bovendien op het laagste punt van de aarde: de oever ligt ruim 400 meter onder de zeespiegel. En omdat het een meer is en geen echte zee, merk je er niets van eb en vloed."
            },
            {
                vraag: "Hoeveel grote rivieren en meren heeft Israël?",
                antwoorden: ["2 rivieren en 3 meren", "1 rivier en 2 meren", "1 rivier en 3 meren", "3 rivieren en 1 meer"],
                correct: "1 rivier en 3 meren",
                uitleg: "Israël is een droog land, dus er is weinig water. Er is maar één grote rivier: de Jordaan. En er zijn drie meren: het Meer van Galilea en de Dode Zee zijn de bekende twee, en in het noorden ligt nog een klein meer, het Meer van Hula. De Jordaan verbindt het Meer van Galilea met de Dode Zee."
            }
        ]
    }
};

// === Extra evangelievragen (uit woordenboek-vragen-bijbelkidsquiz.md) =========
// Toegevoegd aan de bestaande pools, in exact hetzelfde objectformaat
// ({ vraag, antwoorden, correct, bijbelplaats }). Mapping: kopje -> boek,
// [Gevorderd] -> advanced. De pool-, hussel-, win- en scorelogica blijft
// ongemoeid; de niveaus worden alleen groter en de bestaande pool-trekking
// (10 uit de pool) pakt dat vanzelf op.
vragenData["Matteüs"].advanced.push(
    {
        vraag: 'Wat wordt in de Bijbel bedoeld met "de Wet"?',
        antwoorden: ["De regels die God via Mozes aan Israël gaf, zoals de Tien Geboden", "De regels opgesteld door de Romeinse soldaten", "De wetten die de Romeinse keizer aan het hele rijk oplegde", "Regels opgesteld door de tempelwachters"],
        correct: "De regels die God via Mozes aan Israël gaf, zoals de Tien Geboden",
        bijbelplaats: "Matteüs 5:17"
    },
    {
        vraag: 'Wat betekende het woord "heiden" in de Bijbel?',
        antwoorden: ["Iemand die niet bij het Joodse volk hoorde", "Een slechte koning", "Iemand zonder huis", "Een gewone Jood, iemand zonder openbare religieuze functie"],
        correct: "Iemand die niet bij het Joodse volk hoorde",
        bijbelplaats: "Matteüs 10:5 (de uitzending van de twaalf)"
    }
);
vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus verwees naar een profeet die drie dagen in een grote vis zat, als beeld van zijn eigen opstanding. Over welke profeet ging het?",
        antwoorden: ["Jona", "Elia", "Jesaja", "Daniël"],
        correct: "Jona",
        bijbelplaats: "Matteüs 12:39-40"
    },
    {
        vraag: 'De zaligsprekingen zijn uitspraken van Jezus die allemaal beginnen met "Gelukkig zijn…". Tijdens welke beroemde toespraak sprak hij ze uit?',
        antwoorden: ["De Bergrede", "De Woestijnpreek", "De Tempelrede", "De Zeepreek"],
        correct: "De Bergrede",
        bijbelplaats: "Matteüs 5:3"
    }
);
vragenData["Marcus"].beginner.push(
    {
        vraag: 'Wat betekent het woord "Messias"?',
        antwoorden: ['De beloofde redder ("de gezalfde")', "De koning van de Romeinen", "De leider van de tempel", "Een hemelse engel"],
        correct: 'De beloofde redder ("de gezalfde")',
        bijbelplaats: "Marcus 8:29"
    },
    {
        vraag: 'Wat betekent het woord "evangelie"?',
        antwoorden: ["Goed nieuws", "Heilig boek", "Lange reis", "Oude wet"],
        correct: "Goed nieuws",
        bijbelplaats: "Marcus 1:1"
    },
    {
        vraag: 'Johannes de Doper riep de mensen op tot "bekering". Wat betekent dat?',
        antwoorden: ["Je leven omdraaien: stoppen met het verkeerde en het goede gaan doen", "Jezelf onderdompelen in de rivier en daarna nooit meer iets verkeerds doen", "Al je geld weggeven aan de tempel", "Naar een ander land verhuizen"],
        correct: "Je leven omdraaien: stoppen met het verkeerde en het goede gaan doen",
        bijbelplaats: "Marcus 1:4"
    },
    {
        vraag: 'Jezus sprak heel vaak over het "koninkrijk van God". Wat bedoelde hij daarmee?',
        antwoorden: ["Het land Israël op de kaart", "Het koninkrijk van God op aarde: dat mensen met elkaar omgaan zoals God het bedoeld heeft", "Het paleis van koning Herodes", "Een groot en machtig koninkrijk dat Jezus met een sterk leger zou veroveren op de Romeinen"],
        correct: "Het koninkrijk van God op aarde: dat mensen met elkaar omgaan zoals God het bedoeld heeft",
        bijbelplaats: "Marcus 1:15"
    },
    {
        vraag: 'Wat is een "wonder" in de Bijbel?',
        antwoorden: ["Een spannend verhaal dat eigenlijk niemand echt gelooft", "Iets bijzonders dat je niet gewoon kunt verklaren, en dat Gods kracht laat zien", "Niets — wonderen bestaan gewoon niet", "Een natuurverschijnsel dat de mensen uit de Bijbel nog niet konden verklaren, zoals onweer"],
        correct: "Iets bijzonders dat je niet gewoon kunt verklaren, en dat Gods kracht laat zien",
        bijbelplaats: "Marcus 4:39 (Jezus stilt de storm)"
    }
);
vragenData["Marcus"].advanced.push(
    {
        vraag: "Bij de doop van Jezus daalde de heilige Geest op hem neer. In de gedaante van welk dier?",
        antwoorden: ["Een arend", "Een duif", "Een gans", "Een mus"],
        correct: "Een duif",
        bijbelplaats: "Marcus 1:10"
    },
    {
        vraag: "Jezus genas op de sabbat, de rustdag, en kreeg daar kritiek op. Hoe keek Jezus tegen de sabbat aan?",
        antwoorden: ["Wie op de sabbat werkt of geneest, overtreedt de wet van Mozes zwaar", "De sabbat is er voor de mens, en niet de mens voor de sabbat", "De sabbat geldt alleen voor de priesters", "De sabbat is belangrijker dan een mens genezen"],
        correct: "De sabbat is er voor de mens, en niet de mens voor de sabbat",
        bijbelplaats: "Marcus 2:27"
    },
    {
        vraag: 'Wat was een "schriftgeleerde"?',
        antwoorden: ["Iemand die heel veel boeken gelezen had", "Een kenner van de heilige boeken, die ze aan anderen uitlegde", "Iemand die de belastingregels aan het volk kon uitleggen", "Iemand die de Romeinse wet uit zijn hoofd kende"],
        correct: "Een kenner van de heilige boeken, die ze aan anderen uitlegde",
        bijbelplaats: "Marcus 12:28"
    }
);
vragenData["Marcus"].expert.push(
    {
        vraag: '"Messias" is Hebreeuws voor "de gezalfde". Welk woord betekent precies hetzelfde, maar dan in het Grieks?',
        antwoorden: ["Christus", "Rabbi", "Profeet", "Immanuël"],
        correct: "Christus",
        bijbelplaats: "Johannes 1:41"
    }
);
vragenData["Lucas"].beginner.push(
    {
        vraag: 'Jezus vertelde vaak een "gelijkenis". Wat is dat?',
        antwoorden: ["Een kort verhaal om iets belangrijks mee uit te leggen", "Een lang lied dat je samen in de tempel hoort te zingen", "Een gebed", "Een wet"],
        correct: "Een kort verhaal om iets belangrijks mee uit te leggen",
        bijbelplaats: "Lucas 15:3 (o.a. de verloren zoon)"
    }
);
vragenData["Lucas"].advanced.push(
    {
        vraag: "Uit zijn vele leerlingen koos Jezus een kleinere, bijzondere groep die hij eropuit stuurde. Hoe noemde hij die?",
        antwoorden: ["Apostelen", "Profeten", "Schriftgeleerden", "Farizeeën"],
        correct: "Apostelen",
        bijbelplaats: "Lucas 6:13"
    },
    {
        vraag: "Wat was een synagoge?",
        antwoorden: ["Het gebouw waar Joodse mensen samenkwamen om te bidden en uit de heilige boeken te leren", "De grote tempel in Jeruzalem waar de priesters elke dag opnieuw de dieren aan God offerden", "De grote markt waar handelaren verkochten", "Het huis waar de hogepriester offerde"],
        correct: "Het gebouw waar Joodse mensen samenkwamen om te bidden en uit de heilige boeken te leren",
        bijbelplaats: "Lucas 4:16"
    },
    {
        vraag: "Wat vierden de Joden met het feest Pesach (Pasen)?",
        antwoorden: ["De bevrijding uit de slavernij in Egypte", "Het begin van de oogst", "De bouw van de tempel", "De overwinning van koning David op de reus Goliat"],
        correct: "De bevrijding uit de slavernij in Egypte",
        bijbelplaats: "Lucas 22:1 (het Laatste Avondmaal was een Pesachmaaltijd)"
    },
    {
        vraag: 'Het woord "zonde" betekent eigenlijk iets verkeerds doen. Met welk beeld wordt dat oude woord vaak uitgelegd?',
        antwoorden: ["Je doel missen, zoals een pijl die net naast de roos schiet", "Verliezen, zoals een speler die de wedstrijd niet wint", "Een schat verstoppen", "Een brief verscheuren"],
        correct: "Je doel missen, zoals een pijl die net naast de roos schiet",
        bijbelplaats: "Lucas 15:18"
    }
);
vragenData["Lucas"].expert.push(
    {
        vraag: "Bij het Laatste Avondmaal sprak Jezus over een bijzondere afspraak tussen God en de mensen. Hoe noemde hij die?",
        antwoorden: ["Het nieuwe verbond", "De grote belofte", "De heilige wet", "Het laatste gebod"],
        correct: "Het nieuwe verbond",
        bijbelplaats: "Lucas 22:20"
    }
);
vragenData["Johannes"].beginner.push(
    {
        vraag: 'Wat is een "discipel"?',
        antwoorden: ["Een leerling van Jezus die met hem meeging en van hem leerde", "Een priester in de tempel", "Een Romeinse soldaat", "Een dienaar die in de tempel het heilige vuur brandend hield"],
        correct: "Een leerling van Jezus die met hem meeging en van hem leerde",
        bijbelplaats: "Johannes 1:35-40"
    },
    {
        vraag: 'Wat betekent het woord "opstanding"?',
        antwoorden: ["Weer levend worden na de dood", "Omhooggaan naar de hemel", "Een lange reis maken", "Een groot feest vieren"],
        correct: "Weer levend worden na de dood",
        bijbelplaats: "Johannes 11:25 (Jezus bij het graf van Lazarus)"
    },
    {
        vraag: "Wat was de tempel?",
        antwoorden: ["Het grote, heilige gebouw in Jeruzalem waar de mensen God vereerden", "Het grote paleis waar de koning van de Joden met zijn hele familie woonde", "De markt van Jeruzalem", "Een Romeins fort"],
        correct: "Het grote, heilige gebouw in Jeruzalem waar de mensen God vereerden",
        bijbelplaats: "Johannes 2:13-22"
    }
);
vragenData["Johannes"].advanced.push(
    {
        vraag: "Een man genaamd Nikodemus kwam 's nachts bij Jezus op bezoek. Tot welke groep behoorde hij?",
        antwoorden: ["De Farizeeën", "De Romeinse soldaten", "De tollenaars", "De vissers"],
        correct: "De Farizeeën",
        bijbelplaats: "Johannes 3:1"
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: "In het evangelie van Johannes hebben de wonderen van Jezus een eigen, bijzondere naam. Hoe noemt Johannes ze?",
        antwoorden: ["Tekenen", "Krachten", "Wonderwerken", "Machtige daden"],
        correct: "Tekenen",
        bijbelplaats: "Johannes 2:11"
    }
);

// === Matteüs Beginner — 10 extra vragen (uit matteus-beginner-10-nieuwe-vragen.js)
// Zelfde objectformaat, sommige met het optionele 'uitleg'-veld. Pool 10 -> 20.
vragenData["Matteüs"].beginner.push(
    {
        vraag: "Onze jaartelling — zoals het jaar 2026 'na Christus' — telt vanaf de geboorte van wie?",
        antwoorden: ["Jezus", "Mozes", "Abraham", "Koning David"],
        correct: "Jezus",
        bijbelplaats: "Matteüs 2:1",
        uitleg: "Onze kalender is bedóeld om vanaf de geboorte van Jezus te tellen. Hij is pas veel later bedacht, en het exacte geboortejaar klopt waarschijnlijk net niet — geleerden denken een paar jaar eerder, toen koning Herodes nog leefde. Maar we tellen onze jaren nog altijd vanaf zíjn geboorte."
    },
    {
        vraag: "Wat was het werk van Petrus en Andreas voordat ze Jezus volgden?",
        antwoorden: ["Vissers", "Boeren", "Soldaten", "Bakkers"],
        correct: "Vissers",
        bijbelplaats: "Matteüs 4:18-20",
        uitleg: "Jezus zei tegen hen: 'Kom, volg mij, dan zal ik jullie vissers van mensen maken.' Ze lieten meteen hun netten achter en gingen mee."
    },
    {
        vraag: "Wat zei Jezus toen mensen de kinderen bij hem wilden weghouden?",
        antwoorden: ["Laat de kinderen bij mij komen", "Kom morgen maar terug", "Kinderen moeten stil zijn", "Ga maar naar huis"],
        correct: "Laat de kinderen bij mij komen",
        bijbelplaats: "Matteüs 19:13-14"
    },
    {
        vraag: "Jezus vertelde over een verstandige man die zijn huis bouwde zodat het in de storm bleef staan. Waarop bouwde hij?",
        antwoorden: ["Op de rots", "Op het zand", "Op het water", "Op een hooiberg"],
        correct: "Op de rots",
        bijbelplaats: "Matteüs 7:24-27",
        uitleg: "De man die op zand bouwde, zag zijn huis instorten toen de storm kwam. Wie op de rots bouwt, staat stevig — Jezus bedoelde: zo is het als je naar zijn woorden luistert én ze ook doet."
    },
    {
        vraag: "Jezus vergeleek het koninkrijk van God met een heel klein zaadje dat uitgroeit tot een grote plant. Welk zaadje?",
        antwoorden: ["Een mosterdzaadje", "Een appelpit", "Een graankorrel", "Een druivenpit"],
        correct: "Een mosterdzaadje",
        bijbelplaats: "Matteüs 13:31-32"
    },
    {
        vraag: "Een herder heeft honderd schapen en er raakt er één kwijt. Wat doet hij volgens Jezus?",
        antwoorden: ["Hij laat de negenennegentig achter om dat ene te zoeken", "Hij vergeet dat ene schaap en telt gewoon rustig verder", "Hij koopt een nieuw schaap", "Hij wacht tot het vanzelf terugkomt"],
        correct: "Hij laat de negenennegentig achter om dat ene te zoeken",
        bijbelplaats: "Matteüs 18:12-14",
        uitleg: "Met dit verhaal liet Jezus zien dat God ieder mens belangrijk vindt — juist ook die ene die verdwaald is geraakt."
    },
    {
        vraag: "Wat vertelde de engel aan de vrouwen die op de paasmorgen bij het graf van Jezus kwamen?",
        antwoorden: ["Wees niet bang, hij is naar Galilea gegaan", "Hij is opgestaan, hij is hier niet", "Hij slaapt, kom later terug", "Rol de steen weer voor het graf"],
        correct: "Hij is opgestaan, hij is hier niet",
        bijbelplaats: "Matteüs 28:5-6"
    },
    {
        vraag: "Jezus gaf een gouden regel over hoe je met anderen omgaat. Wat zei hij?",
        antwoorden: ["Behandel anderen zoals je zelf behandeld wilt worden", "Doe altijd wat de meesten doen", "Help alleen je beste vrienden", "Behandel anderen precies zoals zij jou behandeld hebben"],
        correct: "Behandel anderen zoals je zelf behandeld wilt worden",
        bijbelplaats: "Matteüs 7:12"
    }
);

// === Thema "Maten, geld & tijd" — verdeeld over de evangelieboeken ============
// Veldnamen aangepast aan de bestaande structuur (opties->antwoorden,
// antwoord->correct) en niveau "gevorderd"->advanced. Elke vraag is op het
// evangelie in zijn bijbelplaats geplaatst. Pool-/hussel-/win-/scorelogica
// blijft ongemoeid; de niveaus worden alleen groter.
vragenData["Marcus"].beginner.push(
    {
        vraag: "Welk muntje was het allerkleinste dat in de Bijbel voorkomt?",
        antwoorden: ["Penning", "Denarie", "Talent", "Pond"],
        correct: "Penning",
        bijbelplaats: "Marcus 12:41-44 (de arme weduwe)"
    }
);
vragenData["Marcus"].advanced.push(
    {
        vraag: "De Romeinen verdeelden de nacht in vier 'wachten'. Jezus noemde ze toen hij sprak over waken. Welke vier waren dat?",
        antwoorden: ["'s Ochtends, 's middags, 's avonds en 's nachts", "De avond, middernacht, het hanengekraai en de vroege ochtend", "De eerste wake, de tweede wake, de derde wake en de vierde wake", "Het eerste, tweede, derde en vierde uur"],
        correct: "De avond, middernacht, het hanengekraai en de vroege ochtend",
        bijbelplaats: "Marcus 13:35"
    }
);
vragenData["Marcus"].expert.push(
    {
        vraag: 'Volgens Marcus stierf Jezus op het "negende uur". Hoe laat was dat ongeveer?',
        antwoorden: ["Ongeveer drie uur 's middags", "Ongeveer negen uur 's ochtends", "Rond middernacht", "Bij zonsopgang"],
        correct: "Ongeveer drie uur 's middags",
        bijbelplaats: "Marcus 15:33-34"
    },
    {
        vraag: "Jezus zei dat het makkelijker is voor een kameel om door het oog van een naald te gaan dan voor een rijke om het Koninkrijk van God binnen te gaan. Wat bedoelde hij daarmee?",
        antwoorden: [
            "Dat het uit eigen kracht onmogelijk is — alleen bij God is het mogelijk",
            "Dat een rijke nooit gered kan worden",
            "Dat je eerst je bagage moet afleggen bij een klein stadspoortje",
            "Dat alleen arme mensen in de hemel komen"
        ],
        correct: "Dat het uit eigen kracht onmogelijk is — alleen bij God is het mogelijk",
        bijbelplaats: "Marcus 10:25-27",
        uitleg: `Veel mensen hebben geleerd dat het "oog van de naald" een klein poortje in Jeruzalem was, waar een kameel alleen doorheen kon als hij eerst alle bagage aflegde. Het klinkt mooi en praktisch, en het wordt al tientallen jaren zo verteld. Maar als we eerlijk zijn, klopt deze uitleg historisch waarschijnlijk niet.

Er is namelijk geen enkel bewijs voor zo'n poort. Archeologen hebben nooit een poort gevonden die "Oog van de Naald" heette, en de oudste christelijke uitleggers — zoals Origenes, Chrysostomus en Augustinus — bespreken deze tekst uitgebreid, maar géén van hen noemt een poortje. De uitleg duikt pas veel later op; het lijkt dus eerder iets dat later in preken is verteld dan een echte herinnering uit Jezus' tijd.

Wat bedoelde Jezus dan wél? Waarschijnlijk juist een onmogelijk beeld: een enorme kameel die door een piepklein naaldgaatje moet. Dat kán gewoon niet — en dat is precies de bedoeling. De leerlingen schrikken ervan en vragen: "Wie kan er dan nog gered worden?" Jezus antwoordt: "Bij mensen is dit onmogelijk, maar bij God is alles mogelijk."

En juist daar zit het mooie en hoopvolle. Het gaat er níet om dat je uit alle macht je uiterste best doet en het dan maar net redt. Het gaat om overgave: je handen openen en het aan God geven. Niemand — rijk of arm — kan zichzelf redden, en dat hoeft ook niet. Gods genade is een geschenk, en dat geschenk ligt klaar voor iedereen die ervoor openstaat. Wat voor jou onmogelijk is, maakt God mogelijk. Het is dus geen sombere boodschap, maar een uitnodiging: je hoeft het niet alleen te doen.`
    }
);
vragenData["Lucas"].advanced.push(
    {
        vraag: "De arme weduwe gaf twee penningen. Hoeveel was dat samen ongeveer in geld van nu?",
        antwoorden: ["Ongeveer anderhalf tot twee euro", "Ongeveer 100 euro", "Een dagloon (150-200 euro)", "Meer dan 1000 euro"],
        correct: "Ongeveer anderhalf tot twee euro",
        bijbelplaats: "Lucas 21:1-4"
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: '"Pond" betekent niet altijd geld. Waar gaat het bij het "pond kostbare olie" om?',
        antwoorden: ["Een gewicht (ongeveer 300 gram)", "Een gewicht (1 kilo)", "Een grote som geld van wel driehonderd munten", "Een tijdsmaat"],
        correct: "Een gewicht (ongeveer 300 gram)",
        bijbelplaats: "Johannes 12:3 (de zalving in Betanië)",
        uitleg: "Het woord dat hier met 'pond' vertaald wordt, is een gewichtsmaat van ongeveer 327 gram (een Romeins pond) — het gaat dus om het gewicht van de olie, niet om geld."
    },
    {
        vraag: "Maria zalfde Jezus' voeten met heel kostbare nardusolie. Hoeveel was die olie ongeveer waard?",
        antwoorden: ["Driehonderd denarie (bijna een jaarloon)", "Drie denarie", "Vijftig denarie, ongeveer het loon van een maand", "Een paar penningen"],
        correct: "Driehonderd denarie (bijna een jaarloon)",
        bijbelplaats: "Johannes 12:5",
        uitleg: "Driehonderd denarie was ongeveer een heel jaar aan daglonen — een enorm bedrag. Judas vond het verkwisting, maar Jezus prees de vrouw om haar liefde."
    }
);

// --- Uren van de dag: drie bekende momenten ---------------------------------
// Horen bij de naslagtabel "Maten, geld & tijd". Elk bij het bijbelboek van de
// gebeurtenis. Het Pinkstervoorbeeld hoort bij Handelingen (Handelingen 2:15)
// en staat als push ná de Handelingen-pool, omdat vragenData["Handelingen"]
// hierboven nog niet bestaat.
vragenData["Johannes"].expert.push(
    {
        vraag: 'Jezus zat moe bij de put toen hij de Samaritaanse vrouw ontmoette. Het was "ongeveer het zesde uur". Hoe laat was dat?',
        antwoorden: [
            "Rond het middaguur (ongeveer 12 uur)",
            "Negen uur 's ochtends",
            "Drie uur 's middags",
            "Bij zonsondergang (rond 6 uur 's avonds)"
        ],
        correct: "Rond het middaguur (ongeveer 12 uur)",
        bijbelplaats: "Johannes 4:6",
        uitleg: "Geteld vanaf zonsopgang is het 'zesde uur' ongeveer twaalf uur 's middags: het heetst van de dag. Een ongewone tijd om water te halen, en Jezus was moe van de reis."
    }
);
vragenData["Matteüs"].expert.push(
    {
        vraag: 'Op het "negende uur" gebeurde er iets belangrijks bij het kruis. Wat was dat uur ongeveer, en wat hoorde er nog meer bij?',
        antwoorden: [
            "Ongeveer drie uur 's middags — ook het vaste uur waarop men naar de tempel ging om te bidden",
            "Ongeveer negen uur 's ochtends — het begin van de werkdag",
            "Precies om middernacht — het uur waarop de tempelwachters van dienst wisselden",
            "Bij zonsopgang — het uur van het ochtendoffer"
        ],
        correct: "Ongeveer drie uur 's middags — ook het vaste uur waarop men naar de tempel ging om te bidden",
        bijbelplaats: "Matteüs 27:46-50",
        uitleg: "Het 'negende uur' is ongeveer drie uur 's middags. Op dat uur stierf Jezus aan het kruis. Het was ook een vast gebedsuur: in het boek Handelingen lezen we dat Petrus en Johannes 'op het negende uur, het uur van het gebed' naar de tempel gingen (Handelingen 3:1)."
    },
    {
        vraag: "Met hoeveel broden en vissen gaf Jezus een grote menigte te eten?",
        antwoorden: ["Vijf broden en twee vissen", "Twee broden en vijf vissen", "Tien broden en tien vissen", "Eén brood en één vis"],
        correct: "Vijf broden en twee vissen",
        bijbelplaats: "Matteüs 14:13-21"
    },
    {
        vraag: 'Een "el" is ongeveer zo lang als…',
        antwoorden: ["De lengte van je voet (ongeveer 30 cm)", "De afstand van je elleboog tot je vingertoppen (ongeveer 45 cm)", "De lengte van je arm van schouder tot pols (ongeveer 60 cm)", "De breedte van je hand (ongeveer 8 cm)"],
        correct: "De afstand van je elleboog tot je vingertoppen (ongeveer 45 cm)",
        bijbelplaats: "Matteüs 6:27"
    },
    {
        vraag: "Jezus zei: dwingt iemand je één mijl mee te gaan, ga er dan twee. Hoe lang was een Romeinse mijl ongeveer?",
        antwoorden: ["Honderd meter", "Anderhalve kilometer", "Een halve kilometer", "Tien kilometer"],
        correct: "Anderhalve kilometer",
        bijbelplaats: "Matteüs 5:41"
    },
    {
        vraag: "Jezus zei dat je een lamp niet onder een korenmaat zet, maar op een standaard. Wat was een korenmaat?",
        antwoorden: ["Een mand om vissen mee te vangen", "Een maatbak om graan af te meten", "Een soort lamp", "Een lengtemaat"],
        correct: "Een maatbak om graan af te meten",
        bijbelplaats: "Matteüs 5:15",
        uitleg: "Een korenmaat was een maatbak om graan af te meten, zo'n negen liter groot. Jezus bedoelde: je steekt een lamp niet aan om hem daarna te bedekken — je zet hem juist hoog, zodat iedereen het licht ziet."
    },
    {
        vraag: "Hoe lang moest een gewone arbeider ongeveer werken om één talent te verdienen?",
        antwoorden: ["Ongeveer 4,5 jaar", "Vijftien tot twintig jaar", "Een paar maanden", "Ongeveer een jaar"],
        correct: "Vijftien tot twintig jaar",
        bijbelplaats: "Matteüs 25:14-30 (de gelijkenis van de talenten)"
    },
    {
        vraag: "Judas kreeg dertig zilverstukken. Wat was zo'n zilverstuk ongeveer waard?",
        antwoorden: ["Ongeveer vier daglonen, dus dertig stuks waren zo'n vier maanden loon", "Ongeveer één dagloon, net als een denarie", "Precies één jaarloon per stuk", "Het was geen echt geld, maar een tempelmunt zonder waarde"],
        correct: "Ongeveer vier daglonen, dus dertig stuks waren zo'n vier maanden loon",
        bijbelplaats: "Matteüs 26:15",
        uitleg: "Met een zilverstuk wordt hier waarschijnlijk een sikkel bedoeld, de munt waarmee ook de tempelbelasting werd betaald. Eén sikkel was ongeveer vier daglonen waard, dus dertig sikkels kwamen neer op vier maanden loon voor een gewone arbeider. Veel geld, maar geen fortuin. Het bedrag is niet toevallig gekozen: in de wet van Mozes is dertig sikkels precies de vergoeding die je moest betalen als je slaaf door een dier gedood was — de prijs van een mensenleven dat niet als volwaardig werd geteld."
    }
);

// === Johannes — de "Ik ben"-uitspraken (9 extra vragen) =====================
// Het juiste antwoord staat in 'correct' op tekstinhoud; de antwoordvolgorde
// wordt bij het trekken gehusseld (husselArray in kiesNiveau), dus de positie
// in de array doet er niet toe.
vragenData["Johannes"].beginner.push(
    {
        vraag: "Jezus zei: 'Ik ben de weg, de waarheid en het ___.' Welk woord hoort op de open plek?",
        antwoorden: ["het leven", "het licht", "de liefde", "de vrede"],
        correct: "het leven",
        bijbelplaats: "Johannes 14:6"
    },
    {
        vraag: "Jezus noemde zichzelf 'de goede ___'. Hoe noemde Hij zich?",
        antwoorden: ["herder", "koning", "leraar", "visser"],
        correct: "herder",
        bijbelplaats: "Johannes 10:11"
    },
    {
        vraag: "Jezus zei: 'Ik ben het licht van de ___.' Wat zei Hij?",
        antwoorden: ["wereld", "hemel", "nacht", "zon"],
        correct: "wereld",
        bijbelplaats: "Johannes 8:12"
    }
);
vragenData["Johannes"].advanced.push(
    {
        vraag: "Jezus vertelde over een schaapskooi waar de schapen 's nachts veilig binnen zijn. Hij zei dat Híj de manier is om naar binnen te gaan. Hoe noemde Jezus zichzelf in dit beeld?",
        antwoorden: ["de deur", "de muur", "het dak", "het raam"],
        correct: "de deur",
        bijbelplaats: "Johannes 10:7-9"
    },
    {
        vraag: "Jezus vergeleek zichzelf met een plant: 'Ik ben de ware ___.' Welke plant?",
        antwoorden: ["wijnstok", "olijfboom", "vijgenboom", "palmboom"],
        correct: "wijnstok",
        bijbelplaats: "Johannes 15:1"
    },
    {
        vraag: "Jezus zei: 'Ik ben het ___ dat leven geeft.' Welk woord hoort hier?",
        antwoorden: ["brood", "water", "wijn", "vis"],
        correct: "brood",
        bijbelplaats: "Johannes 6:35"
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: "De vier evangeliën zijn niet allemaal tegelijk geschreven. Als hoeveelste van de vier is het evangelie van Johannes waarschijnlijk ontstaan?",
        antwoorden: ["Als eerste", "Als tweede", "Als derde", "Als laatste"],
        correct: "Als laatste",
        bijbelplaats: "NT algemeen",
        uitleg: "Matteüs, Marcus en Lucas lijken veel op elkaar; ze worden de 'synoptische' evangeliën genoemd. Johannes is heel anders van stijl en wordt door de meeste geleerden als laatste gedateerd, rond het jaar 90 na Christus. Daarom heet het ook wel 'het vierde evangelie'."
    },
    {
        vraag: "Jezus zei iets bijzonders over zichzelf: 'Voordat ___ er was, ben Ik.' Hij bedoelde dat Hij al lang vóór deze persoon bestond. Over wie ging het?",
        antwoorden: ["Abraham", "Mozes", "David", "Noach"],
        correct: "Abraham",
        bijbelplaats: "Johannes 8:58"
    },
    {
        vraag: "Jezus zei: 'Ik ben de goede herder.' Wat doet de goede herder volgens Hem voor zijn schapen?",
        antwoorden: [
            "Hij geeft zijn leven voor de schapen",
            "Hij verkoopt ze",
            "Hij laat ze alleen",
            "Hij laat ze door een knecht in de gaten houden"
        ],
        correct: "Hij geeft zijn leven voor de schapen",
        bijbelplaats: "Johannes 10:11"
    }
);

// === Matteüs & Johannes — beelden ("zout", "licht", "vissers van mensen",
// "ranken", "schapen"). Juiste antwoord op inhoud; husselArray schudt de opties.
vragenData["Matteüs"].beginner.push(
    {
        vraag: "Jezus zei dat zijn volgelingen als een bepaald ingrediënt moeten zijn — iets dat eten smaak geeft en bewaart. Met welk ingrediënt vergeleek Hij hen?",
        antwoorden: ["zout", "suiker", "peper", "meel"],
        correct: "zout",
        bijbelplaats: "Matteüs 5:13"
    },
    {
        vraag: "Jezus zei tegen zijn volgelingen: 'Jullie zijn het ___ van de wereld; laat het schijnen voor de mensen.' Wat zei Hij dat ze waren?",
        antwoorden: ["het licht", "het vuur", "de wind", "het water"],
        correct: "het licht",
        bijbelplaats: "Matteüs 5:14"
    },
    {
        vraag: "Jezus zei tegen de vissers dat ze voortaan 'vissers van mensen' zouden zijn. Wat bedoelde hij daarmee?",
        antwoorden: ["Dat ze een grotere boot nodig hadden", "Dat ze mensen bij God zouden brengen", "Dat ze leraren op een school zouden worden", "Dat ze moesten stoppen met vissen"],
        correct: "Dat ze mensen bij God zouden brengen",
        bijbelplaats: "Matteüs 4:19"
    },
    {
        vraag: "Matteüs zat bij het tolhuis toen Jezus hem riep. Wat deed een tollenaar?",
        antwoorden: ["Hij inde geld voor de Romeinen en mocht er zelf iets bovenop vragen", "Hij bewaakte de stadspoort en controleerde wie er binnenkwam", "Hij hield de boeken bij van de tempelschat in Jeruzalem", "Hij verkocht offerdieren aan de mensen die naar de tempel gingen"],
        correct: "Hij inde geld voor de Romeinen en mocht er zelf iets bovenop vragen",
        bijbelplaats: "Matteüs 9:9"
    }
);
vragenData["Matteüs"].advanced.push(
    {
        vraag: "Jezus riep zijn eerste leerlingen bij het meer. Wat deden ze toen hij zei 'volg mij'?",
        antwoorden: ["Ze vroegen eerst of ze hun boot mochten verkopen", "Ze lieten meteen hun netten achter en gingen mee", "Ze gingen eerst afscheid nemen van hun familie", "Ze zeiden dat ze de volgende dag zouden komen"],
        correct: "Ze lieten meteen hun netten achter en gingen mee",
        bijbelplaats: "Matteüs 4:18-22"
    }
);
vragenData["Johannes"].beginner.push(
    {
        vraag: "In de Bijbel worden de mensen die bij Jezus horen vergeleken met dieren die hun herder volgen. Met welke dieren?",
        antwoorden: ["schapen", "geiten", "koeien", "duiven"],
        correct: "schapen",
        bijbelplaats: "Johannes 10:27"
    }
);
vragenData["Johannes"].advanced.push(
    {
        vraag: "Jezus zei: 'Ik ben de wijnstok, jullie zijn de ___.' Wat zijn de gelovigen volgens dit beeld?",
        antwoorden: ["de ranken", "de bladeren", "de wortels", "de druiven"],
        correct: "de ranken",
        bijbelplaats: "Johannes 15:5"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert)
// Doel: het kind komt een woord tegen dat het nog niet kende, met het
// bijbelvers als inleiding, en kent het daarna.
// =====================================================================
vragenData["Matteüs"].expert.push(
    {
        vraag: "Johannes de Doper zegt over degene die na hem komt: hij heeft de wan in zijn hand. Wat is een wan?",
        antwoorden: ["Een schep om graan op te gooien, zodat de wind het kaf wegblaast", "Een grove zeef waarmee steentjes uit het gemalen meel werden gehaald", "Een zware houten hamer om de korenschoven mee los te kloppen", "Een grote mand om de oogst mee naar de schuur te dragen"],
        correct: "Een schep om graan op te gooien, zodat de wind het kaf wegblaast",
        bijbelplaats: "Matteüs 3:12"
    },
    {
        vraag: "Jezus zegt: neem mijn juk op je, want mijn juk is zacht. Wat is een juk?",
        antwoorden: ["Een houten balk over de nek van twee dieren die samen trekken", "Een dikke wollen mantel die herders 's nachts omsloegen", "Een leren riem om een zware last mee op je rug te binden", "Een grote steen waarmee de ingang van een put werd afgesloten"],
        correct: "Een houten balk over de nek van twee dieren die samen trekken",
        bijbelplaats: "Matteüs 11:29-30"
    },
    {
        vraag: "Matteüs vertelt over de Sadduceeën en zegt er meteen bij wat hen bijzonder maakte. Wat geloofden zij niet?",
        antwoorden: ["Dat de doden zullen opstaan", "Dat de sabbat gehouden moest worden", "Dat God de wereld heeft gemaakt", "Dat Mozes de wet heeft ontvangen"],
        correct: "Dat de doden zullen opstaan",
        bijbelplaats: "Matteüs 22:23"
    },
    {
        vraag: "De wijzen uit het oosten brachten goud, wierook en mirre. Wat is mirre?",
        antwoorden: ["Een kostbare hars die ook bij een begrafenis werd gebruikt", "Een dieprode verfstof waarmee mantels van koningen werden geverfd", "Een gouden schaal waarin men wierook liet branden", "Een zoete siroop van dadels die men bij feesten dronk"],
        correct: "Een kostbare hars die ook bij een begrafenis werd gebruikt",
        bijbelplaats: "Matteüs 2:11"
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "Bij Jezus' intocht in Jeruzalem roepen de mensen \"Hosanna!\". Wat riepen ze daarmee eigenlijk?",
        antwoorden: ["Red ons", "Vrede zij met jou", "Leve de koning", "Dank aan God"],
        correct: "Red ons",
        bijbelplaats: "Marcus 11:9"
    }
);


vragenData["Lucas"].expert.push(
    {
        vraag: "Toen Jozef en Maria Jezus naar de tempel brachten, offerden zij twee tortelduiven. Wat zegt dat over hen?",
        antwoorden: ["Dat zij arm waren, want duiven waren het offer voor wie geen lam kon betalen", "Dat zij uit een priesterfamilie kwamen en daarom duiven moesten offeren", "Dat zij een lange reis hadden gemaakt en geen lam konden meenemen", "Dat het lente was, want duiven werden alleen in het voorjaar geofferd"],
        correct: "Dat zij arm waren, want duiven waren het offer voor wie geen lam kon betalen",
        bijbelplaats: "Lucas 2:24"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 2)
// =====================================================================
vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus verwijt sommige leiders dat ze hun gebedsriemen extra breed maken. Wat waren gebedsriemen?",
        antwoorden: ["Doosjes met bijbelteksten erin, die met riempjes op arm en voorhoofd werden gebonden", "Sjerpen die je om je middel bond als teken dat je aan het bidden was", "Touwen waarmee de rollen in de synagoge werden dichtgebonden", "Leren riemen waarmee de deuren van de synagoge werden vergrendeld"],
        correct: "Doosjes met bijbelteksten erin, die met riempjes op arm en voorhoofd werden gebonden",
        bijbelplaats: "Matteüs 23:5"
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "Jakobus en Johannes kregen van Jezus de bijnaam Boanerges. Marcus vertelt erbij wat dat betekent. Wat is het?",
        antwoorden: ["Zonen van de donder", "Zonen van het licht", "Zonen van de rots", "Zonen van de storm"],
        correct: "Zonen van de donder",
        bijbelplaats: "Marcus 3:17"
    },
    {
        vraag: "Een vrouw brak een albasten kruik en goot dure olie over Jezus' hoofd. Wat is albast?",
        antwoorden: ["Een lichte, doorschijnende steensoort waar men kostbare potjes van maakte", "Een dunne witte stof waarin men flessen wikkelde tegen de warmte", "Een geelbruine houtsoort die alleen in Libanon groeide", "Een dikke laag was waarmee kruiken werden dichtgemaakt"],
        correct: "Een lichte, doorschijnende steensoort waar men kostbare potjes van maakte",
        bijbelplaats: "Marcus 14:3"
    },
    {
        vraag: "Jezus ging bidden in Getsemane, een plek met olijfbomen. Wat betekent die naam?",
        antwoorden: ["Olijfpers", "Stille tuin", "Berg van tranen", "Hof van de koning"],
        correct: "Olijfpers",
        bijbelplaats: "Marcus 14:32"
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "Zacharias was priester en moest het reukoffer brengen in de tempel. Wat deed hij daarbij?",
        antwoorden: ["Hij verbrandde wierook op een altaar, terwijl het volk buiten stond te bidden", "Hij slachtte een lam en legde het op het brandofferaltaar", "Hij goot olie uit over de gouden kandelaar en stak die aan", "Hij waste de heilige voorwerpen met water uit het bekken"],
        correct: "Hij verbrandde wierook op een altaar, terwijl het volk buiten stond te bidden",
        bijbelplaats: "Lucas 1:8-11"
    },
    {
        vraag: "De barmhartige Samaritaan goot olie en wijn op de wonden van de gewonde man. Waarom deed hij dat?",
        antwoorden: ["Dat was de gewone manier om een wond te verzorgen: wijn reinigt, olie verzacht", "Het was een gebed in daden: olie stond voor God, wijn voor het leven", "Het was alles wat hij bij zich had en het was beter dan niets", "Het hoorde bij de gastvrijheid: zo begroette je iemand die je meenam"],
        correct: "Dat was de gewone manier om een wond te verzorgen: wijn reinigt, olie verzacht",
        bijbelplaats: "Lucas 10:34"
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "Jezus stuurt een blinde man naar het badwater Siloam. Johannes schrijft erbij wat die naam betekent. Wat is het?",
        antwoorden: ["Gezonden", "Genezen", "Levend water", "Geopend"],
        correct: "Gezonden",
        bijbelplaats: "Johannes 9:7"
    },
    {
        vraag: "Op de bruiloft in Kana stonden zes grote stenen watervaten klaar. Waar dienden die voor?",
        antwoorden: ["Voor het ritueel wassen van handen en vaatwerk, zoals de Joodse gewoonte was", "Voor het bewaren van regenwater voor tijden van droogte", "Voor het mengen van wijn met water tijdens de maaltijd", "Voor het wassen van de voeten van de gasten bij binnenkomst"],
        correct: "Voor het ritueel wassen van handen en vaatwerk, zoals de Joodse gewoonte was",
        bijbelplaats: "Johannes 2:6"
    }
);

// =====================================================================
// Vragenpool: Romeinen  (Beginner 24 · Gevorderd 14 · Expert 14)
// Formaat gelijk aan de evangeliën: vraag / antwoorden / correct /
// bijbelplaats. vragenData is hierboven al gedefinieerd, dus toevoegen mag.
// =====================================================================
vragenData["Romeinen"] = {
    beginner: [
        {
            vraag: "Wie schreef de brief aan de Romeinen?",
            antwoorden: ["Petrus", "Paulus", "Johannes", "Jakobus"],
            correct: "Paulus",
            bijbelplaats: "Romeinen 1:1"
        },
        {
            vraag: "Paulus geeft een korte regel over wat je moet doen als iemand jou kwaad doet. Wat schrijft hij?",
            antwoorden: ["Overwin het kwade door het goede", "Doe precies hetzelfde terug", "Doe alsof je niets merkt", "Meld het meteen bij de overheid"],
            correct: "Overwin het kwade door het goede",
            bijbelplaats: "Romeinen 12:21"
        },
        {
            vraag: "Wat voor soort tekst is \"Romeinen\"?",
            antwoorden: ["Een lied", "Een evangelie", "Een gebed", "Een brief"],
            correct: "Een brief",
            bijbelplaats: "Romeinen 1:1-7"
        },
        {
            vraag: "Had Paulus de christenen in Rome al bezocht toen hij deze brief schreef?",
            antwoorden: ["Nee, maar hij wilde er graag heen", "Ja, hij woonde er", "Ja, hij was er geboren", "Nee, en hij wilde er nooit heen"],
            correct: "Nee, maar hij wilde er graag heen",
            bijbelplaats: "Romeinen 1:10-13"
        },
        {
            vraag: "Paulus schrijft dat álle mensen iets met elkaar gemeen hebben. Wat geldt er volgens hem voor iedereen?",
            antwoorden: ["Ze zijn allemaal goed genoeg voor God", "Ze hebben allemaal gezondigd", "Ze hebben God niet nodig", "Ze maken nooit fouten"],
            correct: "Ze hebben allemaal gezondigd",
            bijbelplaats: "Romeinen 3:23"
        },
        {
            vraag: "Wat noemt Paulus het grootste geschenk van God aan de mensen?",
            antwoorden: ["Een lang leven vol rijkdom, eer en macht", "Een mooi huis", "Het eeuwige leven door Jezus Christus", "Veel land"],
            correct: "Het eeuwige leven door Jezus Christus",
            bijbelplaats: "Romeinen 6:23"
        },
        {
            vraag: "In Romeinen 8 schrijft Paulus iets bemoedigends over Gods liefde. Wat zegt hij daarover?",
            antwoorden: ["Gods liefde is alleen voor sterke mensen", "Gods liefde stopt als je te veel fouten maakt", "Je moet Gods liefde verdienen", "Niets kan ons scheiden van Gods liefde"],
            correct: "Niets kan ons scheiden van Gods liefde",
            bijbelplaats: "Romeinen 8:38-39"
        },
        {
            vraag: "In Romeinen 12 schrijft Paulus over mensen die het je moeilijk maken. Wat zegt hij dat je moet doen?",
            antwoorden: ["Zegen hen en wens hun het goede toe", "Pak ze flink terug", "Negeer ze voorgoed", "Vertel iedereen hoe slecht ze zijn"],
            correct: "Zegen hen en wens hun het goede toe",
            bijbelplaats: "Romeinen 12:14"
        },
        {
            vraag: "Wat raadt Paulus de christenen aan over hoe ze met elkaar omgaan?",
            antwoorden: ["Blijf bij elkaar uit de buurt", "Heb elkaar oprecht lief", "Wees streng voor elkaar", "Praat niet met elkaar"],
            correct: "Heb elkaar oprecht lief",
            bijbelplaats: "Romeinen 12:9-10"
        },
        {
            vraag: "Voor wie is het goede nieuws (het evangelie) volgens Paulus?",
            antwoorden: ["Alleen Joodse mensen", "Alleen Romeinse mensen", "Iedereen die gelooft", "Alleen rijke mensen"],
            correct: "Iedereen die gelooft",
            bijbelplaats: "Romeinen 1:16"
        },
        {
            vraag: "Paulus schrijft dat je iets van God kunt herkennen in de wereld om je heen. Waarin kun je volgens hem iets van God zien?",
            antwoorden: ["In de natuur die Hij gemaakt heeft", "In de gebouwen van de stad", "In de boeken van geleerden", "In de wetten van de keizer"],
            correct: "In de natuur die Hij gemaakt heeft",
            bijbelplaats: "Romeinen 1:20"
        },
        {
            vraag: "Paulus zegt dat je door te geloven in Jezus iets moois krijgt in je verhouding met God. Wat krijg je dan?",
            antwoorden: ["Vrede met God", "Macht over andere mensen", "Een leven zonder tegenslag", "Rijkdom en aanzien"],
            correct: "Vrede met God",
            bijbelplaats: "Romeinen 5:1"
        },
        {
            vraag: "Paulus schrijft iets bemoedigends voor de mensen die van God houden. Wat doet God volgens hem met alles wat er in hun leven gebeurt?",
            antwoorden: ["Hij laat het meewerken tot iets goeds", "Hij laat het zomaar gebeuren", "God is een straffende God, dus af en toe straft Hij omdat Hij daar zin in heeft", "Hij houdt zich erbuiten"],
            correct: "Hij laat het meewerken tot iets goeds",
            bijbelplaats: "Romeinen 8:28"
        },
        {
            vraag: "Paulus schrijft bemoedigend: 'Als God vóór ons is, wie kan dan tégen ons zijn?' Wat wil hij hiermee duidelijk maken?",
            antwoorden: ["Niemand is sterker dan God, dus we hoeven niet bang te zijn", "Dat we altijd onze zin zullen krijgen", "Dat we nooit meer verdrietig zullen zijn", "Dat God al onze vijanden voor ons zal komen straffen en verslaan"],
            correct: "Niemand is sterker dan God, dus we hoeven niet bang te zijn",
            bijbelplaats: "Romeinen 8:31"
        },
        {
            vraag: "Paulus legt eenvoudig uit hoe je gered wordt: geloof in je hart, en belijd met je mond dat Jezus … is.",
            antwoorden: ["Heer", "koning van Rome", "een profeet", "een engel"],
            correct: "Heer",
            bijbelplaats: "Romeinen 10:9"
        },
        {
            vraag: "Paulus schrijft: iedereen die de naam van de Heer aanroept, zal …?",
            antwoorden: ["gered worden", "alles begrijpen", "nooit meer verdrietig zijn", "een teken zien"],
            correct: "gered worden",
            bijbelplaats: "Romeinen 10:13"
        },
        {
            vraag: "Hoe ontstaat geloof volgens Paulus?",
            antwoorden: ["Door te luisteren naar het woord van God", "Door hard te werken", "Door veel te reizen", "Door zoveel mogelijk goede daden te verzamelen"],
            correct: "Door te luisteren naar het woord van God",
            bijbelplaats: "Romeinen 10:17"
        },
        {
            vraag: "Paulus schrijft: 'Wees blij met wie blij zijn en wees begaan met wie verdriet hebben.' Wat bedoelt hij?",
            antwoorden: ["Leef echt met anderen mee, of ze nu blij of verdrietig zijn", "Bemoei je liever helemaal niet met het verdriet van anderen", "Zeg tegen hen dat het wel meevalt", "Laat hen liever even alleen"],
            correct: "Leef echt met anderen mee, of ze nu blij of verdrietig zijn",
            bijbelplaats: "Romeinen 12:15"
        },
        {
            vraag: "Paulus zegt: blijf elkaar maar één ding altijd schuldig, namelijk dat jullie elkaar …?",
            antwoorden: ["liefhebben", "gehoorzamen", "bewonderen", "volgen"],
            correct: "liefhebben",
            bijbelplaats: "Romeinen 13:8"
        },
        {
            vraag: "Paulus herhaalt een bekende regel uit de Bijbel: heb je … lief als jezelf.",
            antwoorden: ["naaste", "koning", "leraar", "baas"],
            correct: "naaste",
            bijbelplaats: "Romeinen 13:9"
        },
        {
            vraag: "Paulus noemt God aan het eind met een mooie naam: de God van de …?",
            antwoorden: ["hoop", "oorlog", "donkerte", "stilte"],
            correct: "hoop",
            bijbelplaats: "Romeinen 15:13"
        },
        {
            vraag: "Paulus geeft praktische raad: deel met mensen die iets nodig hebben, en wees …?",
            antwoorden: ["gastvrij", "streng", "stil", "snel"],
            correct: "gastvrij",
            bijbelplaats: "Romeinen 12:13"
        },
        {
            vraag: "Paulus zegt: doe niet zomaar mee met alles wat de mensen om je heen doen. Wat moet je volgens hem in plaats daarvan doen?",
            antwoorden: ["Je van binnen laten vernieuwen door God", "Precies blijven zoals je altijd was", "Gewoon doen wat de meeste mensen doen", "Je nergens iets van aantrekken"],
            correct: "Je van binnen laten vernieuwen door God",
            bijbelplaats: "Romeinen 12:2"
        },
        {
            vraag: "Paulus schrijft dat mensen die zich door Gods Geest laten leiden, Gods … zijn.",
            antwoorden: ["kinderen", "dienaren", "soldaten", "gasten"],
            correct: "kinderen",
            bijbelplaats: "Romeinen 8:14"
        }
    ],
    advanced: [
        {
            vraag: "Waarmee heeft God ons hart gevuld, schrijft Paulus?",
            antwoorden: ["Met niets", "Met zijn liefde, door de heilige Geest", "Met wijsheid over alle dingen op aarde", "Met angst"],
            correct: "Met zijn liefde, door de heilige Geest",
            bijbelplaats: "Romeinen 5:5"
        },
        {
            vraag: "Mogen we rustig verkeerde dingen blijven doen, omdat God toch vergeeft?",
            antwoorden: ["Ja, het maakt niet uit", "Ja, want een beetje kwaad kan echt geen kwaad", "Nee, want we leven nu een nieuw leven", "Ja, zolang niemand het ziet"],
            correct: "Nee, want we leven nu een nieuw leven",
            bijbelplaats: "Romeinen 6:1-2"
        },
        {
            vraag: "Paulus merkt dat hij het goede niet altijd zelf voor elkaar krijgt. Wie helpt hem, zegt hij?",
            antwoorden: ["Hijzelf, als hij maar hard genoeg probeert", "Niemand", "Jezus Christus, onze Heer", "De keizer"],
            correct: "Jezus Christus, onze Heer",
            bijbelplaats: "Romeinen 7:24-25"
        },
        {
            vraag: "Waaraan zie je volgens Paulus hoe groot Gods liefde voor ons is?",
            antwoorden: ["Hij gaf zelfs zijn eigen Zoon voor ons", "Hij gaf ons veel geld en bezit", "Hij gaf ons een makkelijk leven zonder zorgen", "Hij gaf alleen aan mensen die het verdienen"],
            correct: "Hij gaf zelfs zijn eigen Zoon voor ons",
            bijbelplaats: "Romeinen 8:32"
        },
        {
            vraag: "Wat raadt Paulus aan als het even moeilijk is?",
            antwoorden: ["Geef het meteen op", "Blijf hopen, wees geduldig en blijf bidden", "Word boos op iedereen", "Doe alsof er niets aan de hand is"],
            correct: "Blijf hopen, wees geduldig en blijf bidden",
            bijbelplaats: "Romeinen 12:12"
        },
        {
            vraag: "Waar moeten gelovigen volgens Paulus hun best voor doen?",
            antwoorden: ["Om afstand te houden van mensen die er anders over denken", "Om altijd gelijk te krijgen", "Voor dingen die vrede brengen en elkaar opbouwen", "Om de baas te kunnen blijven spelen"],
            correct: "Voor dingen die vrede brengen en elkaar opbouwen",
            bijbelplaats: "Romeinen 14:19"
        },
        {
            vraag: "Waarvoor zijn de woorden uit de Bijbel volgens Paulus opgeschreven?",
            antwoorden: ["Om ons te laten schrikken", "Om ons te bemoedigen en hoop te geven", "Om ons bang te maken voor het oordeel van God", "Om ons in de war te brengen"],
            correct: "Om ons te bemoedigen en hoop te geven",
            bijbelplaats: "Romeinen 15:4"
        },
        {
            vraag: "Waarom wilde Paulus zo graag naar de christenen in Rome toe?",
            antwoorden: ["Om er vakantie te vieren", "Om er de baas te spelen", "Om elkaar in het geloof te bemoedigen", "Voor zijn werk, omdat hij daar veel meer kon verkopen"],
            correct: "Om elkaar in het geloof te bemoedigen",
            bijbelplaats: "Romeinen 1:11-12"
        },
        {
            vraag: "Wat zegt Paulus tegen iemand die snel een ander veroordeelt?",
            antwoorden: ["Bedenk dat je zelf ook fouten maakt", "Jij mag oordelen, want jij doet zelf niks fout", "Wijs de ander streng terecht waar anderen bij zijn", "Vertel aan iedereen wat die ander verkeerd deed"],
            correct: "Bedenk dat je zelf ook fouten maakt",
            bijbelplaats: "Romeinen 2:1"
        },
        {
            vraag: "Wat raadt Paulus aan om met je leven te doen?",
            antwoorden: ["Verzamel zoveel mogelijk bezit en rijkdom voor jezelf", "Doe gewoon wat je maar wilt", "Geef jezelf aan God om het goede te doen", "Wacht af tot anderen iets doen"],
            correct: "Geef jezelf aan God om het goede te doen",
            bijbelplaats: "Romeinen 6:13"
        },
        {
            vraag: "Wat doet Jezus volgens Paulus nu voor ons bij God?",
            antwoorden: ["Hij is ons vergeten", "Hij komt voor ons op", "Hij klaagt ons aan", "Hij houdt zich afzijdig"],
            correct: "Hij komt voor ons op",
            bijbelplaats: "Romeinen 8:34"
        },
        {
            vraag: "Hoe mag je God dienen, volgens Paulus?",
            antwoorden: ["Met tegenzin", "Zo weinig mogelijk", "Met vuur en enthousiasme", "Alleen als anderen kijken"],
            correct: "Met vuur en enthousiasme",
            bijbelplaats: "Romeinen 12:11"
        },
        {
            vraag: "Wat raadt Paulus aan over vrede met andere mensen?",
            antwoorden: ["Sluit alleen vrede met de mensen die jij zelf aardig vindt", "Probeer zoveel mogelijk met iedereen in vrede te leven", "Praat liever met niemand", "Vrede is niet belangrijk"],
            correct: "Probeer zoveel mogelijk met iedereen in vrede te leven",
            bijbelplaats: "Romeinen 12:18"
        },
        {
            vraag: "Paulus zegt: laat de daden van het donker achter je en leef in het licht. Wat bedoelt hij?",
            antwoorden: ["Doe verkeerde dingen liever in het geheim", "Slaap zoveel mogelijk", "Leef eerlijk en goed, alsof het klaarlichte dag is", "Blijf binnen tot het buiten weer licht wordt"],
            correct: "Leef eerlijk en goed, alsof het klaarlichte dag is",
            bijbelplaats: "Romeinen 13:12"
        },
        {
            vraag: "Paulus vergelijkt de gelovigen met één lichaam met veel delen. Wat bedoelt hij?",
            antwoorden: ["Ze moeten allemaal precies hetzelfde zijn", "Ze kunnen beter alleen zijn", "Ze horen bij elkaar en hebben elkaar nodig", "Alleen het sterkste deel telt"],
            correct: "Ze horen bij elkaar en hebben elkaar nodig",
            bijbelplaats: "Romeinen 12:4-5"
        }
    ],
    expert: [
        {
            vraag: "In Romeinen 11 vergelijkt Paulus Gods volk met een olijfboom. Wat bedoelt hij als hij zegt dat gelovigen uit andere volken als 'wilde takken' worden geënt?",
            antwoorden: ["Ook mensen die geen Jood zijn, mogen bij Gods volk horen", "Alleen Joden kunnen echt bij God horen", "De oude takken, Israël, tellen niet meer mee", "Paulus had zich vergist, hij bedoelde iets anders"],
            correct: "Ook mensen die geen Jood zijn, mogen bij Gods volk horen",
            bijbelplaats: "Romeinen 11:17-24"
        },
        {
            vraag: "Voor werk krijg je loon. Maar Gods vergeving is geen loon, zegt Paulus. Wat is het dan?",
            antwoorden: ["Iets wat je krijgt nadat je er heel lang voor hebt gewerkt", "Iets wat je koopt", "Een geschenk dat je krijgt door op God te vertrouwen", "Een prijs voor wie wint"],
            correct: "Een geschenk dat je krijgt door op God te vertrouwen",
            bijbelplaats: "Romeinen 4:4-5"
        },
        {
            vraag: "Wat raadt Paulus aan over hoe je over jezelf denkt?",
            antwoorden: ["Denk dat je beter bent dan anderen", "Denk dat je alles alleen kunt", "Denk dat je nooit fouten maakt", "Denk niet te hoog van jezelf"],
            correct: "Denk niet te hoog van jezelf",
            bijbelplaats: "Romeinen 12:3"
        },
        {
            vraag: "Hoe kun je het kwaad volgens Paulus het beste aanpakken?",
            antwoorden: ["Sla nog harder terug", "Loop altijd weg", "Overwin het kwade met het goede", "Doe net zo gemeen terug"],
            correct: "Overwin het kwade met het goede",
            bijbelplaats: "Romeinen 12:21"
        },
        {
            vraag: "Waarom moet je een ander niet te snel veroordelen, zegt Paulus?",
            antwoorden: ["Omdat jij altijd gelijk hebt", "Omdat anderen niet meetellen", "Omdat we allemaal eens voor God zullen staan", "Omdat andere mensen jou anders ook zullen veroordelen"],
            correct: "Omdat we allemaal eens voor God zullen staan",
            bijbelplaats: "Romeinen 14:10-12"
        },
        {
            vraag: "Waar wilde Paulus het liefst het goede nieuws brengen?",
            antwoorden: ["Alleen waar hij al bekend was", "Alleen in zijn eigen stad", "Op plekken waar mensen nog nooit van Christus hadden gehoord", "Alleen in de allergrootste en rijkste steden van het Romeinse rijk"],
            correct: "Op plekken waar mensen nog nooit van Christus hadden gehoord",
            bijbelplaats: "Romeinen 15:20"
        },
        {
            vraag: "Paulus wilde naar een ver land reizen en onderweg de christenen in Rome bezoeken. Naar welk land wilde hij?",
            antwoorden: ["Spanje", "Egypte", "Griekenland", "Italië"],
            correct: "Spanje",
            bijbelplaats: "Romeinen 15:24,28"
        },
        {
            vraag: "Aan het eind van zijn brief beveelt Paulus een vrouw aan die Febe heet. Zij diende de gemeente en was nu op reis naar Rome, waarschijnlijk met deze brief in haar hand. Wat vraagt Paulus aan de Romeinen?",
            antwoorden: ["Ontvang haar goed en help haar met alles wat ze nodig heeft", "Onderzoek eerst of ze wel te vertrouwen is", "Vraag haar eerst om te bewijzen dat ze echt gelovig is", "Laat haar buiten de stad wachten tot Paulus komt"],
            correct: "Ontvang haar goed en help haar met alles wat ze nodig heeft",
            bijbelplaats: "Romeinen 16:1-2"
        },
        {
            vraag: "Welk echtpaar groet Paulus, dat samen met hem in het werk hielp?",
            antwoorden: ["Maria en Jozef", "Zacharias en Elisabet", "Priscilla en Aquila", "Abraham en Sara"],
            correct: "Priscilla en Aquila",
            bijbelplaats: "Romeinen 16:3"
        },
        {
            vraag: "Paulus sprak zijn brief aan de Romeinen hardop uit, terwijl een schrijver die Tertius heette alles opschreef. En dan gebeurt er aan het eind iets bijzonders. Wat doet Tertius?",
            antwoorden: ["Hij schrijft er even zijn eigen groet tussen", "Hij zet zijn handtekening onder de brief", "Hij vraagt Paulus om betaling", "Hij weigert het laatste stuk op te schrijven"],
            correct: "Hij schrijft er even zijn eigen groet tussen",
            bijbelplaats: "Romeinen 16:22"
        },
        {
            vraag: "Helemaal aan het eind van zijn brief schrijft Paulus dat God iets voor de gelovigen kan doen. Wat kan God volgens hem doen?",
            antwoorden: ["Hij kan hen machtiger maken dan alle koningen", "Hij kan hen beroemd maken", "Hij kan hen de baas maken", "Hij kan hen sterk maken in het geloof"],
            correct: "Hij kan hen sterk maken in het geloof",
            bijbelplaats: "Romeinen 16:25"
        }
    ]
};

// =====================================================================
// Vragenpool: Handelingen  (Beginner 14 · Gevorderd 21 · Expert 20)
// Formaat gelijk aan de evangeliën: vraag / antwoorden / correct /
// bijbelplaats. vragenData bestaat hier al, dus toevoegen mag.
// =====================================================================
vragenData["Handelingen"] = {
    beginner: [
        {
            vraag: "Waarover gaat het boek Handelingen vooral?",
            antwoorden: ["Over wat Jezus' volgelingen deden nadat hij naar de hemel ging", "Over de schepping van de wereld", "Over de profeten die het volk lang vóór de tijd van Jezus waarschuwden", "Over de tien geboden"],
            correct: "Over wat Jezus' volgelingen deden nadat hij naar de hemel ging",
            bijbelplaats: "Handelingen 1:8"
        },
        {
            vraag: "Wat gebeurde er met Jezus aan het begin van Handelingen?",
            antwoorden: ["Hij werd geboren in Betlehem", "Hij werd gedoopt in de Jordaan", "Hij ging omhoog naar de hemel", "Hij liep over het water"],
            correct: "Hij ging omhoog naar de hemel",
            bijbelplaats: "Handelingen 1:9"
        },
        {
            vraag: "Op de Pinksterdag kregen de leerlingen iets bijzonders, waar Jezus hen op had laten wachten. Wat kregen zij die dag?",
            antwoorden: ["De heilige Geest", "Een nieuwe boot", "Een mooie mantel", "Een zak brood"],
            correct: "De heilige Geest",
            bijbelplaats: "Handelingen 2:1-4"
        },
        {
            vraag: "Paulus was eerst fel tégen de christenen. Wat gebeurde er onderweg naar Damascus?",
            antwoorden: ["Hij verdwaalde in de woestijn", "Hij viel in een diepe slaap", "Hij ontmoette Jezus in een fel licht en veranderde", "Hij raakte de weg kwijt en kwam pas dagen later aan"],
            correct: "Hij ontmoette Jezus in een fel licht en veranderde",
            bijbelplaats: "Handelingen 9:3-6"
        },
        {
            vraag: "Na zijn opstanding verscheen Jezus nog een tijd aan zijn leerlingen voordat hij naar de hemel ging. Hoeveel dagen?",
            antwoorden: ["Drie dagen", "Honderd dagen", "Veertig dagen", "Zeven dagen"],
            correct: "Veertig dagen",
            bijbelplaats: "Handelingen 1:3"
        },
        {
            vraag: "Sommige leiders werden boos en zeiden dat de apostelen moesten stoppen met vertellen over Jezus. Wat deden Petrus en de anderen?",
            antwoorden: ["Ze stopten meteen", "Ze verstopten zich voorgoed", "Ze bleven het toch doen", "Ze verhuisden naar een ander land"],
            correct: "Ze bleven het toch doen",
            bijbelplaats: "Handelingen 5:29,42"
        },
        {
            vraag: "Nadat Jezus naar de hemel was gegaan, wachtten de leerlingen op de heilige Geest. Wat deden ze in die tijd vaak samen?",
            antwoorden: ["Ze gingen vissen", "Ze kwamen bij elkaar om te bidden", "Ze maakten ruzie", "Ze namen de tijd om uit te rusten"],
            correct: "Ze kwamen bij elkaar om te bidden",
            bijbelplaats: "Handelingen 1:14"
        },
        {
            vraag: "Petrus kreeg een bijzonder visioen van een groot laken vol allerlei dieren. Wat leerde God hem daarmee?",
            antwoorden: ["Dat hij meer moest eten", "Dat alle mensen erbij mogen horen", "Dat hij moest gaan reizen", "Dat hij alleen nog groenten mocht eten"],
            correct: "Dat alle mensen erbij mogen horen",
            bijbelplaats: "Handelingen 10:9-15",
            uitleg: "In het visioen zei God dat Petrus dieren die volgens de Joodse wet verboden waren om te eten, nu wél mocht eten. Kort daarna begreep Petrus waar het God echt om ging: net zoals Hij dat eten niet langer afkeurde, wilde God ook geen enkel mens buitensluiten — ook mensen die geen Jood waren, mogen erbij horen."
        },
        {
            vraag: "In Samaria vertelde Filippus over Jezus en genas hij zieke mensen. Hoe reageerde de stad?",
            antwoorden: ["De mensen werden boos", "Niemand luisterde", "Er was grote blijdschap", "Ze stuurden hem weg"],
            correct: "Er was grote blijdschap",
            bijbelplaats: "Handelingen 8:5-8"
        },
        {
            vraag: "Paulus mocht zich verdedigen voor koning Agrippa en andere belangrijke mensen. Waarover bleef hij vertellen?",
            antwoorden: ["Over zijn reizen", "Over Jezus", "Over zichzelf", "Over het weer"],
            correct: "Over Jezus",
            bijbelplaats: "Handelingen 26:22-23"
        },
        {
            vraag: "In de stad Lydda genas Petrus een man, Eneas, die al acht jaar verlamd op bed lag. Wat zei Petrus tegen hem?",
            antwoorden: ["\"Kom morgen maar terug\"", "\"Jezus Christus geneest je, sta op\"", "\"Ik kan niets voor je doen\"", "\"Roep eerst een dokter\""],
            correct: "\"Jezus Christus geneest je, sta op\"",
            bijbelplaats: "Handelingen 9:33-34"
        },
        {
            vraag: "Nadat het schip bij het eiland Malta was vergaan, kwamen alle opvarenden veilig aan land. Paulus bleef daar nog een tijd, en hij deed iets goeds voor de mensen op het eiland. Wat deed hij voor hen?",
            antwoorden: ["Hij bouwde een nieuw schip", "Hij vertrok meteen", "Hij genas veel zieke mensen", "Hij bleef op het strand liggen"],
            correct: "Hij genas veel zieke mensen",
            bijbelplaats: "Handelingen 28:8-9"
        },
        {
            vraag: "Toen Paulus en Barnabas door de heilige Geest werden uitgezonden, wat was hun taak?",
            antwoorden: ["Naar andere landen reizen om over Jezus te vertellen", "Een tempel bouwen", "Soldaat worden", "In Jeruzalem blijven om daar de grote tempel te bewaken"],
            correct: "Naar andere landen reizen om over Jezus te vertellen",
            bijbelplaats: "Handelingen 13:2-4"
        },
        {
            vraag: "Barnabas verkocht een stuk land en bracht het geld naar de apostelen om arme mensen te helpen. Wat voor man was hij daardoor?",
            antwoorden: ["Behulpzaam en vrijgevig", "Hebberig en gierig", "Lui en onverschillig", "Streng en koud"],
            correct: "Behulpzaam en vrijgevig",
            bijbelplaats: "Handelingen 4:36-37"
        }
    ],
    advanced: [
        {
            vraag: "Wie schreef het boek Handelingen?",
            antwoorden: ["Petrus", "Lucas", "Tomas", "Marcus"],
            correct: "Lucas",
            bijbelplaats: "Handelingen 1:1"
        },
        {
            vraag: "Wat konden de leerlingen ineens doen toen ze de heilige Geest kregen?",
            antwoorden: ["Onzichtbaar worden", "In andere talen spreken", "Vliegen als een vogel", "In de toekomst kijken"],
            correct: "In andere talen spreken",
            bijbelplaats: "Handelingen 2:4"
        },
        {
            vraag: "Wie hield op de Pinksterdag een grote toespraak voor de menigte?",
            antwoorden: ["Petrus", "Paulus", "Lucas", "Tomas"],
            correct: "Petrus",
            bijbelplaats: "Handelingen 2:14"
        },
        {
            vraag: "Hoe heette Paulus eerst, voordat hij Paulus genoemd werd?",
            antwoorden: ["Simon", "Saulus", "Silas", "Stefanus"],
            correct: "Saulus",
            bijbelplaats: "Handelingen 13:9"
        },
        {
            vraag: "Petrus zat gevangen. Wat gebeurde er 's nachts in de gevangenis?",
            antwoorden: ["Hij groef zelf een tunnel", "Hij bleef daar voorgoed", "Een engel hielp hem ontsnappen", "Hij maakte ruzie met de wachters"],
            correct: "Een engel hielp hem ontsnappen",
            bijbelplaats: "Handelingen 12:7-10"
        },
        {
            vraag: "Wat deed Paulus in een groot deel van het boek Handelingen?",
            antwoorden: ["Hij reisde naar veel steden om over Jezus te vertellen", "Hij bleef in Jeruzalem om de eerste gemeente te leiden", "Hij trok zich terug in de woestijn om te bidden en te vasten", "Hij werd leraar in één synagoge en bleef daar wonen"],
            correct: "Hij reisde naar veel steden om over Jezus te vertellen",
            bijbelplaats: "Handelingen 13–28"
        },
        {
            vraag: "Toen Jezus omhoogging naar de hemel, stonden de leerlingen hem na te kijken. Opeens stonden er twee mannen in witte kleren bij hen, die iets tegen hen zeiden. Wat zeiden die twee mannen?",
            antwoorden: ["Dat ze Jezus nooit meer zouden zien", "Dat Jezus op een dag net zo terug zal komen", "Dat ze meteen moesten verhuizen", "Dat ze het geheim moesten houden"],
            correct: "Dat Jezus op een dag net zo terug zal komen",
            bijbelplaats: "Handelingen 1:10-11"
        },
        {
            vraag: "Hoe leefden de allereerste christenen met elkaar?",
            antwoorden: ["Ze kwamen alleen op de sabbat een enkele keer bijeen", "Ze woonden ver uit elkaar", "Ze deelden alles en kwamen vaak samen", "Ze spraken nooit af"],
            correct: "Ze deelden alles en kwamen vaak samen",
            bijbelplaats: "Handelingen 2:44-46"
        },
        {
            vraag: "Bij de tempelpoort zat een man die niet kon lopen. Wat deed Petrus voor hem?",
            antwoorden: ["Hij gaf hem goud", "Hij liep voorbij", "Hij stuurde hem door naar de priesters in de tempel", "Hij genas hem in de naam van Jezus"],
            correct: "Hij genas hem in de naam van Jezus",
            bijbelplaats: "Handelingen 3:6-8"
        },
        {
            vraag: "Filippus ontmoette een man uit Ethiopië die uit de Bijbel zat te lezen, maar het niet begreep. Wat deed Filippus?",
            antwoorden: ["Hij legde uit dat het over Jezus ging en doopte hem", "Hij liet hem alleen", "Hij lachte hem uit", "Hij las het boek voor maar legde er verder niets over uit"],
            correct: "Hij legde uit dat het over Jezus ging en doopte hem",
            bijbelplaats: "Handelingen 8:30-38"
        },
        {
            vraag: "Cornelius was een Romeinse legerofficier. Wat leerde Petrus door hem?",
            antwoorden: ["Dat alleen Joden erbij horen", "Dat het goede nieuws óók voor niet-Joden is", "Dat hij soldaat moest blijven", "Dat Romeinse soldaten geen christen mochten worden"],
            correct: "Dat het goede nieuws óók voor niet-Joden is",
            bijbelplaats: "Handelingen 10:34-35"
        },
        {
            vraag: "Na de aardbeving moest de gevangenbewaarder een keuze maken. Wat deed hij?",
            antwoorden: ["Hij liep boos weg", "Hij ging in Jezus geloven en liet zich dopen", "Hij sloot de deuren weer", "Hij vluchtte uit angst de stad uit, ver bij de gevangenis vandaan"],
            correct: "Hij ging in Jezus geloven en liet zich dopen",
            bijbelplaats: "Handelingen 16:30-34"
        },
        {
            vraag: "Op zijn reis naar Rome kwam Paulus in een zware storm op zee. Wat gebeurde er met het schip en de mensen?",
            antwoorden: ["Iedereen verdronk", "Het schip bleef heel", "Het schip verging, maar alle mensen kwamen veilig aan land", "Ze wisten het schip nog net veilig de haven binnen te varen"],
            correct: "Het schip verging, maar alle mensen kwamen veilig aan land",
            bijbelplaats: "Handelingen 27:41-44"
        },
        {
            vraag: "In Athene vond Paulus een altaar met het opschrift 'voor een onbekende god'. Wat deed hij daarmee?",
            antwoorden: ["Hij gebruikte het om te vertellen wie die onbekende God echt is", "Hij liet op diezelfde plek meteen een nieuw altaar voor de ware God bouwen", "Hij liep er zwijgend aan voorbij", "Hij begon die onbekende god zelf te aanbidden"],
            correct: "Hij gebruikte het om te vertellen wie die onbekende God echt is",
            bijbelplaats: "Handelingen 17:22-23"
        },
        {
            vraag: "Stefanus, een van de eerste christenen, werd aangevallen door boze mensen omdat hij over Jezus vertelde. Wat deed hij toen?",
            antwoorden: ["Hij riep dat God hen zwaar zou straffen hiervoor", "Hij riep de soldaten", "Hij bad of God de mensen wilde vergeven", "Hij rende weg"],
            correct: "Hij bad of God de mensen wilde vergeven",
            bijbelplaats: "Handelingen 7:59-60"
        },
        {
            vraag: "Een man, Simon, wilde de kracht van de heilige Geest met geld kopen. Wat zei Petrus tegen hem?",
            antwoorden: ["Dat hij meer moest betalen", "Dat Gods gave niet te koop is", "Dat het prima was", "Dat hij later terug moest komen"],
            correct: "Dat Gods gave niet te koop is",
            bijbelplaats: "Handelingen 8:18-20"
        },
        {
            vraag: "Op het eiland Malta beet er een gevaarlijke slang in Paulus' hand. Wat gebeurde er met hem?",
            antwoorden: ["Hij werd heel ziek", "Hij viel flauw", "Er gebeurde niets, hij bleef ongedeerd", "Hij werd zo ziek dat hij er bijna aan doodging"],
            correct: "Er gebeurde niets, hij bleef ongedeerd",
            bijbelplaats: "Handelingen 28:3-6"
        },
        {
            vraag: "Wie stuurde Filippus naar de eenzame weg door de woestijn, waar hij de man uit Ethiopië ontmoette?",
            antwoorden: ["De keizer", "Petrus", "Een engel van de Heer", "De hogepriester in Jeruzalem"],
            correct: "Een engel van de Heer",
            bijbelplaats: "Handelingen 8:26"
        },
        {
            vraag: "Cornelius kreeg bezoek van een engel. Die zei dat hij mannen naar de stad Joppe moest sturen om iemand te laten halen. Wie moest Cornelius laten komen?",
            antwoorden: ["Paulus", "Petrus", "Filippus", "Lucas"],
            correct: "Petrus",
            bijbelplaats: "Handelingen 10:3-5"
        },
        {
            vraag: "Omdat Paulus een Romeins burger was, mocht hij iets bijzonders vragen. Wat vroeg hij?",
            antwoorden: ["Om door de Joodse raad in Jeruzalem zelf berecht te worden", "Om met rust gelaten te worden", "Om zijn zaak door de keizer in Rome te laten behandelen", "Om voor geld vrijgekocht te kunnen worden"],
            correct: "Om zijn zaak door de keizer in Rome te laten behandelen",
            bijbelplaats: "Handelingen 25:11"
        },
        {
            vraag: "Een wijze leraar, Gamaliël, gaf de leiders advies over de apostelen. Wat zei hij?",
            antwoorden: ["Laat hen met rust; als het van God komt, houd je het toch niet tegen", "Verbied hun voorgoed om ooit nog ergens over Jezus te spreken", "Stuur hen het land uit", "Doe net of ze niet bestaan"],
            correct: "Laat hen met rust; als het van God komt, houd je het toch niet tegen",
            bijbelplaats: "Handelingen 5:34-39"
        }
    ],
    expert: [
        {
            vraag: "Na het verraad van Judas moesten de elf apostelen iemand kiezen die zijn plaats zou innemen. Er bleven twee kandidaten over, en het werd Mattias. Maar hóe maakten zij die keuze?",
            antwoorden: ["Ze baden, en lieten daarna het lot beslissen", "Ze lieten de hele gemeente stemmen", "Petrus wees hem persoonlijk aan", "Ze kozen degene die het langst met Jezus was meegereisd"],
            correct: "Ze baden, en lieten daarna het lot beslissen",
            bijbelplaats: "Handelingen 1:23-26"
        },
        {
            vraag: "De leerlingen waren op de Pinksterdag met elkaar in één huis bij elkaar. Opeens was er iets te horen én iets te zien. Wat gebeurde er toen?",
            antwoorden: ["Regen en onweer", "Muziek en gezang", "Een geluid als harde wind en vlammetjes als van vuur", "Een aardbeving die het hele huis flink deed schudden"],
            correct: "Een geluid als harde wind en vlammetjes als van vuur",
            bijbelplaats: "Handelingen 2:2-3"
        },
        {
            vraag: "Hoeveel mensen gingen op de Pinksterdag in Jezus geloven en lieten zich dopen?",
            antwoorden: ["Ongeveer tien", "Ongeveer drieduizend", "Ongeveer honderd", "Bijna niemand"],
            correct: "Ongeveer drieduizend",
            bijbelplaats: "Handelingen 2:41"
        },
        {
            vraag: "In de stad Joppe maakte Petrus een vrouw weer levend die veel goeds had gedaan voor arme mensen. Hoe heette zij?",
            antwoorden: ["Maria", "Lydia, de vrouw die purperstof verkocht", "Tabita (ook Dorkas genoemd)", "Marta"],
            correct: "Tabita (ook Dorkas genoemd)",
            bijbelplaats: "Handelingen 9:36-41"
        },
        {
            vraag: "Nadat Saulus Jezus had ontmoet, kon hij een tijdje niet zien. Wie hielp hem zodat hij weer kon zien?",
            antwoorden: ["Petrus", "Ananias", "Barnabas", "Stefanus"],
            correct: "Ananias",
            bijbelplaats: "Handelingen 9:17-18"
        },
        {
            vraag: "In welke stad werden de volgelingen van Jezus voor het eerst \"christenen\" genoemd?",
            antwoorden: ["Jeruzalem", "Rome", "Antiochië", "Athene"],
            correct: "Antiochië",
            bijbelplaats: "Handelingen 11:26"
        },
        {
            vraag: "Wie reisde in het begin samen met Paulus om mensen over Jezus te vertellen?",
            antwoorden: ["Petrus", "Johannes", "Tomas", "Barnabas"],
            correct: "Barnabas",
            bijbelplaats: "Handelingen 13:2-3"
        },
        {
            vraag: "Lydia was de eerste in de stad Filippi die in Jezus ging geloven. Wat was haar werk?",
            antwoorden: ["Ze was kapster", "Ze verkocht kostbare purperen stof", "Ze werkte voor een rijke vrouw en hielp in de huishouding", "Ze was koningin"],
            correct: "Ze verkocht kostbare purperen stof",
            bijbelplaats: "Handelingen 16:14"
        },
        {
            vraag: "Paulus en Silas zaten gevangen in Filippi. Wat deden ze midden in de nacht?",
            antwoorden: ["Ze sliepen diep", "Ze baden en zongen liederen voor God", "Ze waren boos en schreeuwden zo hard dat de hele gevangenis hen kon horen", "Ze bedachten een plan om te vluchten"],
            correct: "Ze baden en zongen liederen voor God",
            bijbelplaats: "Handelingen 16:25"
        },
        {
            vraag: "Wat gebeurde er toen Paulus en Silas in de gevangenis zongen?",
            antwoorden: ["Andere gevangenen begonnen mee te zingen", "De wachters vielen in slaap", "Er kwam een aardbeving en de deuren sprongen open", "Andere gevangenen werden boos en vroegen of ze wilden stoppen met zingen"],
            correct: "Er kwam een aardbeving en de deuren sprongen open",
            bijbelplaats: "Handelingen 16:26"
        },
        {
            vraag: "Waar is Paulus aan het eind van het boek Handelingen?",
            antwoorden: ["In Jeruzalem", "Terug op reis door de steden van Klein-Azië", "In Rome, waar hij de mensen over Jezus vertelt", "Terug in zijn geboorteplaats Tarsus"],
            correct: "In Rome, waar hij de mensen over Jezus vertelt",
            bijbelplaats: "Handelingen 28:30-31"
        },
        {
            vraag: "De eerste christenen kozen zeven mensen uit om te helpen, zodat het eten eerlijk werd verdeeld onder arme mensen. Wie was een van hen?",
            antwoorden: ["Marcus", "Paulus", "Stefanus", "Lucas"],
            correct: "Stefanus",
            bijbelplaats: "Handelingen 6:5"
        },
        {
            vraag: "Op zijn reizen nam Paulus een jonge helper mee die in Jezus geloofde. Hoe heette deze jonge man?",
            antwoorden: ["Tomas", "Timoteüs", "Judas", "Marcus"],
            correct: "Timoteüs",
            bijbelplaats: "Handelingen 16:1-3"
        },
        {
            vraag: "Toen Petrus uit de gevangenis was ontsnapt, klopte hij aan bij een huis. Een meisje, Rhode, herkende zijn stem. Wat deed ze van blijdschap?",
            antwoorden: ["Ze deed meteen open", "Ze rende eerst weg om het te vertellen en vergat de deur open te doen", "Ze dacht dat het zijn geest was en durfde de deur niet voor hem open te doen", "Ze geloofde niet dat het Petrus was en deed de deur op slot"],
            correct: "Ze rende eerst weg om het te vertellen en vergat de deur open te doen",
            bijbelplaats: "Handelingen 12:13-14"
        },
        {
            vraag: "In de stad Lystra genas Paulus een man die nooit had kunnen lopen. Wat dachten de mensen toen?",
            antwoorden: ["Dat het toeval was", "Dat Paulus en Barnabas goden waren", "Dat Paulus een goede dokter was", "Dat het niet echt was en dat het kwakzalvers waren"],
            correct: "Dat Paulus en Barnabas goden waren",
            bijbelplaats: "Handelingen 14:11",
            uitleg: "De mensen in Lystra spraken hun eigen streektaal en riepen dat de goden als mensen naar hen toe waren gekomen: Barnabas noemden zij Zeus en Paulus Hermes, omdat hij het woord voerde. De priester van Zeus kwam zelfs met stieren en bloemenkransen aanzetten om offers te brengen. Paulus en Barnabas schrokken daar zo van dat ze hun kleren scheurden en riepen dat zij gewone mensen waren, net als de anderen. Een kwakzalver, uit een van de andere antwoorden, is iemand die doet alsof hij zieke mensen kan genezen terwijl hij dat helemaal niet kan. Het is een oud woord dat ook in de Bijbel voorkomt: in het boek Job noemt Job zijn vrienden zo, omdat ze wel raad geven maar hem niet echt helpen."
        },
        {
            vraag: "In Troas viel een jongen, Eutychus, tijdens een lange toespraak in slaap en viel uit een hoog raam. Wat deed Paulus?",
            antwoorden: ["Hij praatte gewoon door en deed alsof er niks aan de hand was", "Hij bad voor de jongen, en op zijn gebed kwam de jongen weer tot leven", "Hij schrok en vluchtte weg", "Hij riep een dokter"],
            correct: "Hij bad voor de jongen, en op zijn gebed kwam de jongen weer tot leven",
            bijbelplaats: "Handelingen 20:9-12"
        },
        {
            vraag: "Vlak nadat Saulus in Jezus ging geloven, wilden boze mensen hem in Damascus kwaad doen. Hoe ontsnapte hij over de stadsmuur?",
            antwoorden: ["Door een poort die open stond", "Via een tunnel", "In een mand werd hij naar beneden gelaten", "Over een brug, waar hij ongezien kon ontsnappen"],
            correct: "In een mand werd hij naar beneden gelaten",
            bijbelplaats: "Handelingen 9:23-25"
        },
        {
            vraag: "De christenen in Jeruzalem waren eerst bang voor Saulus. Wie nam het voor hem op en stelde hem aan de anderen voor?",
            antwoorden: ["Petrus", "Barnabas", "Stefanus", "Lucas"],
            correct: "Barnabas",
            bijbelplaats: "Handelingen 9:26-27"
        },
        {
            vraag: "De profeet Agabus kwam naar de gemeente in Antiochië en voorspelde dat er iets ergs zou komen over het hele Romeinse rijk. Wat voorspelde hij?",
            antwoorden: ["Een grote storm", "Een grote hongersnood", "Een oorlog", "Een grote plaag"],
            correct: "Een grote hongersnood",
            bijbelplaats: "Handelingen 11:28"
        },
        {
            vraag: "Toen Paulus gevangenzat, hoorde zijn jonge neef van een plan om Paulus kwaad te doen. Wat deed hij?",
            antwoorden: ["Hij zei niets", "Hij liep weg", "Hij waarschuwde Paulus en de soldaten", "Hij stond aan de kant van deze slechte mensen"],
            correct: "Hij waarschuwde Paulus en de soldaten",
            bijbelplaats: "Handelingen 23:16"
        }
    ]
};

// --- Uren van de dag: Pinksteren (verplaatst vanuit de Lucas-pool) -----------
// Hoort inhoudelijk bij Handelingen (Handelingen 2:15). Staat hier, ná de
// Handelingen-definitie, omdat vragenData["Handelingen"] hierboven pas ontstaat.
vragenData["Handelingen"].expert.push(
    {
        vraag: "Toen spotters dachten dat de leerlingen dronken waren, zei Petrus dat dat niet kon: 'het is pas het derde uur van de dag.' Hoe laat op de dag was dat ongeveer?",
        antwoorden: [
            "Ongeveer negen uur 's ochtends",
            "Rond het middaguur",
            "Drie uur 's middags",
            "Vlak voor zonsondergang"
        ],
        correct: "Ongeveer negen uur 's ochtends",
        bijbelplaats: "Handelingen 2:15",
        uitleg: "De Joden telden de uren vanaf zonsopgang, dus het 'derde uur' is ongeveer negen uur 's ochtends — veel te vroeg om dronken te zijn. Daarom was het een goed weerwoord."
    }
);

// =====================================================================
// Vragenpool: 1 & 2 Korintiërs  (Beginner 17 · Gevorderd 15 · Expert 12)
// De sleutel "1 & 2 Korintiërs" is exact de `naam` uit boekenplanken.paulus,
// zodat openBoek(boek.naam) de juiste pool vindt. vragenData bestaat hier al.
// =====================================================================
vragenData["1 & 2 Korintiërs"] = {
    beginner: [
        {
            vraag: "Wie schreef de brieven 1 en 2 Korintiërs?",
            antwoorden: ["Petrus", "Paulus", "Johannes", "Lucas"],
            correct: "Paulus",
            bijbelplaats: "1 Korintiërs 1:1"
        },
        {
            vraag: "Aan welke stad schreef Paulus deze brieven?",
            antwoorden: ["Rome", "Efeze", "Korinte", "Athene"],
            correct: "Korinte",
            bijbelplaats: "1 Korintiërs 1:2",
            kist: false
        },
        {
            vraag: "Hoeveel brieven aan de Korintiërs staan er in de Bijbel?",
            antwoorden: ["Eén", "Twee", "Drie", "Vijf"],
            correct: "Twee",
            bijbelplaats: "1 Korintiërs 1:1 · 2 Korintiërs 1:1"
        },
        {
            vraag: "Paulus schrijft een beroemd stuk over de liefde. Wat zegt hij dat liefde is?",
            antwoorden: ["Geduldig en vriendelijk", "Sterk en dapper", "Streng maar rechtvaardig", "Vrolijk en grappig"],
            correct: "Geduldig en vriendelijk",
            bijbelplaats: "1 Korintiërs 13:4-5"
        },
        {
            vraag: "Paulus zegt dat de gemeente samen één lichaam vormt, met veel verschillende delen. Wat wil hij daarmee zeggen?",
            antwoorden: ["Iedereen hoort erbij en heeft elkaar nodig", "Ieder deel moet vooral zijn eigen ding doen", "De belangrijkste delen zitten vanbinnen", "Een groot lichaam werkt beter dan een klein"],
            correct: "Iedereen hoort erbij en heeft elkaar nodig",
            bijbelplaats: "1 Korintiërs 12:12"
        },
        {
            vraag: "Paulus plantte en iemand anders gaf water. Maar wie liet alles écht groeien?",
            antwoorden: ["Paulus zelf", "De keizer", "God", "Niemand"],
            correct: "God",
            bijbelplaats: "1 Korintiërs 3:6"
        },
        {
            vraag: "Wat moeten de christenen volgens Paulus met alles doen?",
            antwoorden: ["Alles met liefde doen", "Alles snel doen", "Alles alleen doen", "Alles voor zichzelf houden"],
            correct: "Alles met liefde doen",
            bijbelplaats: "1 Korintiërs 16:14"
        },
        {
            vraag: "Paulus zegt dat wie bij Christus hoort, helemaal nieuw wordt. Hoe noemt hij dat?",
            antwoorden: ["Een nieuwe schepping", "Een beter mens", "Een tweede kans", "Een nieuw lid van de kerk"],
            correct: "Een nieuwe schepping",
            bijbelplaats: "2 Korintiërs 5:17"
        },
        {
            vraag: "Paulus schrijft over het geven van geld om anderen te helpen. Hoe kun je dat het beste doen?",
            antwoorden: ["Met tegenzin", "Mopperend", "Blij en van harte", "Alleen als anderen het zien"],
            correct: "Blij en van harte",
            bijbelplaats: "2 Korintiërs 9:7"
        },
        {
            vraag: "Paulus maakte veel moeilijke dingen mee om over Jezus te vertellen. Wat overkwam hem onder andere?",
            antwoorden: ["Hij leed schipbreuk en was vaak in gevaar", "Hij had altijd vakantie", "Hij bleef veilig thuis", "Hij mocht rustig in een mooi groot paleis wonen"],
            correct: "Hij leed schipbreuk en was vaak in gevaar",
            bijbelplaats: "2 Korintiërs 11:25-26"
        },
        {
            vraag: "Paulus zegt dat je alles wat je doet, voor iemand kunt doen. Voor wie?",
            antwoorden: ["Alleen voor jezelf", "Voor de keizer", "Voor God, om hem eer te geven", "Voor de keizer en de machtige leiders van het land"],
            correct: "Voor God, om hem eer te geven",
            bijbelplaats: "1 Korintiërs 10:31"
        },
        {
            vraag: "Over de gaven (talenten) in de gemeente zegt Paulus: er zijn er veel, maar...",
            antwoorden: ["ze komen allemaal van dezelfde Geest", "alleen Paulus heeft ze", "ze zijn niet belangrijk", "je krijgt ze pas als je heel oud bent geworden"],
            correct: "ze komen allemaal van dezelfde Geest",
            bijbelplaats: "1 Korintiërs 12:4"
        },
        {
            vraag: "De gemeenten in Macedonië waren zelf arm, maar deden toch iets bijzonders. Wat deden zij?",
            antwoorden: ["Ze hielden alles voor zichzelf", "Ze gaven royaal om anderen te helpen", "Ze vroegen zelf om hulp", "Ze deden niets"],
            correct: "Ze gaven royaal om anderen te helpen",
            bijbelplaats: "2 Korintiërs 8:1-3"
        },
        {
            vraag: "Paulus noemt de gelovigen \"gezanten\" (boodschappers) van Christus. Wat is hun taak?",
            antwoorden: ["De mensen dwingen om voortaan in Jezus te geloven", "Geld inzamelen voor zichzelf", "Namens Christus mensen oproepen om vrede met God te sluiten", "Alleen reizen"],
            correct: "Namens Christus mensen oproepen om vrede met God te sluiten",
            bijbelplaats: "2 Korintiërs 5:20"
        },
        {
            vraag: "Wat raadt Paulus de gelovigen aan om te doen, om dichtbij God te blijven?",
            antwoorden: ["Zoveel mogelijk goede daden aan iedereen laten zien", "Zichzelf eerlijk onderzoeken in het geloof", "Nergens over nadenken", "Alleen aan zichzelf denken"],
            correct: "Zichzelf eerlijk onderzoeken in het geloof",
            bijbelplaats: "2 Korintiërs 13:5"
        },
        {
            vraag: "Paulus noemt zichzelf en Apollos \"medewerkers\". Met wie werken ze samen?",
            antwoorden: ["Met de keizer", "Met God", "Met de koning", "Met niemand"],
            correct: "Met God",
            bijbelplaats: "1 Korintiërs 3:9"
        }
    ],
    advanced: [
        {
            vraag: "Paulus vergelijkt het geloof met een wedstrijd. Wat moet je doen om de prijs te winnen?",
            antwoorden: ["Stoppen halverwege", "Wachten op anderen", "Doorzetten, net als een hardloper die doorrent", "Alleen meedoen als je zeker weet dat je zult winnen"],
            correct: "Doorzetten, net als een hardloper die doorrent",
            bijbelplaats: "1 Korintiërs 9:24"
        },
        {
            vraag: "Paulus zegt aan het eind: blijf waakzaam en sterk. Wat raadt hij aan?",
            antwoorden: ["Geef snel op", "Sta vast in het geloof en wees moedig", "Pas je aan iedereen aan om vooral geen ruzie te krijgen", "Vertrouw op niemand"],
            correct: "Sta vast in het geloof en wees moedig",
            bijbelplaats: "1 Korintiërs 16:13"
        },
        {
            vraag: "Paulus en de gelovigen spaarden geld op om iets goeds te doen. Waarvoor?",
            antwoorden: ["Om een paleis te bouwen", "Om er zelf beter van te worden", "Om arme gelovigen in Jeruzalem te helpen", "Om een groot nieuw schip te kopen voor hun reizen"],
            correct: "Om arme gelovigen in Jeruzalem te helpen",
            bijbelplaats: "1 Korintiërs 16:1-3"
        },
        {
            vraag: "De mensen in Korinte kozen partij: \"ik ben van Paulus\", \"ik ben van Apollos\". Wat vond Paulus daarvan?",
            antwoorden: ["Dat ze allemaal partij voor hem moesten kiezen", "Dat ze juist één moesten zijn, niet verdeeld", "Dat ze voor hem moesten kiezen", "Dat het niet uitmaakte"],
            correct: "Dat ze juist één moesten zijn, niet verdeeld",
            bijbelplaats: "1 Korintiërs 1:12-13"
        },
        {
            vraag: "Paulus zegt dat je lichaam een heilige plek is, waarin Gods Geest woont. Wat betekent dat volgens hem?",
            antwoorden: ["Dat je met respect en zorg met je lichaam en je leven omgaat", "Dat je nooit meer iets mag aanraken wat vies is", "Dat je voortaan alleen nog zachtjes en heel rustig mag praten", "Dat je je lichaam nooit meer moe mag maken"],
            correct: "Dat je met respect en zorg met je lichaam en je leven omgaat",
            bijbelplaats: "1 Korintiërs 6:19"
        },
        {
            vraag: "Paulus zegt: als je alles kunt, maar je hebt geen liefde, dan...",
            antwoorden: ["ben je niets", "ben je toch nog knap bezig", "maakt het eigenlijk niet uit", "heb je in elk geval veel bereikt"],
            correct: "ben je niets",
            bijbelplaats: "1 Korintiërs 13:2"
        },
        {
            vraag: "Bij het avondmaal — bij katholieken de eucharistie — delen de gelovigen brood en wijn, zoals Jezus dat bij het laatste avondmaal heeft ingesteld. Waar gaat het daarbij vooral om?",
            antwoorden: ["Om Jezus, die zijn lichaam en bloed voor ons heeft gegeven", "Om de schepping van de wereld", "Om de tocht van het volk door de woestijn", "Om God te danken voor de oogst en het dagelijkse eten"],
            correct: "Om Jezus, die zijn lichaam en bloed voor ons heeft gegeven",
            bijbelplaats: "1 Korintiërs 11:23-26"
        },
        {
            vraag: "Paulus zegt: kennis alleen maakt je trots, maar er is iets anders dat mensen echt opbouwt. Wat is dat volgens hem?",
            antwoorden: ["Liefde", "Geld", "Macht", "Hard werken"],
            correct: "Liefde",
            bijbelplaats: "1 Korintiërs 8:1"
        },
        {
            vraag: "Paulus zegt dat gelovigen leven door op God te vertrouwen, en niet door iets anders. Waardoor niet?",
            antwoorden: ["Door wat ze met hun ogen kunnen zien", "Door heel rijk te zijn", "Door heel sterk te zijn", "Door alles wat de wereld hun te bieden heeft"],
            correct: "Door wat ze met hun ogen kunnen zien",
            bijbelplaats: "2 Korintiërs 5:7"
        },
        {
            vraag: "God zei tegen Paulus toen hij het moeilijk had: \"Mijn genade is genoeg.\" Wanneer is Gods kracht juist sterk?",
            antwoorden: ["Juist als wij zwak zijn", "Alleen als wij sterk zijn", "Alleen bij belangrijke mensen", "Nooit"],
            correct: "Juist als wij zwak zijn",
            bijbelplaats: "2 Korintiërs 12:9"
        },
        {
            vraag: "Welke gave noemt Paulus de allergrootste, die altijd zal blijven?",
            antwoorden: ["Het uitleggen van dromen", "Kennis", "De liefde", "Wonderen doen"],
            correct: "De liefde",
            bijbelplaats: "1 Korintiërs 13:13"
        },
        {
            vraag: "Paulus schept niet op over zichzelf, maar ergens anders over. Waarover wel?",
            antwoorden: ["Over alle wonderen die hij zelf heeft verricht", "Over zijn eigen kracht", "Over de Heer en over wat God door hem doet", "Over zijn reizen"],
            correct: "Over de Heer en over wat God door hem doet",
            bijbelplaats: "2 Korintiërs 10:17"
        },
        {
            vraag: "Zijn de gaven van de Geest er voor jezelf, of voor iets anders?",
            antwoorden: ["Voor het goede van iedereen samen", "Alleen voor jezelf", "Om mee op te scheppen", "Om anderen jaloers te maken"],
            correct: "Voor het goede van iedereen samen",
            bijbelplaats: "1 Korintiërs 12:7"
        },
        {
            vraag: "Wat zegt Paulus over de zwakste of minste delen van het lichaam?",
            antwoorden: ["Ze tellen niet mee", "Ze mogen gerust worden weggelaten uit het lichaam", "Ze zijn juist heel belangrijk en nodig", "Ze worden nooit gezien"],
            correct: "Ze zijn juist heel belangrijk en nodig",
            bijbelplaats: "1 Korintiërs 12:22"
        },
        {
            vraag: "Paulus zegt dat God iets moois heeft klaargemaakt voor wie van hem houden. Hoe bijzonder is dat?",
            antwoorden: ["Zo mooi dat geen mens het ooit heeft gezien of kan bedenken", "Alleen te zien voor mensen die hun hele leven heel erg hun best doen", "Niet de moeite waard", "Alleen voor belangrijke mensen"],
            correct: "Zo mooi dat geen mens het ooit heeft gezien of kan bedenken",
            bijbelplaats: "1 Korintiërs 2:9"
        }
    ],
    expert: [
        {
            vraag: "Meteen aan het begin van zijn eerste brief schrijft Paulus dat er iets mis is in Korinte. Waarover maakt hij zich zorgen?",
            antwoorden: ["Ze maakten ruzie en waren verdeeld", "Ze durfden niet meer over Jezus te praten", "Ze wilden geen nieuwe leden meer toelaten", "Ze waren gestopt met samen bidden"],
            correct: "Ze maakten ruzie en waren verdeeld",
            bijbelplaats: "1 Korintiërs 1:10-11"
        },
        {
            vraag: "Paulus zegt dat we nu nog niet alles begrijpen, maar later wel. Waarmee vergelijkt hij dat?",
            antwoorden: ["Met een boek in een taal die je nog niet kent", "Met kijken in een wazige spiegel", "Met een diepe slaap", "Met een lange reis"],
            correct: "Met kijken in een wazige spiegel",
            bijbelplaats: "1 Korintiërs 13:12"
        },
        {
            vraag: "Paulus vergelijkt de schat van het goede nieuws met iets kostbaars in iets gewoons. Waarin zit die schat?",
            antwoorden: ["In een gouden kist", "In een groot kasteel", "In kruiken van klei", "In een diepe put"],
            correct: "In kruiken van klei",
            bijbelplaats: "2 Korintiërs 4:7"
        },
        {
            vraag: "Paulus eindigt 2 Korintiërs met een zegen. Wat wenst hij de gelovigen toe?",
            antwoorden: ["De genade van Jezus, de liefde van God en de verbondenheid van de Geest", "Veel geld en macht", "Een lang leven vol roem", "Zoveel wijsheid dat ze slimmer worden dan alle andere gelovigen"],
            correct: "De genade van Jezus, de liefde van God en de verbondenheid van de Geest",
            bijbelplaats: "2 Korintiërs 13:14"
        },
        {
            vraag: "Paulus zegt dat de boodschap van het kruis voor sommige mensen dwaas lijkt, maar voor gelovigen is het...",
            antwoorden: ["Gods kracht", "een grap", "onbelangrijk", "te moeilijk"],
            correct: "Gods kracht",
            bijbelplaats: "1 Korintiërs 1:18"
        },
        {
            vraag: "Omdat Jezus is opgestaan, hoeft wie bij hem hoort niet bang te zijn voor de dood. Hoe spreekt Paulus de dood spottend toe?",
            antwoorden: ["\"Dood, waar is je overwinning? Je hebt verloren!\"", "\"Dood, jij bent de sterkste van allemaal.\"", "\"Dood, jij wint het altijd.\"", "\"Dood, niemand kan jou verslaan.\""],
            correct: "\"Dood, waar is je overwinning? Je hebt verloren!\"",
            bijbelplaats: "1 Korintiërs 15:55-57"
        },
        {
            vraag: "Paulus schrijft dat ons lichaam met de jaren zwakker wordt, maar dat er van binnen iets anders gebeurt. Wat gebeurt er volgens hem van binnen?",
            antwoorden: ["Van binnen worden we elke dag vernieuwd", "Van binnen worden we ook zwakker", "Er verandert niets", "Van buiten worden we juist steeds mooier"],
            correct: "Van binnen worden we elke dag vernieuwd",
            bijbelplaats: "2 Korintiërs 4:16"
        },
        {
            vraag: "Paulus had een \"doorn in zijn vlees\", iets moeilijks dat bleef. Wat vroeg hij God?",
            antwoorden: ["Of het nog moeilijker mocht worden", "Of God het wilde weghalen", "Of iemand anders het mocht krijgen", "Of hij het voor altijd mocht houden"],
            correct: "Of God het wilde weghalen",
            bijbelplaats: "2 Korintiërs 12:8"
        },
        {
            vraag: "Wat zegt Paulus over zwak en sterk zijn, dat verrassend klinkt?",
            antwoorden: ["Alleen de sterkste telt", "Juist als ik zwak ben, ben ik sterk (door God)", "Zwak zijn is altijd slecht", "Wie sterk genoeg is, heeft God helemaal niet meer nodig"],
            correct: "Juist als ik zwak ben, ben ik sterk (door God)",
            bijbelplaats: "2 Korintiërs 12:10"
        },
        {
            vraag: "Hoeveel keer leed Paulus schipbreuk, schrijft hij in 2 Korintiërs?",
            antwoorden: ["Nooit", "Eén keer", "Drie keer", "Tien keer"],
            correct: "Drie keer",
            bijbelplaats: "2 Korintiërs 11:25",
            uitleg: "Een schipbreuk is als je schip op zee vergaat, bijvoorbeeld door een zware storm of doordat het op de rotsen loopt. Paulus reisde veel over zee en maakte dat maar liefst drie keer mee."
        },
        {
            vraag: "Paulus schrijft dat de gelovigen zelf een soort \"brief\" zijn. Waarmee is die geschreven?",
            antwoorden: ["Met gewone inkt", "Met een pen op papier", "Door Gods Geest, in hun hart", "Met verf op een muur"],
            correct: "Door Gods Geest, in hun hart",
            bijbelplaats: "2 Korintiërs 3:3"
        },
        {
            vraag: "Aan het eind van het grote opstandingshoofdstuk bemoedigt Paulus de gelovigen. Wat zegt hij over hun werk voor God?",
            antwoorden: ["Dat het zinloos is", "Dat het nooit voor niets is", "Dat alleen sterke mensen het mogen doen", "Dat ze er flink voor betaald zullen krijgen"],
            correct: "Dat het nooit voor niets is",
            bijbelplaats: "1 Korintiërs 15:58"
        }
    ]
};

// =====================================================================
// Vragenpool: Galaten  (Beginner 12 · Gevorderd 13 · Expert 12)
// Formaat gelijk aan de evangeliën. vragenData bestaat hier al.
// =====================================================================
vragenData["Galaten"] = {
    beginner: [
        {
            vraag: "Wie schreef de brief aan de Galaten?",
            antwoorden: ["Petrus", "Paulus", "Johannes", "Lucas"],
            correct: "Paulus",
            bijbelplaats: "Galaten 1:1"
        },
        {
            vraag: "Paulus gebruikt het beeld van een zware last die iemand moet dragen. Wat moeten gelovigen volgens hem doen als een ander het moeilijk heeft?",
            antwoorden: ["Elkaars lasten dragen, en zo elkaar helpen", "Wachten tot hij het zelf oplost", "Hem eraan herinneren dat het zijn eigen schuld is", "Er maar niet over praten"],
            correct: "Elkaars lasten dragen, en zo elkaar helpen",
            bijbelplaats: "Galaten 6:2"
        },
        {
            vraag: "Wat deed Paulus met de christenen voordat hij zelf in Jezus ging geloven?",
            antwoorden: ["Hij vervolgde hen en deed hun kwaad", "Hij leerde juist alles van hen over Jezus", "Hij kende hen nog niet", "Hij nodigde hen uit"],
            correct: "Hij vervolgde hen en deed hun kwaad",
            bijbelplaats: "Galaten 1:13"
        },
        {
            vraag: "Wat is volgens Paulus het goede nieuws dat hij brengt?",
            antwoorden: ["Dat je je precies aan alle oude regels van de wet moet houden", "Dat je bij God mág horen door op Jezus te vertrouwen", "Dat je ver moet reizen", "Dat je alles alleen moet doen"],
            correct: "Dat je bij God mág horen door op Jezus te vertrouwen",
            bijbelplaats: "Galaten 2:16"
        },
        {
            vraag: "Paulus zegt dat alle gelovigen samen iets van God zijn. Wat zijn zij volgens hem?",
            antwoorden: ["Vreemden", "Dienaren van de keizer", "Kinderen van God", "Gasten op bezoek"],
            correct: "Kinderen van God",
            bijbelplaats: "Galaten 3:26"
        },
        {
            vraag: "Paulus schrijft dat het bij God niet uitmaakt wie je bent. Wat bedoelt hij?",
            antwoorden: ["Alleen wie uit Joodse ouders geboren is, mag bij God horen", "Jood of niet-Jood, slaaf of vrij, iedereen hoort er gelijk bij", "Alleen sterke mensen horen erbij", "Alleen mensen uit Galatië"],
            correct: "Jood of niet-Jood, slaaf of vrij, iedereen hoort er gelijk bij",
            bijbelplaats: "Galaten 3:28"
        },
        {
            vraag: "Tot welke vrijheid heeft Christus ons volgens Paulus geroepen?",
            antwoorden: ["Om vrij te leven en elkaar met liefde te dienen", "Om te doen waar je zelf zin in hebt, wat het ook is", "Om alleen voor jezelf te zorgen", "Om je niets van anderen aan te trekken"],
            correct: "Om vrij te leven en elkaar met liefde te dienen",
            bijbelplaats: "Galaten 5:13"
        },
        {
            vraag: "Paulus zegt dat christenen elkaar moeten behandelen met...",
            antwoorden: ["liefde en vriendelijkheid", "strengheid en kou", "onverschilligheid", "ruzie"],
            correct: "liefde en vriendelijkheid",
            bijbelplaats: "Galaten 5:22"
        },
        {
            vraag: "Hoe wist Paulus zo zeker dat zijn boodschap klopte?",
            antwoorden: ["Hij had het bedacht", "Hij had het uit een boek", "Hij had het van Jezus Christus zelf gekregen", "Iemand had het hem verteld in een droom"],
            correct: "Hij had het van Jezus Christus zelf gekregen",
            bijbelplaats: "Galaten 1:11-12"
        },
        {
            vraag: "Paulus schrijft dat we vooral goed moeten doen aan andere mensen. Voor wie in het bijzonder?",
            antwoorden: ["Alleen voor de sterkste mensen", "Alleen voor mensen die we niet kennen", "Voor iedereen, en zeker voor andere gelovigen", "Alleen voor onszelf"],
            correct: "Voor iedereen, en zeker voor andere gelovigen",
            bijbelplaats: "Galaten 6:10"
        },
        {
            vraag: "Aan het begin van zijn brief wenst Paulus de Galaten iets toe. Wat wenst hij hun toe?",
            antwoorden: ["Genade en vrede van God", "Een lang en makkelijk leven", "Roem en aanzien", "Altijd je zin krijgen"],
            correct: "Genade en vrede van God",
            bijbelplaats: "Galaten 1:3"
        },
        {
            vraag: "Paulus schrijft dat Jezus iets groots voor ons heeft gedaan. Wat heeft Jezus volgens hem gedaan?",
            antwoorden: ["Hij liet ons alleen", "Hij gaf zichzelf, uit liefde voor ons", "Hij keek van een afstand toe", "Hij deed niets bijzonders"],
            correct: "Hij gaf zichzelf, uit liefde voor ons",
            bijbelplaats: "Galaten 1:4"
        }
    ],
    advanced: [
        {
            vraag: "Paulus vat de hele wet samen in één gebod. Welk?",
            antwoorden: ["Heb je naaste lief als jezelf", "Houd je precies aan alle regels en feesten", "Breng elke dag een offer", "Ken de hele wet uit je hoofd"],
            correct: "Heb je naaste lief als jezelf",
            bijbelplaats: "Galaten 5:14"
        },
        {
            vraag: "Wat raadt Paulus aan als iemand anders het moeilijk heeft?",
            antwoorden: ["Loop eromheen", "Help elkaar en draag elkaars lasten", "Wacht rustig af tot het probleem vanzelf weer overgaat", "Doe alsof je niets ziet"],
            correct: "Help elkaar en draag elkaars lasten",
            bijbelplaats: "Galaten 6:2"
        },
        {
            vraag: "Paulus gebruikt het beeld van zaaien en oogsten. Wat bedoelt hij ongeveer?",
            antwoorden: ["Wat je doet, heeft gevolgen; doe daarom het goede", "Je moet vooral in het juiste seizoen zaaien en oogsten", "Als je veel oogst, kan je veel eten", "Het maakt niet uit wat je doet"],
            correct: "Wat je doet, heeft gevolgen; doe daarom het goede",
            bijbelplaats: "Galaten 6:7-9"
        },
        {
            vraag: "Wat zegt Paulus dat je moet blijven doen, ook als het moeilijk wordt?",
            antwoorden: ["Snel opgeven", "Niet moe worden van het goeddoen", "Alleen aan jezelf denken", "Wachten op anderen"],
            correct: "Niet moe worden van het goeddoen",
            bijbelplaats: "Galaten 6:9"
        },
        {
            vraag: "Paulus vertelt dat hij een andere bekende apostel eens openlijk moest terechtwijzen, omdat die zich anders ging gedragen tegenover niet-Joodse gelovigen. Wie was dat?",
            antwoorden: ["Petrus", "Johannes", "Jakobus", "Barnabas"],
            correct: "Petrus",
            bijbelplaats: "Galaten 2:11-14"
        },
        {
            vraag: "Paulus had de Galaten het evangelie verkondigd. Toch luisterden sommigen al snel naar een ánder evangelie. Wat vond Paulus daarvan?",
            antwoorden: ["Hij was streng: er is maar één echt evangelie", "Hij vond het prima, het maakte niet uit", "Hij wist niet wat hij ervan moest denken", "Hij liet de Galaten zelf maar kiezen"],
            correct: "Hij was streng: er is maar één echt evangelie",
            bijbelplaats: "Galaten 1:6-7"
        },
        {
            vraag: "Paulus zegt: wie op Jezus vertrouwt, leeft door geloof. Hij citeert: \"Wie rechtvaardig is, zal leven door...\"",
            antwoorden: ["werk", "regels", "geloof", "geluk"],
            correct: "geloof",
            bijbelplaats: "Galaten 3:11"
        },
        {
            vraag: "Abraham vertrouwde op God, en daarom hoorde hij bij God. Wat leert Paulus daaruit?",
            antwoorden: ["Ook wij mogen bij God horen door te geloven, net als Abraham", "Alleen de mensen die rechtstreeks van Abraham afstammen tellen mee", "Alleen mensen die heel sterk zijn horen erbij", "Alleen belangrijke mensen mogen bij God horen"],
            correct: "Ook wij mogen bij God horen door te geloven, net als Abraham",
            bijbelplaats: "Galaten 3:6-7"
        },
        {
            vraag: "Omdat we kinderen van God zijn, mogen we God aanspreken met een bijzonder, vertrouwelijk woord. Welk?",
            antwoorden: ["Meester", "Koning", "Abba, Vader", "Heer"],
            correct: "Abba, Vader",
            bijbelplaats: "Galaten 4:6"
        },
        {
            vraag: "Wat is belangrijker dan alle regels, zegt Paulus — waar draait het echt om?",
            antwoorden: ["Geloof dat zich laat zien in liefde", "Hoeveel kennis je verzamelt", "Hoe sterk en machtig je bent", "Uit welk land of volk je komt"],
            correct: "Geloof dat zich laat zien in liefde",
            bijbelplaats: "Galaten 5:6"
        },
        {
            vraag: "Paulus zegt dat je je kunt laten leiden door de Geest, óf door je eigen verkeerde verlangens. Wat raadt hij aan?",
            antwoorden: ["Doe altijd wat je zelf wilt", "Laat je leiden door de Geest", "Volg de menigte", "Denk nergens over na"],
            correct: "Laat je leiden door de Geest",
            bijbelplaats: "Galaten 5:16"
        },
        {
            vraag: "Als iemand een fout maakt, hoe moet je hem volgens Paulus weer op weg helpen?",
            antwoorden: ["Hard en streng", "Vriendelijk en zachtmoedig", "Door hem uit te lachen", "Door hem te negeren"],
            correct: "Vriendelijk en zachtmoedig",
            bijbelplaats: "Galaten 6:1"
        },
        {
            vraag: "Wat zegt Paulus over opscheppen — waar mag je volgens hem alleen trots op zijn?",
            antwoorden: ["Op je eigen kracht", "Op je eigen slimheid", "Op wat Jezus voor ons heeft gedaan", "Op alle goede daden die je zelf hebt gedaan"],
            correct: "Op wat Jezus voor ons heeft gedaan",
            bijbelplaats: "Galaten 6:14"
        }
    ],
    expert: [
        {
            vraag: "Paulus zegt dat hij niet probeert om bij mensen in de smaak te vallen. Bij wie wil hij het juist goed doen?",
            antwoorden: ["Bij de koning", "Bij God", "Bij de mensen die het hardst roepen", "Bij iedereen behalve God"],
            correct: "Bij God",
            bijbelplaats: "Galaten 1:10"
        },
        {
            vraag: "Paulus vertelt hoe God hém riep. Wat was Gods bedoeling met Paulus?",
            antwoorden: ["Dat hij het goede nieuws over Jezus zou brengen aan alle volken", "Dat hij een nieuw boek met strenge regels zou schrijven", "Dat hij de oude tempel opnieuw zou opbouwen", "Dat hij alleen in zijn eigen stad zou blijven"],
            correct: "Dat hij het goede nieuws over Jezus zou brengen aan alle volken",
            bijbelplaats: "Galaten 1:15-16"
        },
        {
            vraag: "In Antiochië sprak Paulus Petrus openlijk tegen. Wat was er gebeurd?",
            antwoorden: ["Petrus at eerst gewoon mee met niet-Joodse gelovigen, maar trok zich later uit angst terug", "Petrus wilde het goede nieuws alleen nog aan Joden vertellen", "Petrus stuurde de niet-Joodse gelovigen weg uit de gemeente", "Petrus zei openlijk dat Paulus geen echte apostel van Jezus genoemd mocht worden"],
            correct: "Petrus at eerst gewoon mee met niet-Joodse gelovigen, maar trok zich later uit angst terug",
            bijbelplaats: "Galaten 2:11-14"
        },
        {
            vraag: "Paulus vraagt verbaasd: \"Wie heeft jullie betoverd?\" Waarom is hij zo verbaasd?",
            antwoorden: ["Christus was hun duidelijk verkondigd, en tóch lieten ze hun redding weer van de wet afhangen", "Ze waren teruggekeerd naar het vereren van afgoden", "Ze hadden onderling ruzie gekregen over geld", "Ze meenden nu dat ze zichzelf konden redden door zich alleen maar heel streng aan alle regels te houden"],
            correct: "Christus was hun duidelijk verkondigd, en tóch lieten ze hun redding weer van de wet afhangen",
            bijbelplaats: "Galaten 3:1-3"
        },
        {
            vraag: "Paulus gebruikt Abraham als voorbeeld van hoe je bij God hoort. Wat maakt Abraham juist tot dat voorbeeld?",
            antwoorden: ["Hij geloofde God, en dat geloof werd hem als gerechtigheid toegerekend", "Hij hield zich al precies aan de hele wet van Mozes", "Hij was heel rijk en machtig en had veel bezit", "Hij bouwde met zijn eigen handen de allereerste tempel voor God in Jeruzalem"],
            correct: "Hij geloofde God, en dat geloof werd hem als gerechtigheid toegerekend",
            bijbelplaats: "Galaten 3:6-7"
        },
        {
            vraag: "Paulus zegt dat de wet vroeger een taak had, zoals een oppasser die op je let tot je groot genoeg bent. Wat gebeurde er toen Christus kwam?",
            antwoorden: ["De wet had zijn taak gedaan en had ons naar Christus gebracht", "De wet werd juist nog veel strenger dan daarvoor", "De wet verdween, en niemand hoefde meer iets goeds te doen", "De wet ging voortaan alleen nog over eten en drinken"],
            correct: "De wet had zijn taak gedaan en had ons naar Christus gebracht",
            bijbelplaats: "Galaten 3:24-25"
        },
        {
            vraag: "God zond de Geest van zijn Zoon in ons hart. Wat roept die Geest volgens Paulus?",
            antwoorden: ["\"Abba, Vader!\"", "\"Heer, ontferm U!\"", "\"Halleluja!\"", "\"Vrede zij met u!\""],
            correct: "\"Abba, Vader!\"",
            bijbelplaats: "Galaten 4:6"
        },
        {
            vraag: "Paulus zegt dat je geen slaaf meer bent, maar een kind van God. Wat hoort daar volgens hem ook bij?",
            antwoorden: ["Je bent erfgenaam: alles wat God belooft, is ook voor jou", "Je bent nu de baas over anderen", "Je hoeft niets meer te doen", "Je staat nu een stuk hoger dan de mensen die de wet nog volgen"],
            correct: "Je bent erfgenaam: alles wat God belooft, is ook voor jou",
            bijbelplaats: "Galaten 4:7"
        },
        {
            vraag: "Paulus waarschuwt met een beeld: \"Een beetje zuurdesem doorzuurt het hele deeg.\" Wat bedoelt hij?",
            antwoorden: ["Eén verkeerde leer kan de hele gemeente aantasten", "Kleine fouten maken uiteindelijk toch niet uit", "Je moet altijd genoeg brood bakken voor iedereen", "God zorgt er altijd voor dat er eten is"],
            correct: "Eén verkeerde leer kan de hele gemeente aantasten",
            bijbelplaats: "Galaten 5:9"
        },
        {
            vraag: "Paulus noemt negen mooie dingen die groeien als de Geest je leidt: de \"vrucht van de Geest\". Welke staat bovenaan?",
            antwoorden: ["Trots", "Liefde", "Roem", "Macht"],
            correct: "Liefde",
            bijbelplaats: "Galaten 5:22"
        },
        {
            vraag: "Paulus zegt met het beeld van zaaien en oogsten dat je op twee manieren kunt leven. Welke twee?",
            antwoorden: ["Je kunt leven zoals je zelf wilt, óf je laten leiden door Gods Geest", "Je kunt 's ochtends óf 's avonds zaaien", "Je kunt op klei óf op zand zaaien", "Je kunt op vruchtbare grond zaaien óf juist op de harde, droge grond ernaast"],
            correct: "Je kunt leven zoals je zelf wilt, óf je laten leiden door Gods Geest",
            bijbelplaats: "Galaten 6:7-8"
        },
        {
            vraag: "Aan het eind van zijn brief aan de Galaten schrijft Paulus iets opvallends over de manier waarop hij dit laatste stuk zelf opschrijft. Wat vertelt hij daarover?",
            antwoorden: ["Met grote letters, met zijn eigen hand", "Heel klein en sierlijk", "In een geheime code", "Met de hand van iemand anders die het voor hem opschreef"],
            correct: "Met grote letters, met zijn eigen hand",
            bijbelplaats: "Galaten 6:11"
        },
        {
            vraag: "Wat zegt Paulus dat écht telt, belangrijker dan of je je aan bepaalde regels houdt?",
            antwoorden: ["Hoe oud je bent", "Dat je een nieuwe schepping bent", "Uit welk land je komt", "Hoeveel regels van de wet je precies volgt"],
            correct: "Dat je een nieuwe schepping bent",
            bijbelplaats: "Galaten 6:15"
        }
    ]
};

// =====================================================================
// Vragenpool: Efeziërs  (Beginner 12 · Gevorderd 21 · Expert 14)
// Formaat gelijk aan de evangeliën. vragenData bestaat hier al.
// =====================================================================
vragenData["Efeziërs"] = {
    beginner: [
        {
            vraag: "Wie schreef de brief aan de Efeziërs?",
            antwoorden: ["Petrus", "Paulus", "Johannes", "Lucas"],
            correct: "Paulus",
            bijbelplaats: "Efeziërs 1:1"
        },
        {
            vraag: "Paulus schrijft hoe gelovigen met elkaar om moeten gaan. Hij noemt drie dingen: goed zijn voor elkaar, met elkaar meeleven, en nog iets. Wat is dat derde?",
            antwoorden: ["Elkaar vergeven, zoals God jou vergeven heeft", "Elkaar overtreffen in zoveel mogelijk goede daden", "Elkaar verbeteren", "Elkaar met rust laten"],
            correct: "Elkaar vergeven, zoals God jou vergeven heeft",
            bijbelplaats: "Efeziërs 4:32"
        },
        {
            vraag: "Door wie krijgen we volgens Paulus vergeving van onze fouten?",
            antwoorden: ["Door de keizer", "Door Jezus", "Door onszelf", "Door niemand"],
            correct: "Door Jezus",
            bijbelplaats: "Efeziërs 1:7"
        },
        {
            vraag: "Waarom koos God ons uit, schrijft Paulus?",
            antwoorden: ["Omdat we het verdienden", "Omdat we sterk waren", "Omdat hij ons liefheeft", "Omdat we rijk waren"],
            correct: "Omdat hij ons liefheeft",
            bijbelplaats: "Efeziërs 1:4-5"
        },
        {
            vraag: "Wat raadt Paulus aan over boos zijn?",
            antwoorden: ["Blijf niet boos; maak het goed voordat de dag voorbij is", "Blijf net zo lang boos tot de ander toegeeft", "Doe gewoon iets vervelends terug", "Krop je boosheid op en hou je net zo lang in totdat je ontploft"],
            correct: "Blijf niet boos; maak het goed voordat de dag voorbij is",
            bijbelplaats: "Efeziërs 4:26"
        },
        {
            vraag: "Wat zegt Paulus dat kinderen en hun ouders voor elkaar betekenen?",
            antwoorden: ["Kinderen luisteren naar hun ouders, en ouders zorgen liefdevol voor hen", "Kinderen mogen altijd zelf bepalen wat ze doen", "Ouders moeten hun kinderen vooral streng straffen", "Ouders bepalen echt alles en kinderen mogen nooit iets zelf beslissen"],
            correct: "Kinderen luisteren naar hun ouders, en ouders zorgen liefdevol voor hen",
            bijbelplaats: "Efeziërs 6:1-4"
        },
        {
            vraag: "Paulus schrijft dat gelovigen elkaar geen leugens moeten vertellen. Wat moet je in plaats daarvan doen?",
            antwoorden: ["De waarheid zeggen en eerlijk zijn tegen elkaar", "Liever helemaal niets meer zeggen", "Elkaar alleen maar complimenten geven, ook als ze niet waar zijn", "Alle geheimen die je te horen krijgt aan iedereen doorvertellen"],
            correct: "De waarheid zeggen en eerlijk zijn tegen elkaar",
            bijbelplaats: "Efeziërs 4:25"
        },
        {
            vraag: "Paulus zegt: leg je oude, verkeerde gewoonten af, net als oude kleren. Wat trek je daarvoor in de plaats aan?",
            antwoorden: ["Een nieuw leven, zoals God het bedoeld heeft", "Precies dezelfde oude gewoonten weer", "Je trekt hele mooie nieuwe kleren aan", "Een verkleedkostuum om je anders voor te doen"],
            correct: "Een nieuw leven, zoals God het bedoeld heeft",
            bijbelplaats: "Efeziërs 4:22-24"
        },
        {
            vraag: "Wat raadt Paulus de gelovigen aan om samen te doen, vol dankbaarheid voor God?",
            antwoorden: ["Samen zingen en God danken", "Samen mopperen en klagen", "Alleen aan onszelf denken", "Stil blijven en niets doen"],
            correct: "Samen zingen en God danken",
            bijbelplaats: "Efeziërs 5:19-20"
        },
        {
            vraag: "Paulus zegt dat gelovigen samen moeten opgroeien naar het voorbeeld van één iemand. Naar wiens voorbeeld?",
            antwoorden: ["De koning", "Christus", "Paulus zelf", "De sterkste mens"],
            correct: "Christus",
            bijbelplaats: "Efeziërs 4:13"
        },
        {
            vraag: "Hoe vaak en waarvoor moeten gelovigen God danken, zegt Paulus?",
            antwoorden: ["Altijd, en voor alles", "Bijna nooit", "Alleen op zondag", "Alleen als het goed gaat"],
            correct: "Altijd, en voor alles",
            bijbelplaats: "Efeziërs 5:20"
        },
        {
            vraag: "Paulus schrijft dat we gered zijn \"uit genade\". Wat betekent dat?",
            antwoorden: ["Het is een geschenk van God; je kunt het niet zelf verdienen", "Je moet er je hele leven lang heel erg hard voor blijven werken", "Alleen heel sterke mensen worden gered", "Je moet er veel geld voor betalen"],
            correct: "Het is een geschenk van God; je kunt het niet zelf verdienen",
            bijbelplaats: "Efeziërs 2:8-9"
        }
    ],
    advanced: [
        {
            vraag: "Hoe word je volgens Paulus bij God gered?",
            antwoorden: ["Door Gods genade, als een geschenk", "Door heel sterk te zijn", "Door alles zelf te verdienen", "Door ver te reizen"],
            correct: "Door Gods genade, als een geschenk",
            bijbelplaats: "Efeziërs 2:8"
        },
        {
            vraag: "Hoe moet je volgens Paulus met elkaar práten?",
            antwoorden: ["Je mag alleen met elkaar praten als het over God gaat", "Met woorden die opbouwen en goeddoen", "Zo weinig mogelijk", "Met scheldwoorden"],
            correct: "Met woorden die opbouwen en goeddoen",
            bijbelplaats: "Efeziërs 4:29"
        },
        {
            vraag: "Paulus zegt: wees vriendelijk voor elkaar en...",
            antwoorden: ["praat pas weer als de ander netjes zijn excuses aanbiedt", "ga uit elkaars buurt", "vergeef elkaar, zoals God jullie vergeven heeft", "denk alleen aan jezelf"],
            correct: "vergeef elkaar, zoals God jullie vergeven heeft",
            bijbelplaats: "Efeziërs 4:32"
        },
        {
            vraag: "Paulus zegt dat christenen mogen leven als kinderen van het...",
            antwoorden: ["donker", "licht", "water", "vuur"],
            correct: "licht",
            bijbelplaats: "Efeziërs 5:8"
        },
        {
            vraag: "Paulus zegt: doe de wapenrusting van God aan. Waarvoor?",
            antwoorden: ["Om staande te blijven tegen het kwaad", "Om oorlog te voeren tegen mensen", "Om indruk te maken", "Gewoon zomaar, dan zie je er leuk uit"],
            correct: "Om staande te blijven tegen het kwaad",
            bijbelplaats: "Efeziërs 6:11"
        },
        {
            vraag: "Paulus zegt: volg het voorbeeld van God en leef in...",
            antwoorden: ["liefde", "angst", "rijkdom", "macht"],
            correct: "liefde",
            bijbelplaats: "Efeziërs 5:1-2"
        },
        {
            vraag: "Iedereen in de gemeente kreeg eigen gaven. Waarvoor?",
            antwoorden: ["Om de gemeente samen op te bouwen", "Om over op te scheppen", "Om alleen zelf beter te worden", "Om anderen jaloers te maken"],
            correct: "Om de gemeente samen op te bouwen",
            bijbelplaats: "Efeziërs 4:11-12"
        },
        {
            vraag: "Paulus bidt dat de gelovigen iets gaan begrijpen. Wat hoopt hij dat zij leren begrijpen?",
            antwoorden: ["Hoe groot Gods liefde is", "Hoe je de baas wordt", "Hoe je de sterkste wordt", "Hoe je beroemd wordt"],
            correct: "Hoe groot Gods liefde is",
            bijbelplaats: "Efeziërs 3:18-19"
        },
        {
            vraag: "Paulus benadrukt de eenheid van de gelovigen. Hij zegt: er is één lichaam en één...?",
            antwoorden: ["Geest", "hart", "stem", "huis"],
            correct: "Geest",
            bijbelplaats: "Efeziërs 4:4"
        },
        {
            vraag: "Wat raadt Paulus aan om te blijven doen, naast het aantrekken van de wapenrusting?",
            antwoorden: ["Slapen", "Bidden", "Wachten", "Zwijgen"],
            correct: "Bidden",
            bijbelplaats: "Efeziërs 6:18"
        },
        {
            vraag: "Wat zegt Paulus over hoe je je tijd gebruikt?",
            antwoorden: ["Gebruik je tijd goed en wijs", "Verspil je tijd zoveel mogelijk", "Laat anderen je tijd bepalen", "Doe altijd alles op het laatste moment"],
            correct: "Gebruik je tijd goed en wijs",
            bijbelplaats: "Efeziërs 5:15-16"
        },
        {
            vraag: "Waarom kun je je redding niet zelf verdienen, zegt Paulus?",
            antwoorden: ["Het is een geschenk van God, zodat niemand kan opscheppen", "Omdat je er eerst heel veel goede daden voor moet gaan doen", "Omdat je te zwak bent", "Omdat het te ver weg is"],
            correct: "Het is een geschenk van God, zodat niemand kan opscheppen",
            bijbelplaats: "Efeziërs 2:9"
        },
        {
            vraag: "Paulus vergelijkt de gemeente — alle gelovigen samen, de kerk — met een gebouw. De hoeksteen is de allerbelangrijkste steen, waar het hele gebouw op rust en stevig blijft staan. Wie is die hoeksteen?",
            antwoorden: ["Paulus", "Jezus Christus", "Petrus", "De koning"],
            correct: "Jezus Christus",
            bijbelplaats: "Efeziërs 2:20"
        },
        {
            vraag: "De gelovigen groeien samen uit tot één bijzonder gebouw. Wat voor gebouw worden ze, zegt Paulus?",
            antwoorden: ["Een tempel waarin God woont", "Een paleis voor de koning", "Een fort tegen de vijand", "Een school om les te krijgen"],
            correct: "Een tempel waarin God woont",
            bijbelplaats: "Efeziërs 2:21-22"
        },
        {
            vraag: "Paulus zegt dat we elkaar de waarheid mogen zeggen — maar wél in liefde. Wat betekent dat?",
            antwoorden: ["Eerlijk zijn, maar altijd vriendelijk en met zorg voor de ander", "Gewoon alles zeggen wat je vindt, ook als het hard aankomt", "Alleen zorgen dat je nooit meer liegt", "De waarheid maar beter voor jezelf houden"],
            correct: "Eerlijk zijn, maar altijd vriendelijk en met zorg voor de ander",
            bijbelplaats: "Efeziërs 4:15"
        },
        {
            vraag: "Wat bedoelt Paulus met \"leef als kinderen van het licht\"?",
            antwoorden: ["Doe wat goed, eerlijk en waar is", "Slaap overdag", "Blijf binnen", "Alleen naar buiten gaan als het licht is"],
            correct: "Doe wat goed, eerlijk en waar is",
            bijbelplaats: "Efeziërs 5:9"
        },
        {
            vraag: "Paulus knielt en bidt dat God de gelovigen van binnen sterk maakt. Waardoor?",
            antwoorden: ["Door alles voor hen makkelijk te maken", "Door zijn Geest", "Door hun spieren sterk te maken", "Door alleen nog maar gezond voedsel te eten"],
            correct: "Door zijn Geest",
            bijbelplaats: "Efeziërs 3:16"
        },
        {
            vraag: "Paulus zegt: laat je niet meeslepen door elke nieuwe leer, als een bootje op de golven. Wat moet je in plaats daarvan doen?",
            antwoorden: ["Met alles meedoen", "Bij de waarheid blijven", "Steeds van mening veranderen", "Niemand geloven"],
            correct: "Bij de waarheid blijven",
            bijbelplaats: "Efeziërs 4:14"
        },
        {
            vraag: "Paulus bidt dat Christus in hun hart woont. Wat gebeurt er dan, zegt hij?",
            antwoorden: ["Ze staan vast geworteld in de liefde", "Ze weten meteen alle antwoorden op elke vraag", "Ze krijgen altijd hun zin", "Ze hoeven nooit meer iets moeilijks te doen"],
            correct: "Ze staan vast geworteld in de liefde",
            bijbelplaats: "Efeziërs 3:17"
        },
        {
            vraag: "Paulus zegt: je oude gewoonten afleggen is niet genoeg. Wat moet er ook nieuw worden, van binnen?",
            antwoorden: ["Je gedachten, je manier van denken", "Je naam", "De vrienden en de mensen met wie je elke dag omgaat", "Je kleren"],
            correct: "Je gedachten, je manier van denken",
            bijbelplaats: "Efeziërs 4:23"
        }
    ],
    expert: [
        {
            vraag: "Welk onderdeel van Gods wapenrusting hoort bij het geloof?",
            antwoorden: ["De helm", "Het schild", "De schoenen", "De gordel"],
            correct: "Het schild",
            bijbelplaats: "Efeziërs 6:16"
        },
        {
            vraag: "Wat is het \"zwaard\" in de wapenrusting van God?",
            antwoorden: ["Een echt zwaard", "Het woord van God", "Een stok", "Een schild"],
            correct: "Het woord van God",
            bijbelplaats: "Efeziërs 6:17"
        },
        {
            vraag: "Vanuit welke plek schreef Paulus zijn brief aan de Efeziërs?",
            antwoorden: ["Op een schip", "In de gevangenis", "In een paleis", "Op reis door de woestijn"],
            correct: "In de gevangenis",
            bijbelplaats: "Efeziërs 4:1"
        },
        {
            vraag: "Joden en niet-Joden waren vroeger gescheiden. Wat is er door Christus gebeurd?",
            antwoorden: ["De muur tussen hen is afgebroken; ze horen nu samen bij elkaar", "De muur tussen hen werd juist nog een heel stuk hoger gebouwd", "Ze mochten alleen op vaste dagen bij elkaar komen", "Ze bleven twee aparte groepen naast elkaar"],
            correct: "De muur tussen hen is afgebroken; ze horen nu samen bij elkaar",
            bijbelplaats: "Efeziërs 2:14"
        },
        {
            vraag: "Paulus noemt: één Heer, één geloof, en één...",
            antwoorden: ["land", "taal", "doop", "koning"],
            correct: "doop",
            bijbelplaats: "Efeziërs 4:5"
        },
        {
            vraag: "Wat zegt Paulus dat God kan doen?",
            antwoorden: ["Veel meer dan wij ooit kunnen vragen of bedenken", "Precies dat wat wij Hem vragen, niet meer", "Alleen wat wij zelf eerst verdiend hebben", "Alleen dingen die wij kunnen begrijpen"],
            correct: "Veel meer dan wij ooit kunnen vragen of bedenken",
            bijbelplaats: "Efeziërs 3:20"
        },
        {
            vraag: "Welk onderdeel van de wapenrusting is de \"helm\"?",
            antwoorden: ["De kracht", "De redding", "De roem", "De macht"],
            correct: "De redding",
            bijbelplaats: "Efeziërs 6:17"
        },
        {
            vraag: "Waar staan de \"schoenen\" in de wapenrusting voor?",
            antwoorden: ["Klaarstaan om het goede nieuws van vrede te brengen", "Hard kunnen wegrennen", "Mooi voor de dag komen", "Ongemerkt en zo stil mogelijk kunnen rondsluipen"],
            correct: "Klaarstaan om het goede nieuws van vrede te brengen",
            bijbelplaats: "Efeziërs 6:15"
        },
        {
            vraag: "Vroeger waren de gelovigen ver van God. Wat is er veranderd?",
            antwoorden: ["Ze zijn dichtbij gekomen, door het bloed van Christus", "Ze moesten zelf de lange weg terug afleggen", "Ze kwamen pas dichtbij na veel goede daden", "Ze waren verdwaald en vonden de weg niet terug"],
            correct: "Ze zijn dichtbij gekomen, door het bloed van Christus",
            bijbelplaats: "Efeziërs 2:13"
        },
        {
            vraag: "Hoe beschrijft Paulus God?",
            antwoorden: ["Rijk aan genade en vol grote liefde", "Ver weg en onzichtbaar", "Streng, en alleen tevreden over sterke mensen", "Vriendelijk voor wie het verdient"],
            correct: "Rijk aan genade en vol grote liefde",
            bijbelplaats: "Efeziërs 2:4"
        },
        {
            vraag: "Wat zegt Paulus tegen ouders?",
            antwoorden: ["Maak je kinderen niet boos, maar voed ze liefdevol op", "Wees zo streng mogelijk en straf elke fout meteen hard af", "Laat je kinderen aan hun lot over", "Geef ze alles wat ze willen"],
            correct: "Maak je kinderen niet boos, maar voed ze liefdevol op",
            bijbelplaats: "Efeziërs 6:4"
        },
        {
            vraag: "Waar staat het \"borstpantser\" (harnas) van de wapenrusting voor?",
            antwoorden: ["Het goede doen (gerechtigheid)", "Veel macht", "Slimmer zijn dan alle anderen", "Hard werken"],
            correct: "Het goede doen (gerechtigheid)",
            bijbelplaats: "Efeziërs 6:14"
        },
        {
            vraag: "Paulus zegt dat gelovigen in een echte strijd staan. Tegen wie of wat gaat die strijd volgens hem eigenlijk?",
            antwoorden: ["Niet tegen mensen van vlees en bloed, maar tegen de machten van het kwaad", "Tegen valse profeten die het volk overal probeerden te misleiden", "Tegen wilde dieren en gevaren in de natuur", "Tegen mensen die er anders uitzien of anders geloven"],
            correct: "Niet tegen mensen van vlees en bloed, maar tegen de machten van het kwaad",
            bijbelplaats: "Efeziërs 6:12"
        },
        {
            vraag: "Wat is volgens Paulus het teken (zegel) dat je echt bij God hoort?",
            antwoorden: ["Een gouden ring", "De heilige Geest", "Een brief", "Een mooi kleed"],
            correct: "De heilige Geest",
            bijbelplaats: "Efeziërs 1:13-14"
        },
        {
            vraag: "Waar staat de \"gordel\" in de wapenrusting van God voor?",
            antwoorden: ["De waarheid", "Het geloof", "De gerechtigheid", "De vrede"],
            correct: "De waarheid",
            bijbelplaats: "Efeziërs 6:14"
        }
    ]
};

// =========================================================================
// Filippenzen — vragenpool (47 vragen: beginner 17, advanced 15, expert 15)
// Formaat gelijk aan de andere boeken: vragenData["Filippenzen"] met drie
// niveaus (beginner / advanced / expert). Per vraag: vraag, antwoorden[],
// correct (exact gelijk aan één antwoord) en bijbelplaats.
// Niveau-indeling zoals goedgekeurd door Roel.
// =========================================================================
vragenData["Filippenzen"] = {
    beginner: [
        {
            vraag: "Paulus geeft raad over waar je je gedachten mee vult. Waar moet je volgens hem aan blijven denken?",
            antwoorden: ["Aan alles wat waar, mooi en goed is", "Alleen aan je eigen problemen", "Alleen aan wat er morgen gebeurt", "Zo min mogelijk"],
            correct: "Aan alles wat waar, mooi en goed is",
            bijbelplaats: "Filippenzen 4:8"
        },
        {
            vraag: "Wat voor soort tekst is Filippenzen?",
            antwoorden: ["Een brief", "Een lied", "Een evangelie", "Een gebed"],
            correct: "Een brief",
            bijbelplaats: "Filippenzen 1:1"
        },
        {
            vraag: "Bidt Paulus voor de gemeente in Filippi?",
            antwoorden: ["Ja, en met blijdschap", "Nee, hij heeft geen tijd", "Alleen als ze erom vragen", "Nooit"],
            correct: "Ja, en met blijdschap",
            bijbelplaats: "Filippenzen 1:4"
        },
        {
            vraag: "Twee vrouwen in Filippi hadden onenigheid. Wat vraagt Paulus hun?",
            antwoorden: ["Om het weer eens te worden", "Om de gemeente te verlaten", "Om te zwijgen", "Om te kiezen wie gelijk heeft"],
            correct: "Om het weer eens te worden",
            bijbelplaats: "Filippenzen 4:2"
        },
        {
            vraag: "Paulus zegt dat de gelovigen mogen schijnen \"als lichten\". Waar, volgens hem?",
            antwoorden: ["In de wereld om hen heen", "Alleen in de kerk", "Alleen thuis", "Alleen op zondag"],
            correct: "In de wereld om hen heen",
            bijbelplaats: "Filippenzen 2:15"
        },
        {
            vraag: "Wat wenst Paulus voor de gemeente in Filippi?",
            antwoorden: ["Dat ze eensgezind zijn", "Dat ieder zijn eigen weg gaat", "Dat ze de stad verlaten", "Dat ze stil blijven"],
            correct: "Dat ze eensgezind zijn",
            bijbelplaats: "Filippenzen 2:2"
        },
        {
            vraag: "Hoe kun je volgens Paulus het beste naar een ander kijken?",
            antwoorden: ["De ander belangrijker vinden dan jezelf", "Jezelf altijd voorop zetten", "Anderen vooral goed in de gaten houden op fouten", "Een ander ontwijken"],
            correct: "De ander belangrijker vinden dan jezelf",
            bijbelplaats: "Filippenzen 2:3"
        },
        {
            vraag: "Wat belooft Paulus dat God zal doen voor wie Hem vertrouwt?",
            antwoorden: ["Geven wat je echt nodig hebt", "Al je wensen vervullen", "Je beroemd maken", "Je nooit laten werken"],
            correct: "Geven wat je echt nodig hebt",
            bijbelplaats: "Filippenzen 4:19"
        },
        {
            vraag: "Als je bidt in plaats van je zorgen te maken, wat zal je hart dan bewaren?",
            antwoorden: ["De vrede van God", "Een sterke muur", "Goede vrienden", "Veel geluk"],
            correct: "De vrede van God",
            bijbelplaats: "Filippenzen 4:7"
        },
        {
            vraag: "In het lied schrijft Paulus dat élke knie zal buigen. Maar waar overal?",
            antwoorden: ["In de hemel, op de aarde én onder de aarde", "In Israël en Rome", "In alle grote steden van het Romeinse rijk", "In Jeruzalem en Filippi"],
            correct: "In de hemel, op de aarde én onder de aarde",
            bijbelplaats: "Filippenzen 2:10"
        },
        {
            vraag: "Paulus schrijft dat hij alles aankan, dankzij iemand die hem steeds kracht geeft. Wie geeft hem die kracht?",
            antwoorden: ["Christus", "De keizer", "Zijn vrienden in Filippi", "De engelen"],
            correct: "Christus",
            bijbelplaats: "Filippenzen 4:13"
        },
        {
            vraag: "Hoe wil Paulus dat de gelovigen bekendstaan bij alle mensen om hen heen?",
            antwoorden: ["Als vriendelijke mensen", "Als machtige mensen", "Als sterke mensen", "Als slimme mensen"],
            correct: "Als vriendelijke mensen",
            bijbelplaats: "Filippenzen 4:5"
        },
        {
            vraag: "Paulus schrijft over de medewerkers die hem geholpen hebben. Waar staan hun namen volgens hem opgeschreven?",
            antwoorden: ["In het boek van het leven", "Op een gedenksteen in de tempel", "In de brief aan de Romeinen", "Op de poort van de stad"],
            correct: "In het boek van het leven",
            bijbelplaats: "Filippenzen 4:3"
        },
        {
            vraag: "Paulus vertelt waar hij voor bidt: hij hoopt dat één ding bij de gelovigen steeds groter wordt. Wat hoopt hij dat er groeit?",
            antwoorden: ["Hun liefde", "Hun moed", "Hun aantal", "Hun kracht"],
            correct: "Hun liefde",
            bijbelplaats: "Filippenzen 1:9"
        },
        {
            vraag: "Paulus schrijft een korte, bemoedigende zin: 'De Heer is …'. Welk woord hoort er volgens Paulus?",
            antwoorden: ["dichtbij", "ver weg", "onbereikbaar", "boos"],
            correct: "dichtbij",
            bijbelplaats: "Filippenzen 4:5"
        },
        {
            vraag: "Wat doet Paulus telkens als hij aan de gelovigen in Filippi denkt?",
            antwoorden: ["Hij dankt God voor hen", "Hij maakt zich zorgen om hen", "Hij wordt boos op hen", "Hij vergeet hen bijna"],
            correct: "Hij dankt God voor hen",
            bijbelplaats: "Filippenzen 1:3"
        },
        {
            vraag: "Paulus zegt: probeer net zo te denken en te doen als iemand anders. Als wie moeten de gelovigen worden?",
            antwoorden: ["Als Jezus Christus", "Als koning David", "Als de profeet Mozes", "Als de engelen"],
            correct: "Als Jezus Christus",
            bijbelplaats: "Filippenzen 2:5"
        }
    ],
    advanced: [
        {
            vraag: "Vanuit welke plek schreef Paulus zijn brief aan de Filippenzen?",
            antwoorden: ["In de gevangenis", "Op reis met een schip", "In de tempel", "Thuis in Nazaret"],
            correct: "In de gevangenis",
            bijbelplaats: "Filippenzen 1:13"
        },
        {
            vraag: "Paulus schrijft hóe de gelovigen alles moeten doen. Namelijk: zónder wat?",
            antwoorden: ["Zonder mopperen en ruzie", "Zonder ervoor betaald te worden", "Zonder erover na te denken", "Zonder het aan iemand te vragen"],
            correct: "Zonder mopperen en ruzie",
            bijbelplaats: "Filippenzen 2:14"
        },
        {
            vraag: "Wat moet je volgens Paulus doen in plaats van je zorgen maken?",
            antwoorden: ["Bidden en je zorgen aan God vertellen", "Wachten tot het overgaat", "Zo snel mogelijk vluchten voor het probleem", "Erover blijven piekeren"],
            correct: "Bidden en je zorgen aan God vertellen",
            bijbelplaats: "Filippenzen 4:6"
        },
        {
            vraag: "Hoe schrijft Paulus over zijn tijd in de gevangenis?",
            antwoorden: ["Hij blijft blij, omdat het goede nieuws zich juist verspreidt", "Hij is dankbaar, maar wil zo snel mogelijk stoppen met schrijven", "Hij is blij dat hij niet hoeft te werken", "Hij zegt er eigenlijk niks over"],
            correct: "Hij blijft blij, omdat het goede nieuws zich juist verspreidt",
            bijbelplaats: "Filippenzen 1:18"
        },
        {
            vraag: "In een beroemd lied schrijft Paulus dat Jezus zichzelf vernederde. Welke gestalte nam Jezus aan?",
            antwoorden: ["Die van een dienaar", "Die van een koning", "Die van een rijke heerser", "Die van een legeraanvoerder"],
            correct: "Die van een dienaar",
            bijbelplaats: "Filippenzen 2:7"
        },
        {
            vraag: "Welke jonge medewerker prijst Paulus omdat die echt om de gemeente geeft?",
            antwoorden: ["Timoteüs", "Petrus", "Barnabas", "Stefanus"],
            correct: "Timoteüs",
            bijbelplaats: "Filippenzen 2:20-22"
        },
        {
            vraag: "Paulus schrijft dat hij een geheim heeft geleerd: of hij nu veel heeft of weinig. Wat heeft hij geleerd?",
            antwoorden: ["Tevreden zijn in elke situatie", "Altijd meer willen hebben", "Alleen blij zijn als hij rijk is", "Nooit iemand om hulp vragen"],
            correct: "Tevreden zijn in elke situatie",
            bijbelplaats: "Filippenzen 4:11-12"
        },
        {
            vraag: "Paulus zegt dat alles wat hij vroeger belangrijk vond, nu niets meer waard is. Waarom denkt hij daar zo over?",
            antwoorden: ["Omdat het kennen van Christus het allerkostbaarst is", "Omdat hij door zijn gevangenschap alles heeft verloren", "Omdat hij oud is geworden", "Omdat anderen het hem afpakten"],
            correct: "Omdat het kennen van Christus het allerkostbaarst is",
            bijbelplaats: "Filippenzen 3:8"
        },
        {
            vraag: "Paulus schrijft dat het echte \"thuis\" van de gelovigen ergens anders is dan de stad waar zij wonen. Waar is dat volgens hem?",
            antwoorden: ["In de hemel", "In Rome", "In Jeruzalem", "In Filippi"],
            correct: "In de hemel",
            bijbelplaats: "Filippenzen 3:20"
        },
        {
            vraag: "De Filippenzen hadden Paulus geholpen toen hij in de gevangenis zat. Hoe reageert hij daarop?",
            antwoorden: ["Hij bedankt hen hartelijk", "Hij stuurt het terug", "Hij weigert het", "Hij vraagt om meer"],
            correct: "Hij bedankt hen hartelijk",
            bijbelplaats: "Filippenzen 4:14-16"
        },
        {
            vraag: "Paulus is ervan overtuigd dat God iets zal afmaken bij de gelovigen in Filippi. Wat zal God afmaken?",
            antwoorden: ["Het goede werk dat Hij in hen begon", "De bouw van de tempel", "Het werk dat zij zelf begonnen waren", "De brief die Paulus aan het schrijven was"],
            correct: "Het goede werk dat Hij in hen begon",
            bijbelplaats: "Filippenzen 1:6"
        },
        {
            vraag: "Toen Paulus in de gevangenis zat, gebeurde er iets onverwachts met het goede nieuws. Wat gebeurde er?",
            antwoorden: ["Het werd juist méér bekend", "Het werd verboden", "Niemand hoorde er nog van", "Het werd vergeten"],
            correct: "Het werd juist méér bekend",
            bijbelplaats: "Filippenzen 1:12"
        },
        {
            vraag: "In het lied over Jezus schrijft Paulus dat God hem iets gaf wat boven alles uitgaat. Wat gaf God hem?",
            antwoorden: ["De hoogste naam, boven alle namen", "Een koninkrijk op aarde", "Een troon van puur goud in de hemel", "Een prachtig paleis"],
            correct: "De hoogste naam, boven alle namen",
            bijbelplaats: "Filippenzen 2:9"
        },
        {
            vraag: "Paulus vertelt over zijn leven vóór hij Jezus volgde. Tot welke Joodse groep hoorde hij?",
            antwoorden: ["De Farizeeën", "De Sadduceeën", "De Schriftgeleerden", "De Essenen"],
            correct: "De Farizeeën",
            bijbelplaats: "Filippenzen 3:5"
        },
        {
            vraag: "Paulus vergelijkt het geloof met hardlopen. Wat doet hij volgens eigen zeggen?",
            antwoorden: ["Hij strekt zich uit naar wat vóór hem ligt", "Hij kijkt steeds achterom", "Hij loopt rustig in plaats van te rennen", "Hij rust halverwege uit"],
            correct: "Hij strekt zich uit naar wat vóór hem ligt",
            bijbelplaats: "Filippenzen 3:13-14"
        }
    ],
    expert: [
        {
            vraag: "In welk gebied lag de stad Filippi?",
            antwoorden: ["Macedonië", "Egypte", "Galilea", "Syrië"],
            correct: "Macedonië",
            bijbelplaats: "Handelingen 16:12"
        },
        {
            vraag: "Waar moeten gelovigen volgens Paulus hun gedachten op richten?",
            antwoorden: ["Op alles wat waar, eerlijk en mooi is", "Op hun problemen", "Op wat anderen verkeerd doen", "Op het verleden"],
            correct: "Op alles wat waar, eerlijk en mooi is",
            bijbelplaats: "Filippenzen 4:8"
        },
        {
            vraag: "Paulus schrijft: \"Het leven is voor mij Christus…\" Hoe vult hij die zin aan?",
            antwoorden: ["…en het sterven is winst", "…en het sterven is verlies", "…en de dood is het einde", "…en het lijden is straf"],
            correct: "…en het sterven is winst",
            bijbelplaats: "Filippenzen 1:21"
        },
        {
            vraag: "In het lied over Jezus schrijft Paulus dat uiteindelijk alle mensen iets zullen doen. Wat zullen zij doen?",
            antwoorden: ["Knielen en belijden dat Jezus Heer is", "Vluchten en zich ergens gaan verbergen", "Zwijgen van angst", "Een offer brengen"],
            correct: "Knielen en belijden dat Jezus Heer is",
            bijbelplaats: "Filippenzen 2:10-11"
        },
        {
            vraag: "Paulus twijfelt tussen twee goede dingen. Tussen welke?",
            antwoorden: ["Blijven leven om te helpen, óf bij Christus zijn", "Naar Rome of naar Jeruzalem", "De gemeente bezoeken óf in de gevangenis blijven", "Werken of rusten"],
            correct: "Blijven leven om te helpen, óf bij Christus zijn",
            bijbelplaats: "Filippenzen 1:23-24"
        },
        {
            vraag: "Wie noemt Paulus aan het begin van de brief aan de Filippenzen als mede-afzender?",
            antwoorden: ["Timoteüs", "Petrus", "Lukas", "Marcus"],
            correct: "Timoteüs",
            bijbelplaats: "Filippenzen 1:1"
        },
        {
            vraag: "Wat wil Paulus dat de Filippenzen vasthouden, ook als hij er zelf niet bij is?",
            antwoorden: ["Eensgezindheid", "Hun goede naam", "Hun gewoonten", "Hun bezittingen"],
            correct: "Eensgezindheid",
            bijbelplaats: "Filippenzen 1:27"
        },
        {
            vraag: "Paulus vraagt Euodia en Syntyche, twee vrouwen in Filippi die ruzie met elkaar hadden, om het weer eens te worden. Maar hij schrijft ook iets moois over deze twee ruziënde vrouwen. Wat schrijft hij over hen?",
            antwoorden: ["Dat ze samen met hem gestreden hebben voor het goede nieuws", "Dat ze de rijkste vrouwen van Filippi waren", "Dat ze in hun eentje de hele gemeente in Filippi hadden gesticht", "Dat ze allebei door Lydia waren opgevoed"],
            correct: "Dat ze samen met hem gestreden hebben voor het goede nieuws",
            bijbelplaats: "Filippenzen 4:3"
        },
        {
            vraag: "Paulus zegt dat alles wat hij vroeger belangrijk vond nu \"verlies\" is. Waarmee vergelijkt hij die oude dingen zelfs?",
            antwoorden: ["Met vuilnis", "Met stof", "Met rook", "Met zand"],
            correct: "Met vuilnis",
            bijbelplaats: "Filippenzen 3:8"
        },
        {
            vraag: "Hoe verraste Paulus' gevangenschap iedereen? Wié hoorden er juist dóór hem van Christus?",
            antwoorden: ["Zelfs de soldaten van de keizerlijke wacht", "Alleen zijn medegevangenen", "De rijke kooplieden die hem in zijn cel bezochten", "Niemand, hij zat afgezonderd"],
            correct: "Zelfs de soldaten van de keizerlijke wacht",
            bijbelplaats: "Filippenzen 1:13"
        },
        {
            vraag: "Hoe noemt Paulus de Filippenzen liefkozend, als beeld van hoe trots en blij hij met hen is?",
            antwoorden: ["Zijn blijdschap en erekrans", "Zijn leerlingen", "Zijn allerkostbaarste bezit op deze aarde", "Zijn schapen"],
            correct: "Zijn blijdschap en erekrans",
            bijbelplaats: "Filippenzen 4:1"
        },
        {
            vraag: "Paulus zegt dat hij tevreden kan zijn, of hij nu veel heeft of weinig. Waardóór lukt hem dat?",
            antwoorden: ["Door Christus, die hem kracht geeft", "Door zelf heel sterk en dapper te zijn", "Door precies te krijgen wat hij wil", "Door zich nergens meer druk om te maken"],
            correct: "Door Christus, die hem kracht geeft",
            bijbelplaats: "Filippenzen 4:13"
        }
    ]
};

// =========================================================================
// 1 & 2 Tessalonicenzen — vragenpool (40 vragen: beginner 11, advanced 16,
// expert 13). Gebundeld boek: één quiz, één trofee (trofee_tessalonicenzen).
// vragenData["1 & 2 Tessalonicenzen"] met drie niveaus (beginner/advanced/
// expert). Per vraag: vraag, antwoorden[], correct (exact gelijk aan één
// antwoord), bijbelplaats. Niveau-indeling zoals goedgekeurd door Roel.
// =========================================================================
vragenData["1 & 2 Tessalonicenzen"] = {
    beginner: [
        {
            vraag: "Aan welke gemeente schreef Paulus deze twee brieven?",
            antwoorden: ["De gemeente in Tessalonica", "De gemeente in Filippi", "De gemeente in Korinte", "De gemeente in Berea"],
            correct: "De gemeente in Tessalonica",
            bijbelplaats: "1 Tessalonicenzen 1:1",
            kist: false
        },
        {
            vraag: "Paulus zegt: bid…",
            antwoorden: ["…zonder ophouden", "…alleen 's ochtends", "…alleen in de kerk", "…alleen als het moet"],
            correct: "…zonder ophouden",
            bijbelplaats: "1 Tessalonicenzen 5:17"
        },
        {
            vraag: "Wie schreef de brieven aan de Tessalonicenzen?",
            antwoorden: ["Paulus", "Petrus", "Johannes", "Jakobus"],
            correct: "Paulus",
            bijbelplaats: "1 Tessalonicenzen 1:1"
        },
        {
            vraag: "Wat voor soort teksten zijn 1 en 2 Tessalonicenzen?",
            antwoorden: ["Brieven", "Liederen", "Evangeliën", "Gebeden"],
            correct: "Brieven",
            bijbelplaats: "1 Tessalonicenzen 1:1"
        },
        {
            vraag: "Paulus zegt: wees altijd…",
            antwoorden: ["…blij", "…stil", "…bang", "…streng"],
            correct: "…blij",
            bijbelplaats: "1 Tessalonicenzen 5:16"
        },
        {
            vraag: "Hoe moeten de gelovigen elkaar volgens Paulus behandelen?",
            antwoorden: ["Elkaar bemoedigen en opbouwen", "Elkaar met rust laten", "Elkaar streng straffen", "Elkaar ontwijken"],
            correct: "Elkaar bemoedigen en opbouwen",
            bijbelplaats: "1 Tessalonicenzen 5:11"
        },
        {
            vraag: "In de tweede brief vraagt Paulus de Tessalonicenzen ergens voor te bidden. Waarvoor?",
            antwoorden: ["Dat het goede nieuws zich snel verspreidt", "Dat ze met rust gelaten worden", "Dat Paulus veilig door al zijn vele reizen komt", "Dat Paulus beroemd wordt"],
            correct: "Dat het goede nieuws zich snel verspreidt",
            bijbelplaats: "2 Tessalonicenzen 3:1"
        },
        {
            vraag: "Wat wenst Paulus de Tessalonicenzen toe aan het begin van zijn brieven?",
            antwoorden: ["Genade en vrede", "Geluk en gezondheid", "Kracht en roem", "Rust en stilte"],
            correct: "Genade en vrede",
            bijbelplaats: "1 Tessalonicenzen 1:1"
        },
        {
            vraag: "Hoe spreekt Paulus de gelovigen telkens liefdevol aan?",
            antwoorden: ["Als broeders en zusters", "Als leerlingen", "Als dienaren", "Als gasten"],
            correct: "Als broeders en zusters",
            bijbelplaats: "1 Tessalonicenzen 1:4"
        },
        {
            vraag: "Paulus zegt: leef rustig en bemoei je met je eigen werk. Waarmee moeten de gelovigen hun brood verdienen?",
            antwoorden: ["Met hun eigen handen", "Met bedelen", "Met lenen", "Met niksdoen"],
            correct: "Met hun eigen handen",
            bijbelplaats: "1 Tessalonicenzen 4:11"
        },
        {
            vraag: "Paulus zegt dat de gelovigen bij het licht horen, niet bij de nacht. Hoe moeten ze daarom zijn?",
            antwoorden: ["Wakker en helder van geest", "Lui en de hele dag door aan het slapen", "Bang", "Stil"],
            correct: "Wakker en helder van geest",
            bijbelplaats: "1 Tessalonicenzen 5:6"
        },
        {
            vraag: "Paulus schrijft dat gelovigen die gestorven zijn, niet voor altijd weg zijn. Wat gebeurt er met hen wanneer Jezus terugkomt?",
            antwoorden: ["Ze zullen weer opstaan en leven", "Ze blijven voor altijd slapen", "Ze worden sterren aan de hemel", "Er gebeurt verder niets"],
            correct: "Ze zullen weer opstaan en leven",
            bijbelplaats: "1 Tessalonicenzen 4:14"
        }
    ],
    advanced: [
        {
            vraag: "Hoe begint Paulus bijna elke keer als hij aan de Tessalonicenzen denkt?",
            antwoorden: ["Met danken voor hen", "Met een waarschuwing", "Met een verwijt", "Met een vraag"],
            correct: "Met danken voor hen",
            bijbelplaats: "1 Tessalonicenzen 1:2"
        },
        {
            vraag: "Wat belooft Paulus dat er ooit gaat gebeuren, tot troost van de gelovigen?",
            antwoorden: ["Jezus komt terug", "De tempel wordt herbouwd", "Paulus komt op bezoek", "De keizer wordt gelovig"],
            correct: "Jezus komt terug",
            bijbelplaats: "1 Tessalonicenzen 4:16"
        },
        {
            vraag: "Wat moeten de gelovigen volgens Paulus doen, wat er ook gebeurt?",
            antwoorden: ["Dankbaar blijven", "Flink en dapper zijn", "Zelf een oplossing bedenken", "Anderen om raad vragen"],
            correct: "Dankbaar blijven",
            bijbelplaats: "1 Tessalonicenzen 5:18"
        },
        {
            vraag: "Paulus prijst de Tessalonicenzen omdat hun geloof bekend is geworden. Tot waar?",
            antwoorden: ["Tot in heel Macedonië en nog verder", "Alleen in hun eigen stad", "Alleen in Jeruzalem", "Tot in het paleis van de keizer in Rome"],
            correct: "Tot in heel Macedonië en nog verder",
            bijbelplaats: "1 Tessalonicenzen 1:8"
        },
        {
            vraag: "Wat raadt Paulus aan over werk: wie niet wil werken…",
            antwoorden: ["…zou ook niet moeten eten", "…mag toch mee-eten", "…moet weggestuurd worden", "…moet dubbel betalen"],
            correct: "…zou ook niet moeten eten",
            bijbelplaats: "2 Tessalonicenzen 3:10"
        },
        {
            vraag: "Vlak vóór Paulus naar Tessalonica kwam, was hij in een andere stad slecht behandeld en gevangengezet. In welke stad?",
            antwoorden: ["Filippi", "Rome", "Athene", "Korinte"],
            correct: "Filippi",
            bijbelplaats: "1 Tessalonicenzen 2:2"
        },
        {
            vraag: "Paulus werkte zelf hard, zodat hij niemand tot last zou zijn. Wat was zijn beroep?",
            antwoorden: ["Tentenmaker", "Visser", "Timmerman", "Herder"],
            correct: "Tentenmaker",
            bijbelplaats: "Handelingen 18:3"
        },
        {
            vraag: "Paulus zegt: vergeld kwaad niet met kwaad, maar…",
            antwoorden: ["…doe altijd goed, voor elkaar en voor iedereen", "…zorg dat je het hem later dubbel en dwars terugbetaalt", "…vergeet het snel", "…blijf op je hoede"],
            correct: "…doe altijd goed, voor elkaar en voor iedereen",
            bijbelplaats: "1 Tessalonicenzen 5:15"
        },
        {
            vraag: "Wat moeten de gelovigen volgens Paulus met alles doen voordat ze het aannemen?",
            antwoorden: ["Alles onderzoeken en het goede vasthouden", "Alles meteen geloven", "Alles wat nieuw of vreemd is meteen verwerpen", "Alles vergeten"],
            correct: "Alles onderzoeken en het goede vasthouden",
            bijbelplaats: "1 Tessalonicenzen 5:21"
        },
        {
            vraag: "Paulus wil niet dat de gelovigen verdrietig zijn over gestorvenen zoals mensen \"zonder hoop\". Wat hebben de gelovigen wél?",
            antwoorden: ["Hoop: bij de komst van Jezus zien ze elkaar weer", "De troost dat de doden ergens verder leven als geesten", "Alleen herinneringen", "Verdriet voor altijd"],
            correct: "Hoop: bij de komst van Jezus zien ze elkaar weer",
            bijbelplaats: "1 Tessalonicenzen 4:13"
        },
        {
            vraag: "Waar kwamen de Tessalonicenzen vandaan vóór ze gingen geloven? Wat lieten ze achter?",
            antwoorden: ["De afgoden, om de levende God te dienen", "De tempel in Jeruzalem", "De grote feesten ter ere van de keizer", "Hun familie"],
            correct: "De afgoden, om de levende God te dienen",
            bijbelplaats: "1 Tessalonicenzen 1:9"
        },
        {
            vraag: "In welk land lag de stad Tessalonica?",
            antwoorden: ["Macedonië", "Klein-Azië", "Judea", "Italië"],
            correct: "Macedonië",
            bijbelplaats: "Handelingen 17:1"
        },
        {
            vraag: "Wat moeten de gelovigen volgens Paulus blijven doen, ook als ze het moeilijk hebben?",
            antwoorden: ["Niet moe worden om goed te doen", "Even pauze nemen tot het makkelijker wordt", "Alleen goed doen voor wie het verdient", "Wachten tot iemand anders begint"],
            correct: "Niet moe worden om goed te doen",
            bijbelplaats: "2 Tessalonicenzen 3:13"
        },
        {
            vraag: "Bij de komst van Jezus worden de levende gelovigen volgens Paulus \"opgenomen\". Waarheen?",
            antwoorden: ["De wolken in, de Heer tegemoet", "De tempel in", "Naar de allerhoogste top van de heilige berg Sion", "De hemelpoort door"],
            correct: "De wolken in, de Heer tegemoet",
            bijbelplaats: "1 Tessalonicenzen 4:17"
        },
        {
            vraag: "Paulus schrijft dat hij dag en nacht werkte toen hij bij de Tessalonicenzen was. Waarom deed hij dat?",
            antwoorden: ["Om niemand tot last te zijn", "Om rijk te worden", "Om beroemd te worden", "Om de keizer te plezieren"],
            correct: "Om niemand tot last te zijn",
            bijbelplaats: "1 Tessalonicenzen 2:9"
        },
        {
            vraag: "Paulus troost de gelovigen die vervolgd worden: God zal het rechtzetten. Wat belooft hij hun?",
            antwoorden: ["Rust, wanneer Jezus verschijnt", "Rijkdom op aarde", "Een groot leger om zich mee te kunnen verdedigen", "Wraak met het zwaard"],
            correct: "Rust, wanneer Jezus verschijnt",
            bijbelplaats: "2 Tessalonicenzen 1:7"
        }
    ],
    expert: [
        {
            vraag: "Waarmee vergelijkt Paulus zijn zorg voor de Tessalonicenzen?",
            antwoorden: ["Met een moeder die haar kinderen koestert", "Met een herder bij zijn schapen", "Met een tuinman bij zijn planten", "Met een leraar bij zijn leerlingen"],
            correct: "Met een moeder die haar kinderen koestert",
            bijbelplaats: "1 Tessalonicenzen 2:7"
        },
        {
            vraag: "Hoe noemt Paulus de gelovigen, omdat ze niet bij het donker maar bij het licht horen?",
            antwoorden: ["Kinderen van het licht", "Kinderen van de nacht", "Kinderen van de tempel", "Kinderen van de keizer"],
            correct: "Kinderen van het licht",
            bijbelplaats: "1 Tessalonicenzen 5:5"
        },
        {
            vraag: "Paulus zegt dat de dag van de Heer komt als iets onverwachts. Waarmee vergelijkt hij dat?",
            antwoorden: ["Met een dief in de nacht", "Met een storm op zee", "Met een bazuin in de morgen", "Met een ster aan de hemel"],
            correct: "Met een dief in de nacht",
            bijbelplaats: "1 Tessalonicenzen 5:2"
        },
        {
            vraag: "Hoe noemt Paulus de Tessalonicenzen, als beeld van hoe trots hij op hen is bij de komst van Jezus?",
            antwoorden: ["Zijn kroon om trots op te zijn", "Zijn leerlingen", "Zijn trouwste soldaten in de strijd", "Zijn schapen"],
            correct: "Zijn kroon om trots op te zijn",
            bijbelplaats: "1 Tessalonicenzen 2:19"
        },
        {
            vraag: "Paulus prijst de Tessalonicenzen om drie dingen: hun geloof, hun liefde en hun…",
            antwoorden: ["…hoop", "…wijsheid", "…kennis", "…kracht"],
            correct: "…hoop",
            bijbelplaats: "1 Tessalonicenzen 1:3"
        },
        {
            vraag: "Toen Paulus niet zelf naar Tessalonica kon komen, stuurde hij iemand anders om de gelovigen daar te bemoedigen. Wie stuurde hij?",
            antwoorden: ["Timoteüs", "Lukas", "Marcus", "Demas"],
            correct: "Timoteüs",
            bijbelplaats: "1 Tessalonicenzen 3:2"
        },
        {
            vraag: "Paulus gebruikt op twee plekken het beeld van een borstpantser. In zijn brief aan de Efeziërs is dat \"gerechtigheid\". Welk beeld gebruikt hij hier, in 1 Tessalonicenzen?",
            antwoorden: ["Geloof en liefde", "Gerechtigheid", "Goud en zilver", "Moed en kracht"],
            correct: "Geloof en liefde",
            bijbelplaats: "1 Tessalonicenzen 5:8"
        },
        {
            vraag: "Aan het eind van 2 Tessalonicenzen doet Paulus zelf iets met zijn eigen hand, als een soort handtekening. Wat doet hij?",
            antwoorden: ["Hij schrijft de groet eigenhandig", "Hij tekent een vis", "Hij drukt een zegel in was", "Hij schrijft in het Hebreeuws"],
            correct: "Hij schrijft de groet eigenhandig",
            bijbelplaats: "2 Tessalonicenzen 3:17"
        },
        {
            vraag: "Paulus beschrijft hoe de Heer zelf uit de hemel zal neerdalen. Welk geluid hoort daar volgens hem bij?",
            antwoorden: ["Een bevel, de stem van een aartsengel en een trompet van God", "Het gezang van duizenden engelen", "Een donderslag uit een heldere hemel", "Het geluid van machtige watervallen en bruisende zeeën"],
            correct: "Een bevel, de stem van een aartsengel en een trompet van God",
            bijbelplaats: "1 Tessalonicenzen 4:16"
        },
        {
            vraag: "In 2 Tessalonicenzen waarschuwt Paulus dat er vóór de dag van de Heer eerst iemand verschijnt die zich tegen God verzet en zich boven alles verheft. Hoe noemt Paulus deze figuur?",
            antwoorden: ["De wetteloze mens", "De valse profeet", "De koning van het zuiden", "De engel van de afgrond"],
            correct: "De wetteloze mens",
            bijbelplaats: "2 Tessalonicenzen 2:3-4"
        },
        {
            vraag: "Paulus bemoedigt de gelovigen: de Heer is trouw. Wat zal de Heer volgens Paulus voor hen doen?",
            antwoorden: ["Hij zal hen sterk maken en beschermen tegen de boze", "Hij zal hen meteen naar de hemel brengen", "Hij zal hun vijanden onmiddellijk straffen", "Hij zal hun een teken aan de hemel geven"],
            correct: "Hij zal hen sterk maken en beschermen tegen de boze",
            bijbelplaats: "2 Tessalonicenzen 3:3"
        },
        {
            vraag: "In 2 Tessalonicenzen spreekt Paulus mensen aan die niet willen werken. Wat doen deze mensen volgens hem juist wél?",
            antwoorden: ["Ze bemoeien zich met andermans zaken", "Ze slapen de hele dag", "Ze reizen van stad naar stad", "Ze houden lange toespraken"],
            correct: "Ze bemoeien zich met andermans zaken",
            bijbelplaats: "2 Tessalonicenzen 3:11"
        }
    ]
};

// =========================================================================
// Timoteüs & Titus — vragenpool (34 vragen: beginner 11, advanced 12,
// expert 11). Gebundeld boek: 1 & 2 Timoteüs + Titus, één quiz, één trofee
// (trofee_timoteus_titus). vragenData["Timoteüs & Titus"] met drie niveaus
// (beginner/advanced/expert). Per vraag: vraag, antwoorden[], correct (exact
// gelijk aan één antwoord), bijbelplaats. Neutraal taalgebruik (geen
// "voorganger"; "gemeente" = plaatselijke groep, "leider"/"medewerker"
// waar mogelijk). Niveau-indeling zoals goedgekeurd door Roel.
// =========================================================================
vragenData["Timoteüs & Titus"] = {
    beginner: [
        {
            vraag: "Wat moet Timoteüs volgens Paulus zijn voor de andere gelovigen?",
            antwoorden: ["Een goed voorbeeld", "Een wijze leraar", "Een sterke leider", "Een goede spreker"],
            correct: "Een goed voorbeeld",
            bijbelplaats: "1 Timoteüs 4:12"
        },
        {
            vraag: "Wat schrijft Paulus over de hele Schrift?",
            antwoorden: ["Ze is door God ingegeven en nuttig om van te leren", "Ze is door wijze mensen bedacht en mooi om te lezen", "Ze is door engelen geschreven en moeilijk te snappen", "Ze is door koningen bewaard en alleen voor priesters"],
            correct: "Ze is door God ingegeven en nuttig om van te leren",
            bijbelplaats: "2 Timoteüs 3:16"
        },
        {
            vraag: "Wie schreef de brieven aan Timoteüs en Titus?",
            antwoorden: ["Paulus", "Petrus", "Johannes", "Jakobus"],
            correct: "Paulus",
            bijbelplaats: "1 Timoteüs 1:1"
        },
        {
            vraag: "Wat voor soort teksten zijn 1 en 2 Timoteüs en Titus?",
            antwoorden: ["Brieven", "Liederen", "Evangeliën", "Gebeden"],
            correct: "Brieven",
            bijbelplaats: "1 Timoteüs 1:1"
        },
        {
            vraag: "Voor wie moeten de gelovigen volgens Paulus bidden?",
            antwoorden: ["Voor alle mensen", "Alleen voor vrienden", "Alleen voor gelovigen", "Alleen voor de koning"],
            correct: "Voor alle mensen",
            bijbelplaats: "1 Timoteüs 2:1-2"
        },
        {
            vraag: "Wat moeten Titus en de gelovigen volgens Paulus volop doen?",
            antwoorden: ["Goede dingen doen voor anderen", "Veel kennis verzamelen", "Vaak en lang bidden", "De wet uit hun hoofd leren"],
            correct: "Goede dingen doen voor anderen",
            bijbelplaats: "Titus 3:8"
        },
        {
            vraag: "Paulus zegt dat er één God is en één \"middelaar\" tussen God en mensen. Wie is die middelaar?",
            antwoorden: ["Jezus Christus", "Mozes", "Abraham", "De hogepriester"],
            correct: "Jezus Christus",
            bijbelplaats: "1 Timoteüs 2:5"
        },
        {
            vraag: "Paulus vraagt of Marcus naar hem toe gebracht kan worden. Waarom wil hij dat Marcus komt?",
            antwoorden: ["Omdat Marcus nuttig is voor het werk", "Omdat Marcus de weg goed kent", "Omdat Marcus ziek is", "Omdat Marcus sterk is"],
            correct: "Omdat Marcus nuttig is voor het werk",
            bijbelplaats: "2 Timoteüs 4:11"
        },
        {
            vraag: "Wat wil God volgens Paulus voor alle mensen?",
            antwoorden: ["Dat ze gered worden", "Dat ze het zelf verdienen", "Dat alleen de besten gered worden", "Dat ze veel weten"],
            correct: "Dat ze gered worden",
            bijbelplaats: "1 Timoteüs 2:4"
        },
        {
            vraag: "Paulus zegt dat Titus de mensen moet leren hoe ze tegen iedereen moeten zijn. Hoe moeten zij volgens hem zijn?",
            antwoorden: ["Vriendelijk en vredelievend", "Streng en hard", "Streng zwijgend en nooit een woord teveel spreken", "Slim en gehaaid"],
            correct: "Vriendelijk en vredelievend",
            bijbelplaats: "Titus 3:2"
        },
        {
            vraag: "Wat moet Timoteüs volgens Paulus goed bewaren, als een kostbare schat die hem is toevertrouwd?",
            antwoorden: ["Het geloof en het goede nieuws", "Zijn eigen ideeën", "De regels van de keizer", "De verhalen van vroeger"],
            correct: "Het geloof en het goede nieuws",
            bijbelplaats: "2 Timoteüs 1:14"
        }
    ],
    advanced: [
        {
            vraag: "De meeste brieven van Paulus zijn aan gemeenten gericht. Wat is bijzonder aan deze drie?",
            antwoorden: ["Ze zijn aan personen geschreven, niet aan een gemeente", "Ze zijn aan de leiders van alle Joodse synagogen tegelijk geschreven", "Ze zijn aan alle kerken tegelijk geschreven", "Ze zijn aan kinderen geschreven"],
            correct: "Ze zijn aan personen geschreven, niet aan een gemeente",
            bijbelplaats: "1 Timoteüs 1:1"
        },
        {
            vraag: "Timoteüs was nog jong. Wat zegt Paulus daarover?",
            antwoorden: ["Laat niemand op je neerkijken om je jonge leeftijd", "Wacht met leidinggeven tot je ouder bent", "Laat het spreken en leidinggeven maar over aan de oudere mannen", "Doe precies wat de oudere leiders zeggen"],
            correct: "Laat niemand op je neerkijken om je jonge leeftijd",
            bijbelplaats: "1 Timoteüs 4:12"
        },
        {
            vraag: "Waaraan moet Timoteüs volgens Paulus vasthouden, wat hij van jongs af aan kent?",
            antwoorden: ["De heilige Schrift", "De wetten van Rome", "De verhalen van zijn vrienden", "De liederen van de tempel"],
            correct: "De heilige Schrift",
            bijbelplaats: "2 Timoteüs 3:15"
        },
        {
            vraag: "Hoe moet Titus volgens Paulus de mensen het goede leren?",
            antwoorden: ["Door zelf het goede voorbeeld te geven", "Door hun strenge regels op te leggen", "Door veel te preken over de wet", "Door alleen de besten les te geven"],
            correct: "Door zelf het goede voorbeeld te geven",
            bijbelplaats: "Titus 2:7"
        },
        {
            vraag: "Paulus noemt het geloof een soort wedstrijd. Wat moet Timoteüs doen?",
            antwoorden: ["De goede strijd van het geloof strijden", "Zo hard mogelijk rennen", "Stoppen als het te zwaar wordt", "Anderen verslaan"],
            correct: "De goede strijd van het geloof strijden",
            bijbelplaats: "1 Timoteüs 6:12"
        },
        {
            vraag: "Wat zegt Paulus dat \"de wortel van alle kwaad\" is?",
            antwoorden: ["De liefde voor geld", "Luiheid", "Onwetendheid", "Hoogmoed"],
            correct: "De liefde voor geld",
            bijbelplaats: "1 Timoteüs 6:10"
        },
        {
            vraag: "Hoe moet een leider van de gemeente volgens Paulus zijn?",
            antwoorden: ["Betrouwbaar en gastvrij, niet snel boos", "Streng en gevreesd, zodat niemand tegenspreekt", "Rijk en machtig, met veel aanzien", "Slim en gehaaid, altijd op zijn voordeel uit"],
            correct: "Betrouwbaar en gastvrij, niet snel boos",
            bijbelplaats: "1 Timoteüs 3:2-3"
        },
        {
            vraag: "Aan het eind van zijn leven schrijft Paulus een beroemd geworden zin over hoe hij op zijn leven terugkijkt. Welke zin schrijft hij?",
            antwoorden: ["\"Ik heb de goede strijd gestreden, ik heb de wedloop volbracht\"", "\"Ik heb gedaan wat ik kon, de rest laat ik aan anderen\"", "\"Ik heb veel gestreden, maar het was tevergeefs\"", "\"Ik heb de wet gehouden en alle regels bewaard\""],
            correct: "\"Ik heb de goede strijd gestreden, ik heb de wedloop volbracht\"",
            bijbelplaats: "2 Timoteüs 4:7"
        },
        {
            vraag: "Hoe noemt Paulus Timoteüs en Titus in zijn brieven?",
            antwoorden: ["Mijn kind in het geloof", "Mijn trouwe leerling en volgeling", "Mijn dienaar", "Mijn vriend"],
            correct: "Mijn kind in het geloof",
            bijbelplaats: "1 Timoteüs 1:2"
        },
        {
            vraag: "Paulus schrijft: God gaf ons geen geest van angst, maar van…",
            antwoorden: ["…kracht, liefde en bezonnenheid", "…macht, rijkdom en aanzien", "…regels, straf en controle", "…rust, stilte en gemak"],
            correct: "…kracht, liefde en bezonnenheid",
            bijbelplaats: "2 Timoteüs 1:7"
        },
        {
            vraag: "Paulus zegt tegen Timoteüs: schaam je niet voor…",
            antwoorden: ["…het goede nieuws van Jezus", "…je eenvoudige afkomst", "…je gebrek aan kennis", "…de spot van anderen"],
            correct: "…het goede nieuws van Jezus",
            bijbelplaats: "2 Timoteüs 1:8"
        },
        {
            vraag: "Welke \"betrouwbare uitspraak\" geeft Paulus door — waarvoor kwam Christus in de wereld?",
            antwoorden: ["Om zondaars te redden", "Om koning te worden", "Om de tempel te bouwen", "Om regels te geven"],
            correct: "Om zondaars te redden",
            bijbelplaats: "1 Timoteüs 1:15"
        }
    ],
    expert: [
        {
            vraag: "Paulus kijkt in zijn brief aan Timoteüs terug op zijn eigen verleden, en hij verzacht niets. Hoe noemt hij zichzelf zoals hij vroeger was?",
            antwoorden: ["Een godslasteraar en een vervolger", "Een vrome Farizeeër", "Een goede Jood", "Een rechtvaardig man die altijd Gods wet volgde"],
            correct: "Een godslasteraar en een vervolger",
            bijbelplaats: "1 Timoteüs 1:13"
        },
        {
            vraag: "In welke stad had Paulus Timoteüs achtergelaten om de gemeente te helpen?",
            antwoorden: ["Efeze", "Kreta", "Korinte", "Rome"],
            correct: "Efeze",
            bijbelplaats: "1 Timoteüs 1:3"
        },
        {
            vraag: "Paulus waarschuwt tegen de jacht op geld met een nuchtere waarheid over geboorte en dood. Wat schrijft hij?",
            antwoorden: ["We hebben niets meegebracht in de wereld, en kunnen er ook niets uit meenemen", "Geld is de wortel van alle kwaad", "Rijke mensen komen niet in de hemel", "Wie arm is als hij dood gaat, krijgt in de hemel een veel grotere beloning dan wie rijk is als hij sterft"],
            correct: "We hebben niets meegebracht in de wereld, en kunnen er ook niets uit meenemen",
            bijbelplaats: "1 Timoteüs 6:7"
        },
        {
            vraag: "Midden in zijn brief barst Paulus ineens uit in een lofzang op God. Met welke titel noemt hij God daar?",
            antwoorden: ["De Koning der koningen en de Heer der heren", "De Rots van Israël", "De Vader van het licht", "De Wijnstok waaraan alle gelovigen als ranken vastzitten"],
            correct: "De Koning der koningen en de Heer der heren",
            bijbelplaats: "1 Timoteüs 6:15"
        },
{
            vraag: "Paulus zegt tegen Timoteüs: \"wakker het vuur weer aan.\" Wat bedoelt hij?",
            antwoorden: ["Gebruik de gave die God je hebt gegeven", "Word vuriger in het straffen van zonde", "Vernieuw je band met de gemeente", "Bid dag en nacht zonder ophouden"],
            correct: "Gebruik de gave die God je hebt gegeven",
            bijbelplaats: "2 Timoteüs 1:6"
        },
        {
            vraag: "Paulus vergelijkt het werken voor Christus met drie beroepen: iemand die vecht, iemand die rent, en iemand die op het land werkt. Welke drie beroepen noemt hij?",
            antwoorden: ["Een soldaat, een sportman en een boer", "Een koning, een priester en een profeet", "Een visser, een herder en een timmerman", "Een koopman, een schrijver en een arts"],
            correct: "Een soldaat, een sportman en een boer",
            bijbelplaats: "2 Timoteüs 2:3-6"
        },
        {
            vraag: "Paulus schrijft zijn laatste brief aan Timoteüs vanuit de gevangenis, geboeid als een misdadiger. En dan zet hij daar één zin tegenover die alles omdraait. Wat schrijft hij?",
            antwoorden: ["Maar het woord van God zit niet gevangen", "Maar ik zal binnenkort vrijkomen", "Maar de bewakers zijn tot geloof gekomen", "Maar mijn straf is niet zo zwaar"],
            correct: "Maar het woord van God zit niet gevangen",
            bijbelplaats: "2 Timoteüs 2:9"
        },
        {
            vraag: "In een groot huis staan voorwerpen van goud en zilver, maar ook van hout en aardewerk. Paulus gebruikt dat beeld voor de gemeente. Wat moet iemand volgens hem doen om een kostbaar voorwerp te worden?",
            antwoorden: ["Zichzelf reinigen van het verkeerde", "Rijk worden", "Veel leren", "Een zo hoog mogelijke functie in de gemeente krijgen"],
            correct: "Zichzelf reinigen van het verkeerde",
            bijbelplaats: "2 Timoteüs 2:20-21"
        },
{
            vraag: "Paulus schrijft dat er voor hem een \"krans\" klaarligt. Wat voor krans?",
            antwoorden: ["De krans van de gerechtigheid", "Een krans van bloemen", "Een gouden kroon", "De lauwerkrans van de keizer"],
            correct: "De krans van de gerechtigheid",
            bijbelplaats: "2 Timoteüs 4:8"
        },
        {
            vraag: "Aan het eind van zijn leven schrijft Paulus verdrietig over Demas, een medewerker die hem in de steek heeft gelaten. Wat was de reden dat Demas wegging?",
            antwoorden: ["Hij hield meer van deze wereld", "Hij werd ziek", "Hij was het niet eens met Paulus' leer", "Hij werd zelf gevangengenomen"],
            correct: "Hij hield meer van deze wereld",
            bijbelplaats: "2 Timoteüs 4:10"
        },
        {
            vraag: "Aan het einde van zijn laatste brief schrijft Paulus dat bijna iedereen weg is. Wie was nog wél bij hem?",
            antwoorden: ["Alleen Lukas", "Alleen Petrus", "Alleen Timoteüs", "Niemand"],
            correct: "Alleen Lukas",
            bijbelplaats: "2 Timoteüs 4:11"
        },
        {
            vraag: "In zijn laatste brief vraagt Paulus of Timoteüs iets praktisch voor hem wil meenemen. Wat vraagt hij mee te nemen?",
            antwoorden: ["Zijn mantel en zijn boeken", "Brood en water", "Een zwaard en een schild", "Goud en zilver"],
            correct: "Zijn mantel en zijn boeken",
            bijbelplaats: "2 Timoteüs 4:13"
        },
        {
            vraag: "Toen Paulus zich voor de rechter moest verdedigen, kwam er niemand voor hem op. Al zijn vrienden lieten hem in de steek. Wat schrijft hij daarover?",
            antwoorden: ["Ik bid dat het hun niet wordt aangerekend", "Ik zal het hun nooit vergeven", "God zal hen zwaar straffen", "Ik had het kunnen weten"],
            correct: "Ik bid dat het hun niet wordt aangerekend",
            bijbelplaats: "2 Timoteüs 4:16"
        },
        {
            vraag: "Op welk eiland had Paulus Titus achtergelaten om de gemeenten te helpen?",
            antwoorden: ["Kreta", "Cyprus", "Malta", "Patmos"],
            correct: "Kreta",
            bijbelplaats: "Titus 1:5"
        },
        {
            vraag: "Paulus was zelf vertrokken en liet Titus achter op Kreta. Wat moest Titus daar in elke stad regelen?",
            antwoorden: ["Geschikte leiders aanstellen voor de gemeenten", "In elke stad een grote kerk bouwen", "Belasting innen", "Scholen openen"],
            correct: "Geschikte leiders aanstellen voor de gemeenten",
            bijbelplaats: "Titus 1:5"
        },
        {
            vraag: "Paulus geeft Titus raad voor vier verschillende groepen in de gemeente, en tegen elke groep zegt hij iets anders. Welke vier groepen zijn dat?",
            antwoorden: ["Oudere mannen, oudere vrouwen, jonge vrouwen en jonge mannen", "Priesters, schriftgeleerden, profeten en de oudsten van het volk", "Joden, Grieken, slaven en vrijen", "Armen, rijken, zieken en gezonden"],
            correct: "Oudere mannen, oudere vrouwen, jonge vrouwen en jonge mannen",
            bijbelplaats: "Titus 2:2-6"
        }
    ]
};

// =========================================================================
// Kolossenzen & Filemon — vragenpool (38 vragen: beginner 14, advanced 11,
// expert 13). Gebundeld boek: één quiz, één trofee (trofee_kolossenzen_filemon).
// Formaat gelijk aan de andere boeken: vragenData["Kolossenzen & Filemon"] met
// drie niveaus (beginner / advanced / expert). Per vraag: vraag, antwoorden[],
// correct (exact gelijk aan één antwoord), bijbelplaats. Niveau-indeling zoals
// goedgekeurd door Roel. Filemon heeft één hoofdstuk; verzen als "Filemon 10".
// =========================================================================
vragenData["Kolossenzen & Filemon"] = {
    beginner: [
        {
            vraag: "Aan welke gemeente schreef Paulus de brief aan de Kolossenzen?",
            antwoorden: ["De gemeente in Kolosse", "De gemeente in Laodicea", "De gemeente in Filippi", "De gemeente in Efeze"],
            correct: "De gemeente in Kolosse",
            bijbelplaats: "Kolossenzen 1:2"
        },
        {
            vraag: "Vanuit welke situatie schreef Paulus zijn brief aan de Kolossenzen?",
            antwoorden: ["Vanuit de gevangenis", "Vanuit de tempel", "Vanuit een schip op zee", "Vanuit zijn werkplaats"],
            correct: "Vanuit de gevangenis",
            bijbelplaats: "Kolossenzen 4:18"
        },
        {
            vraag: "Paulus zegt: zoek de dingen die \"boven\" zijn. Wat bedoelt hij?",
            antwoorden: ["Richt je op God en de hemel", "Klim vaak een berg op", "Kijk zo veel mogelijk omhoog", "Ga hoog op een heuvel wonen"],
            correct: "Richt je op God en de hemel",
            bijbelplaats: "Kolossenzen 3:1-2"
        },
        {
            vraag: "Paulus zegt: wat je ook doet, doe het…",
            antwoorden: ["…van harte, voor de Heer", "…zo snel mogelijk", "…alleen als anderen kijken", "…alleen als je er zin in hebt"],
            correct: "…van harte, voor de Heer",
            bijbelplaats: "Kolossenzen 3:23"
        },
        {
            vraag: "Hoe moeten de gelovigen elkaar behandelen als iemand iets verkeerd doet?",
            antwoorden: ["Elkaar vergeven, zoals de Heer hen vergaf", "Elkaar streng straffen", "Doen alsof er helemaal niets gebeurd is", "Gewoon de ander terugpakken"],
            correct: "Elkaar vergeven, zoals de Heer hen vergaf",
            bijbelplaats: "Kolossenzen 3:13"
        },
        {
            vraag: "Wie schreef de brief aan de Kolossenzen?",
            antwoorden: ["Paulus", "Petrus", "Johannes", "Jakobus"],
            correct: "Paulus",
            bijbelplaats: "Kolossenzen 1:1"
        },
        {
            vraag: "Wat voor soort tekst is de brief aan Filemon?",
            antwoorden: ["Een korte, persoonlijke brief", "Een lang evangelie", "Een verslag van een van de grote reizen", "Een gebed"],
            correct: "Een korte, persoonlijke brief",
            bijbelplaats: "Filemon 1"
        },
        {
            vraag: "Paulus zegt: doe alles in de naam van wie?",
            antwoorden: ["De Heer Jezus", "De keizer", "Paulus zelf", "De tempel"],
            correct: "De Heer Jezus",
            bijbelplaats: "Kolossenzen 3:17"
        },
        {
            vraag: "Wat moeten de gelovigen volgens Paulus laten \"heersen\" in hun hart?",
            antwoorden: ["De vrede van Christus", "De boosheid", "De strijd tegen andere gelovigen", "De jaloezie"],
            correct: "De vrede van Christus",
            bijbelplaats: "Kolossenzen 3:15"
        },
        {
            vraag: "Waaraan moeten de gelovigen trouw blijven, dankbaar en waakzaam?",
            antwoorden: ["Aan het gebed", "Aan het werk", "Aan de regels", "Aan de tempel"],
            correct: "Aan het gebed",
            bijbelplaats: "Kolossenzen 4:2"
        },
        {
            vraag: "Onesimus was bij Paulus in de gevangenis gaan geloven. Hoe noemt Paulus hem daarom?",
            antwoorden: ["Zijn kind, dat in de gevangenis \"geboren\" werd", "Zijn dienaar", "Zijn leerling", "Zijn medegevangene die ook op straf wachtte"],
            correct: "Zijn kind, dat in de gevangenis \"geboren\" werd",
            bijbelplaats: "Filemon 10"
        },
        {
            vraag: "Hoe moeten de gelovigen volgens Paulus zingen tot God?",
            antwoorden: ["Met psalmen en liederen, dankbaar in hun hart", "Alleen in het Latijn", "Alleen in de tempel en nergens anders", "Alleen op feestdagen"],
            correct: "Met psalmen en liederen, dankbaar in hun hart",
            bijbelplaats: "Kolossenzen 3:16"
        },
        {
            vraag: "Wat moeten de gelovigen volgens Paulus uit hun oude leven wegdoen?",
            antwoorden: ["Slechte dingen zoals jaloezie en woede", "Alle leuke dingen", "Elk contact met mensen die anders geloven", "Contact met niet-gelovigen"],
            correct: "Slechte dingen zoals jaloezie en woede",
            bijbelplaats: "Kolossenzen 3:8"
        },
        {
            vraag: "Paulus schrijft dat in Christus \"de volheid van God\" woont. Wat bedoelt hij daarmee?",
            antwoorden: ["God is volledig in Jezus aanwezig", "Jezus is een gewone profeet", "God woont vooral in de tempel", "Jezus werd pas later God"],
            correct: "God is volledig in Jezus aanwezig",
            bijbelplaats: "Kolossenzen 2:9"
        }
    ],
    advanced: [
        {
            vraag: "Waarmee moeten de gelovigen zich \"kleden\", schrijft Paulus?",
            antwoorden: ["Met goedheid, geduld en liefde", "Met mooie, dure kleren", "Met een ijzeren wapenrusting", "Met witte gewaden"],
            correct: "Met goedheid, geduld en liefde",
            bijbelplaats: "Kolossenzen 3:12"
        },
        {
            vraag: "Paulus noemt Jezus \"het beeld van de onzichtbare God\". Wat bedoelt hij?",
            antwoorden: ["In Jezus zie je hoe God is", "Jezus lijkt op een schilderij", "God is altijd onzichtbaar gebleven", "Jezus is door God gemaakt"],
            correct: "In Jezus zie je hoe God is",
            bijbelplaats: "Kolossenzen 1:15"
        },
        {
            vraag: "Wat is volgens Paulus het allerbelangrijkste om \"over alles heen\" aan te trekken?",
            antwoorden: ["De liefde", "De vrede", "Het geduld", "De vriendelijkheid"],
            correct: "De liefde",
            bijbelplaats: "Kolossenzen 3:14"
        },
        {
            vraag: "Wat vraagt Paulus aan Filemon over Onesimus?",
            antwoorden: ["Om hem terug te ontvangen als een broeder", "Om hem te straffen", "Om hem weg te sturen", "Om hem streng te straffen voor zijn weglopen"],
            correct: "Om hem terug te ontvangen als een broeder",
            bijbelplaats: "Filemon 17"
        },
        {
            vraag: "De naam Onesimus betekent \"nuttig\". Welke woordgrap maakt Paulus daarmee?",
            antwoorden: ["Vroeger was hij onbruikbaar, nu juist heel bruikbaar", "Hij zou zijn naam pas veel later helemaal waarmaken", "Zijn naam paste niet bij hem", "Hij moest nog nuttig worden"],
            correct: "Vroeger was hij onbruikbaar, nu juist heel bruikbaar",
            bijbelplaats: "Filemon 11"
        },
        {
            vraag: "Wat biedt Paulus aan over de schuld die Onesimus misschien nog had?",
            antwoorden: ["Paulus zal het zelf betalen", "De schuld hoeft van niemand betaald te worden", "Filemon moet het kwijtschelden", "Onesimus moet ervoor werken"],
            correct: "Paulus zal het zelf betalen",
            bijbelplaats: "Filemon 18-19"
        },
        {
            vraag: "Hoe noemt Paulus zichzelf in de brief aan Filemon — niet als koning, maar als?",
            antwoorden: ["Een gevangene van Christus", "Een rechter", "Een soldaat", "Een machtige leraar van de wet"],
            correct: "Een gevangene van Christus",
            bijbelplaats: "Filemon 1"
        },
        {
            vraag: "Paulus noemt Christus het \"hoofd\". Waarvan is Hij het hoofd?",
            antwoorden: ["Van de kerk, zijn lichaam", "Van het Romeinse rijk", "Van de tempel", "Van de engelen"],
            correct: "Van de kerk, zijn lichaam",
            bijbelplaats: "Kolossenzen 1:18"
        },
        {
            vraag: "Paulus hoopt binnenkort zelf bij Filemon op bezoek te komen. Wat vraagt hij hem daarom alvast klaar te maken?",
            antwoorden: ["Een logeerkamer", "Een maaltijd", "Een geschenk", "Een antwoordbrief"],
            correct: "Een logeerkamer",
            bijbelplaats: "Filemon 22"
        },
        {
            vraag: "Paulus zegt dat God de gelovigen heeft overgebracht van het ene rijk naar het andere. Van welk naar welk?",
            antwoorden: ["Van de duisternis naar het rijk van Gods Zoon", "Van Egypte naar het beloofde land", "Van het land van de vijand naar het huis van de koning", "Van de tempel naar de hemel"],
            correct: "Van de duisternis naar het rijk van Gods Zoon",
            bijbelplaats: "Kolossenzen 1:13"
        },
        {
            vraag: "Paulus noemt Christus de \"eerstgeborene\". Waarvan?",
            antwoorden: ["Van heel de schepping", "Van de familie van Jozef", "Van de twaalf leerlingen", "Van de gemeente in Kolosse"],
            correct: "Van heel de schepping",
            bijbelplaats: "Kolossenzen 1:15"
        }
    ],
    expert: [
        {
            vraag: "Paulus schrijft deze brief aan een gemeente die hij zelf nooit heeft bezocht. Epafras, een man uit Kolosse, had daar het goede nieuws gebracht en was daarna naar Paulus gereisd om verslag te doen. Wat betekent dat voor Paulus' band met de Kolossenzen?",
            antwoorden: ["Hij had de meesten van hen nog nooit ontmoet", "Hij had de gemeente zelf gesticht", "Hij had er jarenlang gewoond", "Hij kende iedereen daar al vanaf zijn jeugd"],
            correct: "Hij had de meesten van hen nog nooit ontmoet",
            bijbelplaats: "Kolossenzen 1:7 en 2:1"
        },
        {
            vraag: "Paulus schrijft een lofzang op Christus, waarin hij zegt dat alles door hem geschapen is: in de hemel en op de aarde. En dan voegt hij er iets aan toe wat je makkelijk over het hoofd ziet. Wat rekent hij er ook bij?",
            antwoorden: ["Ook de dingen die je niet kunt zien", "Alleen de aarde en de zee", "Alleen de mensen en de dieren", "Alleen wat mooi en goed is"],
            correct: "Ook de dingen die je niet kunt zien",
            bijbelplaats: "Kolossenzen 1:16"
        },
        {
            vraag: "Paulus schrijft dat Christus er \"eerder dan alles\" was. Wat bedoelt hij daarmee?",
            antwoorden: ["Christus bestond al voordat er iets gemaakt werd", "Christus kwam als eerste in Kolosse aan", "Christus was de eerste leerling van Johannes", "Christus sprak als eerste in de tempel"],
            correct: "Christus bestond al voordat er iets gemaakt werd",
            bijbelplaats: "Kolossenzen 1:17"
        },
        {
            vraag: "Paulus vertelt dat God een geheim had, dat eeuwenlang verborgen bleef voor alle generaties. Nu is het eindelijk bekendgemaakt, en het bleek geen ingewikkelde formule te zijn. Wat is dat geheim?",
            antwoorden: ["Christus is in jullie, en dat is de hoop op Gods heerlijkheid", "De dag waarop Jezus terugkomt", "Waar de ark van het verbond verstopt is", "Een geheime formule waarmee je zelf allerlei wonderen kunt verrichten"],
            correct: "Christus is in jullie, en dat is de hoop op Gods heerlijkheid",
            bijbelplaats: "Kolossenzen 1:27"
        },
        {
            vraag: "In Kolosse liepen leraren rond die beweerden dat zij een geheime, hogere kennis bezaten die de gewone gelovigen misten. Paulus antwoordt dat er inderdaad een schat verborgen ligt, maar dan in Christus zelf. Wat ligt daar volgens hem verborgen?",
            antwoorden: ["Alle schatten van wijsheid en kennis", "Alle goud van de tempel", "Alle boeken van de profeten", "Alle namen van de gelovigen"],
            correct: "Alle schatten van wijsheid en kennis",
            bijbelplaats: "Kolossenzen 2:2-3"
        },
        {
            vraag: "Paulus is bang dat de Kolossenzen zich laten inpakken. Hij waarschuwt hen zoals een herder die een wolf ziet aankomen: let op dat niemand jullie als buit meesleept. Waarmee zouden die mensen hen meeslepen?",
            antwoorden: ["Met filosofie en holle woorden van mensen", "Met mooie beloften over rijkdom en macht", "Met soldaten van de keizer", "Met valse wonderen"],
            correct: "Met filosofie en holle woorden van mensen",
            bijbelplaats: "Kolossenzen 2:8"
        },
        {
            vraag: "Paulus legt uit wat er bij de doop eigenlijk gebeurt: je wordt verbonden met iets wat Christus zelf heeft meegemaakt. Met welke twee gebeurtenissen uit zijn leven vergelijkt Paulus de doop?",
            antwoorden: ["Met hem begraven worden, en met hem opstaan", "Met hem geboren worden en opgroeien", "Met hem de woestijn in gaan", "Met hem naar de hemel opstijgen"],
            correct: "Met hem begraven worden, en met hem opstaan",
            bijbelplaats: "Kolossenzen 2:12"
        },
        {
            vraag: "Paulus gebruikt het beeld van een schuldbriefje: een lijst waarop alles staat wat wij verkeerd hebben gedaan, en die tegen ons getuigt. Zo'n briefje kun je bewaren, of doorverkopen, of laten afbetalen. In een enkele zin vertelt Paulus wat God ermee gedaan heeft. Wat gebeurde er met dat briefje?",
            antwoorden: ["God heeft het doorgestreept en aan het kruis genageld", "God bewaart het tot het laatste oordeel", "God heeft het aan de engelen gegeven", "God bewaart het zorgvuldig tot de dag van het oordeel"],
            correct: "God heeft het doorgestreept en aan het kruis genageld",
            bijbelplaats: "Kolossenzen 2:14"
        },
        {
            vraag: "In Kolosse liep een leer rond die heel vroom leek, maar die Christus stilletjes opzijschoof. Paulus waarschuwt er streng tegen. Wat wilden die leraren dat de gelovigen deden?",
            antwoorden: ["Engelen aanbidden", "De keizer aanbidden", "De zon aanbidden", "De tempel aanbidden"],
            correct: "Engelen aanbidden",
            bijbelplaats: "Kolossenzen 2:18"
        },
        {
            vraag: "Waarmee vergelijkt Paulus het beginnen van een nieuw leven met Christus?",
            antwoorden: ["Met het aantrekken van een nieuw mens", "Met het bouwen van een huis", "Met het planten van een boom", "Met het winnen van een wedstrijd"],
            correct: "Met het aantrekken van een nieuw mens",
            bijbelplaats: "Kolossenzen 3:10"
        },
        {
            vraag: "In de gemeente van Kolosse zaten mensen door elkaar die in de gewone wereld nooit samen aan tafel zouden zijn gegaan: Joden en Grieken, slaven en vrije burgers. Paulus zegt dat zulke verschillen in Christus wegvallen. Hoe vat hij dat samen?",
            antwoorden: ["Christus is alles, en in allen", "Christus kiest de Grieken uit", "Christus telt alleen de vrije mensen", "Christus maakt iedereen tot Jood"],
            correct: "Christus is alles, en in allen",
            bijbelplaats: "Kolossenzen 3:11"
        },
        {
            vraag: "Paulus zit gevangen terwijl hij deze brief schrijft. Aan het eind vraagt hij de Kolossenzen om voor hem te bidden. Waarvoor vraagt hij precies gebed?",
            antwoorden: ["Dat God een deur zou openen voor zijn boodschap", "Dat hij snel uit de gevangenis zou komen", "Dat hij gezond zou blijven", "Dat hij Kolosse eindelijk zou kunnen bezoeken"],
            correct: "Dat God een deur zou openen voor zijn boodschap",
            bijbelplaats: "Kolossenzen 4:3"
        },
        {
            vraag: "Paulus geeft raad over hoe je omgaat met mensen die niet geloven: wees wijs en gebruik je tijd goed. En dan zegt hij ook nog iets over de manier waarop je praat. Hoe moet je spreken?",
            antwoorden: ["Vriendelijk, en als het ware gekruid met zout", "Streng en hard, zodat ze meteen ontzag voor je hebben", "Zwijgzaam, zo min mogelijk", "Luid, zodat iedereen het hoort"],
            correct: "Vriendelijk, en als het ware gekruid met zout",
            bijbelplaats: "Kolossenzen 4:6"
        },
        {
            vraag: "Paulus zegt dat zijn medewerker Epafras hard voor de Kolossenzen werkt. Waarmee?",
            antwoorden: ["Met bidden", "Met bouwen", "Met reizen", "Met geld inzamelen"],
            correct: "Met bidden",
            bijbelplaats: "Kolossenzen 4:12-13"
        },
        {
            vraag: "Paulus noemt Marcus familie van een bekende medewerker. Van wie is Marcus de neef?",
            antwoorden: ["Van Barnabas", "Van Petrus", "Van Paulus", "Van Timoteüs"],
            correct: "Van Barnabas",
            bijbelplaats: "Kolossenzen 4:10"
        },
        {
            vraag: "Paulus groet aan het eind een trouwe medewerker die ook arts was. Hoe heette deze dokter?",
            antwoorden: ["Lukas", "Marcus", "Demas", "Aristarchus"],
            correct: "Lukas",
            bijbelplaats: "Kolossenzen 4:14"
        },
        {
            vraag: "Paulus vraagt de Kolossenzen om hun brief ook in een andere stad te laten voorlezen. Welke stad noemt hij?",
            antwoorden: ["Laodicea", "Rome", "Jeruzalem", "Efeze"],
            correct: "Laodicea",
            bijbelplaats: "Kolossenzen 4:16"
        },
        {
            vraag: "Paulus groet niet alleen Filemon zelf, maar ook de groep gelovigen die bij hem bij elkaar komt. In die eerste jaren bestonden er nog geen aparte gebouwen voor christenen. Waar kwamen zij dus samen?",
            antwoorden: ["Gewoon bij iemand thuis", "In een apart kerkgebouw", "In de synagoge", "Op het marktplein"],
            correct: "Gewoon bij iemand thuis",
            bijbelplaats: "Filemon 2"
        },
        {
            vraag: "Paulus had Onesimus makkelijk bij zich kunnen houden, want hij had veel aan hem. Toch stuurt hij hem terug, en hij wil niets beslissen zonder Filemon eerst te vragen. Waarom niet?",
            antwoorden: ["Omdat het goede dat Filemon doet vrijwillig moet zijn, en niet gedwongen", "Omdat hij zelf niet wist wat het beste was", "Omdat hij bang was dat Filemon naar de rechter zou stappen", "Omdat hij bang was dat Filemon anders juist heel erg boos op hem zou worden"],
            correct: "Omdat het goede dat Filemon doet vrijwillig moet zijn, en niet gedwongen",
            bijbelplaats: "Filemon 14"
        },
        {
            vraag: "Onesimus was weggelopen bij zijn meester, en dat was in die tijd een ernstige misdaad. Toch schrijft Paulus voorzichtig dat er misschien iets goeds in schuilt. Wat oppert hij?",
            antwoorden: ["Dat Filemon hem nu voorgoed terugkrijgt, niet als slaaf maar als broeder", "Dat hij Paulus in de gevangenis kon verzorgen", "Dat hij op zijn vlucht veel van de grote wijde wereld heeft gezien", "Dat hij Filemon een lesje wilde leren"],
            correct: "Dat Filemon hem nu voorgoed terugkrijgt, niet als slaaf maar als broeder",
            bijbelplaats: "Filemon 15-16"
        },
        {
            vraag: "Waar was Paulus zo zeker van toen hij Filemon schreef?",
            antwoorden: ["Dat Filemon zelfs méér zou doen dan hij vroeg", "Dat Filemon zijn verzoek zonder meer zou weigeren", "Dat ze elkaar snel weer zouden zien", "Dat Filemon niets zou doen"],
            correct: "Dat Filemon zelfs méér zou doen dan hij vroeg",
            bijbelplaats: "Filemon 21"
        }
    ]
};

// Hebreeën — vragenpool (eerste boek van de Algemene brieven).
// Formaat gelijk aan de andere boeken: vragenData["Hebreeën"] met drie niveaus
// (beginner/advanced/expert). 17 beginner, 20 advanced, 16 expert = 53 vragen.
vragenData["Hebreeën"] = {
    beginner: [
        {
            vraag: "Welke man bouwde volgens Hebreeën 11 door zijn geloof een ark?",
            antwoorden: ["Noach", "Mozes", "Abraham", "Henoch"],
            correct: "Noach",
            bijbelplaats: "Hebreeën 11:7"
        },
        {
            vraag: "Welke leider, die het volk Israël uit Egypte bracht, wordt in Hebreeën 11 geprezen om zijn geloof?",
            antwoorden: ["Mozes", "Jozua", "Aäron", "Gideon"],
            correct: "Mozes",
            bijbelplaats: "Hebreeën 11:24-27"
        },
        {
            vraag: "Jezus is in alles op de proef gesteld, net als wij. Wat is volgens Hebreeën het grote verschil met ons?",
            antwoorden: ["Hij deed het zonder ooit te zondigen", "Hij werd nooit echt verzocht", "Hij voelde geen pijn of verdriet", "Hij had het altijd makkelijk"],
            correct: "Hij deed het zonder ooit te zondigen",
            bijbelplaats: "Hebreeën 4:15"
        },
        {
            vraag: "Welke zoon van Adam bracht door zijn geloof een offer dat God aannam?",
            antwoorden: ["Abel", "Set", "Henoch", "Kaïn"],
            correct: "Abel",
            bijbelplaats: "Hebreeën 11:4"
        },
        {
            vraag: "Hebreeën noemt Jezus, die door God uit de dood is teruggebracht, de grote … van de schapen.",
            antwoorden: ["herder", "koning", "vader", "vriend"],
            correct: "herder",
            bijbelplaats: "Hebreeën 13:20"
        },
        {
            vraag: "Wat zijn de engelen volgens het begin van Hebreeën? Het zijn dienaren die God stuurt om …",
            antwoorden: ["de gelovigen te helpen", "de sterren te besturen", "over de mensen te heersen", "zelf aanbeden te worden"],
            correct: "de gelovigen te helpen",
            bijbelplaats: "Hebreeën 1:14"
        },
        {
            vraag: "Welke koning van Israël wordt in Hebreeën 11 genoemd bij de geloofshelden?",
            antwoorden: ["David", "Saul", "Salomo", "Achab"],
            correct: "David",
            bijbelplaats: "Hebreeën 11:32"
        },
        {
            vraag: "Hebreeën begint zo: vroeger sprak God door de profeten, maar nu heeft Hij tot ons gesproken door zijn …",
            antwoorden: ["Zoon", "engelen", "koningen", "boeken"],
            correct: "Zoon",
            bijbelplaats: "Hebreeën 1:1-2"
        },
        {
            vraag: "Jezus leeft altijd bij God. Wat doet Hij daar volgens Hebreeën steeds voor ons?",
            antwoorden: ["Hij pleit voor ons bij God", "Hij houdt onze fouten bij op een lijst", "Hij wacht tot wij het zelf oplossen", "Hij laat het oordeel over aan de engelen"],
            correct: "Hij pleit voor ons bij God",
            bijbelplaats: "Hebreeën 7:25"
        },
        {
            vraag: "Hebreeën zegt dat we door geloof begrijpen dat de hele wereld is ontstaan. Door wat is alles volgens Hebreeën gemaakt?",
            antwoorden: ["Door het woord van God", "Door een grote knal", "Door de zon", "Door toeval"],
            correct: "Door het woord van God",
            bijbelplaats: "Hebreeën 11:3"
        },
        {
            vraag: "Waar moeten de gelovigen volgens Hebreeën met iedereen naar streven?",
            antwoorden: ["Naar vrede", "Naar hun eigen gelijk", "Naar de hoogste plaats", "Naar zoveel mogelijk bezit"],
            correct: "Naar vrede",
            bijbelplaats: "Hebreeën 12:14"
        },
        {
            vraag: "Wat zal God volgens Hebreeën niet vergeten?",
            antwoorden: ["Het goede dat je uit liefde voor anderen doet", "Elke keer dat je een fout maakte", "Hoeveel je van anderen hebt gekregen", "Hoe vaak je gelijk had"],
            correct: "Het goede dat je uit liefde voor anderen doet",
            bijbelplaats: "Hebreeën 6:10"
        },
        {
            vraag: "Wat doet God volgens Hebreeën met de fouten die Hij vergeeft?",
            antwoorden: ["Hij denkt er niet meer aan", "Hij bewaart ze voor later", "Hij vertelt ze aan anderen", "Hij straft ze alsnog een beetje"],
            correct: "Hij denkt er niet meer aan",
            bijbelplaats: "Hebreeën 10:17"
        },
        {
            vraag: "Wat blijft er volgens Hebreeën nog over voor het volk van God?",
            antwoorden: ["Een rust die God heeft beloofd", "Een beloning voor wie het hardst werkt", "Een leven zonder moeite hier op aarde", "Een plek alleen voor de sterksten"],
            correct: "Een rust die God heeft beloofd",
            bijbelplaats: "Hebreeën 4:9"
        },
        {
            vraag: "Hebreeën geeft een mooie belofte van God aan de gelovigen. Wat belooft God?",
            antwoorden: ["Ik zal je nooit in de steek laten", "Ik zal je nooit laten werken", "Ik zal je altijd je zin geven", "Ik zal je nooit iets vragen"],
            correct: "Ik zal je nooit in de steek laten",
            bijbelplaats: "Hebreeën 13:5"
        },
        {
            vraag: "Wat hebben de gelovigen nodig, zodat ze ontvangen wat God beloofd heeft?",
            antwoorden: ["Blijven volhouden", "Nooit meer een fout maken", "Precies alle regels kennen", "Zelf sterk genoeg zijn"],
            correct: "Blijven volhouden",
            bijbelplaats: "Hebreeën 10:36"
        }
    ],
    advanced: [
        {
            vraag: "De brief aan de Hebreeën noemt Jezus onze grote …, die ons bij God vertegenwoordigt. Welk woord hoort hier?",
            antwoorden: ["Hogepriester", "Engel", "Koning", "Profeet"],
            correct: "Hogepriester",
            bijbelplaats: "Hebreeën 4:14"
        },
        {
            vraag: "Door het geloof vielen de muren van een stad om nadat het volk er zeven dagen omheen was getrokken. Welke stad?",
            antwoorden: ["Jericho", "Jeruzalem", "Babylon", "Nineve"],
            correct: "Jericho",
            bijbelplaats: "Hebreeën 11:30"
        },
        {
            vraag: "Hebreeën zegt: 'Jezus Christus is gisteren en vandaag dezelfde en tot in eeuwigheid.' Wat betekent dat?",
            antwoorden: ["Hij verandert nooit", "Hij komt elke dag terug", "Hij was er pas vanaf Kerst", "Hij is anders voor elk volk"],
            correct: "Hij verandert nooit",
            bijbelplaats: "Hebreeën 13:8"
        },
        {
            vraag: "Hebreeën vergelijkt het geloofsleven met een wedloop. Naar wie moeten we blijven kijken terwijl we de wedstrijd lopen?",
            antwoorden: ["Jezus", "Mozes", "De engelen", "Onszelf"],
            correct: "Jezus",
            bijbelplaats: "Hebreeën 12:1-2"
        },
        {
            vraag: "Wees gastvrij voor vreemdelingen, zegt Hebreeën, want sommige mensen hebben zonder het te weten … ontvangen.",
            antwoorden: ["engelen", "koningen", "soldaten", "vijanden"],
            correct: "engelen",
            bijbelplaats: "Hebreeën 13:2"
        },
        {
            vraag: "God voedt ons uit liefde op. Met wie vergelijkt Hebreeën dat?",
            antwoorden: ["Met een vader die zijn kind opvoedt", "Met een koning die zijn volk regeert", "Met een baas die zijn werkers aanstuurt", "Met een rechter die vonnis wijst"],
            correct: "Met een vader die zijn kind opvoedt",
            bijbelplaats: "Hebreeën 12:6-7"
        },
        {
            vraag: "Hoe vaak moest Jezus volgens Hebreeën zichzelf offeren om de zonden weg te nemen?",
            antwoorden: ["Eén keer, voor altijd", "Elk jaar opnieuw", "Elke dag", "Elke sabbat"],
            correct: "Eén keer, voor altijd",
            bijbelplaats: "Hebreeën 9:28; 10:10"
        },
        {
            vraag: "Waarmee vergelijkt Hebreeën het woord van God, omdat het scherp is en diep in je hart kan kijken?",
            antwoorden: ["Een tweesnijdend zwaard", "Een spiegel", "Een fel brandende fakkel in het donker", "Een sleutel"],
            correct: "Een tweesnijdend zwaard",
            bijbelplaats: "Hebreeën 4:12"
        },
        {
            vraag: "Hebreeën noemt Jezus de middelaar van een … verbond tussen God en de mensen.",
            antwoorden: ["nieuw", "oud", "tijdelijk", "gebroken"],
            correct: "nieuw",
            bijbelplaats: "Hebreeën 9:15"
        },
        {
            vraag: "In Hebreeën 11 staan veel bekende mensen uit de Bijbel op een rij, die iets met elkaar gemeen hadden. Wat hadden zij gemeen?",
            antwoorden: ["Ze vertrouwden op God, ook zonder alles te zien", "Ze hadden nooit getwijfeld", "Ze kregen allemaal al op aarde wat beloofd was", "Ze waren allemaal belangrijke leiders"],
            correct: "Ze vertrouwden op God, ook zonder alles te zien",
            bijbelplaats: "Hebreeën 11:1"
        },
        {
            vraag: "Door het geloof trok het volk dwars door een zee, alsof het droog land was. Welke zee?",
            antwoorden: ["De Rode Zee", "De Dode Zee", "Het meer van Galilea", "De Middellandse Zee"],
            correct: "De Rode Zee",
            bijbelplaats: "Hebreeën 11:29"
        },
        {
            vraag: "Hebreeën spoort aan: laten we elkaar aanmoedigen tot liefde en goede daden, en onze … niet verzuimen.",
            antwoorden: ["samenkomsten", "maaltijden", "reizen", "wedstrijden"],
            correct: "samenkomsten",
            bijbelplaats: "Hebreeën 10:24-25"
        },
        {
            vraag: "Nadat Jezus zijn werk had volbracht, ging Hij zitten aan de … van God.",
            antwoorden: ["rechterhand", "linkerhand", "troon", "voeten"],
            correct: "rechterhand",
            bijbelplaats: "Hebreeën 10:12"
        },
        {
            vraag: "Mozes koos er volgens Hebreeën voor om slecht behandeld te worden samen met Gods volk, in plaats van te genieten van de … van Egypte.",
            antwoorden: ["schatten", "paleizen", "feesten", "macht"],
            correct: "schatten",
            bijbelplaats: "Hebreeën 11:25-26"
        },
        {
            vraag: "Wat laat de brief aan de Hebreeën vooral steeds zien over Jezus?",
            antwoorden: ["Dat Jezus groter is dan alles en iedereen", "Dat Jezus minder is dan de engelen", "Dat Jezus vooral een strenge rechter is", "Dat Jezus zijn werk nog moet beginnen"],
            correct: "Dat Jezus groter is dan alles en iedereen",
            bijbelplaats: "Hebreeën 1:4"
        },
        {
            vraag: "Hebreeën noemt Jezus degene die ons geloof begint én …",
            antwoorden: ["voltooit", "beproeft", "beschermt", "beloont"],
            correct: "voltooit",
            bijbelplaats: "Hebreeën 12:2"
        },
        {
            vraag: "Hebreeën zegt dat wij, terwijl we geloven, worden omringd door een grote … van getuigen — al die geloofshelden die ons zijn voorgegaan.",
            antwoorden: ["wolk", "zee", "leger", "rij"],
            correct: "wolk",
            bijbelplaats: "Hebreeën 12:1"
        },
        {
            vraag: "Hebreeën zegt: leef mee met wie het zwaar hebben, alsof je zelf in hun plaats zit. Aan wie moeten de gelovigen dan speciaal denken?",
            antwoorden: ["Aan mensen die gevangenzitten en slecht behandeld worden", "Aan de mensen die al veel geld aan de armen gaven", "Aan de leiders van de gemeente", "Aan mensen die ver weg op reis zijn"],
            correct: "Aan mensen die gevangenzitten en slecht behandeld worden",
            bijbelplaats: "Hebreeën 13:3"
        },
        {
            vraag: "Jezus werd mens en stierf, zodat de mensen niet hun leven lang bang hoeven te zijn. Waarvoor?",
            antwoorden: ["Voor de dood", "Voor de duivel", "Voor Gods straf", "Voor het lijden"],
            correct: "Voor de dood",
            bijbelplaats: "Hebreeën 2:14-15"
        },
        {
            vraag: "Hebreeën zegt dat we God geen dieren meer hoeven te offeren. Wat mogen we Hem in plaats daarvan brengen?",
            antwoorden: ["Een lofzang waarin we Hem danken", "Een groot geldbedrag voor de tempel", "Een streng vasten van veertig dagen", "Een lange pelgrimsreis"],
            correct: "Een lofzang waarin we Hem danken",
            bijbelplaats: "Hebreeën 13:15"
        }
    ],
    expert: [
        {
            vraag: "Hebreeën geeft een beroemde omschrijving van geloof. Waar gaat geloof volgens die omschrijving over?",
            antwoorden: ["Over zeker zijn van wat je hoopt en niet ziet", "Over zeker zijn van wat je met eigen ogen gezien hebt", "Over hopen dat het toevallig goed afloopt", "Over nooit meer vragen durven stellen"],
            correct: "Over zeker zijn van wat je hoopt en niet ziet",
            bijbelplaats: "Hebreeën 11:1"
        },
        {
            vraag: "Welke man vertrok door zijn geloof naar een land dat God hem zou wijzen, zonder te weten waar hij heen ging?",
            antwoorden: ["Abraham", "Jakob", "Jozef", "David"],
            correct: "Abraham",
            bijbelplaats: "Hebreeën 11:8"
        },
        {
            vraag: "Aan het begin laat de brief aan de Hebreeën zien dat Jezus hoger staat dan …",
            antwoorden: ["de engelen", "Mozes", "de profeten", "de hogepriesters"],
            correct: "de engelen",
            bijbelplaats: "Hebreeën 1:4"
        },
        {
            vraag: "De ouders van een baby verborgen hem drie maanden lang, omdat ze niet bang waren voor het bevel van de koning. Welke baby?",
            antwoorden: ["Mozes", "Samuël", "Isaak", "Johannes"],
            correct: "Mozes",
            bijbelplaats: "Hebreeën 11:23"
        },
        {
            vraag: "Hebreeën zegt dat het zonder iets onmogelijk is om God te behagen. Wat is dat?",
            antwoorden: ["geloof", "geld", "kracht", "wijsheid"],
            correct: "geloof",
            bijbelplaats: "Hebreeën 11:6"
        },
        {
            vraag: "Jezus wordt hogepriester genoemd 'naar de orde van' een geheimzinnige koning-priester uit de tijd van Abraham. Hoe heet hij?",
            antwoorden: ["Melchisedek", "Aäron", "Levi", "Henoch"],
            correct: "Melchisedek",
            bijbelplaats: "Hebreeën 7:1-3"
        },
        {
            vraag: "Over welke man zegt Hebreeën dat hij door zijn geloof de dood niet zag, maar door God werd weggenomen?",
            antwoorden: ["Henoch", "Noach", "Mozes", "Abel"],
            correct: "Henoch",
            bijbelplaats: "Hebreeën 11:5"
        },
        {
            vraag: "Welke vrouw in Jericho werd geprezen omdat ze door haar geloof de verkenners vriendelijk ontving?",
            antwoorden: ["Rachab", "Ruth", "Sara", "Mirjam"],
            correct: "Rachab",
            bijbelplaats: "Hebreeën 11:31"
        },
        {
            vraag: "Wat is bijzonder aan de brief aan de Hebreeën?",
            antwoorden: ["We weten niet zeker wie hem geschreven heeft", "Hij is het kortste bijbelboek", "Hij noemt Jezus nergens", "Het is de langste brief uit de Bijbel"],
            correct: "We weten niet zeker wie hem geschreven heeft",
            bijbelplaats: "algemeen"
        },
        {
            vraag: "Waarmee vergelijkt Hebreeën de hoop die wij hebben, omdat die ons stevig vasthoudt zodat we niet wegdrijven?",
            antwoorden: ["Een anker", "Een ketting", "Een muur", "Een berg"],
            correct: "Een anker",
            bijbelplaats: "Hebreeën 6:19"
        },
        {
            vraag: "Welke vrouw ontving door haar geloof de kracht om op hoge leeftijd nog een kind te krijgen?",
            antwoorden: ["Sara", "Rachab", "Ruth", "Mirjam"],
            correct: "Sara",
            bijbelplaats: "Hebreeën 11:11"
        },
        {
            vraag: "Aan welke groep gelovigen is de brief aan de Hebreeën vooral gericht?",
            antwoorden: ["Joodse christenen", "Romeinse soldaten", "Griekse filosofen", "Egyptische priesters"],
            correct: "Joodse christenen",
            bijbelplaats: "naam van het boek"
        },
        {
            vraag: "Hebreeën zegt dat goeddoen en delen met anderen voor God iets bijzonders zijn. Wat zijn ze volgens de brief?",
            antwoorden: ["Een offer waar Hij blij mee is", "Een gebed dat Hij altijd verhoort", "Een teken van zijn verbond", "Een plicht die je moet vervullen"],
            correct: "Een offer waar Hij blij mee is",
            bijbelplaats: "Hebreeën 13:16"
        },
        {
            vraag: "Welke sterke man, bekend om zijn lange haar, wordt in Hebreeën 11 genoemd als voorbeeld van geloof?",
            antwoorden: ["Simson", "Goliat", "Saul", "Esau"],
            correct: "Simson",
            bijbelplaats: "Hebreeën 11:32"
        },
        {
            vraag: "Volgens Hebreeën mogen we naar God toe gaan om hulp te krijgen wanneer we die nodig hebben. Hoe mogen we bij Hem komen?",
            antwoorden: ["Met vertrouwen, zonder angst", "Alleen als we nooit fouten maken", "Alleen één keer per jaar", "Alleen als je priester bent"],
            correct: "Met vertrouwen, zonder angst",
            bijbelplaats: "Hebreeën 4:16"
        },
        {
            vraag: "Hebreeën spoort aan: laten we stevig vasthouden aan onze …, want God houdt zich aan wat Hij beloofd heeft.",
            antwoorden: ["hoop", "spullen", "vrienden", "plannen"],
            correct: "hoop",
            bijbelplaats: "Hebreeën 10:23"
        }
    ]
};

// Jakobus — vragenpool (Algemene brieven).
// Formaat gelijk aan de andere boeken: vragenData["Jakobus"] met drie niveaus
// (beginner/advanced/expert). 11 beginner, 12 advanced, 11 expert = 34 vragen.
vragenData["Jakobus"] = {
    beginner: [
        {
            vraag: "Waar komt volgens Jakobus elke goede gave vandaan?",
            antwoorden: ["Van God, uit de hemel", "Van de koning", "Uit de zee", "Van jezelf"],
            correct: "Van God, uit de hemel",
            bijbelplaats: "Jakobus 1:17"
        },
        {
            vraag: "Jakobus vergelijkt de tong met iets heel kleins dat een groot schip van richting verandert. Wat is dat?",
            antwoorden: ["Het roer", "Het anker", "De mast", "Het zeil"],
            correct: "Het roer",
            bijbelplaats: "Jakobus 3:4"
        },
        {
            vraag: "Jakobus zegt: kom dicht bij God. Wat gebeurt er dan?",
            antwoorden: ["Dan komt God dicht bij jou", "Dan wacht God tot je alles goed doet", "Dan stuurt God een engel naar je toe", "Dan zul je God eindelijk kunnen zien"],
            correct: "Dan komt God dicht bij jou",
            bijbelplaats: "Jakobus 4:8"
        },
        {
            vraag: "Wat zegt Jakobus over hoe we over andere mensen moeten praten?",
            antwoorden: ["Spreek geen kwaad over elkaar", "Zeg altijd precies wat je van iemand vindt", "Wijs elkaar streng op elke fout", "Praat liever helemaal niet over anderen"],
            correct: "Spreek geen kwaad over elkaar",
            bijbelplaats: "Jakobus 4:11"
        },
        {
            vraag: "Wat moet je volgens Jakobus doen als je ziek bent?",
            antwoorden: ["De leiders van de gemeente vragen om voor je te bidden", "Het stil voor jezelf houden", "Alleen proberen ziek te zijn als je naar school moet", "Tegen niemand iets zeggen"],
            correct: "De leiders van de gemeente vragen om voor je te bidden",
            bijbelplaats: "Jakobus 5:14"
        },
        {
            vraag: "Jakobus zegt: laat je 'ja' gewoon 'ja' zijn en je 'nee' gewoon 'nee'. Wat bedoelt hij daarmee?",
            antwoorden: ["Wees eerlijk en betrouwbaar", "Praat zo veel mogelijk", "Beloof altijd van alles", "Zeg liever helemaal niets"],
            correct: "Wees eerlijk en betrouwbaar",
            bijbelplaats: "Jakobus 5:12"
        },
        {
            vraag: "Wat zegt Jakobus dat gelovigen voor elkaar moeten doen?",
            antwoorden: ["Voor elkaar bidden", "Elkaar negeren", "Elkaar bevelen geven", "Elkaar met rust laten"],
            correct: "Voor elkaar bidden",
            bijbelplaats: "Jakobus 5:16"
        },
        {
            vraag: "Jakobus zegt: wie weet wat goed is om te doen, maar het niet doet, …",
            antwoorden: ["doet verkeerd", "doet niets verkeerds", "is juist heel wijs", "mag het zelf weten"],
            correct: "doet verkeerd",
            bijbelplaats: "Jakobus 4:17"
        },
        {
            vraag: "Stel dat iemand bij God en het goede pad wegloopt. Wat moet je volgens Jakobus proberen te doen?",
            antwoorden: ["Hem vol liefde weer terugbrengen", "Hem voorgoed wegsturen", "Net doen of je niets ziet", "Elke keer als je hem ziet, flink in discussie gaan"],
            correct: "Hem vol liefde weer terugbrengen",
            bijbelplaats: "Jakobus 5:19-20"
        },
        {
            vraag: "Jakobus zegt: maak jezelf klein voor God. Wat zal God dan doen?",
            antwoorden: ["Hij zal je groot maken", "Hij zal je met rust laten", "Hij zal je nog kleiner maken", "Hij zal nu voortaan over je heen kijken"],
            correct: "Hij zal je groot maken",
            bijbelplaats: "Jakobus 4:10"
        },
        {
            vraag: "Jakobus zegt tegen de gelovigen: wees geduldig en verlies de moed niet, want iemand zal terugkomen. Op wiens komst moeten zij wachten?",
            antwoorden: ["De Heer", "De koning", "De profeet", "De leraar"],
            correct: "De Heer",
            bijbelplaats: "Jakobus 5:7-8"
        }
    ],
    advanced: [
        {
            vraag: "Jakobus zegt: geloof zonder … is dood. Wat hoort hier?",
            antwoorden: ["daden", "woorden", "geld", "vrienden"],
            correct: "daden",
            bijbelplaats: "Jakobus 2:17, 26"
        },
        {
            vraag: "Jakobus geeft een wijze raad: wees snel om te …, langzaam om te spreken en langzaam om boos te worden.",
            antwoorden: ["luisteren", "rennen", "eten", "slapen"],
            correct: "luisteren",
            bijbelplaats: "Jakobus 1:19"
        },
        {
            vraag: "Als je wijsheid nodig hebt, wat moet je dan volgens Jakobus doen?",
            antwoorden: ["God erom vragen, want Hij geeft het graag", "Wachten tot je ouder en ervarener bent", "Zorgen dat je eerst genoeg geleerd hebt", "Vertrouw alleen op je eigen verstand"],
            correct: "God erom vragen, want Hij geeft het graag",
            bijbelplaats: "Jakobus 1:5"
        },
        {
            vraag: "Jakobus waarschuwt: behandel een rijke bezoeker niet beter dan een arme. Welke fout maak je dan?",
            antwoorden: ["Je bent partijdig en trekt mensen voor", "Je bent te gastvrij", "Je vergeet om je gasten iets te drinken aan te bieden", "Je bent te vrijgevig"],
            correct: "Je bent partijdig en trekt mensen voor",
            bijbelplaats: "Jakobus 2:1-4"
        },
        {
            vraag: "Jakobus vergelijkt iemand die wel hoort maar niet doet met een man die in een … kijkt en meteen weer vergeet hoe hij eruitziet.",
            antwoorden: ["spiegel", "boek", "put", "raam"],
            correct: "spiegel",
            bijbelplaats: "Jakobus 1:23-24"
        },
        {
            vraag: "Jakobus zegt: onderwerp je aan God en … de duivel, dan zal hij van je wegvluchten.",
            antwoorden: ["weersta", "volg", "zoek", "roep"],
            correct: "weersta",
            bijbelplaats: "Jakobus 4:7"
        },
        {
            vraag: "Welke man uit het Oude Testament noemt Jakobus als voorbeeld van iemand die in groot lijden geduldig bleef?",
            antwoorden: ["Job", "Mozes", "David", "Jona"],
            correct: "Job",
            bijbelplaats: "Jakobus 5:11"
        },
        {
            vraag: "Waarmee vergelijkt Jakobus het geduld waarmee wij op de Heer moeten wachten?",
            antwoorden: ["Met een boer die wacht op zijn oogst", "Met een soldaat die wacht op bevel", "Met een dienaar die wacht op zijn loon", "Met een reiziger die wacht op mooi weer"],
            correct: "Met een boer die wacht op zijn oogst",
            bijbelplaats: "Jakobus 5:7"
        },
        {
            vraag: "Jakobus zegt: wie God iets vraagt maar blijft twijfelen, lijkt op …",
            antwoorden: ["een golf van de zee die heen en weer wordt geslingerd", "een sterke rots in de branding", "een anker dat het schip stevig op zijn plek houdt", "een rustige, stille vijver"],
            correct: "een golf van de zee die heen en weer wordt geslingerd",
            bijbelplaats: "Jakobus 1:6"
        },
        {
            vraag: "Aan wat voor mensen geeft God volgens Jakobus zijn genade?",
            antwoorden: ["Aan mensen die nederig zijn", "Aan mensen die trots zijn", "Aan mensen die sterk zijn", "Aan mensen die veel weten"],
            correct: "Aan mensen die nederig zijn",
            bijbelplaats: "Jakobus 4:6"
        },
        {
            vraag: "Jakobus beschrijft in zijn brief de wijsheid die van God komt. Welke eigenschap van die wijsheid benadrukt hij vooral?",
            antwoorden: ["Ze is vredelievend en vriendelijk", "Ze is vooral heel verstandig", "Ze is streng en duidelijk", "Ze is alleen voor geleerde mensen"],
            correct: "Ze is vredelievend en vriendelijk",
            bijbelplaats: "Jakobus 3:17"
        },
        {
            vraag: "Jakobus vraagt: ben je wijs? Waaraan moet dat volgens hem te zien zijn?",
            antwoorden: ["Aan hoe je leeft: goede daden, vriendelijk en zonder hoogmoed", "Aan dat je in elk gesprek je gelijk haalt", "Aan dat je anderen op hun fouten wijst", "Aan hoeveel mensen jouw wijze raad komen vragen"],
            correct: "Aan hoe je leeft: goede daden, vriendelijk en zonder hoogmoed",
            bijbelplaats: "Jakobus 3:13"
        }
    ],
    expert: [
        {
            vraag: "Welk klein lichaamsdeel kan volgens Jakobus veel goeds én veel kwaads doen, net zoals een klein vuurtje een hele bos in brand kan zetten?",
            antwoorden: ["de tong", "het oog", "de hand", "de voet"],
            correct: "de tong",
            bijbelplaats: "Jakobus 3:5-6"
        },
        {
            vraag: "Jakobus vergelijkt de tong met het roer van een schip. Wat wil hij daarmee zeggen?",
            antwoorden: ["Iets kleins kan iets heel groots sturen", "Praten is gevaarlijk werk", "Alleen een stuurman mag spreken", "Woorden waaien snel weg"],
            correct: "Iets kleins kan iets heel groots sturen",
            bijbelplaats: "Jakobus 3:4"
        },
        {
            vraag: "Jakobus zegt: wees niet te zeker over morgen, want je weet niet wat er gebeurt. Waarmee vergelijkt hij ons leven?",
            antwoorden: ["Met damp die even verschijnt en weer verdwijnt", "Met een sterke berg", "Met een diepe zee", "Met een ster die eeuwig aan de hemel blijft staan"],
            correct: "Met damp die even verschijnt en weer verdwijnt",
            bijbelplaats: "Jakobus 4:14"
        },
        {
            vraag: "Volgens de overlevering was Jakobus, de schrijver, een belangrijke leider van de eerste christenen. In welke stad leidde hij de gemeente?",
            antwoorden: ["Jeruzalem", "Rome", "Antiochië", "Korinte"],
            correct: "Jeruzalem",
            bijbelplaats: "overlevering"
        },
        {
            vraag: "'Heb je naaste lief als jezelf' noemt Jakobus de … wet — de allerbelangrijkste regel.",
            antwoorden: ["koninklijke", "oude", "nieuwe", "gouden"],
            correct: "koninklijke",
            bijbelplaats: "Jakobus 2:8"
        },
        {
            vraag: "Jakobus zegt dat het gebed van een gelovige veel kan doen. Welke profeet bad, en daarna regende het drieëneenhalf jaar niet?",
            antwoorden: ["Elia", "Elisa", "Jesaja", "Jeremia"],
            correct: "Elia",
            bijbelplaats: "Jakobus 5:17"
        },
        {
            vraag: "Wat ontvangt volgens Jakobus de mens die moeilijke tijden geduldig doorstaat en van God blijft houden?",
            antwoorden: ["De kroon van het leven", "Roem bij alle mensen", "Een makkelijk leven", "Een lang leven op aarde"],
            correct: "De kroon van het leven",
            bijbelplaats: "Jakobus 1:12"
        },
        {
            vraag: "Welke man uit het Oude Testament wordt door Jakobus 'een vriend van God' genoemd, omdat zijn geloof bleek uit wat hij deed?",
            antwoorden: ["Abraham", "Noach", "Mozes", "Henoch"],
            correct: "Abraham",
            bijbelplaats: "Jakobus 2:23"
        },
        {
            vraag: "Jakobus zegt: wie denkt dat hij godsdienstig is, maar zijn tong niet in bedwang houdt — wat is er dan met zijn godsdienst?",
            antwoorden: ["Die is waardeloos", "Die is nog niet volmaakt", "Die telt alleen voor hemzelf", "Die moet nog groeien"],
            correct: "Die is waardeloos",
            bijbelplaats: "Jakobus 1:26"
        },
        {
            vraag: "Jakobus zegt: je gelooft dat er één God is? Goed zo! Maar wie geloven dat ook, en beven van angst?",
            antwoorden: ["De demonen", "De engelen", "De profeten", "De koningen"],
            correct: "De demonen",
            bijbelplaats: "Jakobus 2:19"
        },
        {
            vraag: "Jakobus waarschuwt: mopper niet op elkaar. Wie staat er volgens hem al voor de deur?",
            antwoorden: ["De Rechter", "De koning", "De leraar", "De herder"],
            correct: "De Rechter",
            bijbelplaats: "Jakobus 5:9"
        }
    ]
};

// Petrus & Judas — vragenpool (Algemene brieven).
// Bundel uit 1 & 2 Petrus en Judas — gedeeld thema: waarschuwing tegen
// dwaalleraars. Formaat gelijk aan de andere boeken: vragenData["Petrus & Judas"]
// met drie niveaus. 10 beginner, 17 advanced, 12 expert = 39 vragen.
vragenData["Petrus & Judas"] = {
    beginner: [
        {
            vraag: "Petrus schrijft: geef al je zorgen aan God. Welke reden geeft hij daarvoor?",
            antwoorden: ["Omdat Hij voor jou zorgt", "Omdat Hij alles kan", "Omdat Hij alles al weet", "Omdat Hij je fouten vergeeft"],
            correct: "Omdat Hij voor jou zorgt",
            bijbelplaats: "1 Petrus 5:7"
        },
        {
            vraag: "Judas eindigt zijn brief met de aanmoediging: blijf in de … van God.",
            antwoorden: ["liefde", "stad", "woestijn", "tempel"],
            correct: "liefde",
            bijbelplaats: "Judas 21"
        },
        {
            vraag: "Petrus noemt de gelovigen samen een huis van levende stenen. Wie is de belangrijkste steen, de hoeksteen?",
            antwoorden: ["Jezus", "Petrus", "Mozes", "Abraham"],
            correct: "Jezus",
            bijbelplaats: "1 Petrus 2:4-6"
        },
        {
            vraag: "Petrus schrijft: wees gastvrij voor elkaar, en doe dat …",
            antwoorden: ["zonder te mopperen", "zonder er te veel tijd aan te besteden", "alleen als je zelf genoeg hebt", "vooral voor wie het verdient"],
            correct: "zonder te mopperen",
            bijbelplaats: "1 Petrus 4:9"
        },
        {
            vraag: "Petrus schrijft: trek tegenover elkaar … aan, als een kleed.",
            antwoorden: ["nederigheid", "dure kleren", "een harnas", "een masker"],
            correct: "nederigheid",
            bijbelplaats: "1 Petrus 5:5"
        },
        {
            vraag: "Met welk beeld zegt Petrus hoe gelovigen met elkaar moeten omgaan?",
            antwoorden: ["Als broers en zussen", "Als goede buren", "Als bondgenoten", "Als reisgenoten"],
            correct: "Als broers en zussen",
            bijbelplaats: "1 Petrus 3:8"
        },
        {
            vraag: "Petrus schrijft over de Bijbel: de profeten spraken niet zomaar hun eigen woorden, maar werden geleid door …",
            antwoorden: ["de heilige Geest", "de koning", "hun eigen dromen", "de sterren"],
            correct: "de heilige Geest",
            bijbelplaats: "2 Petrus 1:21"
        },
        {
            vraag: "Judas vergelijkt dwaalleraars, die veel beloven maar niets geven, met wolken die geen … brengen.",
            antwoorden: ["regen", "wind", "licht", "kou"],
            correct: "regen",
            bijbelplaats: "Judas 12"
        },
        {
            vraag: "Petrus schrijft dat Jezus onze fouten (zonden) heeft gedragen. Waar deed hij dat volgens Petrus?",
            antwoorden: ["Aan het kruis", "In de tempel", "Op een berg", "In de woestijn"],
            correct: "Aan het kruis",
            bijbelplaats: "1 Petrus 2:24"
        },
        {
            vraag: "In zijn tweede brief noemt Petrus een man die met zijn gezin door de ark gered werd toen de grote watervloed kwam. Over welke man gaat het?",
            antwoorden: ["Noach", "Mozes", "Abraham", "David"],
            correct: "Noach",
            bijbelplaats: "2 Petrus 2:5"
        }
    ],
    advanced: [
        {
            vraag: "Waarmee vergelijkt Petrus de duivel, die rondsluipt en zoekt wie hij kan pakken?",
            antwoorden: ["Een brullende leeuw", "Een sluwe vos", "Een gladde slang", "Een zwarte raaf"],
            correct: "Een brullende leeuw",
            bijbelplaats: "1 Petrus 5:8"
        },
        {
            vraag: "In de tweede brief van Petrus staat een verhaal over een profeet die verkeerd bezig was. Wat deed zijn ezel om hem te waarschuwen?",
            antwoorden: ["De ezel begon te praten", "De ezel vloog weg", "De ezel werd onzichtbaar", "De ezel veranderde in goud"],
            correct: "De ezel begon te praten",
            bijbelplaats: "2 Petrus 2:16"
        },
        {
            vraag: "Waar kijken de gelovigen volgens Petrus naar uit, waar alles goed en eerlijk zal zijn?",
            antwoorden: ["Een nieuwe hemel en een nieuwe aarde", "Een sterke stad met hoge muren", "Een groot, vruchtbaar land", "Een rustig eiland in zee"],
            correct: "Een nieuwe hemel en een nieuwe aarde",
            bijbelplaats: "2 Petrus 3:13"
        },
        {
            vraag: "Sommige mensen spotten: waarom is de Heer nog niet teruggekomen? Welke uitleg geeft Petrus?",
            antwoorden: ["Hij wil dat niemand verloren gaat", "Hij is het vergeten", "Hij komt wel, maar gewoon wat later", "Hij wil de dwaalleraars eerst ontmaskeren"],
            correct: "Hij wil dat niemand verloren gaat",
            bijbelplaats: "2 Petrus 3:9"
        },
        {
            vraag: "Petrus schrijft: heb elkaar vurig lief, want de liefde bedekt …",
            antwoorden: ["veel zonden", "helemaal niets", "alleen kleine foutjes", "alleen je eigen fouten"],
            correct: "veel zonden",
            bijbelplaats: "1 Petrus 4:8"
        },
        {
            vraag: "Petrus zegt: wees altijd bereid je te verantwoorden. Waarover?",
            antwoorden: ["Over de hoop die in je leeft", "Over de fouten die je hebt gemaakt", "Over de regels die je volgt", "Over de kerk waar je bij hoort"],
            correct: "Over de hoop die in je leeft",
            bijbelplaats: "1 Petrus 3:15"
        },
        {
            vraag: "Petrus herhaalt een opdracht van God uit het Oude Testament: 'Wees …, want Ik ben …'",
            antwoorden: ["heilig", "sterk", "wijs", "streng"],
            correct: "heilig",
            bijbelplaats: "1 Petrus 1:16"
        },
        {
            vraag: "Petrus zegt dat de dag van de Heer zal komen als een …",
            antwoorden: ["dief in de nacht", "aangekondigde feestdag", "storm die je ziet aankomen", "koning met groot vertoon"],
            correct: "dief in de nacht",
            bijbelplaats: "2 Petrus 3:10"
        },
        {
            vraag: "Judas vertelt over een aartsengel die met de duivel streed over het lichaam van Mozes. Hoe heet die aartsengel?",
            antwoorden: ["Michaël", "Gabriël", "Rafaël", "Uriël"],
            correct: "Michaël",
            bijbelplaats: "Judas 9"
        },
        {
            vraag: "Petrus zegt dat Christus ons een voorbeeld heeft nagelaten. Met welk beeld zegt hij hoe wij Hem moeten volgen?",
            antwoorden: ["Door in zijn voetstappen te treden", "Door zijn juk te dragen", "Door zijn kruis op te nemen", "Door in zijn licht te wandelen"],
            correct: "Door in zijn voetstappen te treden",
            bijbelplaats: "1 Petrus 2:21"
        },
        {
            vraag: "Petrus zegt: vergeld geen kwaad met kwaad, maar zegen juist. Wat belooft hij daarbij?",
            antwoorden: ["Dat je zelf zegen zult ontvangen", "Dat je vijand zal veranderen", "Dat God de ander zal straffen", "Dat je rust zult vinden"],
            correct: "Dat je zelf zegen zult ontvangen",
            bijbelplaats: "1 Petrus 3:9"
        },
        {
            vraag: "Petrus schrijft: jullie zijn niet vrijgekocht met goud of zilver, maar met het kostbare … van Christus, als van een lam zonder gebrek.",
            antwoorden: ["bloed", "goud", "water", "brood"],
            correct: "bloed",
            bijbelplaats: "1 Petrus 1:18-19"
        },
        {
            vraag: "In zijn tweede brief zegt Petrus: voeg bij je geloof steeds meer goede eigenschappen toe, en als kroon op alles …",
            antwoorden: ["de liefde", "veel kennis", "grote roem", "een lang leven"],
            correct: "de liefde",
            bijbelplaats: "2 Petrus 1:5-7"
        },
        {
            vraag: "Judas noemt een slecht voorbeeld uit het Oude Testament: een man die zijn eigen broer doodde uit jaloezie. Wie was die man?",
            antwoorden: ["Kaïn", "Esau", "Saul", "Achab"],
            correct: "Kaïn",
            bijbelplaats: "Judas 11"
        },
        {
            vraag: "Petrus zegt: verlang naar het zuivere woord van God, net zoals een pasgeboren baby verlangt naar …?",
            antwoorden: ["melk", "speelgoed", "slaap", "muziek"],
            correct: "melk",
            bijbelplaats: "1 Petrus 2:2"
        },
        {
            vraag: "Judas vergelijkt mensen die mooie praatjes hebben maar niets goeds doen met bomen. Wat hebben die bomen volgens hem niet?",
            antwoorden: ["Vruchten", "Bladeren", "Wortels", "Schaduw"],
            correct: "Vruchten",
            bijbelplaats: "Judas 12"
        },
        {
            vraag: "Petrus vergelijkt de gelovigen samen met een gebouw van God. Waarmee vergelijkt hij elke gelovige apart?",
            antwoorden: ["Met levende stenen", "Met sterke pilaren", "Met houten balken", "Met hoge muren"],
            correct: "Met levende stenen",
            bijbelplaats: "1 Petrus 2:5"
        }
    ],
    expert: [
        {
            vraag: "Judas roept de gelovigen op om iets te doen voor het geloof dat eens en voorgoed aan hen is toevertrouwd. Waartoe roept hij hen op?",
            antwoorden: ["Ervoor strijden", "Het zorgvuldig bewaren", "Het aan anderen doorgeven", "Het steeds beter leren kennen"],
            correct: "Ervoor strijden",
            bijbelplaats: "Judas 3"
        },
        {
            vraag: "Judas eindigt door God te prijzen, die machtig is om jou … te houden zodat je niet valt.",
            antwoorden: ["staande", "stil", "klein", "verborgen"],
            correct: "staande",
            bijbelplaats: "Judas 24"
        },
        {
            vraag: "Welke titel geeft Petrus aan Jezus, die over alle gelovigen waakt?",
            antwoorden: ["De opperherder", "De goede herder", "De grote herder", "De trouwe herder"],
            correct: "De opperherder",
            bijbelplaats: "1 Petrus 5:4"
        },
        {
            vraag: "Hoe noemt Petrus alle gelovigen samen?",
            antwoorden: ["Een uitgekozen volk, een koninklijk priesterschap", "Een grote verzameling gewone mensen uit alle landen", "Een leger soldaten", "Een klas vol leerlingen"],
            correct: "Een uitgekozen volk, een koninklijk priesterschap",
            bijbelplaats: "1 Petrus 2:9"
        },
        {
            vraag: "Petrus schrijft: bij de Heer is één dag als …",
            antwoorden: ["duizend jaar", "één uur", "één minuut", "één week"],
            correct: "duizend jaar",
            bijbelplaats: "2 Petrus 3:8"
        },
        {
            vraag: "Petrus schrijft dat hij met eigen ogen de glorie van Jezus zag, op een hoge berg. Wat hoorde hij daar?",
            antwoorden: ["De stem van God uit de hemel", "Een engelenkoor", "Donder en bliksem", "Het geluid van machtige bazuinen"],
            correct: "De stem van God uit de hemel",
            bijbelplaats: "2 Petrus 1:17-18"
        },
        {
            vraag: "Petrus schrijft dat gelovigen opnieuw geboren zijn, en daardoor een levende … hebben.",
            antwoorden: ["hoop", "zorg", "angst", "vraag"],
            correct: "hoop",
            bijbelplaats: "1 Petrus 1:3"
        },
        {
            vraag: "In zijn tweede brief waarschuwt Petrus dat er in de laatste dagen spotters zullen komen. Wat roepen ze?",
            antwoorden: ["\"Waar blijft de belofte van zijn komst? Alles blijft zoals het altijd was.\"", "\"Wij hebben Hem toch nooit gezien?\"", "\"God bemoeit zich niet met de mensen.\"", "\"Al die oude verhalen over wonderen en tekenen zijn gewoon verzonnen sprookjes.\""],
            correct: "\"Waar blijft de belofte van zijn komst? Alles blijft zoals het altijd was.\"",
            bijbelplaats: "2 Petrus 3:3-4"
        },
        {
            vraag: "Petrus schrijft iets verrassends: zelfs de … verlangen ernaar om de geheimen van Gods redding beter te begrijpen.",
            antwoorden: ["engelen", "koningen", "profeten", "sterren"],
            correct: "engelen",
            bijbelplaats: "1 Petrus 1:12"
        },
        {
            vraag: "Petrus verwijst naar de ark van Noach. Hoeveel mensen werden er volgens hem gered?",
            antwoorden: ["Acht", "Twaalf", "Zeven", "Vier"],
            correct: "Acht",
            bijbelplaats: "1 Petrus 3:20"
        },
        {
            vraag: "Judas haalt een profetie aan van een man uit de oertijd, de zevende vanaf Adam. Wie was die man?",
            antwoorden: ["Henoch", "Noach", "Metusalem", "Set"],
            correct: "Henoch",
            bijbelplaats: "Judas 14"
        },
        {
            vraag: "Petrus richt zijn eerste brief aan gelovigen die verspreid wonen. Hoe noemt hij hen?",
            antwoorden: ["Vreemdelingen in de verstrooiing", "Kinderen van de belofte", "Broeders in de Heer", "Erfgenamen van het koninkrijk"],
            correct: "Vreemdelingen in de verstrooiing",
            bijbelplaats: "1 Petrus 1:1"
        }
    ]
};

// Brieven van Johannes — vragenpool (Algemene brieven).
// Bundel uit 1, 2 & 3 Johannes. Bewust "Brieven van Johannes" (niet "Johannes"),
// om verwarring met het evangelie te voorkomen. Formaat gelijk aan de andere
// boeken: vragenData["Brieven van Johannes"] met drie niveaus.
// 13 beginner, 12 advanced, 13 expert = 38 vragen.
vragenData["Brieven van Johannes"] = {
    beginner: [
        {
            vraag: "Welke beroemde zin over God staat in de eerste brief van Johannes? God is …",
            antwoorden: ["liefde", "ver weg", "streng", "onzichtbaar"],
            correct: "liefde",
            bijbelplaats: "1 Johannes 4:8"
        },
        {
            vraag: "Welke opdracht schrijft Johannes vaak?",
            antwoorden: ["Heb elkaar lief", "Wees waakzaam", "Wees dankbaar", "Blijf bidden"],
            correct: "Heb elkaar lief",
            bijbelplaats: "1 Johannes 3:11"
        },
        {
            vraag: "Johannes zegt: als we onze fouten (zonden) eerlijk aan God vertellen, wat doet God dan volgens hem?",
            antwoorden: ["Hij vergeeft ze en maakt ons weer schoon", "Hij vergeeft ze als we het niet meer doen", "Hij vergeeft ze na verloop van tijd", "Hij vergeeft alleen onze kleine zonden"],
            correct: "Hij vergeeft ze en maakt ons weer schoon",
            bijbelplaats: "1 Johannes 1:9"
        },
        {
            vraag: "God is …, en in Hem is helemaal geen duisternis, schrijft Johannes.",
            antwoorden: ["licht", "ver", "oud", "stil"],
            correct: "licht",
            bijbelplaats: "1 Johannes 1:5"
        },
        {
            vraag: "Johannes zegt: laten we niet liefhebben met alleen mooie woorden, maar met …",
            antwoorden: ["daden en in waarheid", "dure cadeaus", "een luide stem", "veel beloften"],
            correct: "daden en in waarheid",
            bijbelplaats: "1 Johannes 3:18"
        },
        {
            vraag: "Johannes zegt: wie beweert dat hij van God houdt, maar zijn broeder of zuster haat — wat is zo iemand volgens hem?",
            antwoorden: ["Een leugenaar", "Een dwaas", "Een zwakke gelovige", "Iemand die het nog moet leren"],
            correct: "Een leugenaar",
            bijbelplaats: "1 Johannes 4:20"
        },
        {
            vraag: "Wat verdrijft volgens Johannes de angst helemaal?",
            antwoorden: ["De volmaakte liefde", "Een sterk geloof", "Veel kennis van God", "Het houden van de geboden"],
            correct: "De volmaakte liefde",
            bijbelplaats: "1 Johannes 4:18"
        },
        {
            vraag: "Johannes schrijft: wie de Zoon (Jezus) heeft, heeft het …; wie de Zoon niet heeft, heeft het niet.",
            antwoorden: ["leven", "een huis", "een boek", "een kroon"],
            correct: "leven",
            bijbelplaats: "1 Johannes 5:12"
        },
        {
            vraag: "Wat zegt Johannes dat zijn allergrootste blijdschap is?",
            antwoorden: ["Horen dat zijn 'kinderen' in de waarheid leven", "Horen dat de gemeente groeit", "Zelf bij hen op bezoek kunnen komen", "Horen dat zijn brieven overal gelezen worden"],
            correct: "Horen dat zijn 'kinderen' in de waarheid leven",
            bijbelplaats: "3 Johannes 4"
        },
        {
            vraag: "Johannes noemt de gelovigen aan wie hij schrijft vaak liefdevol …",
            antwoorden: ["'mijn kinderen'", "'mijn soldaten'", "'mijn dienaren'", "'mijn leerlingen'"],
            correct: "'mijn kinderen'",
            bijbelplaats: "1 Johannes 2:1"
        },
        {
            vraag: "Johannes vergelijkt leven mét God met wandelen in het licht, en leven zonder God met wandelen in het …",
            antwoorden: ["donker", "moeras", "vuur", "modder"],
            correct: "donker",
            bijbelplaats: "1 Johannes 1:6-7"
        },
        {
            vraag: "Hoe liet God volgens Johannes zijn grote liefde aan ons zien?",
            antwoorden: ["Hij stuurde zijn enige Zoon naar de wereld", "Hij bouwde een prachtige tempel", "Hij liet een groot teken zien aan de hemel", "Hij gaf de mensen een koning"],
            correct: "Hij stuurde zijn enige Zoon naar de wereld",
            bijbelplaats: "1 Johannes 4:9"
        },
        {
            vraag: "Johannes heeft nog veel te vertellen, maar hij wil het niet allemaal met pen en inkt opschrijven. Wat wil hij liever doen?",
            antwoorden: ["Hen zelf bezoeken en van mond tot mond spreken", "Iemand anders het laten opschrijven", "Wachten tot ze zelf naar hem toe komen", "Het geheimhouden voor de anderen"],
            correct: "Hen zelf bezoeken en van mond tot mond spreken",
            bijbelplaats: "2 Johannes 12; 3 Johannes 13"
        }
    ],
    advanced: [
        {
            vraag: "Waarom kunnen wij volgens Johannes liefhebben? Omdat God …",
            antwoorden: ["ons eerst heeft liefgehad", "ons dat opdraagt", "ons daarvoor beloont", "ons pas liefheeft als wij beginnen"],
            correct: "ons eerst heeft liefgehad",
            bijbelplaats: "1 Johannes 4:19"
        },
        {
            vraag: "Hoe mogen wij volgens Johannes genoemd worden, omdat God zo veel van ons houdt?",
            antwoorden: ["kinderen van God", "dienaren van de koning", "vrienden van de wereld", "helden van het volk"],
            correct: "kinderen van God",
            bijbelplaats: "1 Johannes 3:1"
        },
        {
            vraag: "Johannes geeft een test om te weten of iemand de waarheid spreekt: erkent diegene dat Jezus echt … is geworden, een mens van vlees en bloed?",
            antwoorden: ["mens", "koning", "engel", "profeet"],
            correct: "mens",
            bijbelplaats: "1 Johannes 4:2"
        },
        {
            vraag: "Waarom heeft Johannes zijn brief geschreven, zegt hij zelf? Zodat de gelovigen zeker weten dat ze het … hebben.",
            antwoorden: ["eeuwige leven", "laatste woord", "mooiste huis", "grootste gelijk"],
            correct: "eeuwige leven",
            bijbelplaats: "1 Johannes 5:13"
        },
        {
            vraag: "Johannes waarschuwt voor de antichrist, iemand die tégen Christus ingaat en de mensen wil misleiden. Hij noemt één ding waaraan je zo iemand kunt herkennen. Waaraan herken je hem volgens Johannes?",
            antwoorden: ["Hij ontkent dat Jezus de Christus is", "Hij komt pas helemaal aan het einde van de tijd", "Hij is erg machtig", "Hij noemt zichzelf koning over de hele wereld"],
            correct: "Hij ontkent dat Jezus de Christus is",
            bijbelplaats: "1 Johannes 2:18"
        },
        {
            vraag: "Johannes sluit zijn eerste brief af met een korte, krachtige waarschuwing. Waarvoor moeten de gelovigen oppassen?",
            antwoorden: ["Voor afgoden (nepgoden die mensen aanbidden)", "Voor wilde dieren", "Voor lange reizen", "Voor de soldaten van de Romeinse keizer"],
            correct: "Voor afgoden (nepgoden die mensen aanbidden)",
            bijbelplaats: "1 Johannes 5:21"
        },
        {
            vraag: "Johannes schrijft dat iemand die zegt in het licht te leven, maar zijn broeder of zuster haat, in werkelijkheid nog steeds in het … is.",
            antwoorden: ["donker", "licht", "midden", "begin"],
            correct: "donker",
            bijbelplaats: "1 Johannes 2:9"
        },
        {
            vraag: "Johannes zegt: de wereld gaat voorbij, met alles wat de mensen zo graag willen. Wat bedoelt hij daarmee?",
            antwoorden: ["Dat alles wat de wereld te bieden heeft tijdelijk is", "Dat de mensen op aarde nooit echt gelukkig kunnen zijn", "Dat gelovigen niets mogen bezitten", "Dat de wereld binnenkort door vuur vergaat"],
            correct: "Dat alles wat de wereld te bieden heeft tijdelijk is",
            bijbelplaats: "1 Johannes 2:17"
        },
        {
            vraag: "Hoe weten we volgens Johannes zeker dat God in ons blijft en wij in Hem? Omdat Hij ons zijn … heeft gegeven.",
            antwoorden: ["Geest", "boek", "huis", "naam"],
            correct: "Geest",
            bijbelplaats: "1 Johannes 4:13"
        },
        {
            vraag: "Johannes noemt drie dingen die 'uit de wereld' zijn en niet van de Vader komen. Welke drie dingen noemt hij?",
            antwoorden: ["De begeerte van de ogen, de begeerte van het lichaam en de hoogmoed", "De grote liefde voor geld, de jacht op macht en het verlangen naar roem", "Luiheid, jaloezie en boosheid", "Geld, geweld en leugen"],
            correct: "De begeerte van de ogen, de begeerte van het lichaam en de hoogmoed",
            bijbelplaats: "1 Johannes 2:16"
        },
        {
            vraag: "Waaraan hebben wij volgens Johannes geleerd wat liefde is?",
            antwoorden: ["Doordat Jezus zijn leven voor ons gaf", "Doordat God de wereld heeft geschapen", "Doordat God ons zijn geboden gaf", "Doordat God ons geduldig verdraagt"],
            correct: "Doordat Jezus zijn leven voor ons gaf",
            bijbelplaats: "1 Johannes 3:16"
        },
        {
            vraag: "Johannes schrijft over een hart dat je aanklaagt, dat je een schuldig gevoel geeft. Wat zegt hij daarover?",
            antwoorden: ["God is groter dan ons hart, en Hij weet alles", "Je moet je hart altijd geloven", "Een schuldig gevoel komt van een slechte geest", "Dan heb je vast iets verkeerds gedaan"],
            correct: "God is groter dan ons hart, en Hij weet alles",
            bijbelplaats: "1 Johannes 3:20"
        }
    ],
    expert: [
        {
            vraag: "Johannes begint zijn eerste brief niet met zijn naam, maar met een verrassende bewering. Hij wil duidelijk maken dat hij zijn verhaal niet van horen zeggen heeft. Wat zegt hij over het Woord van het leven?",
            antwoorden: ["Hij heeft hem zelf gehoord, gezien en zelfs aangeraakt", "Hij heeft het in een visioen van een engel te horen gekregen", "Hij heeft het van Petrus gehoord", "Hij heeft het bij de profeten gelezen"],
            correct: "Hij heeft hem zelf gehoord, gezien en zelfs aangeraakt",
            bijbelplaats: "1 Johannes 1:1"
        },
        {
            vraag: "Wat maakt ons volgens Johannes helemaal schoon van elke zonde?",
            antwoorden: ["Het bloed van Jezus", "Onze eigen goede daden", "Een verre reis maken om daar je zonden achter te laten", "Het houden van de geboden"],
            correct: "Het bloed van Jezus",
            bijbelplaats: "1 Johannes 1:7"
        },
        {
            vraag: "Johannes zegt: als we beweren dat we geen zonde hebben — wat is er dan aan de hand?",
            antwoorden: ["Dan bedriegen we onszelf en is de waarheid niet in ons", "Dan zijn we goed op weg", "Dan hebben we er zelf nog niet goed over nagedacht", "Dan moeten we onze broer of zus vragen om ons te helpen onze zonden te zien"],
            correct: "Dan bedriegen we onszelf en is de waarheid niet in ons",
            bijbelplaats: "1 Johannes 1:8"
        },
        {
            vraag: "Johannes noemt Jezus onze … bij de Vader: iemand die voor ons opkomt wanneer we toch verkeerd doen.",
            antwoorden: ["voorspraak (helper)", "rechter", "onze leraar en gids", "dienaar"],
            correct: "voorspraak (helper)",
            bijbelplaats: "1 Johannes 2:1"
        },
        {
            vraag: "Johannes geeft een eenvoudige toets voor iedereen die beweert dat hij in God blijft. Wat moet zo iemand dan doen?",
            antwoorden: ["Leven zoals Jezus geleefd heeft", "Elke dag naar de tempel gaan", "De boeken van Mozes uit het hoofd leren", "Al zijn bezit weggeven"],
            correct: "Leven zoals Jezus geleefd heeft",
            bijbelplaats: "1 Johannes 2:6"
        },
        {
            vraag: "Johannes richt zich in één passage achter elkaar tot drie verschillende groepen mensen in de gemeente, en hij zegt tegen elke groep iets anders. Welke drie groepen zijn dat?",
            antwoorden: ["Kinderen, jonge mannen en vaders", "Mannen, vrouwen en kinderen", "Armen, rijken en slaven", "Joden, Grieken en Romeinen"],
            correct: "Kinderen, jonge mannen en vaders",
            bijbelplaats: "1 Johannes 2:12-14"
        },
        {
            vraag: "Johannes waarschuwt de gelovigen: heb de … niet lief, met alle verkeerde dingen die daarbij horen.",
            antwoorden: ["wereld", "buren", "gemeente", "waarheid"],
            correct: "wereld",
            bijbelplaats: "1 Johannes 2:15"
        },
        {
            vraag: "Een groep mensen had de gemeente verlaten. Dat deed pijn, en Johannes trekt er een harde conclusie uit. Wat schrijft hij over hen?",
            antwoorden: ["Ze hoorden nooit echt bij ons, anders waren ze gebleven", "Ze waren gewoon boos over een ruzie en komen vast weer terug", "Ze zijn met geweld weggejaagd", "Ze zijn gewoon naar een andere stad verhuisd"],
            correct: "Ze hoorden nooit echt bij ons, anders waren ze gebleven",
            bijbelplaats: "1 Johannes 2:19"
        },
        {
            vraag: "Johannes belooft iets moois voor later: als Jezus verschijnt, zullen wij aan Hem … zijn.",
            antwoorden: ["gelijk", "vreemd", "voorbij", "kwijt"],
            correct: "gelijk",
            bijbelplaats: "1 Johannes 3:2"
        },
        {
            vraag: "In één korte zin zegt Johannes waarvoor de Zoon van God op aarde verschenen is. Wat was volgens hem het doel?",
            antwoorden: ["Om de werken van de duivel te verbreken", "Om een nieuw koninkrijk op aarde te stichten", "Om de wet van Mozes uit te leggen", "Om de tempel te herbouwen"],
            correct: "Om de werken van de duivel te verbreken",
            bijbelplaats: "1 Johannes 3:8"
        },
        {
            vraag: "Johannes zegt dat je zeker kunt wéten dat je van de dood in het leven bent overgegaan. Waaraan merk je dat volgens hem?",
            antwoorden: ["Aan het feit dat je je broeders en zusters liefhebt", "Dat je nooit meer bang bent", "Dat je wonderen kunt doen", "Aan het feit dat je alle regels van de wet uit je hoofd kent"],
            correct: "Aan het feit dat je je broeders en zusters liefhebt",
            bijbelplaats: "1 Johannes 3:14"
        },
        {
            vraag: "Johannes schrijft iets schokkends over iemand die zijn broeder of zuster haat. Hij zegt niet dat zo iemand een beetje fout zit — hij zet hem meteen naast de ergste misdadiger die er bestaat. Met welke misdaad stelt Johannes haat gelijk?",
            antwoorden: ["Met moord", "Met diefstal", "Met liegen", "Met afgoderij"],
            correct: "Met moord",
            bijbelplaats: "1 Johannes 3:15"
        },
        {
            vraag: "Johannes schetst een situatie: iemand heeft genoeg geld, ziet zijn broeder gebrek lijden, en sluit zijn hart voor hem. Wat concludeert Johannes daaruit?",
            antwoorden: ["Dan blijft de liefde van God niet in hem", "Dan is dat zijn eigen zaak", "Dan mag hij het later nog goedmaken", "Dan hoeft hij alleen voor hem te bidden"],
            correct: "Dan blijft de liefde van God niet in hem",
            bijbelplaats: "1 Johannes 3:17"
        },
        {
            vraag: "Johannes wil de gelovigen moed geven tegenover valse leraren. Hij wijst hen niet op hun eigen kracht of hun aantal, maar op iets anders. Wat schrijft hij?",
            antwoorden: ["Hij die in jullie is, is groter dan hij die in de wereld is", "Jullie zijn met meer mensen dan zij", "Jullie kennen de heilige boeken veel beter dan zij dat doen", "Jullie hebben betere argumenten dan zij"],
            correct: "Hij die in jullie is, is groter dan hij die in de wereld is",
            bijbelplaats: "1 Johannes 4:4"
        },
        {
            vraag: "Johannes schrijft nuchter dat niemand God ooit heeft gezien. En tóch, zegt hij, is er iets waardoor God tussen de mensen zichtbaar wordt. Wanneer gebeurt dat volgens hem?",
            antwoorden: ["Als wij elkaar liefhebben, blijft God in ons", "In de pracht van de natuur en de bergen om ons heen", "In de sterren aan de hemel", "In de dromen van de profeten"],
            correct: "Als wij elkaar liefhebben, blijft God in ons",
            bijbelplaats: "1 Johannes 4:12"
        },
        {
            vraag: "Johannes stelt iets geruststellends over de regels van God: zijn geboden zijn niet zwaar, geen last om te dragen. Waarom niet?",
            antwoorden: ["Omdat wie uit God geboren is de wereld overwint", "Omdat God er maar weinig heeft gegeven", "Omdat God ze aanpast aan wat je kunt", "Omdat je ze pas hoeft te houden als je volwassen bent"],
            correct: "Omdat wie uit God geboren is de wereld overwint",
            bijbelplaats: "1 Johannes 5:3"
        },
        {
            vraag: "Johannes moedigt de gelovigen aan om vrijmoedig tot God te bidden: je mag alles vragen. Maar hij voegt er één voorwaarde aan toe. Welke voorwaarde is dat?",
            antwoorden: ["Dat we vragen wat overeenkomt met zijn wil", "Dat we het luid genoeg vragen", "Dat we het drie keer vragen", "Dat we het samen met anderen vragen"],
            correct: "Dat we vragen wat overeenkomt met zijn wil",
            bijbelplaats: "1 Johannes 5:14"
        },
        {
            vraag: "De schrijver van de tweede en derde brief van Johannes noemt zichzelf niet bij naam, maar met een titel. Welke titel gebruikt hij?",
            antwoorden: ["'de oudste'", "'de koning'", "'de profeet'", "'de herder'"],
            correct: "'de oudste'",
            bijbelplaats: "2 Johannes 1; 3 Johannes 1"
        },
        {
            vraag: "In zijn tweede brief waarschuwt Johannes voor misleiders die de wereld zijn ingegaan. Wat beweren zij?",
            antwoorden: ["Dat Jezus niet echt als mens gekomen is", "Dat Jezus nooit heeft bestaan", "Dat Jezus alleen een profeet was", "Dat Jezus niet is opgestaan"],
            correct: "Dat Jezus niet echt als mens gekomen is",
            bijbelplaats: "2 Johannes 7"
        },
        {
            vraag: "Johannes geeft in zijn tweede brief een strenge raad over dwaalleraars die bij de gelovigen langskomen en niet bij de leer van Christus blijven. Welke raad?",
            antwoorden: ["Neem hen niet in huis en groet hen niet", "Ga met hen in gesprek over de waarheid", "Stuur hen door naar de oudsten", "Geef hun te eten en laat hen weer gaan"],
            correct: "Neem hen niet in huis en groet hen niet",
            bijbelplaats: "2 Johannes 10"
        },
        {
            vraag: "Johannes prijst Gajus, omdat die rondreizende gelovigen gastvrij ontving, ook al kende hij hen niet. Waarom is dat volgens Johannes zo belangrijk?",
            antwoorden: ["Zo word je zelf medewerker van de waarheid", "Zo word je rijk gezegend", "Zo krijg je aanzien in de gemeente", "Zo hoef je zelf niet ver weg te gaan om deze mensen te bezoeken"],
            correct: "Zo word je zelf medewerker van de waarheid",
            bijbelplaats: "3 Johannes 8"
        },
        {
            vraag: "In zijn derde brief schrijft Johannes over Diotrefes, een man in de gemeente die altijd de eerste wilde zijn. Wat deed hij met rondreizende gelovigen die langskwamen?",
            antwoorden: ["Hij weigerde hen te ontvangen, en wie dat wél deed zette hij de gemeente uit", "Hij liet hen eerst flink betalen voordat ze ook maar ergens mochten overnachten", "Hij stuurde hen door naar Johannes", "Hij nam hen op, maar liet hen niet spreken"],
            correct: "Hij weigerde hen te ontvangen, en wie dat wél deed zette hij de gemeente uit",
            bijbelplaats: "3 Johannes 9-10"
        },
        {
            vraag: "De derde brief eindigt met een vuistregel van maar een paar woorden. Wat schrijft Johannes?",
            antwoorden: ["Volg niet het kwade na, maar het goede", "Volg je eigen hart", "Volg de meerderheid", "Volg de oudste van de gemeente"],
            correct: "Volg niet het kwade na, maar het goede",
            bijbelplaats: "3 Johannes 11"
        }
    ]
};

// Openbaring — vragenpool (laatste boek van het NT, enkel-boek-tegel zoals
// Handelingen). Bewust gestuurd op de hoopvolle, wonderlijke kant; neutraal t.a.v.
// eindtijd-uitleg. 11 beginner, 12 advanced, 15 expert = 38 vragen.
vragenData["Openbaring"] = {
    beginner: [
        {
            vraag: "Aan het einde van zijn visioen ziet Johannes iets wat er nog nooit geweest is: de oude wereld verdwijnt, en er komt iets compleet nieuws voor in de plaats. Wat is dat wat hij ziet?",
            antwoorden: ["Een nieuwe hemel en een nieuwe aarde", "Een nieuwe zon en een nieuwe maan", "Een gouden berg boven de wolken", "Een groot schip op een wilde zee"],
            correct: "Een nieuwe hemel en een nieuwe aarde",
            bijbelplaats: "Openbaring 21:1"
        },
        {
            vraag: "In de nieuwe wereld troost God zijn mensen zoals een vader zijn kind troost. Johannes schrijft dat God iets van hun gezicht wegveegt, en dat het daarna nooit meer terugkomt. Wat veegt God weg?",
            antwoorden: ["De tranen", "Het stof", "Het zweet", "De modder"],
            correct: "De tranen",
            bijbelplaats: "Openbaring 21:4"
        },
        {
            vraag: "In een brief aan een gemeente zegt Jezus: ‘Ik sta voor de deur en Ik klop.’ Wat gebeurt er als iemand die deur voor Hem opendoet?",
            antwoorden: ["Jezus komt bij hem binnen", "Jezus groet even snel en is daarna weer weg", "Jezus blijft buiten staan", "Jezus is weer weg als de deur geopend wordt"],
            correct: "Jezus komt bij hem binnen",
            bijbelplaats: "Openbaring 3:20"
        },
        {
            vraag: "Steeds opnieuw ziet Johannes bij de troon een dier dat geslacht is en tóch leeft. Met dat dier wordt Jezus bedoeld, die zichzelf opofferde. Welk dier is het?",
            antwoorden: ["Een lam", "Een duif", "Een adelaar", "Een vis"],
            correct: "Een lam",
            bijbelplaats: "Openbaring 5:6"
        },
        {
            vraag: "God spreekt vanaf zijn troon, en het is een van de kortste en mooiste zinnen van het hele boek: ‘Zie, Ik maak alles …’ Hoe gaat die zin verder?",
            antwoorden: ["nieuw", "oud", "af", "groot"],
            correct: "nieuw",
            bijbelplaats: "Openbaring 21:5"
        },
        {
            vraag: "Openbaring is een bijzonder boek: het vertelt hoe het met de wereld aflopen zal. Welke plaats heeft het in de Bijbel?",
            antwoorden: ["Het is het allerlaatste boek van de hele Bijbel", "Het is het eerste boek van het Nieuwe Testament", "Het staat precies in het midden van de Bijbel", "Het staat vlak na de vier evangeliën"],
            correct: "Het is het allerlaatste boek van de hele Bijbel",
            bijbelplaats: "algemeen"
        },
        {
            vraag: "Johannes ziet een menigte die zo groot is dat niemand hen tellen kan. Ze staan voor de troon met palmtakken in hun handen. Waar komen al die mensen vandaan?",
            antwoorden: ["Uit alle volken, talen en landen", "Ze komen allemaal uit dezelfde stad", "Het zijn alleen mensen uit Israël", "Dat zijn de inwoners van Rome"],
            correct: "Uit alle volken, talen en landen",
            bijbelplaats: "Openbaring 7:9"
        },
        {
            vraag: "Bij de troon van God staan vier bijzondere wezens die dag en nacht hetzelfde lied zingen, steeds weer opnieuw. Welke woorden zingen zij?",
            antwoorden: ["‘Heilig, heilig, heilig’", "‘Sterk, sterk, sterk’", "‘Hoog, hoog, hoog’", "‘Ver, ver, ver’"],
            correct: "‘Heilig, heilig, heilig’",
            bijbelplaats: "Openbaring 4:8"
        },
        {
            vraag: "Die grote menigte voor de troon valt meteen op: ze dragen allemaal kleren van dezelfde kleur. Welke kleur is dat?",
            antwoorden: ["Wit", "Rood", "Blauw", "Goud"],
            correct: "Wit",
            bijbelplaats: "Openbaring 7:9"
        },
        {
            vraag: "Openbaring eindigt met een belofte van Jezus zelf, vlak voor het laatste gebed van het boek. Wat zegt Hij over zijn terugkomst?",
            antwoorden: ["‘Ik kom spoedig’", "‘Ik kom nog lang niet’", "‘Wacht maar duizend jaar’", "‘Ik kom pas als iedereen gelooft’"],
            correct: "‘Ik kom spoedig’",
            bijbelplaats: "Openbaring 22:20"
        },
        {
            vraag: "Johannes hoort een luide stem bij de troon die vertelt wat het allermooiste is van de nieuwe wereld — mooier nog dan de gouden straten: ‘Zie, Ik zal zelf … bij de mensen.’ Hoe gaat het verder?",
            antwoorden: ["wonen", "langskomen", "wegblijven", "af en toe komen logeren"],
            correct: "wonen",
            bijbelplaats: "Openbaring 21:3"
        }
    ],
    advanced: [
        {
            vraag: "Helemaal aan het begin van Openbaring stelt God zichzelf voor met twee Griekse letters: de alfa en de omega — de eerste en de laatste letter van het alfabet. Wat wil God daarmee zeggen?",
            antwoorden: ["Ik ben het begin en het einde", "Ik ben de oudste", "Ik ben de sterkste", "Ik ben de eerste die er ooit was"],
            correct: "Ik ben het begin en het einde",
            bijbelplaats: "Openbaring 1:8"
        },
        {
            vraag: "Jezus draagt Johannes op alles op te schrijven wat hij ziet, en het te sturen naar zeven plaatsen in Klein-Azië: Efeze, Smyrna, Pergamum en vier andere. Naar wie gaan die zeven brieven?",
            antwoorden: ["Naar zeven gemeenten", "Naar zeven koningen", "Naar zeven landen", "Naar zeven tempels"],
            correct: "Naar zeven gemeenten",
            bijbelplaats: "Openbaring 1:11"
        },
        {
            vraag: "Johannes ziet een boekrol die met zeven zegels is dichtgemaakt. Niemand in de hemel of op de aarde kan hem openen; mensen zijn er zelfs verdrietig over. Wie blijkt het uiteindelijk wél te mogen doen?",
            antwoorden: ["Het Lam (Jezus)", "De sterkste engel, aartsengel Michaël", "De oudste in de hemel", "Johannes zelf"],
            correct: "Het Lam (Jezus)",
            bijbelplaats: "Openbaring 5:1-5"
        },
        {
            vraag: "In zijn eerste visioen ziet Johannes Jezus staan tussen zeven gouden kandelaars. Hij begrijpt er niets van, en Jezus legt zelf uit wat die kandelaars betekenen. Waar staan de zeven kandelaars voor?",
            antwoorden: ["De zeven gemeenten die de brieven krijgen", "De zeven dagen van de schepping", "De zeven aartsengelen", "De zeven heuvels van Rome"],
            correct: "De zeven gemeenten die de brieven krijgen",
            bijbelplaats: "Openbaring 1:20"
        },
        {
            vraag: "In het nieuwe Jeruzalem hoeft niemand ooit nog een lamp aan te doen, en de poorten gaan nooit meer dicht. Wat bestaat daar niet meer?",
            antwoorden: ["De nacht", "De regen", "De kou", "De wind"],
            correct: "De nacht",
            bijbelplaats: "Openbaring 21:25"
        },
        {
            vraag: "In de hemel klinkt luid gejuich: het grote feest kan beginnen, want het Lam en zijn gemeente horen nu voorgoed bij elkaar. Met welk feest wordt die ontmoeting vergeleken?",
            antwoorden: ["Een bruiloftsfeest", "Een verjaardagsfeest", "Een oogstfeest", "Een afscheidsfeest"],
            correct: "Een bruiloftsfeest",
            bijbelplaats: "Openbaring 19:7-9"
        },
        {
            vraag: "Johannes is zo onder de indruk van de engel die hem alles laat zien, dat hij voor hem op de knieën valt om hem te aanbidden. Wat zegt de engel dan?",
            antwoorden: ["‘Doe dat niet! Aanbid alleen God.’", "‘Goed zo, ga door.’", "‘Buig nog dieper.’", "‘Sta op en volg mij naar de hoge hemel.’"],
            correct: "‘Doe dat niet! Aanbid alleen God.’",
            bijbelplaats: "Openbaring 22:8-9"
        },
        {
            vraag: "Johannes ziet de heilige stad uit de hemel neerdalen, prachtig versierd, alsof ze op weg is naar haar grote dag. Waarmee wordt het nieuwe Jeruzalem vergeleken?",
            antwoorden: ["Met een bruid", "Met een koningin", "Met een tuin", "Met een ster"],
            correct: "Met een bruid",
            bijbelplaats: "Openbaring 21:2"
        },
        {
            vraag: "Door het hemelse Jeruzalem stroomt een bijzondere rivier, helder als kristal, die ontspringt bij de troon van God. Wat doet dat water?",
            antwoorden: ["Het geeft leven", "Het geeft geluk", "Het zuivert; het water lijkt op een stroom van vuur", "Niks. Het is gewoon normaal water"],
            correct: "Het geeft leven",
            bijbelplaats: "Openbaring 22:1"
        },
        {
            vraag: "In Openbaring, in de brief aan de gemeente in Pergamum, belooft Jezus dat wie overwint een witte steen krijgt, met daarop iets geschreven dat niemand anders kent. Wat staat er op die steen?",
            antwoorden: ["Een nieuwe naam", "Een geheime code", "De naam van de steen", "Het wifiwachtwoord voor de hemel"],
            correct: "Een nieuwe naam",
            bijbelplaats: "Openbaring 2:17"
        },
        {
            vraag: "Rondom Gods troon zitten vierentwintig oudsten op hun eigen tronen. Als zij God aanbidden, staan ze op en leggen ze iets voor de troon neer. Wat leggen zij daar neer?",
            antwoorden: ["Hun kronen", "Hun pen", "Hun portemonnee", "Hun sleutels"],
            correct: "Hun kronen",
            bijbelplaats: "Openbaring 4:10"
        },
        {
            vraag: "Aan weerskanten van de rivier staat de levensboom, die twaalf keer per jaar vrucht draagt. Ook de bladeren hebben een doel. Waar zijn de bladeren voor?",
            antwoorden: ["Om de volken te genezen", "Om soep van te koken", "Om op te schrijven", "Ze hebben geen doel, het is gewoon voedsel voor de dieren"],
            correct: "Om de volken te genezen",
            bijbelplaats: "Openbaring 22:2"
        }
    ],
    expert: [
        {
            vraag: "Johannes schrijft dat hij niet in een kerk of tempel was toen hij zijn visioenen kreeg, maar op een afgelegen plek, ver van huis, omdat hij over Jezus had verteld. Waar was hij?",
            antwoorden: ["Op het eiland Patmos", "In de tempel van Jeruzalem", "In een gevangenis in Rome", "Op een berg in Egypte"],
            correct: "Op het eiland Patmos",
            bijbelplaats: "Openbaring 1:9"
        },
        {
            vraag: "In de nieuwe stad stroomt een heldere rivier, en daarlangs groeit een bijzondere boom. Welke boom is dat?",
            antwoorden: ["De boom van het leven", "De olijfboom", "De wijnstok", "De vijgenboom"],
            correct: "De boom van het leven",
            bijbelplaats: "Openbaring 22:1-2"
        },
        {
            vraag: "God noemt zichzelf de alfa en de omega — de eerste en de laatste letter van een alfabet. Van welk alfabet?",
            antwoorden: ["Het Griekse", "Het Hebreeuwse", "Het Latijnse", "Het Egyptische"],
            correct: "Het Griekse",
            bijbelplaats: "Openbaring 1:8"
        },
        {
            vraag: "Rondom Gods troon zag Johannes vierentwintig oudsten op eigen tronen zitten. Wat hadden zij op hun hoofd?",
            antwoorden: ["Gouden kronen", "Witte hoeden", "Groene kransen", "Niets"],
            correct: "Gouden kronen",
            bijbelplaats: "Openbaring 4:4"
        },
        {
            vraag: "Wat Johannes rondom de troon ziet, doet denken aan het teken dat God ooit aan Noach gaf. Wat zag hij?",
            antwoorden: ["Een regenboog", "Een muur van vuur", "Een dikke mist", "Een rij sterren"],
            correct: "Een regenboog",
            bijbelplaats: "Openbaring 4:3"
        },
        {
            vraag: "Helemaal aan het einde van Openbaring geeft Jezus zichzelf een naam met een ster erin. Welke naam?",
            antwoorden: ["De stralende morgenster", "De vallende ster", "De avondster", "De noorderster"],
            correct: "De stralende morgenster",
            bijbelplaats: "Openbaring 22:16"
        },
        {
            vraag: "De stadsmuur van het nieuwe Jeruzalem heeft twaalf poorten, en elke poort is uit één stuk gemaakt van hetzelfde bijzondere materiaal. Welk materiaal is dat?",
            antwoorden: ["Parels", "Goud", "Zilver", "Diamant"],
            correct: "Parels",
            bijbelplaats: "Openbaring 21:21"
        },
        {
            vraag: "In het oude Jeruzalem stond één gebouw dat het middelpunt van alles was: de plaats waar je God ging opzoeken. Johannes speurt de nieuwe stad af, maar vindt het nergens — want daar woont God zelf tussen de mensen. Wat ontbreekt er in het nieuwe Jeruzalem?",
            antwoorden: ["De tempel", "De stadsmuur", "De poorten", "De rivier"],
            correct: "De tempel",
            bijbelplaats: "Openbaring 21:22"
        },
        {
            vraag: "De nieuwe stad heeft geen zon en geen maan nodig, en toch is het er nooit donker. Hoe komt dat?",
            antwoorden: ["Omdat de glans van God de stad verlicht", "Omdat er duizenden kaarsen branden", "Omdat het er altijd ochtend is", "Omdat de sterren extra fel schijnen"],
            correct: "Omdat de glans van God de stad verlicht",
            bijbelplaats: "Openbaring 21:23"
        },
        {
            vraag: "Een engel geeft Johannes een klein boekrolletje en zegt dat hij het moet opeten. Hoe smaakt het in zijn mond?",
            antwoorden: ["Zo zoet als honing", "Zo bitter als spruitjes", "Zo zout als zeewater", "Zo zuur als een citroen"],
            correct: "Zo zoet als honing",
            bijbelplaats: "Openbaring 10:9-10"
        },
        {
            vraag: "Rondom Gods troon ziet Johannes vier levende wezens. Elk wezen heeft een eigen gezicht: het ene lijkt op een leeuw, een ander op een stier, een ander op een arend. Waar lijkt het overgebleven wezen op?",
            antwoorden: ["Een mens", "Een paard", "Een slang", "Een vis"],
            correct: "Een mens",
            bijbelplaats: "Openbaring 4:7"
        },
        {
            vraag: "Een engel met een gouden meetlat meet de stad op. De lengte, de breedte en de hoogte blijken precies gelijk te zijn. Welke vorm had de stad dus?",
            antwoorden: ["Een kubus (een vierkant blok)", "Een hoge, spitse punt zoals een toren", "Een piramide", "Een rechthoek"],
            correct: "Een kubus (een vierkant blok)",
            bijbelplaats: "Openbaring 21:16"
        },
        {
            vraag: "De stadsmuur rust op twaalf fundamenten, en op elk fundament staat een naam gegraveerd. Van wie waren deze namen?",
            antwoorden: ["Van de twaalf apostelen", "Van de twaalf stammen van Israël", "Van de twaalf engelen", "Van de twaalf koningen"],
            correct: "Van de twaalf apostelen",
            bijbelplaats: "Openbaring 21:14"
        },
        {
            vraag: "De hoofdstraat van de nieuwe stad was van zuiver goud, maar zó helder dat het leek op …",
            antwoorden: ["doorzichtig glas", "blauw water", "wit marmer", "groen gras"],
            correct: "doorzichtig glas",
            bijbelplaats: "Openbaring 21:21"
        }
    ]
};

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 18:
// woorden uit de brieven van Johannes en Tessalonicenzen)
// =====================================================================
vragenData["1 & 2 Tessalonicenzen"].advanced.push(
    {
        vraag: "Paulus schrijft: \"Doof de Geest niet uit.\" Aan wat voor beeld denkt hij bij dat woord?",
        antwoorden: ["Aan een vuur waar iemand water overheen gooit", "Aan een olielamp die na een lange nacht leegraakt", "Aan een fakkel die van hand tot hand gaat", "Aan een kaars die je mee naar buiten neemt"],
        correct: "Aan een vuur waar iemand water overheen gooit",
        bijbelplaats: "1 Tessalonicenzen 5:19",
        uitleg: "Het Griekse werkwoord werd gebruikt voor het blussen van een brand. Dat is iets anders dan opraken: bij blussen doet iemand het bewust. In de Bijbel wordt de Geest vaker met vuur vergeleken — denk aan de vlammen op de Pinksterdag. Paulus waarschuwt dus niet dat de Geest vanzelf verdwijnt, maar dat mensen er water overheen kunnen gooien."
    }
);

vragenData["1 & 2 Tessalonicenzen"].expert.push(
    {
        vraag: "Voor de terugkomst van Jezus gebruikt Paulus het woord \"komst\". In het Grieks was dat een heel gewoon woord. Waarvoor gebruikte men het?",
        antwoorden: ["Voor het bezoek van een koning aan een stad", "Voor de thuiskomst van een soldaat na de oorlog", "Voor de dag waarop een schip binnenliep", "Voor het uur waarop een gast aan tafel aanschoof"],
        correct: "Voor het bezoek van een koning aan een stad",
        bijbelplaats: "1 Tessalonicenzen 2:19",
        uitleg: "Parousia betekent letterlijk \"aanwezigheid\", maar in de steden van het Romeinse rijk was het de vaste term voor een staatsbezoek van de keizer of een koning. Er werden munten voor geslagen en poorten voor versierd. Dat Paulus juist dát woord voor Jezus kiest, zegt dus iets over wie volgens hem de echte koning is."
    },
    {
        vraag: "Paulus schrijft: \"bemoedig de kleinmoedigen.\" Wat betekent dat Griekse woord letterlijk?",
        antwoorden: ["Mensen met een kleine ziel", "Mensen die weinig moed hebben in de strijd", "Mensen die klein van gestalte zijn", "Mensen die pas kort geloven"],
        correct: "Mensen met een kleine ziel",
        bijbelplaats: "1 Tessalonicenzen 5:14",
        uitleg: "Het Griekse woord is samengesteld uit \"weinig\" en \"ziel\". Het gaat niet over lafheid, maar over mensen bij wie de moed in de schoenen is gezakt — die het even niet meer zien zitten. Ons woord kleinmoedig is langs het Latijn precies dezelfde samenstelling. Paulus noemt hen in één adem met wie het zwaar hebben, en zegt: hou vol met hen, wees geduldig."
    },
    {
        vraag: "Paulus schrijft aan de \"gemeente\" van Tessalonica; in andere vertalingen staat daar \"kerk\". Het Griekse woord ekklesia bestond al eeuwen in elke Griekse stad. Wat was het toen?",
        antwoorden: ["De vergadering waarop de burgers samen beslisten", "De school waar de jongens van de stad les kregen", "Het bestuur dat door de keizer was aangesteld", "De tempel waar men de goden van de stad diende"],
        correct: "De vergadering waarop de burgers samen beslisten",
        bijbelplaats: "1 Tessalonicenzen 1:1",
        uitleg: "Ekklesia betekent letterlijk \"de opgeroepenen\". Een omroeper trok door de stad en riep de burgers bijeen op het marktplein. Daar stemden ze over de dingen die iedereen aangingen: nieuwe wetten, oorlog of vrede, en wie het komende jaar de stad zou besturen. In Handelingen 19 staat het woord nog in die gewone betekenis, voor de volksoploop in Efeze. Noemden de eerste christenen zich zo, dan zeiden ze dus niet \"wij zijn een gebouw\", maar \"wij zijn opgeroepen en horen erbij\"."
    },
    {
        vraag: "Paulus waarschuwt voor mensen die \"ongeregeld\" leven. Uit welke wereld komt dat Griekse woord?",
        antwoorden: ["Uit het leger: een soldaat die uit het gelid loopt", "Uit de rechtszaal: iemand die zijn eed en belofte breekt", "Uit de haven: een schip zonder vaste route", "Uit de landbouw: een os die zijn juk afwerpt"],
        correct: "Uit het leger: een soldaat die uit het gelid loopt",
        bijbelplaats: "2 Tessalonicenzen 3:6",
        uitleg: "Het woord betekent letterlijk \"niet op zijn plek\". Wie uit het gelid stapte bracht de hele linie in gevaar. Paulus gebruikt het voor gemeenteleden die gestopt waren met werken — niet omdat werken het belangrijkste in het leven is, maar omdat de anderen hun last moesten dragen."
    }
);

vragenData["Brieven van Johannes"].advanced.push(
    {
        vraag: "Johannes schrijft dat de gelovigen \"een zalving\" hebben gekregen. Wat gebeurde er vroeger bij een zalving?",
        antwoorden: ["Er werd olie over iemands hoofd gegoten", "Er werd water over iemands handen gegoten", "Er werd een ring aan iemands vinger geschoven", "Er werd een mantel om iemands schouders gelegd"],
        correct: "Er werd olie over iemands hoofd gegoten",
        bijbelplaats: "1 Johannes 2:20",
        uitleg: "Koningen en priesters werden met olie gezalfd als teken dat God hen voor een taak had aangewezen. Johannes zegt iets verrassends: niet alleen leiders, maar álle gelovigen hebben die zalving gekregen. Hij gebruikt het beeld om hen moed te geven — jullie horen er echt bij."
    }
);

vragenData["Brieven van Johannes"].expert.push(
    {
        vraag: "In de derde brief van Johannes staat het woord \"gemeente\", dat in andere vertalingen \"kerk\" heet. Waar komt ons Nederlandse woord kerk vandaan?",
        antwoorden: ["Van een Grieks woord dat \"van de Heer\" betekent", "Van het Griekse ekklesia, dat vergadering betekent", "Van een Latijns woord voor een gebouw met een toren", "Van de naam van de eerste kerk in Rome"],
        correct: "Van een Grieks woord dat \"van de Heer\" betekent",
        bijbelplaats: "3 Johannes 1:6",
        uitleg: "Kerk komt van kyriakon, \"wat van de Heer is\". Via het Germaans werd dat kerk in het Nederlands, Kirche in het Duits, church in het Engels en kirke in het Deens. Het Griekse ekklesia ging een andere weg: in het Latijn werd het ecclesia, en daaruit ontstonden het Franse église, het Spaanse iglesia en het Italiaanse chiesa. Twee woorden voor dezelfde zaak — het ene noemt het huis van de Heer, het andere de mensen die bij elkaar geroepen zijn."
    },
    {
        vraag: "Johannes noemt Jezus de \"verzoening\" voor onze zonden. Het Nederlandse woord verzoening hangt samen met het woord zoen. Hoe zit dat?",
        antwoorden: ["Zoen betekende eerst vrede, en pas veel later een kus", "Zoen is een verkorting van verzoening en kwam later", "Zoen komt van een oud woord dat zoet betekende", "Beide woorden zijn uit het Latijn vertaald"],
        correct: "Zoen betekende eerst vrede, en pas veel later een kus",
        bijbelplaats: "1 Johannes 2:2",
        uitleg: "In het Middelnederlands was een \"soene\" een vrede of een goedmaking. Een zoenoffer was een offer om vrede te sluiten en zoengeld was geld waarmee je een ruzie afkocht. Pas veel later ging het woord de kus betekenen die bij zo'n verzoening hoorde. Als Johannes Jezus de verzoening noemt, bedoelt hij: door Hem is de breuk tussen God en mensen goedgemaakt."
    },
    {
        vraag: "Johannes schrijft dat hij zijn brief stuurt zodat zijn lezers \"gemeenschap\" met hem hebben. In gewoon Grieks kwam dat woord ook uit de handel. Wat betekende het daar?",
        antwoorden: ["Samen eigenaar zijn van één zaak", "Geld lenen aan iemand die je goed vertrouwt", "Een afspraak door een schrijver laten vastleggen", "Voor iemand werken tegen een vast loon per dag"],
        correct: "Samen eigenaar zijn van één zaak",
        bijbelplaats: "1 Johannes 1:3",
        uitleg: "Koinonia gebruikte men voor zakenpartners die samen een schip of een bedrijf bezaten — allebei helemaal betrokken, allebei verantwoordelijk. Vissers met één gezamenlijk net heetten koinonoi (Lucas 5:10). Het woord betekent dus meer dan gezelligheid: je hoort er echt bij en deelt in alles."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 17:
// de beeldtaal van Openbaring)
// =====================================================================
vragenData["Openbaring"].advanced.push(
    {
        vraag: "Het laatste boek van de Bijbel heet \"Openbaring\". Wat betekent dat woord?",
        antwoorden: ["Het wegtrekken van een doek, zodat je ziet wat er is", "Een boodschap die alleen door priesters gelezen mocht worden", "Het einde van alles wat er ooit op de aarde geweest is", "Een lied dat bij het slot van een boek hoort"],
        correct: "Het wegtrekken van een doek, zodat je ziet wat er is",
        bijbelplaats: "Openbaring 1:1",
        uitleg: "Het Griekse woord betekent onthulling — precies wat er gebeurt als bij de inwijding van een standbeeld het doek eraf gaat. Het boek gaat er dus niet in de eerste plaats over wat er later komt, maar over wie er nu werkelijk koning is. Daarom staat het vol beelden: die laten zien wat je met het blote oog niet ziet."
    },
    {
        vraag: "Zeven engelen blazen in Openbaring op een bazuin. Wat voor instrument was dat?",
        antwoorden: ["Een hoorn waarop men één hard signaal blies, geen melodie", "Een lange trompet van zilver, alleen voor muziek in de tempel", "Een grote trommel die het ritme van een lange optocht aangaf", "Een fluit die de zangers in de tempel begeleidde"],
        correct: "Een hoorn waarop men één hard signaal blies, geen melodie",
        bijbelplaats: "Openbaring 8:6",
        uitleg: "Meestal was het een ramshoorn. Je blies erop om te waarschuwen voor gevaar, om een feest te openen of om te melden dat de koning eraan kwam. Een bazuin in Openbaring betekent dus niet muziek, maar: let op, er gaat iets beginnen."
    },
    {
        vraag: "In de hemel klinkt \"Halleluja\". Wat betekent dat woord?",
        antwoorden: ["Prijs de HEER, in het Hebreeuws", "Zo is het, dat staat vast en het is waar", "De Heer komt — kom toch, Heer Jezus", "Red ons toch, kom ons te hulp"],
        correct: "Prijs de HEER, in het Hebreeuws",
        bijbelplaats: "Openbaring 19:1",
        uitleg: "Hallelu betekent prijst, en Jah is de verkorte naam van God. Net als amen is het woord nooit vertaald; het klinkt in elke taal hetzelfde. In heel Openbaring staat het maar op één plek — daar dan wel vier keer achter elkaar."
    }
);

vragenData["Openbaring"].expert.push(
    {
        vraag: "De oudsten houden gouden schalen vol reukwerk vast. Johannes schrijft er meteen bij wat die schalen voorstellen. Wat stellen zij voor?",
        antwoorden: ["De gebeden van de gelovigen", "De liederen die in de hemel klinken", "De namen van de twaalf stammen", "De offers uit de oude tempel"],
        correct: "De gebeden van de gelovigen",
        bijbelplaats: "Openbaring 5:8",
        uitleg: "In de tempel werd elke dag reukwerk verbrand, en de rook die opsteeg was het beeld van gebed dat omhooggaat. Openbaring houdt dat beeld vast en voegt er iets aan toe: de gebeden komen aan, en ze worden bewaard."
    },
    {
        vraag: "De grote menigte voor de troon houdt palmtakken vast. Wat betekende dat gebaar toen?",
        antwoorden: ["Feest en overwinning: zo haalde men een winnaar binnen", "Verdriet, zoals men vroeger bij een begrafenis takken droeg", "Dat men van ver gekomen was, als teken van de reis", "Dat men om regen vroeg in een droge tijd"],
        correct: "Feest en overwinning: zo haalde men een winnaar binnen",
        bijbelplaats: "Openbaring 7:9",
        uitleg: "Met palmtakken zwaaide men voor een winnaar of een koning die de stad binnenkwam — dezelfde takken als bij de intocht in Jeruzalem. Ook bij het Loofhuttenfeest droeg men takken. De menigte staat dus niet stil te wachten, die viert feest."
    },
    {
        vraag: "Jezus noemt Antipas van Pergamum \"mijn trouwe getuige\". Uit dat Griekse woord voor getuige is een Nederlands woord ontstaan. Welk?",
        antwoorden: ["Martelaar", "Missionaris", "Monnik", "Mysterie"],
        correct: "Martelaar",
        bijbelplaats: "Openbaring 2:13",
        uitleg: "Martys betekende gewoon getuige — iemand die vertelt wat hij zelf gezien heeft, zoals voor de rechter. Omdat zo veel van die getuigen hun trouw met hun leven bekochten, ging het woord langzaam iets anders betekenen. In Openbaring staat het nog in de oude zin."
    },
    {
        vraag: "Jezus zegt: ik heb de sleutels. Wat liet het bezit van de sleutels in die tijd zien?",
        antwoorden: ["Dat je het zeggen had over wie er binnen mocht", "Dat je het huis met eigen geld had laten bouwen", "Dat je bij de poortwacht in dienst was genomen", "Dat je als gast een ereplaats aan tafel kreeg"],
        correct: "Dat je het zeggen had over wie er binnen mocht",
        bijbelplaats: "Openbaring 3:7",
        uitleg: "In een groot huis droeg de rentmeester de sleutels aan zijn gordel. Hij besliste wie er binnenkwam en wie niet. Sleutels waren dus geen gereedschap maar een teken van gezag — vandaar dat het beeld telkens terugkomt zodra het over macht gaat."
    },
    {
        vraag: "Johannes ziet iemand met veel \"diademen\" op zijn hoofd. Wat was het verschil met de krans die een winnaar kreeg?",
        antwoorden: ["Een diadeem was een band die alleen een koning droeg", "Een diadeem was van hout en werd bij feesten gedragen", "Een diadeem werd van verse bloemen en blaadjes gevlochten", "Een diadeem kreeg je pas na je dood"],
        correct: "Een diadeem was een band die alleen een koning droeg",
        bijbelplaats: "Openbaring 19:12",
        uitleg: "Het Grieks gebruikt twee verschillende woorden. De krans van bladeren was voor wie de wedstrijd won; de diadeem was een band van stof of goud om het hoofd van een koning. In het Nederlands zeggen we voor allebei kroon, waardoor het verschil verdwijnt."
    },
    {
        vraag: "Jezus verwijt de gemeente van Laodicea dat zij \"lauw\" is. Waarom begrepen juist die mensen dat beeld meteen?",
        antwoorden: ["Hun water kwam van ver en was onderweg lauw geworden", "Zij hadden geen bron en dronken alleen regenwater", "Hun stad lag in een dal waar het altijd warm bleef", "Zij kookten hun water eerst en lieten het staan"],
        correct: "Hun water kwam van ver en was onderweg lauw geworden",
        bijbelplaats: "Openbaring 3:16",
        uitleg: "Laodicea haalde zijn water door een lange leiding uit de heuvels; het kwam lauw en kalkig aan. Even verderop lag Hiërapolis met warme bronnen waar zieken heen gingen, en Kolosse met koud bergwater. Warm was goed, koud was goed — lauw water spuugde je uit."
    }
);

vragenData["Efeziërs"].expert.push(
    {
        vraag: "Paulus schrijft dat Christus \"de muur die scheiding maakte\" heeft afgebroken. Aan welke muur dachten zijn lezers?",
        antwoorden: ["Een muur in de tempel waar niet-Joden niet voorbij mochten", "De stadsmuur van Jeruzalem, met voor elk volk een eigen poort", "Een muur die de rijke wijk en de arme wijk uit elkaar hield", "De muur rond het paleis van de Romeinse stadhouder"],
        correct: "Een muur in de tempel waar niet-Joden niet voorbij mochten",
        bijbelplaats: "Efeziërs 2:14",
        uitleg: "Op het tempelplein stond een lage stenen afscheiding met borden erop, in het Grieks en het Latijn, dat vreemdelingen niet verder mochten. Twee van die borden zijn later teruggevonden. Paulus zegt dus niet iets vaags: hij wijst op een muur die zijn lezers zelf gezien hadden."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 16:
// woorden en gebruiken uit de brieven)
// =====================================================================
vragenData["Romeinen"].advanced.push(
    {
        vraag: "Paulus noemt zichzelf meteen in de eerste zin een \"apostel\". Wat betekent dat woord?",
        antwoorden: ["Iemand die wordt uitgezonden met een opdracht", "Iemand die de heilige boeken uit zijn hoofd geleerd heeft", "Iemand die voorgaat in het gebed", "Iemand die als eerste ging geloven"],
        correct: "Iemand die wordt uitgezonden met een opdracht",
        bijbelplaats: "Romeinen 1:1",
        uitleg: "Het woord komt van het Griekse werkwoord voor wegsturen. Een gezant sprak met het gezag van degene die hem stuurde: zijn boodschap was niet zijn eigen mening. Daarom kon Paulus zeggen dat het evangelie dat hij bracht niet van hemzelf kwam."
    }
);

vragenData["Romeinen"].expert.push(
    {
        vraag: "Paulus noemt zijn boodschap het \"evangelie\", een woord dat toen al bestond. Wat betekende het in de gewone taal?",
        antwoorden: ["Goed nieuws dat een bode kwam brengen, zoals een overwinning", "Een boek waarin het leven van een groot en machtig man beschreven werd", "Een plechtige brief van de keizer aan een stad ergens in zijn rijk", "Het loon dat een bode voor zijn bericht kreeg"],
        correct: "Goed nieuws dat een bode kwam brengen, zoals een overwinning",
        bijbelplaats: "Romeinen 1:1",
        uitleg: "Bij een overwinning of de geboorte van een keizerszoon liet men door het hele rijk goed bericht omroepen. Dat de christenen juist dat woord kozen voor hun boodschap was een gewaagde keuze: het echte goede nieuws komt niet uit Rome."
    }
);

vragenData["1 & 2 Korintiërs"].expert.push(
    {
        vraag: "Paulus begint zijn brief door de Korintiërs \"heiligen\" te noemen — en bespreekt daarna bladzijdenlang hun ruzies. Wat betekende dat woord bij hem?",
        antwoorden: ["Apart gezet voor God; het gold voor iedereen", "Mensen die nog nooit iets verkeerds hadden gedaan", "De leiders die het bestuur van de gemeente vormden", "Gelovigen die al gestorven en begraven waren"],
        correct: "Apart gezet voor God; het gold voor iedereen",
        bijbelplaats: "1 Korintiërs 1:2",
        uitleg: "Het woord zegt niet hoe braaf je bent, maar bij wie je hoort. In de brieven slaat het steeds op alle gelovigen samen; pas veel later werd het ook gebruikt voor bijzondere gelovigen die als voorbeeld gelden."
    },
    {
        vraag: "In Korinte vroegen gelovigen zich af of ze vlees mochten eten \"dat aan afgoden geofferd was\". Hoe kwam dat vlees bij hen op tafel?",
        antwoorden: ["Wat van de tempeloffers overbleef, ging naar de markt", "De priesters deelden het gratis uit aan de armen van de stad", "Elke slager moest zijn vee laten wijden", "Het werd alleen in de tempel zelf gegeten"],
        correct: "Wat van de tempeloffers overbleef, ging naar de markt",
        bijbelplaats: "1 Korintiërs 8:1",
        uitleg: "In een Griekse stad liep bijna al het vlees via de tempels. Vlees kopen op de markt of ergens gaan eten was voor de eerste christenen dus een echte vraag en geen theorie."
    }
);

vragenData["Galaten"].expert.push(
    {
        vraag: "Paulus sluit zijn brief af: \"ik draag de merktekens van Jezus in mijn lichaam\". Waaraan deed dat toen denken?",
        antwoorden: ["Aan een teken waaraan je zag bij wie iemand hoorde", "Aan de zegelring waarmee een rijke zijn brieven dichtmaakte", "Aan het sieraad van een vrijgelaten gevangene", "Aan de kleuren waaraan je zag uit welke stad iemand kwam"],
        correct: "Aan een teken waaraan je zag bij wie iemand hoorde",
        bijbelplaats: "Galaten 6:17",
        uitleg: "Paulus doelt op de littekens die hij overhield aan de mishandelingen onderweg. Wie ze zag, zag bij wie hij hoorde. Voor Paulus was dat een sterker bewijs dan alle mooie papieren waarmee zijn tegenstanders zwaaiden."
    }
);

vragenData["Filippenzen"].expert.push(
    {
        vraag: "Paulus schrijft dat hij \"uitgegoten wordt als een plengoffer\". Wat was een plengoffer?",
        antwoorden: ["Wijn die bij een offer over het altaar ging", "Olie waarmee de priester het altaar insmeerde", "Water dat men over de handen goot", "Meel dat men op het altaarvuur strooide"],
        correct: "Wijn die bij een offer over het altaar ging",
        bijbelplaats: "Filippenzen 2:17",
        uitleg: "Bij een plengoffer bleef er niets over: alles ging het altaar op. Vandaar het beeld dat Paulus kiest terwijl hij gevangenzit — hij houdt niets van zichzelf achter."
    }
);

vragenData["Kolossenzen & Filemon"].expert.push(
    {
        vraag: "Paulus noemt dingen waarover niemand de Kolossenzen mag veroordelen: eten, drinken, feestdagen, \"nieuwe maan\" en sabbat. Wat was die nieuwe maan?",
        antwoorden: ["Het begin van een nieuwe maand, met een feest", "De nacht waarin het paaslam geslacht moest worden", "De laatste dag van het jaar", "De avond waarop de sabbat begon en het werk stopte"],
        correct: "Het begin van een nieuwe maand, met een feest",
        bijbelplaats: "Kolossenzen 2:16",
        uitleg: "De Joodse kalender liep mee met de maan. Zodra de nieuwe maansikkel gezien werd, begon de maand, en dat werd gevierd met bazuingeschal en offers. Omdat die kalender nog steeds meetelt, valt Pasen ook nu elk jaar op een andere datum."
    }
);

vragenData["Hebreeën"].expert.push(
    {
        vraag: "Hebreeën vergelijkt het werk van Jezus telkens met wat er gebeurde in \"de tent\". Wat was dat voor tent?",
        antwoorden: ["Een heiligdom dat het volk door de woestijn meedroeg", "De tent waarin de hogepriester woonde, naast de tempel", "Een tent op het tempelplein waar de offerdieren stonden", "De tent waarin Abraham God ontmoette bij de eiken"],
        correct: "Een heiligdom dat het volk door de woestijn meedroeg",
        bijbelplaats: "Hebreeën 9:2",
        uitleg: "Eeuwen vóór de tempel van Salomo was dit de plek waar men God ontmoette: uit elkaar te halen, mee te dragen en weer op te bouwen. Hebreeën gebruikt die tent om te laten zien dat alles wat daar gebeurde vooruitwees naar Jezus."
    }
);

vragenData["Petrus & Judas"].advanced.push(
    {
        vraag: "Petrus schrijft: \"omgord de lendenen van je verstand\". Waar komt dat beeld vandaan?",
        antwoorden: ["Van het opbinden van je lange kleed met je gordel, om te werken", "Van het aantrekken van een riem waaraan het zwaard werd gehangen", "Van het vastbinden van een lastdier voordat het op weg gaat", "Van het strak spannen van een boog voor het schieten"],
        correct: "Van het opbinden van je lange kleed met je gordel, om te werken",
        bijbelplaats: "1 Petrus 1:13",
        uitleg: "Men droeg kleren tot op de enkels. Wie ging werken of op reis ging, trok het kleed omhoog en stopte het in zijn gordel. Het beeld betekent dus: maak je klaar — en Petrus zegt het over je hoofd."
    }
);

vragenData["Jakobus"].advanced.push(
    {
        vraag: "Jakobus verwijt rijke landeigenaars dat zij het loon van hun maaiers achterhielden. Waarom was dat zo erg?",
        antwoorden: ["Een dagloner leefde van die dag en had niets achter de hand", "Maaiers mochten volgens de wet geen loon vragen, alleen eten", "Het loon van de oogst hoorde eerst naar de priesters te gaan", "Wie op het land werkte, kreeg altijd graan en nooit geld"],
        correct: "Een dagloner leefde van die dag en had niets achter de hand",
        bijbelplaats: "Jakobus 5:4",
        uitleg: "De wet van Mozes schreef het letterlijk voor: betaal een dagloner nog dezelfde dag, want hij heeft niets achter de hand. Jakobus beschuldigt de rijken dus niet alleen van gierigheid, maar van het overtreden van de wet."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 15:
// tijd, bestuur en het graf)
// =====================================================================
vragenData["Marcus"].expert.push(
    {
        vraag: "Marcus schrijft dat het avond werd en de sabbat aanbrak. Wanneer begon een nieuwe dag bij de Joden?",
        antwoorden: ["Bij zonsondergang, dus de avond hoorde al bij de volgende dag", "Om middernacht, net als bij ons", "Bij zonsopgang, als het licht werd", "Om twaalf uur 's middags"],
        correct: "Bij zonsondergang, dus de avond hoorde al bij de volgende dag",
        bijbelplaats: "Marcus 15:42",
        uitleg: "Dat verklaart de haast rond de begrafenis van Jezus. Hij stierf op vrijdagmiddag, en zodra de zon onderging begon de sabbat — dan mocht er niet meer gewerkt worden. Jozef van Arimatea had dus maar een paar uur. Om diezelfde reden kwamen de vrouwen pas zondagochtend terug met specerijen: eerder konden ze niet."
    }
);

vragenData["Marcus"].advanced.push(
    {
        vraag: "De vrouwen kochten welriekende kruiden om Jezus te zalven. Wat wilden zij daarmee laten zien?",
        antwoorden: ["Eerbied en genegenheid voor iemand die hun dierbaar was", "Dat zij geloofden dat Jezus uit de dood zou opstaan", "Dat zij rijker waren dan de andere leerlingen van Jezus", "Dat zij niet bang waren voor de wachters bij het graf"],
        correct: "Eerbied en genegenheid voor iemand die hun dierbaar was",
        bijbelplaats: "Marcus 16:1",
        uitleg: "Wat men in Israël deed was het lichaam wikkelen in linnen doeken met welriekende kruiden en harsen ertussen — mirre en aloë vooral. Dat was een teken van eerbied en genegenheid, geen poging om het lichaam te bewaren zoals in Egypte gebeurde. Bij Jezus was daar op de vrijdag geen tijd voor, want de sabbat begon. Daarom kochten de vrouwen zaterdagavond kruiden en gingen zij zondag bij het eerste licht op weg: dit was het laatste wat zij nog voor Hem konden doen."
    }
);

vragenData["Matteüs"].advanced.push(
    {
        vraag: "Jezus werd gelegd in een graf dat in de rots was uitgehakt. Hoe zag zo'n graf eruit?",
        antwoorden: ["Een kamer in de rotswand met stenen banken, afgesloten met een grote steen", "Een diep gat in de grond met aarde erop", "Een houten kist die boven de grond stond", "Een grot waar het hele dorp begraven werd"],
        correct: "Een kamer in de rotswand met stenen banken, afgesloten met een grote steen",
        bijbelplaats: "Matteüs 27:60",
        uitleg: "Een graf was geen kuil in de grond maar een kamer, uitgehakt in de zachte kalksteen rond Jeruzalem. Binnen liepen stenen banken langs de wanden, en daar werd het lichaam op gelegd, gewikkeld in doeken met specerijen. Voor de ingang rolde men een grote ronde steen. Zo'n graf hoorde bij een familie en werd van generatie op generatie gebruikt. Juist daarom valt op wat Matteüs vertelt: Jozef van Arimatea gaf zijn eigen nieuwe graf weg aan iemand die niet tot zijn familie hoorde."
    },
    {
        vraag: "Pilatus wordt \"stadhouder\" of \"landvoogd\" genoemd. Wat was zijn taak?",
        antwoorden: ["Hij bestuurde Judea namens Rome en had het laatste woord bij rechtszaken", "Hij was de burgemeester van Jeruzalem", "Hij was de opperpriester van de Romeinse tempel", "Hij inde de belasting en verder niets"],
        correct: "Hij bestuurde Judea namens Rome en had het laatste woord bij rechtszaken",
        bijbelplaats: "Matteüs 27:2",
        uitleg: "Judea was geen gewone provincie maar een onrustig grensgebied, en werd bestuurd door een prefect: een Romeinse ambtenaar met een eigen legereenheid. Pilatus woonde niet in Jeruzalem maar in Caesarea aan zee, en kwam alleen naar de stad tijdens de grote feesten, wanneer er honderdduizenden pelgrims waren en de kans op onrust het grootst was. Hij had één bevoegdheid die de Joodse leiders niet hadden: het doodvonnis. Precies daarom moest Jezus na het verhoor door de Hoge Raad alsnog bij hem komen."
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "Lucas noemt Herodes \"tetrarch\" van Galilea. Wat betekent dat woord?",
        antwoorden: ["Bestuurder over een deel van een verdeeld rijk, onder Romeins gezag, lager in rang dan een koning", "Opperbevelhebber van het Romeinse leger", "Hogepriester in de tempel", "Rechter van de Hoge Raad"],
        correct: "Bestuurder over een deel van een verdeeld rijk, onder Romeins gezag, lager in rang dan een koning",
        bijbelplaats: "Lucas 3:1",
        uitleg: "Toen Herodes de Grote stierf, werd zijn rijk onder zijn zonen verdeeld. Geen van hen kreeg de titel koning; de keizer hield die in eigen hand. Ze werden tetrarch genoemd, letterlijk heerser over een vierde deel, maar in de praktijk was het gewoon de titel voor een vorst van lagere rang. Lucas noemt in dit ene vers de keizer, de stadhouder, drie tetrarchen én twee hogepriesters — hij zet het verhaal daarmee heel precies op de kaart van de wereldgeschiedenis."
    },
    {
        vraag: "De Herodes die Jezus liet verhoren was niet dezelfde als de Herodes uit het kerstverhaal. Hoe zat dat?",
        antwoorden: ["De eerste was Herodes de Grote, de tweede zijn zoon Herodes Antipas", "Het was dezelfde man, maar hij was oud geworden", "Herodes was een titel, geen naam, net als keizer", "De tweede was de kleinzoon van de eerste"],
        correct: "De eerste was Herodes de Grote, de tweede zijn zoon Herodes Antipas",
        bijbelplaats: "Lucas 23:7",
        uitleg: "Herodes de Grote regeerde toen Jezus geboren werd en stierf kort daarna. Zijn rijk werd verdeeld onder zijn zonen. Herodes Antipas kreeg Galilea — hij is degene die Johannes de Doper liet onthoofden en die Jezus verhoorde. Nog weer later komt in Handelingen een Herodes Agrippa voor, een kleinzoon. Er lopen dus drie verschillende Herodessen door het Nieuwe Testament."
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "Jezus werd na zijn arrestatie eerst naar Annas gebracht en daarna naar Kajafas, die dat jaar hogepriester was. Waarom werd hij eerst bij Annas gebracht?",
        antwoorden: ["Annas was zelf eerder hogepriester geweest en hield veel invloed; Kajafas was zijn schoonzoon", "Er waren altijd twee hogepriesters tegelijk in dienst", "De een ging over de tempel, de ander over de synagogen", "Annas verving Kajafas als die ziek was"],
        correct: "Annas was zelf eerder hogepriester geweest en hield veel invloed; Kajafas was zijn schoonzoon",
        bijbelplaats: "Johannes 18:13",
        uitleg: "In de tijd vóór de Romeinen bleef een hogepriester zijn leven lang in functie. Onder Romeins bestuur benoemde en ontsloeg de gouverneur hen echter naar believen. Annas was ongeveer tien jaar hogepriester geweest en werd afgezet, maar hij bleef achter de schermen de machtigste man in Jeruzalem: vijf van zijn zonen én zijn schoonzoon Kajafas werden na hem hogepriester. Wie iets wilde regelen, ging dus eerst langs Annas. Dat verklaart ook waarom Lucas twee namen tegelijk noemt als hij vertelt wanneer Johannes de Doper begon."
    },
    {
        vraag: "Bij de arrestatie van Jezus kwam er een cohort mee, een afdeling van het Romeinse leger. Hoe groot was zo'n cohort?",
        antwoorden: ["Een paar honderd soldaten, een tiende deel van een legioen", "Twee of drie man", "Ongeveer tien soldaten met één aanvoerder", "Het hele Romeinse leger in Judea"],
        correct: "Een paar honderd soldaten, een tiende deel van een legioen",
        bijbelplaats: "Johannes 18:3",
        uitleg: "Het Romeinse leger was opgedeeld in legioenen van zo'n vijfduizend man, en elk legioen bestond weer uit tien cohorten. In Jeruzalem lag één cohort gelegerd, in de burcht Antonia naast de tempel — vooral tijdens de feesten, wanneer de stad volstroomde met pelgrims en de kans op onrust het grootst was. Johannes is de enige evangelist die vertelt dat er Romeinse soldaten meekwamen bij de arrestatie; de andere drie noemen alleen de tempelwacht."
    }
);

vragenData["Handelingen"].advanced.push(
    {
        vraag: "De gelovigen kwamen samen \"op de eerste dag van de week\". Welke dag was dat?",
        antwoorden: ["De zondag, de dag na de sabbat, waarop Jezus was opgestaan", "De maandag, het begin van de werkweek", "De zaterdag, dezelfde dag als de sabbat", "De vrijdagavond, als de sabbat begon"],
        correct: "De zondag, de dag na de sabbat, waarop Jezus was opgestaan",
        bijbelplaats: "Handelingen 20:7",
        uitleg: "De Joodse week telde geen namen maar nummers: de eerste dag, de tweede dag, en zo verder tot de sabbat. De eerste dag van de week is dus wat wij zondag noemen. De eerste christenen bleven aanvankelijk gewoon op sabbat naar de synagoge gaan, maar kwamen daarnaast op die eerste dag bijeen om brood te breken — de dag waarop Jezus was opgestaan. Omdat een dag bij zonsondergang begon, viel zo'n samenkomst voor hun gevoel op zaterdagavond. Dat verklaart waarom Paulus in dit verhaal tot na middernacht doorpraat."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 14:
// onderwijs, recht en reizen)
// =====================================================================
vragenData["Handelingen"].expert.push(
    {
        vraag: "Paulus zegt dat hij \"aan de voeten van Gamaliël\" is opgeleid. Wat betekent die uitdrukking?",
        antwoorden: ["Hij was leerling van die leraar en zat letterlijk lager dan hij", "Hij heeft die leraar verzorgd toen die oud werd", "Hij is als kind door hem gedoopt", "Hij heeft zijn schoenen mogen dragen als eerbetoon"],
        correct: "Hij was leerling van die leraar en zat letterlijk lager dan hij",
        bijbelplaats: "Handelingen 22:3",
        uitleg: "Een leraar zat op een stoel of verhoging, en zijn leerlingen zaten op de grond om hem heen. \"Aan iemands voeten zitten\" werd daardoor de gewone uitdrukking voor \"bij iemand in de leer zijn\". Datzelfde beeld staat bij Maria, de zus van Marta: zij zat aan Jezus' voeten en luisterde. Dat was voor een vrouw ongebruikelijk — zij nam de plaats in van een leerling."
    },
    {
        vraag: "De apostelen moesten voor \"de Hoge Raad\" verschijnen. Wat was dat?",
        antwoorden: ["De hoogste Joodse rechtbank, met eenenzeventig leden onder leiding van de hogepriester", "De raad van de Romeinse gouverneur", "Een vergadering van alle inwoners van Jeruzalem", "De vergadering van de oudsten van één synagoge"],
        correct: "De hoogste Joodse rechtbank, met eenenzeventig leden onder leiding van de hogepriester",
        bijbelplaats: "Handelingen 5:27",
        uitleg: "Deze raad heette in het Grieks het Sanhedrin. Hij telde eenenzeventig leden — priesters, oudsten en schriftgeleerden — onder leiding van de hogepriester, en vergaderde in een zaal bij de tempel. Het was de hoogste Joodse rechtbank, maar onder Romeins bestuur mocht hij geen doodvonnis meer uitvoeren. Daarom werd Jezus na het verhoor doorgestuurd naar Pilatus."
    },
    {
        vraag: "Paulus zegt: ik beroep mij op de keizer. Waarom kon hij dat doen?",
        antwoorden: ["Hij was Romeins burger, en die had het recht zijn zaak in Rome te laten behandelen", "Hij was priester geweest en had daardoor bijzondere rechten", "Hij had de gouverneur betaald voor die gunst", "Iedere gevangene mocht dat vragen, maar het werd zelden toegestaan"],
        correct: "Hij was Romeins burger, en die had het recht zijn zaak in Rome te laten behandelen",
        bijbelplaats: "Handelingen 25:11",
        uitleg: "Het Romeinse burgerrecht gaf een handvol rechten die voor gewone inwoners niet golden: je mocht niet zonder vonnis gegeseld worden, niet gekruisigd worden, en je mocht je zaak naar Rome laten verwijzen. Zodra Paulus die woorden uitsprak, was de zaak uit handen van de gouverneur — die kón hem daarna niet meer vrijlaten, ook al vond hij hem onschuldig. Het beroep bracht Paulus dus naar Rome, maar het sloot tegelijk de deur naar vrijlating."
    },
    {
        vraag: "Paulus vraagt of het is toegestaan een Romeins burger te geselen zonder vonnis. Waarom schrokken de soldaten daarvan?",
        antwoorden: ["Dat was verboden, en wie het toch deed kon zelf gestraft worden", "Zij hadden hun zweep al verloren", "Geselen mocht alleen op de sabbat niet", "Zij dachten dat hij een priester was"],
        correct: "Dat was verboden, en wie het toch deed kon zelf gestraft worden",
        bijbelplaats: "Handelingen 22:25",
        uitleg: "Twee oude Romeinse wetten verboden het om een burger zonder vonnis te binden of te slaan. Wie dat toch deed, riskeerde zelf een zware straf, en de commandant in dit verhaal schrikt dan ook oprecht — hij had Paulus al laten vastbinden. Het burgerrecht was niet aan een gebied gebonden: je nam het mee waar je ook kwam, en één zin was genoeg om het in te roepen. Precies dat maakt het ook zo bijzonder dat Paulus die zin niet altijd uitsprak; in Filippi liet hij zich eerst afranselen en zei hij het pas achteraf."
    },
    {
        vraag: "Paulus werd overgezet op een schip uit Alexandrië, op weg naar Italië. Wat vervoerde zo'n schip vooral?",
        antwoorden: ["Graan uit Egypte, waarmee de stad Rome werd gevoed", "Marmer voor de bouw van tempels", "Soldaten die met verlof gingen", "Wilde dieren voor de spelen in het theater"],
        correct: "Graan uit Egypte, waarmee de stad Rome werd gevoed",
        bijbelplaats: "Handelingen 27:6",
        uitleg: "Egypte was de graanschuur van het rijk. Elk jaar voeren grote vrachtschepen graan naar Rome, want de stad had ruim een miljoen inwoners en kon zichzelf niet voeden. Die schepen waren de grootste van hun tijd — er konden honderden mensen mee. Daarom staat er ook dat er 276 opvarenden waren toen het schip verging: dat is geen legerkonvooi, maar één vrachtschip vol graan en passagiers."
    }
);

vragenData["Lucas"].advanced.push(
    {
        vraag: "In de synagoge van Nazaret kreeg Jezus de boekrol van Jesaja aangereikt. Hoe las men die?",
        antwoorden: ["Je rolde hem met twee handen open tot je de goede plek had, en las staand voor", "Je sloeg hem open op de juiste bladzijde, zoals bij een boek", "De voorlezer kreeg de tekst voorgezegd en herhaalde die", "Men las nooit voor, de tekst werd uit het hoofd opgezegd"],
        correct: "Je rolde hem met twee handen open tot je de goede plek had, en las staand voor",
        bijbelplaats: "Lucas 4:17",
        uitleg: "Een boekrol was een lange strook perkament of papyrus, opgerold rond twee stokken. Om iets terug te vinden rolde je met de ene hand op en met de andere af, tot je bij de goede plek was — bladzijden om te zoeken waren er niet. Een rol met alleen het boek Jesaja was al zo'n zeven meter lang. Voorlezen deed je staand, uit eerbied voor de tekst; daarna ging je zitten om uit te leggen. Lucas vertelt precies dat: Jezus stond op om te lezen, rolde de boekrol op en ging zitten — en pas toen begon hij te spreken."
    }
);

vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus zegt dat zout weggegooid wordt als het zijn kracht verliest. Hoe kan zout zijn smaak verliezen?",
        antwoorden: ["Het zout uit de Dode Zee zat vol andere mineralen; in vocht spoelde het zoute deel eruit en bleef er smakeloos gruis over", "Zout wordt oud en verliest dan vanzelf zijn smaak", "Zout dat je te lang bewaart verandert in zand", "Zout verliest zijn smaak als er licht op valt"],
        correct: "Het zout uit de Dode Zee zat vol andere mineralen; in vocht spoelde het zoute deel eruit en bleef er smakeloos gruis over",
        bijbelplaats: "Matteüs 5:13",
        uitleg: "Wat men zout noemde, waren brokken van de oever van de Dode Zee. Daar zit naast echt zout ook gips en kalk in. Echt zout lost sneller op dan die andere stoffen, dus lag zo'n brok lang in een vochtige voorraadkamer, dan trok het zoute eruit en bleef er korrelig gruis over dat nergens meer naar smaakte. Weggooien op het land kon niet — zout maakt grond onvruchtbaar — dus strooide men het op de paden. Vandaar dat Jezus zegt dat het wordt weggeworpen en vertrapt."
    }
);

vragenData["Matteüs"].advanced.push(
    {
        vraag: "Jezus zegt: een stad op een berg kan niet verborgen blijven. Waarom bouwde men steden op een heuvel?",
        antwoorden: ["Om vijanden ver van tevoren te zien aankomen en je makkelijker te verdedigen", "Omdat het daar koeler was in de zomer", "Omdat de grond in het dal te duur was", "Omdat er op de heuvels meer water te vinden was"],
        correct: "Om vijanden ver van tevoren te zien aankomen en je makkelijker te verdedigen",
        bijbelplaats: "Matteüs 5:14",
        uitleg: "Bijna elke oude stad in Israël lag op een heuvel. Dat was geen kwestie van uitzicht maar van overleven: een vijand moest omhoog vechten, en jij zag hem uren van tevoren aankomen. De muren stonden op de rand, zodat de helling zelf al een deel van de verdediging was. Water haalde men uit een bron beneden, soms via een tunnel die van binnenuit was uitgehakt. En omdat die steden hoog en licht van kleur waren, waren ze bij helder weer van kilometers ver te zien. Precies dat gebruikt Jezus als beeld."
    }
);

vragenData["Hebreeën"].expert.push(
    {
        vraag: "De brief aan de Hebreeën noemt de dag waarop de hogepriester één keer per jaar het allerheiligste binnenging. Welke dag was dat?",
        antwoorden: ["De Grote Verzoendag, de enige dag waarop dat mocht", "Het Pesachfeest, aan het begin van het voorjaar", "De eerste dag van elke maand", "Elke sabbat, na de ochtenddienst"],
        correct: "De Grote Verzoendag, de enige dag waarop dat mocht",
        bijbelplaats: "Hebreeën 9:7",
        uitleg: "De Grote Verzoendag, in het Hebreeuws Jom Kipoer, was de belangrijkste vastendag van het jaar. Op die ene dag ging de hogepriester het allerheiligste binnen, de kleine ruimte achter het voorhangsel waar verder niemand ooit kwam. Hij bracht daar bloed van een offerdier, voor zijn eigen fouten en die van het hele volk. Daarna werd een tweede bok de woestijn in gestuurd, symbolisch beladen met alles wat er misgegaan was — vandaar ons woord zondebok. De schrijver van Hebreeën gebruikt dat beeld om iets over Jezus te zeggen: hij ging één keer naar binnen, en dat was genoeg voor altijd."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 13:
// plaatsen, volken en de eerste gemeenten)
// =====================================================================
vragenData["Lucas"].advanced.push(
    {
        vraag: "Dat juist een Samaritaan de gewonde man hielp, was voor de toehoorders schokkend. Waarom vonden zij dat zo verrassend?",
        antwoorden: ["Joden en Samaritanen gingen al eeuwen niet met elkaar om en wantrouwden elkaar diep", "Samaritanen waren rovers, dus men verwachtte hier het tegenovergestelde", "Samaritanen mochten volgens de wet geen gewonden aanraken", "Samaritanen waren Romeinse soldaten in dienst van de bezetter"],
        correct: "Joden en Samaritanen gingen al eeuwen niet met elkaar om en wantrouwden elkaar diep",
        bijbelplaats: "Lucas 10:33",
        uitleg: "De Samaritanen waren verwanten van de Joden, met dezelfde eerste vijf bijbelboeken. Maar ze aanbaden God op de berg Gerizim in plaats van in Jeruzalem, en dat verschil liep hoog op — er is zelfs een keer een Samaritaanse tempel verwoest door Joden. Wie in Galilea naar Jeruzalem reisde, maakte liever een omweg dan door Samaria te lopen. Dat maakt de gelijkenis scherp: de priester en de leviet horen erbij, en juist de buitenstaander doet wat nodig is."
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "De genezen man ging het verhaal vertellen in \"Dekapolis\". Wat was dat?",
        antwoorden: ["Een gebied met tien Griekse steden ten oosten van het meer van Galilea", "De tiende wijk van Jeruzalem", "Een groep van tien dorpen rond Nazaret", "Het gebied waar tien stammen van Israël woonden"],
        correct: "Een gebied met tien Griekse steden ten oosten van het meer van Galilea",
        bijbelplaats: "Marcus 5:20",
        uitleg: "Dekapolis betekent letterlijk tien steden. Het was een groep Griekse steden ten oosten en zuiden van het meer van Galilea, gesticht in de eeuwen vóór Jezus. Er woonden vooral niet-Joden, met Griekse tempels, theaters en badhuizen. Dat verklaart ook waarom er in dat gebied varkens werden gehouden, wat in Joods gebied ondenkbaar was. De man die door Jezus was genezen ging dus niet naar zijn eigen volk om het te vertellen, maar naar tien Griekse steden — hij was daarmee de eerste die het nieuws buiten Israël bracht."
    },
    {
        vraag: "Jezus reisde naar het gebied van Tyrus en Sidon. Wat voor gebied was dat?",
        antwoorden: ["Havensteden aan de kust, buiten Israël, waar vooral niet-Joden woonden", "Twee dorpen vlak bij Nazaret", "Het bergland waar de Samaritanen woonden", "Twee Romeinse legerkampen in de woestijn"],
        correct: "Havensteden aan de kust, buiten Israël, waar vooral niet-Joden woonden",
        bijbelplaats: "Marcus 7:24",
        uitleg: "Twee oude havensteden aan de kust van het huidige Libanon, buiten Israël. Ze leefden van de zeehandel en van purperverf, gewonnen uit zeeslakken — vandaar dat purper zo duur was. In het Oude Testament komen ze vaak voor als het toonbeeld van rijkdom en hoogmoed. Dat Jezus juist daarheen ging, is dus geen toevallige omweg: het is het gebied waar een Joodse leraar niet werd verwacht. En het is daar dat de Syro-Fenicische vrouw hem aanspreekt over de kruimels onder de tafel."
    }
);

vragenData["Handelingen"].advanced.push(
    {
        vraag: "In Antiochië werden de leerlingen voor het eerst \"christenen\" genoemd. Wat voor stad was dat?",
        antwoorden: ["Een grote handelsstad in het noorden, waar Joden en niet-Joden samen in de gemeente zaten", "Een klein dorp waar alleen Joden woonden", "De hoofdstad van Israël na Jeruzalem", "Een stad in Egypte, aan de monding van de Nijl"],
        correct: "Een grote handelsstad in het noorden, waar Joden en niet-Joden samen in de gemeente zaten",
        bijbelplaats: "Handelingen 11:26",
        uitleg: "Antiochië lag in het noorden, in het huidige Turkije, en was met een paar honderdduizend inwoners na Rome en Alexandrië de derde stad van het rijk. Er woonden veel Joden, maar ook Grieken en Syriërs door elkaar. Juist daar ontstond de eerste gemeente waarin Joden en niet-Joden samen aan tafel gingen — en dat maakte een nieuwe naam nodig, want de oude aanduiding als Joodse groep dekte de lading niet meer. Vanuit Antiochië vertrok Paulus later op al zijn reizen."
    },
    {
        vraag: "De eerste gelovigen hadden \"alles gemeenschappelijk\". Wat betekende dat in de praktijk?",
        antwoorden: ["Wie bezit had, verkocht het als er iemand tekortkwam", "Niemand mocht nog iets bezitten, alles moest weg", "Ze woonden allemaal samen in één groot huis", "Ze deelden alleen het brood bij de maaltijd"],
        correct: "Wie bezit had, verkocht het als er iemand tekortkwam",
        bijbelplaats: "Handelingen 2:44-45",
        uitleg: "Er kwam geen kas en geen regel dat je alles moest afstaan. Wat er gebeurde was praktischer: wie een stuk grond of een huis over had, verkocht het als er iemand tekortkwam, en bracht de opbrengst naar de apostelen. Later in Handelingen zegt Petrus dat ook met zoveel woorden tegen Ananias — het bezit was van hem geweest en hij had het mogen houden. Het bijzondere zat dus niet in een verplichting, maar in de vanzelfsprekendheid: niemand liet een ander tekortkomen."
    },
    {
        vraag: "De apostelen legden de zeven mannen de handen op. Wat betekende dat gebaar?",
        antwoorden: ["Iemand aanwijzen voor een taak en hem daarbij zegenen", "Controleren of iemand gezond was", "Iemand welkom heten in de gemeente", "Iemand vergeving schenken voor zijn fouten"],
        correct: "Iemand aanwijzen voor een taak en hem daarbij zegenen",
        bijbelplaats: "Handelingen 6:6",
        uitleg: "Handen opleggen was een oud gebaar met twee betekenissen: iemand zegenen, en iemand aanwijzen voor een taak. In het Oude Testament legt Mozes zijn handen op Jozua als die zijn opvolger wordt. In de eerste gemeente gebeurde het bij het uitzenden van Paulus en Barnabas, en hier bij de zeven mannen. Het gebaar maakte zichtbaar wat er gebeurde: dit is niet iets wat je jezelf toe-eigent, het wordt je gegeven. Het gebruik leeft nog steeds. In katholieke kerken hoort handoplegging bij de wijding van een diaken of priester, in protestantse kerken bij de bevestiging van een predikant, ouderling of diaken, en in evangelische gemeenten legt men elkaar vaak de handen op bij het gebed voor iemand die ziek is."
    }
);

vragenData["Handelingen"].expert.push(
    {
        vraag: "Op het Wekenfeest waren er in Jeruzalem \"Joden en proselieten\". Wat is een proseliet?",
        antwoorden: ["Iemand die geen Jood was maar wel helemaal Jood was geworden", "Iemand die alleen op feestdagen naar de tempel ging", "Een Jood die in het buitenland woonde", "Een leerling van een schriftgeleerde"],
        correct: "Iemand die geen Jood was maar wel helemaal Jood was geworden",
        bijbelplaats: "Handelingen 2:10",
        uitleg: "Er waren twee soorten buitenstaanders die zich tot de God van Israël wendden. Een godvrezende ging naar de synagoge en hield zich aan de belangrijkste geboden, maar bleef formeel buiten het volk. Een proseliet ging helemaal over: hij liet zich besnijden, nam een rituele wassing en gold daarna volledig als Jood. Lucas noemt beide groepen apart — Cornelius was godvrezende, de mensen in dit vers waren proselieten. Dat onderscheid verklaart waarom de vraag of niet-Joden zich moesten laten besnijden later zo'n groot conflict werd."
    },
    {
        vraag: "De apostelen kozen zeven mannen voor een bepaalde taak. Waarom was dat nodig?",
        antwoorden: ["Griekssprekende weduwen werden overgeslagen bij de dagelijkse voedselverdeling", "Er waren te weinig mensen om de tempel schoon te houden", "De gemeente had geld nodig en zij moesten het innen", "Er moest iemand de brieven van Paulus rondbrengen"],
        correct: "Griekssprekende weduwen werden overgeslagen bij de dagelijkse voedselverdeling",
        bijbelplaats: "Handelingen 6:1-3",
        uitleg: "In de eerste gemeente zaten twee groepen Joden door elkaar: mensen die Aramees spraken en waren opgegroeid in Judea, en mensen die Grieks spraken en uit de diaspora kwamen. Die tweede groep voelde zich achtergesteld bij het eten voor de weduwen. Opvallend is de oplossing: alle zeven gekozen mannen hebben een Griekse naam — de apostelen gaven de taak dus juist aan de groep die zich benadeeld voelde."
    }
);

vragenData["Jakobus"].expert.push(
    {
        vraag: "Jakobus schrijft aan de twaalf stammen \"in de verstrooiing\". Wat betekent dat?",
        antwoorden: ["De Joden die buiten Israël woonden, verspreid over het hele rijk", "De gelovigen die zich verstopt hielden voor vervolging", "De stammen die onderling ruzie hadden gekregen", "De mensen die hun geloof waren kwijtgeraakt"],
        correct: "De Joden die buiten Israël woonden, verspreid over het hele rijk",
        bijbelplaats: "Jakobus 1:1",
        uitleg: "Al eeuwen vóór Jezus woonden er meer Joden buiten Israël dan erin. Sommigen waren ooit weggevoerd, anderen waren voor handel of werk vertrokken. Zo ontstonden Joodse gemeenschappen in Egypte, Babylonië, Klein-Azië, Griekenland en Rome, elk met een eigen synagoge. Het Griekse woord daarvoor is diaspora, verstrooiing — alsof zaad is uitgestrooid over een groot veld. Juist door die verspreiding kon het christelijk geloof zich later zo snel verbreiden: Paulus vond in elke stad die hij bezocht al een synagoge waar hij kon beginnen."
    }
);

vragenData["Timoteüs & Titus"].expert.push(
    {
        vraag: "Paulus liet Titus achter op Kreta. Wat voor eiland was dat?",
        antwoorden: ["Een groot Grieks eiland met veel steden en havens, waar Paulus meerdere gemeenten achterliet", "Een klein rotseiland waar bijna niemand woonde", "Een eiland vlak voor de kust van Israël, op een halve dagreis varen", "Een onbewoond eiland waar schepen alleen schuilden bij storm"],
        correct: "Een groot Grieks eiland met veel steden en havens, waar Paulus meerdere gemeenten achterliet",
        bijbelplaats: "Titus 1:5",
        uitleg: "Kreta is met ruim tweehonderd kilometer lengte het grootste Griekse eiland en lag midden op de vaarroutes tussen Egypte, Griekenland en Italië. Er waren tientallen steden, en al vanaf Pinksteren woonden er Joden — Handelingen noemt Kretenzers bij de volken die in Jeruzalem waren. Dat Paulus schrijft dat Titus in elke stad oudsten moest aanstellen zegt dus iets: het ging niet om één gemeente, maar om een eiland vol verspreide groepjes gelovigen."
    }
);

// =====================================================================
// De drie talen van Israël (expert)
// =====================================================================
vragenData["Johannes"].expert.push(
    {
        vraag: "Welke talen sprak men in Israël in de tijd van Jezus?",
        antwoorden: ["Aramees in het dagelijks leven, Hebreeuws in de synagoge, en Grieks als wereldtaal", "Alleen Hebreeuws, want dat was de taal van de Bijbel", "Alleen Latijn, want de Romeinen waren de baas", "Aramees in het noorden en Grieks in het zuiden"],
        correct: "Aramees in het dagelijks leven, Hebreeuws in de synagoge, en Grieks als wereldtaal",
        bijbelplaats: "Johannes 19:20",
        uitleg: "Thuis en op straat sprak men Aramees — dat is de taal van Talita koem, Effata en Abba. Hebreeuws was de taal van de heilige boeken en werd voorgelezen in de synagoge; het leek op Aramees zoals Nederlands op Duits lijkt. En Grieks was de taal waarin je handeldreef, reisde en brieven schreef in het hele oostelijke deel van het Romeinse rijk — daarom is het hele Nieuwe Testament in het Grieks geschreven. Latijn hoorde bij het Romeinse leger en het formele bestuur. In dit deel van het rijk bestuurden de Romeinen namelijk gewoon in het Grieks: ook een tollenaar hield zijn boeken in het Grieks bij. Dat verklaart het bordje boven het kruis: Pilatus liet het opschrift in het Hebreeuws, Latijn en Grieks zetten, zodat iedereen het kon lezen."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 12, BEGINNER:
// aanvulling voor Petrus & Judas, Timoteüs & Titus en Openbaring)
// =====================================================================
vragenData["Petrus & Judas"].beginner.push(
    {
        vraag: "Petrus schrijft dat de duivel rondgaat als een brullende leeuw. Waarom juist een leeuw?",
        antwoorden: ["Een leeuw was het gevaarlijkste roofdier dat men kende, en zijn gebrul hoorde je van ver", "Leeuwen kwamen alleen 's nachts en waren daarom eng", "De leeuw was het teken van de Romeinse keizer", "Leeuwen werden in de tempel gebruikt als versiering"],
        correct: "Een leeuw was het gevaarlijkste roofdier dat men kende, en zijn gebrul hoorde je van ver",
        bijbelplaats: "1 Petrus 5:8"
    },
    {
        vraag: "Petrus noemt de gelovigen \"vreemdelingen en bijwoners\". Wat is een bijwoner?",
        antwoorden: ["Iemand die ergens woont zonder er thuis te horen, zoals een gast in een vreemd land", "Iemand die naast de kerk woont", "Iemand die twee huizen heeft", "Iemand die tijdelijk bij familie inwoont na een verhuizing"],
        correct: "Iemand die ergens woont zonder er thuis te horen, zoals een gast in een vreemd land",
        bijbelplaats: "1 Petrus 2:11"
    },
    {
        vraag: "Petrus schrijft dat bij God duizend jaar is als één dag. Wat wil hij daarmee zeggen?",
        antwoorden: ["God rekent de tijd anders dan wij; wat lang duurt voor ons, is dat niet voor hem", "God heeft duizend jaar nodig om iets te doen", "Elke dag telt bij God duizend keer mee", "De wereld bestaat precies duizend jaar"],
        correct: "God rekent de tijd anders dan wij; wat lang duurt voor ons, is dat niet voor hem",
        bijbelplaats: "2 Petrus 3:8"
    }
);

vragenData["Timoteüs & Titus"].beginner.push(
    {
        vraag: "Paulus schrijft dat de liefde voor geld de wortel is van alle kwaad. Waarom kiest hij het woord \"wortel\"?",
        antwoorden: ["Uit een wortel groeit alles wat erboven zit — zo groeit uit geldzucht van alles verkeerds", "Een wortel zit in de grond en is dus vies", "Een wortel is het kleinste deel van een plant", "Een wortel is eetbaar en dus verleidelijk"],
        correct: "Uit een wortel groeit alles wat erboven zit — zo groeit uit geldzucht van alles verkeerds",
        bijbelplaats: "1 Timoteüs 6:10"
    },
    {
        vraag: "Paulus schrijft: ik heb de goede strijd gestreden, ik heb de wedloop volbracht. Waar haalt hij dat beeld vandaan?",
        antwoorden: ["Uit de sport: hardlopen en worstelen bij de wedstrijden van die tijd", "Uit het leger, waar hij zelf gediend had", "Uit de landbouw, waar hij als jongen werkte", "Uit de rechtszaal, waar hij vaak had gestaan"],
        correct: "Uit de sport: hardlopen en worstelen bij de wedstrijden van die tijd",
        bijbelplaats: "2 Timoteüs 4:7"
    },
    {
        vraag: "Paulus schrijft aan Timoteüs: laat niemand op je neerkijken omdat je jong bent. Wat zegt dat over Timoteüs?",
        antwoorden: ["Hij had een taak gekregen die mensen meestal pas op oudere leeftijd kregen", "Hij was nog een kind en mocht niet meedoen", "Hij was pas net gelovig geworden", "Hij was jonger dan alle andere gelovigen"],
        correct: "Hij had een taak gekregen die mensen meestal pas op oudere leeftijd kregen",
        bijbelplaats: "1 Timoteüs 4:12"
    }
);

vragenData["Openbaring"].beginner.push(
    {
        vraag: "Johannes schrijft dat hij op het eiland Patmos was. Waarom zat hij daar?",
        antwoorden: ["Hij was er verbannen vanwege zijn geloof, ver van de gemeenten die hij kende", "Hij was er op vakantie om uit te rusten", "Hij was er geboren en teruggekeerd", "Hij was er heen gevlucht voor een storm op zee"],
        correct: "Hij was er verbannen vanwege zijn geloof, ver van de gemeenten die hij kende",
        bijbelplaats: "Openbaring 1:9",
        uitleg: "Patmos is een klein, rotsachtig eiland voor de kust van het huidige Turkije. De Romeinen gebruikten zulke eilanden als ballingsoord: je werd er niet opgesloten, maar je mocht er niet weg. Johannes schrijft zelf dat hij daar was \"vanwege het woord van God en het getuigenis van Jezus\" — hij zat er dus om wat hij verkondigde. Volgens oude kerkelijke overlevering gebeurde dat onder keizer Domitianus, rond het jaar 95. Juist vanaf dat afgelegen eiland schrijft hij brieven aan zeven gemeenten op het vasteland, die hij niet meer kon bezoeken."
    },
    {
        vraag: "Jezus belooft: wie trouw blijft tot de dood, krijgt de kroon van het leven. Wat voor kroon bedoelt hij?",
        antwoorden: ["De krans die de winnaar van een wedstrijd op zijn hoofd kreeg", "De gouden kroon van een koning", "De doornenkroon die Jezus zelf droeg", "Een kroon van zilver, zoals de priesters droegen"],
        correct: "De krans die de winnaar van een wedstrijd op zijn hoofd kreeg",
        bijbelplaats: "Openbaring 2:10"
    },
    {
        vraag: "Johannes ziet een boekrol die met zeven zegels is dichtgemaakt. Waarvoor gebruikte men een zegel?",
        antwoorden: ["Om iets dicht te houden, zodat je kon zien of iemand het geopend had", "Om te tonen hoe duur een boekrol was", "Om de bladzijden bij elkaar te houden", "Om het papier tegen vocht te beschermen"],
        correct: "Om iets dicht te houden, zodat je kon zien of iemand het geopend had",
        bijbelplaats: "Openbaring 5:1"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 11:
// trouwen, gastvrijheid en godsdienstige gebruiken)
// =====================================================================
vragenData["Matteüs"].expert.push(
    {
        vraag: "Jozef wilde Maria \"in stilte verlaten\" toen bleek dat zij zwanger was. Waarom was dat nodig, terwijl ze nog niet getrouwd waren?",
        antwoorden: ["Een verloving was al juridisch bindend; verbreken kon alleen met een officiële scheidbrief", "Hij had haar bruidsschat al betaald en die moest hij terugvragen", "Ze woonden al samen, dus hij moest verhuizen", "Alleen een priester mocht een verloving beëindigen"],
        correct: "Een verloving was al juridisch bindend; verbreken kon alleen met een officiële scheidbrief",
        bijbelplaats: "Matteüs 1:19",
        uitleg: "Trouwen ging in twee stappen. Eerst de verloving, waarbij de afspraak juridisch werd vastgelegd — vanaf dat moment heette je al man en vrouw en kon je alleen nog uit elkaar met een scheidbrief. Pas een jaar later haalde de bruidegom zijn bruid op en begon het feest en het samenwonen. Jozef en Maria zaten dus in die tussenperiode. Dat verklaart waarom Matteüs Jozef \"haar man\" noemt terwijl het huwelijk nog niet voltrokken was."
    },
    {
        vraag: "Jezus hekelt leiders die zeggen: zweren bij de tempel telt niet, maar zweren bij het goud van de tempel wel. Wat was daar mis mee?",
        antwoorden: ["Zo maakten zij van een eed een spel met regels, terwijl je gewoon de waarheid hoort te spreken", "Zweren was helemaal verboden en zij deden het toch", "Zij zwoeren bij goud, en dat was afgoderij", "Alleen priesters mochten een eed afleggen"],
        correct: "Zo maakten zij van een eed een spel met regels, terwijl je gewoon de waarheid hoort te spreken",
        bijbelplaats: "Matteüs 23:16"
    },
    {
        vraag: "De tien meisjes wachtten 's nachts tot de roep klonk: de bruidegom komt! Waarom een bruidegom lang op zich kon laten wachten, vertelt de gelijkenis niet — maar wat weten we wel over hoe een bruiloft begon?",
        antwoorden: ["De bruidegom haalde zijn bruid pas op als alles met haar familie geregeld was, en dat kon uitlopen", "Hij moest eerst de hele dag werken op het land", "Bruiloften begonnen altijd na middernacht", "Hij kwam van ver en reisde alleen 's nachts vanwege de hitte"],
        correct: "De bruidegom haalde zijn bruid pas op als alles met haar familie geregeld was, en dat kon uitlopen",
        bijbelplaats: "Matteüs 25:6"
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "Op de bruiloft in Kana proefde de \"ceremoniemeester\" de wijn. Wat was zijn taak?",
        antwoorden: ["Hij leidde het feest en zag toe op het eten en drinken", "Hij sprak de zegen uit over het bruidspaar", "Hij hield bij welke gasten een geschenk hadden meegebracht", "Hij speelde muziek en leidde de dansen"],
        correct: "Hij leidde het feest en zag toe op het eten en drinken",
        bijbelplaats: "Johannes 2:9"
    }
);

vragenData["Marcus"].advanced.push(
    {
        vraag: "De farizeeën verweten de leerlingen dat zij met ongewassen handen aten. Waar ging dat om?",
        antwoorden: ["Om een religieus gebruik van reiniging, niet om hygiëne", "Om vieze handen na het werk op het land", "Om een regel van de Romeinse bezetter", "Om een afspraak die alleen in de tempel gold"],
        correct: "Om een religieus gebruik van reiniging, niet om hygiëne",
        bijbelplaats: "Marcus 7:3"
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "De farizeeër in de gelijkenis zegt dat hij twee keer per week vast. Wat vroeg de wet eigenlijk?",
        antwoorden: ["Eén vastendag per jaar, op Grote Verzoendag", "Elke week één dag, op de sabbat", "Vasten tijdens de hele veertig dagen voor Pesach", "De wet zei er niets over"],
        correct: "Eén vastendag per jaar, op Grote Verzoendag",
        bijbelplaats: "Lucas 18:12"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (reeks 10:
// ambachten, dieren en het meer van Galilea)
// =====================================================================
vragenData["Marcus"].advanced.push(
    {
        vraag: "De mensen noemen Jezus \"de timmerman\". Wat maakte een timmerman in die tijd vooral?",
        antwoorden: ["Deuren, balken, ploegen en jukken voor de ossen — alles van hout in dorp en huis", "Alleen meubels voor rijke families in de stad", "Vooral boten, want het meer was dichtbij", "Beelden en versieringen voor de tempel"],
        correct: "Deuren, balken, ploegen en jukken voor de ossen — alles van hout in dorp en huis",
        bijbelplaats: "Marcus 6:3"
    },
    {
        vraag: "Jezus zegt dat een kameel makkelijker door het oog van een naald gaat dan een rijke het koninkrijk binnen. Waarom koos hij juist die twee?",
        antwoorden: ["De kameel was het grootste dier dat men in dat gebied kende, en het naaldoog de kleinste opening", "De kameel was een onrein dier en de naald een heilig voorwerp", "Kamelen waren duur, dus alleen rijken hadden er een", "In de stadsmuur zat een lage poort die \"het naaldoog\" heette"],
        correct: "De kameel was het grootste dier dat men in dat gebied kende, en het naaldoog de kleinste opening",
        bijbelplaats: "Marcus 10:25"
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "Tijdens de storm lag Jezus achterin de boot te slapen op een kussen. Wat was dat voor plek?",
        antwoorden: ["Het verhoogde achterdek, waar de stuurman zat en waar een kussen lag om op te zitten", "De ruimte onder het dek, waar de lading werd bewaard", "Een hangmat die tussen de masten was gespannen", "De voorplecht, waar het droogst was"],
        correct: "Het verhoogde achterdek, waar de stuurman zat en waar een kussen lag om op te zitten",
        bijbelplaats: "Marcus 4:38",
        uitleg: "Een vissersboot op het meer van Galilea was zo'n acht meter lang, met een klein verhoogd dek achterin. Daar zat de stuurman, en daar lag een leren kussen om op te zitten of tegenaan te leunen. Marcus is de enige evangelist die dat kussen noemt. Volgens oude kerkelijke overlevering schreef hij op wat Petrus vertelde — en Petrus was die nacht wél in de boot."
    },
    {
        vraag: "Op het meer van Galilea stak plotseling een zware storm op. Hoe kon dat zo snel gaan?",
        antwoorden: ["Het meer ligt diep tussen de heuvels, en koude wind valt daar ineens naar beneden", "Er lopen warme bronnen onder het meer die het water doen koken", "Het meer staat in verbinding met de zee, waardoor er vloedgolven komen", "De storm kwam altijd rond dezelfde tijd van het jaar"],
        correct: "Het meer ligt diep tussen de heuvels, en koude wind valt daar ineens naar beneden",
        bijbelplaats: "Marcus 4:37",
        uitleg: "Het meer van Galilea ligt ruim tweehonderd meter onder zeeniveau, in een kom tussen hoge heuvels. Boven het water hangt warme lucht. Komt er over de bergen koude lucht aan, dan zakt die naar beneden — koude lucht is zwaarder — en duwt de warme lucht omhoog. Precies zo ontstaan bij ons onweersbuien als een koufront over warme lucht schuift. In die smalle kom gaat het alleen veel sneller: binnen een half uur kan een spiegelglad meer veranderen in golven van meer dan een meter."
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "Toen Jezus de vissers zag, waren zij hun netten aan het spoelen. Waarom deden zij dat?",
        antwoorden: ["Om wier, slib en schelpen eruit te halen, anders zag de vis het net", "Om ze te wassen voordat ze thuis te drogen werden gehangen", "Om te kijken of er nog vis in was blijven zitten", "Om ze zwaarder te maken, zodat ze dieper zonken"],
        correct: "Om wier, slib en schelpen eruit te halen, anders zag de vis het net",
        bijbelplaats: "Lucas 5:2"
    },
    {
        vraag: "Jezus zegt: wie de hand aan de ploeg slaat en omkijkt, is niet geschikt. Waarom is omkijken bij het ploegen een probleem?",
        antwoorden: ["De voor wordt meteen krom, want je duwt de ploeg zonder het te merken opzij", "De ossen slaan op hol als je hen niet aankijkt", "Je verliest het zaad dat je in je andere hand draagt", "Het is verboden om over je schouder te kijken op het land"],
        correct: "De voor wordt meteen krom, want je duwt de ploeg zonder het te merken opzij",
        bijbelplaats: "Lucas 9:62"
    },
    {
        vraag: "Jezus zegt tegen Simon dat de satan hem wil \"zeven als tarwe\". Wat gebeurt er bij het zeven?",
        antwoorden: ["Het graan wordt heen en weer geschud, zodat het kaf en het vuil eruit vallen", "Het graan wordt fijngemalen tussen twee stenen", "Het graan wordt in water gelegd zodat het bederf bovendrijft", "Het graan wordt geteld en in zakken verdeeld"],
        correct: "Het graan wordt heen en weer geschud, zodat het kaf en het vuil eruit vallen",
        bijbelplaats: "Lucas 22:31"
    },
    {
        vraag: "In de gelijkenis zegt iemand dat hij vijf span ossen heeft gekocht. Wat is een span?",
        antwoorden: ["Twee ossen die samen onder één juk trekken", "Een os met een wagen erachter", "De hoeveelheid land die één os op een dag ploegt", "Het touw waarmee een os wordt vastgezet"],
        correct: "Twee ossen die samen onder één juk trekken",
        bijbelplaats: "Lucas 14:19"
    }
);

vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus vertelt over een net dat wordt uitgeworpen en allerlei vissen vangt. Wat voor net was dat?",
        antwoorden: ["Een lang sleepnet dat tussen twee boten door het water werd getrokken", "Een klein rond net dat je vanaf de oever uitwierp", "Een fuik die je 's nachts liet staan", "Een net dat je aan een lange stok voor je uit hield"],
        correct: "Een lang sleepnet dat tussen twee boten door het water werd getrokken",
        bijbelplaats: "Matteüs 13:47"
    },
    {
        vraag: "Van het geld van Judas kochten de priesters \"de akker van de pottenbakker\". Waarom lag daar een akker van een pottenbakker?",
        antwoorden: ["Daar werd klei gegraven, en het uitgeputte land was daarna weinig meer waard", "Daar stonden zijn ovens, ver van de stad vanwege de rook", "Daar verkocht hij zijn potten aan de pelgrims", "Daar werden gebroken potten begraven, want die waren onrein"],
        correct: "Daar werd klei gegraven, en het uitgeputte land was daarna weinig meer waard",
        bijbelplaats: "Matteüs 27:7"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 9:
// huizen, land en geld in de gelijkenissen)
// =====================================================================
vragenData["Marcus"].expert.push(
    {
        vraag: "Vier mannen braken het dak open om een verlamde bij Jezus te brengen. Hoe kon dat zomaar?",
        antwoorden: ["Daken waren plat, van balken met takken en aangestampte leem ertussen", "Daken waren van dunne planken die je opzij kon schuiven", "Er zat altijd een luik in, om lucht binnen te laten", "Het huis was nog in aanbouw en had nog geen echt dak"],
        correct: "Daken waren plat, van balken met takken en aangestampte leem ertussen",
        bijbelplaats: "Marcus 2:4",
        uitleg: "Een gewoon huis had een plat dak van houten balken, met daaroverheen riet, takken en een laag aangestampte leem. Je kwam er via een trap aan de buitenkant, en je gebruikte het dak om te slapen in de zomer of om vruchten te drogen. Zo'n dak openbreken was dus geen sloopwerk, maar het moest daarna wel opnieuw dichtgemaakt worden — Marcus vertelt niet voor niets dat het huis vol stond."
    }
);

vragenData["Matteüs"].expert.push(
    {
        vraag: "In de gelijkenis laat de dienaar zijn medeknecht in de gevangenis zetten tot hij betaalt. Kon dat zomaar?",
        antwoorden: ["Ja, wie zijn schuld niet betaalde kon worden opgesloten tot zijn familie het bedrag bijeenbracht", "Nee, dat was verboden en daarom werd hij zelf gestraft", "Ja, maar alleen bij schulden aan de koning", "Nee, schulden werden altijd na zeven jaar kwijtgescholden"],
        correct: "Ja, wie zijn schuld niet betaalde kon worden opgesloten tot zijn familie het bedrag bijeenbracht",
        bijbelplaats: "Matteüs 18:30"
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "De vrouw bij de put zegt: \"U hebt niet eens een emmer, en de put is diep.\" Waarmee haalde je water uit een put?",
        antwoorden: ["Een leren zak aan een lang touw, die je liet zakken en weer ophaalde", "Een houten bak op een hefboom", "Een koperen ketel die aan een ketting hing", "Een rieten mand met pek aan de binnenkant"],
        correct: "Een leren zak aan een lang touw, die je liet zakken en weer ophaalde",
        bijbelplaats: "Johannes 4:11"
    },
    {
        vraag: "'s Nachts brachten herders hun schapen samen in één kooi met een poortwachter. Hoe vond een herder 's ochtends zijn eigen schapen terug?",
        antwoorden: ["Hij riep, en zijn schapen herkenden zijn stem en kwamen naar hem toe", "Hij had elk schaap een merkteken op de vacht gegeven", "De poortwachter hield bij welk schaap van wie was", "Hij telde ze, want elke herder had er evenveel"],
        correct: "Hij riep, en zijn schapen herkenden zijn stem en kwamen naar hem toe",
        bijbelplaats: "Johannes 10:1-3"
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "De vader geeft zijn teruggekeerde zoon het beste kleed, een ring en sandalen. Wat betekende die ring?",
        antwoorden: ["Gezag in huis: met een zegelring kon je namens de familie zaken doen", "Dat hij verloofd was en snel zou trouwen", "Dat hij de oudste zoon was geworden", "Dat hij zijn schulden had afbetaald"],
        correct: "Gezag in huis: met een zegelring kon je namens de familie zaken doen",
        bijbelplaats: "Lucas 15:22",
        uitleg: "Alle drie de geschenken zeggen iets. Het beste kleed is het eregewaad dat je een gast van aanzien gaf. De zegelring stond voor volmacht: wie hem droeg, kon zijn zegel in zachte zegelwas drukken en zo namens de familie zaken doen. En sandalen hoorden bij wie thuis is — blootsvoets liep je als je rouwde, gevangen was of niets bezat. De zoon had onderweg bedacht dat hij zou vragen om dagloner te mogen worden, iemand die voor loon werkt en verder niets is. Zijn vader laat hem niet uitpraten en geeft hem alles terug wat bij een zoon hoort."
    },
    {
        vraag: "De verloren zoon eindigt als varkenshoeder. Waarom is dat voor een Joodse lezer extra schrijnend?",
        antwoorden: ["Varkens waren onreine dieren, die een Jood niet mocht eten of houden", "Varkenshoeders moesten dag en nacht buiten blijven", "Het was het slechtst betaalde werk dat er bestond", "Alleen kinderen deden dat werk, geen volwassen mannen"],
        correct: "Varkens waren onreine dieren, die een Jood niet mocht eten of houden",
        bijbelplaats: "Lucas 15:15"
    },
    {
        vraag: "De zoon had willen eten van de peulen die de varkens kregen. Wat waren dat?",
        antwoorden: ["De peulen van de johannesbroodboom, hard voer dat men aan vee gaf", "De schillen van gedroogde vijgen", "De doppen van noten die overbleven na het persen", "Restjes brood die van de tafel werden geveegd"],
        correct: "De peulen van de johannesbroodboom, hard voer dat men aan vee gaf",
        bijbelplaats: "Lucas 15:16"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 8:
// tempel, feesten en kleding)
// =====================================================================
vragenData["Matteüs"].expert.push(
    {
        vraag: "Een zieke vrouw raakte \"de zoom van zijn kleed\" aan. Wat zat daar precies?",
        antwoorden: ["Kwastjes die elke Joodse man aan zijn mantel droeg, om aan de geboden te denken", "De gouden rand die alleen leraren mochten dragen", "Een strook met daarop zijn naam geborduurd", "De onderkant van de mantel, die het dichtst bij de grond hing"],
        correct: "Kwastjes die elke Joodse man aan zijn mantel droeg, om aan de geboden te denken",
        bijbelplaats: "Matteüs 9:20",
        uitleg: "In Numeri 15 staat dat het volk kwastjes aan de hoeken van hun kleren moest maken, met een blauwe draad erin. Ze waren bedoeld als geheugensteun: zie je ze, dan denk je aan Gods geboden. Jezus droeg ze dus gewoon, zoals iedere Joodse man. Later verwijt hij sommige leiders dat ze hun kwastjes extra lang maken — hetzelfde verwijt als bij de brede gebedsriemen: goed bedoeld, maar bedoeld om gezien te worden."
    },
    {
        vraag: "Jezus verwijst naar David, die de \"toonbroden\" at. Wat waren dat?",
        antwoorden: ["Twaalf broden die in het heiligdom lagen, alleen bestemd voor de priesters", "De broden die bij een offer werden verbrand", "Broden die aan de armen bij de tempelpoort werden uitgedeeld", "Het brood dat bij het Joodse paasfeest Pesach op tafel kwam"],
        correct: "Twaalf broden die in het heiligdom lagen, alleen bestemd voor de priesters",
        bijbelplaats: "Matteüs 12:4"
    },
    {
        vraag: "De vijf onverstandige meisjes namen geen olie mee voor hun lampen. Wat voor olie was dat?",
        antwoorden: ["Olijfolie, die je in een schaaltje goot waarin een pit brandde", "Dierlijk vet dat men smolt boven het vuur", "Kostbare parfumolie uit het oosten", "Aardolie die men uit de bodem bij de Dode Zee haalde"],
        correct: "Olijfolie, die je in een schaaltje goot waarin een pit brandde",
        bijbelplaats: "Matteüs 25:3"
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "In de tempel joeg Jezus de geldwisselaars weg. Wat deden die daar?",
        antwoorden: ["Zij wisselden Romeins geld om, want de tempelbelasting mocht niet met keizersmunten betaald worden", "Zij leenden geld uit aan pelgrims die te weinig hadden meegenomen", "Zij bewaarden het geld van rijke families in de tempelkluis", "Zij telden de opbrengst van de offerdieren"],
        correct: "Zij wisselden Romeins geld om, want de tempelbelasting mocht niet met keizersmunten betaald worden",
        bijbelplaats: "Marcus 11:15"
    },
    {
        vraag: "Jezus zegt dat de tempel een huis van gebed moet zijn voor alle volken. In welk deel van de tempel stonden de handelaars?",
        antwoorden: ["In het buitenste plein, het enige deel waar niet-Joden mochten komen", "In het heiligdom zelf, vlak bij het altaar", "In de zuilengang van de hogepriester", "Op het dak, waar veel ruimte was"],
        correct: "In het buitenste plein, het enige deel waar niet-Joden mochten komen",
        bijbelplaats: "Marcus 11:17"
    }
);

vragenData["Handelingen"].expert.push(
    {
        vraag: "Pinksteren heette bij de Joden het Wekenfeest. Waarom die naam?",
        antwoorden: ["Het viel zeven weken na Pesach, aan het eind van de graanoogst", "Het duurde zeven weken achter elkaar", "Men vastte er zeven weken op vooruit", "Het werd elke zeven weken opnieuw gevierd"],
        correct: "Het viel zeven weken na Pesach, aan het eind van de graanoogst",
        bijbelplaats: "Handelingen 2:1",
        uitleg: "Het Wekenfeest viel vijftig dagen na Pesach — het Griekse woord voor vijftigste is pentèkostè, en daar komt ons woord Pinksteren vandaan. Het was een oogstfeest: men bracht de eerste broden van de nieuwe tarwe naar de tempel. Juist daarom was Jeruzalem die dag vol pelgrims uit alle windstreken, en dat verklaart waarom er zoveel talen te horen waren."
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "Jezus zegt dat de wijnbouwer elke rank die vrucht draagt, snoeit. Waarom doet een wijnbouwer dat?",
        antwoorden: ["Zodat de kracht van de plant naar minder ranken gaat en die meer druiven geven", "Om de plant kleiner te houden zodat hij in de rij past", "Om het hout te gebruiken als brandstof in de winter", "Om te zien welke ranken ziek zijn geworden"],
        correct: "Zodat de kracht van de plant naar minder ranken gaat en die meer druiven geven",
        bijbelplaats: "Johannes 15:2"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 7:
// gebruiken aan tafel, bij rouw en op het land)
// =====================================================================
vragenData["Johannes"].expert.push(
    {
        vraag: "Bij de maaltijd wordt gezegd dat een leerling \"aanlag\" tegen Jezus. Hoe zat men aan tafel?",
        antwoorden: ["Half liggend op kussens rond een lage tafel, steunend op één elleboog", "Rechtop op houten stoelen aan een hoge tafel", "Gehurkt op de vloer, zonder tafel", "Staand, want een maaltijd duurde kort"],
        correct: "Half liggend op kussens rond een lage tafel, steunend op één elleboog",
        bijbelplaats: "Johannes 13:23",
        uitleg: "Bij een gewone maaltijd zat men, maar bij een feestmaal lag men aan — een gewoonte die de Grieken en Romeinen hadden meegebracht. Je lag op je linkerzij op een bank, met je hoofd naar de tafel en je voeten naar buiten. Daardoor had je hoofd vlak bij de borst van je buurman. Dat maakt twee dingen begrijpelijk: dat Johannes tegen Jezus aan kon leunen, en dat een vrouw ongemerkt bij Jezus' voeten kon komen zonder onder de tafel te kruipen."
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "Een vrouw zegt tegen Jezus dat zelfs de hondjes onder de tafel de kruimels eten. Wat bedoelde ze daarmee?",
        antwoorden: ["Ook wie niet aan tafel zit, mag iets van de overvloed krijgen", "Honden waren heilige dieren en mochten meeëten", "Ze had zelf honger en vroeg om eten", "Het eten dat viel, was niet meer rein en werd weggegooid"],
        correct: "Ook wie niet aan tafel zit, mag iets van de overvloed krijgen",
        bijbelplaats: "Marcus 7:28"
    },
    {
        vraag: "De hogepriester scheurde zijn kleren toen hij Jezus hoorde. Wat betekende dat gebaar?",
        antwoorden: ["Diepe verontwaardiging of verdriet, zichtbaar voor iedereen", "Dat hij zijn ambt neerlegde en wegging", "Dat hij het te warm had in de rechtszaal", "Dat hij de wet niet langer wilde volgen"],
        correct: "Diepe verontwaardiging of verdriet, zichtbaar voor iedereen",
        bijbelplaats: "Marcus 14:63"
    }
);

vragenData["Matteüs"].expert.push(
    {
        vraag: "Toen Jezus bij het huis van Jaïrus kwam, was diens dochter net gestorven. Er waren fluitspelers en een luidruchtige menigte. Wat deden die daar?",
        antwoorden: ["Zij hoorden bij de rouw: men huurde muzikanten en klaagvrouwen in", "Zij vierden feest omdat het meisje ooit beter zou worden", "Zij oefenden voor de tempeldienst van de volgende dag", "Zij verjoegen met lawaai de dieren van het erf"],
        correct: "Zij hoorden bij de rouw: men huurde muzikanten en klaagvrouwen in",
        bijbelplaats: "Matteüs 9:23",
        uitleg: "Rouwen deed je in het openbaar en met veel geluid. Zelfs de armste familie hoorde bij een sterfgeval minstens twee fluitspelers en één klaagvrouw in te huren; bij rijkere families waren het er veel meer. Stil verdriet kende men niet — luid misbaar was een teken van respect voor de gestorvene. Jezus stuurde hen allemaal weg en zei dat het meisje sliep. De mensen lachten hem uit. Toen nam hij haar hand en stond ze op."
    },
    {
        vraag: "Jezus noemt sommige leiders \"witgepleisterde graven\". Waarom waren graven wit gekalkt?",
        antwoorden: ["Zodat niemand er per ongeluk op stapte en onrein werd", "Zodat de familie het graf makkelijk kon terugvinden", "Omdat wit de kleur van de rouw was", "Omdat kalk het gesteente tegen regen beschermde"],
        correct: "Zodat niemand er per ongeluk op stapte en onrein werd",
        bijbelplaats: "Matteüs 23:27",
        uitleg: "Wie een graf aanraakte, was zeven dagen onrein en kon dan niet meedoen aan de tempeldienst. Daarom werden graven elk voorjaar opnieuw wit gekalkt, vlak voor Pesach, als duizenden pelgrims naar Jeruzalem trokken. Dat witte kalk was dus geen versiering, maar een waarschuwingsbord. En zo bedoelt Jezus het ook: je kunt er van buiten keurig uitzien en toch niet leven zoals God het vraagt."
    }
);

vragenData["Lucas"].expert.push(
    {
        vraag: "Jezus zegt: als men jullie niet ontvangt, schud dan het stof van je voeten. Wat betekende dat?",
        antwoorden: ["Een duidelijk teken: wij laten niets van deze plaats bij ons achterblijven", "Een manier om te tonen dat je moe was van de reis", "Een gebruik om je sandalen te sparen op een lange weg", "Een zegen die je bij het weggaan achterliet"],
        correct: "Een duidelijk teken: wij laten niets van deze plaats bij ons achterblijven",
        bijbelplaats: "Lucas 9:5"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 6:
// beroepen, gewoonten en het schrijven van brieven)
// =====================================================================
vragenData["Handelingen"].expert.push(
    {
        vraag: "Paulus verdiende zijn brood als tentenmaker. Waarvan maakte hij die tenten?",
        antwoorden: ["Van geweven geitenhaar, een stevige stof die water tegenhield", "Van dunne planken die met touw aan elkaar zaten", "Van gedroogde rietmatten uit de moerassen", "Van geverfd linnen dat uit Egypte kwam"],
        correct: "Van geweven geitenhaar, een stevige stof die water tegenhield",
        bijbelplaats: "Handelingen 18:3"
    },
    {
        vraag: "Paulus werd meegenomen naar de Areopagus in Athene. Wat was dat voor plek?",
        antwoorden: ["Een rotsheuvel waar de raad van de stad bijeenkwam", "De grootste tempel van de stad", "De markt waar de kooplieden stonden", "Het theater waar toneelstukken werden opgevoerd"],
        correct: "Een rotsheuvel waar de raad van de stad bijeenkwam",
        bijbelplaats: "Handelingen 17:19",
        uitleg: "De naam betekent \"heuvel van Ares\", de Griekse oorlogsgod — de Romeinen noemden hem Mars, vandaar dat je ook \"Marsheuvel\" leest. De raad die er vergaderde was eeuwenlang het hoogste bestuur van Athene en hield toezicht op wie er in de stad over goden en filosofie sprak. Paulus werd er dus niet gearresteerd, maar uitgenodigd om zijn zaak toe te lichten."
    }
);

vragenData["Marcus"].expert.push(
    {
        vraag: "Aan het kruis kreeg Jezus zure wijn aangeboden op een spons. Wat was dat voor drank?",
        antwoorden: ["Goedkope wijn met water, wat de soldaten zelf dronken tegen de dorst", "Wijn die bedorven was en daarom werd weggegooid", "Wijn uit de tempel, die alleen de priesters mochten drinken", "Een dure wijn die een rijke voorbijganger had meegebracht"],
        correct: "Goedkope wijn met water, wat de soldaten zelf dronken tegen de dorst",
        bijbelplaats: "Marcus 15:36",
        uitleg: "Soldaten dronken posca, verdunde wijn die zuur smaakte maar goed de dorst leste. Het was dus geen pesterij: iemand deelde wat hij zelf bij zich had. Eerder had Jezus wijn met mirre geweigerd — dat was wél bedoeld als verdoving."
    }
);

vragenData["Galaten"].expert.push(
    {
        vraag: "Paulus schrijft: kijk eens met wat grote letters ik jullie eigenhandig schrijf. Waarom is dat bijzonder?",
        antwoorden: ["De rest van de brief was door een schrijver opgeschreven; dit slot schreef Paulus zelf", "Hij was zijn bril kwijt en kon niet kleiner schrijven", "Grote letters betekenden dat de brief voorgelezen moest worden", "Hij had geen inkt meer en moest krassen in het papier"],
        correct: "De rest van de brief was door een schrijver opgeschreven; dit slot schreef Paulus zelf",
        bijbelplaats: "Galaten 6:11"
    }
);

vragenData["Romeinen"].expert.push(
    {
        vraag: "Paulus schrijft: groet elkaar met een heilige kus. Wat was dat?",
        antwoorden: ["De gewone begroeting in die tijd, een kus op de wang", "Een zegen die alleen een oudste mocht geven", "Een kus op de boekrol voor het voorlezen", "Een afscheid dat je alleen bij een sterfbed gaf"],
        correct: "De gewone begroeting in die tijd, een kus op de wang",
        bijbelplaats: "Romeinen 16:16"
    }
);


vragenData["Jakobus"].expert.push(
    {
        vraag: "Jakobus vergelijkt de tong met twee kleine dingen die iets groots sturen. Welke twee zijn dat?",
        antwoorden: ["Het bit in de bek van een paard en het roer van een schip", "De sleutel van een poort en het slot van een kist", "De pen van een schrijver en het zegel van een koning", "De vonk van een vuursteen en de lont van een lamp"],
        correct: "Het bit in de bek van een paard en het roer van een schip",
        bijbelplaats: "Jakobus 3:3-5"
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 5:
// gebruiken, offers en geld rond de tempel)
// =====================================================================
vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus zegt dat je jonge wijn niet in oude zakken doet. Waar waren die \"zakken\" van gemaakt?",
        antwoorden: ["Van dierenhuid, die meerekte als de wijn ging gisten", "Van geweven stof met pek aan de binnenkant", "Van gevlochten riet met een deksel erop", "Van gebakken klei met een nauwe hals"],
        correct: "Van dierenhuid, die meerekte als de wijn ging gisten",
        bijbelplaats: "Matteüs 9:17"
    },
    {
        vraag: "Op een sabbat liepen Jezus en zijn leerlingen door de korenvelden. De leerlingen hadden honger en plukten aren. Wat is een aar?",
        antwoorden: ["De top van de graanhalm, waar de korrels in zitten", "De sikkel waarmee het graan werd afgesneden", "De bundel stro die na het maaien overblijft", "Het smalle pad dat dwars door de akker loopt"],
        correct: "De top van de graanhalm, waar de korrels in zitten",
        bijbelplaats: "Matteüs 12:1"
    }
);



vragenData["Handelingen"].expert.push(
    {
        vraag: "Vier mannen in Jeruzalem hadden een gelofte gedaan. Paulus ging met hen mee naar de tempel en betaalde hun kosten. Wat hoorde er bij het einde van zo'n gelofte?",
        antwoorden: ["Je hoofd kaalscheren en offers brengen in de tempel", "Een jaar lang de stad niet verlaten", "Al je bezit aan de tempel geven", "Zeven dagen vasten in de woestijn"],
        correct: "Je hoofd kaalscheren en offers brengen in de tempel",
        bijbelplaats: "Handelingen 21:23-26",
        uitleg: "Zo'n gelofte staat beschreven in Numeri 6. Wie hem aflegde, zette zich een tijd lang apart voor God: geen wijn, geen druiven, en geen schaar of scheermes over je haar. Aan het einde knipte je je haar af en verbrandde je het bij het offer. Het lange haar was dus zichtbaar bewijs dat je middenin zo'n periode zat."
    },
    {
        vraag: "Cornelius wordt \"godvrezend\" genoemd. Wat waren godvrezenden?",
        antwoorden: ["Niet-Joden die de God van Israël vereerden zonder helemaal Jood te worden", "Joden die extra streng leefden dan de anderen", "Mensen die bang waren voor Gods straf en daarom wegbleven", "Priesters die alleen in de tempel mochten dienen"],
        correct: "Niet-Joden die de God van Israël vereerden zonder helemaal Jood te worden",
        bijbelplaats: "Handelingen 10:2"
    },
    {
        vraag: "Lucas schrijft dat de Olijfberg \"een sabbatsreis\" van Jeruzalem lag. Wat is dat voor afstand?",
        antwoorden: ["Ongeveer een kilometer: zo ver mocht je op sabbat lopen", "Precies één dagreis te voet", "De afstand die een ezel op één dag aflegt", "De afstand van de tempel tot de stadsmuur"],
        correct: "Ongeveer een kilometer: zo ver mocht je op sabbat lopen",
        bijbelplaats: "Handelingen 1:12",
        uitleg: "Op sabbat mocht je niet ver van huis gaan. De schriftgeleerden hadden die regel precies gemaakt: tweeduizend el vanaf de rand van je woonplaats, ongeveer negenhonderd meter. Lucas noemt die afstand niet zomaar — hij laat er zijn lezers mee weten dat de Olijfberg vlak bij Jeruzalem lag, en dat de leerlingen dus gewoon terug konden lopen zonder de sabbat te breken."
    },
    {
        vraag: "In het visioen van Petrus worden dieren \"rein\" of \"onrein\" genoemd. Wat betekende dat?",
        antwoorden: ["Of je het volgens de wet van Mozes wel of niet mocht eten", "Of het dier gewassen was voordat het geslacht werd", "Of het dier gezond of ziek was", "Of het dier jong of oud was"],
        correct: "Of je het volgens de wet van Mozes wel of niet mocht eten",
        bijbelplaats: "Handelingen 10:14",
        uitleg: "In Leviticus 11 staat welke dieren wel en niet gegeten mochten worden. Het ging daarbij niet om vies of schoon, en ook niet om gezond of ongezond — het was een regel die het volk Israël anders maakte dan de volken om hen heen. Rein en onrein gold trouwens niet alleen voor eten. Wie een dode had aangeraakt of ziek was geweest, was ook een tijd onrein en moest wachten voordat hij weer naar de tempel mocht."
    }
);

// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 4)
// =====================================================================
vragenData["Romeinen"].expert.push(
    {
        vraag: "Paulus sluit een zin af met \"Amen\". Dat woord komt uit het Hebreeuws. Wat betekent het?",
        antwoorden: ["Zo is het, het staat vast", "Zo zij het, als het mag", "Wij hopen het", "Tot ziens"],
        correct: "Zo is het, het staat vast",
        bijbelplaats: "Romeinen 1:25"
    },
    {
        vraag: "Paulus schrijft dat gelovigen door God zijn aangenomen als kinderen. In het Romeinse rijk bestond dat ook echt. Wat betekende het als iemand werd aangenomen?",
        antwoorden: ["Hij kreeg dezelfde naam en dezelfde erfenis als een eigen zoon", "Hij mocht in huis wonen, maar erfde niets", "Hij bleef bediende, maar werd beter behandeld", "Hij kreeg een nieuwe naam, maar moest het huis verlaten"],
        correct: "Hij kreeg dezelfde naam en dezelfde erfenis als een eigen zoon",
        bijbelplaats: "Romeinen 8:15"
    }
);


vragenData["Filippenzen"].expert.push(
    {
        vraag: "Filippi was een Romeinse kolonie: de inwoners hadden het Romeinse burgerrecht, terwijl de stad Rome honderden kilometers verderop lag. Met dat beeld schrijft Paulus dat ons burgerschap in de hemel is. Wat wil hij daarmee zeggen?",
        antwoorden: ["Je hoort ergens thuis waar je nog niet woont, en dat bepaalt hoe je hier leeft", "Je moet zo snel mogelijk verhuizen naar de plek waar je thuishoort", "Je hoeft je niets aan te trekken van de stad waarin je woont", "Je bent pas echt burger als je die reis zelf hebt gemaakt"],
        correct: "Je hoort ergens thuis waar je nog niet woont, en dat bepaalt hoe je hier leeft",
        bijbelplaats: "Filippenzen 3:20"
    }
);




// =====================================================================
// Woorden & begrippen uit de bijbeltekst zelf (expert, reeks 3:
// brieven en Openbaring)
// =====================================================================
vragenData["1 & 2 Korintiërs"].expert.push(
    {
        vraag: "Aan het slot van zijn brief schrijft Paulus één woord in het Aramees: \"Maranata\". Wat betekent het?",
        antwoorden: ["Kom, Heer!", "Vrede zij met u", "Wees waakzaam", "God is trouw"],
        correct: "Kom, Heer!",
        bijbelplaats: "1 Korintiërs 16:22"
    },
    {
        vraag: "Paulus schrijft dat God de Geest als onderpand heeft gegeven. Wat is een onderpand?",
        antwoorden: ["Een eerste deel dat je alvast krijgt, als zekerheid dat de rest volgt", "Een geschenk dat je terug moet geven als je het niet goed gebruikt", "Een zegel waarmee een brief werd dichtgemaakt", "Een bewijs dat een schuld helemaal is afbetaald"],
        correct: "Een eerste deel dat je alvast krijgt, als zekerheid dat de rest volgt",
        bijbelplaats: "2 Korintiërs 1:22"
    }
);


vragenData["Filippenzen"].expert.push(
    {
        vraag: "Paulus vergelijkt het geloof met een hardloopwedstrijd en spreekt over de prijs. Wat kreeg de winnaar in die tijd?",
        antwoorden: ["Een krans van bladeren, gevlochten op zijn hoofd", "Een gouden beker gevuld met wijn", "Een zilveren munt uit de stadskas", "Een nieuw stel kleren van de stadsbestuurders"],
        correct: "Een krans van bladeren, gevlochten op zijn hoofd",
        bijbelplaats: "Filippenzen 3:14"
    }
);


vragenData["Timoteüs & Titus"].expert.push(
    {
        vraag: "Paulus vraagt Timoteüs om zijn mantel mee te nemen, en ook de boeken en vooral de perkamenten. Wat is perkament?",
        antwoorden: ["Dun bewerkte dierenhuid om op te schrijven", "Fijn geweven linnen om boeken in te wikkelen", "Dunne houten plankjes met was erop", "Geperst riet uit Egypte"],
        correct: "Dun bewerkte dierenhuid om op te schrijven",
        bijbelplaats: "2 Timoteüs 4:13"
    }
);



vragenData["Efeziërs"].expert.push(
    {
        vraag: "Paulus schrijft dat de gelovigen met de Geest \"verzegeld\" zijn. Wat deed men in die tijd met een zegel?",
        antwoorden: ["Men drukte een merkteken in was, om te tonen van wie iets was", "Men bond een koord om een pak heen zodat het dicht bleef", "Men schreef een naam op de buitenkant van een brief", "Men legde een steen op een document zodat het niet wegwaaide"],
        correct: "Men drukte een merkteken in was, om te tonen van wie iets was",
        bijbelplaats: "Efeziërs 1:13"
    }
);


// =====================================================================
// Woordvragen die van expert naar gevorderd zijn verplaatst.
// Zelfde vragen, alleen een ander niveau: het antwoord volgt uit het
// woord zelf, uit de vraag, of het is bekend bijbelstof.
// =====================================================================
vragenData["Matteüs"].advanced.push(
    {
        vraag: "Jezus zegt: laat geen bazuin voor je uit blazen als je een aalmoes geeft. Wat is een aalmoes?",
        antwoorden: ["Een gift aan iemand die arm is", "Een offer dat je in de tempel bracht", "Een belasting die je aan de Romeinen betaalde", "Een geschenk dat je aan een gast meegaf"],
        correct: "Een gift aan iemand die arm is",
        bijbelplaats: "Matteüs 6:2"
    },
    {
        vraag: "Aan Petrus wordt gevraagd of Jezus de tempelbelasting betaalt. Waar was dat geld voor?",
        antwoorden: ["Voor het onderhoud van de tempel, opgebracht door de Joden zelf", "Voor het leger van de Romeinen in Judea", "Voor de armen die bij de tempelpoort zaten", "Voor de reiskosten van de priesters"],
        correct: "Voor het onderhoud van de tempel, opgebracht door de Joden zelf",
        bijbelplaats: "Matteüs 17:24",
        uitleg: "Elke Joodse man van twintig jaar en ouder betaalde één keer per jaar een halve sikkel voor de tempel. Van dat geld werden de dagelijkse offers betaald, de wierook, de broden die in het heiligdom lagen en het onderhoud van het gebouw. Het was dus geen belasting voor de Romeinen, maar geld dat de Joden zelf bijeenbrachten voor hun eigen tempel."
    }
);

vragenData["Marcus"].advanced.push(
    {
        vraag: "Bij Jezus komt een man die melaats is. Wat betekende het in die tijd om melaats te zijn?",
        antwoorden: ["Je had een ernstige huidziekte en moest buiten het dorp wonen", "Je was blind geboren en moest bedelen langs de kant van de weg", "Je kon niet lopen en moest overal naartoe gedragen worden", "Je had al je bezit verloren en werkte als dagloner op het land"],
        correct: "Je had een ernstige huidziekte en moest buiten het dorp wonen",
        bijbelplaats: "Marcus 1:40"
    },
    {
        vraag: "Als Jezus een dove man geneest, zegt hij \"Effata\". Marcus schrijft de vertaling er meteen bij. Wat betekent het?",
        antwoorden: ["Ga open", "Sta op", "Wees stil", "Kom hier"],
        correct: "Ga open",
        bijbelplaats: "Marcus 7:34"
    },
    {
        vraag: "Toen Jezus stierf, scheurde het voorhangsel van de tempel in tweeën. Wat was het voorhangsel?",
        antwoorden: ["Een groot gordijn dat het allerheiligste deel van de tempel afsloot", "De brede stenen trap die naar de ingang van de tempel omhoogliep", "Het dak boven de binnenplaats waar de mensen samenkwamen", "De poort waardoor alleen priesters naar binnen mochten"],
        correct: "Een groot gordijn dat het allerheiligste deel van de tempel afsloot",
        bijbelplaats: "Marcus 15:38"
    },
    {
        vraag: "In de gelijkenis plant een man een wijngaard, graaft een kuil voor de wijnpers en bouwt een wachttoren. Waarvoor diende die toren?",
        antwoorden: ["Om de wijngaard te bewaken tegen dieven en dieren", "Om de druiven in te drogen na de oogst", "Om van bovenaf te zien of de druiven al rijp waren", "Om de wijn koel te bewaren in de zomer"],
        correct: "Om de wijngaard te bewaken tegen dieven en dieren",
        bijbelplaats: "Marcus 12:1"
    },
    {
        vraag: "De eigenaar verhuurde zijn wijngaard aan pachters en ging op reis. Wat is een pachter?",
        antwoorden: ["Iemand die grond van een ander bewerkt en een deel van de oogst afstaat", "Iemand die de grond koopt en er zelf eigenaar van wordt", "Iemand die als dagloner per dag betaald wordt", "Iemand die het land bewaakt maar er niet op werkt"],
        correct: "Iemand die grond van een ander bewerkt en een deel van de oogst afstaat",
        bijbelplaats: "Marcus 12:1-2"
    },
    {
        vraag: "Jezus spreekt over iemand met een molensteen om zijn hals. Wat is een molensteen?",
        antwoorden: ["Een zware ronde steen om graan mee te malen", "De steen waarmee een graf werd afgesloten", "De steen waarop het altaar was gebouwd", "Een steen die men in de put liet zakken om water te halen"],
        correct: "Een zware ronde steen om graan mee te malen",
        bijbelplaats: "Marcus 9:42"
    },
    {
        vraag: "Pilatus vond geen schuld in Jezus, en toch liet hij hem kruisigen. Waarom deed hij dat volgens Marcus?",
        antwoorden: ["Hij wilde het volk zijn zin geven", "De keizer in Rome had het hem bevolen", "De Romeinse wet liet hem geen keus", "Hij was zelf bang geworden voor Jezus"],
        correct: "Hij wilde het volk zijn zin geven",
        bijbelplaats: "Marcus 15:15"
    }
);

vragenData["Johannes"].advanced.push(
    {
        vraag: "Twee leerlingen noemen Jezus \"Rabbi\". Johannes vertelt er meteen bij wat dat woord betekent. Wat is het?",
        antwoorden: ["Meester", "Redder", "Vriend", "Koning"],
        correct: "Meester",
        bijbelplaats: "Johannes 1:38"
    },
    {
        vraag: "Jezus wast de voeten van zijn leerlingen. Waarom was dat zo opvallend?",
        antwoorden: ["In een huis was dit werk voor de laagste bediende, en hij deed het als hun meester", "Het mocht alleen op de sabbat gebeuren en het was geen sabbat", "Het was een taak van de gastvrouw, niet van een man", "Het gebeurde normaal pas na de maaltijd, niet ervoor"],
        correct: "In een huis was dit werk voor de laagste bediende, en hij deed het als hun meester",
        bijbelplaats: "Johannes 13:5"
    }
);

vragenData["Handelingen"].advanced.push(
    {
        vraag: "Voordat christenen \"christenen\" heetten, sprak men over mensen die bij \"de Weg\" hoorden. Wat werd daarmee bedoeld?",
        antwoorden: ["De eerste naam voor de volgelingen van Jezus", "De pelgrimsroute naar Jeruzalem", "De hoofdstraat waar de gelovigen samenkwamen", "De reis die Paulus naar Damascus maakte"],
        correct: "De eerste naam voor de volgelingen van Jezus",
        bijbelplaats: "Handelingen 9:2"
    }
);

vragenData["Kolossenzen & Filemon"].advanced.push(
    {
        vraag: "Paulus groet \"de gemeente die bij jou aan huis samenkomt\". Waar kwamen de eerste christenen bij elkaar?",
        antwoorden: ["In gewone woonhuizen, want kerkgebouwen bestonden nog niet", "In de tempel van Jeruzalem, elke week opnieuw", "In het theater van de stad, omdat daar ruimte was", "In de bibliotheek van de stad, waar de boekrollen lagen"],
        correct: "In gewone woonhuizen, want kerkgebouwen bestonden nog niet",
        bijbelplaats: "Filemon 2"
    },
    {
        vraag: "Paulus schrijft over Onesimus dat hij meer is dan een slaaf. Wat was iemands positie als slaaf in het Romeinse rijk?",
        antwoorden: ["Hij was eigendom van zijn meester en kon gekocht en verkocht worden", "Hij was een knecht die elk jaar opnieuw zijn loon afsprak", "Hij was een gevangene die na zijn straf weer vrij kwam", "Hij was een leerling die bij zijn meester in huis een vak leerde"],
        correct: "Hij was eigendom van zijn meester en kon gekocht en verkocht worden",
        bijbelplaats: "Filemon 16"
    }
);

vragenData["Lucas"].advanced.push(
    {
        vraag: "De farizeeër in de gelijkenis zegt dat hij tienden geeft van alles wat hij bezit. Wat zijn tienden?",
        antwoorden: ["Een tiende deel van je oogst of inkomen, bestemd voor God en de tempel", "Tien munten die je jaarlijks moest betalen", "De tiende dag van elke maand, die je apart hield", "De tien geboden die je uit je hoofd leerde"],
        correct: "Een tiende deel van je oogst of inkomen, bestemd voor God en de tempel",
        bijbelplaats: "Lucas 18:12",
        uitleg: "Een tiende deel van de oogst was bestemd voor de levieten. Zij verzorgden de dienst in de tempel en hadden als enige stam geen eigen land gekregen, dus dit was hun inkomen. De levieten gaven daar zelf weer een tiende deel van door aan de priesters. Daarnaast was er elke drie jaar een tiende voor de armen, de weduwen, de wezen en de vreemdelingen. De farizeeër uit de gelijkenis ging nog verder dan de wet vroeg: hij gaf van alles een tiende, tot aan de kruiden in zijn tuin toe."
    }
);

vragenData["1 & 2 Korintiërs"].advanced.push(
    {
        vraag: "Paulus noemt Jezus de \"eersteling\" van wie gestorven zijn. Dat woord komt uit de landbouw. Wat is een eersteling?",
        antwoorden: ["De eerste vrucht van de oogst, het bewijs dat de rest eraan komt", "De grootste vrucht van de hele oogst", "De laatste schoof die van het veld werd gehaald", "Het zaad dat je apart houdt voor volgend jaar"],
        correct: "De eerste vrucht van de oogst, het bewijs dat de rest eraan komt",
        bijbelplaats: "1 Korintiërs 15:20"
    }
);

vragenData["Openbaring"].advanced.push(
    {
        vraag: "Wie overwint, krijgt \"verborgen manna\". Wat was manna oorspronkelijk?",
        antwoorden: ["Het brood dat God zijn volk in de woestijn elke ochtend gaf", "Het meel waarvan de priesters de toonbroden bakten", "De honing die men vond in de rotsen bij Sinai", "Het graan dat men bewaarde voor jaren van hongersnood"],
        correct: "Het brood dat God zijn volk in de woestijn elke ochtend gaf",
        bijbelplaats: "Openbaring 2:17"
    },
    {
        vraag: "God noemt zichzelf \"de alfa en de omega\". Waar komen die twee woorden vandaan?",
        antwoorden: ["Het zijn de eerste en de laatste letter van het Griekse alfabet", "Het zijn twee namen voor God uit het Hebreeuws", "Het zijn de namen van de eerste en de laatste engel", "Het zijn twee sterren die het jaar begonnen en eindigden"],
        correct: "Het zijn de eerste en de laatste letter van het Griekse alfabet",
        bijbelplaats: "Openbaring 1:8"
    }
);

vragenData["Hebreeën"].advanced.push(
    {
        vraag: "De schrijver van de brief aan de Hebreeën spreekt over een \"lofoffer\" dat we God brengen. Wat wordt daar geofferd?",
        antwoorden: ["Woorden: het uitspreken en bezingen van Gods naam", "Een lam zonder gebreken op het altaar", "Het eerste deel van het graan uit de oogst", "Een gouden schaal met wierook erin"],
        correct: "Woorden: het uitspreken en bezingen van Gods naam",
        bijbelplaats: "Hebreeën 13:15"
    },
    {
        vraag: "De schrijver van de brief aan de Hebreeën zegt dat zijn lezers nog melk nodig hebben in plaats van vast voedsel. Wat bedoelt hij?",
        antwoorden: ["Ze kennen alleen de eenvoudigste dingen van het geloof en zijn nog niet verder gekomen", "Ze eten te weinig en zijn daardoor te zwak om te reizen", "Ze zijn nog jong van jaren en mogen nog niet meedoen aan de maaltijd", "Ze houden zich aan de spijswetten en eten geen vlees"],
        correct: "Ze kennen alleen de eenvoudigste dingen van het geloof en zijn nog niet verder gekomen",
        bijbelplaats: "Hebreeën 5:12-14"
    }
);

vragenData["Timoteüs & Titus"].advanced.push(
    {
        vraag: "Paulus schrijft dat hij in boeien zit, maar dat Gods woord niet geboeid is. Wat waren boeien?",
        antwoorden: ["IJzeren kettingen om polsen of enkels van een gevangene", "Dikke touwen waarmee schepen werden vastgelegd", "De houten balken van een cel", "De zegels waarmee een gevangenis werd afgesloten"],
        correct: "IJzeren kettingen om polsen of enkels van een gevangene",
        bijbelplaats: "2 Timoteüs 2:9"
    },
    {
        vraag: "Paulus schrijft over wie \"opziener\" wil worden. Wat was dat voor iemand?",
        antwoorden: ["Iemand die leiding gaf aan een gemeente en toezicht hield", "Iemand die bij de stadspoort de wacht hield", "Iemand die de boeken van de gemeente bijhield", "Iemand die de zieken bezocht en eten rondbracht"],
        correct: "Iemand die leiding gaf aan een gemeente en toezicht hield",
        bijbelplaats: "1 Timoteüs 3:1"
    }
);

vragenData["Jakobus"].advanced.push(
    {
        vraag: "Jakobus zegt: de boer wacht geduldig op de vroege en de late regen. Wat bedoelde hij daarmee?",
        antwoorden: ["De regen aan het begin en aan het eind van het groeiseizoen, allebei nodig voor de oogst", "De regen 's ochtends vroeg en die laat in de avond", "De regen van dit jaar en die van volgend jaar", "De eerste regen van een jonge boer en de laatste van een oude boer"],
        correct: "De regen aan het begin en aan het eind van het groeiseizoen, allebei nodig voor de oogst",
        bijbelplaats: "Jakobus 5:7",
        uitleg: "In Israël regent het niet het hele jaar door. De vroege regen valt in oktober en november: pas dan wordt de grond zacht genoeg om te ploegen en te zaaien. Daarna volgt de winter, en in maart en april komt de late regen — precies op tijd om het graan te laten rijpen. Blijft die late regen uit, dan is de hele oogst mislukt. De boer moet dus een half jaar lang geduld hebben."
    }
);


// =====================================================================
// Nog drie woordvragen uit reeks 9 die op gevorderd thuishoren:
// het antwoord volgt uit de vraag zelf.
// =====================================================================
vragenData["Matteüs"].advanced.push(
    {
        vraag: "In de gelijkenis huurt de eigenaar nog arbeiders in \"op het elfde uur\". Wat betekent dat?",
        antwoorden: ["Een uur voor het einde van de werkdag", "Om elf uur 's ochtends, halverwege de dag", "De elfde dag van de maand", "Het elfde uur na middernacht"],
        correct: "Een uur voor het einde van de werkdag",
        bijbelplaats: "Matteüs 20:6-9"
    },
    {
        vraag: "De eigenaar vond mannen werkloos op het marktplein staan. Waarom stonden zij daar?",
        antwoorden: ["Daar wachtten dagloners tot iemand hen voor die dag inhuurde", "Daar werd de belasting geïnd en moesten zij hun beurt afwachten", "Daar deelden de rijken elke ochtend brood uit", "Daar kwamen zij samen om te bidden voor werk"],
        correct: "Daar wachtten dagloners tot iemand hen voor die dag inhuurde",
        bijbelplaats: "Matteüs 20:3"
    }
);

vragenData["Johannes"].advanced.push(
    {
        vraag: "Jezus stelt de goede herder tegenover een huurling. Wat is het verschil?",
        antwoorden: ["Een huurling past op voor geld en vlucht bij gevaar, want de schapen zijn niet van hem", "Een huurling werkt alleen in de zomer, een herder het hele jaar", "Een huurling mag de schapen niet aanraken, een herder wel", "Een huurling hoedt runderen, een herder schapen"],
        correct: "Een huurling past op voor geld en vlucht bij gevaar, want de schapen zijn niet van hem",
        bijbelplaats: "Johannes 10:12"
    }
);

vragenData["Johannes"].advanced.push(
    {
        vraag: "Wat zei Tomas toen hij Jezus na de opstanding zag?",
        antwoorden: ["Mijn Heer en mijn God!", "Het is echt Jezus!", "Vergeef mij", "Ik geloof nu"],
        correct: "Mijn Heer en mijn God!",
        bijbelplaats: "Johannes 20:28"
    },
    {
        vraag: "Wie kwam als eerste bij het graf van Jezus op de eerste dag van de week, volgens Johannes?",
        antwoorden: ["Petrus", "Maria Magdalena", "Johannes", "De twaalf leerlingen"],
        correct: "Maria Magdalena",
        bijbelplaats: "Johannes 20:1"
    }
);

vragenData["Johannes"].expert.push(
    {
        vraag: "Wie kwam er 's nachts in het geheim bij Jezus om met hem te praten?",
        antwoorden: ["Petrus", "Nikodemus", "Jozef van Arimatea", "Lazarus"],
        correct: "Nikodemus",
        bijbelplaats: "Johannes 3:1-2"
    },
    {
        vraag: "Wat dacht Maria Magdalena dat Jezus was toen ze hem na de opstanding bij het graf zag?",
        antwoorden: ["Een engel", "De tuinman", "Een soldaat", "Een vreemde"],
        correct: "De tuinman",
        bijbelplaats: "Johannes 20:15"
    }
);

vragenData["Handelingen"].expert.push(
    {
        vraag: "De zeelieden zochten een haven om te \"overwinteren\". Waarom voer men 's winters niet?",
        antwoorden: ["Stormen en slecht zicht maakten de zee te gevaarlijk; men wachtte tot het voorjaar", "Het water bevroor in die tijd", "De schepen moesten elk jaar opnieuw gebouwd worden", "De havens waren in de winter gesloten voor belasting"],
        correct: "Stormen en slecht zicht maakten de zee te gevaarlijk; men wachtte tot het voorjaar",
        bijbelplaats: "Handelingen 27:12",
        uitleg: "Overwinteren betekende voor zeelieden: het schip in een beschutte haven leggen en daar de hele winter blijven liggen, bemanning en passagiers erbij. Van november tot maart was de Middellandse Zee namelijk gesloten voor de scheepvaart. Schepen voeren op zicht — overdag op de kust, 's nachts op de sterren — en met winterse bewolking zag je geen van beide. Bovendien waren de stormen zwaar. Paulus was als gevangene op weg naar Rome, en die reis liep precies tegen die periode aan. Daar ging het mis: men voer toch door, en het schip verging."
    },
    {
        vraag: "Petrus logeerde in Joppe bij Simon de leerlooier. Wat deed een leerlooier?",
        antwoorden: ["Hij maakte huiden van geslachte dieren tot leer", "Hij verkocht wol op de markt", "Hij maakte schoenen voor de soldaten", "Hij verzorgde de dieren die geofferd werden"],
        correct: "Hij maakte huiden van geslachte dieren tot leer",
        bijbelplaats: "Handelingen 9:43",
        uitleg: "Leerlooien was zwaar werk en het stonk enorm — men gebruikte kalk, urine en hondenmest om het haar van de huid te krijgen. Daarom stond het huis van een leerlooier meestal buiten het dorp, dicht bij zee. Bovendien werkte hij dagelijks met dode dieren, en dat maakte hem volgens de wet onrein. Dat Petrus bij zo iemand logeerde, is dus een detail dat Lucas niet toevallig noemt: vlak daarna krijgt Petrus het visioen over rein en onrein."
    },
    {
        vraag: "Tijdens de storm lieten de zeelieden een peillood zakken. Waarvoor diende dat?",
        antwoorden: ["Om te meten hoe diep het water was en te weten of land dichtbij kwam", "Om het schip vast te leggen aan de bodem", "Om te wegen hoeveel lading er nog aan boord was", "Om de richting van de stroming te bepalen"],
        correct: "Om te meten hoe diep het water was en te weten of land dichtbij kwam",
        bijbelplaats: "Handelingen 27:28"
    }
);

// FIX 1: huidigeVraag en score netjes declareren bovenaan
let huidigeVraag = 0;
let score = 0;

// Onthouden welk boek en welk niveau er gekozen zijn
let gekozenBoek = null;
let gekozenNiveau = null;
let gekozenModus = "boek"; // "boek" = evangelie-quiz, "kist" = schatkist-uitdaging
let oefenModus = false;

// De actieve vragenset (wordt gevuld zodra een niveau is gekozen)
let vragen = [];

// Id van de lopende "ga naar de volgende vraag"-timer (de 2,5s feedbackpauze na
// een antwoord in een meetellende ronde). Bewaard zodat we hem kunnen stoppen
// bij het afbreken van een ronde. null = geen timer actief.
let volgendeTimer = null;

// Onthoudt of er net een antwoord was gegeven toen de speler het stop-venster
// opende; zo kunnen we bij "Doorgaan" de onderbroken doorloop hervatten.
let rondeStopPendingAdvance = false;

// XP is een momentscore per ronde van 10 vragen: begint op 0, loopt op met
// +100 per goed antwoord tot maximaal 1000. Wordt bewust NIET bewaard tussen
// sessies — elke nieuwe ronde/elk nieuw niveau begint weer op 0.
let huidigeXP = 0;
// Vraag-indexen die in de HUIDIGE ronde al beantwoord zijn. Alleen het eerste
// antwoord op een vraag telt mee voor score/XP (zie checkAntwoord); zo levert
// terugbladeren en opnieuw invullen geen extra punten op. Bij elke ronde geleegd.
let beantwoordeVragen = new Set();

// Handle van de lopende requestAnimationFrame voor het optellende XP-tellertje.
// null = geen animatie actief. Wordt geannuleerd voordat een nieuwe start en bij
// het doorschakelen, zodat er nooit twee count-ups tegelijk lopen. Puur
// presentatie — raakt de score-/XP-waarde (huidigeXP) niet aan.
let xpAnimFrame = null;

// Aantal goede antwoorden van de laatst VOLTOOIDE ronde. Bepaalt hoe vol de
// XP-balk op het startscherm staat (één tiende per goed antwoord; 10 = vol).
// Wordt in eindScherm() vastgelegd en bij "nieuw spel" weer op 0 gezet.
let laatsteRondeGoed = 0;

// Eenmalige opschoning: de oude bewaarde XP-waarde (testdata) wissen, zodat
// een kind echt vanaf 0 schildpunten begint. Idempotent — verdere reloads
// hebben geen effect omdat de sleutel daarna niet meer wordt geschreven.
localStorage.removeItem("bijbelQuizXP");

// (De oude eenmalige "prijzenkast opruimen"-opschoning is verwijderd. Die wiste
// niet-geprefixte trofee-/kist-standen en werkte daarmee de profiel-migratie
// tegen — die brengt bestaande voortgang juist behouden onder in een eerste
// profiel. Het opruimen van test-/beginstanden loopt nu volledig via het
// profielensysteem: een vers profiel heeft simpelweg nog geen voortgang.)

// =========================
// TROFEEËN
// =========================

// Volgorde van laag naar hoog — gebruikt voor cycle + voor "nooit downgraden"
const trofeeVolgorde = ["geen", "brons", "zilver", "goud"];

// Welke afbeelding hoort bij welke staat, per evangelie.
// De "geen"-stand gebruikt nu de echte (zilveren) artwork als basis; het donkere
// silhouet ontstaat via de CSS-klasse .schaduw (zie toonTrofee). Zo is er geen
// aparte schaduw-PNG meer nodig.
// Elke trofee haalt al zijn standen (geen/brons/zilver/goud) uit één
// basisafbeelding: de zilveren render. De herkleuring per stand gebeurt puur
// via globale CSS-filters (.trofee.brons/.zilver/.goud) en het silhouet via
// .trofee.schaduw. Geen src-wissel meer per stand, dus de versies kunnen nooit
// t.o.v. elkaar verschuiven.
const trofeeAfbeeldingen = {
    matteus: {
        geen: "images/matteus-zilver.webp",
        brons: "images/matteus-zilver.webp",
        zilver: "images/matteus-zilver.webp",
        goud: "images/matteus-zilver.webp"
    },
    marcus: {
        geen: "images/marcus-zilver.webp",
        brons: "images/marcus-zilver.webp",
        zilver: "images/marcus-zilver.webp",
        goud: "images/marcus-zilver.webp"
    },
    lucas: {
        geen: "images/lucas-zilver.webp",
        brons: "images/lucas-zilver.webp",
        zilver: "images/lucas-zilver.webp",
        goud: "images/lucas-zilver.webp"
    },
    johannes: {
        geen: "images/johannes-zilver.webp",
        brons: "images/johannes-zilver.webp",
        zilver: "images/johannes-zilver.webp",
        goud: "images/johannes-zilver.webp"
    }
};

// Alle bekende boek-sleutels (handig voor "alles tegelijk" loops).
const alleBoekKeys = ["matteus", "marcus", "lucas", "johannes"];

// =========================
// BIJBELSCHATKISTEN
// =========================

// Twee mogelijke toestanden per kist; later koppelen we ze aan vragen/niveaus.
const kistVolgorde = ["vergrendeld", "verdiend"];

// Welke afbeelding hoort bij welke kist-staat.
const kistAfbeeldingen = {
    brons: {
        vergrendeld: "images/kist-brons-schaduw.webp",
        verdiend: "images/kist-brons.webp"
    },
    zilver: {
        vergrendeld: "images/kist-zilver-schaduw.webp",
        verdiend: "images/kist-zilver.webp"
    },
    goud: {
        vergrendeld: "images/kist-goud-schaduw.webp",
        verdiend: "images/kist-goud.webp"
    }
};

const alleKistKeys = ["brons", "zilver", "goud"];

function getKistStatus(kistKey) {
    if (demoNiveau) return "verdiend";       // demo-modus: alles behaald tonen
    const opgeslagen = localStorage.getItem(profielSleutel(`kist_${kistKey}`));
    return kistVolgorde.includes(opgeslagen) ? opgeslagen : "vergrendeld";
}

function setKistStatus(kistKey, status) {
    if (!kistVolgorde.includes(status)) return;
    // Demo-modus: niets opslaan, alleen de weergave verversen.
    if (demoNiveau) {
        toonKist(kistKey);
        return;
    }
    localStorage.setItem(profielSleutel(`kist_${kistKey}`), status);
    toonKist(kistKey);
}

function toonKist(kistKey) {
    const status = getKistStatus(kistKey);
    const img = document.getElementById(`kist-${kistKey}`);
    const afbeeldingen = kistAfbeeldingen[kistKey];

    if (img && afbeeldingen && afbeeldingen[status]) {
        img.src = afbeeldingen[status];
    }
}

// De diamanten kist kent drie staten. Brons/zilver/goud alle drie verdiend
// opent de VRAGENPOOL: de kist wordt klikbaar (.speelbaar) maar blijft een
// donker silhouet (.vergrendeld). Pas na 10/10 in de Verborgen Schat-quiz
// valt het silhouet weg en verschijnt de volle diamant. Die twee dingen staan
// dus los van elkaar: spelen mag eerder dan verschijnen.
function werkVerborgenSchatBij() {
    const img = document.getElementById("kist-diamant");
    if (!img) return;

    img.classList.toggle("speelbaar", magVerborgenSchatSpelen());
    img.classList.toggle("vergrendeld", !isVerborgenSchatOntgrendeld());
}

// De vragenpool van de Verborgen Schat gaat open zodra alle drie de kisten
// verdiend zijn. Los van de vraag of de speler hem al gewonnen heeft.
function magVerborgenSchatSpelen() {
    return alleKistKeys.every(
        (kistKey) => getKistStatus(kistKey) === "verdiend"
    );
}

// Beginner → brons, Gevorderd → zilver, Expert → goud
const niveauNaarTrofee = {
    beginner: "brons",
    advanced: "zilver",
    expert: "goud"
};

// Boeknaam (met diakritisch teken) → korte sleutel voor localStorage / id's
const boekNaarKey = {
    "Matteüs": "matteus",
    "Marcus": "marcus",
    "Lucas": "lucas",
    "Johannes": "johannes",
    "Handelingen": "handelingen",
    "Romeinen": "romeinen",
    "1 & 2 Korintiërs": "korintiers",
    "Galaten": "galaten",
    "Efeziërs": "efeziers",
    "Filippenzen": "filippenzen",
    "Kolossenzen & Filemon": "kolossenzen_filemon",
    "1 & 2 Tessalonicenzen": "tessalonicenzen",
    "Timoteüs & Titus": "timoteus_titus",
    "Hebreeën": "hebreeen",
    "Jakobus": "jakobus",
    "Petrus & Judas": "petrus_judas",
    "Brieven van Johannes": "johannesbrieven",
    "Openbaring": "openbaring"
};

// Alle boeken die schildpunten kunnen opleveren — afgeleid uit boekNaarKey,
// zodat nieuwe boeken automatisch meetellen (één bron van waarheid).
const schildBoekKeys = Object.values(boekNaarKey);

// =========================
// DEMO-MODUS (alleen-kijken)
// Met ?demo=brons, ?demo=zilver of ?demo=goud in de URL toont het spel alle
// trofeeën en kisten als behaald op dat niveau. Het is puur een weergavelaag:
// de lees-functies (getTrofeeNiveau, leesTrofeeStand, getKistStatus) doen
// alsof, en de schrijf-functies (setTrofeeNiveau, setKistStatus) slaan
// niets op — localStorage blijft volledig onaangeroerd. Zonder geldige
// parameter verandert er niets aan het normale gedrag.
// =========================
const demoNiveau = (() => {
    const waarde = new URLSearchParams(window.location.search).get("demo");
    return ["brons", "zilver", "goud"].includes(waarde) ? waarde : null;
})();

function getTrofeeNiveau(boekKey) {
    if (demoNiveau) return demoNiveau;
    const opgeslagen = localStorage.getItem(profielSleutel(`trofee_${boekKey}`));
    return trofeeVolgorde.includes(opgeslagen) ? opgeslagen : "geen";
}

// Werkt het opgeslagen niveau alleen bij als het nieuwe niveau hoger is.
function setTrofeeNiveau(boekKey, nieuwNiveau) {
    // Demo-modus: niets opslaan, alleen de weergave verversen.
    if (demoNiveau) {
        toonTrofee(boekKey);
        return;
    }

    const huidig = getTrofeeNiveau(boekKey);

    if (trofeeVolgorde.indexOf(nieuwNiveau) > trofeeVolgorde.indexOf(huidig)) {
        localStorage.setItem(profielSleutel(`trofee_${boekKey}`), nieuwNiveau);
    }

    toonTrofee(boekKey);
}

// Toont de juiste afbeelding voor een boek op basis van het opgeslagen niveau.
// Bij "geen" (nog niets verdiend) krijgt de trofee de CSS-klasse .schaduw,
// die de zilveren basis-artwork tot een donker silhouet maakt. Zodra er een
// trofee is verdiend (brons/zilver/goud) gaat de klasse eraf en zie je de
// volle gekleurde versie.
function toonTrofee(boekKey) {
    const niveau = getTrofeeNiveau(boekKey);
    const img = document.getElementById(`trofee-${boekKey}`);
    const afbeeldingen = trofeeAfbeeldingen[boekKey];

    if (img && afbeeldingen && afbeeldingen[niveau]) {
        img.src = afbeeldingen[niveau];
        img.classList.toggle("schaduw", niveau === "geen");

        // Niveau-klasse zetten voor de oplopende glans (brons mat, zilver
        // glanzend, goud stralend). Eerst alle drie weghalen, dan de huidige
        // toevoegen; bij "geen" blijft het bij .schaduw zonder niveau-klasse.
        img.classList.remove("brons", "zilver", "goud");
        if (niveau !== "geen") {
            img.classList.add(niveau);
        }
    }
}

// =========================
// NIVEAU-VERGRENDELING (alleen in het spel, niet bij oefenen)
// =========================
//
// De niveaus gaan per evangelieboek opklimmend open op basis van de bestaande
// trofee-waarde (trofee_<boek>). Er wordt niets extra's bijgehouden.
//   Beginner : altijd open.
//   Gevorderd: open zodra er minstens brons is verdiend (Beginner gehaald).
//   Expert   : open zodra er minstens zilver is verdiend (Gevorderd gehaald).
// Omdat "nieuw spel" alle trofeeën op "geen" zet, staat daarna automatisch
// per boek alleen Beginner open.

// Minimale trofee-waarde die een niveau openzet (sleutels = interne niveaunamen).
const niveauDrempel = {
    beginner: "geen",
    advanced: "brons",
    expert: "zilver"
};

// Vriendelijke hint bij een nog vergrendeld niveau.
const niveauSlotHint = {
    advanced: "Verdien eerst brons bij Beginner om Advanced te openen.",
    expert: "Verdien eerst zilver bij Advanced om Expert te openen."
};

// Welke knop-class hoort bij welk niveau (binnen #niveau-scherm).
const niveauKnopClass = {
    beginner: "niveau-beginner",
    advanced: "niveau-advanced",
    expert: "niveau-expert"
};

// Staat de vergrendeling aan voor de huidige niveaukeuze? In het spel: ja.
// Een latere Oefenmodus opent het boek met { vergrendel: false } -> dan staat
// alles open.
let niveauVergrendelingActief = true;

// Is een niveau open voor het opgegeven boek, op basis van de trofee-waarde?
function isNiveauOpen(boekKey, niveau) {
    const huidig = getTrofeeNiveau(boekKey);
    return trofeeVolgorde.indexOf(huidig) >= trofeeVolgorde.indexOf(niveauDrempel[niveau]);
}

// Markeert in het niveau-scherm welke knoppen vergrendeld zijn (class
// .vergrendeld + aria-disabled). Bij uitgeschakelde vergrendeling staat alles
// open. Wist tevens een eventueel zichtbare hint.
function werkNiveauSlotenBij() {
    const boekKey = boekNaarKey[gekozenBoek];

    Object.keys(niveauKnopClass).forEach((niveau) => {
        const knop = document.querySelector(`#niveau-scherm .${niveauKnopClass[niveau]}`);
        if (!knop) return;

        const vergrendeld = niveauVergrendelingActief && boekKey
            ? !isNiveauOpen(boekKey, niveau)
            : false;

        knop.classList.toggle("vergrendeld", vergrendeld);
        knop.setAttribute("aria-disabled", vergrendeld ? "true" : "false");
    });

    const hint = document.getElementById("niveau-hint");
    if (hint) hint.textContent = "";
}

// Toont de vriendelijke hint voor een vergrendeld niveau.
function toonNiveauHint(niveau) {
    const hint = document.getElementById("niveau-hint");
    if (hint) hint.textContent = niveauSlotHint[niveau] || "";
}

// =========================
// SCHILDPUNTEN (blijvende voortgang)
// =========================
//
// Elk boek (matteus / marcus / lucas / johannes) heeft drie niveaus
// (beginner = brons, advanced = zilver, expert = goud). Een speler verdient
// één schildpunt voor een boek+niveau-combinatie ALLEEN als alle tien vragen
// van die ronde goed waren (de volle 1000 XP). Elk niveau telt maximaal
// één keer mee, dus opnieuw spelen van een al gehaald niveau levert niets
// extra op. Maximaal 3 punten per boek × 4 boeken = 12 punten op het schild.
//
// Per boek+niveau wordt in localStorage opgeslagen of het punt al verdiend
// is. Zo blijven de schildpunten behouden tussen sessies.

const niveauKeys = ["beginner", "advanced", "expert"];

function schildKey(boekKey, niveau) {
    return profielSleutel(`schildpunt_${boekKey}_${niveau}`);
}

function isSchildpuntVerdiend(boekKey, niveau) {
    return localStorage.getItem(schildKey(boekKey, niveau)) === "1";
}

function setSchildpuntVerdiend(boekKey, niveau) {
    localStorage.setItem(schildKey(boekKey, niveau), "1");
}

function tellSchildpunten() {
    let totaal = 0;
    schildBoekKeys.forEach((boekKey) => {
        niveauKeys.forEach((niveau) => {
            if (isSchildpuntVerdiend(boekKey, niveau)) totaal++;
        });
    });
    return totaal;
}

// Het getal op het schild = totaal aantal verdiende niveau-punten (0–12).
function updateSchildpuntenWeergave() {
    const el = document.getElementById("level-nummer");
    if (el) el.innerHTML = tellSchildpunten();
}

// =========================
// AVATAR + SPELERNAAM
// =========================
//
// Vier vaste Bijbelfiguren als avatar. De keuze + volledige naam worden in
// localStorage bewaard, zodat ze tussen sessies behouden blijven. Op het
// startscherm tonen we de avatar, de figuurnaam (rechts van het portret) en
// de voornaam van de speler (balk onder de avatar). De volledige naam wordt
// opgeslagen voor later gebruik in de Schatkamer.

const avatarNamen = {
    mozes: "Mozes",
    esther: "Esther",
    judith: "Judith",
    samuel: "Samuel",
    jozef: "Jozef",
    elia: "Elia",
    ruth: "Ruth",
    maria: "Maria"
};

const STANDAARD_AVATAR = "mozes";

// =========================
// PROFIELEN (meerdere spelers op één computer)
// =========================
//
// Elk kind speelt onder een eigen profiel: { id, naam, avatar }. Alle
// voortgang (trofeeën, kisten, schildpunten, verborgen schat) wordt per
// profiel bewaard onder localStorage-sleutels met de prefix speler_<id>_… ,
// zodat kinderen elkaars voortgang nooit overschrijven. Eén register
// (bkq_profielen) somt alle profielen op; bkq_actiefProfiel onthoudt wie het
// laatst speelde. Geluid (apparaatinstelling) en de trofee-afstelmodus
// (dev-tool) blijven bewust GLOBAAL — dus niet per profiel.
const PROFIELEN_KEY = "bkq_profielen";
const ACTIEF_PROFIEL_KEY = "bkq_actiefProfiel";

function leesProfielen() {
    try {
        const lijst = JSON.parse(localStorage.getItem(PROFIELEN_KEY));
        return Array.isArray(lijst) ? lijst : [];
    } catch (e) {
        return [];
    }
}

function bewaarProfielen(lijst) {
    localStorage.setItem(PROFIELEN_KEY, JSON.stringify(lijst));
}

function getActiefProfielId() {
    return localStorage.getItem(ACTIEF_PROFIEL_KEY) || "";
}

function setActiefProfielId(id) {
    localStorage.setItem(ACTIEF_PROFIEL_KEY, id);
}

function getActiefProfiel() {
    const id = getActiefProfielId();
    return leesProfielen().find((p) => p.id === id) || null;
}

// Uniek, verborgen id per profiel. crypto.randomUUID waar beschikbaar; anders
// een tijd+toeval-fallback die voor lokaal gebruik ruim uniek genoeg is.
function nieuwProfielId() {
    if (window.crypto && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }
    return "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// Maakt een profiel aan, voegt het toe aan het register en zet het als actief.
// Retourneert het nieuwe profiel-object.
function maakProfiel(naam, avatar) {
    const profiel = {
        id: nieuwProfielId(),
        naam: (naam || "").trim(),
        avatar: avatarNamen[avatar] ? avatar : STANDAARD_AVATAR
    };
    const lijst = leesProfielen();
    lijst.push(profiel);
    bewaarProfielen(lijst);
    setActiefProfielId(profiel.id);
    return profiel;
}

// Werkt velden (naam/avatar) van het actieve profiel bij in het register.
function updateActiefProfiel(velden) {
    const id = getActiefProfielId();
    const lijst = leesProfielen();
    const p = lijst.find((x) => x.id === id);
    if (!p) return;
    Object.assign(p, velden);
    bewaarProfielen(lijst);
}

// Sleutel voor voortgang van het ACTIEVE profiel. Zonder actief profiel valt
// dit terug op een lege prefix; dat komt alleen voor vlak vóór het eerste
// profiel bestaat en levert dan simpelweg "niets verdiend" op.
function profielSleutel(sleutel) {
    return `speler_${getActiefProfielId()}_${sleutel}`;
}

// Detecteert of er nog oude, niet-geprefixte voortgang in de browser staat —
// gebruikt om te beslissen of we bij de allereerste keer een eerste profiel
// vullen (bestaande browser) of het Nieuw-spel-scherm tonen (verse browser).
function heeftOudeVoortgang() {
    if (localStorage.getItem("bijbelQuizAvatar")) return true;
    if (localStorage.getItem("bijbelQuizSpelerNaam")) return true;
    if (localStorage.getItem("verborgenschat_voltooid")) return true;
    for (const boekKey of schildBoekKeys) {
        if (localStorage.getItem(`trofee_${boekKey}`)) return true;
        for (const niveau of niveauKeys) {
            if (localStorage.getItem(`schildpunt_${boekKey}_${niveau}`)) return true;
        }
    }
    for (const kistKey of alleKistKeys) {
        if (localStorage.getItem(`kist_${kistKey}`)) return true;
    }
    return false;
}

// Eenmalige migratie naar het profielensysteem. Draait alleen zolang er nog
// geen profielenregister is. Bestaande (niet-geprefixte) voortgang + de losse
// avatar/naam worden ondergebracht in een eerste profiel, zodat testvoortgang
// niet verdwijnt. Bij een verse browser (geen oude voortgang) doen we niets —
// dan toont de opstartlogica het Nieuw-spel-scherm om het eerste profiel te
// maken. Idempotent: zodra bkq_profielen bestaat, doet dit niets meer.
function migreerNaarProfielen() {
    if (localStorage.getItem(PROFIELEN_KEY)) return;   // al gemigreerd
    if (!heeftOudeVoortgang()) return;                 // verse browser

    const oudeAvatar = localStorage.getItem("bijbelQuizAvatar");
    const oudeNaam = localStorage.getItem("bijbelQuizSpelerNaam") || "";
    const profiel = {
        id: nieuwProfielId(),
        naam: oudeNaam,
        avatar: avatarNamen[oudeAvatar] ? oudeAvatar : STANDAARD_AVATAR
    };
    bewaarProfielen([profiel]);
    setActiefProfielId(profiel.id);

    // Bestaande voortgang overzetten naar speler_<id>_… (alleen als aanwezig).
    const verhuis = (oudeSleutel) => {
        const waarde = localStorage.getItem(oudeSleutel);
        if (waarde !== null) {
            localStorage.setItem(`speler_${profiel.id}_${oudeSleutel}`, waarde);
            localStorage.removeItem(oudeSleutel);
        }
    };
    schildBoekKeys.forEach((boekKey) => {
        verhuis(`trofee_${boekKey}`);
        niveauKeys.forEach((niveau) => verhuis(`schildpunt_${boekKey}_${niveau}`));
    });
    alleKistKeys.forEach((kistKey) => verhuis(`kist_${kistKey}`));
    verhuis("verborgenschat_voltooid");

    // De losse avatar/naam zijn nu onderdeel van het profiel geworden.
    localStorage.removeItem("bijbelQuizAvatar");
    localStorage.removeItem("bijbelQuizSpelerNaam");
}
migreerNaarProfielen();

// Avatar + naam horen bij het ACTIEVE profiel. Zonder profiel valt de avatar
// terug op de standaard en de naam op leeg (situatie vlak vóór het eerste
// profiel bestaat).
function getGekozenAvatar() {
    const p = getActiefProfiel();
    return p && avatarNamen[p.avatar] ? p.avatar : STANDAARD_AVATAR;
}

function setGekozenAvatar(avatar) {
    if (avatarNamen[avatar]) {
        updateActiefProfiel({ avatar });
    }
}

function getSpelerNaam() {
    const p = getActiefProfiel();
    return p ? (p.naam || "") : "";
}

function setSpelerNaam(naam) {
    updateActiefProfiel({ naam: (naam || "").trim() });
}

// De naam zoals die op het naambordje en in de spelerkiezer verschijnt: de
// VOLLEDIGE ingevoerde naam, inclusief spaties ("Coole Kids" blijft "Coole
// Kids"). Te lange namen worden op het bordje passend gekrompen — nooit
// halverwege een woord afgeknipt.
function getSpelerWeergaveNaam() {
    return getSpelerNaam().trim();
}

function updateAvatarWeergave() {
    const avatar = getGekozenAvatar();

    const img = document.getElementById("avatar-portret");
    if (img) img.src = `images/Avatars/avatar-${avatar}.webp`;

    const figuurnaam = document.getElementById("avatar-figuurnaam");
    if (figuurnaam) figuurnaam.innerHTML = avatarNamen[avatar];

    const voornaamEl = document.getElementById("speler-voornaam");
    if (voornaamEl) {
        voornaamEl.textContent = getSpelerWeergaveNaam();
        pasVoornaamGrootteAan(voornaamEl);
    }
}

// Laat de letters van het speler-naambordje automatisch iets krimpen wanneer
// de naam te lang is voor het (brede) vak, zodat hij altijd binnen de plaat
// blijft passen. De naam mag over twee regels breken; past hij dan nog niet in
// de hoogte, dan verkleinen we de letters. De basisgrootte komt uit style.css
// (--speler-lettergrootte); we verkleinen alleen wanneer het echt nodig is.
function pasVoornaamGrootteAan(el) {
    if (!el) return;
    // We krimpen NIET met een vaste px-waarde: dat zou de vloeiende
    // basisgrootte uit style.css (calc(var(--game-breedte) * 0.01083))
    // overschrijven, waardoor de naam bij kleine vensters weer buiten het vak
    // valt. In plaats daarvan verkleinen we diezelfde vloeiende formule met een
    // factor, zodat de letters bij elke venstergrootte blijven meeschalen.
    const basis = 0.01083;             // = de CSS-basisfactor (brede vak)
    el.style.removeProperty("font-size");           // oude px-overschrijving weg
    el.style.removeProperty("--speler-lettergrootte");  // terug naar CSS-basis
    const minFactor = 0.6;             // ondergrens; brede vak kan veel tekst aan
    let factor = 1;
    // De naam breekt nu over regels (geen nowrap meer), dus te veel tekst uit
    // zich in HOOGTE. Krimp stap voor stap tot alle regels binnen de hoogte van
    // het vak passen.
    while (el.scrollHeight > el.clientHeight && factor > minFactor) {
        factor -= 0.05;
        el.style.setProperty(
            "--speler-lettergrootte",
            `calc(var(--game-breedte) * ${basis} * ${factor.toFixed(2)})`
        );
    }
}

// Tijdelijke selectie binnen het nieuw-spel-keuzescherm; pas op "Start"
// wordt deze opgeslagen en worden de schildpunten gewist.
let gekozenAvatarTijdelijk = null;

function markeerAvatarKeuze(avatar) {
    if (!avatarNamen[avatar]) return;
    gekozenAvatarTijdelijk = avatar;

    document.querySelectorAll(".avatar-keuze-btn").forEach((knop) => {
        knop.classList.toggle("avatar-gekozen", knop.dataset.avatar === avatar);
    });
}

// "Nieuw spel" opent het keuzescherm (avatar + naam + Start/Terug). Pas op
// "Start" worden de schildpunten gewist — zo verliest een per ongeluk
// geopend nieuw spel geen voortgang.
function nieuwSpel() {
    const scherm = document.getElementById("nieuw-spel-scherm");
    if (!scherm) return;

    // Verse start: standaard-avatar geselecteerd en een leeg naamveld, zodat
    // dit scherm een NIEUW profiel maakt en niet de huidige speler voorlaadt.
    markeerAvatarKeuze(STANDAARD_AVATAR);
    const invoer = document.getElementById("speler-naam-invoer");
    if (invoer) invoer.value = "";

    // "of kies een bestaande speler" alleen tonen als er al profielen zijn.
    const bestaandLink = document.getElementById("nieuw-spel-bestaand");
    if (bestaandLink) {
        bestaandLink.style.display = leesProfielen().length > 0 ? "block" : "none";
    }

    scherm.style.display = "flex";
    verbergLevelHud();
}

function bevestigNieuwSpel() {
    const naamInvoer = document.getElementById("speler-naam-invoer");
    const naam = naamInvoer ? naamInvoer.value.trim() : "";
    const avatar = gekozenAvatarTijdelijk || STANDAARD_AVATAR;

    // Een NIEUW profiel aanmaken en meteen actief maken. Een vers profiel heeft
    // nog geen enkele voortgangssleutel, dus alle trofeeën/kisten/schildpunten
    // staan automatisch op de beginstand — er wordt niets van een bestaande
    // speler overschreven of gewist.
    maakProfiel(naam, avatar);

    // Alle weergave overzetten naar het (lege) nieuwe profiel.
    laadProfielWeergave();

    const scherm = document.getElementById("nieuw-spel-scherm");
    if (scherm) scherm.style.display = "none";
    toonLevelHud();
}

function annuleerNieuwSpel() {
    const scherm = document.getElementById("nieuw-spel-scherm");
    if (scherm) scherm.style.display = "none";
    // Bij het allereerste opstarten (nog geen profiel) mag dit scherm niet
    // zomaar weg zonder keuze; dan direct opnieuw tonen zodat er altijd een
    // speler ontstaat.
    if (!getActiefProfiel()) {
        nieuwSpel();
        return;
    }
    toonLevelHud();
}

// Vanuit het Nieuw-spel-scherm doorschakelen naar de spelerkiezer.
function kiesBestaandeSpeler() {
    const scherm = document.getElementById("nieuw-spel-scherm");
    if (scherm) scherm.style.display = "none";
    openSpelerKiezer();
}

// =========================
// SPELERKIEZER — "Wie speelt er?"
// =========================
//
// Herlaadt de volledige startscherm-weergave vanuit het ACTIEVE profiel:
// XP-balk, schildpunten, evangelie-trofeeën, kisten, verborgen schat en de
// avatar/naam linksboven. De NT-kast (scherm 2) leest zijn standen sowieso
// opnieuw bij binnenkomst, dus die volgt vanzelf.
function laadProfielWeergave() {
    laatsteRondeGoed = 0;            // XP-balk is sessie-gebonden, niet bewaard
    updateXPBalk();
    updateSchildpuntenWeergave();
    alleBoekKeys.forEach(toonTrofee);
    alleKistKeys.forEach(toonKist);
    werkVerborgenSchatBij();
    updateAvatarWeergave();
}

// Bewerk-modus van de kiezer: in deze stand betekent een tik op een profiel
// "verwijderen" (met bevestiging) in plaats van "kiezen". Bewust een aparte
// modus achter de Bewerken-knop, zodat niemand per ongeluk verwijdert tijdens
// het gewone kiezen.
let kiezerBewerkModus = false;

// Opent "Wie speelt er?": alle profielen als aanklikbare avatar+naam, plus de
// knoppen "+ nieuw", "Bewerken" en "Terug". Bouwt de lijst live op uit het
// register. behoudModus = true laat de bewerk-modus staan (na een verwijdering);
// standaard (vanuit het profiel of de link) openen we in de gewone kiesstand.
function openSpelerKiezer(behoudModus) {
    const scherm = document.getElementById("speler-kiezer-scherm");
    const lijst = document.getElementById("speler-kiezer-lijst");
    if (!scherm || !lijst) return;

    if (!behoudModus) kiezerBewerkModus = false;

    lijst.innerHTML = "";
    const actiefId = getActiefProfielId();

    leesProfielen().forEach((p) => {
        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "avatar-keuze-btn"
            + (p.id === actiefId && !kiezerBewerkModus ? " avatar-gekozen" : "")
            + (kiezerBewerkModus ? " verwijder-modus" : "");
        knop.addEventListener("click", () => {
            if (kiezerBewerkModus) vraagProfielVerwijderen(p.id);
            else kiesProfiel(p.id);
        });

        const avatar = avatarNamen[p.avatar] ? p.avatar : STANDAARD_AVATAR;
        const img = document.createElement("img");
        img.src = `images/Avatars/avatar-${avatar}.webp`;
        img.alt = p.naam || avatarNamen[avatar];

        const naam = document.createElement("span");
        const naamTekst = (p.naam || "").trim();
        naam.textContent = naamTekst || avatarNamen[avatar];

        knop.appendChild(img);
        knop.appendChild(naam);

        // In bewerk-modus een rood prullenbak-badge op de tegel als teken dat
        // tikken hier verwijdert. De badge vangt zelf geen klik (pointer-events
        // none in CSS); de tegel handelt de klik af.
        if (kiezerBewerkModus) {
            const badge = document.createElement("span");
            badge.className = "verwijder-badge";
            badge.textContent = "🗑";
            badge.setAttribute("aria-hidden", "true");
            knop.appendChild(badge);
        }

        lijst.appendChild(knop);
    });

    // Kop/hint en de knoppen naar de juiste modus zetten.
    const hint = document.getElementById("speler-kiezer-hint");
    if (hint) {
        hint.textContent = kiezerBewerkModus
            ? "Tik op een speler om die te verwijderen"
            : "Kies je speler";
    }
    const bewerkKnop = document.getElementById("speler-kiezer-bewerk");
    if (bewerkKnop) bewerkKnop.textContent = kiezerBewerkModus ? "Klaar" : "✎ Bewerken";
    // "+ nieuw" is in bewerk-modus niet logisch; dan verbergen.
    const nieuwKnop = document.getElementById("speler-kiezer-nieuw");
    if (nieuwKnop) nieuwKnop.style.display = kiezerBewerkModus ? "none" : "block";

    scherm.style.display = "flex";
    verbergLevelHud();
}

// Wisselt tussen kiezen en bewerken (verwijderen). Herbouwt de lijst met behoud
// van de nieuwe modus.
function toggleKiezerBewerken() {
    kiezerBewerkModus = !kiezerBewerkModus;
    openSpelerKiezer(true);
}

// Een bestaand profiel kiezen: actief maken, alle weergave verversen, sluiten.
function kiesProfiel(id) {
    if (!leesProfielen().some((p) => p.id === id)) return;
    setActiefProfielId(id);
    laadProfielWeergave();
    const scherm = document.getElementById("speler-kiezer-scherm");
    if (scherm) scherm.style.display = "none";
    toonLevelHud();
}

function sluitSpelerKiezer() {
    const scherm = document.getElementById("speler-kiezer-scherm");
    if (scherm) scherm.style.display = "none";
    toonLevelHud();
}

// "+ nieuw" in de spelerkiezer: sluit de kiezer en open het Nieuw-spel-scherm.
function nieuwProfielVanuitKiezer() {
    const scherm = document.getElementById("speler-kiezer-scherm");
    if (scherm) scherm.style.display = "none";
    nieuwSpel();
}

// =========================
// SPELER VERWIJDEREN (met bevestiging)
// =========================
//
// Alleen bereikbaar via de bewerk-modus van de kiezer. Toont eerst een
// bevestigingsscherm met de naam erin; pas "Verwijderen" (rood) wist het
// profiel én al zijn voortgang. "Annuleren" (neutraal) doet niets.
let teVerwijderenProfielId = null;

function vraagProfielVerwijderen(id) {
    const p = leesProfielen().find((x) => x.id === id);
    if (!p) return;
    teVerwijderenProfielId = id;

    const naam = (p.naam || "").trim() || avatarNamen[p.avatar] || "deze speler";
    const tekst = document.getElementById("verwijder-speler-tekst");
    if (tekst) {
        tekst.textContent = `Weet je zeker dat je ${naam} wilt verwijderen? `
            + `Alle trofeeën van ${naam} gaan dan weg.`;
    }
    const scherm = document.getElementById("verwijder-speler-scherm");
    if (scherm) scherm.style.display = "flex";
}

function annuleerProfielVerwijderen() {
    teVerwijderenProfielId = null;
    const scherm = document.getElementById("verwijder-speler-scherm");
    if (scherm) scherm.style.display = "none";
}

function bevestigProfielVerwijderen() {
    const id = teVerwijderenProfielId;
    teVerwijderenProfielId = null;
    const dialoog = document.getElementById("verwijder-speler-scherm");
    if (dialoog) dialoog.style.display = "none";
    if (!id) return;

    // Alle voortgang-sleutels van dit profiel wissen (speler_<id>_…).
    const prefix = `speler_${id}_`;
    const teWissen = [];
    for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.indexOf(prefix) === 0) teWissen.push(k);
    }
    teWissen.forEach((k) => localStorage.removeItem(k));

    // Uit het register verwijderen.
    const lijst = leesProfielen().filter((p) => p.id !== id);
    bewaarProfielen(lijst);

    // Was dit de actieve speler? Dan overschakelen naar een andere (of geen)
    // en de startscherm-weergave meteen bijwerken.
    if (getActiefProfielId() === id) {
        if (lijst.length > 0) {
            setActiefProfielId(lijst[0].id);
            laadProfielWeergave();
        } else {
            setActiefProfielId("");
        }
    }

    if (lijst.length === 0) {
        // Geen spelers meer over → kiezer sluiten en een nieuw profiel laten
        // aanmaken, zodat er altijd een speler ontstaat.
        kiezerBewerkModus = false;
        const kiezer = document.getElementById("speler-kiezer-scherm");
        if (kiezer) kiezer.style.display = "none";
        nieuwSpel();
    } else {
        // Kiezer opnieuw opbouwen; in bewerk-modus blijven zodat je desgewenst
        // meer spelers kunt opruimen.
        openSpelerKiezer(true);
    }
}

// Opstart: is er een actief profiel, dan direct het startscherm met dat
// profiel. Is er nog geen enkel profiel (verse browser), dan het Nieuw-spel-
// scherm om er een aan te maken.
function initProfielOpstart() {
    if (getActiefProfiel()) {
        laadProfielWeergave();
    } else {
        nieuwSpel();
    }
}

function verbergLevelHud() {
    const levelHud = document.getElementById("level-hud");
    if (levelHud) {
        levelHud.style.display = "none";
    }
}

function toonLevelHud() {
    const levelHud = document.getElementById("level-hud");
    if (levelHud) {
        levelHud.style.display = "block";
    }
}

// Klik op een boek -> eerst het niveaukeuze-scherm tonen (nog niet de quiz).
// In het spel is { vergrendel: true } (standaard): niveaus gaan opklimmend open
// op basis van de trofee-waarde. Een latere Oefenmodus roept dit aan met
// { vergrendel: false } zodat alle niveaus open staan.
function openBoek(boekNaam, { vergrendel = true, oefen = false } = {}) {
    oefenModus = oefen;
    gekozenBoek = boekNaam;
    niveauVergrendelingActief = vergrendel;

    const niveauScherm = document.getElementById("niveau-scherm");
    const niveauTitel = document.getElementById("niveau-boek-titel");

    if (niveauTitel) {
        niveauTitel.innerHTML = boekNaam;
    }

    // Sloten bijwerken vóór het tonen, zodat het scherm meteen klopt.
    werkNiveauSlotenBij();

    niveauScherm.style.display = "flex";

    // HUD verbergen tijdens de niveaukeuze
    verbergLevelHud();
}

// Pakt willekeurig maximaal `aantal` vragen uit een pool, zonder de
// oorspronkelijke vragenData te wijzigen. Husselt een kopie (Fisher-Yates)
// en pakt er dan `aantal` uit, waarbij dezelfde vraagtekst nooit twee keer
// wordt gekozen. In de schatkist-modus voegt alleVragenVoorNiveau() alle
// boeken samen, en sommige boeken delen bewust een vraag (bijv. dezelfde
// vraag terecht in zowel Matteüs als Marcus). Zonder deze filter zou zo'n
// vraag dubbel in één quiz kunnen belanden. Is de pool na ontdubbelen kleiner
// dan `aantal`, dan komen alle unieke vragen terug, in willekeurige volgorde.
function kiesWillekeurigeVragen(pool, aantal) {
    const kopie = [...pool];
    for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    const gekozen = [];
    const gezien = new Set();
    for (const vraag of kopie) {
        if (gezien.has(vraag.vraag)) continue;
        gezien.add(vraag.vraag);
        gekozen.push(vraag);
        if (gekozen.length === aantal) break;
    }
    return gekozen;
}

// Keuze van een niveau -> hier start pas de echte quiz
function kiesNiveau(niveau) {
    // In het spel: een nog vergrendeld niveau start niet, maar toont een hint.
    const boekKey = boekNaarKey[gekozenBoek];
    if (niveauVergrendelingActief && boekKey && !isNiveauOpen(boekKey, niveau)) {
        toonNiveauHint(niveau);
        return;
    }

    gekozenNiveau = niveau;
    gekozenModus = "boek";
    // Gewone quiz: 10 willekeurige vragen uit de pool. Oefenmodus: ALLE vragen
    // van dit boek+niveau, zodat een kind een lastige set helemaal kan doorwerken
    // (bijv. Lucas expert). kiesWillekeurigeVragen ontdubbelt en husselt; door de
    // poollengte als aantal mee te geven, komen in oefenmodus alle unieke vragen
    // in willekeurige volgorde terug. Elk met gehusselde antwoordopties (het juiste
    // antwoord wordt op tekstwaarde herkend, dus husselen blijft veilig). Map naar
    // nieuwe objecten zodat vragenData niet gemuteerd wordt.
    const oefenPool = vragenData[gekozenBoek][niveau];
    const aantalVragen = oefenModus ? oefenPool.length : 10;
    vragen = kiesWillekeurigeVragen(oefenPool, aantalVragen).map((v) => ({
        ...v,
        antwoorden: husselArray(v.antwoorden)
    }));

    // Niveaukeuze sluiten
    document.getElementById("niveau-scherm").style.display = "none";

    // Quiz openen
    const quizScherm = document.getElementById("quiz-scherm");
    quizScherm.style.display = "flex";

    // Titel toont "Boek – Niveau", bijv. "Matteüs – Beginner"
    const quizTitle = document.getElementById("quiz-title");
    if (quizTitle) {
        quizTitle.innerHTML = `${gekozenBoek} – ${niveauLabels[niveau]}`;
    }

    // HUD verbergen tijdens de quiz
    verbergLevelHud();

    huidigeVraag = 0;
    score = 0;
    huidigeXP = 0;
    beantwoordeVragen.clear();

    updateXPBalk();
    laadVraag();
}

// =========================================================================
// DE METGEZELLEN — losse pool met bewust extreem moeilijke naamvragen.
// Staat OPZETTELIJK buiten vragenData: alleVragenVoorNiveau() loopt over
// vragenData en zou deze vragen anders naar de schatkisten laten lekken.
// Nog niet aan de UI gekoppeld; wacht op de Hemeltrap-ruimte.
// =========================================================================
const metgezellenVragen = [
    {
        vraag: "De brief aan Filemon gaat over een man die was weggelopen bij zijn meester. Hoe heette hij?",
        antwoorden: ["Onesimus", "Epafroditus", "Tychikus", "Demas"],
        correct: "Onesimus",
        bijbelplaats: "Filemon 10"
    },
    {
        vraag: "Welke trouwe medewerker zou de Kolossenzen al het nieuws over Paulus komen vertellen?",
        antwoorden: ["Tychikus", "Onesimus", "Lukas", "Demas"],
        correct: "Tychikus",
        bijbelplaats: "Kolossenzen 4:7"
    },
    {
        vraag: "Aan het einde vraagt Paulus aandacht voor één medewerker die zijn taak nog moet \"afmaken\". Hoe heet hij?",
        antwoorden: ["Archippus", "Onesimus", "Tychikus", "Epafras"],
        correct: "Archippus",
        bijbelplaats: "Kolossenzen 4:17"
    },
    {
        vraag: "Paulus noemt een medewerker die \"samen met hem gevangenzit\". Wie?",
        antwoorden: ["Aristarchus", "Lukas", "Tychikus", "Onesimus"],
        correct: "Aristarchus",
        bijbelplaats: "Kolossenzen 4:10"
    },
    {
        vraag: "In de brief aan Filemon noemt Paulus naast Filemon ook een vrouw en nog iemand uit het huis. Wie worden er gegroet?",
        antwoorden: ["Apfia en Archippus", "Maria en Jozef", "Lydia en Lukas", "Priscilla en Aquila"],
        correct: "Apfia en Archippus",
        bijbelplaats: "Filemon 2"
    },
    {
        vraag: "In de derde brief prijst Johannes een man die gastvrij is voor rondreizende gelovigen. Hoe heet hij?",
        antwoorden: ["Gajus", "Petrus", "Lucas", "Marcus"],
        correct: "Gajus",
        bijbelplaats: "3 Johannes 1"
    },
    {
        vraag: "In zijn derde brief schrijft Johannes over een man in de gemeente die graag de eerste wilde zijn. Hij wilde niet naar Johannes luisteren en weigerde rondreizende gelovigen te ontvangen. Hoe heette hij?",
        antwoorden: ["Diotrefes", "Demetrius", "Gajus", "Timoteüs"],
        correct: "Diotrefes",
        bijbelplaats: "3 Johannes 9"
    },
    {
        vraag: "In de derde brief noemt Johannes nóg een goede man, over wie iedereen alleen maar goeds zegt. Hoe heet hij?",
        antwoorden: ["Demetrius", "Diotrefes", "Gajus", "Theofilus"],
        correct: "Demetrius",
        bijbelplaats: "3 Johannes 12"
    },
    {
        vraag: "Wie waren volgens Paulus de oma en moeder die Timoteüs het geloof hadden meegegeven?",
        antwoorden: ["Loïs en Eunike", "Maria en Marta", "Sara en Rebekka", "Ruth en Naomi"],
        correct: "Loïs en Eunike",
        bijbelplaats: "2 Timoteüs 1:5"
    },
    {
        vraag: "Een medewerker had Paulus in de steek gelaten omdat hij meer van de wereld hield. Wie?",
        antwoorden: ["Demas", "Lukas", "Timoteüs", "Titus"],
        correct: "Demas",
        bijbelplaats: "2 Timoteüs 4:10"
    },
    {
        vraag: "Paulus noemt twee mannen die met hun verkeerde uitleg anderen van het geloof afbrachten. Wie?",
        antwoorden: ["Hymeneüs en Filetus", "Demas en Alexander", "Jakobus en Johannes", "Paulus en Barnabas"],
        correct: "Hymeneüs en Filetus",
        bijbelplaats: "2 Timoteüs 2:17"
    },
    {
        vraag: "Paulus waarschuwt voor één man, een kopersmid, die hem veel kwaad deed. Hoe heette hij?",
        antwoorden: ["Alexander", "Demas", "Lukas", "Titus"],
        correct: "Alexander",
        bijbelplaats: "2 Timoteüs 4:14"
    },
    {
        vraag: "Paulus stuurt de brief aan de Filippenzen mee met een vriend die heel ziek was geweest. Hoe heette hij?",
        antwoorden: ["Epafroditus", "Judas", "Tomas", "Lukas"],
        correct: "Epafroditus",
        bijbelplaats: "Filippenzen 2:25-27"
    },
    {
        vraag: "Wie noemt Paulus aan het begin van zijn brief aan de Tessalonicenzen als mede-afzenders, naast hemzelf?",
        antwoorden: ["Silvanus en Timoteüs", "Petrus en Johannes", "Barnabas en Marcus", "Lukas en Titus"],
        correct: "Silvanus en Timoteüs",
        bijbelplaats: "1 Tessalonicenzen 1:1"
    }
];

// Combineert alle vragen van één niveau uit alle boeken tot één kistpool.
// Vragen met kist: false blijven buiten de kisten. Dat zijn vragen die alleen
// binnen de boekmodus te begrijpen zijn, bijvoorbeeld omdat ze verwijzen naar
// "deze brief" — in de kist weet de speler niet welk boek dat is, en de
// boeknaam toevoegen zou het antwoord verklappen.
function alleVragenVoorNiveau(niveau) {
    let pool = [];
    for (const boek in vragenData) {
        if (vragenData[boek][niveau]) {
            pool = pool.concat(
                vragenData[boek][niveau].filter(v => v.kist !== false)
            );
        }
    }
    return pool;
}

// Start een schatkist-uitdaging: 10 willekeurige vragen uit de gecombineerde
// pool van alle evangeliën op dit niveau. Bij 10/10 verdient de speler de kist.
function openSchatkist(niveau) {
    oefenModus = false;
    gekozenModus = "kist";
    gekozenBoek = null;
    gekozenNiveau = niveau;

    vragen = kiesWillekeurigeVragen(alleVragenVoorNiveau(niveau), 10);

    document.getElementById("niveau-scherm").style.display = "none";
    const quizScherm = document.getElementById("quiz-scherm");
    quizScherm.style.display = "flex";

    const kistKleur = niveauNaarTrofee[niveau]; // brons / zilver / goud
    const kistTitels = {
        brons: "Bronzen Schatkist",
        zilver: "Zilveren Schatkist",
        goud: "Gouden Schatkist"
    };
    const quizTitle = document.getElementById("quiz-title");
    if (quizTitle) {
        quizTitle.innerHTML = kistTitels[kistKleur] || "Schatkist";
    }

    verbergLevelHud();

    huidigeVraag = 0;
    score = 0;
    huidigeXP = 0;
    beantwoordeVragen.clear();

    updateXPBalk();
    laadVraag();
}

// =========================
// VERBORGEN SCHAT — speelbaar met (voorlopig) één testvraag
// Hergebruikt volledig de bestaande quiz-machinerie (laadVraag/checkAntwoord/
// gaNaarVolgende/terugNaarStartscherm). Nog géén beloning-/trofee-/10-goed-
// logica; dat komt later. Raakt de win-logica niet aan.
// =========================

// De Verborgen Schat-vragen. Bij elke start worden zowel de vraagvolgorde als de
// antwoordvolgorde gehusseld (zie openVerborgenSchat). De bron staat in
// 'bijbelplaats' en verschijnt na het antwoorden via checkAntwoord().
const verborgenSchatVragen = [
    {
        vraag: "Volgens oude kerkelijke overlevering was de bovenzaal van het laatste avondmaal het huis van de familie van welke evangelist?",
        antwoorden: ["Marcus", "Mattheüs", "Lucas", "Johannes"],
        correct: "Marcus",
        bijbelplaats: "Handelingen 12:12 (kerkelijke overlevering)"
    },
    {
        vraag: 'Wat betekent het woord "apocalyps" eigenlijk?',
        antwoorden: ["Een grote ramp", "Onthulling of openbaring", "Het einde van de wereld", "Een droom of visioen"],
        correct: "Onthulling of openbaring",
        bijbelplaats: "Openbaring 1:1"
    },
    {
        vraag: 'Jezus noemt zichzelf "de Alfa en de Omega". Wat bedoelt hij daarmee?',
        antwoorden: ["Dat hij uit Griekenland kwam", "Dat hij de wijste van allemaal is", "Dat hij er is vanaf het begin tot het einde van alles", "Dat hij twee namen had"],
        correct: "Dat hij er is vanaf het begin tot het einde van alles",
        bijbelplaats: "Openbaring 22:13"
    },
    {
        vraag: 'In Openbaring wordt Jezus "het Lam" genoemd. Waarom juist een lam?',
        antwoorden: ["Omdat hij zichzelf opofferde, zoals een offerlam", "Omdat hij geboren werd in een stal", "Omdat hij veel van schapen hield", "Omdat hij verlegen en stil was"],
        correct: "Omdat hij zichzelf opofferde, zoals een offerlam",
        bijbelplaats: "Openbaring 5:6-12"
    },
    {
        vraag: "Het getal zeven komt overal voor in Openbaring (zeven gemeenten, zegels, bazuinen). Waar staat zeven symbolisch voor?",
        antwoorden: ["Geluk", "Het aantal apostelen", "Volheid of compleetheid", "De zeven dagen van de week"],
        correct: "Volheid of compleetheid",
        bijbelplaats: "Genesis 2:2-3"
    },
    {
        vraag: "Hoe eindigt de Bijbel, in het boek Openbaring?",
        antwoorden: ["Met de schepping van de wereld", "Met een nieuwe hemel en een nieuwe aarde, waar God bij de mensen woont", "Met de dood van Jezus aan het kruis", "Met de tien geboden"],
        correct: "Met een nieuwe hemel en een nieuwe aarde, waar God bij de mensen woont",
        bijbelplaats: "Openbaring 21:1-4"
    },
    {
        vraag: 'In Openbaring en in het boek Daniël komt de geheimzinnige uitdrukking "een tijd, tijden en een halve tijd" voor. Welke tijdsduur wordt daarmee bedoeld?',
        antwoorden: ["Zeven jaar", "Drieënhalf jaar", "Drie en een halve dag", "Duizend jaar"],
        correct: "Drieënhalf jaar",
        bijbelplaats: "Openbaring 12:14"
    },
    {
        vraag: "In Openbaring ziet Johannes vier levende wezens rond Gods troon: een leeuw, een rund, een mens en een arend. Uit het visioen van welke profeet komt dit beeld oorspronkelijk?",
        antwoorden: ["Jesaja", "Ezechiël", "Daniël", "Jeremia"],
        correct: "Ezechiël",
        bijbelplaats: "Ezechiël 1:10 · Openbaring 4:7"
    },
    {
        vraag: "Helemaal aan het begin van de Bijbel, in het paradijs, staat een bijzondere boom. Aan het einde van Openbaring staat diezelfde boom er weer. Welke boom is dat?",
        antwoorden: ["De olijfboom", "De vijgenboom", "De boom des levens", "De boom van kennis van goed en kwaad"],
        correct: "De boom des levens",
        bijbelplaats: "Genesis 2:9 · Openbaring 22:2"
    },
    {
        vraag: "Johannes schrijft Openbaring als een brief. Aan hoeveel gemeenten richt hij zich aan het begin?",
        antwoorden: ["Eén", "Drie", "Zeven", "Twaalf"],
        correct: "Zeven",
        bijbelplaats: "Openbaring 1:4, 11"
    },
    {
        vraag: "Aan het einde van Openbaring ziet Johannes een schitterende stad uit de hemel neerdalen, waar God voorgoed bij de mensen woont. Hoe heet die stad?",
        antwoorden: ["Het hemelse Babylon", "Het nieuwe Eden", "De gouden tempel", "Het nieuwe Jeruzalem"],
        correct: "Het nieuwe Jeruzalem",
        bijbelplaats: "Openbaring 21:2"
    },
    {
        vraag: "Marcus heeft een opvallende manier van vertellen: hij begint een verhaal, schuift er een ánder verhaal tussen, en keert dan terug naar het eerste. Dat doet hij vaker — bijvoorbeeld bij Jaïrus en de zieke vrouw, en bij de vijgenboom en de tempel. Geleerden gaven deze stijl een grappige bijnaam. Welke?",
        antwoorden: ["De trappen-techniek", "De sandwich-techniek", "De brug-techniek", "De ketting-techniek"],
        correct: "De sandwich-techniek",
        bijbelplaats: "Marcus 5:21-43 · Marcus 11:12-25",
        reveal: "Het mooiste zit 'm in het midden: net als bij een echte sandwich draait het om het beleg. Het verhaal dát Marcus ertussen schuift, is meestal waar het hem om te doen is — de twee verhalen eromheen helpen je dat te begrijpen. Met een moeilijk woord heet dit intercalatie.",
        catecheseId: "verborgen-patronen-sandwich"
    },
    {
        vraag: "In Johannes 21 vangen de leerlingen na de opstanding precies 153 grote vissen, en het volle net scheurt niet. Volgens oude kerkelijke overlevering geloofde men dat er net zoveel soorten vissen bestonden. Welke verborgen boodschap zagen zij daarin?",
        antwoorden: [
            "De blijde boodschap mag aan alle volken gebracht worden",
            "De boodschap is alleen voor het volk Israël",
            "Het getal staat voor 153 wonderen van Jezus",
            "Het getal telt de jaren tot Jezus' terugkomst"
        ],
        correct: "De blijde boodschap mag aan alle volken gebracht worden",
        bijbelplaats: "Johannes 21:11 (oude kerkelijke overlevering, o.a. Hiëronymus)",
        reveal: "153 vissen, en het net scheurt niet! Volgens oude kerkelijke overlevering dacht men dat er precies zoveel soorten vissen waren. De verborgen boodschap: het goede nieuws is voor álle volken — en niemand gaat verloren.",
        catecheseId: "verborgen-getallen-153"
    },
    {
        vraag: "De brieven van Paulus staan in de Bijbel niet op volgorde van wanneer hij ze schreef. Waarop is hun volgorde ongeveer gebaseerd?",
        antwoorden: [
            "Op lengte: van de langste brief naar de kortste",
            "Op de tijd waarin Paulus ze schreef",
            "Op de alfabetische volgorde van de namen",
            "Op hoe belangrijk de brieven zijn"
        ],
        correct: "Op lengte: van de langste brief naar de kortste",
        bijbelplaats: "1 Korintiërs 15:9 · Efeziërs 3:8 · 1 Timoteüs 1:15",
        reveal: "Wist je dit? Omdat de brieven op lengte staan en niet op tijd, zie je iets moois pas als je ze op volgorde van schrijven leest. Dan noemt Paulus zichzelf telkens kleiner: eerst \"de minste van de apostelen\" (1 Korintiërs), later \"de allerminste van alle gelovigen\" (Efeziërs), en aan het eind \"de grootste van de zondaars\" (1 Timoteüs). Hoe dichter Paulus bij God leefde, hoe kleiner hij zichzelf maakte.",
        catecheseId: "verborgen-patronen-paulus-brieven"
    },
    {
        vraag: "Bij Jezus' arrestatie sloeg Petrus met een zwaard het oor af van Malchus, de dienaar van de hogepriester. Wat gebeurde er daarna?",
        antwoorden: [
            "Jezus raakte het oor aan en genas de man die hem kwam arresteren",
            "Petrus werd meteen gevangengenomen en pas de volgende dag vrijgelaten",
            "De soldaten sloegen Petrus neer en bonden hem vast",
            "Jezus beval Petrus dat hij weg moest gaan"
        ],
        correct: "Jezus raakte het oor aan en genas de man die hem kwam arresteren",
        bijbelplaats: "Lucas 22:50-51 en Johannes 18:10",
        reveal: "Dit is de laatste genezing van Jezus vóór het kruis — en de laatste mens die hij geneest, is iemand die gekomen was om hem op te pakken. Bijzonder is ook wie wat vertelt. Matteüs en Marcus schrijven alleen dat iemand toesloeg, zonder namen. Johannes is de enige die zegt dat het Petrus was en dat de dienaar Malchus heette. Hij schreef als laatste van de vier. Zou dat kunnen verklaren waarom hij wél namen durfde te noemen, terwijl Matteüs en Marcus die weglaten? En Lucas — die volgens de overlevering arts was — is de enige die vertelt dat Jezus het oor aanraakte en genas. Hoe het verder met Malchus ging, staat nergens in de Bijbel. Wel valt op dat Johannes niet alleen zijn naam kent, maar even later ook een familielid van hem noemt (Johannes 18:26). Blijkbaar was die familie geen onbekende in de kring rond Jezus."
    },
    {
        vraag: "Welke brief in het Nieuwe Testament is al aan zijn naam te herkennen als een brief aan christenen met een Joodse achtergrond?",
        antwoorden: ["Hebreeën", "Romeinen", "Galaten", "Efeziërs"],
        correct: "Hebreeën",
        bijbelplaats: "naam van het boek",
        reveal: "De naam verraadt het al! Hebreeën is een oude aanduiding voor het Joodse volk. De titel is er trouwens pas later boven gezet; de brief zelf noemt nergens aan wie hij gericht is. Maar de inhoud wijst die kant op: het gaat uitgebreid over de tempel, de offers en het priesterschap — de wereld waarin de lezers waren opgegroeid. En juist daarvan laat de schrijver zien dat Jezus de vervulling is: alles waar die eeuwenoude gebruiken naar vooruitwezen, komt in hem samen."
    }
];

// Kleine herbruikbare hulp: gehusselde kopie (Fisher-Yates), origineel blijft
// ongemoeid. Gebruikt voor de antwoordvolgorde van de Verborgen Schat-vraag.
function husselArray(bron) {
    const kopie = [...bron];
    for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    return kopie;
}

// Start de Verborgen Schat-quiz. Zelfde startstramien als openSchatkist, maar
// met de eigen modus "verborgen" en de testvraag (antwoorden gehusseld).
function openVerborgenSchat() {
    // Toegangspoort: alleen spelen als de pool open is. Bewust NIET op de
    // class in de DOM controleren — als dat element ontbreekt, zou zo'n
    // controle stilzwijgend doorlaten.
    if (!magVerborgenSchatSpelen() && !afstelModus) return;

    oefenModus = false;
    gekozenModus = "verborgen";
    gekozenBoek = null;
    gekozenNiveau = null;

    // Trek 10 willekeurige vragen uit de pool (bij een kleinere pool: alles),
    // elk met gehusselde antwoorden (origineel blijft intact). Bij opnieuw spelen
    // levert dit vanzelf een nieuwe willekeurige set op.
    vragen = kiesWillekeurigeVragen(verborgenSchatVragen, 10).map((v) => ({
        ...v,
        antwoorden: husselArray(v.antwoorden)
    }));

    document.getElementById("niveau-scherm").style.display = "none";
    const quizScherm = document.getElementById("quiz-scherm");
    quizScherm.style.display = "flex";

    const quizTitle = document.getElementById("quiz-title");
    if (quizTitle) quizTitle.innerHTML = "Verborgen Schat";

    verbergLevelHud();

    huidigeVraag = 0;
    score = 0;
    huidigeXP = 0;
    beantwoordeVragen.clear();

    updateXPBalk();
    laadVraag();
}

function laadVraag() {
    const vraagElement = document.getElementById("quiz-question");
    const antwoord1 = document.getElementById("antwoord-1");
    const antwoord2 = document.getElementById("antwoord-2");
    const antwoord3 = document.getElementById("antwoord-3");
    const antwoord4 = document.getElementById("antwoord-4");
    const resultaat = document.getElementById("resultaat");

    resultaat.innerHTML = "";

    const scoreBalk = document.getElementById("score-balk");
    if (scoreBalk) scoreBalk.style.display = oefenModus ? "none" : "";

    const stopKnop = document.getElementById("oefen-stop-knop");
    if (stopKnop) stopKnop.style.display = oefenModus ? "block" : "none";

    // Terug-knop voor een meetellende ronde: zichtbaar in elke gewone ronde
    // (evangelie, schatkist, Verborgen Schat), verborgen in de oefenmodus —
    // die heeft hierboven al zijn eigen, directe stopknop.
    const rondeStopKnop = document.getElementById("ronde-stop-knop");
    if (rondeStopKnop) rondeStopKnop.style.display = oefenModus ? "none" : "block";

    // Reset visuele feedback en klikbaarheid van het vorige antwoord
    [antwoord1, antwoord2, antwoord3, antwoord4].forEach((knop) => {
        knop.classList.remove("answer-correct", "answer-wrong");
        knop.style.pointerEvents = "";
    });

    vraagElement.innerHTML = vragen[huidigeVraag].vraag;

    antwoord1.innerHTML = vragen[huidigeVraag].antwoorden[0];
    antwoord2.innerHTML = vragen[huidigeVraag].antwoorden[1];
    antwoord3.innerHTML = vragen[huidigeVraag].antwoorden[2];
    antwoord4.innerHTML = vragen[huidigeVraag].antwoorden[3];

    antwoord1.onclick = () => checkAntwoord(vragen[huidigeVraag].antwoorden[0]);
    antwoord2.onclick = () => checkAntwoord(vragen[huidigeVraag].antwoorden[1]);
    antwoord3.onclick = () => checkAntwoord(vragen[huidigeVraag].antwoorden[2]);
    antwoord4.onclick = () => checkAntwoord(vragen[huidigeVraag].antwoorden[3]);

    // Oefenmodus: toon meteen de navigatie (← Terug / Volgende →), óók vóór het
    // antwoorden, zodat een kind vrij door de hele set kan bladeren en terug kan.
    if (oefenModus) toonOefenNav();
}

function checkAntwoord(antwoord) {
    const resultaat = document.getElementById("resultaat");
    const huidig = vragen[huidigeVraag];

    const knoppen = [
        document.getElementById("antwoord-1"),
        document.getElementById("antwoord-2"),
        document.getElementById("antwoord-3"),
        document.getElementById("antwoord-4")
    ];

    // Bevries de knoppen tijdens de feedback, anders kan een snelle dubbelklik
    // de score-logica nogmaals triggeren.
    knoppen.forEach((knop) => { knop.style.pointerEvents = "none"; });

    // Markeer altijd het juiste antwoord groen — zo ziet de speler óók bij
    // een foute keuze welk antwoord het wél was.
    const goedeKnop = knoppen.find((knop) => knop.innerHTML === huidig.correct);
    if (goedeKnop) goedeKnop.classList.add("answer-correct");

    // Alleen het EERSTE antwoord op een vraag telt mee voor de score/XP. Zo levert
    // terugbladeren en een vraag opnieuw (goed) invullen geen extra punten op —
    // belangrijk nu je in de oefenmodus vrij heen en weer kunt bladeren. Ook een
    // fout eerste antwoord vergrendelt de vraag: later alsnog goed geeft geen punt.
    const alGescoord = beantwoordeVragen.has(huidigeVraag);
    beantwoordeVragen.add(huidigeVraag);

    let melding;
    if (antwoord === huidig.correct) {
        melding = "✅ Goed gedaan!";
        resultaat.style.color = "#7CFF7C";

        if (!alGescoord) {
            score++;

            // XP is per ronde: +100 per goed antwoord, max 1000 — niet opslaan in localStorage.
            // De oude waarde vastleggen vóór de ophoging, zodat de presentatie de
            // werkelijke toename (nieuw − oud) toont i.p.v. een hard "+100".
            const oudeXP = huidigeXP;
            huidigeXP += 100;

            // Presentatie: zwevende "+N" + optellend tellertje. Verandert de
            // XP-waarde niet; toont enkel de sprong van oudeXP naar huidigeXP.
            toonXpToename(oudeXP, huidigeXP);
        }
    } else {
        melding = "❌ Dat is niet goed.";
        resultaat.style.color = "#FF7C7C";

        // Markeer de foute keuze rood naast de groen oplichtende juiste keuze.
        const fouteKnop = knoppen.find((knop) => knop.innerHTML === antwoord);
        if (fouteKnop) fouteKnop.classList.add("answer-wrong");
    }

    // Toon ná het antwoorden, onder het resultaat: eerst de bijbelplaats, dan
    // (optioneel) de uitleg. Elk deel verschijnt alleen als het veld bestaat, dus
    // bestaande vragen zonder die velden gedragen zich precies zoals voorheen.
    // Na het antwoorden tonen we alleen de bijbelplaats; de (soms lange) uitleg
    // blijft in de data, maar verschijnt NIET in de quiz — die houden we snel.
    // De uitleg is wél te lezen op de Vragen & uitleg-pagina.
    let extra = "";
    if (huidig.bijbelplaats) extra += `<div class="bijbelplaats">Lees het na in: ${huidig.bijbelplaats}</div>`;
    resultaat.innerHTML = melding + extra;

    if (gekozenModus === "verborgen") {
        // Verborgen Schat: geen automatische doorloop. Toon een zelf-getempo'd
        // onthullingsscherm met de verborgen boodschap; het kind klikt zelf
        // "Volgende →". Alleen deze modus; de gewone quiz blijft snel.
        toonVsReveal(antwoord === huidig.correct, huidig);
    } else if (oefenModus) {
        // Oefenmodus: geen timer. De feedback + bijbelplaats blijven staan, met
        // daaronder de navigatie (← Terug / Volgende →) zodat het kind zelf zijn
        // tempo bepaalt en rustig kan terugbladeren om iets na te lezen.
        toonOefenNav();
    } else {
        volgendeTimer = setTimeout(gaNaarVolgende, 2000);
    }
}

function gaNaarVolgende() {
    // Een eventueel lopende XP-count-up direct afbreken en het eindgetal tonen,
    // zodat doorklikken tijdens de animatie nooit een half getal achterlaat.
    stopXpTeller();

    volgendeTimer = null;
    huidigeVraag++;
    if (huidigeVraag < vragen.length) {
        laadVraag();
    } else {
        eindScherm();
    }
}

// Eén vraag terug in de oefenmodus. Op de eerste vraag gebeurt er niets (de
// Terug-knop is dan uitgeschakeld). Alleen bedoeld voor de oefenmodus.
function gaNaarVorige() {
    stopXpTeller();
    volgendeTimer = null;
    if (huidigeVraag > 0) {
        huidigeVraag--;
        laadVraag();
    }
}

// Oefenmodus-navigatie: ← Terug en Volgende → naast elkaar. Terug is uitgeschakeld
// op de eerste vraag; Volgende → op de laatste vraag sluit de oefenronde af. Wordt
// zowel vóór als ná het antwoorden getoond, zodat een kind vrij door de set kan
// bladeren en rustig iets kan nalezen. Alleen oefenmodus; de gewone quiz houdt zijn
// snelle automatische doorloop.
function toonOefenNav() {
    const resultaat = document.getElementById("resultaat");
    if (!resultaat) return;

    const nav = document.createElement("div");
    nav.className = "oefen-nav";
    nav.style.display = "flex";
    nav.style.gap = "10px";
    nav.style.justifyContent = "center";
    nav.style.marginTop = "12px";

    const terug = document.createElement("button");
    terug.className = "answer-btn oefen-volgende oefen-terug";
    terug.textContent = "← Terug";
    terug.disabled = (huidigeVraag === 0);
    if (huidigeVraag === 0) terug.style.opacity = "0.4";
    terug.onclick = gaNaarVorige;

    const volgende = document.createElement("button");
    volgende.className = "answer-btn oefen-volgende";
    volgende.textContent = "Volgende →";
    volgende.onclick = gaNaarVolgende;

    nav.appendChild(terug);
    nav.appendChild(volgende);
    resultaat.appendChild(nav);
}

// --- XP-presentatie: zwevende "+N" + optellend tellertje ---------------------
// Puur cosmetisch. De score-/XP-logica (score, huidigeXP) blijft ongemoeid; deze
// functies tonen alleen de sprong die daar al is berekend. Bij prefers-reduced-
// motion wordt er niets geanimeerd — dan verschijnt meteen het eindgetal.

// Breekt een lopende count-up af en zet het XP-getal meteen op de echte waarde.
function stopXpTeller() {
    if (xpAnimFrame !== null) {
        cancelAnimationFrame(xpAnimFrame);
        xpAnimFrame = null;
    }
    const xpBoven = document.getElementById("xp");
    if (xpBoven) xpBoven.innerHTML = huidigeXP;
}

// Regisseert de toename: eerst een lopende animatie stoppen (geen overlap bij
// snel doorklikken), dan — afhankelijk van reduced-motion — animeren of snappen.
function toonXpToename(oudeXP, nieuweXP) {
    // Altijd eerst een eventueel nog lopende count-up annuleren.
    if (xpAnimFrame !== null) {
        cancelAnimationFrame(xpAnimFrame);
        xpAnimFrame = null;
    }

    const xpBoven = document.getElementById("xp");
    const toename = nieuweXP - oudeXP;

    const geenBeweging = window.matchMedia
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (geenBeweging || toename <= 0) {
        if (xpBoven) xpBoven.innerHTML = nieuweXP;   // gewoon het eindgetal
        return;
    }

    toonXpPlus(toename);              // zwevende "+N" bij het XP-getal
    animeerXpTeller(oudeXP, nieuweXP); // optellend tellertje
}

// Zwevende "+N": stijgt en vervaagt via een pure CSS-animatie (.xp-plus). We
// voegen het element toe aan #score-balk (niet aan #xp, want dat wordt elke
// frame herschreven) en halen het na de animatie weer weg.
function toonXpPlus(bedrag) {
    const balk = document.getElementById("score-balk");
    if (!balk) return;

    // Een eventueel nog zwevende "+N" eerst verwijderen, zodat er niets opstapelt.
    const bestaand = balk.querySelector(".xp-plus");
    if (bestaand) bestaand.remove();

    const plus = document.createElement("span");
    plus.className = "xp-plus";
    plus.textContent = "+" + bedrag;
    plus.addEventListener("animationend", () => plus.remove());
    balk.appendChild(plus);
}

// Optellend tellertje: ~600 ms pauze, dan ~600 ms optellen met een ease-out,
// aangedreven door requestAnimationFrame (geen setInterval). De rAF-timestamp
// dient als klok, zodat het niet afhangt van de framesnelheid. De pauze laat de
// speler eerst het groen wordende antwoord zien; pas daarna trekken de "+100" en
// de oplopende teller de aandacht. Totaal ~1200 ms, ruim binnen de 2000 ms tot de
// volgende vraag, zodat de bijbelplaats leesbaar blijft.
function animeerXpTeller(vanXP, naarXP) {
    // Vertraging vóór het optellen begint. Los benoemd zodat je hem makkelijk
    // kunt bijstellen zonder in de logica te zoeken.
    const XP_ANIMATIE_VERTRAGING = 600;

    const xpBoven = document.getElementById("xp");
    if (!xpBoven) return;

    const DUUR_MS = 600;
    let startTijd = null;

    function stap(nu) {
        if (startTijd === null) startTijd = nu;
        const verstreken = nu - startTijd;

        if (verstreken < XP_ANIMATIE_VERTRAGING) {
            xpBoven.innerHTML = vanXP;              // tijdens de pauze de oude waarde
            xpAnimFrame = requestAnimationFrame(stap);
            return;
        }

        const t = Math.min((verstreken - XP_ANIMATIE_VERTRAGING) / DUUR_MS, 1);
        const eased = 1 - Math.pow(1 - t, 3);       // ease-out (cubic): snel starten, zacht uitlopen
        xpBoven.innerHTML = Math.round(vanXP + (naarXP - vanXP) * eased);

        if (t < 1) {
            xpAnimFrame = requestAnimationFrame(stap);
        } else {
            xpBoven.innerHTML = naarXP;              // exact het eindgetal
            xpAnimFrame = null;
        }
    }

    xpAnimFrame = requestAnimationFrame(stap);
}

// --- Verborgen Schat: zelf-getempo'd onthullingsscherm -----------------------
// Alleen in de Verborgen-Schat-modus. Toont na een antwoord een onthullingskaart
// (goud/donkerblauw) met goed/fout, de "verborgen boodschap" (q.reveal) en een
// link naar de Catechese. Het kind klikt zelf "Volgende →".
function toonVsReveal(isGoed, q) {
    const scherm = document.getElementById("vs-reveal-scherm");
    const uitslag = document.getElementById("vs-reveal-uitslag");
    const kop = document.getElementById("vs-reveal-kop");
    const tekst = document.getElementById("vs-reveal-tekst");
    const meerKnop = document.getElementById("vs-reveal-catechese");
    const meerMelding = document.getElementById("vs-reveal-meer-melding");

    if (uitslag) {
        uitslag.textContent = isGoed ? "✅ Goed gedaan!" : "❌ Dat is niet goed.";
        uitslag.classList.toggle("goed", isGoed);
        uitslag.classList.toggle("fout", !isGoed);
    }

    // De boodschap-tekst en kop verschijnen alleen als er een reveal bij deze
    // vraag hoort. Anders: enkel goed/fout + Volgende.
    const heeftReveal = !!(q && q.reveal);
    if (kop) kop.style.display = heeftReveal ? "" : "none";
    if (tekst) {
        tekst.textContent = heeftReveal ? q.reveal : "";
        tekst.style.display = heeftReveal ? "" : "none";
    }
    // De Catechese-knop hangt aan de catecheseId, niet aan de reveal: alleen
    // tonen als er echt een artikel te openen valt. Haal je de catechese-tekst
    // bij een vraag weg (of voeg je er later een toe), dan volgt de knop
    // vanzelf — hier hoeft dan niets aangepast te worden.
    const heeftCatechese = !!(q && q.catecheseId);
    if (meerKnop) {
        meerKnop.style.display = (heeftReveal && heeftCatechese) ? "" : "none";
        // De catecheseId bewaren voor de deep-link vanuit vsRevealMeer().
        meerKnop.dataset.catecheseId = heeftCatechese ? q.catecheseId : "";
    }
    if (meerMelding) {
        meerMelding.textContent = "";
        meerMelding.classList.remove("zichtbaar");
    }

    if (scherm) scherm.style.display = "flex";
}

// "Volgende →": de kaart sluiten en zelf doorgaan naar de volgende vraag.
function vsRevealVolgende() {
    const scherm = document.getElementById("vs-reveal-scherm");
    if (scherm) scherm.style.display = "none";
    gaNaarVolgende();
}

// "Meer ontdekken → Catechese": als er later een catecheseId aan de vraag hangt,
// opent dit straks rechtstreeks het Catechese-artikel. Voorlopig (nog geen id)
// een rustige placeholder-melding op de kaart.
function vsRevealMeer() {
    const meerKnop = document.getElementById("vs-reveal-catechese");
    const id = meerKnop ? meerKnop.dataset.catecheseId : "";
    if (id && typeof openCatecheseArtikel === "function" &&
        catecheseArtikelen.some((a) => a.id === id)) {
        const scherm = document.getElementById("vs-reveal-scherm");
        if (scherm) scherm.style.display = "none";
        // Open het artikel mét herkomst "vs-reveal": de onthullingskaart blijft
        // eronder en de Terug-knop in het artikel keert ernaar terug.
        openCatecheseArtikel(id, "vs-reveal");
        return;
    }
    const meerMelding = document.getElementById("vs-reveal-meer-melding");
    if (meerMelding) {
        meerMelding.textContent = "Binnenkort kun je hier meer ontdekken in de Catechese.";
        meerMelding.classList.add("zichtbaar");
    }
}

function terugNaarStartscherm() {
    document.getElementById("quiz-scherm").style.display = "none";
    document.getElementById("niveau-scherm").style.display = "none";

    // Centrale opruiming van de rondestatus: een eventueel lopende feedback-timer
    // stoppen en de ronde-Terug-knop + het stop-bevestigingsvenster verbergen. Zo
    // loopt een afgebroken ronde niet alsnog door en begint een volgende ronde
    // gegarandeerd schoon. Geldt voor álle rondes, want elke ronde eindigt hier.
    clearTimeout(volgendeTimer);
    volgendeTimer = null;
    rondeStopPendingAdvance = false;
    const rondeStopKnop = document.getElementById("ronde-stop-knop");
    if (rondeStopKnop) rondeStopKnop.style.display = "none";
    const rondeStopScherm = document.getElementById("ronde-stop-scherm");
    if (rondeStopScherm) rondeStopScherm.style.display = "none";

    // eindScherm() heeft de quiz-box leeggeschreven met een eindbericht; zet de
    // originele structuur (titel, score-balk, vraag, antwoordknoppen, resultaat)
    // weer terug zodat een volgende quiz gewoon werkt zonder pagina-reload.
    const quizBox = document.querySelector("#quiz-scherm .quiz-box");
    if (quizBox) {
        quizBox.innerHTML = `
            <h2 id="quiz-title" class="quiz-title">Matteüs Quiz</h2>
            <div id="score-balk">
                XP: <span id="xp">0</span>
            </div>
            <p id="quiz-question" class="quiz-question"></p>
            <button id="antwoord-1" class="answer-btn"></button>
            <button id="antwoord-2" class="answer-btn"></button>
            <button id="antwoord-3" class="answer-btn"></button>
            <button id="antwoord-4" class="answer-btn"></button>
            <div id="resultaat"></div>
        `;
    }

    // Reset de tijdelijke quiz-state. De schildpunten in localStorage blijven
    // staan; alleen de momentscore (huidigeXP) wordt naar 0 gezet.
    huidigeVraag = 0;
    score = 0;
    huidigeXP = 0;
    beantwoordeVragen.clear();
    gekozenBoek = null;
    gekozenNiveau = null;
    gekozenModus = "boek";
    oefenModus = false;
    vragen = [];

    // FIX 5: HUD weer zichtbaar maken bij terugkeer naar het startscherm
    toonLevelHud();

    updateXPBalk();

    // Verborgen schat verversen: net een kist verdiend in deze ronde kan de
    // diamanten kist onthullen zodra alle drie behaald zijn.
    werkVerborgenSchatBij();

    // De NT-prijzenkast live verversen, zodat een zojuist verdiende trofee
    // meteen zichtbaar is en niet pas na opnieuw scherm 2 binnenkomen.
    if (typeof nt2Kast !== "undefined") bouwNtKast(nt2Kast);
}

// --- Ronde stoppen (met bevestiging) ----------------------------------------
// Tijdens elke meetellende ronde (evangelie, schatkist, Verborgen Schat) kan de
// speler met de Terug-knop linksboven stoppen. Eerst een korte bevestiging; pas
// bij "Stoppen" gaat de ronde verloren. Werkt voor álle rondes tegelijk, omdat
// het op de gedeelde quiz-machinerie aanhaakt en niet per evangelieboek bestaat.
function vraagRondeStoppen() {
    // Pauzeer een eventueel lopende "ga naar volgende"-timer, zodat de ronde niet
    // achter het bevestigingsvenster doorloopt (en bijv. ongemerkt het eindscherm
    // met beloning bereikt) terwijl de speler nog nadenkt.
    if (volgendeTimer !== null) {
        clearTimeout(volgendeTimer);
        volgendeTimer = null;
        rondeStopPendingAdvance = true;
    }
    const scherm = document.getElementById("ronde-stop-scherm");
    if (scherm) scherm.style.display = "flex";
}

function annuleerRondeStoppen() {
    // "Doorgaan": het venster sluiten en de ronde gewoon laten doorlopen. Was er
    // net geantwoord (timer gepauzeerd), dan hervatten we de onderbroken doorloop.
    const scherm = document.getElementById("ronde-stop-scherm");
    if (scherm) scherm.style.display = "none";
    if (rondeStopPendingAdvance) {
        rondeStopPendingAdvance = false;
        gaNaarVolgende();
    }
}

function bevestigRondeStoppen() {
    // "Stoppen": de ronde afbreken. terugNaarStartscherm() wist de timer, verbergt
    // de knop en reset de volledige rondestatus. Er wordt bewust géén eindScherm()
    // aangeroepen, dus geen XP/trofee/schatkist/Verborgen-Schat-unlock opgeslagen.
    rondeStopPendingAdvance = false;
    const scherm = document.getElementById("ronde-stop-scherm");
    if (scherm) scherm.style.display = "none";
    terugNaarStartscherm();
}

// --- Bijbeltraining ---------------------------------------------------------
// Opent het Bijbeltraining-kruispunt (Oefenen / Naslag & uitleg).
function openBijbeltraining() {
    document.getElementById("bijbeltraining-scherm").style.display = "flex";
}

// Sluit het kruispunt en keert terug naar het startscherm.
function sluitBijbeltraining() {
    document.getElementById("bijbeltraining-scherm").style.display = "none";
}

// Placeholders — worden in de volgende stappen ingevuld.
function startOefenen() {
    document.getElementById("bijbeltraining-scherm").style.display = "none";
    vulOefenBoeken();
    document.getElementById("oefen-boek-scherm").style.display = "flex";
}

// Vult het oefen-keuzescherm met ALLE boeken uit boekNaarKey (i.p.v. alleen de
// vier evangeliën die statisch in index.html staan). Defensief: het vindt de
// bestaande boekknoppen via hun onclick (kiesOefenBoek) en neemt hun opmaak/plek
// over; de Terug-knop blijft staan. Vindt het niets herkenbaars, dan laat het
// het scherm ongemoeid. Bouwt maar één keer op (dataset-vlag) en maakt de lijst
// scrollbaar, want 18 boeken passen anders niet zoals 4 dat deden.
function vulOefenBoeken() {
    const scherm = document.getElementById("oefen-boek-scherm");
    if (!scherm) return;

    // Ondertitel bijwerken: het zijn niet meer alleen evangeliën.
    scherm.querySelectorAll("*").forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim() === "Kies een evangelie") {
            el.textContent = "Kies een boek";
        }
    });

    const knoppen = Array.from(scherm.querySelectorAll("button"));
    const isBoekKnop = (b) => (b.getAttribute("onclick") || "").includes("kiesOefenBoek");
    const isTerugKnop = (b) => (b.getAttribute("onclick") || "").includes("terugNaarBijbeltraining");

    const boekKnoppen = knoppen.filter(isBoekKnop);
    if (boekKnoppen.length === 0) return;            // onbekende opmaak: niets doen

    const template = boekKnoppen[0];
    const ouder = template.parentElement;
    if (!ouder || ouder.dataset.oefenVol === "1") return;   // al aangevuld

    const klasse = template.className;
    const terugKnop = knoppen.find(isTerugKnop);

    // Oude (statische) boekknoppen weghalen; Terug blijft behouden.
    boekKnoppen.forEach((b) => b.remove());

    // Alle 18 boeken toevoegen, in de vaste volgorde van boekNaarKey, vóór Terug.
    Object.keys(boekNaarKey).forEach((boek) => {
        const knop = document.createElement("button");
        knop.className = klasse;
        knop.textContent = boek;
        knop.onclick = () => kiesOefenBoek(boek);
        if (terugKnop && terugKnop.parentElement === ouder) {
            ouder.insertBefore(knop, terugKnop);
        } else {
            ouder.appendChild(knop);
        }
    });

    // Lijst scrollbaar maken zodat alle boeken op één scherm passen.
    ouder.style.maxHeight = "72vh";
    ouder.style.overflowY = "auto";

    ouder.dataset.oefenVol = "1";
}
function terugNaarBijbeltraining() {
    document.getElementById("oefen-boek-scherm").style.display = "none";
    document.getElementById("bijbeltraining-scherm").style.display = "flex";
}
function kiesOefenBoek(boek) {
    document.getElementById("oefen-boek-scherm").style.display = "none";
    openBoek(boek, { vergrendel: false, oefen: true });
}
function openNaslag() {
    document.getElementById("bijbeltraining-scherm").style.display = "none";
    document.getElementById("naslag-scherm").style.display = "flex";
    // Verborgen Schat-knop in de juiste (on)vergrendelde staat zetten.
    werkVerborgenSchatNaslagKnopBij();
}

function sluitNaslag() {
    document.getElementById("naslag-scherm").style.display = "none";
    document.getElementById("bijbeltraining-scherm").style.display = "flex";
}

// --- Naslag-onderwerpen (vanuit het Naslag-tussenmenu) -----------------------
// Elk onderwerp is een eigen scherm; "← Terug" keert terug naar het tussenmenu.
function openMaten() {
    document.getElementById("naslag-scherm").style.display = "none";
    document.getElementById("maten-scherm").style.display = "flex";
}
function sluitMaten() {
    document.getElementById("maten-scherm").style.display = "none";
    document.getElementById("naslag-scherm").style.display = "flex";
}
function openWoordenboek() {
    document.getElementById("naslag-scherm").style.display = "none";
    document.getElementById("woordenboek-scherm").style.display = "flex";
}
function sluitWoordenboek() {
    document.getElementById("woordenboek-scherm").style.display = "none";
    document.getElementById("naslag-scherm").style.display = "flex";
}

// --- Verborgen Schat (naslag) ------------------------------------------------
// De vlag "verborgenschat_voltooid" bepaalt of het Verborgen Schat-onderwerp
// ontgrendeld is. Die vlag wordt later gezet als de speler de Verborgen Schat
// heeft gespeeld; voor nu staat hij niet en blijft de knop dus vergrendeld.
function isVerborgenSchatOntgrendeld() {
    return localStorage.getItem(profielSleutel("verborgenschat_voltooid")) === "waar";
}

// Zet de Verborgen Schat-knop in het tussenmenu in de juiste staat: vergrendeld
// (slotje + hint, niet klikbaar) of actief (volle diamantstijl, geen hint).
function werkVerborgenSchatNaslagKnopBij() {
    const knop = document.getElementById("verborgenschat-knop");
    const hint = document.getElementById("verborgenschat-hint");
    if (!knop) return;

    const ontgrendeld = isVerborgenSchatOntgrendeld();
    knop.classList.toggle("vergrendeld", !ontgrendeld);
    if (hint) hint.style.display = ontgrendeld ? "none" : "";
}

// Opent de Verborgen Schat-naslagpagina — alleen als die ontgrendeld is. Bij een
// vergrendelde knop doet een klik bewust niets.
function openVerborgenSchatNaslag() {
    if (!isVerborgenSchatOntgrendeld()) return;
    document.getElementById("naslag-scherm").style.display = "none";
    document.getElementById("verborgenschat-naslag-scherm").style.display = "flex";
}
function sluitVerborgenSchatNaslag() {
    document.getElementById("verborgenschat-naslag-scherm").style.display = "none";
    document.getElementById("naslag-scherm").style.display = "flex";
}

// =========================
// VRAGEN & UITLEG (read-only browser)
// Toont de bestaande vragen per boek + niveau, met hun antwoord/bijbelplaats/
// uitleg. Leest RECHTSTREEKS uit vragenData; eigen statusvariabelen (vuBoek/
// vuNiveau), losstaand van de quiz. Raakt quiz-/pool-/win-/scorelogica niet aan.
// =========================
let vuBoek = null;
let vuNiveau = null;

// Bijbeltraining -> evangelie-keuze
function openVraagUitleg() {
    document.getElementById("bijbeltraining-scherm").style.display = "none";
    vulVuBoeken();
    document.getElementById("vu-boek-scherm").style.display = "flex";
}

// Vult het Vragen & uitleg-keuzescherm met ALLE boeken uit boekNaarKey (i.p.v.
// alleen de vier evangeliën die statisch in index.html staan). Zelfde defensieve
// aanpak als vulOefenBoeken(): het vindt de bestaande boekknoppen via hun
// onclick (kiesVuBoek) en neemt hun opmaak/plek over; de Terug-knop blijft
// staan. Vindt het niets herkenbaars, dan laat het het scherm ongemoeid. Bouwt
// maar één keer op (dataset-vlag) en maakt de lijst scrollbaar, want 18 boeken
// passen anders niet zoals 4 dat deden.
function vulVuBoeken() {
    const scherm = document.getElementById("vu-boek-scherm");
    if (!scherm) return;

    // Ondertitel bijwerken: het zijn niet meer alleen evangeliën.
    scherm.querySelectorAll("*").forEach((el) => {
        if (el.children.length === 0 && el.textContent.trim() === "Kies een evangelie") {
            el.textContent = "Kies een boek";
        }
    });

    const knoppen = Array.from(scherm.querySelectorAll("button"));
    const isBoekKnop = (b) => (b.getAttribute("onclick") || "").includes("kiesVuBoek");
    const isTerugKnop = (b) => (b.getAttribute("onclick") || "").includes("sluitVuBoek");

    const boekKnoppen = knoppen.filter(isBoekKnop);
    if (boekKnoppen.length === 0) return;            // onbekende opmaak: niets doen

    const template = boekKnoppen[0];
    const ouder = template.parentElement;
    if (!ouder || ouder.dataset.vuVol === "1") return;      // al aangevuld

    const klasse = template.className;
    // Bewust de LAATSTE Terug-knop: er staat er ook één bovenaan, en de boeken
    // horen daartussenin. Met find() zou de bovenste gevonden worden en belandde
    // de hele lijst daarboven.
    const terugKnop = knoppen.filter(isTerugKnop).pop();

    // Oude (statische) boekknoppen weghalen; Terug blijft behouden.
    boekKnoppen.forEach((b) => b.remove());

    // Alle 18 boeken toevoegen, in de vaste volgorde van boekNaarKey, vóór Terug.
    Object.keys(boekNaarKey).forEach((boek) => {
        const knop = document.createElement("button");
        knop.className = klasse;
        knop.textContent = boek;
        knop.onclick = () => kiesVuBoek(boek);
        if (terugKnop && terugKnop.parentElement === ouder) {
            ouder.insertBefore(knop, terugKnop);
        } else {
            ouder.appendChild(knop);
        }
    });

    // Lijst scrollbaar maken zodat alle boeken op één scherm passen.
    ouder.style.maxHeight = "72vh";
    ouder.style.overflowY = "auto";

    ouder.dataset.vuVol = "1";
}
// Evangelie-keuze -> terug naar Bijbeltraining
function sluitVuBoek() {
    document.getElementById("vu-boek-scherm").style.display = "none";
    document.getElementById("bijbeltraining-scherm").style.display = "flex";
}
// Evangelie gekozen -> niveau-keuze (titel toont het boek)
function kiesVuBoek(boek) {
    vuBoek = boek;
    const titel = document.getElementById("vu-niveau-titel");
    if (titel) titel.textContent = boek;
    document.getElementById("vu-boek-scherm").style.display = "none";
    document.getElementById("vu-niveau-scherm").style.display = "flex";
}
// Niveau-keuze -> terug naar evangelie-keuze
function terugVuNiveau() {
    document.getElementById("vu-niveau-scherm").style.display = "none";
    document.getElementById("vu-boek-scherm").style.display = "flex";
}
// Niveau gekozen -> de lijst bouwen en tonen.
function kiesVuNiveau(niveau) {
    vuNiveau = niveau;
    bouwVuLijst();
    document.getElementById("vu-niveau-scherm").style.display = "none";
    document.getElementById("vu-lijst-scherm").style.display = "flex";
}
// Lijst -> terug naar niveau-keuze
function terugVuLijst() {
    document.getElementById("vu-lijst-scherm").style.display = "none";
    document.getElementById("vu-niveau-scherm").style.display = "flex";
}
// Bouwt de genummerde lijst rechtstreeks uit vragenData[vuBoek][vuNiveau].
// Read-only: leest alleen; kopieert niets. Een 💡-teken markeert vragen met uitleg.
function bouwVuLijst() {
    const titel = document.getElementById("vu-lijst-titel");
    if (titel) titel.textContent = `${vuBoek} – ${niveauLabels[vuNiveau]}`;

    const houder = document.getElementById("vu-lijst");
    if (!houder) return;
    houder.innerHTML = "";

    const pool = (vragenData[vuBoek] && vragenData[vuBoek][vuNiveau]) || [];
    pool.forEach((q, i) => {
        const rij = document.createElement("button");
        rij.type = "button";
        rij.className = "vu-item";
        rij.onclick = () => openVuDetail(i);
        const merk = q.uitleg ? ' <span class="vu-merk">💡 uitleg</span>' : "";
        rij.innerHTML = `<span class="vu-nr">${i + 1}.</span><span class="vu-vraag">${q.vraag}</span>${merk}`;
        houder.appendChild(rij);
    });
}
// Opent de uitlegpagina voor één vraag uit de huidige lijst. Read-only: leest
// rechtstreeks uit vragenData. Toont vraag, juist antwoord, bijbelplaats en
// (optioneel) de uitleg.
function openVuDetail(index) {
    const pool = (vragenData[vuBoek] && vragenData[vuBoek][vuNiveau]) || [];
    const q = pool[index];
    if (!q) return;

    let html = `<h3 class="naslag-kop">${q.vraag}</h3>`;
    html += `<p class="naslag-item"><span class="naslag-term">Juiste antwoord:</span> ${q.correct}</p>`;
    if (q.bijbelplaats) {
        html += `<div class="bijbelplaats">Lees het na in: ${q.bijbelplaats}</div>`;
    }
    if (q.uitleg) {
        // Splits de uitleg op LEGE regels (blanco regel = nieuwe alinea), zodat
        // langere teksten met nette witregels tussen de alinea's verschijnen.
        // Een losse regelafbreking bínnen een alinea splitst dus niet.
        const alineas = q.uitleg.split(/\n\s*\n/).filter((a) => a.trim() !== "");
        html += `<div class="uitleg">` + alineas.map((a) => `<p>${a}</p>`).join("") + `</div>`;
    } else {
        html += `<div class="vu-geen-uitleg">Nog geen extra uitleg bij deze vraag.</div>`;
    }

    const houder = document.getElementById("vu-detail");
    if (houder) houder.innerHTML = html;

    document.getElementById("vu-lijst-scherm").style.display = "none";
    document.getElementById("vu-detail-scherm").style.display = "flex";

    // Bovenaan beginnen (anders blijft de scrollpositie van een vorige vraag staan).
    const box = document.querySelector("#vu-detail-scherm .quiz-box");
    if (box) box.scrollTop = 0;
}
// Uitlegpagina -> terug naar de lijst
function terugVuDetail() {
    document.getElementById("vu-detail-scherm").style.display = "none";
    document.getElementById("vu-lijst-scherm").style.display = "flex";
}

// =========================
// CATECHESE — data-gedreven uitleg-artikelen, los van de quiz.
// Navigatie als "Vragen & uitleg": categorie -> artikel-lijst -> artikel-detail.
// Categorieën en artikelen staan in config-arrays; inhoud toevoegen of hernoemen
// kan dus zonder de layout aan te raken. Elk artikel heeft een 'id', zodat er
// later vanuit de uitleg-bij-een-vraag naartoe gelinkt kan worden.
// =========================

// Categorieën — vrij aan te passen / te hernoemen / uit te breiden.
const catecheseCategorieen = [
    "Verborgen getallen",
    "Verborgen patronen"
];

// Artikelen — elk hoort via 'categorie' bij precies één categorie hierboven (let
// op de exacte schrijfwijze). 'tekst' mag meerdere alinea's bevatten, gescheiden
// door een LEGE regel. 'id' is de sleutel voor latere "Meer hierover ->"-links.
const catecheseArtikelen = [
    {
        id: "verborgen-getallen-153",
        categorie: "Verborgen getallen",
        titel: "De 153 vissen",
        tekst: `Na zijn opstanding liet Jezus zich aan zijn leerlingen zien bij het meer. Ze hadden de hele nacht gevist en niets gevangen. Op Jezus' woord gooiden ze het net nóg een keer uit — en nu zat het zó vol dat ze het bijna niet aan land kregen. Toen ze de vissen telden, waren het er precies honderddrieënvijftig. En het mooie: hoe vol het net ook zat, het scheurde niet (Johannes 21).

Waarom zou Johannes zo'n precies getal opschrijven? Johannes is namelijk een schrijver die van verborgen lagen houdt: in zijn evangelie zit vaak een diepere betekenis onder de oppervlakte. En bij dit getal hebben uitleggers door de eeuwen heen iets bijzonders gezien.

Volgens oude kerkelijke overlevering dacht men vroeger dat er precies 153 soorten vissen in de zee bestonden — élke soort die er was. Het beeld werd dan: het net van het evangelie haalt mensen binnen uit élk volk, uit de hele wereld. De blijde boodschap is niet voor één groep, maar voor iedereen.

En dat het net niet scheurde? Ook dat lazen ze als een boodschap: in dat ene net is plaats voor allemaal, en er gaat niemand verloren.

Sommige uitleggers, zoals Augustinus, keken naar het getal zelf. 153 is namelijk de optelsom van alle getallen van 1 tot en met 17 (1 + 2 + 3 + … + 17 = 153). En 17, zeiden zij, is 10 + 7: de tien geboden plus de zeven gaven van Gods Geest. Zo werd 153 een teken van álle mensen die bij God horen — door zijn wet én door zijn genade.

Er zit zelfs nog een wiskundig wonder in: 153 is óók gelijk aan 1×1×1 + 5×5×5 + 3×3×3 (dat is 1 + 125 + 27). Een getal dat zó keurig in elkaar past, voelt niet zomaar gekozen.

Belangrijk om te weten: deze betekenissen staan niet allemaal letterlijk in de Bijbel — het zijn uitleggingen die door de eeuwen heen zijn ontstaan. Maar ze laten prachtig zien hoe gelovigen in zo'n klein detail een grote boodschap ontdekten: het goede nieuws van Jezus is bestemd voor de hele wereld.`
    },
    {
        id: "verborgen-patronen-paulus-brieven",
        categorie: "Verborgen patronen",
        titel: "De verborgen schat in de brieven van Paulus",
        tekst: `Heb je je weleens afgevraagd waarom de brieven van Paulus in de Bijbel in deze volgorde staan? Het is niet de volgorde waarin hij ze schreef. De brieven zijn ongeveer gerangschikt op lengte: de langste (de brief aan de Romeinen) staat vooraan, en zo wordt het steeds korter, tot het kleine briefje aan Filemon achteraan. Eerst komen de brieven aan gemeenten, daarna de brieven aan personen.

Maar er gebeurt iets moois als je de brieven anders leest — niet op lengte, maar op tijd. Op de volgorde waarin Paulus ze schreef, van zijn eerste jaren als apostel tot vlak voor zijn dood. Dan ontdek je een patroon dat je anders nooit zou zien. Een soort verborgen schat.

Vroeg in zijn leven, in de eerste brief aan de Korintiërs (rond het jaar 54), schrijft Paulus: "Want ik ben de minste van de apostelen." (1 Korintiërs 15:9). De minste van de apostelen — dat is al nederig. En er zijn maar twaalf apostelen, dus dat is nog een kleine groep om de laagste van te zijn.

Jaren later, als hij gevangenzit in Rome, schrijft hij in de brief aan de Efeziërs (rond het jaar 60): "Mij, de allerminste van alle gelovigen…" (Efeziërs 3:8). Nu is hij niet meer de minste van de apostelen, maar de minste van alle gelovigen. De groep is veel groter geworden, en Paulus zet zichzelf onderaan.

En helemaal aan het einde van zijn leven, in de eerste brief aan Timoteüs (rond het jaar 64), schrijft hij: "Christus Jezus is in de wereld gekomen om zondaars te redden, en ik ben de grootste van hen." (1 Timoteüs 1:15). Niet meer de minste apostel, niet meer de minste gelovige, maar de grootste van alle zondaars.

Zie je het patroon? Hoe ouder Paulus werd en hoe dichter hij bij God leefde, hoe kleiner hij zichzelf maakte. Dat lijkt misschien gek — je zou denken dat iemand die zoveel voor God deed juist trotser zou worden. Maar bij Paulus is het andersom. Hoe meer hij Gods liefde leerde kennen, hoe duidelijker hij zag hoe groot die genade voor hém was.

En let op iets belangrijks: Paulus bleef gewoon apostel. Hij heeft die taak nooit weggegooid. Hij hield twee dingen tegelijk vast — "ik ben een apostel van Jezus Christus" én "ik ben de grootste zondaar". Dat spreekt elkaar niet tegen. Je mag weten wie je in God bent, en tegelijk klein blijven voor Hem.

Paulus zegt dit nergens hardop. Hij schrijft niet: "let op, ik word steeds nederiger." Je ontdekt het pas als je zijn brieven naast elkaar legt op volgorde van tijd. Daarom is het echt een verborgen schat: hij ligt verstopt in de volgorde, en je vindt hem alleen als je goed zoekt.

Eén ding om eerlijk bij te zeggen: de jaartallen hierboven zijn ongeveer — geleerden weten niet op de dag nauwkeurig wanneer Paulus elke brief schreef. En dat Paulus "steeds nederiger" werd, is iets wat wij ontdekken als we de brieven op tijd ordenen; het is een prachtige ontdekking, geen regel die zo in de Bijbel staat. Maar de drie teksten zijn er echt, en ze zijn in deze volgorde geschreven. Dat maakt het zo bijzonder.

Word jij van binnen groter of kleiner naarmate je meer leert? Paulus laat zien dat echt dichtbij God komen je juist nederig maakt — niet omdat je niks waard bent, maar omdat je steeds beter ziet hoe groot Gods liefde is.`
    },
    {
        id: "verborgen-patronen-sandwich",
        categorie: "Verborgen patronen",
        titel: "De sandwich-techniek van Marcus",
        tekst: `Marcus blijkt een knappe verteller. Hij begint een verhaal, schuift er een tweede verhaal tussen, en pakt dan de draad van het eerste weer op — net als twee boterhammen met beleg ertussen. Geleerden noemen dit de sandwich-techniek (met een moeilijk woord: intercalatie).

Het mooiste inzicht: de nadruk ligt meestal op het verhaal ín het midden — net als bij een echte sandwich is het beleg waar het om draait. Dat binnenste verhaal is vaak de sleutel tot de betekenis, en de twee verhalen eromheen helpen je dat te begrijpen.

Bij Jaïrus en de zieke vrouw (Marcus 5) staat zo het geloof van de vrouw in het midden, met een knipoog: het getal twaalf komt in beide verhalen terug — de vrouw is twaalf jaar ziek, het meisje twaalf jaar oud. Een ander bekend voorbeeld is de tempelreiniging, ingeklemd tussen de vervloeking en het verdorren van een vijgenboom (Marcus 11).

Zo blijkt dat Marcus zijn evangelie zorgvuldig heeft opgebouwd — niet als losse verhalen, maar als één doordacht geheel. Kun jij nog een sandwich vinden als je Marcus leest?`
    }
];

// Huidig gekozen categorie (voor de artikel-lijst en de Terug-knoppen).
let catecheseCategorie = null;

// Vanwaar het artikel-detail is geopend: null = normaal (vanuit de lijst), of
// "vs-reveal" = vanuit de Verborgen-Schat-onthullingskaart. Bepaalt waar de
// Terug-knop in het artikel naartoe gaat, zodat een lopende VS-ronde niet breekt.
let catecheseArtikelHerkomst = null;

// Bijbeltraining -> Catechese-landing
function openCatechese() {
    document.getElementById("bijbeltraining-scherm").style.display = "none";
    bouwCatecheseCategorieen();
    document.getElementById("catechese-scherm").style.display = "flex";
}
// Catechese-landing -> terug naar Bijbeltraining
function sluitCatechese() {
    document.getElementById("catechese-scherm").style.display = "none";
    document.getElementById("bijbeltraining-scherm").style.display = "flex";
}
// Bouwt de categorie-knoppen uit de config-array (boekenkeuze-stijl). Alle
// categorieën in catecheseCategorieen hebben echte artikelen, dus ze zijn
// allemaal gewoon klikbaar.
function bouwCatecheseCategorieen() {
    const houder = document.getElementById("catechese-categorieen");
    if (!houder) return;
    houder.innerHTML = "";
    catecheseCategorieen.forEach((categorie) => {
        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "answer-btn niveau-btn catechese-knop";
        knop.textContent = categorie;
        knop.onclick = () => kiesCatecheseCategorie(categorie);
        houder.appendChild(knop);
    });
}
// Categorie gekozen -> artikel-lijst bouwen en tonen.
function kiesCatecheseCategorie(categorie) {
    catecheseCategorie = categorie;
    bouwCatecheseLijst();
    document.getElementById("catechese-scherm").style.display = "none";
    document.getElementById("catechese-lijst-scherm").style.display = "flex";
}
// Artikel-lijst -> terug naar de categorieën.
function terugCatecheseLijst() {
    document.getElementById("catechese-lijst-scherm").style.display = "none";
    document.getElementById("catechese-scherm").style.display = "flex";
}
// Bouwt de artikel-lijst van de huidige categorie (gefilterd uit catecheseArtikelen).
function bouwCatecheseLijst() {
    const titel = document.getElementById("catechese-lijst-titel");
    if (titel) titel.textContent = catecheseCategorie;

    const houder = document.getElementById("catechese-lijst");
    if (!houder) return;
    houder.innerHTML = "";

    const artikelen = catecheseArtikelen.filter((a) => a.categorie === catecheseCategorie);
    if (artikelen.length === 0) {
        houder.innerHTML = `<div class="vu-geen-uitleg">Voor dit onderwerp komen binnenkort artikelen.</div>`;
        return;
    }
    artikelen.forEach((a) => {
        const rij = document.createElement("button");
        rij.type = "button";
        rij.className = "vu-item";
        rij.onclick = () => openCatecheseArtikel(a.id);
        rij.innerHTML = `<span class="vu-vraag">${a.titel}</span>`;
        houder.appendChild(rij);
    });
}
// Opent één artikel op 'id'. Geschikt voor latere deep-links vanuit een vraag-
// uitleg ("Meer hierover ->"): roep gewoon openCatecheseArtikel(id) aan. De
// categorie wordt meegezet, zodat de Terug-knop naar de juiste lijst gaat.
function openCatecheseArtikel(id, herkomst) {
    const a = catecheseArtikelen.find((art) => art.id === id);
    if (!a) return;
    catecheseCategorie = a.categorie;
    catecheseArtikelHerkomst = herkomst || null;

    let html = `<h3 class="naslag-kop">${a.titel}</h3>`;
    const alineas = (a.tekst || "").split(/\n\s*\n/).filter((s) => s.trim() !== "");
    html += `<div class="uitleg">` + alineas.map((s) => `<p>${s}</p>`).join("") + `</div>`;

    const houder = document.getElementById("catechese-artikel");
    if (houder) houder.innerHTML = html;

    document.getElementById("catechese-lijst-scherm").style.display = "none";
    document.getElementById("catechese-artikel-scherm").style.display = "flex";

    // Bovenaan beginnen, anders blijft de scrollpositie van een vorig artikel staan.
    const box = document.querySelector("#catechese-artikel-scherm .quiz-box");
    if (box) box.scrollTop = 0;
}
// Artikel-detail -> terug. Normaal naar de artikel-lijst; maar als het artikel
// vanuit de Verborgen-Schat-kaart werd geopend, keren we daar netjes naar terug,
// zodat het kind de ronde gewoon kan vervolgen met "Volgende ->".
function terugCatecheseArtikel() {
    document.getElementById("catechese-artikel-scherm").style.display = "none";
    if (catecheseArtikelHerkomst === "vs-reveal") {
        catecheseArtikelHerkomst = null;
        document.getElementById("vs-reveal-scherm").style.display = "flex";
    } else {
        document.getElementById("catechese-lijst-scherm").style.display = "flex";
    }
}

// =========================
// SCHATKAMER (TROFEEËNKAMER) — config-gedreven en herbruikbaar
// Eigen scherm dat de verdiende trofeeën van één vitrine toont. Zelfde aan/uit-
// patroon als de andere overlays. De win-logica (trofee_<boek>) blijft
// ongemoeid; dit scherm leest die data alleen uit localStorage.
//
// Eén vitrine = één config-object (hieronder). bouwVitrine() bouwt de inhoud
// volledig uit dat object op. Een tweede vitrine is dus puur een extra config-
// object met dezelfde vorm; er is geen nieuwe code nodig.
//
// Vorm van een config-object:
//   achtergrond  : pad naar de achtergrondafbeelding van de vitrine
//   trofeeBodem  : verticale bodem van de trofeeën (% van de vitrinehoogte)
//   naamMidden   : verticaal midden van de naamplaten (% vanaf boven)
//   naamBreedte  : breedte van het naamvak (%)
//   naamHoogte   : hoogte van het naamvak (%)
//   nissen[]     : per nis (links → rechts):
//       x          : horizontaal midden van de nis (%)
//       trofeeHoogte: hoogte van de trofee (% van de vitrinehoogte)
//       naamX      : horizontaal midden van de naamplaat (%)
//       naamGrootte: lettergrootte van de naam (CSS-waarde)
//       naam       : tekst op de naamplaat
//       sleutel    : localStorage-sleutel met de stand (geen/brons/zilver/goud)
//       basis      : basisnaam van de afbeelding; -<stand>.png volgt daaruit
//
// Optionele velden (gebruikt door de nieuwe NT-vitrines; alle vijf vitrines
// tekenen nu hun boeknamen als losse .sk-naam-labels uit de config):
//   verhouding       : aspect-ratio van de vitrine-doos (CSS-waarde, bv.
//                      "3 / 4" voor staande kunst). Weggelaten = 16:9 liggend.
//                      De doos krijgt deze verhouding zodat 'cover' de
//                      achtergrond zonder vervorming vult.
//   naamInAchtergrond: true = de boeknamen staan al in de achtergrondafbeelding
//                      gebakken; bouwVitrine tekent dan geen losse naamplaten
//                      (voorkomt dubbele namen). De naamX/naamGrootte-velden
//                      blijven staan zodat losse labels later weer aan kunnen.
//   placeholderTitel : titel op het donkere placeholder-paneel zolang de
//                      achtergrondafbeelding nog niet bestaat
//   sfeer            : "altaar" geeft de vitrine een lichtinval-gloed (CSS)
//   schaduwBijGeen   : true = bij stand "geen" een donker silhouet tonen in
//                      plaats van de trofee te verbergen (voor vitrines zonder
//                      geschilderde lege sokkels in de achtergrond)
//   kleurViaFilter   : true = altijd de zilveren basisafbeelding laden en de
//                      stand via CSS-filters kleuren (zoals de prijzenkast op
//                      het startscherm). Nieuwe boeken hebben dan maar één
//                      afbeelding nodig: images/<basis>-zilver.png
//   per nis optioneel:
//       bodem  : eigen bodem (%) — overschrijft trofeeBodem (voor twee rijen)
//       naamY  : eigen verticaal midden van de naamplaat — overschrijft
//                naamMidden (voor twee rijen)
// =========================
// Naamloze 2x2-kunst (lege borden) -> de boeknamen komen nu als losse
// .sk-naam-labels uit de config, net als bij de andere vier vitrines (i18n).
// Geometrie overgenomen van algemeneBrievenVitrine (zelfde 3:4 2x2-opzet);
// posities zijn ruw — fijn afstellen met ?afstel=aan.
const evangelienVitrine = {
    achtergrond: "images/vitrine-evangelien.webp",
    verhouding: "3 / 4",                     // staande 2x2-kunst i.p.v. de standaard 16:9
    trofeeBodem: "12%",                      // onderste rij
    naamMidden:  "94%",                      // naamplaten onderste rij
    naamBreedte: "34%",
    naamHoogte:  "5%",
    nissen: [
        // Bovenste rij (2) — trofee- én labelposities afgesteld.
        { x: "31.18%", trofeeHoogte: "22%", bodem: "47.68%", naamX: "31.77%", naamY: "57.44%", naamGrootte: "1.98cqi", naam: "Matteüs",  sleutel: "trofee_matteus",  basis: "matteus"  },
        { x: "68.1%",  trofeeHoogte: "22%", bodem: "47.35%", naamX: "68.38%", naamY: "57.33%", naamGrootte: "1.98cqi", naam: "Marcus",   sleutel: "trofee_marcus",   basis: "marcus"   },
        // Onderste rij (2)
        { x: "31.18%", trofeeHoogte: "22%", bodem: "11.67%", naamX: "31.33%", naamY: "93.23%", naamGrootte: "1.98cqi", naam: "Lucas",    sleutel: "trofee_lucas",    basis: "lucas"    },
        { x: "67.81%", trofeeHoogte: "22%", bodem: "11.79%", naamX: "68.25%", naamY: "93.24%", naamGrootte: "1.98cqi", naam: "Johannes", sleutel: "trofee_johannes", basis: "johannes" }
    ]
};

// =========================
// SLEUTELCONVENTIE NT-BOEKEN — GEBUNDELD SCHEMA
// Bron: images/trofee-overzicht.md. De NT-zaal toont 14 trofeeën, waarbij
// dubbele en korte boeken zijn gebundeld tot één trofee (zodat elke
// vragenpool genoeg stof heeft). Elke trofee bewaart zijn stand in
// localStorage onder `trofee_<sleutel>` met waarde geen/brons/zilver/goud.
// De sleutel is kleine letters, geen spaties; bundels koppelen met een
// liggend streepje in de bestandsnaam en een underscore in de sleutel:
//   Korintiërs            -> korintiers-zilver.png         / trofee_korintiers
//   Kolossenzen & Filemon -> kolossenzen-filemon-zilver.png/ trofee_kolossenzen_filemon
//   Tessalonicenzen       -> tessalonicenzen-zilver.png    / trofee_tessalonicenzen
//   Timoteüs & Titus      -> timoteus-titus-zilver.png     / trofee_timoteus_titus
//   Petrus & Judas        -> petrus-judas-zilver.png       / trofee_petrus_judas
//   Brieven van Johannes  -> johannesbrieven-zilver.png    / trofee_johannesbrieven
// De `basis` in de config = de bestandsnaam zonder "-zilver.png".
// =========================

// --- Handelingen: één ereplek op een sokkel, centraal. Lege niche toont de
//     geschilderde sokkel (geen schaduwBijGeen); ruwe posities, fijn met afstel. ---
const handelingenVitrine = {
    achtergrond: "images/vitrine-handelingen.webp",
    placeholderTitel: "Handelingen",
    kleurViaFilter: true,
    trofeeBodem: "37%",
    naamMidden:  "88%",
    naamBreedte: "24%",
    naamHoogte:  "7%",
    nissen: [
        { x: "49.57%", trofeeHoogte: "42%", bodem: "26.22%", naamX: "49.7%", naamY: "90.83%", naamGrootte: "1.41cqi", naam: "Handelingen", sleutel: "trofee_handelingen", basis: "handelingen" }
    ]
};

// --- Paulusbrieven: gebundeld tot 8 trofeeën (zie trofee-overzicht.md),
//     in twee rijen van 4. Posities zijn voorlopig/benaderend — exact
//     uitlijnen op de geschilderde nissen gebeurt later in DevTools. ---
const paulusbrievenVitrine = {
    achtergrond: "images/vitrine-paulusbrieven.webp",
    placeholderTitel: "Paulusbrieven",
    kleurViaFilter: true,
    trofeeBodem: "14%",                       // onderste rij
    naamMidden:  "89%",                       // naamplaten onderste rij
    naamBreedte: "16%",
    naamHoogte:  "5%",
    nissen: [
        // Bovenste rij (4) — trofee- én labelposities afgesteld.
        { x: "21.29%", trofeeHoogte: "26%", bodem: "57.09%", naamX: "21.6%",  naamY: "48.96%", naamGrootte: "0.78cqi", naam: "Romeinen",       sleutel: "trofee_romeinen",            basis: "romeinen"            },
        { x: "39.55%", trofeeHoogte: "26%", bodem: "57.19%", naamX: "39.61%", naamY: "48.84%", naamGrootte: "0.83cqi", naam: "Korintiërs",     sleutel: "trofee_korintiers",          basis: "korintiers"          },
        { x: "59.96%", trofeeHoogte: "26%", bodem: "56.87%", naamX: "60.08%", naamY: "48.96%", naamGrootte: "0.94cqi", naam: "Galaten",        sleutel: "trofee_galaten",             basis: "galaten"             },
        { x: "78.1%",  trofeeHoogte: "26%", bodem: "57.2%",  naamX: "78.16%", naamY: "48.96%", naamGrootte: "0.89cqi", naam: "Efeziërs",       sleutel: "trofee_efeziers",            basis: "efeziers"            },
        // Onderste rij (4). "Kolossenzen" = Kol + Filemon; "Timoteüs" = 1-2 Tim + Titus (korte labels).
        { x: "21.52%", trofeeHoogte: "26%", bodem: "13.24%", naamX: "21.41%", naamY: "93.24%", naamGrootte: "0.83cqi", naam: "Filippenzen",    sleutel: "trofee_filippenzen",         basis: "filippenzen"         },
        { x: "39.43%", trofeeHoogte: "26%", bodem: "13.56%", naamX: "39.49%", naamY: "93.46%", naamGrootte: "0.78cqi", naam: "Kolossenzen",    sleutel: "trofee_kolossenzen_filemon", basis: "kolossenzen-filemon" },
        { x: "61.06%", trofeeHoogte: "26%", bodem: "13.67%", naamX: "59.78%", naamY: "93.24%", naamGrootte: "0.68cqi", naam: "Tessalonicenzen", sleutel: "trofee_tessalonicenzen",    basis: "tessalonicenzen"     },
        { x: "78.04%", trofeeHoogte: "26%", bodem: "12.91%", naamX: "78.48%", naamY: "93.35%", naamGrootte: "0.78cqi", naam: "Timoteüs",       sleutel: "trofee_timoteus_titus",      basis: "timoteus-titus"      }
    ]
};

// --- Algemene brieven: gebundeld tot 4 trofeeën (zie trofee-overzicht.md),
//     2x2-raster op staande (3:4) kunst. Lege niche toont de geschilderde
//     sokkel; posities ruw, fijn met afstel. "1-3 Johannes" = de drie
//     Johannesbrieven (sleutel trofee_johannesbrieven, NIET trofee_johannes). ---
const algemeneBrievenVitrine = {
    achtergrond: "images/vitrine-algemenebrieven.webp",
    verhouding: "3 / 4",                      // staande 2x2-kunst (zoals evangelienVitrine)
    placeholderTitel: "Algemene brieven",
    kleurViaFilter: true,
    trofeeBodem: "12%",                       // onderste rij
    naamMidden:  "94%",                       // naamplaten onderste rij
    naamBreedte: "34%",
    naamHoogte:  "5%",
    nissen: [
        // Bovenste rij (2) — trofee- én labelposities afgesteld.
        { x: "31.32%", trofeeHoogte: "22%", bodem: "47.24%", naamX: "31.03%", naamY: "57.87%", naamGrootte: "1.98cqi", naam: "Hebreeën",      sleutel: "trofee_hebreeen",        basis: "hebreeen"        },
        { x: "68.1%",  trofeeHoogte: "22%", bodem: "47.13%", naamX: "68.1%",  naamY: "57.87%", naamGrootte: "1.98cqi", naam: "Jakobus",       sleutel: "trofee_jakobus",         basis: "jakobus"         },
        // Onderste rij (2)
        { x: "30.74%", trofeeHoogte: "22%", bodem: "11.56%", naamX: "30.6%", naamY: "94.87%", naamGrootte: "1.48cqi", naam: "Petrus & Judas", sleutel: "trofee_petrus_judas",    basis: "petrus-judas"    },
        { x: "67.37%", trofeeHoogte: "22%", bodem: "11.46%", naamX: "68.1%", naamY: "94.76%", naamGrootte: "1.60cqi", naam: "1-3 Johannes",   sleutel: "trofee_johannesbrieven", basis: "johannesbrieven" }
    ]
};

// --- Openbaring: ereplaats — verhoogd altaar met lichtinval (sfeer-klasse).
//     Lege niche toont de geschilderde sokkel; ruwe posities, fijn met afstel. ---
const openbaringVitrine = {
    achtergrond: "images/vitrine-openbaring.webp",
    placeholderTitel: "Openbaring",
    sfeer: "altaar",
    kleurViaFilter: true,
    trofeeBodem: "28%",
    naamMidden:  "89%",
    naamBreedte: "24%",
    naamHoogte:  "7%",
    nissen: [
        { x: "49.39%", trofeeHoogte: "44%", bodem: "23.21%", naamX: "49.63%", naamY: "89.87%", naamGrootte: "1.35cqi", naam: "Openbaring", sleutel: "trofee_openbaring", basis: "openbaring" }
    ]
};

// Leest een trofee-stand rechtstreeks uit localStorage op de gegeven sleutel.
// Onbekende/ontbrekende waarde -> "geen". Verandert niets aan de win-logica;
// gebruikt alleen dezelfde volgorde-lijst (trofeeVolgorde) ter validatie.
function leesTrofeeStand(sleutel) {
    if (demoNiveau) return demoNiveau;       // demo-modus: alles behaald tonen
    // De config levert de basissleutel (bv. "trofee_openbaring"); prefixen naar
    // het actieve profiel zodat de NT-kast dezelfde per-profiel-stand toont als
    // de rest van het spel.
    const stand = localStorage.getItem(profielSleutel(sleutel));
    return trofeeVolgorde.includes(stand) ? stand : "geen";
}

// Zet een achtergrondafbeelding op een schatkamer-element, met een nette
// terugval zolang het bestand nog niet bestaat: dan verschijnt het donkere
// huisstijl-paneel (.sk-placeholder in CSS) met de titel erin. Zodra de
// definitieve afbeelding in images/ wordt geplaatst, laadt hij vanzelf —
// zonder codewijziging (zie ook afbeeldingen-takenlijst.md).
function zetSchatkamerAchtergrond(el, pad, titel) {
    el.dataset.placeholderTitel = titel || "";
    el.classList.remove("sk-placeholder");
    el.style.backgroundImage = `url("${pad}")`;

    const proef = new Image();
    proef.onerror = () => {
        el.style.backgroundImage = "";           // terug naar de CSS-laag
        el.classList.add("sk-placeholder");
    };
    proef.src = pad;
}

// Vervangt een trofee-afbeelding waarvan het bestand (nog) niet bestaat door
// een generiek donker schaduwsilhouet (puur CSS, zie .sk-trofee-silhouet).
// Positie en hoogte worden overgenomen, zodat het silhouet exact in de nis
// staat waar straks de echte trofee komt.
function vervangDoorSilhouet(img) {
    const silhouet = document.createElement("div");
    silhouet.className = "sk-trofee-silhouet";
    silhouet.style.left = img.style.left;
    silhouet.style.height = img.style.height;
    if (img.style.bottom) silhouet.style.bottom = img.style.bottom;
    img.replaceWith(silhouet);
}

// Bouwt de inhoud van een vitrine-element volledig op uit een config-object.
// Per nis: stand uit localStorage -> "geen" = lege sokkel (trofee verbergen),
// brons/zilver/goud = het bijbehorende plaatje op de sokkel.
// Bij schaduwBijGeen toont "geen" een donker silhouet; bij kleurViaFilter
// wordt altijd de zilveren basis geladen en kleurt CSS de stand (zie de
// optionele velden in het commentaarblok hierboven).
// De vitrine die nu in beeld is — gebruikt door de afstel-export (TAAK B).
let actieveVitrineConfig = null;

function bouwVitrine(vitrineEl, config) {
    if (!vitrineEl) return;

    // Achtergrond (met placeholder-terugval) + gedeelde maten als inline
    // CSS-variabelen (per vitrine). De sfeer-klasse stuurt extra gloed aan.
    zetSchatkamerAchtergrond(vitrineEl, config.achtergrond, config.placeholderTitel || "");
    vitrineEl.classList.toggle("sk-sfeer-altaar", config.sfeer === "altaar");
    vitrineEl.style.setProperty("--trofee-bodem", config.trofeeBodem);
    vitrineEl.style.setProperty("--naam-midden",  config.naamMidden);
    vitrineEl.style.setProperty("--naam-breedte", config.naamBreedte);
    vitrineEl.style.setProperty("--naam-hoogte",  config.naamHoogte);
    vitrineEl.style.setProperty("--vitrine-verhouding", config.verhouding || "16 / 9");
    vitrineEl.classList.toggle("afstel", afstelModus);  // trofeeën sleepbaar in ?afstel=aan
    actieveVitrineConfig = config;               // welke vitrine de afstel-export exporteert

    const houder = vitrineEl.querySelector(".sk-nissen");
    if (!houder) return;
    houder.innerHTML = "";                       // schoon herbouwen bij elk openen

    config.nissen.forEach((nis, i) => {
        // In afstelmodus alle nissen als goud tonen (display-only, net als de
        // zaal) zodat je elke trofee kunt positioneren; de stand in localStorage
        // blijft ongemoeid.
        const niveau = afstelModus ? "goud" : leesTrofeeStand(nis.sleutel); // "geen"|"brons"|"zilver"|"goud"

        // Sokkel-trofee. Positie (left) en hoogte komen inline uit de config;
        // een optionele per-nis bodem maakt meerdere rijen mogelijk.
        const img = document.createElement("img");
        img.className = "sk-trofee";
        img.alt = nis.naam;
        img.style.left = nis.x;
        img.style.height = nis.trofeeHoogte;
        if (nis.bodem) img.style.bottom = nis.bodem;
        else if (afstelModus) img.style.bottom = config.trofeeBodem; // concreet startpunt voor verticaal slepen
        if (afstelModus) {
            img.dataset.afstelNaam = nis.naam;   // label in het afstel-paneel
            img.dataset.nisIndex = i;            // koppeling terug naar config.nissen[i]
        }

        if (niveau === "geen" && !config.schaduwBijGeen) {
            img.hidden = true;                   // lege sokkel uit de achtergrond blijft staan
        } else if (config.kleurViaFilter || niveau === "geen") {
            // Eén basisafbeelding; de stand (of het silhouet) komt uit CSS.
            img.src = `images/${nis.basis}-zilver.webp`;
            img.classList.add(niveau === "geen" ? "sk-schaduw" : niveau);
        } else {
            img.src = `images/${nis.basis}-${niveau}.webp`;
        }

        // Bestaat de afbeelding (nog) niet -> generiek schaduwsilhouet.
        if (!img.hidden) {
            img.addEventListener("error", () => vervangDoorSilhouet(img));
        }
        houder.appendChild(img);

        // Naamplaat. Horizontale positie en lettergrootte inline uit de config;
        // optionele per-nis naamY voor een tweede rij naamplaten.
        // Bij naamInAchtergrond staan de namen al in de achtergrondafbeelding
        // gebakken -> geen los label tekenen (anders dubbele namen).
        if (!config.naamInAchtergrond) {
            const naam = document.createElement("div");
            naam.className = "sk-naam";
            naam.textContent = nis.naam;
            naam.style.left = nis.naamX;
            naam.style.fontSize = nis.naamGrootte;
            if (nis.naamY) naam.style.top = nis.naamY;
            else if (afstelModus) naam.style.top = config.naamMidden; // concreet startpunt voor verticaal slepen
            if (afstelModus) {
                naam.dataset.afstelNaam = nis.naam;  // label in het afstel-paneel
                naam.dataset.nisIndex = i;           // koppeling terug naar config.nissen[i]
            }
            houder.appendChild(naam);
        }
    });
}

// =========================
// SCHATKAMER-ZALEN — de inzoombare overzichtszaal (nu: NT-vleugel)
// Eén zaal = één achtergrondafbeelding met klikbare zones (zelfde principe als
// de boek-zones op het startscherm). Elke zone koppelt een klikgebied aan een
// vitrine-config; de voortgang per zone wordt rechtstreeks uit de nissen van
// die vitrine gelezen. Een tweede vleugel (OT) is later puur een extra entry
// in schatkamerZalen — geen nieuwe logica.
//
// Vorm van een zaal: { naam, achtergrond, zones: [ { id, naam, vitrine,
//   klik: { left, top, width, height } (in % van de 16:9-zaal) } ] }
// De klikgebieden zijn uitgelijnd op de geschilderde architectuur van
// zaal-nt.png:
//   - Evangeliënkast links: 2x2 nissen (4).
//   - Paulusgalerij midden: twee rijen arcades, 7 boven en 6 onder (13).
//   - Algemene-brievenwand rechts: 4 rijen x 2 kolommen (8). LET OP: de
//     onderste twee nissen zitten op vloerniveau in de plint van de kast —
//     tel ze niet over het hoofd; daarom loopt deze zone door tot ~81%.
//   - Altaar centraal achterin (Openbaring), sokkel vooraan (Handelingen).
//
// kisten[] (optioneel): de vier schatkisten als decor in de zaal, met
// dezelfde lock/unlock-weergave als op het startscherm (schaduw-PNG voor
// brons/zilver/goud, filterklasse .vergrendeld voor de diamant). Per kist:
//   kist    : "brons" | "zilver" | "goud" | "diamant"
//   x       : horizontaal midden (%)
//   top     : bovenkant (%)
//   breedte : breedte (%) — verder weg in het perspectief = kleiner
//
// nisTrofeeen[] (optioneel, per zone): EXPERIMENT — kleine trofee-weergaven
// ín de geschilderde nissen van de kasten. Eén entry per nis, in dezelfde
// volgorde als vitrine.nissen (zelfde index = zelfde boek). Per nis:
//   x : horizontaal midden (%), top : bovenkant (%), hoogte : hoogte (%).
// Behaald = trofee zichtbaar met niveau-filter; niet behaald = nis blijft
// leeg/donker. Aan/uit via de vlag hieronder.
// =========================

// EXPERIMENT-VLAG: trofeeën in de geschilderde nissen van de zaal tonen.
// true  = zaal met mini-trofeeën in de nissen (plus de munten),
// false = alleen de voortgangsmunten, zoals voorheen.
// Zo kan de maker beide varianten naast elkaar vergelijken.
const ZAAL_NIS_TROFEEEN = true;

// =========================
// AFSTELMODUS — live trofeeposities slepen/bijschuiven (?afstel=aan)
// Alleen actief met ?afstel=aan in de URL. Dan worden alle trofeeën getoond
// en kun je ze met de muis slepen, met pijltjes bijschuiven en met +/-/scroll
// schalen. Wijzigingen worden meteen in localStorage bewaard; bouwZaal past die
// overrides toe — óók in de normale modus — zodat je het resultaat direct ziet.
// Met "Exporteer posities" krijg je de bijgewerkte config om in script.js te
// plakken (de browser kan zelf niet naar het bestand schrijven). Buiten
// afstelmodus is deze hele laag onzichtbaar en gebeurt er niets.
// =========================
const afstelModus = new URLSearchParams(window.location.search).get("afstel") === "aan";
const AFSTEL_OPSLAG = "afstel_zaalposities_v1";

function leesAfstelPosities() {
    try { return JSON.parse(localStorage.getItem(AFSTEL_OPSLAG)) || {}; }
    catch (e) { return {}; }
}
function schrijfAfstelPosities(map) {
    localStorage.setItem(AFSTEL_OPSLAG, JSON.stringify(map));
}
const schatkamerZalen = {
    nt: {
        naam: "Schatkamer — Nieuwe Testament",
        // Nieuwe correcte zaal (8/4/4 nissen). De oude staat als
        // images/zaal-nt-oud.png. Posities van zones/kisten/munten worden in
        // een aparte stap op deze nieuwe architectuur uitgelijnd.
        achtergrond: "images/schatkamer.webp",
        // Posities uitgelijnd op de geschilderde nissen van images/schatkamer.png
        // (x = horizontaal midden, top = bovenkant img, hoogte/breedte in % van
        // de 16:9-zaal). Per nis één trofee, voet op de nisbodem.
        zones: [
            { id: "openbaring",      naam: "Openbaring",       vitrine: openbaringVitrine,      klik: { left: "43%",   top: "10%", width: "14%",   height: "20%" },
              // Grote ere-nis bovenin, onder het roosvenster.
              nisTrofeeen: [
                  { x: "50%", top: "12%", hoogte: "13%" }
              ] },
            { id: "evangelien",      naam: "Evangeliën",       vitrine: evangelienVitrine,      klik: { left: "2.5%",  top: "28%", width: "16%",   height: "40%" },
              // Linkerkast 2x2: [boven-links, boven-rechts, onder-links, onder-rechts]
              nisTrofeeen: [
                  { x: "6.82%",  top: "38.64%", hoogte: "14%" },
                  { x: "13.81%", top: "38.42%", hoogte: "14%" },
                  { x: "6.76%",  top: "58.58%", hoogte: "14%" },
                  { x: "13.63%", top: "58.14%", hoogte: "14%" }
              ] },
            { id: "algemenebrieven", naam: "Algemene brieven", vitrine: algemeneBrievenVitrine, klik: { left: "81.5%", top: "28%", width: "16%",   height: "40%" },
              // Rechterkast 2x2.
              nisTrofeeen: [
                  { x: "86.01%", top: "38.75%", hoogte: "13.6%" },
                  { x: "93.24%", top: "38.31%", hoogte: "14%" },
                  { x: "86.13%", top: "59.13%", hoogte: "12.8%" },
                  { x: "93.06%", top: "58.57%", hoogte: "14.2%" }
              ] },
            { id: "paulusbrieven",   naam: "Paulusbrieven",    vitrine: paulusbrievenVitrine,   klik: { left: "29%",   top: "36%", width: "42%",   height: "30%" },
              klikMarge: { zij: 1.5 },
              // Middenwand 2x4 (bovenste rij 4, onderste rij 4).
              nisTrofeeen: [
                  { x: "36.78%", top: "45.33%", hoogte: "10.2%" },
                  { x: "45.49%", top: "45%",    hoogte: "10.6%" },
                  { x: "54.32%", top: "43.59%", hoogte: "12%" },
                  { x: "63.16%", top: "46.09%", hoogte: "9.4%" },
                  { x: "36.77%", top: "59.75%", hoogte: "9.5%" },
                  { x: "45.37%", top: "59.64%", hoogte: "9.7%" },
                  { x: "54.63%", top: "60.41%", hoogte: "8.9%" },
                  { x: "63.04%", top: "60.07%", hoogte: "9.3%" }
              ] },
            { id: "handelingen",     naam: "Handelingen",      vitrine: handelingenVitrine,     klik: { left: "44%",   top: "29%", width: "12%",   height: "12%" },
              // Kleinere ere-nis boven de Paulus-galerij.
              nisTrofeeen: [
                  { x: "49.94%", top: "31.92%", hoogte: "7.6%" }
              ] }
        ],
        kisten: [
            // Drie niveaukisten op de drie ronde plateaus vooraan (voet op het
            // plateau-oppervlak; middelste plateau ligt iets lager/dichterbij).
            { kist: "brons",   x: "31.08%", top: "77.44%", breedte: "8%" },
            { kist: "zilver",  x: "49.81%", top: "77.39%", breedte: "8%" },
            { kist: "goud",    x: "68.36%", top: "77.44%", breedte: "8%" },
            // Diamanten Verborgen Schat op het verhoogde ronde plateau centraal
            // erachter; klein genoeg om de onderste Paulus-nissen niet te raken.
            { kist: "diamant", x: "49.82%", top: "66.33%", breedte: "6%" }
        ]
    }
};

// Duur van de in-/uitzoom-overgang; gelijk aan de transities in style.css.
const ZOOM_MS = 300;

// Berekent het klikvak van een zone uit de bounding box van zijn trofeenissen,
// zodat het klikgebied altijd op de (al fijngestelde) nissen ligt — één bron van
// waarheid. Optioneel verfijnt zone.klikMarge { top, onder, zij } (in %) de rand.
function berekenKlikvak(zone) {
    const nissen = zone.nisTrofeeen || [];
    if (!nissen.length) return zone.klik;            // terugval op handmatige klik
    const num = (v) => parseFloat(v);                 // "12.5%" -> 12.5
    // Halve trofeebreedte schatten uit de hoogte (trofee ~0,65x zo breed als hoog,
    // omgerekend van een 16:9-zaal naar %-eenheden van de breedte).
    const halveBreedte = (h) => (num(h) * 0.65 * (1080 / 1920)) / 2;

    let links = Infinity, rechts = -Infinity, boven = Infinity, onder = -Infinity;
    nissen.forEach((n) => {
        const cx = num(n.x), top = num(n.top), hb = halveBreedte(n.hoogte);
        links  = Math.min(links,  cx - hb);
        rechts = Math.max(rechts, cx + hb);
        boven  = Math.min(boven,  top);
        onder  = Math.max(onder,  top + num(n.hoogte));
    });
    const m = zone.klikMarge || {};
    const mTop = m.top ?? 3, mOnder = m.onder ?? 2, mZij = m.zij ?? 2.5;
    return {
        left:   `${(links  - mZij).toFixed(1)}%`,
        top:    `${(boven  - mTop).toFixed(1)}%`,
        width:  `${(rechts - links + 2 * mZij).toFixed(1)}%`,
        height: `${(onder  - boven + mTop + mOnder).toFixed(1)}%`,
    };
}

// Bouwt de overzichtszaal op: achtergrond (met placeholder-terugval) + per
// zone een klikknop met naam, voortgangsmunten (één munt per boek, gekleurd
// naar de stand) en een telling "behaald/totaal".
function bouwZaal(zaalEl, zaal) {
    if (!zaalEl) return;

    // Opgeslagen afstel-posities (trofeeën én kisten) overrulen de config,
    // ook in de normale modus. Eén keer lezen voor beide lussen hieronder.
    const afstelPos = leesAfstelPosities();

    zetSchatkamerAchtergrond(zaalEl, zaal.achtergrond, zaal.naam);

    // Schatkisten als decor (onder de zones in de DOM, dus de klikgebieden
    // blijven gewoon bovenop werken). Zelfde lock/unlock-weergave als het
    // startscherm: brons/zilver/goud wisselen schaduw-/volle PNG op basis van
    // kist_<key>, de diamant krijgt .vergrendeld zolang niet alle drie de
    // kisten verdiend zijn (zelfde regel als werkVerborgenSchatBij). In
    // afstelmodus worden ze altijd onthuld getoond zodat je ze kunt plaatsen.
    const kistAfstelNaam = { brons: "Bronzen kist", zilver: "Zilveren kist", goud: "Gouden kist", diamant: "Verborgen Schat" };
    const kistenHouder = zaalEl.querySelector(".sk-kisten");
    if (kistenHouder) {
        kistenHouder.innerHTML = "";
        (zaal.kisten || []).forEach((k) => {
            const sleutel = `kist:${k.kist}`;
            const pos = afstelPos[sleutel] || k;     // override of config

            const img = document.createElement("img");
            img.className = "zaal-kist";
            img.style.left  = pos.x;
            img.style.top   = pos.top;
            img.style.width = pos.breedte;
            img.dataset.afstelKey = sleutel;         // "kist:<naam>"
            img.dataset.afstelNaam = kistAfstelNaam[k.kist] || k.kist;

            if (k.kist === "diamant") {
                img.src = "images/kist-diamant.webp";
                img.alt = "Verborgen diamanten schatkist";
                // In de zaal is de diamant niet klikbaar; hij toont alleen of
                // de Verborgen Schat al ontdekt is. Donker tot 10/10.
                const ontdekt = afstelModus || isVerborgenSchatOntgrendeld();
                img.classList.toggle("vergrendeld", !ontdekt);
            } else {
                const status = afstelModus ? "verdiend" : getKistStatus(k.kist);
                img.src = kistAfbeeldingen[k.kist][status];
                img.alt = `${k.kist[0].toUpperCase()}${k.kist.slice(1)} schatkist`;
            }
            kistenHouder.appendChild(img);
        });
    }

    // EXPERIMENT (vlag ZAAL_NIS_TROFEEEN): mini-trofeeën in de geschilderde
    // nissen van de kasten. Behaald = trofee met niveau-filter; niet behaald
    // = niets tonen, de geschilderde nis blijft leeg/donker. Boeken zonder
    // eigen afbeelding vallen terug op een evangelisten-trofee als stand-in.
    const nisHouder = zaalEl.querySelector(".sk-nis-trofeeen");
    if (nisHouder) {
        nisHouder.innerHTML = "";
        if (ZAAL_NIS_TROFEEEN) {
            zaal.zones.forEach((zone) => {
                (zone.nisTrofeeen || []).forEach((nis, i) => {
                    const vitrineNis = zone.vitrine.nissen[i];
                    if (!vitrineNis) return;

                    // In afstelmodus alle trofeeën tonen (zoals demo=goud) zodat
                    // je alles tegelijk kunt plaatsen; anders alleen de behaalde.
                    const stand = afstelModus ? "goud" : leesTrofeeStand(vitrineNis.sleutel);
                    if (stand === "geen") return;        // nis blijft leeg

                    // Opgeslagen afstel-positie overrulet de config (ook normaal).
                    const sleutel = `${zone.id}:${i}`;
                    const pos = afstelPos[sleutel] || nis;

                    const img = document.createElement("img");
                    img.className = `zaal-nis-trofee ${stand}`;
                    img.alt = vitrineNis.naam;
                    img.style.left   = pos.x;
                    img.style.top    = pos.top;
                    img.style.height = pos.hoogte;
                    img.src = `images/${vitrineNis.basis}-zilver.webp`;
                    img.dataset.afstelKey = sleutel;       // "zoneId:index"
                    img.dataset.afstelNaam = vitrineNis.naam;

                    // Eigen kunst ontbreekt nog -> evangelisten-trofee als
                    // tijdelijke stand-in (één keer; daarna opgeven).
                    img.addEventListener("error", () => {
                        if (img.dataset.standin) { img.remove(); return; }
                        img.dataset.standin = "1";
                        img.src = `images/${alleBoekKeys[i % alleBoekKeys.length]}-zilver.webp`;
                    });

                    nisHouder.appendChild(img);
                });
            });
        }
    }

    const houder = zaalEl.querySelector(".sk-zones");
    if (!houder) return;
    houder.innerHTML = "";                       // schoon herbouwen bij elk openen

    const toonZones = new URLSearchParams(location.search).get("zones") === "toon";
    zaal.zones.forEach((zone) => {
        const standen = zone.vitrine.nissen.map((nis) => leesTrofeeStand(nis.sleutel));
        const behaald = standen.filter((stand) => stand !== "geen").length;
        const vak = berekenKlikvak(zone);             // <-- afgeleid van de trofeeën

        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "zaal-zone";
        knop.style.left   = vak.left;
        knop.style.top    = vak.top;
        knop.style.width  = vak.width;
        knop.style.height = vak.height;
        if (toonZones) {                              // debug: maak het vak zichtbaar
            knop.style.background = "rgba(0,200,255,0.22)";
            knop.style.outline = "2px solid #00c8ff";
        }
        knop.setAttribute("aria-label",
            `${zone.naam}: ${behaald} van ${standen.length} trofeeën behaald`);
        knop.addEventListener("click", () => zoomNaarZone(zone));

        // De overzichtszaal toont alleen de trofeeën in hun nissen; de zone is
        // hier puur een onzichtbaar klikgebied om in te zoomen. Naam, munten en
        // telling verhuizen naar het zoom-/detailscherm.
        houder.appendChild(knop);
    });
}

// Afstel-UI: slepen, pijltjes-bijschuiven, schalen, opslaan en exporteren.
// Wordt alleen aangeroepen in afstelmodus. De handlers worden via delegatie op
// de (blijvende) zaal-container gezet, zodat ze ook na een herbouw van de
// trofeeën blijven werken; de eenmalige setup draait dankzij een vlag één keer.
function initAfstel(zaalEl) {
    if (!zaalEl) return;
    zaalEl.classList.add("afstel");               // CSS: klikzones uit, trofeeën pakbaar
    if (zaalEl.dataset.afstelKlaar) return;
    zaalEl.dataset.afstelKlaar = "1";

    const overrides = leesAfstelPosities();
    let sel = null;
    const SCHAAL_STAP = 0.2;                       // %-stap voor schalen (+/-/scroll)
    const AFSTEL_KIES = ".zaal-nis-trofee, .zaal-kist";  // selecteerbare elementen

    // Vitrine-afstel (parallel aan de zaal; ander scherm, eigen positiemodel).
    const vitrineEl = document.querySelector("#schatkamer-scherm .schatkamer-vitrine");
    const schermEl  = document.getElementById("schatkamer-scherm");
    const vitrineOpen = () => !!schermEl && schermEl.style.display !== "none";
    let vitSel = null;                            // geselecteerde vitrine-trofee
    let labelSel = null;                          // geselecteerd vitrine-naamlabel

    // Scherm-2-afstel (NT-boeken): aparte overlay, eigen positiemodel.
    const nt2El = document.getElementById("nt-scherm-2");
    const nt2Houder = document.getElementById("nt2-boeken");
    const nt2Zichtbaar = () => !!nt2El && nt2El.classList.contains("zichtbaar");
    if (nt2El) nt2El.classList.add("afstel");     // CSS: lagen pakbaar op scherm 2
    let boekSel = null;                           // geselecteerde scherm-2-laag

    // Kast-afstel (scherm-2-prijzenkast): eigen container/positiemodel.
    const nt2KastEl = document.getElementById("nt2-kast");
    if (nt2KastEl) nt2KastEl.classList.add("afstel");  // CSS: kast-trofeeën pakbaar
    let kastSel = null;                           // geselecteerde kast-trofee

    // Trofeeën schalen via hun hoogte, kisten via hun breedte.
    const isKist   = (img) => img.classList.contains("zaal-kist");
    const maatProp = (img) => isKist(img) ? "width" : "height";

    // --- bedieningspaneel ---
    const paneel = document.createElement("div");
    paneel.id = "afstel-paneel";
    paneel.innerHTML =
        '<strong>Afstelmodus</strong>' +
        '<div id="afstel-info">Klik een trofee of kist om te selecteren.</div>' +
        '<div class="afstel-hint">Slepen = verplaatsen &middot; pijltjes = 0,1% ' +
        '(Shift = 1%) &middot; + / &minus; of scroll = grootte</div>' +
        '<div class="afstel-knoppen">' +
        '<button type="button" id="afstel-export">Exporteer posities</button>' +
        '<button type="button" id="afstel-reset">Reset</button></div>' +
        '<textarea id="afstel-uitvoer" readonly style="display:none"></textarea>';
    document.body.appendChild(paneel);
    const infoEl = paneel.querySelector("#afstel-info");
    const uitvoerEl = paneel.querySelector("#afstel-uitvoer");

    // De klikzones staan in afstelmodus uit (zodat je de zaal-trofeeën kunt
    // pakken), dus knoppen om een vitrine te openen en daar de trofeeën af te
    // stellen. "Terug" in de vitrine brengt je weer in de zaal.
    const vitrineKnoppen = document.createElement("div");
    vitrineKnoppen.className = "afstel-vitrines";
    vitrineKnoppen.innerHTML = '<div class="afstel-hint">Open vitrine om af te stellen:</div>';
    schatkamerZalen.nt.zones.forEach((zone) => {
        if (!zone.vitrine) return;
        const knop = document.createElement("button");
        knop.type = "button";
        knop.textContent = zone.naam;
        knop.addEventListener("click", () => openVitrineScherm(zone.vitrine));
        vitrineKnoppen.appendChild(knop);
    });
    // Knop om scherm 2 (de NT-boeken) af te stellen: verlaat de Schatkamer en
    // toon scherm 2.
    const nt2Knop = document.createElement("button");
    nt2Knop.type = "button";
    nt2Knop.textContent = "NT-boeken (scherm 2)";
    nt2Knop.addEventListener("click", () => {
        ["zaal-scherm", "schatkamer-scherm"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        huidigNtScherm = 2;
        if (nt2El) { nt2El.classList.add("zichtbaar"); nt2El.setAttribute("aria-hidden", "false"); }
    });
    vitrineKnoppen.appendChild(nt2Knop);
    // Knop om de scherm-2-kast af te stellen: zelfde navigatie als NT-boeken
    // (de kast zit op scherm 2). Wissel tussen de panelen met de kast-pijltjes.
    const kastKnop = document.createElement("button");
    kastKnop.type = "button";
    kastKnop.textContent = "Kast (scherm 2)";
    kastKnop.addEventListener("click", () => {
        ["zaal-scherm", "schatkamer-scherm"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        huidigNtScherm = 2;
        if (nt2El) { nt2El.classList.add("zichtbaar"); nt2El.setAttribute("aria-hidden", "false"); }
    });
    vitrineKnoppen.appendChild(kastKnop);

    // Knop om de fakkelgloeden op het startscherm af te stellen: verberg de
    // Schatkamer-/scherm-2-overlays zodat het startscherm (met de gloeden)
    // tevoorschijn komt. De gloed-besturing zit in initFakkelAfstel; die wordt
    // pas actief als het startscherm zichtbaar is.
    const fakkelKnop = document.createElement("button");
    fakkelKnop.type = "button";
    fakkelKnop.textContent = "Startscherm (fakkels)";
    fakkelKnop.addEventListener("click", () => {
        ["zaal-scherm", "schatkamer-scherm"].forEach((id) => {
            const el = document.getElementById(id);
            if (el) el.style.display = "none";
        });
        if (nt2El) { nt2El.classList.remove("zichtbaar"); nt2El.setAttribute("aria-hidden", "true"); }
        huidigNtScherm = 1;
        // Lopende selecties loslaten, zodat de pijltjes niet ook een nu
        // verborgen trofee/kist verschuiven.
        deselecteerAlles();
        infoEl.innerHTML = "Startscherm — klik een <b>fakkelgloed</b> om te selecteren en versleep 'm.";
    });
    vitrineKnoppen.appendChild(fakkelKnop);

    paneel.appendChild(vitrineKnoppen);

    // Laat alle afstel-selecties (zaal, vitrine, label, scherm-2, kast) los.
    function deselecteerAlles() {
        [sel, vitSel, labelSel, boekSel, kastSel].forEach((s) => {
            if (s) s.classList.remove("afstel-geselecteerd");
        });
        sel = vitSel = labelSel = boekSel = kastSel = null;
    }

    function toonInfo() {
        if (!sel) { infoEl.textContent = "Klik een trofee of kist om te selecteren."; return; }
        const k = isKist(sel);
        infoEl.innerHTML = "<b>" + sel.dataset.afstelNaam + "</b><br>x: " +
            parseFloat(sel.style.left).toFixed(1) + "% &middot; y: " +
            parseFloat(sel.style.top).toFixed(1) + "% &middot; " +
            (k ? "b" : "h") + ": " + parseFloat(sel.style[maatProp(sel)]).toFixed(1) + "%";
    }
    function bewaar(img) {
        overrides[img.dataset.afstelKey] = isKist(img)
            ? { x: img.style.left, top: img.style.top, breedte: img.style.width }
            : { x: img.style.left, top: img.style.top, hoogte: img.style.height };
        schrijfAfstelPosities(overrides);
    }
    function selecteer(img) {
        if (vitSel) { vitSel.classList.remove("afstel-geselecteerd"); vitSel = null; }     // vitrine-trofee loslaten
        if (labelSel) { labelSel.classList.remove("afstel-geselecteerd"); labelSel = null; } // vitrine-label loslaten
        if (boekSel) { boekSel.classList.remove("afstel-geselecteerd"); boekSel = null; }   // scherm-2-laag loslaten
        if (kastSel) { kastSel.classList.remove("afstel-geselecteerd"); kastSel = null; }   // kast-trofee loslaten
        if (sel) sel.classList.remove("afstel-geselecteerd");
        sel = img;
        if (sel) sel.classList.add("afstel-geselecteerd");
        toonInfo();
    }

    // --- slepen (delegatie op de zaal) ---
    zaalEl.addEventListener("pointerdown", (e) => {
        const img = e.target.closest(AFSTEL_KIES);
        if (!img) { selecteer(null); return; }
        e.preventDefault();
        selecteer(img);
        const r = zaalEl.getBoundingClientRect();
        const startX = parseFloat(img.style.left), startY = parseFloat(img.style.top);
        const muisX = e.clientX, muisY = e.clientY;
        let gesleept = false;
        function beweeg(ev) {
            gesleept = true;
            const dx = (ev.clientX - muisX) / r.width * 100;
            const dy = (ev.clientY - muisY) / r.height * 100;
            img.style.left = (startX + dx).toFixed(2) + "%";
            img.style.top  = (startY + dy).toFixed(2) + "%";
            toonInfo();
        }
        function los() {
            document.removeEventListener("pointermove", beweeg);
            document.removeEventListener("pointerup", los);
            if (gesleept) bewaar(img);
        }
        document.addEventListener("pointermove", beweeg);
        document.addEventListener("pointerup", los);
    });

    // --- scrollwiel = grootte (trofee: hoogte, kist: breedte) ---
    zaalEl.addEventListener("wheel", (e) => {
        const img = e.target.closest(AFSTEL_KIES);
        if (!img) return;
        e.preventDefault();
        selecteer(img);
        const prop = maatProp(img);
        const v = Math.max(1, parseFloat(img.style[prop]) + (e.deltaY < 0 ? SCHAAL_STAP : -SCHAAL_STAP));
        img.style[prop] = v.toFixed(2) + "%";
        bewaar(img); toonInfo();
    }, { passive: false });

    // --- toetsenbord: pijltjes verplaatsen, +/- schalen ---
    // Ligt de vitrine erbovenop, dan neemt de vitrine-keydown (hieronder) de
    // toetsen over; de zaal blijft verder exact hetzelfde werken.
    document.addEventListener("keydown", (e) => {
        if (!sel || !zaalEl.classList.contains("afstel") || vitrineOpen() || nt2Zichtbaar()) return;
        const stap = e.shiftKey ? 1 : 0.1;
        const prop = maatProp(sel);
        let raak = true;
        const x = parseFloat(sel.style.left), y = parseFloat(sel.style.top), maat = parseFloat(sel.style[prop]);
        if (e.key === "ArrowLeft")       sel.style.left = (x - stap).toFixed(2) + "%";
        else if (e.key === "ArrowRight") sel.style.left = (x + stap).toFixed(2) + "%";
        else if (e.key === "ArrowUp")    sel.style.top  = (y - stap).toFixed(2) + "%";
        else if (e.key === "ArrowDown")  sel.style.top  = (y + stap).toFixed(2) + "%";
        else if (e.key === "+" || e.key === "=") sel.style[prop] = (maat + SCHAAL_STAP).toFixed(2) + "%";
        else if (e.key === "-" || e.key === "_") sel.style[prop] = Math.max(1, maat - SCHAAL_STAP).toFixed(2) + "%";
        else raak = false;
        if (raak) { e.preventDefault(); bewaar(sel); toonInfo(); }
    });

    // ===== Vitrine-trofeeën: zelfde afstelmodus, eigen positiemodel =====
    // x = links (nis.x), verticaal = bottom (nis.bodem), grootte = height
    // (nis.trofeeHoogte). We schrijven rechtstreeks naar het actieve config-
    // object; de zaal-afstel hierboven blijft volledig ongemoeid.
    function vitNis() {
        if (!vitSel || !actieveVitrineConfig) return null;
        return actieveVitrineConfig.nissen[+vitSel.dataset.nisIndex] || null;
    }
    function vitInfo() {
        if (!vitSel) return;
        infoEl.innerHTML = "<b>" + vitSel.dataset.afstelNaam + "</b> (vitrine)<br>x: " +
            parseFloat(vitSel.style.left).toFixed(1) + "% &middot; bodem: " +
            parseFloat(vitSel.style.bottom).toFixed(1) + "% &middot; h: " +
            parseFloat(vitSel.style.height).toFixed(1) + "%";
    }
    function vitBewaar() {                         // inline -> config (voor de export)
        const n = vitNis(); if (!n) return;
        n.x = vitSel.style.left;
        n.bodem = vitSel.style.bottom;
        n.trofeeHoogte = vitSel.style.height;
    }
    function vitSelecteer(img) {
        if (sel) { sel.classList.remove("afstel-geselecteerd"); sel = null; } // zaal-selectie loslaten
        if (labelSel) { labelSel.classList.remove("afstel-geselecteerd"); labelSel = null; } // label-selectie loslaten
        if (boekSel) { boekSel.classList.remove("afstel-geselecteerd"); boekSel = null; } // scherm-2-laag loslaten
        if (kastSel) { kastSel.classList.remove("afstel-geselecteerd"); kastSel = null; } // kast-trofee loslaten
        if (vitSel) vitSel.classList.remove("afstel-geselecteerd");
        vitSel = img;
        if (vitSel) vitSel.classList.add("afstel-geselecteerd");
        vitInfo();
    }

    if (vitrineEl) {
        // --- slepen (delegatie op de vitrine) ---
        vitrineEl.addEventListener("pointerdown", (e) => {
            const img = e.target.closest(".sk-trofee");
            if (!img) { vitSelecteer(null); return; }
            e.preventDefault();
            vitSelecteer(img);
            const r = vitrineEl.getBoundingClientRect();
            const startX = parseFloat(img.style.left);
            const startB = parseFloat(img.style.bottom);
            const muisX = e.clientX, muisY = e.clientY;
            let gesleept = false;
            function beweeg(ev) {
                gesleept = true;
                const dx = (ev.clientX - muisX) / r.width * 100;
                const dy = (ev.clientY - muisY) / r.height * 100;
                img.style.left   = (startX + dx).toFixed(2) + "%";
                img.style.bottom = (startB - dy).toFixed(2) + "%";   // omlaag slepen = bottom kleiner
                vitInfo();
            }
            function los() {
                document.removeEventListener("pointermove", beweeg);
                document.removeEventListener("pointerup", los);
                if (gesleept) vitBewaar();
            }
            document.addEventListener("pointermove", beweeg);
            document.addEventListener("pointerup", los);
        });

        // --- scrollwiel = grootte (trofeeHoogte) ---
        vitrineEl.addEventListener("wheel", (e) => {
            const img = e.target.closest(".sk-trofee");
            if (!img) return;
            e.preventDefault();
            vitSelecteer(img);
            const v = Math.max(1, parseFloat(img.style.height) + (e.deltaY < 0 ? SCHAAL_STAP : -SCHAAL_STAP));
            img.style.height = v.toFixed(2) + "%";
            vitBewaar(); vitInfo();
        }, { passive: false });
    }

    // --- toetsenbord voor de vitrine (alleen als de vitrine bovenop ligt) ---
    document.addEventListener("keydown", (e) => {
        if (!vitSel || !vitrineOpen()) return;
        const stap = e.shiftKey ? 1 : 0.1;
        let raak = true;
        const x = parseFloat(vitSel.style.left), b = parseFloat(vitSel.style.bottom), h = parseFloat(vitSel.style.height);
        if (e.key === "ArrowLeft")        vitSel.style.left   = (x - stap).toFixed(2) + "%";
        else if (e.key === "ArrowRight")  vitSel.style.left   = (x + stap).toFixed(2) + "%";
        else if (e.key === "ArrowUp")     vitSel.style.bottom = (b + stap).toFixed(2) + "%";  // omhoog
        else if (e.key === "ArrowDown")   vitSel.style.bottom = (b - stap).toFixed(2) + "%";  // omlaag
        else if (e.key === "+" || e.key === "=") vitSel.style.height = (h + SCHAAL_STAP).toFixed(2) + "%";
        else if (e.key === "-" || e.key === "_") vitSel.style.height = Math.max(1, h - SCHAAL_STAP).toFixed(2) + "%";
        else raak = false;
        if (raak) { e.preventDefault(); vitBewaar(); vitInfo(); }
    });

    // ===== Vitrine-labels (.sk-naam): zelfde afstelmodus, eigen positiemodel =====
    // naamX = links (style.left), naamY = verticaal (style.top), grootte =
    // fontSize. Schrijft rechtstreeks naar het config-object; het trofee-spoor
    // hierboven en de zaal-afstel blijven volledig ongemoeid. Dit spoor reageert
    // alleen op echte label-treffers (closest('.sk-naam')), dus het zit het
    // trofee-spoor (closest('.sk-trofee')) niet in de weg.
    const FONT_STAP = 1;                            // px-stap voor lettergrootte
    function labelNis() {
        if (!labelSel || !actieveVitrineConfig) return null;
        return actieveVitrineConfig.nissen[+labelSel.dataset.nisIndex] || null;
    }
    function labelFontPx() {                        // huidige grootte in px (clamp -> computed)
        return parseFloat(labelSel.style.fontSize) ||
               parseFloat(getComputedStyle(labelSel).fontSize) || 12;
    }
    function labelInfo() {
        if (!labelSel) return;
        infoEl.innerHTML = "<b>" + labelSel.dataset.afstelNaam + "</b> (label)<br>naamX: " +
            parseFloat(labelSel.style.left).toFixed(1) + "% &middot; naamY: " +
            parseFloat(labelSel.style.top).toFixed(1) + "% &middot; grootte: " +
            labelSel.style.fontSize;
    }
    function labelBewaar() {                        // inline -> config (voor de export)
        const n = labelNis(); if (!n) return;
        n.naamX = labelSel.style.left;
        n.naamY = labelSel.style.top;
        n.naamGrootte = labelSel.style.fontSize;   // clamp blijft tot je echt schaalt (dan px)
    }
    function labelSelecteer(div) {
        if (sel) { sel.classList.remove("afstel-geselecteerd"); sel = null; }           // zaal loslaten
        if (vitSel) { vitSel.classList.remove("afstel-geselecteerd"); vitSel = null; }   // trofee loslaten
        if (boekSel) { boekSel.classList.remove("afstel-geselecteerd"); boekSel = null; } // scherm-2-laag loslaten
        if (kastSel) { kastSel.classList.remove("afstel-geselecteerd"); kastSel = null; } // kast-trofee loslaten
        if (labelSel) labelSel.classList.remove("afstel-geselecteerd");
        labelSel = div;
        if (labelSel) labelSel.classList.add("afstel-geselecteerd");
        labelInfo();
    }

    if (vitrineEl) {
        // --- slepen (delegatie op de vitrine; alleen labels) ---
        vitrineEl.addEventListener("pointerdown", (e) => {
            const div = e.target.closest(".sk-naam");
            if (!div) return;                      // geen label -> trofee-spoor handelt het af
            e.preventDefault();
            labelSelecteer(div);
            const r = vitrineEl.getBoundingClientRect();
            const startX = parseFloat(div.style.left);
            const startY = parseFloat(div.style.top);
            const muisX = e.clientX, muisY = e.clientY;
            let gesleept = false;
            function beweeg(ev) {
                gesleept = true;
                const dx = (ev.clientX - muisX) / r.width * 100;
                const dy = (ev.clientY - muisY) / r.height * 100;
                div.style.left = (startX + dx).toFixed(2) + "%";
                div.style.top  = (startY + dy).toFixed(2) + "%";   // omlaag slepen = top groter
                labelInfo();
            }
            function los() {
                document.removeEventListener("pointermove", beweeg);
                document.removeEventListener("pointerup", los);
                if (gesleept) labelBewaar();
            }
            document.addEventListener("pointermove", beweeg);
            document.addEventListener("pointerup", los);
        });

        // --- scrollwiel = lettergrootte (naamGrootte, in px) ---
        vitrineEl.addEventListener("wheel", (e) => {
            const div = e.target.closest(".sk-naam");
            if (!div) return;
            e.preventDefault();
            labelSelecteer(div);
            const v = Math.max(1, labelFontPx() + (e.deltaY < 0 ? FONT_STAP : -FONT_STAP));
            div.style.fontSize = v.toFixed(1) + "px";
            labelBewaar(); labelInfo();
        }, { passive: false });
    }

    // --- toetsenbord voor labels (alleen als de vitrine bovenop ligt) ---
    document.addEventListener("keydown", (e) => {
        if (!labelSel || !vitrineOpen()) return;
        const stap = e.shiftKey ? 1 : 0.1;
        let raak = true;
        const x = parseFloat(labelSel.style.left), y = parseFloat(labelSel.style.top);
        if (e.key === "ArrowLeft")        labelSel.style.left = (x - stap).toFixed(2) + "%";
        else if (e.key === "ArrowRight")  labelSel.style.left = (x + stap).toFixed(2) + "%";
        else if (e.key === "ArrowUp")     labelSel.style.top  = (y - stap).toFixed(2) + "%";  // omhoog
        else if (e.key === "ArrowDown")   labelSel.style.top  = (y + stap).toFixed(2) + "%";  // omlaag
        else if (e.key === "+" || e.key === "=") labelSel.style.fontSize = (labelFontPx() + FONT_STAP).toFixed(1) + "px";
        else if (e.key === "-" || e.key === "_") labelSel.style.fontSize = Math.max(1, labelFontPx() - FONT_STAP).toFixed(1) + "px";
        else raak = false;
        if (raak) { e.preventDefault(); labelBewaar(); labelInfo(); }
    });

    // ===== Scherm-2 NT-boeken: zelfde afstelmodus, x én bodem per laag =====
    // Horizontaal én verticaal slepen/nudgen verschuift alleen de geselecteerde
    // laag (eigen x + bodem), zodat je het boek los van het plateau kunt
    // centreren. Schalen: het boek per boek (hoogte); plateau/bord/naam delen
    // hun maat over alle boeken. Schrijft rechtstreeks naar ntScherm2.
    const FONT_STAP_NT2 = 1;                        // px-stap voor de naam
    function nt2Laag(el) {
        if (el.classList.contains("nt2-plateau")) return { klasse: "nt2-plateau", xVeld: "plateauX", bodemVeld: "plateauBodem", prop: "width",    gedeeld: true,  sizeVeld: "plateauBreedte" };
        if (el.classList.contains("nt2-boek"))    return { klasse: "nt2-boek",    xVeld: "boekX",    bodemVeld: "boekBodem",    prop: "height",   gedeeld: true,  sizeVeld: "boekHoogte" };
        if (el.classList.contains("nt2-bord"))    return { klasse: "nt2-bord",    xVeld: "bordX",    bodemVeld: "bordBodem",    prop: "width",    gedeeld: true,  sizeVeld: "bordBreedte" };
        return { klasse: "nt2-naam", xVeld: "naamX", bodemVeld: "naamBodem", prop: "fontSize", gedeeld: true, sizeVeld: "naamGrootte" };
    }
    function nt2FontPx(el) {
        return parseFloat(el.style.fontSize) || parseFloat(getComputedStyle(el).fontSize) || 12;
    }
    function nt2ZetSize(el, info, waarde) {
        if (info.gedeeld) nt2Houder.querySelectorAll("." + info.klasse).forEach((s) => s.style[info.prop] = waarde);
        else el.style[info.prop] = waarde;
    }
    function boekInfo() {
        if (!boekSel) return;
        const info = nt2Laag(boekSel);
        const maat = info.prop === "fontSize"
            ? "grootte: " + boekSel.style.fontSize
            : (info.prop === "height" ? "h: " : "b: ") + parseFloat(boekSel.style[info.prop]).toFixed(1) + "%";
        infoEl.innerHTML = "<b>" + boekSel.dataset.afstelNaam + "</b> (scherm 2)<br>x: " +
            parseFloat(boekSel.style.left).toFixed(1) + "% &middot; bodem: " +
            parseFloat(boekSel.style.bottom).toFixed(1) + "% &middot; " + maat;
    }
    function boekBewaar(el) {                        // inline -> config (voor de export)
        const b = ntScherm2.boeken[+el.dataset.boekIndex]; if (!b) return;
        const info = nt2Laag(el);
        b[info.xVeld] = el.style.left;              // per-laag x
        b[info.bodemVeld] = el.style.bottom;        // per-laag bodem
        if (info.gedeeld) ntScherm2[info.sizeVeld] = el.style[info.prop]; // gedeelde maat
        else b[info.sizeVeld] = el.style[info.prop];                      // boekhoogte per boek
    }
    function boekSelecteer(el) {
        if (sel) { sel.classList.remove("afstel-geselecteerd"); sel = null; }
        if (vitSel) { vitSel.classList.remove("afstel-geselecteerd"); vitSel = null; }
        if (labelSel) { labelSel.classList.remove("afstel-geselecteerd"); labelSel = null; }
        if (kastSel) { kastSel.classList.remove("afstel-geselecteerd"); kastSel = null; }
        if (boekSel) boekSel.classList.remove("afstel-geselecteerd");
        boekSel = el;
        if (boekSel) boekSel.classList.add("afstel-geselecteerd");
        boekInfo();
    }

    if (nt2El) {
        // --- slepen (delegatie op scherm 2) ---
        nt2El.addEventListener("pointerdown", (e) => {
            const el = e.target.closest(".nt2-plateau, .nt2-boek, .nt2-bord, .nt2-naam");
            if (!el) { boekSelecteer(null); return; }
            e.preventDefault();
            boekSelecteer(el);
            const r = nt2Houder.getBoundingClientRect();
            const startX = parseFloat(el.style.left);
            const startB = parseFloat(el.style.bottom);
            const muisX = e.clientX, muisY = e.clientY;
            // Het boek beweegt bewust alleen horizontaal (de hoogte/bodem is voor
            // alle vier gelijk); plateau/bord/naam blijven in beide richtingen.
            const alleenHorizontaal = el.classList.contains("nt2-boek");
            let gesleept = false;
            function beweeg(ev) {
                gesleept = true;
                const dx = (ev.clientX - muisX) / r.width * 100;
                el.style.left   = (startX + dx).toFixed(2) + "%";    // horizontaal: alleen deze laag
                if (!alleenHorizontaal) {
                    const dy = (ev.clientY - muisY) / r.height * 100;
                    el.style.bottom = (startB - dy).toFixed(2) + "%"; // verticaal: alleen deze laag
                }
                boekInfo();
            }
            function los() {
                document.removeEventListener("pointermove", beweeg);
                document.removeEventListener("pointerup", los);
                if (gesleept) boekBewaar(el);
            }
            document.addEventListener("pointermove", beweeg);
            document.addEventListener("pointerup", los);
        });

        // --- scrollwiel = schalen (boek: hoogte; plateau/bord: breedte; naam: px) ---
        nt2El.addEventListener("wheel", (e) => {
            const el = e.target.closest(".nt2-plateau, .nt2-boek, .nt2-bord, .nt2-naam");
            if (!el) return;
            e.preventDefault();
            boekSelecteer(el);
            const info = nt2Laag(el);
            if (info.prop === "fontSize") {
                const v = Math.max(1, nt2FontPx(el) + (e.deltaY < 0 ? FONT_STAP_NT2 : -FONT_STAP_NT2));
                nt2ZetSize(el, info, v.toFixed(1) + "px");
            } else {
                const v = Math.max(1, parseFloat(el.style[info.prop]) + (e.deltaY < 0 ? SCHAAL_STAP : -SCHAAL_STAP));
                nt2ZetSize(el, info, v.toFixed(2) + "%");
            }
            boekBewaar(el); boekInfo();
        }, { passive: false });
    }

    // --- toetsenbord voor scherm 2 (alleen als scherm 2 zichtbaar is) ---
    document.addEventListener("keydown", (e) => {
        if (!boekSel || !nt2Zichtbaar()) return;
        const info = nt2Laag(boekSel);
        const stap = e.shiftKey ? 1 : 0.1;
        let raak = true;
        const x = parseFloat(boekSel.style.left), b = parseFloat(boekSel.style.bottom);
        if (e.key === "ArrowLeft")        boekSel.style.left = (x - stap).toFixed(2) + "%";
        else if (e.key === "ArrowRight")  boekSel.style.left = (x + stap).toFixed(2) + "%";
        else if (e.key === "ArrowUp")     boekSel.style.bottom = (b + stap).toFixed(2) + "%";
        else if (e.key === "ArrowDown")   boekSel.style.bottom = (b - stap).toFixed(2) + "%";
        else if (e.key === "+" || e.key === "=") {
            if (info.prop === "fontSize") nt2ZetSize(boekSel, info, (nt2FontPx(boekSel) + FONT_STAP_NT2).toFixed(1) + "px");
            else nt2ZetSize(boekSel, info, (parseFloat(boekSel.style[info.prop]) + SCHAAL_STAP).toFixed(2) + "%");
        }
        else if (e.key === "-" || e.key === "_") {
            if (info.prop === "fontSize") nt2ZetSize(boekSel, info, Math.max(1, nt2FontPx(boekSel) - FONT_STAP_NT2).toFixed(1) + "px");
            else nt2ZetSize(boekSel, info, Math.max(1, parseFloat(boekSel.style[info.prop]) - SCHAAL_STAP).toFixed(2) + "%");
        }
        else raak = false;
        if (raak) { e.preventDefault(); boekBewaar(boekSel); boekInfo(); }
    });

    // ===== Scherm-2-kast (NT-prijzenkast): zelfde afstelmodus, x/y + breedte =====
    // Elk element (trofee én naambordje) is los: gecentreerd op x/y (% van het
    // paneel), schalen = breedte. Schrijft per element rechtstreeks terug naar de
    // nis in nt2Kast (trofee -> x/y/breedte, bordje -> labelX/labelY/labelBreedte).
    // Reageert op .kast-nis (trofee) én .kast-label (bordje); stopt de bubble
    // zodat het NT-boeken-spoor (op #nt-scherm-2) de selectie niet weer wist.
    function kastNisVan(el) {
        const p = +el.dataset.kastPaneel, g = +el.dataset.kastGroep, i = +el.dataset.kastNis;
        const groep = nt2Kast.panelen[p] && nt2Kast.panelen[p].groepen[g];
        return (groep && groep.nissen[i]) || null;
    }
    function kastInfo() {
        if (!kastSel) return;
        const soort = kastSel.dataset.kastType === "label" ? "bordje" : "trofee";
        infoEl.innerHTML = "<b>" + kastSel.dataset.afstelNaam + "</b> (kast-" + soort + ")<br>x: " +
            parseFloat(kastSel.style.left).toFixed(1) + "% &middot; y: " +
            parseFloat(kastSel.style.top).toFixed(1) + "% &middot; b: " +
            parseFloat(kastSel.style.width).toFixed(1) + "%";
    }
    function kastBewaar(el) {
        const nis = kastNisVan(el); if (!nis) return;
        const x = parseFloat(el.style.left).toFixed(2) + "%";
        const y = parseFloat(el.style.top).toFixed(2) + "%";
        const b = parseFloat(el.style.width).toFixed(2) + "%";
        if (el.dataset.kastType === "label") {
            nis.labelX = x; nis.labelY = y; nis.labelBreedte = b;
        } else {
            nis.x = x; nis.y = y; nis.breedte = b;
        }
    }
    function kastSelecteer(wrap) {
        if (sel) { sel.classList.remove("afstel-geselecteerd"); sel = null; }
        if (vitSel) { vitSel.classList.remove("afstel-geselecteerd"); vitSel = null; }
        if (labelSel) { labelSel.classList.remove("afstel-geselecteerd"); labelSel = null; }
        if (boekSel) { boekSel.classList.remove("afstel-geselecteerd"); boekSel = null; }
        if (kastSel) kastSel.classList.remove("afstel-geselecteerd");
        kastSel = wrap;
        if (kastSel) kastSel.classList.add("afstel-geselecteerd");
        kastInfo();
    }

    if (nt2KastEl) {
        // --- slepen (delegatie op de kast) ---
        nt2KastEl.addEventListener("pointerdown", (e) => {
            const wrap = e.target.closest(".kast-nis, .kast-label");
            if (!wrap) { kastSelecteer(null); return; }   // lege kast -> deselecteren (bubble mag naar boeken)
            e.preventDefault();
            e.stopPropagation();                          // niet door naar het NT-boeken-spoor
            kastSelecteer(wrap);
            const r = nt2KastEl.getBoundingClientRect();
            const startX = parseFloat(wrap.style.left), startY = parseFloat(wrap.style.top);
            const muisX = e.clientX, muisY = e.clientY;
            let gesleept = false;
            function beweeg(ev) {
                gesleept = true;
                const dx = (ev.clientX - muisX) / r.width * 100;
                const dy = (ev.clientY - muisY) / r.height * 100;
                wrap.style.left = (startX + dx).toFixed(2) + "%";
                wrap.style.top  = (startY + dy).toFixed(2) + "%";
                kastInfo();
            }
            function los() {
                document.removeEventListener("pointermove", beweeg);
                document.removeEventListener("pointerup", los);
                if (gesleept) kastBewaar(wrap);
            }
            document.addEventListener("pointermove", beweeg);
            document.addEventListener("pointerup", los);
        });

        // --- scrollwiel = grootte (breedte) ---
        nt2KastEl.addEventListener("wheel", (e) => {
            const wrap = e.target.closest(".kast-nis, .kast-label");
            if (!wrap) return;
            e.preventDefault();
            e.stopPropagation();
            kastSelecteer(wrap);
            const v = Math.max(1, parseFloat(wrap.style.width) + (e.deltaY < 0 ? SCHAAL_STAP : -SCHAAL_STAP));
            wrap.style.width = v.toFixed(2) + "%";
            kastBewaar(wrap); kastInfo();
        }, { passive: false });
    }

    // --- toetsenbord voor de kast (alleen als scherm 2 zichtbaar is) ---
    document.addEventListener("keydown", (e) => {
        if (!kastSel || !nt2Zichtbaar()) return;
        const stap = e.shiftKey ? 1 : 0.1;
        let raak = true;
        const x = parseFloat(kastSel.style.left), y = parseFloat(kastSel.style.top), b = parseFloat(kastSel.style.width);
        if (e.key === "ArrowLeft")        kastSel.style.left  = (x - stap).toFixed(2) + "%";
        else if (e.key === "ArrowRight")  kastSel.style.left  = (x + stap).toFixed(2) + "%";
        else if (e.key === "ArrowUp")     kastSel.style.top   = (y - stap).toFixed(2) + "%";
        else if (e.key === "ArrowDown")   kastSel.style.top   = (y + stap).toFixed(2) + "%";
        else if (e.key === "+" || e.key === "=") kastSel.style.width = (b + SCHAAL_STAP).toFixed(2) + "%";
        else if (e.key === "-" || e.key === "_") kastSel.style.width = Math.max(1, b - SCHAAL_STAP).toFixed(2) + "%";
        else raak = false;
        if (raak) { e.preventDefault(); kastBewaar(kastSel); kastInfo(); }
    });

    // Zet een afgestelde px-lettergrootte om naar een MEESCHALENDE cqi-waarde:
    // 1cqi = 1% van de vitrine-doosbreedte (container). Omdat de naamborden óók
    // in % van de doos staan, blijft de verhouding tekst↔bord constant op elk
    // venster en kan lange tekst niet buiten het bord lopen. cqi wordt berekend
    // uit de live doosbreedte, zodat de tekst nu even groot blijft als ingesteld.
    // Reeds meeschalende waarden (cqi/clamp/vw) blijven ongewijzigd.
    function grootteVoorExport(waarde) {
        const m = /^\s*([\d.]+)px\s*$/.exec(waarde || "");
        if (!m) return waarde;                     // al cqi/clamp -> laten staan
        const px = parseFloat(m[1]);
        const doosBreedte = vitrineEl ? vitrineEl.getBoundingClientRect().width : window.innerWidth;
        const cqi = (px / doosBreedte * 100).toFixed(2);
        return cqi + "cqi";
    }

    // Idem voor scherm 2: cqi t.o.v. de scherm-2-container (#nt2-boeken).
    function grootteVoorExportNt2(waarde) {
        const m = /^\s*([\d.]+)px\s*$/.exec(waarde || "");
        if (!m) return waarde;
        const breedte = nt2Houder ? nt2Houder.getBoundingClientRect().width : window.innerWidth;
        return (parseFloat(m[1]) / breedte * 100).toFixed(2) + "cqi";
    }

    // --- exporteren: bijgewerkte nisTrofeeen-arrays + kisten om te plakken ---
    paneel.querySelector("#afstel-export").addEventListener("click", () => {
        let uit = "// Afstel-export — vervang per zone de nisTrofeeen-array en de\n" +
                  "// kisten-array in schatkamerZalen.\n\n";
        schatkamerZalen.nt.zones.forEach((zone) => {
            if (!zone.nisTrofeeen) return;
            uit += "// " + zone.id + "\nnisTrofeeen: [\n";
            zone.nisTrofeeen.forEach((nis, i) => {
                const p = overrides[zone.id + ":" + i] || nis;
                uit += '    { x: "' + p.x + '", top: "' + p.top + '", hoogte: "' + p.hoogte + '" },\n';
            });
            uit += "],\n\n";
        });
        uit += "// kisten\nkisten: [\n";
        (schatkamerZalen.nt.kisten || []).forEach((k) => {
            const p = overrides["kist:" + k.kist] || k;
            uit += '    { kist: "' + k.kist + '", x: "' + p.x + '", top: "' + p.top + '", breedte: "' + p.breedte + '" },\n';
        });
        uit += "],\n";

        // Vitrine-trofeeën van de nu geopende vitrine (indien er één afgesteld
        // is). x/bodem/trofeeHoogte zijn bijgewerkt; de overige velden staan
        // ongewijzigd, zodat dit direct in nissen[] te plakken is.
        if (actieveVitrineConfig) {
            uit += "\n// Vitrine — vervang nissen[] van de geopende vitrine " +
                   "(bv. evangelienVitrine). Trofee- EN labelposities:\nnissen: [\n";
            actieveVitrineConfig.nissen.forEach((n) => {
                uit += '    { x: "' + n.x + '", trofeeHoogte: "' + n.trofeeHoogte + '"' +
                       (n.bodem ? ', bodem: "' + n.bodem + '"' : "") +
                       ', naamX: "' + n.naamX + '"' +
                       (n.naamY ? ', naamY: "' + n.naamY + '"' : "") +
                       ', naamGrootte: "' + grootteVoorExport(n.naamGrootte) + '"' +
                       ', naam: "' + n.naam + '", sleutel: "' + n.sleutel + '", basis: "' + n.basis + '" },\n';
            });
            uit += "],\n";
        }

        // NT-scherm 2 — vervang ntScherm2.boeken (+ de gedeelde maten erboven).
        uit += "\n// NT-scherm 2 — gedeelde maten in ntScherm2:\n";
        uit += '//   boekHoogte: "' + ntScherm2.boekHoogte + '", plateauBreedte: "' + ntScherm2.plateauBreedte + '", bordBreedte: "' + ntScherm2.bordBreedte +
               '", naamBreedte: "' + ntScherm2.naamBreedte + '", naamHoogte: "' + ntScherm2.naamHoogte +
               '", naamGrootte: "' + grootteVoorExportNt2(ntScherm2.naamGrootte) + '"\n';
        uit += "// vervang ntScherm2.boeken:\nboeken: [\n";
        ntScherm2.boeken.forEach((b) => {
            uit += '    { naam: "' + b.naam + '", groep: "' + b.groep + '", boek: "' + b.boek + '",\n' +
                   '      plateauX: "' + b.plateauX + '", boekX: "' + b.boekX + '", bordX: "' + b.bordX + '", naamX: "' + b.naamX + '",\n' +
                   '      boekBodem: "' + b.boekBodem +
                   '", plateauBodem: "' + b.plateauBodem + '", bordBodem: "' + b.bordBodem +
                   '", naamBodem: "' + b.naamBodem + '" },\n';
        });
        uit += "],\n";

        // NT-prijzenkast (scherm 2) — per groep het raster + offsets, of de
        // enkele nis. Elk element heeft nu een eigen positie; vervang per groep
        // de hele nissen[]-array (en laat het raster weg, het is enkel startwaarde).
        uit += "\n// NT-kast (scherm 2) — vervang per groep de nissen[] in nt2Kast.panelen:\n";
        nt2Kast.panelen.forEach((pan, p) => {
            pan.groepen.forEach((groep) => {
                uit += "// paneel " + (p + 1) + " — " + groep.zone + ":\nnissen: [\n";
                groep.nissen.forEach((n) => {
                    uit += '    { sleutel: "' + n.sleutel + '", basis: "' + n.basis + '", naam: "' + n.naam + '",\n' +
                           '      x: "' + n.x + '", y: "' + n.y + '", breedte: "' + n.breedte + '",\n' +
                           '      labelX: "' + n.labelX + '", labelY: "' + n.labelY + '", labelBreedte: "' + n.labelBreedte + '" },\n';
                });
                uit += "],\n";
            });
        });

        // Fakkelgloeden van het startscherm meenemen in dezelfde export.
        const fakkelTekst = bouwFakkelConfigTekst();
        if (fakkelTekst) uit += "\n" + fakkelTekst + "\n";

        uitvoerEl.value = uit;
        uitvoerEl.style.display = "block";
        uitvoerEl.select();
    });

    // --- reset: alle afstel-overrides wissen ---
    paneel.querySelector("#afstel-reset").addEventListener("click", () => {
        localStorage.removeItem(AFSTEL_OPSLAG);
        location.reload();
    });

    toonInfo();
}

// Hoofd-ingang van de schatkamer: opent de overzichtszaal (NT-vleugel).
function openSchatkamer() {
    const zaal = schatkamerZalen.nt;
    const zaalEl = document.querySelector("#zaal-scherm .sk-zaal");
    bouwZaal(zaalEl, zaal);
    if (zaalEl) {
        zaalEl.classList.remove("zoomt");
        zaalEl.style.transformOrigin = "";
    }
    document.getElementById("zaal-scherm").style.display = "flex";
    if (afstelModus) initAfstel(zaalEl);
}

// Sluit de overzichtszaal: terug naar het startscherm.
function sluitZaal() {
    document.getElementById("zaal-scherm").style.display = "none";
}

// Klik op een zone: de zaal zoomt op het klikgebied in (CSS-transitie op
// transform-origin van de zone), daarna verschijnt het vitrine-detailscherm
// er met een korte tegenbeweging overheen. De zoom is een illusie — de zaal
// blijft eronder gewoon openstaan voor het uitzoomen straks.
function zoomNaarZone(zone) {
    const zaalEl = document.querySelector("#zaal-scherm .sk-zaal");
    if (zaalEl) {
        const cx = parseFloat(zone.klik.left) + parseFloat(zone.klik.width) / 2;
        const cy = parseFloat(zone.klik.top) + parseFloat(zone.klik.height) / 2;
        zaalEl.style.transformOrigin = `${cx}% ${cy}%`;
        zaalEl.classList.add("zoomt");
    }

    setTimeout(() => {
        openVitrineScherm(zone.vitrine);
        // Zaal eronder weer rustig klaarzetten voor het uitzoomen.
        if (zaalEl) zaalEl.classList.remove("zoomt");
    }, ZOOM_MS);
}

// Opent het vitrine-detailscherm met de gegeven config (her)opgebouwd, met
// een korte inzoom-binnenkomst. "over-zaal" maakt de overlay-achtergrond
// transparant zodat de zaal eronder zichtbaar blijft tijdens de overgang.
function openVitrineScherm(config) {
    const scherm = document.getElementById("schatkamer-scherm");
    const vitrineEl = scherm ? scherm.querySelector(".schatkamer-vitrine") : null;
    bouwVitrine(vitrineEl, config);
    scherm.classList.add("over-zaal", "zoom-entree");
    scherm.style.display = "flex";
    setTimeout(() => scherm.classList.remove("zoom-entree"), ZOOM_MS + 50);
}

// Terug-knop in een vitrine: korte uitzoom, daarna komt de zaal eronder weer
// tevoorschijn (die stond nog open).
function sluitSchatkamer() {
    const scherm = document.getElementById("schatkamer-scherm");
    scherm.classList.add("zoom-exit");
    setTimeout(() => {
        scherm.classList.remove("zoom-exit");
        scherm.style.display = "none";
    }, ZOOM_MS - 40);
}

function openInstellingen() {
    werkGeluidKnopBij();
    document.getElementById("instellingen-scherm").style.display = "flex";
}
function sluitInstellingen() {
    document.getElementById("instellingen-scherm").style.display = "none";
}

// --- Steun de Bijbelkidsquiz (Instellingen → Over dit spel) ------------------
// Zelfde patroon als openMaten()/sluitMaten(): het ouderscherm gaat dicht, dit
// scherm open, en Terug draait dat precies om. De inhoud komt uit NL.steun in
// lang/nl.js en wordt bij elke opening opnieuw opgebouwd, zodat een
// tekstwijziging in het taalbestand meteen doorwerkt zonder HTML aan te raken.
function openSteun() {
    vulSteunScherm();
    document.getElementById("instellingen-scherm").style.display = "none";
    document.getElementById("steun-scherm").style.display = "flex";
    // Altijd bovenaan beginnen; een onthouden scrollstand is hier verwarrend.
    const box = document.querySelector("#steun-scherm .quiz-box");
    if (box) box.scrollTop = 0;
}

function sluitSteun() {
    document.getElementById("steun-scherm").style.display = "none";
    document.getElementById("instellingen-scherm").style.display = "flex";
}

// Bouwt het steunscherm op uit NL.steun. Bewust met DOM-methodes en
// textContent in plaats van innerHTML: de echte teksten komen er later in en
// mogen dan gewoon &, < of > bevatten zonder dat er iets stukgaat.
function vulSteunScherm() {
    const doel = document.getElementById("steun-inhoud");
    if (!doel) return;

    const t = (typeof NL !== "undefined" && NL.steun) || null;
    if (!t) return;   // taalbestand niet geladen: de HTML-vangnetteksten blijven staan

    doel.innerHTML = "";

    const zetTekst = (id, tekst) => {
        const el = document.getElementById(id);
        if (el && tekst) el.textContent = tekst;
    };
    zetTekst("steun-titel", t.titel);
    zetTekst("steun-kvk", t.kvk);
    zetTekst("steun-terug-boven", t.terugBoven);
    zetTekst("steun-terug-onder", t.terugOnder);

    (t.blokken || []).forEach((blok) => {
        if (blok.kop) {
            const kop = document.createElement("h3");
            kop.className = "naslag-kop";
            kop.textContent = blok.kop;
            doel.appendChild(kop);
        }

        (blok.items || []).forEach((item) => doel.appendChild(maakAlinea(item)));

        // Blok met alleen het nieuwste voortgangsbericht + link naar het
        // volledige overzicht. De lijst zelf staat in NL.updates.
        if (blok.nieuwsteUpdate) {
            const lijst = (typeof NL !== "undefined" && NL.updates && NL.updates.items) || [];
            if (lijst.length) doel.appendChild(maakAlinea(lijst[0]));

            const meer = document.createElement("button");
            meer.type = "button";
            meer.className = "tekst-link";
            meer.textContent = blok.meerLabel || "Bekijk alle updates";
            meer.onclick = openUpdates;
            doel.appendChild(meer);
        }

        if (blok.link) {
            // Bewust een <button> met openTabblad() en niet een <a>: knoppen in dit
            // spel erven hun lettertype van de browser, dus een <a> met dezelfde
            // classes zou in een ander font renderen. openTabblad() verbreekt de
            // koppeling van het nieuwe tabblad met dit venster.
            const knop = document.createElement("button");
            knop.className = "answer-btn niveau-btn niveau-advanced menu-knop-blauw";
            knop.textContent = blok.link.label;
            knop.onclick = () => openTabblad(blok.link.url);
            doel.appendChild(knop);
        }
    });
}

// Eén tekstregel voor de lees-schermen. Een gewone string wordt een alinea; een
// item {datum, tekst} krijgt de datum in goud vooraan, zoals een lemma in het
// woordenboek \u2014 zo leest een groeiende lijst als een tijdlijn. Gedeeld door
// het steunscherm en het updatescherm, zodat beide er hetzelfde uitzien.
function maakAlinea(item) {
    const p = document.createElement("p");
    p.className = "naslag-item";
    if (typeof item === "string") {
        p.textContent = item;
    } else {
        const datum = document.createElement("span");
        datum.className = "naslag-term";
        datum.textContent = item.datum;
        p.appendChild(datum);
        p.appendChild(document.createTextNode(" \u2014 " + item.tekst));
    }
    return p;
}

// --- Alle updates (Steun \u2192 Bekijk alle updates) ---------------------------
// Zelfde patroon als openSteun()/sluitSteun(), maar met het steunscherm als
// ouder: Terug keert dus terug naar Steun en niet naar Instellingen.
function openUpdates() {
    vulUpdatesScherm();
    document.getElementById("steun-scherm").style.display = "none";
    document.getElementById("updates-scherm").style.display = "flex";
    const box = document.querySelector("#updates-scherm .quiz-box");
    if (box) box.scrollTop = 0;
}

function sluitUpdates() {
    document.getElementById("updates-scherm").style.display = "none";
    document.getElementById("steun-scherm").style.display = "flex";
}

function vulUpdatesScherm() {
    const doel = document.getElementById("updates-inhoud");
    if (!doel) return;

    const t = (typeof NL !== "undefined" && NL.updates) || null;
    if (!t) return;   // taalbestand niet geladen: HTML-vangnet blijft staan

    doel.innerHTML = "";

    const zetTekst = (id, tekst) => {
        const el = document.getElementById(id);
        if (el && tekst) el.textContent = tekst;
    };
    zetTekst("updates-titel", t.titel);
    zetTekst("updates-terug-boven", t.terugBoven);
    zetTekst("updates-terug-onder", t.terugOnder);

    if (t.intro) {
        const intro = document.createElement("p");
        intro.className = "naslag-noot";
        intro.textContent = t.intro;
        doel.appendChild(intro);
    }

    (t.items || []).forEach((item) => doel.appendChild(maakAlinea(item)));
}
function wisselGeluid() {
    geluidAan = !geluidAan;
    localStorage.setItem("geluidAan", geluidAan ? "aan" : "uit");
    werkGeluidKnopBij();
}
function werkGeluidKnopBij() {
    const knop = document.getElementById("geluid-knop");
    if (!knop) return;
    knop.textContent = geluidAan ? "Geluid: aan" : "Geluid: uit";
    knop.classList.toggle("geluid-uit", !geluidAan);
}

function eindScherm() {
    // De ronde is afgelopen: de Terug-knop van de ronde verdwijnt. Het eindscherm
    // heeft hieronder zijn eigen knop terug naar het startscherm.
    const rondeStopKnop = document.getElementById("ronde-stop-knop");
    if (rondeStopKnop) rondeStopKnop.style.display = "none";

    if (oefenModus) {
        const stopKnop = document.getElementById("oefen-stop-knop");
        if (stopKnop) stopKnop.style.display = "none";

        const quizBox = document.querySelector("#quiz-scherm .quiz-box");
        if (quizBox) {
            quizBox.innerHTML = `
                <h2 class="quiz-title">Goed geoefend!</h2>
                <p class="quiz-question">Je had ${score} van de ${vragen.length} goed.</p>
                <p class="quiz-question">In de oefenmodus telt het niet mee — je kunt zo vaak oefenen als je wilt.</p>
                <button class="answer-btn niveau-terug" onclick="terugNaarStartscherm()">Terug</button>
            `;
        }
        return;
    }

    // Verborgen Schat: voorlopig geen beloning-/10-goed-logica. Een eenvoudig
    // slot met de score en een Terug-knop, los van de trofee-/kist-afhandeling.
    if (gekozenModus === "verborgen") {
        // Winvoorwaarde: alle vragen goed (10/10). Dan is de Verborgen Schat ontdekt
        // en zetten we de vlag, zodat de naslagpagina ontgrendelt. Idempotent —
        // opnieuw spelen mag en houdt de vlag gewoon op "waar".
        const allesGoed = score === vragen.length;
        if (allesGoed) {
            localStorage.setItem(profielSleutel("verborgenschat_voltooid"), "waar");
        }

        const slotRegel = allesGoed
            ? "Je hebt de Verborgen Schat ontdekt! 💎"
            : "Nog niet alles goed — probeer het opnieuw om de Verborgen Schat te ontdekken.";

        const quizBox = document.querySelector("#quiz-scherm .quiz-box");
        if (quizBox) {
            quizBox.innerHTML = `
                <h2 class="quiz-title">Verborgen Schat</h2>
                <p class="quiz-question">Je had er ${score} van de ${vragen.length} goed.</p>
                <p class="quiz-question">${slotRegel}</p>
                <button class="answer-btn niveau-terug" onclick="terugNaarStartscherm()">Terug naar startscherm</button>
            `;
        }
        return;
    }

    const alleGoed = score === vragen.length;
    const trofeeKleur = niveauNaarTrofee[gekozenNiveau]; // brons / zilver / goud

    // Het aantal goede antwoorden van deze ronde vastleggen, zodat de XP-balk
    // op het startscherm het ronderesultaat toont (terugNaarStartscherm reset
    // straks score/huidigeXP, daarom hier bewaren).
    laatsteRondeGoed = score;

    // Alleen bij 10/10 verdient de speler de trofee voor dit boek + niveau.
    // setTrofeeNiveau downgradet nooit, dus een al behaalde hogere trofee blijft.
    // Bij 10/10 verdient de speler bovendien één schildpunt voor deze
    // boek+niveau-combinatie, maar alleen als dat punt nog niet eerder
    // verdiend was — opnieuw spelen levert geen extra punt op.
    if (alleGoed && gekozenBoek && gekozenNiveau) {
        const boekKey = boekNaarKey[gekozenBoek];
        if (boekKey && trofeeKleur) {
            setTrofeeNiveau(boekKey, trofeeKleur);
        }
        if (boekKey && !isSchildpuntVerdiend(boekKey, gekozenNiveau)) {
            setSchildpuntVerdiend(boekKey, gekozenNiveau);
            updateSchildpuntenWeergave();
        }
    }

    // Bij 10/10 in de schatkist-modus verdient de speler de schatkist van dit
    // niveau (brons/zilver/goud). setKistStatus werkt de prijzenkast meteen bij.
    if (alleGoed && gekozenModus === "kist" && trofeeKleur) {
        setKistStatus(trofeeKleur, "verdiend");
    }

    const quizBox = document.querySelector("#quiz-scherm .quiz-box");

    const titel = alleGoed ? "Quiz voltooid!" : "Bijna gelukt!";

    const scoreRegel = `Je had er ${score} van de ${vragen.length} goed.`;

    const xpRegel = `Je hebt dit level ${score * 100} XP verdiend.`;

    // Slotbericht hangt af van de modus: een evangelie-trofee of een schatkist.
    const kistNamen = { brons: "bronzen", zilver: "zilveren", goud: "gouden" };
    let slotRegel;
    if (gekozenModus === "kist") {
        slotRegel = alleGoed
            ? `Je verdient de ${kistNamen[trofeeKleur]} schatkist! 🏆`
            : `Probeer het opnieuw om de ${kistNamen[trofeeKleur]} schatkist te verdienen!`;
    } else {
        slotRegel = alleGoed
            ? `Je verdient de ${trofeeKleur}en ${gekozenBoek}-trofee! 🏆`
            : `Probeer het opnieuw om de ${trofeeKleur}en ${gekozenBoek}-trofee te halen!`;
    }

    quizBox.innerHTML = `
        <h2 class="quiz-title">${titel}</h2>

        <p class="quiz-question">${scoreRegel}</p>

        <p class="quiz-question">${xpRegel}</p>

        <p class="quiz-question">${slotRegel}</p>

        <button class="answer-btn" onclick="terugNaarStartscherm()">
            Terug naar startscherm
        </button>
    `;
}

function updateXPBalk() {
    const xpVulling = document.getElementById("xp-vulling");
    const xpBoven = document.getElementById("xp");

    // De XP-balk op het startscherm toont het resultaat van de laatste ronde:
    // één tiende per goed antwoord, 10 goed = vol. Begrensd op 0–100%.
    const percentage = Math.min(laatsteRondeGoed, 10) * 10;

    if (xpVulling) xpVulling.style.width = percentage + "%";

    // De kleine XP-teller in de quiz toont de live momentscore van de ronde.
    if (xpBoven) xpBoven.innerHTML = huidigeXP;
}

// Balk direct invullen bij laden van de pagina
updateXPBalk();

// Schildpunten op het schild direct laten zien (uit localStorage).
updateSchildpuntenWeergave();

// Toon meteen de juiste trofee per evangelie.
alleBoekKeys.forEach(toonTrofee);

// Toon meteen de juiste schatkist per niveau.
alleKistKeys.forEach(toonKist);

// Verborgen schat (diamanten kist) meteen in de juiste staat zetten.
werkVerborgenSchatBij();

// Avatar + spelernaam direct uit localStorage tonen, zodat ze tussen sessies
// behouden blijven.
updateAvatarWeergave();

// De naam-krimp hangt af van de gemeten breedte van het bordje, en die
// verandert bij venstergrootte (--game-breedte schaalt mee) en zodra het
// Cinzel-lettertype geladen is (bredere glyphs). Herbereken daarom bij resize
// en na fonts.ready, anders klopt de eerste meting bij een fallback-font nog.
function herberekenVoornaamGrootte() {
    const voornaamEl = document.getElementById("speler-voornaam");
    if (voornaamEl) pasVoornaamGrootteAan(voornaamEl);
}
window.addEventListener("resize", herberekenVoornaamGrootte);
if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(herberekenVoornaamGrootte);
}

// Profiel-opstart: toon het startscherm met het laatst actieve profiel, of het
// Nieuw-spel-scherm als er nog geen enkel profiel bestaat.
initProfielOpstart();

// Klik-handlers voor de vier avatar-keuze-knoppen in het nieuw-spel-scherm.
// Wijzigt alleen de visuele selectie; pas op "Start" wordt het opgeslagen.
document.querySelectorAll(".avatar-keuze-btn").forEach((knop) => {
    knop.addEventListener("click", () => markeerAvatarKeuze(knop.dataset.avatar));
});

// =========================
// SCHERMNAVIGATIE — Evangeliën (scherm 1) <-> overige NT-boeken (scherm 2)
// Voor nu alleen de doorgang; scherm 2 is een lege placeholder. De fade en de
// achtergrond zitten in CSS (#nt-scherm-2 / .nt-pijl).
// =========================

// 1 = de Evangeliën (startscherm), 2 = de overige NT-boeken.
let huidigNtScherm = 1;

// Hoe dicht (in px) de muis bij de zijrand moet komen voordat de pijl onthult.
const NT_RAND_PX = 80;

function gaNaarScherm2() {
    if (huidigNtScherm === 2) return;
    huidigNtScherm = 2;
    const scherm2 = document.getElementById("nt-scherm-2");
    if (scherm2) {
        scherm2.classList.add("zichtbaar");
        scherm2.setAttribute("aria-hidden", "false");
    }
    huidigKastPaneel = 0;            // altijd op paneel 1 binnenkomen
    bouwNtKast(nt2Kast);             // standen verversen bij binnenkomst (live uit localStorage)
    // De rechterpijl hoort bij scherm 1; tijdens de overgang verbergen.
    const pijlRechts = document.getElementById("nt-pijl-naar-2");
    if (pijlRechts) pijlRechts.classList.remove("onthuld");
}

function gaNaarScherm1() {
    if (huidigNtScherm === 1) return;
    huidigNtScherm = 1;
    const scherm2 = document.getElementById("nt-scherm-2");
    if (scherm2) {
        scherm2.classList.remove("zichtbaar");
        scherm2.setAttribute("aria-hidden", "true");
    }
    const pijlLinks = document.getElementById("nt-pijl-naar-1");
    if (pijlLinks) pijlLinks.classList.remove("onthuld");
    // De "binnenkort"-melding weer verbergen bij het verlaten van scherm 2.
    const melding = document.getElementById("nt2-melding");
    if (melding) melding.classList.remove("zichtbaar");
}

// Klik op een groep-tegel van scherm 2. Voorlopig nog geen vragen erachter: we
// tonen een rustige melding. Later opent dit de quiz/onderdelen van die groep.
function openNtGroep(groep) {
    // Groepen met een boekenplank openen die overlay; enkel-boek-groepen
    // (Handelingen, Openbaring) gaan via directBoekPerGroep direct naar het boek.
    const plankPerGroep = {
        "Brieven van Paulus": boekenplanken.paulus,
        "Algemene brieven": boekenplanken.algemeen
    };
    if (plankPerGroep[groep]) {
        openBoekenplank(plankPerGroep[groep]);
        return;
    }
    // Enkel-boek-groepen (Handelingen, Openbaring) hebben geen plank: zodra er
    // een vragenpool bestaat openen ze direct het niveaukeuze-scherm. De guard op
    // vragenData zorgt dat een groep zonder pool gewoon op de "binnenkort"-melding
    // terugvalt (bv. Openbaring tot zijn pool er is).
    const directBoekPerGroep = {
        "Handelingen": "Handelingen",
        "Openbaring": "Openbaring"
    };
    const direct = directBoekPerGroep[groep];
    if (direct && vragenData[direct]) {
        openBoek(direct);
        return;
    }
    const melding = document.getElementById("nt2-melding");
    if (melding) {
        melding.textContent = `${groep} — binnenkort speelbaar.`;
        melding.classList.add("zichtbaar");
    }
}

// === Boekenplank-overlay (herbruikbaar) =====================================
// Config-gestuurde plank die over scherm 2 verschijnt bij klik op een NT-groep.
// Eén config-object per groep; bouwBoekenplank() (stap 2) vult straks de boeken.
// Stap 1: alleen titel/subtitel zetten + openen/sluiten. De plank is generiek,
// zodat "Algemene brieven" later dezelfde overlay met een andere lijst gebruikt.
// Eén boek = { id, naam, beschikbaar[, cover | embleem] }:
//   id        : interne slug, sluit aan op de trofee-/bestandsnamen
//   naam      : weergavenaam op het naamplaatje (los van id/bestandsnaam)
//   beschikbaar: true zodra er een vragenpool bestaat; tot dan "binnenkort" (stap 3)
//   cover     : optioneel pad naar een VOLLEDIGE cover-afbeelding (boek incl. rug
//               en embleem); die PNG ís dan het boek en vervangt de code-cover.
//   embleem   : optioneel pad naar alleen het symbool, midden op de code-cover;
//               ontbreken cover én embleem, dan tekent de builder een gouden disc.
const boekenplanken = {
    paulus: {
        titel: "Brieven van Paulus",
        subtitel: "Kies een brief",
        // De acht gebundelde Paulusbrieven (zie trofee-overzicht.md), in twee
        // rijen van vier. Romeinen heeft als eerste een vragenpool en is
        // ontgrendeld; de overige zeven blijven beschikbaar: false tot hun pool er is.
        boeken: [
            { id: "romeinen",            naam: "Romeinen",              beschikbaar: true,  cover: "images/boek-romeinen.webp" },
            { id: "korintiers",          naam: "1 & 2 Korintiërs",      beschikbaar: true,  cover: "images/boek-korintiers.webp" },
            { id: "galaten",             naam: "Galaten",               beschikbaar: true,  cover: "images/boek-galaten.webp" },
            { id: "efeziers",            naam: "Efeziërs",              beschikbaar: true,  cover: "images/boek-efeziers.webp" },
            { id: "filippenzen",         naam: "Filippenzen",           beschikbaar: true,  cover: "images/boek-filippenzen.webp" },
            { id: "kolossenzen-filemon", naam: "Kolossenzen & Filemon", beschikbaar: true,  cover: "images/boek-kolossenzen-filemon.webp" },
            { id: "tessalonicenzen",     naam: "1 & 2 Tessalonicenzen", beschikbaar: true,  cover: "images/boek-tessalonicenzen.webp" },
            { id: "timoteus-titus",      naam: "Timoteüs & Titus",      beschikbaar: true,  cover: "images/boek-timoteus-titus.webp" }
        ]
    },
    algemeen: {
        titel: "Algemene brieven",
        subtitel: "Kies een brief",
        // De vier gebundelde algemene brieven (zie trofee-overzicht.md). Nog geen
        // vragenpools -> allemaal beschikbaar: false. "Brieven van Johannes"
        // (1-3 Joh.) staat bewust los van het evangelie "Johannes".
        boeken: [
            { id: "hebreeen",        naam: "Hebreeën",             beschikbaar: true,  cover: "images/boek-hebreeen.webp" },
            { id: "jakobus",         naam: "Jakobus",              beschikbaar: true,  cover: "images/boek-jakobus.webp" },
            { id: "petrus-judas",    naam: "Petrus & Judas",       beschikbaar: true,  cover: "images/boek-petrus-judas.webp" },
            { id: "johannesbrieven", naam: "Brieven van Johannes", beschikbaar: true,  cover: "images/boek-johannesbrieven.webp" }
        ]
    }
};

function openBoekenplank(config) {
    const overlay = document.getElementById("boekenplank");
    if (!overlay) return;

    const titel = document.getElementById("boekenplank-titel");
    const subtitel = document.getElementById("boekenplank-subtitel");
    if (titel) titel.textContent = config.titel || "";
    if (subtitel) subtitel.textContent = config.subtitel || "";

    // Eventuele "binnenkort"-melding van een vorige keer wissen bij het openen.
    const melding = document.getElementById("boekenplank-melding");
    if (melding) {
        melding.textContent = "";
        melding.classList.remove("zichtbaar");
    }

    bouwBoekenplank(config);

    overlay.classList.add("zichtbaar");
    overlay.setAttribute("aria-hidden", "false");
}

// Klik op een boek op de plank: speelbaar -> start de quiz-engine met de
// weergavenaam (sleutel in vragenData); nog niet speelbaar -> vriendelijke
// "binnenkort"-melding, zonder fout.
function kiesPlankBoek(boek) {
    if (boek.beschikbaar) {
        sluitBoekenplank();
        openBoek(boek.naam);
    } else {
        toonPlankMelding("Binnenkort beschikbaar");
    }
}

function toonPlankMelding(tekst) {
    const melding = document.getElementById("boekenplank-melding");
    if (!melding) return;
    melding.textContent = tekst;
    melding.classList.add("zichtbaar");
}

// Vult de plank config-gestuurd: rijen van vier boeken, elk met een boek-cover
// (plaatshouder-embleem of echte symboolafbeelding) en een gouden naamplaatje.
// Generiek: "Algemene brieven" gebruikt later dezelfde builder met een andere
// boekenlijst. Het klikgedrag + de beschikbaar-logica komen in stap 3.
function bouwBoekenplank(config) {
    const planken = document.getElementById("boekenplank-planken");
    if (!planken) return;
    planken.innerHTML = "";

    const boeken = config.boeken || [];
    const perRij = 4;

    for (let start = 0; start < boeken.length; start += perRij) {
        const rij = document.createElement("div");
        rij.className = "boekenplank-rij";

        boeken.slice(start, start + perRij).forEach((boek) => {
            const knop = document.createElement("button");
            knop.type = "button";
            knop.className = "plank-boek";
            knop.dataset.id = boek.id;
            knop.setAttribute("aria-label", boek.naam);

            const cover = document.createElement("div");
            cover.className = "plank-boek-cover";

            // Drie cover-varianten, van "echtst" naar plaatshouder:
            //   boek.cover  -> volledige cover-afbeelding (groen boek incl. embleem);
            //                  de PNG ís het boek, dus geen code-getekende blauwe cover.
            //   boek.embleem-> alleen het symbool, gecentreerd op de blauwe code-cover.
            //   geen van beide -> code-getekende gouden plaatshouder-disc.
            if (boek.cover) {
                cover.classList.add("plank-boek-cover-foto");
                const coverImg = document.createElement("img");
                coverImg.className = "plank-cover-img";
                coverImg.src = boek.cover;
                coverImg.alt = "";
                cover.appendChild(coverImg);
            } else {
                let embleem;
                if (boek.embleem) {
                    embleem = document.createElement("img");
                    embleem.className = "plank-embleem";
                    embleem.src = boek.embleem;
                    embleem.alt = "";
                } else {
                    embleem = document.createElement("div");
                    embleem.className = "plank-embleem plank-embleem-plaatshouder";
                }
                cover.appendChild(embleem);
            }

            const naam = document.createElement("div");
            naam.className = "plank-naam";
            naam.textContent = boek.naam;

            // Nog niet speelbaar: dimmen + een klein gouden slotje op de cover.
            if (!boek.beschikbaar) {
                knop.classList.add("vergrendeld");
                const slot = document.createElement("span");
                slot.className = "plank-slot";
                slot.setAttribute("aria-hidden", "true");
                slot.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 0 1 6 0v3H9z"/></svg>';
                cover.appendChild(slot);
            }

            knop.append(cover, naam);
            knop.addEventListener("click", () => kiesPlankBoek(boek));
            rij.appendChild(knop);
        });

        planken.appendChild(rij);
    }
}

function sluitBoekenplank() {
    const overlay = document.getElementById("boekenplank");
    if (!overlay) return;
    overlay.classList.remove("zichtbaar");
    overlay.setAttribute("aria-hidden", "true");
}

// === NT-scherm 2: vier groepen als boeken op stenen plateaus ================
// Config-gestuurd, in dezelfde stijl als de Schatkamer-vitrines. Per positie
// drie beeldlagen (plateau, klikbaar boek, naambordje) + de naam in code op het
// bordje. Maten/posities zijn ruwe startwaarden (evangelie-x'en als basis) en
// worden later fijn afgesteld. De klik roept de bestaande openNtGroep() aan.
const ntScherm2 = {
    plateauBron: "images/stenen_plateau.webp",
    bordBron:    "images/naambordje.webp",
    // Gedeelde maten (size) voor boek/plateau/bord/naam — gelden voor alle boeken.
    boekHoogte:     "21%",
    plateauBreedte: "17.4%",
    bordBreedte:    "12%",
    naamBreedte:    "11%",
    naamHoogte:     "4%",
    naamGrootte:    "0.70cqi",
    // Per boek: eigen x PER LAAG (plateauX/boekX/bordX/naamX), zodat je het boek
    // los van het plateau kunt centreren — handig bij de schuin gerenderde covers.
    // De boekhoogte is gedeeld (zie boven); per laag wel een eigen bodem.
    // Afstelbaar via ?afstel=aan.
    boeken: [
        { naam: "Handelingen",        groep: "Handelingen",        boek: "images/handelingenboek.webp",
          plateauX: "20.94%", boekX: "16.77%", bordX: "20.47%", naamX: "20.4%",
          boekBodem: "10%", plateauBodem: "-0.58%", bordBodem: "2.3%", naamBodem: "5.52%" },
        { naam: "Brieven van Paulus", groep: "Brieven van Paulus", boek: "images/brievenvanpaulusboek.webp",
          plateauX: "35.85%", boekX: "31.51%", bordX: "35.85%", naamX: "35.95%",
          boekBodem: "10%", plateauBodem: "-0.57%", bordBodem: "2.29%", naamBodem: "5.54%" },
        { naam: "Algemene brieven",   groep: "Algemene brieven",   boek: "images/algemenebrievenboek.webp",
          plateauX: "50.64%", boekX: "46.1%", bordX: "50.9%", naamX: "50.85%",
          boekBodem: "10%", plateauBodem: "-0.66%", bordBodem: "2.3%", naamBodem: "5.33%" },
        { naam: "Openbaring",         groep: "Openbaring",         boek: "images/apocalypseboek.webp",
          plateauX: "65.75%", boekX: "60.92%", bordX: "66.06%", naamX: "65.95%",
          boekBodem: "10%", plateauBodem: "-0.4%", bordBodem: "2.57%", naamBodem: "5.79%" }
    ]
};

function bouwNtScherm2() {
    const houder = document.getElementById("nt2-boeken");
    if (!houder) return;
    houder.innerHTML = "";

    ntScherm2.boeken.forEach((b, i) => {
        // 1) Stenen plateau (achterste laag). Eigen bodem, gedeelde breedte.
        const plateau = document.createElement("img");
        plateau.className = "nt2-plateau";
        plateau.alt = "";
        plateau.src = ntScherm2.plateauBron;
        plateau.style.left = b.plateauX;
        plateau.style.bottom = b.plateauBodem;
        plateau.style.width = ntScherm2.plateauBreedte;

        // 2) Het boek (klikbaar buiten afstel; eigen hoogte + bodem per boek).
        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "nt2-boek";
        knop.style.left = b.boekX;
        knop.style.bottom = b.boekBodem;
        knop.style.height = ntScherm2.boekHoogte;   // gedeelde hoogte voor alle vier
        knop.setAttribute("aria-label", b.naam);
        if (!afstelModus) knop.addEventListener("click", () => openNtGroep(b.groep));

        const boekImg = document.createElement("img");
        boekImg.className = "nt2-boek-img";
        boekImg.alt = b.naam;
        boekImg.src = b.boek;
        knop.appendChild(boekImg);

        // 2b) Glow-host als APARTE <div> (geen <button>). Een <button> klipt zijn
        // pseudo-element op de border-box, waardoor de radiale hover-glow een
        // rechthoek werd; een <div> klipt niet, dus de glow waaiert rond uit zoals
        // op scherm 1. Kopieert exact de boekpositie (left/bottom/hoogte) en laat de
        // knop-positionering, -klik en -afstel volledig ongemoeid. Puur decoratief
        // (pointer-events uit in CSS); licht op via een hover-koppeling op de knop.
        const glow = document.createElement("div");
        glow.className = "nt2-boek-glow";
        glow.setAttribute("aria-hidden", "true");
        glow.style.left = b.boekX;
        glow.style.bottom = b.boekBodem;
        glow.style.height = ntScherm2.boekHoogte;
        knop.addEventListener("mouseenter", () => glow.classList.add("aan"));
        knop.addEventListener("mouseleave", () => glow.classList.remove("aan"));

        // 3) Naambordje + de naam er in code overheen.
        const bord = document.createElement("img");
        bord.className = "nt2-bord";
        bord.alt = "";
        bord.src = ntScherm2.bordBron;
        bord.style.left = b.bordX;
        bord.style.bottom = b.bordBodem;
        bord.style.width = ntScherm2.bordBreedte;

        const naam = document.createElement("div");
        naam.className = "nt2-naam";
        naam.textContent = b.naam;
        naam.style.left = b.naamX;
        naam.style.bottom = b.naamBodem;
        naam.style.width = ntScherm2.naamBreedte;
        naam.style.height = ntScherm2.naamHoogte;
        naam.style.fontSize = ntScherm2.naamGrootte;

        // In afstelmodus elk element stempelen (selectie + koppeling naar de
        // config) zodat het scherm-2-spoor in initAfstel ze kan plaatsen.
        if (afstelModus) {
            [["plateau", plateau], ["boek", knop], ["bord", bord], ["naam", naam]].forEach(([laag, el]) => {
                el.dataset.boekIndex = i;
                el.dataset.laag = laag;
                el.dataset.afstelNaam = b.naam + " — " + laag;
            });
        }

        houder.append(plateau, knop, glow, bord, naam);
    });
}

// === NT-prijzenkast op scherm 2 (individuele trofeeën) ======================
// Compacte, config-gestuurde kast-renderer voor de rechterkast op scherm 2.
// Bedenkt de nissen NIET opnieuw, maar leest ze uit de bestaande NT-zaal-
// vitrineconfigs (één bron van waarheid). Vier groepen onder elkaar, in
// canonieke volgorde. Geen kisten/Verborgen Schat hier (die staan op scherm 1).
// Herbruikbaar: dezelfde renderer zou later ook scherm 1 kunnen voeden.
// Twee doorschuifbare panelen; één tegelijk in beeld (eigen carrousel binnen de
// kast). Elk paneel = een achtergrond-PNG met geschilderde nissen + de groepen
// die erin horen. De nissen komen uit de bestaande vitrineconfigs (één bron van
// waarheid); de enkel-nissen (Handelingen/Openbaring) staan inline.
// Leidt de kast-nissen af uit de vitrine-nissen: alleen sleutel/basis/naam (de
// bron van waarheid). De POSITIE komt uit het raster van de groep, niet per
// stuk. Maakt nieuwe objecten (geen mutatie van de gedeelde vitrineconfig).
function kastNissen(vitrineNissen) {
    return vitrineNissen.map((n) => ({ sleutel: n.sleutel, basis: n.basis, naam: n.naam }));
}

// ====== Afstelbare kast-getallen ======
// Per groep een raster (oorsprong + kolom-/rijafstand + breedte) i.p.v. losse
// posities. Zo stel je een groep af met een paar getallen; uitzonderingen nudge
// je via `offsets` (per nis-index: { dx, dy } in % van het paneel, optioneel
// `breedte`). Alle waarden zijn % van het PANEEL (de kast-rechthoek).
//
//   raster: { x0, y0, kolStap, rijStap, kolommen, breedte }
//     x0/y0    = MIDDEN van de eerste nis (linksboven)
//     kolStap  = horizontale afstand tussen nis-middens
//     rijStap  = verticale afstand tussen rij-middens
//     kolommen = aantal per rij (rijen volgen uit het aantal nissen)
//     breedte  = trofeebreedte (% paneel); naambordje hangt er via CSS onder
//   Enkele grote nissen (Handelingen/Openbaring) hebben geen raster maar een
//   directe x/y/breedte per nis.
const nt2Kast = {
    panelen: [
        {
            achtergrond: "images/nt2-kast-paneel1.webp",
            groepen: [
                { zone: "handelingen",
                  nissen: [
                      { sleutel: "trofee_handelingen", basis: "handelingen", naam: "Handelingen",
                        x: "54.52%", y: "25.12%", breedte: "20.60%",
                        labelX: "54.79%", labelY: "39.04%", labelBreedte: "27.30%" }
                  ] },
                { zone: "paulusbrieven",
                  nissen: [
                      { sleutel: "trofee_romeinen", basis: "romeinen", naam: "Romeinen",
                        x: "19.50%", y: "60.35%", breedte: "17.60%",
                        labelX: "19.49%", labelY: "71.49%", labelBreedte: "16.20%" },
                      { sleutel: "trofee_korintiers", basis: "korintiers", naam: "Korintiërs",
                        x: "41.69%", y: "60.56%", breedte: "17.00%",
                        labelX: "41.96%", labelY: "71.49%", labelBreedte: "17.00%" },
                      { sleutel: "trofee_galaten", basis: "galaten", naam: "Galaten",
                        x: "65.49%", y: "60.13%", breedte: "17.80%",
                        labelX: "65.23%", labelY: "71.49%", labelBreedte: "16.80%" },
                      { sleutel: "trofee_efeziers", basis: "efeziers", naam: "Efeziërs",
                        x: "87.70%", y: "63.98%", breedte: "11.40%",
                        labelX: "88.49%", labelY: "71.52%", labelBreedte: "16.60%" },
                      { sleutel: "trofee_filippenzen", basis: "filippenzen", naam: "Filippenzen",
                        x: "18.96%", y: "86.62%", breedte: "11.20%",
                        labelX: "19.50%", labelY: "94.36%", labelBreedte: "17.00%" },
                      { sleutel: "trofee_kolossenzen_filemon", basis: "kolossenzen-filemon", naam: "Kolossenzen",
                        x: "41.70%", y: "87.26%", breedte: "11.20%",
                        labelX: "41.96%", labelY: "94.36%", labelBreedte: "14.60%" },
                      { sleutel: "trofee_tessalonicenzen", basis: "tessalonicenzen", naam: "Tessalonicenzen",
                        x: "65.23%", y: "87.48%", breedte: "11.60%",
                        labelX: "65.23%", labelY: "94.38%", labelBreedte: "13.00%" },
                      { sleutel: "trofee_timoteus_titus", basis: "timoteus-titus", naam: "Timoteüs",
                        x: "87.96%", y: "87.48%", breedte: "10.60%",
                        labelX: "88.23%", labelY: "94.39%", labelBreedte: "17.00%" }
                  ] }
            ]
        },
        {
            achtergrond: "images/nt2-kast-paneel2.webp",
            groepen: [
                { zone: "algemenebrieven",
                  nissen: [
                      { sleutel: "trofee_hebreeen", basis: "hebreeen", naam: "Hebreeën",
                        x: "13.90%", y: "30.44%", breedte: "11.80%",
                        labelX: "13.91%", labelY: "38.60%", labelBreedte: "18.40%" },
                      { sleutel: "trofee_jakobus", basis: "jakobus", naam: "Jakobus",
                        x: "36.37%", y: "30.02%", breedte: "12.60%",
                        labelX: "37.17%", labelY: "38.60%", labelBreedte: "21.80%" },
                      { sleutel: "trofee_petrus_judas", basis: "petrus-judas", naam: "Petrus & Judas",
                        x: "57.76%", y: "29.15%", breedte: "13.60%",
                        labelX: "58.31%", labelY: "38.60%", labelBreedte: "20.40%" },
                      { sleutel: "trofee_johannesbrieven", basis: "johannesbrieven", naam: "1-3 Johannes",
                        x: "79.98%", y: "27.24%", breedte: "16.60%",
                        labelX: "80.24%", labelY: "38.59%", labelBreedte: "20.00%" }
                  ] },
                { zone: "openbaring",
                  nissen: [
                      { sleutel: "trofee_openbaring", basis: "openbaring", naam: "Openbaring",
                        x: "47.87%", y: "69.33%", breedte: "24.40%",
                        labelX: "48.14%", labelY: "85.81%", labelBreedte: "27.30%" }
                  ] }
            ]
        }
    ]
};

// Geeft ELK element een eigen positie (trofee + naambordje), als %-strings van
// het paneel. Het raster dient alleen als STARTwaarde: hieruit worden trofee-
// x/y/breedte berekend als die nog niet bestaan; het naambordje krijgt een
// startpositie net onder de trofee. Daarna stelt de afstelmodus elk element los
// bij en schrijft de waarden hierheen terug. Eén keer draaien bij het laden.
function expandeerKastPosities(kast) {
    kast.panelen.forEach((pan) => {
        pan.groepen.forEach((groep) => {
            groep.nissen.forEach((nis, i) => {
                if (nis.x === undefined && groep.raster) {
                    const r = groep.raster;
                    const kol = i % r.kolommen, rij = Math.floor(i / r.kolommen);
                    nis.x = (r.x0 + kol * r.kolStap).toFixed(2) + "%";
                    nis.y = (r.y0 + rij * r.rijStap).toFixed(2) + "%";
                    nis.breedte = r.breedte + "%";
                }
                if (nis.labelX === undefined) {              // startpositie van het naambordje
                    const tx = parseFloat(nis.x), ty = parseFloat(nis.y), tb = parseFloat(nis.breedte);
                    nis.labelX = tx.toFixed(2) + "%";
                    nis.labelY = (ty + 12).toFixed(2) + "%";        // net onder de trofee
                    nis.labelBreedte = (tb * 1.3).toFixed(2) + "%";
                }
            });
        });
    });
}
expandeerKastPosities(nt2Kast);

// Welk kastpaneel nu in beeld is — eigen state, los van huidigNtScherm.
let huidigKastPaneel = 0;

// Bouwt het ACTIEVE kastpaneel op: paneel-PNG als achtergrond + per groep een
// kopje-overlay en de trofeeën in hun nissen (absoluut geplaatst uit de config).
// Werkt ook de 1/2-indicator en de pijl-zichtbaarheid bij.
function bouwNtKast(kast) {
    const houder = document.getElementById("nt2-kast");
    const inhoud = document.getElementById("nt2-kast-inhoud");
    if (!houder || !inhoud) return;

    const aantal = kast.panelen.length;
    huidigKastPaneel = Math.min(aantal - 1, Math.max(0, huidigKastPaneel));
    const paneel = kast.panelen[huidigKastPaneel];

    // Paneel-PNG als achtergrond (met nette placeholder-fallback als hij mist).
    zetSchatkamerAchtergrond(houder, paneel.achtergrond, "");

    inhoud.innerHTML = "";
    paneel.groepen.forEach((groep, g) => {
        // Geen groepskopjes (de namen staan al op de boeken + naamplaatjes). Per
        // nis een LOSSE trofee + een LOS naambordje, elk met een eigen positie en
        // — in afstelmodus — eigen stempel zodat ze los af te stellen zijn.
        groep.nissen.forEach((nis, i) => {
            const trofee = maakKastTrofee(nis, groep.zone);
            const label  = maakKastLabel(nis, groep.zone);
            if (afstelModus) {
                stempelKast(trofee, "trofee", huidigKastPaneel, g, i, nis.naam);
                if (label) stempelKast(label, "label", huidigKastPaneel, g, i, nis.naam + " (bordje)");
            }
            inhoud.appendChild(trofee);
            if (label) inhoud.appendChild(label);
        });
    });

    // 1/2-indicator + pijl-zichtbaarheid (links verborgen op paneel 1, rechts op het laatste).
    const indicator = document.getElementById("nt2-kast-indicator");
    if (indicator) indicator.textContent = `${huidigKastPaneel + 1} / ${aantal}`;
    const pijlLinks = houder.querySelector(".kast-pijl-links");
    const pijlRechts = houder.querySelector(".kast-pijl-rechts");
    if (pijlLinks) pijlLinks.classList.toggle("verborgen", huidigKastPaneel === 0);
    if (pijlRechts) pijlRechts.classList.toggle("verborgen", huidigKastPaneel === aantal - 1);
}

// Koppelt een element aan zijn nis in nt2Kast (voor het kast-afstelspoor).
function stempelKast(el, type, p, g, i, naam) {
    el.dataset.kastType = type;          // "trofee" of "label"
    el.dataset.kastPaneel = p;
    el.dataset.kastGroep = g;
    el.dataset.kastNis = i;
    el.dataset.afstelNaam = naam;
}

// Losse trofee, gecentreerd op nis.x/nis.y, breedte nis.breedte. Stand LIVE via
// leesTrofeeStand(); states via de vitrine-filterrecepten. Klik (buiten afstel)
// -> de zone in de Schatkamer. Silhouet als de kunst nog ontbreekt.
function maakKastTrofee(nis, zone) {
    const wrap = document.createElement("div");
    wrap.className = "kast-nis";
    wrap.style.left = nis.x;
    wrap.style.top = nis.y;
    wrap.style.width = nis.breedte;
    wrap.title = nis.naam;

    const stand = leesTrofeeStand(nis.sleutel);          // "geen"|"brons"|"zilver"|"goud"
    const img = document.createElement("img");
    img.className = "kast-trofee " + (stand === "geen" ? "sk-schaduw" : stand);
    img.src = `images/${nis.basis}-zilver.webp`;
    img.alt = nis.naam;
    img.addEventListener("error", () => {
        const sil = document.createElement("div");
        sil.className = "kast-trofee kast-trofee-silhouet";
        img.replaceWith(sil);
    }, { once: true });
    wrap.appendChild(img);

    if (!afstelModus) wrap.addEventListener("click", () => naarSchatkamerZone(zone));
    return wrap;
}

// Los naambordje, gecentreerd op nis.labelX/nis.labelY, breedte nis.labelBreedte.
// Eigen element (geen kind van de trofee) zodat het onafhankelijk te plaatsen en
// af te stellen is. Ornate naambordje + goud-gradiënt-tekst (uit lang/nl.js).
function maakKastLabel(nis, zone) {
    const afk = (typeof NL !== "undefined" && NL.afkortingen[nis.basis]) || "";
    if (!afk) return null;
    const label = document.createElement("div");
    label.className = "kast-label";
    label.style.left = nis.labelX;
    label.style.top = nis.labelY;
    label.style.width = nis.labelBreedte;
    label.title = nis.naam;

    const tekst = document.createElement("span");
    tekst.className = "kast-label-tekst";
    tekst.textContent = afk;
    label.appendChild(tekst);

    if (!afstelModus) label.addEventListener("click", () => naarSchatkamerZone(zone));
    return label;
}

// Doorschuiven tussen de kastpanelen. Eigen pijltjes + eigen state, dus botst
// niet met de schermcarrousel (die op de ArrowLeft/Right-toetsen reageert).
function kastPaneel(richting) {
    const aantal = nt2Kast.panelen.length;
    const nieuw = Math.min(aantal - 1, Math.max(0, huidigKastPaneel + richting));
    if (nieuw === huidigKastPaneel) return;
    huidigKastPaneel = nieuw;
    bouwNtKast(nt2Kast);
}

// Klik op een kast-nis: open de Schatkamer-zaal en zoom meteen in op de
// bijbehorende zone (kast = samenvatting, Schatkamer = detail).
function naarSchatkamerZone(zoneId) {
    const zone = schatkamerZalen.nt.zones.find((z) => z.id === zoneId);
    if (!zone) return;
    openSchatkamer();
    zoomNaarZone(zone);
}

// Hulp: staat er een schermvullende overlay open (quiz, keuze, naslag, schatkamer)?
// Dan mogen de pijltjestoetsen niet van hoofdscherm wisselen.
function eenOverlayOpen() {
    const overlays = document.querySelectorAll(".quiz-overlay, .schatkamer-overlay");
    if (Array.from(overlays).some((o) => o.style.display && o.style.display !== "none")) return true;
    // De boekenplank schakelt via een class (geen display), dus apart checken.
    const plank = document.getElementById("boekenplank");
    return !!(plank && plank.classList.contains("zichtbaar"));
}

(function initSchermnavigatie() {
    const container = document.getElementById("game-container");
    if (!container) return;

    bouwNtScherm2();                 // vier NT-boeken op plateaus opbouwen
    bouwNtKast(nt2Kast);             // de NT-prijzenkast (individuele trofeeën) rechts

    // Muis bij de zijrand -> de bijbehorende pijl onthullen. Alleen op echte
    // hover-apparaten; op touch staan de pijlen via de CSS-media-query al zacht
    // zichtbaar, en daar zou mousemove maar tot geflikker leiden.
    if (window.matchMedia("(hover: hover)").matches) {
        container.addEventListener("mousemove", (e) => {
            const r = container.getBoundingClientRect();
            const pijlRechts = document.getElementById("nt-pijl-naar-2");
            const pijlLinks = document.getElementById("nt-pijl-naar-1");

            if (huidigNtScherm === 1 && pijlRechts) {
                const bijRand = e.clientX <= r.right && (r.right - e.clientX) <= NT_RAND_PX;
                pijlRechts.classList.toggle("onthuld", bijRand);
            } else if (huidigNtScherm === 2 && pijlLinks) {
                const bijRand = e.clientX >= r.left && (e.clientX - r.left) <= NT_RAND_PX;
                pijlLinks.classList.toggle("onthuld", bijRand);
            }
        });

        // Verlaat de muis de game-container, dan de pijlen weer verbergen.
        container.addEventListener("mouseleave", () => {
            const pijlRechts = document.getElementById("nt-pijl-naar-2");
            const pijlLinks = document.getElementById("nt-pijl-naar-1");
            if (pijlRechts) pijlRechts.classList.remove("onthuld");
            if (pijlLinks) pijlLinks.classList.remove("onthuld");
        });
    }

    // Toetsenbord: -> vooruit op scherm 1, <- terug op scherm 2. Niet als er in een
    // tekstveld wordt getypt of als er een overlay open staat.
    document.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        if (afstelModus) return;                 // pijltjes zijn in afstel voor nudgen; navigeer met de pijlknoppen
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (eenOverlayOpen()) return;
        if (e.key === "ArrowRight" && huidigNtScherm === 1) gaNaarScherm2();
        else if (e.key === "ArrowLeft" && huidigNtScherm === 2) gaNaarScherm1();
    });
})();

// Testversie-lint: klein pill-label linksonder op het startscherm. Wordt in
// #game-container gehangen zodat het meeschaalt; de dekkende quiz-overlays
// (z-index 999) en scherm 2 (z-index 40) bedekken het vanzelf, dus het is
// alleen op het startscherm zichtbaar. pointer-events:none in de CSS.
if (BETA_MODUS) {
    const container = document.getElementById("game-container");
    if (container) {
        const lint = document.createElement("div");
        lint.className = "beta-lint";
        lint.textContent = "TESTVERSIE";
        lint.setAttribute("aria-hidden", "true");
        container.appendChild(lint);
    }
}

// --- Donatie-lantaarn: klikgedrag ------------------------------------------
// De klikzone (.donatie-zone) en de melding (.donatie-melding) staan in de HTML;
// de hover-gloed zit in de CSS. Hier alleen het klikgedrag, gestuurd door de
// vlaggen bovenaan. Uit -> in-stijl melding; aan -> DONATIE_URL in nieuwe tab.
(function initDonatieLantaarn() {
    const zone = document.getElementById("donatie-zone");
    if (!zone) return;
    const melding = document.getElementById("donatie-melding");
    let verbergTimer = null;

    function toonMelding(tekst) {
        if (!melding) return;
        melding.textContent = tekst;
        melding.classList.add("zichtbaar");
        clearTimeout(verbergTimer);
        verbergTimer = setTimeout(() => melding.classList.remove("zichtbaar"), 3200);
    }

    function activeer() {
        if (DONATIE_ACTIEF && DONATIE_URL) {
            openTabblad(DONATIE_URL);
        } else {
            toonMelding("Steun dit project — binnenkort mogelijk!");
        }
    }

    zone.addEventListener("click", activeer);
    zone.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); activeer(); }
    });
})();

// Afstelmodus (?afstel=aan): open meteen de zaal en activeer de afstel-UI.
if (afstelModus) openSchatkamer();

// =========================================================================
// FAKKEL-GLOED — decoratieve, "levende" gloed op de fakkels van het
// startscherm. Volledig additief en decoratief: de laag krijgt in de CSS
// pointer-events:none, dus de klikvakken (.boek-zone, menu-zones) en de
// quizlogica blijven onaangeroerd. De achtergrondafbeelding wordt niet geraakt;
// dit is enkel een extra laag bovenop het toneel.
//
// Posities staan in % van #game-container (net als .boek-zone), zodat ze in
// fullscreen én in het kleinere venster kloppen — nooit vaste vensterpixels.
// Stel de waarden hieronder bij om de gloeden precies op de fakkels te leggen,
// of sleep ze live met ?afstel=aan: bij loslaten wordt de bijgewerkte
// FAKKEL_GLOED-config in de console gelogd, klaar om hier terug te plakken.
// =========================================================================

// --- CONFIG: één regel per fakkel. left/top/grootte in % van het toneel
//     (#game-container); duur/vertraging (seconden) sturen de onregelmatige,
//     niet-synchrone flikkering. Beginwaarden zijn schattingen op de branders;
//     fijn bijschuiven met de getallen hieronder of met ?afstel=aan. ---
const FAKKEL_GLOED = [
    { left: 6,    top: 86.7, grootte: 6, duur: 2.4, vertraging: 0.0 },  // lantaarn linksonder (ongewijzigd)
    { left: 28.1, top: 56.2, grootte: 7, duur: 3.1, vertraging: 0.7 },  // brander links-laag (onderaan de trap)
    { left: 35.1, top: 42.9, grootte: 6, duur: 3.4, vertraging: 0.4 },  // brander links-hoog (boven de balustrade)
    { left: 68.2, top: 56.2, grootte: 7, duur: 2.7, vertraging: 1.3 },  // brander rechts-laag (onderaan de trap)
    { left: 61.9, top: 42.8, grootte: 6, duur: 2.9, vertraging: 1.0 },  // brander rechts-hoog (boven de balustrade)
];

// Gedeelde bouwer: maakt één .fakkel-laag uit een gloed-config en geeft 'm terug.
// Bewust scherm-ONAFHANKELIJK — scherm 1 en scherm 2 delen dezelfde klassen,
// keyframes en reduced-motion-regel (style.css). Per scherm verschilt alléén de
// config die je hier meegeeft; er is geen gedupliceerde flikker-CSS of -logica.
function bouwFakkelLaag(config) {
    const laag = document.createElement("div");
    laag.className = "fakkel-laag";
    laag.setAttribute("aria-hidden", "true");

    config.forEach((f, i) => {
        const gloed = document.createElement("div");
        gloed.className = "fakkel-gloed";
        gloed.style.left = f.left + "%";
        gloed.style.top = f.top + "%";
        gloed.style.setProperty("--fakkel-grootte", f.grootte + "%");
        gloed.style.setProperty("--fakkel-duur", f.duur + "s");
        gloed.style.setProperty("--fakkel-vertraging", f.vertraging + "s");
        gloed.dataset.index = i;

        const vlam = document.createElement("div");
        vlam.className = "vlam";
        gloed.appendChild(vlam);
        laag.appendChild(gloed);
    });

    return laag;
}

(function bouwFakkelGloed() {
    const container = document.getElementById("game-container");
    if (!container) return;

    const laag = bouwFakkelLaag(FAKKEL_GLOED);
    container.appendChild(laag);

    // Afstelmodus (?afstel=aan): de gloeden meedoen in de afstel-UI. De laag
    // krijgt de klasse 'afstel' (CSS: markering + pakbaar); de besturing zit in
    // initFakkelAfstel. Bereikbaar via de knop "Startscherm (fakkels)" in het
    // afstelpaneel (de Schatkamer-overlays worden dan verborgen).
    if (new URLSearchParams(location.search).get("afstel") === "aan") {
        laag.classList.add("afstel");
        initFakkelAfstel(laag, container);
    }
})();

// Afstel-besturing voor de fakkelgloeden — exact dezelfde bediening als de
// trofeeën: slepen = verplaatsen, pijltjes = fijn (Shift = grof), + / - of
// scroll = grootte. Alleen actief als het startscherm zichtbaar is (anders ligt
// een Schatkamer-/scherm-2-overlay eroverheen). Bij elke wijziging verschijnt —
// licht vertraagd, dus zonder spam — een kant-en-klaar FAKKEL_GLOED-blok in de
// console, net als "Exporteer posities" bij de trofeeën.
function initFakkelAfstel(laag, container) {
    const STAP_FIJN = 0.1;       // pijltjes (Shift = 1%)
    const SCHAAL_STAP = 0.2;     // + / - of scroll = grootte (zoals de trofeeën)
    let sel = null;
    let logTimer = null;

    const klem = (v) => Math.max(0, Math.min(100, v));

    // Startscherm zichtbaar = geen Schatkamer-/scherm-2-overlay eroverheen.
    function startschermZichtbaar() {
        const verborgen = (id) => {
            const el = document.getElementById(id);
            return !el || el.style.display === "none";
        };
        const nt2 = document.getElementById("nt-scherm-2");
        return verborgen("zaal-scherm") && verborgen("schatkamer-scherm") &&
               !(nt2 && nt2.classList.contains("zichtbaar"));
    }

    function selecteer(g) {
        if (sel) sel.classList.remove("afstel-geselecteerd");
        sel = g;
        if (sel) sel.classList.add("afstel-geselecteerd");
    }

    function wijzigGrootte(g, delta) {
        const huidig = parseFloat(g.style.getPropertyValue("--fakkel-grootte")) || 8;
        g.style.setProperty("--fakkel-grootte", Math.max(1, huidig + delta).toFixed(1) + "%");
    }

    // Debounce: meld de config kort na de laatste wijziging (drag-loslaten,
    // toets of scroll), zodat de console niet volloopt.
    function meldConfig() {
        clearTimeout(logTimer);
        logTimer = setTimeout(() => console.log(bouwFakkelConfigTekst()), 350);
    }

    // --- slepen = verplaatsen ---
    laag.addEventListener("pointerdown", (e) => {
        if (!startschermZichtbaar()) return;
        const g = e.target.closest(".fakkel-gloed");
        if (!g) return;
        e.preventDefault();
        selecteer(g);
        const r = container.getBoundingClientRect();
        const startL = parseFloat(g.style.left), startT = parseFloat(g.style.top);
        const muisX = e.clientX, muisY = e.clientY;
        let gesleept = false;
        function beweeg(ev) {
            gesleept = true;
            const dx = (ev.clientX - muisX) / r.width * 100;
            const dy = (ev.clientY - muisY) / r.height * 100;
            g.style.left = klem(startL + dx).toFixed(1) + "%";
            g.style.top  = klem(startT + dy).toFixed(1) + "%";
        }
        function los() {
            document.removeEventListener("pointermove", beweeg);
            document.removeEventListener("pointerup", los);
            if (gesleept) meldConfig();
        }
        document.addEventListener("pointermove", beweeg);
        document.addEventListener("pointerup", los);
    });

    // --- scrollwiel = grootte ---
    laag.addEventListener("wheel", (e) => {
        if (!startschermZichtbaar()) return;
        const g = e.target.closest(".fakkel-gloed");
        if (!g) return;
        e.preventDefault();
        selecteer(g);
        wijzigGrootte(g, e.deltaY < 0 ? SCHAAL_STAP : -SCHAAL_STAP);
        meldConfig();
    }, { passive: false });

    // --- toetsenbord: pijltjes = verplaatsen, + / - = grootte ---
    document.addEventListener("keydown", (e) => {
        if (!sel || !startschermZichtbaar()) return;
        const stap = e.shiftKey ? 1 : STAP_FIJN;
        const x = parseFloat(sel.style.left), y = parseFloat(sel.style.top);
        let raak = true;
        if (e.key === "ArrowLeft")       sel.style.left = klem(x - stap).toFixed(1) + "%";
        else if (e.key === "ArrowRight") sel.style.left = klem(x + stap).toFixed(1) + "%";
        else if (e.key === "ArrowUp")    sel.style.top  = klem(y - stap).toFixed(1) + "%";
        else if (e.key === "ArrowDown")  sel.style.top  = klem(y + stap).toFixed(1) + "%";
        else if (e.key === "+" || e.key === "=") wijzigGrootte(sel,  SCHAAL_STAP);
        else if (e.key === "-" || e.key === "_") wijzigGrootte(sel, -SCHAAL_STAP);
        else raak = false;
        if (raak) { e.preventDefault(); meldConfig(); }
    });
}

// Bouwt de huidige gloed-posities als kant-en-klaar FAKKEL_GLOED-blok (string).
// Gebruikt door de console-melding én door "Exporteer posities" in het paneel.
function bouwFakkelConfigTekst() {
    // Alléén scherm 1's laag (directe kind van #game-container); scherm 2's
    // gloedlaag zit ín #nt-scherm-2 en mag deze afstel-export niet kapen.
    const laag = document.querySelector("#game-container > .fakkel-laag");
    if (!laag) return "";
    const regels = [...laag.querySelectorAll(".fakkel-gloed")].map((g) => {
        const left = parseFloat(g.style.left);
        const top = parseFloat(g.style.top);
        const grootte = parseFloat(g.style.getPropertyValue("--fakkel-grootte"));
        const duur = parseFloat(g.style.getPropertyValue("--fakkel-duur"));
        const vertraging = parseFloat(g.style.getPropertyValue("--fakkel-vertraging"));
        return `    { left: ${left}, top: ${top}, grootte: ${grootte}, duur: ${duur}, vertraging: ${vertraging} },`;
    });
    return "// Fakkelgloed — vervang FAKKEL_GLOED in script.js:\nconst FAKKEL_GLOED = [\n" +
           regels.join("\n") + "\n];";
}

// =========================================================================
// WOLKENLAAG — trage, driftende wolken in de bovenste hemelband van het
// startscherm. Zelfde opzet als de fakkelgloed: een decoratieve laag
// (pointer-events:none) die config-gestuurd wordt opgebouwd, plus een eigen
// afstelmodus. Puur cosmetisch; raakt de spel-/quizlogica niet.
//
// Posities/maten staan in % (breedte in % van het toneel, top in % van de
// band-hoogte), zodat ze in fullscreen én in het kleinere venster kloppen. Stel
// live af met ?wolken=aan: per wolk de PNG, driftsnelheid, hoogte en opacity,
// en exporteer het bijgewerkte WOLKEN-blok om hier terug te plakken.
// =========================================================================

// --- CONFIG: één regel per wolk. png = welke images/wolk<N>.png (1..5),
//     top = verticale positie (% van de toneelHOOGTE), breedte = % van het
//     toneel, duur = driftsnelheid in seconden (groter = trager), vertraging
//     schuift de startpositie in de cyclus (negatief = al onderweg), opacity
//     0..1. Verschillende snelheden/opacity geven parallax/diepte.
//
//     De wolkenlaag beslaat nu het hele toneel (geen smalle band/masker meer):
//     de voorgrondlaag (.voorgrond) dekt de wolken af behalve waar lucht is.
//     Daarom driften de wolken over de VOLLE breedte — óók rechts boven de
//     prijzenkast — en hoeven ze alleen verticaal in de open hemel (top ~2..28%)
//     te blijven om mooi uit te komen; lager belanden ze toch achter de
//     voorgrond. ---
const WOLKEN = [
    // Zeven wolken, verticaal gespreid over de hemel. De (negatieve) vertragingen
    // zijn zo gekozen dat er al meerdere wolken in beeld staan op t=0 — zo is de
    // hemel bij binnenkomst meteen gevuld i.p.v. leeg met één langzaam opkomende
    // wolk. Verschillende duur/opacity geven parallax/diepte.
    // Duur/vertraging horen bij de nieuwe, volledige oversteek (zie bouwWolken:
    // elke wolk reist nu van buiten beeld links tot buiten beeld rechts). De duur
    // is zó gekozen dat de schermsnelheid overeenkomt met de eerdere drift; de
    // (negatieve) vertragingen zetten op t=0 meerdere wolken verspreid over de breedte.
    // Verticaal gespreid over de HELE open hemel — boven én beneden. De
    // herstelde voorgrond is transparant tot ~38% hoogte, dus lage wolken (top
    // 15..22%) drijven zichtbaar in de stadband, achter de verre gebouwen; hoge
    // wolken (negatieve top) schijnen langs de schone bovenrand (de laag is
    // overflow:hidden, dus de wolk klipt daar netjes). Alle vijf PNG's (wolk1..5)
    // in gebruik; wolk1 en wolk5 elk tweemaal voor rustige variatie.
    { png: 1, top: -17, breedte: 26, duur: 50, vertraging: -30, opacity: 0.8  },
    { png: 3, top:  -7, breedte: 20, duur: 62, vertraging:  -8, opacity: 0.7  },
    { png: 5, top:   2, breedte: 22, duur: 56, vertraging: -45, opacity: 0.7  },
    { png: 2, top:   8, breedte: 18, duur: 66, vertraging: -18, opacity: 0.72 },
    { png: 1, top:  15, breedte: 16, duur: 48, vertraging: -22, opacity: 0.72 },
    { png: 4, top:  18, breedte: 17, duur: 70, vertraging: -38, opacity: 0.7  },
    { png: 5, top:  22, breedte: 20, duur: 54, vertraging: -52, opacity: 0.7  },
];

// Bouwt één wolken-laag (een .wolken-laag-div met .wolk-img's) uit een config.
// Herbruikbaar per scherm via 'prefix' (uniek per scène), zodat scherm 1 en
// scherm 2 elk hun eigen laag + keyframes hebben zonder naambotsing.
//
// VERHARDING tegen "stilvallende" wolken: elke wolk krijgt een EIGEN, letterlijk
// genoemde @keyframes met VASTE begin-/eindwaarden (geen var() meer ín de
// keyframe). Een var() binnen @keyframes wordt door sommige engines pas ná het
// cascaderen gesubstitueerd en kan dan stilvallen; door de x0/x1-waarden hier in
// JS uit te rekenen en als letterlijke percentages in de keyframe te gieten, is
// de animatie volledig standaard CSS en kan ze niet meer door late substitutie
// vastlopen. De keyframes komen in één <style> in <head>. Geeft de laag terug.
function bouwWolkenLaag(config, prefix) {
    const laag = document.createElement("div");
    laag.className = "wolken-laag";
    laag.setAttribute("aria-hidden", "true");

    let keyframeCss = "";
    config.forEach((w, i) => {
        const img = document.createElement("img");
        img.className = "wolk";
        img.src = "images/wolk" + w.png + ".png";
        img.alt = "";
        img.style.setProperty("--wolk-top", w.top + "%");
        img.style.setProperty("--wolk-breedte", w.breedte + "%");
        img.style.setProperty("--wolk-duur", w.duur + "s");
        img.style.setProperty("--wolk-vertraging", w.vertraging + "s");
        img.style.setProperty("--wolk-opacity", w.opacity);

        // Begin-/eindtranslatie voor de drift, berekend uit de breedte. translateX
        // is relatief aan de eigen breedte van de wolk; door x0/x1 per wolk te
        // bepalen maakt élke wolk dezelfde reis over het scherm: van net buiten
        // de linkerrand (rechterrand van de wolk op −marge) tot net buiten de
        // rechterrand (linkerrand van de wolk op 100%+marge). Zo komen wolken de
        // hele breedte door — óók achter de prijzenkast — en springen ze pas
        // buiten beeld terug (geen zichtbare plop). marge = 5% van het toneel.
        const wFrac = w.breedte / 100;
        const marge = 0.05;
        const x0 = -100 - (100 * marge) / wFrac;   // linkerrand: wolk volledig links buiten beeld
        const x1 = (100 * (1 + marge)) / wFrac;     // rechterrand: wolk volledig rechts buiten beeld
        // --wolk-x0/x1 blijven als variabele staan (afstel/export leest ze niet,
        // maar ze documenteren de reis en dienen als fallback voor de gedeelde
        // keyframe in style.css). De daadwerkelijke drift loopt via de letterlijke
        // keyframe hieronder.
        img.style.setProperty("--wolk-x0", x0.toFixed(1) + "%");
        img.style.setProperty("--wolk-x1", x1.toFixed(1) + "%");

        const animName = "wolkDrift-" + prefix + i;
        keyframeCss +=
            "@keyframes " + animName + " { from { transform: translateX(" +
            x0.toFixed(1) + "%); } to { transform: translateX(" +
            x1.toFixed(1) + "%); } }\n";
        img.style.animationName = animName;   // overschrijft de var()-keyframe uit style.css

        img.dataset.index = i;
        img.dataset.png = w.png;
        laag.appendChild(img);
    });

    if (keyframeCss) {
        const styleEl = document.createElement("style");
        styleEl.className = "wolk-keyframes";
        styleEl.dataset.prefix = prefix;
        styleEl.textContent = keyframeCss;
        document.head.appendChild(styleEl);
    }

    return laag;
}

(function bouwWolken() {
    const container = document.getElementById("game-container");
    if (!container) return;

    const laag = bouwWolkenLaag(WOLKEN, "s1-");
    container.appendChild(laag);

    // Afstelmodus (?wolken=aan): bouw het bedieningspaneel rechtsboven.
    if (new URLSearchParams(location.search).get("wolken") === "aan") {
        initWolkenAfstel(laag);
    }
})();

// --- Scherm 2 (#nt-scherm-2): dezelfde levende hemel als scherm 1 (Optie A) ---
// Scherm 2 krijgt dezelfde drie-laags hemel als scherm 1, áchter de NT-inhoud:
// een achtergrondplaat → een EIGEN wolken-laag (prefix "s2-", dus eigen
// letterlijke keyframes, geen naambotsing met scherm 1) → een transparante
// voorgrond. Alles in één wrapper (.nt2-hemel) met een eigen stapelcontext
// (z-index 0), zodat de hemel volledig onder de NT-boeken (z-index 1) en pijlen
// (z-index 5) blijft. Volgorde gegarandeerd door de append-volgorde + de
// bestaande z-index van .wolken-laag (2) en .voorgrond (3).
//
// BELANGRIJK — eigen platen voor scherm 2 (NIET die van scherm 1):
// Scherm 2 krijgt de DIEPBLAUWE AVONDHEMEL van scherm 1. De scherm-1-platen
// hebben echter de evangelie-boeken + gevulde prijzenkast INGEBAKKEN; die
// dubbelden achter de losse NT-boeken/NT-kast. Daarom:
//   - bg  = startschermzonderwolken.png    (scherm 1's avondscène = avondhemel)
//   - voorgrond = voorgrond_scherm2_transparante_lucht.png
//                 (KOPIE van de avond-voorgrond met de 4 evangelie-boeken
//                  weg-geïnpaint; lucht blijft transparant)
// De gevulde kast hoeft niet gepoetst: de NT-kast (nt2-kast) dekt die af. De
// gedeelde scherm-1-voorgrond (voorgrond_transparante_lucht.png) blijft
// ONAANGEROERD — er is op een kopie gewerkt.
(function bouwWolkenScherm2() {
    const scherm2 = document.getElementById("nt-scherm-2");
    if (!scherm2) return;

    const hemel = document.createElement("div");
    hemel.className = "nt2-hemel";
    hemel.setAttribute("aria-hidden", "true");

    const bg = document.createElement("img");
    bg.className = "nt2-hemel-bg";
    // ?v=N hieronder is de PLATEN-teller met een eigen ritme: alleen omhoog als
    // de plaat echt is vervangen, nooit samen met de teller van style.css /
    // lang/nl.js / script.js. Volledige toelichting in index.html <head>.
    bg.src = "images/startschermzonderwolken.png?v=1";   // avondhemel (scherm 1's scène)
    bg.alt = "";

    const laag = bouwWolkenLaag(WOLKEN, "s2-");

    const voor = document.createElement("img");
    voor.className = "voorgrond";          // hergebruikt de bestaande voorgrond-stijl (z-index 3)
    voor.src = "images/voorgrond_scherm2_transparante_lucht.png?v=1";  // avondplaat, boeken weg-geïnpaint, lucht transparant (?v= = platen-teller)
    voor.alt = "";

    hemel.appendChild(bg);
    hemel.appendChild(laag);
    hemel.appendChild(voor);

    // Fakkel-gloed: scherm 2 staat op HETZELFDE lege podium als scherm 1 (zelfde
    // branders/lantaarn in de architectuur), dus exact dezelfde vijf gloedpunten
    // — identieke coördinaten, grootte, tempo én vertraging (incl. de lantaarn
    // linksonder met eigen instellingen). De desync tussen de punten (per punt
    // andere duur/vertraging) gaat één-op-één mee via dezelfde FAKKEL_GLOED-config.
    // Ná de voorgrond geplaatst: op z-index 4 bínnen deze hemel (boven de
    // architectuur), maar onder de NT-boeken (z-index 1) en pijlen (z-index 5) van
    // scherm 2. Strikt gescoped: de laag zit ín #nt-scherm-2, erft pointer-events:
    // none van .fakkel-laag, en is dus onzichtbaar/niet-klikbaar zodra scherm 2
    // verborgen is (visibility:hidden) — geen overlay of klikvak op andere schermen.
    const fakkels = bouwFakkelLaag(FAKKEL_GLOED);
    hemel.appendChild(fakkels);

    // Vooraan in #nt-scherm-2 zetten, vóór de NT-inhoud, zodat de hemel erachter ligt.
    scherm2.insertBefore(hemel, scherm2.firstChild);
})();

// Afstel-besturing voor de wolken (?wolken=aan). Anders dan de fakkels (die je
// sleept) bewegen de wolken, dus stellen we ze af via een paneel met schuiven:
// per wolk de PNG (1..5), driftsnelheid, verticale positie en opacity. Elke
// wijziging past meteen de live CSS-variabelen aan. "Exporteer instellingen"
// drukt het bijgewerkte WOLKEN-blok af (in het paneel én in de console).
function initWolkenAfstel(laag) {
    const wolken = [...laag.querySelectorAll(".wolk")];

    const paneel = document.createElement("div");
    paneel.id = "wolken-paneel";

    let html = "<strong>WOLKEN-AFSTELMODUS</strong>";
    wolken.forEach((img, i) => {
        const top = parseFloat(img.style.getPropertyValue("--wolk-top"));
        const duur = parseFloat(img.style.getPropertyValue("--wolk-duur"));
        const opac = parseFloat(img.style.getPropertyValue("--wolk-opacity"));
        const png = img.dataset.png;

        let pngKnoppen = "";
        for (let n = 1; n <= 5; n++) {
            pngKnoppen += '<button type="button" data-wolk="' + i + '" data-png="' + n +
                '" class="' + (String(n) === String(png) ? "actief" : "") + '">' + n + "</button>";
        }

        html +=
            '<div class="wolk-rij">' +
            '<div class="wolk-kop">Wolk ' + (i + 1) + "</div>" +
            '<label>PNG (wolk&lt;N&gt;.png)</label>' +
            '<div class="wolk-png-keuze">' + pngKnoppen + "</div>" +
            '<label>Driftsnelheid: <span id="w-duur-val-' + i + '">' + duur + "</span>s (groter = trager)</label>" +
            '<input type="range" min="15" max="220" step="1" value="' + duur + '" data-wolk="' + i + '" data-veld="duur">' +
            '<label>Verticale positie: <span id="w-top-val-' + i + '">' + top + "</span>% van de hoogte</label>" +
            '<input type="range" min="0" max="100" step="1" value="' + top + '" data-wolk="' + i + '" data-veld="top">' +
            '<label>Opacity: <span id="w-opac-val-' + i + '">' + opac + "</span></label>" +
            '<input type="range" min="0" max="1" step="0.05" value="' + opac + '" data-wolk="' + i + '" data-veld="opacity">' +
            "</div>";
    });

    html +=
        '<div class="wolk-knoppen">' +
        '<button type="button" class="hoofdknop" id="wolken-export">Exporteer instellingen</button>' +
        "</div>" +
        '<textarea id="wolken-uitvoer" readonly style="display:none"></textarea>';

    paneel.innerHTML = html;
    document.body.appendChild(paneel);

    // PNG-keuze: wissel de bron en markeer de actieve knop.
    paneel.querySelectorAll(".wolk-png-keuze button").forEach((knop) => {
        knop.addEventListener("click", () => {
            const i = +knop.dataset.wolk;
            const n = knop.dataset.png;
            const img = wolken[i];
            img.src = "images/wolk" + n + ".png";
            img.dataset.png = n;
            // Actieve markering binnen deze rij verzetten.
            knop.parentElement.querySelectorAll("button").forEach((b) => b.classList.remove("actief"));
            knop.classList.add("actief");
        });
    });

    // Schuiven: pas de live CSS-variabele direct aan en werk het labelgetal bij.
    paneel.querySelectorAll('input[type="range"]').forEach((schuif) => {
        schuif.addEventListener("input", () => {
            const i = +schuif.dataset.wolk;
            const veld = schuif.dataset.veld;
            const img = wolken[i];
            const v = schuif.value;
            if (veld === "duur") {
                img.style.setProperty("--wolk-duur", v + "s");
                document.getElementById("w-duur-val-" + i).textContent = v;
            } else if (veld === "top") {
                img.style.setProperty("--wolk-top", v + "%");
                document.getElementById("w-top-val-" + i).textContent = v;
            } else if (veld === "opacity") {
                img.style.setProperty("--wolk-opacity", v);
                document.getElementById("w-opac-val-" + i).textContent = v;
            }
        });
    });

    // Exporteer: toon het kant-en-klare WOLKEN-blok in het paneel én de console.
    paneel.querySelector("#wolken-export").addEventListener("click", () => {
        const tekst = bouwWolkenConfigTekst(laag);
        const uit = paneel.querySelector("#wolken-uitvoer");
        uit.style.display = "block";
        uit.value = tekst;
        uit.select();
        console.log(tekst);
    });
}

// Bouwt de huidige wolk-instellingen als kant-en-klaar WOLKEN-blok (string),
// gebruikt door "Exporteer instellingen". Leest per wolk de live waarden uit de
// DOM (png + CSS-variabelen), zodat de export exact weergeeft wat je ziet.
function bouwWolkenConfigTekst(laag) {
    laag = laag || document.querySelector(".wolken-laag");
    if (!laag) return "";
    const regels = [...laag.querySelectorAll(".wolk")].map((img) => {
        const png = img.dataset.png;
        const top = parseFloat(img.style.getPropertyValue("--wolk-top"));
        const breedte = parseFloat(img.style.getPropertyValue("--wolk-breedte"));
        const duur = parseFloat(img.style.getPropertyValue("--wolk-duur"));
        const vertraging = parseFloat(img.style.getPropertyValue("--wolk-vertraging"));
        const opacity = parseFloat(img.style.getPropertyValue("--wolk-opacity"));
        return `    { png: ${png}, top: ${top}, breedte: ${breedte}, duur: ${duur}, vertraging: ${vertraging}, opacity: ${opacity} },`;
    });
    return "// Wolken — vervang WOLKEN in script.js:\nconst WOLKEN = [\n" +
           regels.join("\n") + "\n];";
}
