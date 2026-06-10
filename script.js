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

// Nette labels voor de niveaus (intern: beginner/advanced/expert)
const niveauLabels = {
    beginner: "Beginner",
    advanced: "Advanced",
    expert: "Expert"
};

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
                antwoorden: ["Petrus", "Mozes", "Johannes de Doper", "Paulus"],
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
                antwoorden: ["Herders", "Wijzen uit het oosten", "Engelen", "Vissers"],
                correct: "Wijzen uit het oosten",
                bijbelplaats: "Matteüs 2:1-2"
            },
            {
                vraag: "Wat deed Jezus toen er een storm op het meer was en de leerlingen bang werden?",
                antwoorden: ["Hij sliep verder", "Hij maakte dat de storm ging liggen", "Hij sprong overboord", "Hij riep om hulp"],
                correct: "Hij maakte dat de storm ging liggen",
                bijbelplaats: "Matteüs 8:23-27"
            },
            {
                vraag: "Wat gebeurde er toen Jezus gedoopt werd?",
                antwoorden: ["Er kwam een storm op", "De hemel ging open en er daalde een duif neer", "Het werd donker", "Er klonk een bazuin"],
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
                vraag: "Welke leerling verraadde Jezus voor dertig zilverstukken?",
                antwoorden: ["Petrus", "Tomas", "Judas Iskariot", "Filippus"],
                correct: "Judas Iskariot",
                bijbelplaats: "Matteüs 26:14-16"
            },
            {
                vraag: "In de gelijkenis van de zaaier: waar viel het zaad dat geen blijvende vrucht droeg, onder andere?",
                antwoorden: ["In een rivier", "Op de rotsbodem en tussen de distels", "In een mand", "Op een berg"],
                correct: "Op de rotsbodem en tussen de distels",
                bijbelplaats: "Matteüs 13:3-8"
            },
            {
                vraag: "Wat antwoordde Jezus toen hem werd gevraagd wat het grootste gebod is?",
                antwoorden: ["Heb God lief, en je naaste als jezelf", "Steel niet", "Eer je vader en moeder", "Houd de sabbat heilig"],
                correct: "Heb God lief, en je naaste als jezelf",
                bijbelplaats: "Matteüs 22:37-39"
            },
            {
                vraag: "Wat gebeurde er op het moment dat Jezus aan het kruis stierf?",
                antwoorden: ["Het begon te sneeuwen", "Het werd donker en het voorhangsel van de tempel scheurde", "Er verscheen een regenboog", "De zon kwam op"],
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
                antwoorden: ["Hij verdubbelde het", "Hij begroef het in de grond", "Hij gaf het weg", "Hij verloor het"],
                correct: "Hij begroef het in de grond",
                bijbelplaats: "Matteüs 25:14-30"
            },
            {
                vraag: "Wat zei Jezus dat je moest doen als iemand je op de ene wang slaat?",
                antwoorden: ["Terugslaan", "De andere wang ook toekeren", "Weglopen", "Om hulp roepen"],
                correct: "De andere wang ook toekeren",
                bijbelplaats: "Matteüs 5:39"
            },
            {
                vraag: "Welke koning liet alle jongetjes in Betlehem doden uit angst voor de pasgeboren koning?",
                antwoorden: ["Herodes", "Farao", "Nebukadnessar", "Saul"],
                correct: "Herodes",
                bijbelplaats: "Matteüs 2:16"
            },
            {
                vraag: "Wat was de laatste opdracht die Jezus aan zijn leerlingen gaf, ook wel het zendingsbevel genoemd?",
                antwoorden: ["Bouw een tempel", "Maak alle volken tot leerlingen en doop hen", "Houd het goede nieuws voor jezelf", "Schrijf een boek"],
                correct: "Maak alle volken tot leerlingen en doop hen",
                bijbelplaats: "Matteüs 28:18-20"
            }
        ],
        expert: [
            {
                vraag: "Wie verschenen er naast Jezus toen hij op de berg van gedaante veranderde?",
                antwoorden: ["Abraham en David", "Mozes en Elia", "Petrus en Johannes", "Twee engelen"],
                correct: "Mozes en Elia",
                bijbelplaats: "Matteüs 17:3"
            },
            {
                vraag: "Wat vroeg de moeder van Jakobus en Johannes aan Jezus voor haar zonen?",
                antwoorden: ["Of ze rijk mochten worden", "Of ze links en rechts van hem mochten zitten in zijn koninkrijk", "Of ze naar huis mochten", "Of ze meer brood kregen"],
                correct: "Of ze links en rechts van hem mochten zitten in zijn koninkrijk",
                bijbelplaats: "Matteüs 20:20-21"
            },
            {
                vraag: "Met welke maaltijd, een Joods feest, vierde Jezus het laatste avondmaal met zijn leerlingen?",
                antwoorden: ["Het Loofhuttenfeest", "Het Pesach (Paasmaal)", "Het Wekenfeest", "Het Purimfeest"],
                correct: "Het Pesach (Paasmaal)",
                bijbelplaats: "Matteüs 26:17"
            },
            {
                vraag: "Waarmee begint het evangelie van Matteüs, dat de afkomst van Jezus laat zien?",
                antwoorden: ["Met een geslachtsregister vanaf Abraham", "Met de schepping", "Met een brief", "Met een lied"],
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
                antwoorden: ["Bij zonsondergang", "Rond middernacht", "Tijdens de vierde nachtwaak (op het einde van de nacht)", "Bij het eerste hanengekraai"],
                correct: "Tijdens de vierde nachtwaak (op het einde van de nacht)",
                bijbelplaats: "Matteüs 14:25",
                uitleg: `In Jezus' tijd verdeelden de Romeinen de nacht in vier 'nachtwaken' van elk ongeveer drie uur. Zo wisten de wachters wanneer ze elkaar moesten aflossen.

De vier nachtwaken waren:
1e nachtwaak: 18.00 – 21.00 uur
2e nachtwaak: 21.00 – 24.00 uur
3e nachtwaak: 24.00 – 3.00 uur
4e nachtwaak: 3.00 – 6.00 uur

Jezus kwam dus in de vierde nachtwaak over het water lopen: helemaal aan het einde van de nacht, vlak voordat het licht werd. We weten niet het precieze uur — het moet na 3.00 uur zijn geweest, ergens tot aan zonsopgang.`
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
                vraag: "Een talent was de grootste geldmaat. Ongeveer hoeveel daglonen was één talent waard?",
                antwoorden: ["Ongeveer 10 daglonen", "Ongeveer 100 daglonen", "Ongeveer 6000 daglonen", "Eén dagloon"],
                correct: "Ongeveer 6000 daglonen",
                bijbelplaats: "Matteüs 25:15"
            },
            {
                vraag: "In de gelijkenis van het zuurdesem mengt een vrouw zuurdesem door 'drie maten' (sata) meel. Wat valt op aan die hoeveelheid?",
                antwoorden: ["Het was een heel grote hoeveelheid, genoeg om voor heel veel mensen brood te bakken", "Het was maar een klein kopje", "Het was precies genoeg voor één broodje", "Het was te weinig om brood van te bakken"],
                correct: "Het was een heel grote hoeveelheid, genoeg om voor heel veel mensen brood te bakken",
                bijbelplaats: "Matteüs 13:33"
            }
        ]
    },
    "Marcus": {
        beginner: [
            {
                vraag: "Wie doopte Jezus in de rivier de Jordaan?",
                antwoorden: ["Petrus", "Mozes", "Johannes de Doper", "Elia"],
                correct: "Johannes de Doper",
                bijbelplaats: "Marcus 1:9"
            },
            {
                vraag: "Met wie eet Jezus aan tafel, tot afkeer van de Farizeeën?",
                antwoorden: ["Met koningen", "Met tollenaars en zondaars", "Met soldaten", "Met priesters"],
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
                vraag: "Wat deed Jezus net voordat de storm begon op het meer?",
                antwoorden: ["Hij sliep achter in de boot", "Hij stond op de voorplecht", "Hij was aan het eten", "Hij was niet aan boord"],
                correct: "Hij sliep achter in de boot",
                bijbelplaats: "Marcus 4:38"
            },
            {
                vraag: "Wat deed Jezus met het dochtertje van Jaïrus, dat was overleden?",
                antwoorden: ["Hij begroef haar", "Hij nam haar bij de hand en zei 'Talita koemi' (Meisje, sta op) en ze stond op", "Hij gaf haar medicijnen", "Hij ging weg"],
                correct: "Hij nam haar bij de hand en zei 'Talita koemi' (Meisje, sta op) en ze stond op",
                bijbelplaats: "Marcus 5:41-42"
            },
            {
                vraag: "Wat deed Jezus toen mensen kinderen bij hem brachten en de leerlingen dat wilden tegenhouden?",
                antwoorden: ["Hij liet hen wegsturen", "Hij omarmde de kinderen en zegende hen", "Hij gaf de leerlingen gelijk", "Hij liep door"],
                correct: "Hij omarmde de kinderen en zegende hen",
                bijbelplaats: "Marcus 10:13-16"
            },
            {
                vraag: "Op welk dier reed Jezus toen hij Jeruzalem binnenkwam?",
                antwoorden: ["Een paard", "Een kameel", "Een veulen van een ezel", "Een muildier"],
                correct: "Een veulen van een ezel",
                bijbelplaats: "Marcus 11:7",
                uitleg: "Een koning die ten oorlog trok kwam meestal op een paard. Jezus koos bewust een ezel — een teken van vrede. Zo liet hij zien wat voor koning hij wilde zijn."
            },
            {
                vraag: "Wat deed Jezus in de tempel in Jeruzalem, kort na zijn intocht, wat ophef veroorzaakte?",
                antwoorden: ["Hij ging stil bidden", "Hij joeg de geldwisselaars en duivenverkopers eruit", "Hij gaf een lange toespraak", "Hij ging slapen"],
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
                antwoorden: ["Op de Olijfberg", "Op Golgota, wat 'schedelplaats' betekent", "In Betlehem", "Bij de Jordaan"],
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
                antwoorden: ["Veel bezit verzamelen", "Zichzelf verloochenen en zijn kruis op zich nemen", "Op een berg gaan wonen", "Soldaat worden"],
                correct: "Zichzelf verloochenen en zijn kruis op zich nemen",
                bijbelplaats: "Marcus 8:34"
            },
            {
                vraag: "Wat deden de leerlingen toen Jezus over het water op hen toe kwam?",
                antwoorden: ["Ze sprongen overboord van blijdschap", "Ze schreeuwden van angst, want ze dachten dat het een spook was", "Ze begrepen het meteen", "Ze sliepen door"],
                correct: "Ze schreeuwden van angst, want ze dachten dat het een spook was",
                bijbelplaats: "Marcus 6:49-50"
            },
            {
                vraag: "Wat antwoordde Jezus toen iemand hem vroeg wat het belangrijkste gebod was?",
                antwoorden: ["Heb de Heer uw God lief met heel uw hart en uw naaste als uzelf", "Steel niet", "Eer uw vader en moeder", "Houd de sabbat heilig"],
                correct: "Heb de Heer uw God lief met heel uw hart en uw naaste als uzelf",
                bijbelplaats: "Marcus 12:29-31"
            },
            {
                vraag: "Wat deed Jezus met een vijgenboom die geen vruchten droeg, vlak voor de tempelreiniging?",
                antwoorden: ["Hij plukte er bladeren af", "Hij vervloekte hem waarna de boom verdorde", "Hij snoeide hem", "Hij liet hem met rust"],
                correct: "Hij vervloekte hem waarna de boom verdorde",
                bijbelplaats: "Marcus 11:12-14, 20-21"
            },
            {
                vraag: "Wat zag Jezus een arme weduwe in de tempel doen, wat hij prees als groter dan wat alle rijken gaven?",
                antwoorden: ["Ze bad lang", "Ze gaf twee kleine geldstukjes alles wat ze had", "Ze zong een lied", "Ze maakte de tempel schoon"],
                correct: "Ze gaf twee kleine geldstukjes alles wat ze had",
                bijbelplaats: "Marcus 12:41-44"
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
                bijbelplaats: "Marcus 15:33"
            },
            {
                vraag: "Wat zei de Romeinse hoofdman die bij het kruis stond, toen Jezus stierf?",
                antwoorden: ["Hij was een goed mens", "Werkelijk deze mens was Gods Zoon", "Wat een trieste dag", "Het is voorbij"],
                correct: "Werkelijk deze mens was Gods Zoon",
                bijbelplaats: "Marcus 15:39"
            },
            {
                vraag: "Wat zei Jezus tegen de wind en de golven toen hij de storm op het meer tot bedaren bracht?",
                antwoorden: ["Wees stil! Zwijg!", "Ga weg!", "Help mij", "Wakker worden!"],
                correct: "Wees stil! Zwijg!",
                bijbelplaats: "Marcus 4:39"
            }
        ],
        expert: [
            {
                vraag: "Wat is een opvallend woord dat in het evangelie van Marcus heel vaak voorkomt, en dat de snelheid van zijn verhaal aangeeft?",
                antwoorden: ["Vrede", "Meteen (of terstond)", "Wacht", "Later"],
                correct: "Meteen (of terstond)",
                bijbelplaats: "Marcus 1:10, 1:18 en vele andere plaatsen"
            },
            {
                vraag: "Waar begint het Marcus-evangelie mee?",
                antwoorden: ["Het begin van het verhaal van Jezus", "Het begin van het evangelie van Jezus Christus de Zoon van God", "In den beginne", "Lang geleden"],
                correct: "Het begin van het evangelie van Jezus Christus de Zoon van God",
                bijbelplaats: "Marcus 1:1"
            },
            {
                vraag: "Hoeveel jaar had de vrouw die bloed verloor en die Jezus' kleed aanraakte al last van haar kwaal?",
                antwoorden: ["5 jaar", "12 jaar", "18 jaar", "40 jaar"],
                correct: "12 jaar",
                bijbelplaats: "Marcus 5:25"
            },
            {
                vraag: "Hoe noemde de bezetene in het gebied van de Gerasenen de demonen die in hem zaten?",
                antwoorden: ["Schaduw", "Legioen want we zijn met velen", "Storm", "Beëlzebul"],
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
                antwoorden: ["Ja, alle drie", "Alleen Lazarus", "Alleen Marta en Maria", "Nee, ze komen niet in Marcus voor (wel in Lucas en Johannes)"],
                correct: "Nee, ze komen niet in Marcus voor (wel in Lucas en Johannes)",
                bijbelplaats: "Marcus"
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
                antwoorden: ["Heer, ontferm U over ons", "Mijn God, mijn God, waarom hebt U mij verlaten?", "Geprezen zij Uw heilige naam", "Vergeef ons onze schulden"],
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
                vraag: "De arme weduwe gooide twee van de allerkleinste muntjes in de offerkist. Hoe heetten ze, en hoeveel stelden ze samen voor?",
                antwoorden: ["Penningen (lepta) — samen bijna niets, een fractie van een dagloon", "Denarie — samen ongeveer een dagloon", "Talenten — samen een klein vermogen", "Ponden — samen ongeveer honderd daglonen"],
                correct: "Penningen (lepta) — samen bijna niets, een fractie van een dagloon",
                bijbelplaats: "Marcus 12:42"
            },
            {
                vraag: "De Romeinen verdeelden de nacht in 'nachtwaken'. In hoeveel wachten, en hoe lang duurde elk ongeveer?",
                antwoorden: ["Vier wachten van elk ongeveer drie uur", "Drie wachten van elk ongeveer vier uur", "Twee wachten van elk ongeveer zes uur", "Zes wachten van elk ongeveer twee uur"],
                correct: "Vier wachten van elk ongeveer drie uur",
                bijbelplaats: "Marcus 13:35"
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
                antwoorden: ["Voor een bruiloft", "Voor een volkstelling die keizer Augustus had bevolen", "Op vakantie", "Voor een tempelbezoek"],
                correct: "Voor een volkstelling die keizer Augustus had bevolen",
                bijbelplaats: "Lucas 2:1-5"
            },
            {
                vraag: "Waarin werd het pasgeboren kindje Jezus gelegd?",
                antwoorden: ["In een wieg", "Op een bed", "In een voederbak (kribbe)", "In een mand"],
                correct: "In een voederbak (kribbe)",
                bijbelplaats: "Lucas 2:7"
            },
            {
                vraag: "Aan wie verschenen de engelen om als eersten te vertellen dat Jezus geboren was?",
                antwoorden: ["Aan koningen", "Aan priesters", "Aan herders in het veld", "Aan vissers"],
                correct: "Aan herders in het veld",
                bijbelplaats: "Lucas 2:8-14"
            },
            {
                vraag: "Wat deed Jezus toen hij twaalf jaar oud was, en zijn ouders hem na drie dagen zoeken terugvonden in Jeruzalem?",
                antwoorden: ["Hij hielp in een winkel", "Hij zat in de tempel tussen de leraren, hij luisterde en stelde vragen", "Hij was verdwaald", "Hij speelde met andere kinderen"],
                correct: "Hij zat in de tempel tussen de leraren, hij luisterde en stelde vragen",
                bijbelplaats: "Lucas 2:41-47"
            },
            {
                vraag: "Wat gebeurde er toen Simon (Petrus) op aanwijzing van Jezus zijn netten uitwierp na een nacht zonder vangst?",
                antwoorden: ["Niets, ze vingen niets", "Ze vingen zoveel vissen dat de netten dreigden te scheuren", "Ze vingen alleen kleine visjes", "Ze vingen één heel grote vis"],
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
                antwoorden: ["Hij gaf hem werk", "Hij liet het gemeste kalf slachten en hield een feestmaal", "Hij gaf hem geld", "Hij stuurde hem weer weg"],
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
                antwoorden: ["Hij gaf de helft van zijn bezit aan de armen en betaalde vier keer terug aan wie hij had afgeperst", "Hij ging weg", "Hij hield alles voor zichzelf", "Hij werd priester"],
                correct: "Hij gaf de helft van zijn bezit aan de armen en betaalde vier keer terug aan wie hij had afgeperst",
                bijbelplaats: "Lucas 19:8"
            },
            {
                vraag: "Wat zei Jezus tegen één van de misdadigers die naast hem was gekruisigd en die om hem vroeg?",
                antwoorden: ["Vandaag zul je met mij in het paradijs zijn", "Je krijgt wat je verdiend hebt", "Het is te laat voor jou", "Daar kan ik nu niets aan doen"],
                correct: "Vandaag zul je met mij in het paradijs zijn",
                bijbelplaats: "Lucas 23:43"
            },
            {
                vraag: "Wat gebeurde er toen twee leerlingen op weg waren naar het dorp Emmaüs, na de opstanding?",
                antwoorden: ["Ze ontmoetten engelen", "Jezus zelf kwam met hen meelopen, maar ze herkenden hem pas toen hij het brood brak", "Ze raakten verdwaald", "Ze kwamen Petrus tegen"],
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
                vraag: "Aan wie is het Lucas-evangelie opgedragen, zoals we in de eerste verzen lezen?",
                antwoorden: ["Aan de gemeente van Rome", "Aan Theofilus", "Aan Petrus", "Aan Maria"],
                correct: "Aan Theofilus",
                bijbelplaats: "Lucas 1:1-4"
            },
            {
                vraag: "Hoe heet de beroemde lofzang van Maria, waarin zij God prijst nadat de engel haar de geboorte van Jezus had aangekondigd?",
                antwoorden: ["Het Benedictus", "Het Magnificat (Mijn ziel maakt groot de Heer)", "Het Nunc Dimittis", "Het Gloria"],
                correct: "Het Magnificat (Mijn ziel maakt groot de Heer)",
                bijbelplaats: "Lucas 1:46-55"
            },
            {
                vraag: "Hoe heet de lofzang van Zacharias, die hij uitsprak toen zijn tong weer losliet bij de geboorte van zijn zoon Johannes?",
                antwoorden: ["Het Benedictus (Gezegend zij de Heer de God van Israël)", "Het Magnificat", "Het Te Deum", "Het Sanctus"],
                correct: "Het Benedictus (Gezegend zij de Heer de God van Israël)",
                bijbelplaats: "Lucas 1:67-79"
            },
            {
                vraag: "Hoe heet de lofzang van Simeon, die hij uitsprak toen hij het kindje Jezus in zijn armen had?",
                antwoorden: ["Het Magnificat", "Het Benedictus", "Het Nunc Dimittis (Nu laat U Heer uw dienaar in vrede heengaan)", "Het Te Deum"],
                correct: "Het Nunc Dimittis (Nu laat U Heer uw dienaar in vrede heengaan)",
                bijbelplaats: "Lucas 2:29-32"
            },
            {
                vraag: "Wat overkwam Zacharias toen hij de engel Gabriël niet geloofde over de geboorte van zijn zoon?",
                antwoorden: ["Hij werd blind", "Hij kon niet meer spreken tot zijn zoon werd geboren", "Hij viel flauw", "Hij werd ziek"],
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
                antwoorden: ["Tot Abraham", "Tot David", "Tot Adam de zoon van God", "Tot Noach"],
                correct: "Tot Adam de zoon van God",
                bijbelplaats: "Lucas 3:23-38"
            },
            {
                vraag: "Hoeveel andere leerlingen, naast de twaalf apostelen, zond Jezus uit, twee aan twee, om hem voor te gaan?",
                antwoorden: ["24", "40", "70 (of 72)", "100"],
                correct: "70 (of 72)",
                bijbelplaats: "Lucas 10:1"
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
                antwoorden: ["Ongeveer 100 daglonen", "Ongeveer 6000 daglonen", "Eén dagloon", "Een halve dag"],
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
                antwoorden: ["Ongeveer tien keer zo groot als een vat (zo'n 220 liter)", "Ongeveer even groot als een vat", "Kleiner dan een vat", "Ongeveer honderd keer zo groot als een vat"],
                correct: "Ongeveer tien keer zo groot als een vat (zo'n 220 liter)",
                bijbelplaats: "Lucas 16:7"
            }
        ]
    },
    "Johannes": {
        beginner: [
            {
                vraag: "Hoe noemde Johannes de Doper Jezus toen hij hem zag aankomen?",
                antwoorden: ["De koning der Joden", "Het Lam van God dat de zonde van de wereld wegneemt", "De Heer", "De rabbi"],
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
                antwoorden: ["Een Samaritaanse vrouw", "Maria", "Marta", "Elisabet"],
                correct: "Een Samaritaanse vrouw",
                bijbelplaats: "Johannes 4:5-26"
            },
            {
                vraag: "Wat deed Jezus voor de man die al vanaf zijn geboorte blind was?",
                antwoorden: ["Hij gaf hem geld", "Hij genas hem zodat hij kon zien", "Hij stuurde hem naar de tempel", "Hij liep door"],
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
            },
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
        ],
        advanced: [
            {
                vraag: "Hoe begint het evangelie van Johannes?",
                antwoorden: ["Met de geboorte van Jezus", "Met de woorden 'In het begin was het Woord, het Woord was bij God en het Woord was God'", "Met een geslachtsregister", "Met een brief"],
                correct: "Met de woorden 'In het begin was het Woord, het Woord was bij God en het Woord was God'",
                bijbelplaats: "Johannes 1:1"
            },
            {
                vraag: "Wie kwam er 's nachts in het geheim bij Jezus om met hem te praten?",
                antwoorden: ["Petrus", "Nikodemus", "Jozef van Arimatea", "Lazarus"],
                correct: "Nikodemus",
                bijbelplaats: "Johannes 3:1-2"
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
                antwoorden: ["Engelen", "De Heilige Geest", "Een profeet", "Een nieuw boek"],
                correct: "De Heilige Geest",
                bijbelplaats: "Johannes 14:16-17, 14:26"
            },
            {
                vraag: "Wat schreef Pilatus op het bordje boven het kruis, in drie talen?",
                antwoorden: ["Misdadiger", "Jezus van Nazaret, de koning van de Joden", "Veroordeeld", "De Zoon van God"],
                correct: "Jezus van Nazaret, de koning van de Joden",
                bijbelplaats: "Johannes 19:19-20"
            },
            {
                vraag: "Wat dacht Maria Magdalena dat Jezus was toen ze hem na de opstanding bij het graf zag?",
                antwoorden: ["Een engel", "De tuinman", "Een soldaat", "Een vreemde"],
                correct: "De tuinman",
                bijbelplaats: "Johannes 20:15"
            },
            {
                vraag: "Wat zei Jezus drie keer tegen Petrus na de opstanding bij het meer, na de wonderbaarlijke visvangst?",
                antwoorden: ["Volg mij", "Heb je mij lief? ... Hoed mijn lammeren / Weid mijn schapen", "Vrees niet", "Blijf hier wachten"],
                correct: "Heb je mij lief? ... Hoed mijn lammeren / Weid mijn schapen",
                bijbelplaats: "Johannes 21:15-17"
            }
        ],
        expert: [
            {
                vraag: "Wat antwoordde Jezus toen Tomas vroeg hoe de leerlingen de weg naar de Vader konden kennen?",
                antwoorden: ["Ik ben de goede herder", "Ik ben de weg, de waarheid en het leven", "Ik ben het brood des levens", "Ik ben de wijnstok"],
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
                vraag: "Het evangelie van Johannes beschrijft zeven wonderen die 'tekenen' worden genoemd. Welk teken was het eerste?",
                antwoorden: ["De genezing van de blindgeborene", "De bruiloft te Kana, water in wijn", "De opwekking van Lazarus", "De wonderbaarlijke visvangst"],
                correct: "De bruiloft te Kana, water in wijn",
                bijbelplaats: "Johannes 2:1-11"
            },
            {
                vraag: "Hoeveel watervaten waren er bij de bruiloft in Kana, en hoeveel konden ze ongeveer bevatten?",
                antwoorden: ["3 vaten van 50 liter", "6 stenen vaten van elk twee tot drie metreten (ongeveer 75 tot 115 liter)", "7 houten vaten", "12 grote vaten"],
                correct: "6 stenen vaten van elk twee tot drie metreten (ongeveer 75 tot 115 liter)",
                bijbelplaats: "Johannes 2:6"
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
                vraag: "Natanaël was stomverbaasd over iets wat Jezus tegen hem zei, want ze hadden elkaar nog nooit ontmoet. Wat zei Jezus tegen hem?",
                antwoorden: ["Dat hij hem onder de vijgenboom had zien zitten", "Dat hij hem in de tempel had zien bidden", "Dat hij hem op de markt had gezien", "Dat hij hem aan het werk had gezien"],
                correct: "Dat hij hem onder de vijgenboom had zien zitten",
                bijbelplaats: "Johannes 1:47-49"
            },
            {
                vraag: "Volgens Johannes was er één leerling die 'de leerling van wie Jezus hield' werd genoemd. Wie wordt daarmee bedoeld, volgens de traditie?",
                antwoorden: ["Petrus", "Johannes (de schrijver van het evangelie)", "Andreas", "Tomas"],
                correct: "Johannes (de schrijver van het evangelie)",
                bijbelplaats: "Johannes 13:23, 19:26"
            },
            {
                vraag: "Hoe ver van de kant waren de leerlingen bij de wonderbaarlijke visvangst na de opstanding, volgens Johannes?",
                antwoorden: ["Vijftig el", "Honderd el", "Tweehonderd el", "Vijfhonderd el"],
                correct: "Tweehonderd el",
                bijbelplaats: "Johannes 21:8"
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
        vraag: 'De zaligsprekingen zijn uitspraken van Jezus die allemaal beginnen met "Gelukkig zijn…". Tijdens welke beroemde toespraak sprak hij ze uit?',
        antwoorden: ["De Bergrede", "De Woestijnpreek", "De Tempelrede", "De Zeepreek"],
        correct: "De Bergrede",
        bijbelplaats: "Matteüs 5"
    },
    {
        vraag: 'Wat wordt in de Bijbel bedoeld met "de Wet"?',
        antwoorden: ["De regels die God via Mozes aan Israël gaf, zoals de Tien Geboden", "De wetten van de Romeinse keizer", "De regels van koning Herodes", "De afspraken tussen de tempelwachters"],
        correct: "De regels die God via Mozes aan Israël gaf, zoals de Tien Geboden",
        bijbelplaats: "Matteüs 5:17"
    },
    {
        vraag: 'Wat betekende het woord "heiden" in de Bijbel?',
        antwoorden: ["Iemand die niet bij het Joodse volk hoorde", "Een slechte koning", "Iemand zonder huis", "Een tempelpriester"],
        correct: "Iemand die niet bij het Joodse volk hoorde",
        bijbelplaats: "Matteüs 8 (de Romeinse hoofdman)"
    }
);
vragenData["Matteüs"].expert.push(
    {
        vraag: "Jezus verwees naar een profeet die drie dagen in een grote vis zat, als beeld van zijn eigen opstanding. Over welke profeet ging het?",
        antwoorden: ["Jona", "Elia", "Jesaja", "Daniël"],
        correct: "Jona",
        bijbelplaats: "Matteüs 12:39-40"
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
        antwoorden: ["Je leven omdraaien: stoppen met het verkeerde en het goede gaan doen", "Een lang gebed opzeggen", "Veel geld geven aan de tempel", "Naar een ander land verhuizen"],
        correct: "Je leven omdraaien: stoppen met het verkeerde en het goede gaan doen",
        bijbelplaats: "Marcus 1:4"
    },
    {
        vraag: 'Jezus sprak heel vaak over het "koninkrijk van God". Wat bedoelde hij daarmee?',
        antwoorden: ["Daar waar God de koning is en alles goed en eerlijk gaat", "Het land Israël op de kaart", "Het paleis van koning Herodes", "De stad Rome"],
        correct: "Daar waar God de koning is en alles goed en eerlijk gaat",
        bijbelplaats: "Marcus 1:15"
    },
    {
        vraag: 'Wat is een "wonder" in de Bijbel?',
        antwoorden: ["Iets bijzonders dat je niet gewoon kunt verklaren, en dat Gods kracht laat zien", "Een grappig verhaal", "Een streng bevel", "Een oude wet"],
        correct: "Iets bijzonders dat je niet gewoon kunt verklaren, en dat Gods kracht laat zien",
        bijbelplaats: "Marcus 4:39 (Jezus stilt de storm)"
    }
);
vragenData["Marcus"].advanced.push(
    {
        vraag: "Bij de doop van Jezus daalde de Heilige Geest op hem neer. In de gedaante van welk dier?",
        antwoorden: ["Een duif", "Een arend", "Een lam", "Een leeuw"],
        correct: "Een duif",
        bijbelplaats: "Marcus 1:10"
    },
    {
        vraag: "Jezus genas op de sabbat, de rustdag, en kreeg daar kritiek op. Wat zei hij erover?",
        antwoorden: ["De sabbat is er voor de mens, en niet de mens voor de sabbat", "Op de sabbat mag je nooit iemand helpen", "De sabbat is de belangrijkste regel van allemaal", "De sabbat geldt alleen voor priesters"],
        correct: "De sabbat is er voor de mens, en niet de mens voor de sabbat",
        bijbelplaats: "Marcus 2:27"
    },
    {
        vraag: 'Wat was een "schriftgeleerde"?',
        antwoorden: ["Een kenner van de heilige boeken, die ze aan anderen uitlegde", "Een soldaat van de keizer", "Een bouwer van de tempel", "Een belastingontvanger"],
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
        antwoorden: ["Een kort verhaal om iets belangrijks mee uit te leggen", "Een lied", "Een gebed", "Een wet"],
        correct: "Een kort verhaal om iets belangrijks mee uit te leggen",
        bijbelplaats: "Lucas 15 (o.a. de verloren zoon)"
    },
    {
        vraag: 'Het woord "zonde" betekent eigenlijk iets verkeerds doen. Met welk beeld wordt dat oude woord vaak uitgelegd?',
        antwoorden: ["Je doel missen, zoals een pijl die net naast de roos schiet", "Een berg beklimmen", "Een schat verstoppen", "Een brief verscheuren"],
        correct: "Je doel missen, zoals een pijl die net naast de roos schiet",
        bijbelplaats: "Lucas 15:18"
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
        antwoorden: ["Het gebouw waar Joodse mensen samenkwamen om te bidden en uit de heilige boeken te leren", "Het paleis van de koning", "De markt in Jeruzalem", "Het huis van de hogepriester"],
        correct: "Het gebouw waar Joodse mensen samenkwamen om te bidden en uit de heilige boeken te leren",
        bijbelplaats: "Lucas 4:16"
    },
    {
        vraag: "Wat vierden de Joden met het feest Pesach (Pasen)?",
        antwoorden: ["Dat God hen lang geleden uit de slavernij in Egypte had bevrijd", "Het begin van de oogst", "De bouw van de tempel", "De geboorte van koning David"],
        correct: "Dat God hen lang geleden uit de slavernij in Egypte had bevrijd",
        bijbelplaats: "Lucas 22 (het Laatste Avondmaal was een Pesachmaaltijd)"
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
        antwoorden: ["Een leerling van Jezus die met hem meeging en van hem leerde", "Een priester in de tempel", "Een Romeinse soldaat", "Een koning"],
        correct: "Een leerling van Jezus die met hem meeging en van hem leerde",
        bijbelplaats: "Johannes 1:35-40"
    },
    {
        vraag: 'Wat betekent het woord "opstanding"?',
        antwoorden: ["Weer levend worden na de dood", "Omhooggaan naar de hemel", "Een lange reis maken", "Een groot feest vieren"],
        correct: "Weer levend worden na de dood",
        bijbelplaats: "Johannes 20 (het lege graf)"
    },
    {
        vraag: "Wat was de tempel?",
        antwoorden: ["Het grote, heilige gebouw in Jeruzalem waar de mensen God vereerden", "Een gewoon woonhuis", "De markt van Jeruzalem", "Een Romeins fort"],
        correct: "Het grote, heilige gebouw in Jeruzalem waar de mensen God vereerden",
        bijbelplaats: "Johannes 2:13-22"
    }
);
vragenData["Johannes"].advanced.push(
    {
        vraag: "Een man genaamd Nicodemus kwam 's nachts bij Jezus op bezoek. Tot welke groep behoorde hij?",
        antwoorden: ["De Farizeeën", "De Romeinse soldaten", "De tollenaars", "De vissers"],
        correct: "De Farizeeën",
        bijbelplaats: "Johannes 3:1"
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: "In het evangelie van Johannes hebben de wonderen van Jezus een eigen, bijzondere naam. Hoe noemt Johannes ze?",
        antwoorden: ["Tekenen", "Toverkunsten", "Dromen", "Raadsels"],
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
        vraag: "Met hoeveel broden en vissen gaf Jezus een grote menigte te eten?",
        antwoorden: ["Vijf broden en twee vissen", "Twee broden en vijf vissen", "Tien broden en tien vissen", "Eén brood en één vis"],
        correct: "Vijf broden en twee vissen",
        bijbelplaats: "Matteüs 14:13-21"
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
        antwoorden: ["Hij laat de negenennegentig achter om dat ene te zoeken", "Hij blijft bij de negenennegentig", "Hij koopt een nieuw schaap", "Hij wacht tot het vanzelf terugkomt"],
        correct: "Hij laat de negenennegentig achter om dat ene te zoeken",
        bijbelplaats: "Matteüs 18:12-14",
        uitleg: "Met dit verhaal liet Jezus zien dat God ieder mens belangrijk vindt — juist ook die ene die verdwaald is geraakt."
    },
    {
        vraag: "Wat vertelde de engel aan de vrouwen die op de paasmorgen bij het graf van Jezus kwamen?",
        antwoorden: ["Hij is opgestaan, hij is hier niet", "Kom morgen maar terug", "Het graf is verplaatst", "Wacht hier op de soldaten"],
        correct: "Hij is opgestaan, hij is hier niet",
        bijbelplaats: "Matteüs 28:5-6"
    },
    {
        vraag: "Jezus gaf een gouden regel over hoe je met anderen omgaat. Wat zei hij?",
        antwoorden: ["Behandel anderen zoals je zelf behandeld wilt worden", "Doe altijd wat de meesten doen", "Help alleen je beste vrienden", "Zorg eerst goed voor jezelf"],
        correct: "Behandel anderen zoals je zelf behandeld wilt worden",
        bijbelplaats: "Matteüs 7:12"
    }
);

// === Thema "Maten, geld & tijd" — verdeeld over de evangelieboeken ============
// Veldnamen aangepast aan de bestaande structuur (opties->antwoorden,
// antwoord->correct) en niveau "gevorderd"->advanced. Elke vraag is op het
// evangelie in zijn bijbelplaats geplaatst. Pool-/hussel-/win-/scorelogica
// blijft ongemoeid; de niveaus worden alleen groter.
vragenData["Matteüs"].advanced.push(
    {
        vraag: 'Een "el" is ongeveer zo lang als…',
        antwoorden: ["De afstand van je elleboog tot je vingertoppen (zo'n 45 cm)", "Je voet", "Je hand", "Een grote stap"],
        correct: "De afstand van je elleboog tot je vingertoppen (zo'n 45 cm)",
        bijbelplaats: "Matteüs 6:27"
    },
    {
        vraag: "Jezus zei: dwingt iemand je één mijl mee te gaan, ga er dan twee. Hoe lang was een Romeinse mijl ongeveer?",
        antwoorden: ["Anderhalve kilometer (zo'n 1.500 meter)", "Honderd meter", "Tien kilometer", "Een halve kilometer"],
        correct: "Anderhalve kilometer (zo'n 1.500 meter)",
        bijbelplaats: "Matteüs 5:41"
    },
    {
        vraag: "Jezus zei dat je een lamp niet ónder de korenmaat zet, maar erop. Wat was een korenmaat?",
        antwoorden: ["Een bak of mand voor graan (zo'n 9 liter)", "Een muntstuk", "Een lengtemaat", "Een soort lamp"],
        correct: "Een bak of mand voor graan (zo'n 9 liter)",
        bijbelplaats: "Matteüs 5:15"
    }
);
vragenData["Matteüs"].advanced.push(
    {
        vraag: "Hoe lang moest een gewone arbeider ongeveer werken om één talent te verdienen?",
        antwoorden: ["Vijftien tot twintig jaar", "Honderd dagen", "Ongeveer een jaar", "Een paar maanden"],
        correct: "Vijftien tot twintig jaar",
        bijbelplaats: "Matteüs 25:14-30 (de gelijkenis van de talenten)"
    }
);
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
        vraag: 'De dag begon bij zonsopgang. Hoe laat was ongeveer het "derde uur"?',
        antwoorden: ["Ongeveer negen uur 's ochtends", "Ongeveer drie uur 's nachts", "Rond het middaguur", "Drie uur 's middags"],
        correct: "Ongeveer negen uur 's ochtends",
        bijbelplaats: "Marcus 15:25"
    },
    {
        vraag: 'De Romeinen verdeelden de nacht in vier "wachten". Jezus noemde ze toen hij zei: waak dan! Welke vier waren dat?',
        antwoorden: ["De avond, middernacht, het hanengekraai en de vroege ochtend", "Zonsopgang, ochtend, middag en avond", "Lente, zomer, herfst en winter", "Het eerste, tweede, derde en vierde uur"],
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
        antwoorden: ["Een paar euro (zo'n 2 à 3 euro)", "Ongeveer 100 euro", "Een dagloon (150-200 euro)", "Meer dan 1000 euro"],
        correct: "Een paar euro (zo'n 2 à 3 euro)",
        bijbelplaats: "Lucas 21:1-4"
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: '"Pond" betekent niet altijd geld. Waar gaat het bij het "pond kostbare olie" om?',
        antwoorden: ["Een gewicht (ongeveer 300 gram)", "Honderd daglonen", "Een afstand", "Een tijdsmaat"],
        correct: "Een gewicht (ongeveer 300 gram)",
        bijbelplaats: "Johannes 12:3 (de zalving in Betanië)"
    },
    {
        vraag: "De stenen kruiken in Kana hielden elk twee of drie metreet. Hoeveel liter was dat ongeveer per kruik?",
        antwoorden: ["Zo'n 80 tot 120 liter", "Ongeveer 5 liter", "Ongeveer 10 liter", "Meer dan 500 liter"],
        correct: "Zo'n 80 tot 120 liter",
        bijbelplaats: "Johannes 2:6"
    },
    {
        vraag: "Maria zalfde Jezus' voeten met heel kostbare nardusolie. Hoeveel was die olie ongeveer waard?",
        antwoorden: ["Driehonderd denarie (bijna een jaarloon)", "Drie denarie", "Eén denarie", "Een paar penningen"],
        correct: "Driehonderd denarie (bijna een jaarloon)",
        bijbelplaats: "Johannes 12:5",
        uitleg: "Driehonderd denarie was ongeveer een heel jaar aan daglonen — een enorm bedrag. Judas vond het verkwisting, maar Jezus prees de vrouw om haar liefde."
    }
);

// --- Uren van de dag: drie bekende momenten ---------------------------------
// Horen bij de naslagtabel "Maten, geld & tijd". Elk bij het bijbelboek van de
// gebeurtenis; het Pinkstervoorbeeld staat onder Lucas, omdat Lucas ook
// Handelingen schreef.
vragenData["Lucas"].expert.push(
    {
        vraag: 'Op het Pinksterfeest dachten spotters dat de leerlingen dronken waren. Petrus zei: dat kan niet, "het is pas het derde uur van de dag". Waarom was dat een goed weerwoord?',
        antwoorden: [
            "Het was pas ongeveer negen uur 's ochtends — veel te vroeg om dronken te zijn",
            "Het was midden in de nacht en iedereen sliep",
            "Op het derde uur mocht je geen wijn drinken",
            "Het was al avond en alle wijn was op"
        ],
        correct: "Het was pas ongeveer negen uur 's ochtends — veel te vroeg om dronken te zijn",
        bijbelplaats: "Handelingen 2:15",
        uitleg: "De dag begon bij zonsopgang. Het 'derde uur' is dan ongeveer negen uur 's ochtends — veel te vroeg op de dag om dronken te zijn. Wat de mensen zagen, kwam niet door de wijn, maar door de heilige Geest."
    }
);
vragenData["Johannes"].expert.push(
    {
        vraag: 'Jezus zat moe bij de put toen hij de Samaritaanse vrouw ontmoette. Het was "ongeveer het zesde uur". Hoe laat was dat?',
        antwoorden: [
            "Rond het middaguur (ongeveer 12 uur)",
            "Negen uur 's ochtends",
            "Drie uur 's middags",
            "Bij zonsondergang"
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
            "Rond middernacht — het uur van de nachtwacht",
            "Bij zonsopgang — het uur van het ochtendoffer"
        ],
        correct: "Ongeveer drie uur 's middags — ook het vaste uur waarop men naar de tempel ging om te bidden",
        bijbelplaats: "Matteüs 27:46-50",
        uitleg: "Het 'negende uur' is ongeveer drie uur 's middags. Op dat uur stierf Jezus aan het kruis. Het was ook een vast gebedsuur: even verderop lezen we dat Petrus en Johannes 'op het negende uur, het uur van het gebed' naar de tempel gingen (Handelingen 3:1)."
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
        vraag: "Jezus zei: 'Ik ben de opstanding en het leven.' Hij zei dit vlak voordat Hij een groot wonder deed. Wat deed Hij?",
        antwoorden: [
            "Hij wekte Lazarus op uit de dood",
            "Hij liep over het water",
            "Hij veranderde water in wijn",
            "Hij gaf een blinde man zijn ogen terug"
        ],
        correct: "Hij wekte Lazarus op uit de dood",
        bijbelplaats: "Johannes 11:25, 43-44"
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
            "Hij telt ze elke dag"
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
    }
);
vragenData["Matteüs"].advanced.push(
    {
        vraag: "Jezus riep zijn eerste leerlingen, die vissers waren, en zei dat ze voortaan 'vissers van ___' zouden zijn. Waarvan?",
        antwoorden: ["mensen", "vissen", "vogels", "schapen"],
        correct: "mensen",
        bijbelplaats: "Matteüs 4:19"
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

// Aantal goede antwoorden van de laatst VOLTOOIDE ronde. Bepaalt hoe vol de
// XP-balk op het startscherm staat (één tiende per goed antwoord; 10 = vol).
// Wordt in eindScherm() vastgelegd en bij "nieuw spel" weer op 0 gezet.
let laatsteRondeGoed = 0;

// Eenmalige opschoning: de oude bewaarde XP-waarde (testdata) wissen, zodat
// een kind echt vanaf 0 schildpunten begint. Idempotent — verdere reloads
// hebben geen effect omdat de sleutel daarna niet meer wordt geschreven.
localStorage.removeItem("bijbelQuizXP");

// Eenmalige opschoning: de trofee- en kist-standen die met de (inmiddels
// verwijderde) testknopjes waren ingesteld, wissen. Zo begint de prijzenkast
// op de vergrendelde schaduw-beginstand voor een speler die nog niets verdiend
// heeft. Draait dankzij de vlag precies één keer per browser; daarna mag echte
// voortgang gewoon weer worden opgeslagen en bewaard tussen sessies.
if (!localStorage.getItem("prijzenkastOpgeruimd_v1")) {
    ["matteus", "marcus", "lucas", "johannes"].forEach((boekKey) => {
        localStorage.removeItem(`trofee_${boekKey}`);
    });
    ["brons", "zilver", "goud"].forEach((kistKey) => {
        localStorage.removeItem(`kist_${kistKey}`);
    });
    localStorage.setItem("prijzenkastOpgeruimd_v1", "1");
}

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
        geen: "images/matteus-zilver.png",
        brons: "images/matteus-zilver.png",
        zilver: "images/matteus-zilver.png",
        goud: "images/matteus-zilver.png"
    },
    marcus: {
        geen: "images/marcus-zilver.png",
        brons: "images/marcus-zilver.png",
        zilver: "images/marcus-zilver.png",
        goud: "images/marcus-zilver.png"
    },
    lucas: {
        geen: "images/lucas-zilver.png",
        brons: "images/lucas-zilver.png",
        zilver: "images/lucas-zilver.png",
        goud: "images/lucas-zilver.png"
    },
    johannes: {
        geen: "images/johannes-zilver.png",
        brons: "images/johannes-zilver.png",
        zilver: "images/johannes-zilver.png",
        goud: "images/johannes-zilver.png"
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
        vergrendeld: "images/kist-brons-schaduw.png",
        verdiend: "images/kist-brons.png"
    },
    zilver: {
        vergrendeld: "images/kist-zilver-schaduw.png",
        verdiend: "images/kist-zilver.png"
    },
    goud: {
        vergrendeld: "images/kist-goud-schaduw.png",
        verdiend: "images/kist-goud.png"
    }
};

const alleKistKeys = ["brons", "zilver", "goud"];

function getKistStatus(kistKey) {
    const opgeslagen = localStorage.getItem(`kist_${kistKey}`);
    return kistVolgorde.includes(opgeslagen) ? opgeslagen : "vergrendeld";
}

function setKistStatus(kistKey, status) {
    if (!kistVolgorde.includes(status)) return;
    localStorage.setItem(`kist_${kistKey}`, status);
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

// Verborgen schat: de diamanten kist. Leest met getKistStatus() de drie kisten
// uit. Zijn brons, zilver én goud allemaal "verdiend" -> volle diamanten kist
// (filter eraf: class .vergrendeld weg). Anders -> vergrendelde/schaduw-staat
// (class .vergrendeld erop, die de CSS-filtertruc toepast). Verandert niets aan
// de win-logica of de bestaande kist-schaduw-afbeeldingen; leest alleen uit.
function werkVerborgenSchatBij() {
    const img = document.getElementById("kist-diamant");
    if (!img) return;

    const alleVerdiend = alleKistKeys.every(
        (kistKey) => getKistStatus(kistKey) === "verdiend"
    );

    img.classList.toggle("vergrendeld", !alleVerdiend);
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
    "Johannes": "johannes"
};

function getTrofeeNiveau(boekKey) {
    const opgeslagen = localStorage.getItem(`trofee_${boekKey}`);
    return trofeeVolgorde.includes(opgeslagen) ? opgeslagen : "geen";
}

// Werkt het opgeslagen niveau alleen bij als het nieuwe niveau hoger is.
function setTrofeeNiveau(boekKey, nieuwNiveau) {
    const huidig = getTrofeeNiveau(boekKey);

    if (trofeeVolgorde.indexOf(nieuwNiveau) > trofeeVolgorde.indexOf(huidig)) {
        localStorage.setItem(`trofee_${boekKey}`, nieuwNiveau);
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
    return `schildpunt_${boekKey}_${niveau}`;
}

function isSchildpuntVerdiend(boekKey, niveau) {
    return localStorage.getItem(schildKey(boekKey, niveau)) === "1";
}

function setSchildpuntVerdiend(boekKey, niveau) {
    localStorage.setItem(schildKey(boekKey, niveau), "1");
}

function tellSchildpunten() {
    let totaal = 0;
    alleBoekKeys.forEach((boekKey) => {
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
    samuel: "Samuel"
};

const STANDAARD_AVATAR = "mozes";

function getGekozenAvatar() {
    const opgeslagen = localStorage.getItem("bijbelQuizAvatar");
    return avatarNamen[opgeslagen] ? opgeslagen : STANDAARD_AVATAR;
}

function setGekozenAvatar(avatar) {
    if (avatarNamen[avatar]) {
        localStorage.setItem("bijbelQuizAvatar", avatar);
    }
}

function getSpelerNaam() {
    return localStorage.getItem("bijbelQuizSpelerNaam") || "";
}

function setSpelerNaam(naam) {
    localStorage.setItem("bijbelQuizSpelerNaam", naam || "");
}

function getSpelerVoornaam() {
    const volledig = getSpelerNaam().trim();
    if (!volledig) return "";
    return volledig.split(/\s+/)[0];
}

function updateAvatarWeergave() {
    const avatar = getGekozenAvatar();

    const img = document.getElementById("avatar-portret");
    if (img) img.src = `images/Avatars/avatar-${avatar}.png`;

    const figuurnaam = document.getElementById("avatar-figuurnaam");
    if (figuurnaam) figuurnaam.innerHTML = avatarNamen[avatar];

    const voornaamEl = document.getElementById("speler-voornaam");
    if (voornaamEl) {
        voornaamEl.innerHTML = getSpelerVoornaam();
        pasVoornaamGrootteAan(voornaamEl);
    }
}

// Laat de letters van het speler-naambordje automatisch iets krimpen wanneer
// een voornaam te lang is voor de vaste breedte van het bordje, zodat hij
// altijd binnen de plaat blijft passen. De basisgrootte komt uit style.css
// (--speler-lettergrootte); we verkleinen alleen wanneer het echt nodig is.
function pasVoornaamGrootteAan(el) {
    if (!el) return;
    el.style.fontSize = "";            // terug naar de CSS-basisgrootte
    const minGrootte = 8;              // px-ondergrens, blijft leesbaar
    let grootte = parseFloat(getComputedStyle(el).fontSize);
    // Krimp stap voor stap tot de tekst binnen de breedte van het bordje past.
    while (el.scrollWidth > el.clientWidth && grootte > minGrootte) {
        grootte -= 1;
        el.style.fontSize = grootte + "px";
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

    // Begin met de huidige keuzes voorgeladen
    markeerAvatarKeuze(getGekozenAvatar());
    const invoer = document.getElementById("speler-naam-invoer");
    if (invoer) invoer.value = getSpelerNaam();

    scherm.style.display = "flex";
    verbergLevelHud();
}

function bevestigNieuwSpel() {
    const naamInvoer = document.getElementById("speler-naam-invoer");
    const naam = naamInvoer ? naamInvoer.value.trim() : "";
    const avatar = gekozenAvatarTijdelijk || getGekozenAvatar();

    // Avatar + volledige naam opslaan
    setGekozenAvatar(avatar);
    setSpelerNaam(naam);

    // Verse start: alle verdiende schildpunten wissen (levels terug naar 0).
    alleBoekKeys.forEach((boekKey) => {
        niveauKeys.forEach((niveau) => {
            localStorage.removeItem(schildKey(boekKey, niveau));
        });
    });

    // Ook alle behaalde trofeeën wissen: stand terug naar "geen" en de trofee
    // opnieuw tekenen, zodat elk evangelie weer als donker silhouet verschijnt.
    alleBoekKeys.forEach((boekKey) => {
        localStorage.removeItem(`trofee_${boekKey}`);
        toonTrofee(boekKey);
    });

    // Ook de verdiende schatkisten wissen: terug naar "vergrendeld" en opnieuw
    // tekenen, zodat de prijzenkast bij een nieuw spel weer leeg is.
    alleKistKeys.forEach((kistKey) => {
        localStorage.removeItem(`kist_${kistKey}`);
        toonKist(kistKey);
    });

    // De verborgen diamanten kist hoort dan ook weer vergrendeld te zijn.
    werkVerborgenSchatBij();

    // Verse start: de XP-balk hoort leeg te zijn, dus het laatste ronderesultaat
    // wissen en de balk opnieuw tekenen.
    laatsteRondeGoed = 0;
    updateXPBalk();

    updateSchildpuntenWeergave();
    updateAvatarWeergave();

    const scherm = document.getElementById("nieuw-spel-scherm");
    if (scherm) scherm.style.display = "none";
    toonLevelHud();
}

function annuleerNieuwSpel() {
    const scherm = document.getElementById("nieuw-spel-scherm");
    if (scherm) scherm.style.display = "none";
    toonLevelHud();
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
// en pakt er de eerste `aantal` uit. Is de pool kleiner dan `aantal`, dan
// komen alle vragen terug, in willekeurige volgorde.
function kiesWillekeurigeVragen(pool, aantal) {
    const kopie = [...pool];
    for (let i = kopie.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
    }
    return kopie.slice(0, aantal);
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
    // 10 willekeurige vragen uit de pool, elk met gehusselde antwoordopties
    // (zelfde aanpak als de Verborgen Schat). Het juiste antwoord wordt op
    // tekstwaarde herkend (huidig.correct), dus husselen blijft veilig. Map naar
    // nieuwe objecten zodat vragenData niet gemuteerd wordt.
    vragen = kiesWillekeurigeVragen(vragenData[gekozenBoek][niveau], 10).map((v) => ({
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

    updateXPBalk();
    laadVraag();
}

// Combineert alle vragen van één niveau uit alle evangeliën tot één pool.
// Doordat we de bestaande arrays hergebruiken, groeit deze pool vanzelf mee
// zodra je ergens vragen toevoegt — geen aparte lijst om bij te houden.
function alleVragenVoorNiveau(niveau) {
    let pool = [];
    for (const boek in vragenData) {
        if (vragenData[boek][niveau]) {
            pool = pool.concat(vragenData[boek][niveau]);
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
        bijbelplaats: "Marcus 14 / Lucas 22"
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
        bijbelplaats: "Marcus 5:21-43 · Marcus 11:12-25"
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
    // Alleen spelen als de kist onthuld is (niet vergrendeld).
    const img = document.getElementById("kist-diamant");
    if (img && img.classList.contains("vergrendeld")) return;

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

    let melding;
    if (antwoord === huidig.correct) {
        melding = "✅ Goed gedaan!";
        resultaat.style.color = "#7CFF7C";

        score++;

        // XP is per ronde: +100 per goed antwoord, max 1000 — niet opslaan in localStorage.
        huidigeXP += 100;

        updateXPBalk();
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
        // Oefenmodus: geen timer. De feedback + bijbelplaats blijven staan
        // tot het kind zelf op "Volgende" klikt, zodat het rustig kan nalezen.
        const volgendeKnop = document.createElement("button");
        volgendeKnop.className = "answer-btn oefen-volgende";
        volgendeKnop.textContent = "Volgende →";
        volgendeKnop.onclick = gaNaarVolgende;
        resultaat.appendChild(volgendeKnop);
    } else {
        volgendeTimer = setTimeout(gaNaarVolgende, 2500);
    }
}

function gaNaarVolgende() {
    volgendeTimer = null;
    huidigeVraag++;
    if (huidigeVraag < vragen.length) {
        laadVraag();
    } else {
        eindScherm();
    }
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

    // De boodschap-tekst, kop en Catechese-knop verschijnen alleen als er een
    // reveal bij deze vraag hoort. Anders: enkel goed/fout + Volgende.
    const heeftReveal = !!(q && q.reveal);
    if (kop) kop.style.display = heeftReveal ? "" : "none";
    if (tekst) {
        tekst.textContent = heeftReveal ? q.reveal : "";
        tekst.style.display = heeftReveal ? "" : "none";
    }
    if (meerKnop) {
        meerKnop.style.display = heeftReveal ? "" : "none";
        // De (optionele) catecheseId bewaren voor de latere deep-link.
        meerKnop.dataset.catecheseId = (q && q.catecheseId) ? q.catecheseId : "";
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
    document.getElementById("oefen-boek-scherm").style.display = "flex";
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
    return localStorage.getItem("verborgenschat_voltooid") === "waar";
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
    document.getElementById("vu-boek-scherm").style.display = "flex";
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
    "Wie is God?",
    "Wie is Jezus?",
    "De Heilige Geest",
    "De Bijbel",
    "Het gebed",
    "De christelijke feesten"
];

// Artikelen — elk hoort via 'categorie' bij precies één categorie hierboven (let
// op de exacte schrijfwijze). 'tekst' mag meerdere alinea's bevatten, gescheiden
// door een LEGE regel. 'id' is de sleutel voor latere "Meer hierover ->"-links.
const catecheseArtikelen = [
    {
        id: "wie-is-god-drie-eenheid",
        categorie: "Wie is God?",
        titel: "Eén God, die zich laat kennen als Vader, Zoon en Geest",
        tekst: `PLACEHOLDER — vervang deze tekst later door het echte artikel.

Hier komt een rustige, kindvriendelijke uitleg over wie God is. Je mag zoveel
alinea's gebruiken als je wilt: laat tussen twee alinea's een lege regel staan,
dan verschijnt er netjes witruimte ertussen.

Dit derde stukje is er vooral om het scrollen te kunnen testen. Vul gerust meer
tekst in totdat het vak moet scrollen, zodat je ziet dat dat goed werkt.`
    },
    {
        id: "wie-is-jezus-waar-god-mens",
        categorie: "Wie is Jezus?",
        titel: "Jezus: echt God en echt mens",
        tekst: `PLACEHOLDER — vervang deze tekst later door het echte artikel.

Hier komt de uitleg over wie Jezus is. Ook hier mag je meerdere alinea's
gebruiken; een lege regel start telkens een nieuwe alinea.`
    }
];

// Huidig gekozen categorie (voor de artikel-lijst en de Terug-knoppen).
let catecheseCategorie = null;

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
// Bouwt de categorie-knoppen uit de config-array (boekenkeuze-stijl).
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
function openCatecheseArtikel(id) {
    const a = catecheseArtikelen.find((art) => art.id === id);
    if (!a) return;
    catecheseCategorie = a.categorie;

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
// Artikel-detail -> terug naar de artikel-lijst.
function terugCatecheseArtikel() {
    document.getElementById("catechese-artikel-scherm").style.display = "none";
    document.getElementById("catechese-lijst-scherm").style.display = "flex";
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
// =========================
const evangelienVitrine = {
    achtergrond: "images/scahtkamer2.png",
    trofeeBodem: "30%",
    naamMidden:  "84%",
    naamBreedte: "15%",
    naamHoogte:  "8%",
    nissen: [
        { x: "19.5%", trofeeHoogte: "37%", naamX: "18.8%", naamGrootte: "clamp(8px, 1.45vw, 17px)", naam: "Matteüs",  sleutel: "trofee_matteus",  basis: "matteus"  },
        { x: "40.5%", trofeeHoogte: "42%", naamX: "39.3%", naamGrootte: "clamp(9px, 1.65vw, 19px)", naam: "Marcus",   sleutel: "trofee_marcus",   basis: "marcus"   },
        { x: "59.5%", trofeeHoogte: "37%", naamX: "60.1%", naamGrootte: "clamp(9px, 1.65vw, 19px)", naam: "Lucas",    sleutel: "trofee_lucas",    basis: "lucas"    },
        { x: "79%",   trofeeHoogte: "42%", naamX: "80.6%", naamGrootte: "clamp(7px, 1.25vw, 14px)", naam: "Johannes", sleutel: "trofee_johannes", basis: "johannes" }
    ]
};

// Welke vitrine de schatkamer nu toont. Later eventueel wisselbaar.
const actieveVitrine = evangelienVitrine;

// Leest een trofee-stand rechtstreeks uit localStorage op de gegeven sleutel.
// Onbekende/ontbrekende waarde -> "geen". Verandert niets aan de win-logica;
// gebruikt alleen dezelfde volgorde-lijst (trofeeVolgorde) ter validatie.
function leesTrofeeStand(sleutel) {
    const stand = localStorage.getItem(sleutel);
    return trofeeVolgorde.includes(stand) ? stand : "geen";
}

// Bouwt de inhoud van een vitrine-element volledig op uit een config-object.
// Per nis: stand uit localStorage -> "geen" = lege sokkel (trofee verbergen),
// brons/zilver/goud = het bijbehorende plaatje op de sokkel.
function bouwVitrine(vitrineEl, config) {
    if (!vitrineEl) return;

    // Achtergrond + gedeelde maten als inline CSS-variabelen (per vitrine).
    vitrineEl.style.backgroundImage = `url("${config.achtergrond}")`;
    vitrineEl.style.setProperty("--trofee-bodem", config.trofeeBodem);
    vitrineEl.style.setProperty("--naam-midden",  config.naamMidden);
    vitrineEl.style.setProperty("--naam-breedte", config.naamBreedte);
    vitrineEl.style.setProperty("--naam-hoogte",  config.naamHoogte);

    const houder = vitrineEl.querySelector(".sk-nissen");
    if (!houder) return;
    houder.innerHTML = "";                       // schoon herbouwen bij elk openen

    config.nissen.forEach((nis) => {
        const niveau = leesTrofeeStand(nis.sleutel); // "geen"|"brons"|"zilver"|"goud"

        // Sokkel-trofee. Positie (left) en hoogte komen inline uit de config.
        const img = document.createElement("img");
        img.className = "sk-trofee";
        img.alt = nis.naam;
        img.style.left = nis.x;
        img.style.height = nis.trofeeHoogte;
        if (niveau === "geen") {
            img.hidden = true;                   // lege sokkel uit de achtergrond blijft staan
        } else {
            img.src = `images/${nis.basis}-${niveau}.png`;
        }
        houder.appendChild(img);

        // Naamplaat. Horizontale positie en lettergrootte inline uit de config.
        const naam = document.createElement("div");
        naam.className = "sk-naam";
        naam.textContent = nis.naam;
        naam.style.left = nis.naamX;
        naam.style.fontSize = nis.naamGrootte;
        houder.appendChild(naam);
    });
}

function openSchatkamer() {
    // Vitrine (her)opbouwen uit de config zodat de standen actueel zijn.
    const vitrineEl = document.querySelector("#schatkamer-scherm .schatkamer-vitrine");
    bouwVitrine(vitrineEl, actieveVitrine);
    document.getElementById("schatkamer-scherm").style.display = "flex";
}
function sluitSchatkamer() {
    document.getElementById("schatkamer-scherm").style.display = "none";
}

function openInstellingen() {
    werkGeluidKnopBij();
    document.getElementById("instellingen-scherm").style.display = "flex";
}
function sluitInstellingen() {
    document.getElementById("instellingen-scherm").style.display = "none";
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
        // Winvoorwaarde: alle vragen goed (6/6). Dan is de Verborgen Schat ontdekt
        // en zetten we de vlag, zodat de naslagpagina ontgrendelt. Idempotent —
        // opnieuw spelen mag en houdt de vlag gewoon op "waar".
        const allesGoed = score === vragen.length;
        if (allesGoed) {
            localStorage.setItem("verborgenschat_voltooid", "waar");
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
    const melding = document.getElementById("nt2-melding");
    if (melding) {
        melding.textContent = `${groep} — binnenkort speelbaar.`;
        melding.classList.add("zichtbaar");
    }
}

// Hulp: staat er een schermvullende overlay open (quiz, keuze, naslag, schatkamer)?
// Dan mogen de pijltjestoetsen niet van hoofdscherm wisselen.
function eenOverlayOpen() {
    const overlays = document.querySelectorAll(".quiz-overlay, .schatkamer-overlay");
    return Array.from(overlays).some((o) => o.style.display && o.style.display !== "none");
}

(function initSchermnavigatie() {
    const container = document.getElementById("game-container");
    if (!container) return;

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
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (eenOverlayOpen()) return;
        if (e.key === "ArrowRight" && huidigNtScherm === 1) gaNaarScherm2();
        else if (e.key === "ArrowLeft" && huidigNtScherm === 2) gaNaarScherm1();
    });
})();
