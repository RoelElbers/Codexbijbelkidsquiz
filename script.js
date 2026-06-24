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

// =====================================================================
// Vragenpool: Romeinen  (Beginner 10 · Gevorderd 14 · Expert 14)
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
            vraag: "Aan wie schreef Paulus deze brief?",
            antwoorden: ["De christenen in Korinte", "De christenen in Efeze", "De christenen in Rome", "De christenen in Jeruzalem"],
            correct: "De christenen in Rome",
            bijbelplaats: "Romeinen 1:7"
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
            vraag: "Paulus schrijft dat álle mensen iets gemeen hebben. Wat?",
            antwoorden: ["Ze zijn allemaal goed genoeg voor God", "Ze hebben allemaal gezondigd", "Ze hebben God niet nodig", "Ze maken nooit fouten"],
            correct: "Ze hebben allemaal gezondigd",
            bijbelplaats: "Romeinen 3:23"
        },
        {
            vraag: "Wat noemt Paulus het grootste geschenk van God aan de mensen?",
            antwoorden: ["Geld", "Een mooi huis", "Het eeuwige leven door Jezus Christus", "Veel land"],
            correct: "Het eeuwige leven door Jezus Christus",
            bijbelplaats: "Romeinen 6:23"
        },
        {
            vraag: "In hoofdstuk 8 schrijft Paulus iets bemoedigends over Gods liefde. Wat?",
            antwoorden: ["Gods liefde is alleen voor sterke mensen", "Gods liefde stopt als je een fout maakt", "Je moet Gods liefde verdienen", "Niets kan ons scheiden van Gods liefde"],
            correct: "Niets kan ons scheiden van Gods liefde",
            bijbelplaats: "Romeinen 8:38-39"
        },
        {
            vraag: "In hoofdstuk 12 schrijft Paulus over mensen die het je moeilijk maken. Wat zegt hij dat je moet doen?",
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
        }
    ],
    advanced: [
        {
            vraag: "Waarmee heeft God ons hart gevuld, schrijft Paulus?",
            antwoorden: ["Met geld", "Met zijn liefde, door de heilige Geest", "Met zorgen", "Met angst"],
            correct: "Met zijn liefde, door de heilige Geest",
            bijbelplaats: "Romeinen 5:5"
        },
        {
            vraag: "Mogen we rustig verkeerde dingen blijven doen, omdat God toch vergeeft?",
            antwoorden: ["Ja, het maakt niet uit", "Ja, hoe meer hoe beter", "Nee, want we leven nu een nieuw leven", "Ja, zolang niemand het ziet"],
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
            vraag: "Hoe ver ging Gods liefde voor ons, schrijft Paulus?",
            antwoorden: ["Hij gaf zelfs zijn eigen Zoon", "Hij gaf ons wat geld", "Hij gaf ons niets", "Hij gaf alleen aan rijke mensen"],
            correct: "Hij gaf zelfs zijn eigen Zoon",
            bijbelplaats: "Romeinen 8:32"
        },
        {
            vraag: "Wat raadt Paulus aan als het even moeilijk is?",
            antwoorden: ["Geef het meteen op", "Blijf hopen, wees geduldig en blijf bidden", "Word boos op iedereen", "Doe alsof er niets is"],
            correct: "Blijf hopen, wees geduldig en blijf bidden",
            bijbelplaats: "Romeinen 12:12"
        },
        {
            vraag: "Waar moeten gelovigen volgens Paulus hun best voor doen?",
            antwoorden: ["Voor ruzie", "Om altijd gelijk te krijgen", "Voor dingen die vrede brengen en elkaar opbouwen", "Om de baas te zijn"],
            correct: "Voor dingen die vrede brengen en elkaar opbouwen",
            bijbelplaats: "Romeinen 14:19"
        },
        {
            vraag: "Waarvoor zijn de woorden uit de Bijbel volgens Paulus opgeschreven?",
            antwoorden: ["Om ons te laten schrikken", "Om ons te bemoedigen en hoop te geven", "Om ons te vervelen", "Om ons in de war te brengen"],
            correct: "Om ons te bemoedigen en hoop te geven",
            bijbelplaats: "Romeinen 15:4"
        },
        {
            vraag: "Waarom wilde Paulus zo graag naar de christenen in Rome toe?",
            antwoorden: ["Om er vakantie te vieren", "Om er de baas te spelen", "Om elkaar in het geloof te bemoedigen", "Om er lekker uit te rusten"],
            correct: "Om elkaar in het geloof te bemoedigen",
            bijbelplaats: "Romeinen 1:11-12"
        },
        {
            vraag: "Wat zegt Paulus tegen iemand die snel een ander veroordeelt?",
            antwoorden: ["Jij hebt altijd gelijk", "Bedenk dat je zelf ook fouten maakt", "Veroordeel nog strenger", "Anderen zijn altijd slechter dan jij"],
            correct: "Bedenk dat je zelf ook fouten maakt",
            bijbelplaats: "Romeinen 2:1"
        },
        {
            vraag: "Wat raadt Paulus aan om met je leven te doen?",
            antwoorden: ["Hou alles voor jezelf", "Doe gewoon wat je maar wilt", "Geef jezelf aan God om het goede te doen", "Wacht af tot anderen iets doen"],
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
            antwoorden: ["Maak overal ruzie", "Probeer zoveel mogelijk met iedereen in vrede te leven", "Praat liever met niemand", "Vrede is niet belangrijk"],
            correct: "Probeer zoveel mogelijk met iedereen in vrede te leven",
            bijbelplaats: "Romeinen 12:18"
        },
        {
            vraag: "Paulus zegt: laat de daden van het donker achter je en leef in het licht. Wat bedoelt hij?",
            antwoorden: ["Doe verkeerde dingen liever in het geheim", "Slaap zoveel mogelijk", "Leef eerlijk en goed, alsof het klaarlichte dag is", "Wacht tot het weer donker is"],
            correct: "Leef eerlijk en goed, alsof het klaarlichte dag is",
            bijbelplaats: "Romeinen 13:12"
        }
    ],
    expert: [
        {
            vraag: "Paulus zegt dat Gods vergeving een geschenk is. Wat betekent \"een geschenk\"?",
            antwoorden: ["Je moet er hard voor werken", "Je krijgt het zomaar, je hoeft het niet te verdienen", "Je moet het terugbetalen", "Alleen de sterkste krijgt het"],
            correct: "Je krijgt het zomaar, je hoeft het niet te verdienen",
            bijbelplaats: "Romeinen 3:24"
        },
        {
            vraag: "Voor werk krijg je loon. Maar Gods vergeving is geen loon, zegt Paulus. Wat is het dan?",
            antwoorden: ["Loon dat je hebt verdiend", "Iets wat je koopt", "Een geschenk dat je krijgt door op God te vertrouwen", "Een prijs voor wie wint"],
            correct: "Een geschenk dat je krijgt door op God te vertrouwen",
            bijbelplaats: "Romeinen 4:4-5"
        },
        {
            vraag: "Door één mens kwam het verkeerde in de wereld. Door wie komt het goede en het leven, zegt Paulus?",
            antwoorden: ["Adam", "Mozes", "Jezus Christus", "Abraham"],
            correct: "Jezus Christus",
            bijbelplaats: "Romeinen 5:18-19"
        },
        {
            vraag: "Paulus schrijft dat gelovigen God mogen aanspreken als \"Vader\". Wat zijn ze daardoor?",
            antwoorden: ["Dienaren van de keizer", "Vreemden voor God", "Kinderen van God", "Gasten op bezoek"],
            correct: "Kinderen van God",
            bijbelplaats: "Romeinen 8:15-16"
        },
        {
            vraag: "Wat raadt Paulus aan over hoe je over jezelf denkt?",
            antwoorden: ["Denk dat je beter bent dan anderen", "Denk dat je alles alleen kunt", "Denk dat je nooit fouten maakt", "Denk niet te hoog van jezelf"],
            correct: "Denk niet te hoog van jezelf",
            bijbelplaats: "Romeinen 12:3"
        },
        {
            vraag: "Paulus vergelijkt de gelovigen met één lichaam met veel delen. Wat bedoelt hij?",
            antwoorden: ["Ze moeten allemaal precies hetzelfde zijn", "Ze kunnen beter alleen zijn", "Ze horen bij elkaar en hebben elkaar nodig", "Alleen het sterkste deel telt"],
            correct: "Ze horen bij elkaar en hebben elkaar nodig",
            bijbelplaats: "Romeinen 12:4-5"
        },
        {
            vraag: "Hoe kun je het kwaad volgens Paulus het beste aanpakken?",
            antwoorden: ["Sla nog harder terug", "Loop altijd weg", "Overwin het kwade met het goede", "Doe net zo gemeen terug"],
            correct: "Overwin het kwade met het goede",
            bijbelplaats: "Romeinen 12:21"
        },
        {
            vraag: "Waarom moet je een ander niet te snel veroordelen, zegt Paulus?",
            antwoorden: ["Omdat jij altijd gelijk hebt", "Omdat anderen niet meetellen", "Omdat we allemaal eens voor God zullen staan", "Omdat het toch niemand opvalt"],
            correct: "Omdat we allemaal eens voor God zullen staan",
            bijbelplaats: "Romeinen 14:10-12"
        },
        {
            vraag: "Waar wilde Paulus het liefst het goede nieuws brengen?",
            antwoorden: ["Alleen waar hij al bekend was", "Alleen in zijn eigen stad", "Op plekken waar mensen nog nooit van Christus hadden gehoord", "Nergens, hij bleef liever thuis"],
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
            vraag: "Paulus beveelt een vrouw aan die de gemeente diende. Hoe heette zij?",
            antwoorden: ["Lydia", "Marta", "Febe", "Hanna"],
            correct: "Febe",
            bijbelplaats: "Romeinen 16:1-2"
        },
        {
            vraag: "Welk echtpaar groet Paulus, dat samen met hem in het werk hielp?",
            antwoorden: ["Maria en Jozef", "Zacharias en Elisabet", "Priscilla en Aquila", "Abraham en Sara"],
            correct: "Priscilla en Aquila",
            bijbelplaats: "Romeinen 16:3"
        },
        {
            vraag: "Paulus zei deze brief hardop; iemand anders schreef hem op. Hoe heette die schrijver?",
            antwoorden: ["Lucas", "Marcus", "Tertius", "Timoteüs"],
            correct: "Tertius",
            bijbelplaats: "Romeinen 16:22"
        },
        {
            vraag: "Helemaal aan het eind zegt Paulus dat God iets met de gelovigen kan doen. Wat?",
            antwoorden: ["Hij kan hen rijk maken", "Hij kan hen beroemd maken", "Hij kan hen de baas maken", "Hij kan hen sterk maken in het geloof"],
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
            antwoorden: ["Over wat Jezus' volgelingen deden nadat hij naar de hemel ging", "Over de schepping van de wereld", "Over koning David", "Over de tien geboden"],
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
            vraag: "Op de Pinksterdag kregen de leerlingen iets bijzonders. Wat?",
            antwoorden: ["De heilige Geest", "Een nieuwe boot", "Een mooie mantel", "Een zak brood"],
            correct: "De heilige Geest",
            bijbelplaats: "Handelingen 2:1-4"
        },
        {
            vraag: "Paulus was eerst fel tégen de christenen. Wat gebeurde er onderweg naar Damascus?",
            antwoorden: ["Hij verdwaalde in de woestijn", "Hij viel in een diepe slaap", "Hij ontmoette Jezus in een fel licht en veranderde", "Hij werd tot koning gekroond"],
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
            antwoorden: ["Ze gingen vissen", "Ze kwamen bij elkaar om te bidden", "Ze hielden ruzie", "Ze reisden weg"],
            correct: "Ze kwamen bij elkaar om te bidden",
            bijbelplaats: "Handelingen 1:14"
        },
        {
            vraag: "Petrus kreeg een bijzonder visioen van een groot laken vol allerlei dieren. Wat leerde God hem daarmee?",
            antwoorden: ["Dat hij meer moest eten", "Dat alle mensen erbij mogen horen", "Dat hij moest gaan reizen", "Dat hij moest gaan vissen"],
            correct: "Dat alle mensen erbij mogen horen",
            bijbelplaats: "Handelingen 10:9-15"
        },
        {
            vraag: "In Samaria vertelde Filippus over Jezus en genas hij zieke mensen. Hoe reageerde de stad?",
            antwoorden: ["Iedereen werd boos", "Niemand luisterde", "Er was grote blijdschap", "Ze stuurden hem weg"],
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
            vraag: "Op het eiland Malta, na de schipbreuk, deed Paulus nog iets goeds voor de mensen daar. Wat?",
            antwoorden: ["Hij bouwde een nieuw schip", "Hij vertrok meteen", "Hij genas veel zieke mensen", "Hij ging vissen"],
            correct: "Hij genas veel zieke mensen",
            bijbelplaats: "Handelingen 28:8-9"
        },
        {
            vraag: "Toen Paulus en Barnabas door de heilige Geest werden uitgezonden, wat was hun taak?",
            antwoorden: ["Naar andere landen reizen om over Jezus te vertellen", "Een tempel bouwen", "Soldaat worden", "In Jeruzalem blijven wonen"],
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
            vraag: "Wie schreef het boek Handelingen? (dezelfde schrijver als het evangelie van Lucas)",
            antwoorden: ["Petrus", "Lucas", "Tomas", "Markus"],
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
            antwoorden: ["Hij reisde naar veel steden om over Jezus te vertellen", "Hij bleef altijd thuis", "Hij bouwde een groot paleis", "Hij werd visser op zee"],
            correct: "Hij reisde naar veel steden om over Jezus te vertellen",
            bijbelplaats: "Handelingen 13–28"
        },
        {
            vraag: "Toen Jezus omhoogging, zeiden twee mannen in witte kleren iets tegen de leerlingen. Wat?",
            antwoorden: ["Dat ze Jezus nooit meer zouden zien", "Dat Jezus op een dag net zo terug zal komen", "Dat ze meteen moesten verhuizen", "Dat ze het geheim moesten houden"],
            correct: "Dat Jezus op een dag net zo terug zal komen",
            bijbelplaats: "Handelingen 1:10-11"
        },
        {
            vraag: "Hoe leefden de allereerste christenen met elkaar?",
            antwoorden: ["Ieder voor zich", "Ze woonden ver uit elkaar", "Ze deelden alles en kwamen vaak samen", "Ze spraken nooit af"],
            correct: "Ze deelden alles en kwamen vaak samen",
            bijbelplaats: "Handelingen 2:44-46"
        },
        {
            vraag: "Bij de tempelpoort zat een man die niet kon lopen. Wat deed Petrus voor hem?",
            antwoorden: ["Hij gaf hem goud", "Hij liep voorbij", "Hij riep de wachters", "Hij genas hem in de naam van Jezus"],
            correct: "Hij genas hem in de naam van Jezus",
            bijbelplaats: "Handelingen 3:6-8"
        },
        {
            vraag: "Filippus ontmoette een man uit Ethiopië die uit de Bijbel zat te lezen, maar het niet begreep. Wat deed Filippus?",
            antwoorden: ["Hij legde uit dat het over Jezus ging en doopte hem", "Hij liet hem alleen", "Hij lachte hem uit", "Hij nam het boek mee"],
            correct: "Hij legde uit dat het over Jezus ging en doopte hem",
            bijbelplaats: "Handelingen 8:30-38"
        },
        {
            vraag: "Cornelius was een Romeinse legerofficier. Wat leerde Petrus door hem?",
            antwoorden: ["Dat alleen Joden erbij horen", "Dat het goede nieuws óók voor niet-Joden is", "Dat hij soldaat moest blijven", "Dat hij moest zwijgen"],
            correct: "Dat het goede nieuws óók voor niet-Joden is",
            bijbelplaats: "Handelingen 10:34-35"
        },
        {
            vraag: "Na de aardbeving deed de gevangenbewaarder iets belangrijks. Wat?",
            antwoorden: ["Hij liep boos weg", "Hij ging in Jezus geloven en liet zich dopen", "Hij sloot de deuren weer", "Hij riep de koning"],
            correct: "Hij ging in Jezus geloven en liet zich dopen",
            bijbelplaats: "Handelingen 16:30-34"
        },
        {
            vraag: "Op zijn reis naar Rome kwam Paulus in een zware storm op zee. Wat gebeurde er met het schip en de mensen?",
            antwoorden: ["Iedereen verdronk", "Het schip bleef heel", "Het schip verging, maar alle mensen kwamen veilig aan land", "Ze keerden om"],
            correct: "Het schip verging, maar alle mensen kwamen veilig aan land",
            bijbelplaats: "Handelingen 27:41-44"
        },
        {
            vraag: "Na de schipbreuk kwamen Paulus en de anderen op een eiland terecht. Hoe heette dat eiland?",
            antwoorden: ["Cyprus", "Malta", "Kreta", "Rhodos"],
            correct: "Malta",
            bijbelplaats: "Handelingen 28:1"
        },
        {
            vraag: "Stefanus, een van de eerste christenen, werd aangevallen door boze mensen omdat hij over Jezus vertelde. Wat deed hij toen?",
            antwoorden: ["Hij werd boos terug", "Hij riep de soldaten", "Hij bad of God de mensen wilde vergeven", "Hij rende weg"],
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
            antwoorden: ["Hij werd heel ziek", "Hij viel flauw", "Hem overkwam niets, hij bleef ongedeerd", "Hij rende weg"],
            correct: "Hem overkwam niets, hij bleef ongedeerd",
            bijbelplaats: "Handelingen 28:3-6"
        },
        {
            vraag: "Wie stuurde Filippus naar de eenzame weg door de woestijn, waar hij de man uit Ethiopië ontmoette?",
            antwoorden: ["De keizer", "Petrus", "Een engel van de Heer", "Zijn vader"],
            correct: "Een engel van de Heer",
            bijbelplaats: "Handelingen 8:26"
        },
        {
            vraag: "Cornelius kreeg bezoek van een engel, die zei dat hij iemand moest laten halen. Wie?",
            antwoorden: ["Paulus", "Petrus", "Filippus", "Lucas"],
            correct: "Petrus",
            bijbelplaats: "Handelingen 10:3-5"
        },
        {
            vraag: "Omdat Paulus een Romeins burger was, mocht hij iets bijzonders vragen. Wat vroeg hij?",
            antwoorden: ["Om naar huis te gaan", "Om met rust gelaten te worden", "Om zijn zaak door de keizer in Rome te laten behandelen", "Om vrij te komen met geld"],
            correct: "Om zijn zaak door de keizer in Rome te laten behandelen",
            bijbelplaats: "Handelingen 25:11"
        },
        {
            vraag: "Een wijze leraar, Gamaliel, gaf de leiders advies over de apostelen. Wat zei hij?",
            antwoorden: ["Laat hen met rust; als het van God komt, houd je het toch niet tegen", "Straf hen meteen", "Stuur hen het land uit", "Doe net of ze niet bestaan"],
            correct: "Laat hen met rust; als het van God komt, houd je het toch niet tegen",
            bijbelplaats: "Handelingen 5:34-39"
        }
    ],
    expert: [
        {
            vraag: "De leerlingen kozen iemand nieuw in de plaats van Judas. Hoe heette hij?",
            antwoorden: ["Markus", "Mattias", "Silas", "Lucas"],
            correct: "Mattias",
            bijbelplaats: "Handelingen 1:23-26"
        },
        {
            vraag: "Op de Pinksterdag was er ineens iets te horen en te zien. Wat?",
            antwoorden: ["Regen en onweer", "Muziek en gezang", "Een geluid als harde wind en vlammetjes als van vuur", "Donker en stilte"],
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
            antwoorden: ["Maria", "Lydia", "Tabita (ook Dorkas genoemd)", "Marta"],
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
            vraag: "Wie reisde in het begin samen met Paulus om over Jezus te vertellen?",
            antwoorden: ["Petrus", "Johannes", "Tomas", "Barnabas"],
            correct: "Barnabas",
            bijbelplaats: "Handelingen 13:2-3"
        },
        {
            vraag: "Lydia was de eerste in de stad Filippi die in Jezus ging geloven. Wat was haar werk?",
            antwoorden: ["Ze was visser", "Ze verkocht kostbare purperen stof", "Ze was soldaat", "Ze was koningin"],
            correct: "Ze verkocht kostbare purperen stof",
            bijbelplaats: "Handelingen 16:14"
        },
        {
            vraag: "Paulus en Silas zaten gevangen in Filippi. Wat deden ze midden in de nacht?",
            antwoorden: ["Ze sliepen diep", "Ze baden en zongen liederen voor God", "Ze huilden de hele nacht", "Ze probeerden te vluchten"],
            correct: "Ze baden en zongen liederen voor God",
            bijbelplaats: "Handelingen 16:25"
        },
        {
            vraag: "Wat gebeurde er toen Paulus en Silas in de gevangenis zongen?",
            antwoorden: ["Het begon te regenen", "De wachters vielen in slaap", "Er kwam een aardbeving en de deuren sprongen open", "Er kwam een storm op zee"],
            correct: "Er kwam een aardbeving en de deuren sprongen open",
            bijbelplaats: "Handelingen 16:26"
        },
        {
            vraag: "Waar is Paulus aan het eind van het boek Handelingen?",
            antwoorden: ["In Jeruzalem", "In Egypte", "In Rome, waar hij blijft vertellen over Jezus", "Thuis op het platteland"],
            correct: "In Rome, waar hij blijft vertellen over Jezus",
            bijbelplaats: "Handelingen 28:30-31"
        },
        {
            vraag: "De eerste christenen kozen zeven mensen uit om te helpen, zodat het eten eerlijk werd verdeeld onder arme mensen. Wie was een van hen?",
            antwoorden: ["Petrus", "Paulus", "Stefanus", "Lucas"],
            correct: "Stefanus",
            bijbelplaats: "Handelingen 6:5"
        },
        {
            vraag: "Op zijn reizen nam Paulus een jonge helper mee die in Jezus geloofde. Hoe heette deze jonge man?",
            antwoorden: ["Tomas", "Timoteüs", "Judas", "Markus"],
            correct: "Timoteüs",
            bijbelplaats: "Handelingen 16:1-3"
        },
        {
            vraag: "Toen Petrus uit de gevangenis was ontsnapt, klopte hij aan bij een huis. Een meisje, Rhode, herkende zijn stem. Wat deed ze van blijdschap?",
            antwoorden: ["Ze deed meteen open", "Ze rende eerst weg om het te vertellen en vergat de deur open te doen", "Ze viel flauw", "Ze deed de deur op slot"],
            correct: "Ze rende eerst weg om het te vertellen en vergat de deur open te doen",
            bijbelplaats: "Handelingen 12:13-14"
        },
        {
            vraag: "In de stad Lystra genas Paulus een man die nooit had kunnen lopen. Wat dachten de mensen toen?",
            antwoorden: ["Dat het toeval was", "Dat Paulus en Barnabas goden waren", "Dat hij een dokter was", "Dat ze moesten vluchten"],
            correct: "Dat Paulus en Barnabas goden waren",
            bijbelplaats: "Handelingen 14:11"
        },
        {
            vraag: "In Troas viel een jongen, Eutychus, tijdens een lange toespraak in slaap en viel uit een hoog raam. Wat deed Paulus?",
            antwoorden: ["Hij praatte gewoon door", "Hij maakte hem weer levend", "Hij schrok en vluchtte", "Hij riep een dokter"],
            correct: "Hij maakte hem weer levend",
            bijbelplaats: "Handelingen 20:9-12"
        },
        {
            vraag: "Vlak nadat Saulus in Jezus ging geloven, wilden boze mensen hem in Damascus kwaad doen. Hoe ontsnapte hij over de stadsmuur?",
            antwoorden: ["Door de poort", "Via een tunnel", "In een mand werd hij naar beneden gelaten", "Over een brug"],
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
            vraag: "Een gelovige man, Agabus, voorspelde iets dat zou gebeuren. Wat?",
            antwoorden: ["Een grote storm", "Een grote hongersnood", "Een oorlog", "Een feest"],
            correct: "Een grote hongersnood",
            bijbelplaats: "Handelingen 11:28"
        },
        {
            vraag: "Toen Paulus gevangenzat, hoorde zijn jonge neef van een plan om Paulus kwaad te doen. Wat deed hij?",
            antwoorden: ["Hij zei niets", "Hij liep weg", "Hij waarschuwde Paulus en de soldaten", "Hij hielp de slechte mensen"],
            correct: "Hij waarschuwde Paulus en de soldaten",
            bijbelplaats: "Handelingen 23:16"
        }
    ]
};

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
            bijbelplaats: "1 Korintiërs 1:2"
        },
        {
            vraag: "Hoeveel brieven aan de Korintiërs staan er in de Bijbel?",
            antwoorden: ["Eén", "Twee", "Drie", "Vijf"],
            correct: "Twee",
            bijbelplaats: "1 & 2 Korintiërs"
        },
        {
            vraag: "Paulus schrijft een beroemd stuk over de liefde. Wat zegt hij dat liefde is?",
            antwoorden: ["Geduldig en vriendelijk", "Jaloers en opschepperig", "Snel boos", "Trots en onaardig"],
            correct: "Geduldig en vriendelijk",
            bijbelplaats: "1 Korintiërs 13:4-5"
        },
        {
            vraag: "Paulus zegt dat de gemeente samen één lichaam vormt, met veel verschillende delen. Wat wil hij daarmee zeggen?",
            antwoorden: ["Alleen het hoofd telt mee", "Iedereen hoort erbij en heeft elkaar nodig", "Iedereen moet precies hetzelfde zijn", "De sterkste is de baas"],
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
            antwoorden: ["Nog precies dezelfde als vroeger", "Een nieuwe schepping", "Maar een beetje veranderd", "Helemaal niet veranderd"],
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
            antwoorden: ["Hij leed schipbreuk en was vaak in gevaar", "Hij had altijd vakantie", "Hij bleef veilig thuis", "Hij werd koning"],
            correct: "Hij leed schipbreuk en was vaak in gevaar",
            bijbelplaats: "2 Korintiërs 11:25-26"
        },
        {
            vraag: "Paulus zegt dat je alles wat je doet, voor iemand kunt doen. Voor wie?",
            antwoorden: ["Alleen voor jezelf", "Voor de keizer", "Voor God, om hem eer te geven", "Voor niemand"],
            correct: "Voor God, om hem eer te geven",
            bijbelplaats: "1 Korintiërs 10:31"
        },
        {
            vraag: "Over de gaven (talenten) in de gemeente zegt Paulus: er zijn er veel, maar...",
            antwoorden: ["ze komen allemaal van dezelfde Geest", "alleen Paulus heeft ze", "ze zijn niet belangrijk", "je moet ze kopen"],
            correct: "ze komen allemaal van dezelfde Geest",
            bijbelplaats: "1 Korintiërs 12:4"
        },
        {
            vraag: "De gemeenten in Macedonië waren zelf arm, maar deden toch iets bijzonders. Wat?",
            antwoorden: ["Ze hielden alles voor zichzelf", "Ze gaven royaal om anderen te helpen", "Ze vroegen zelf om hulp", "Ze deden niets"],
            correct: "Ze gaven royaal om anderen te helpen",
            bijbelplaats: "2 Korintiërs 8:1-3"
        },
        {
            vraag: "Paulus noemt de gelovigen \"gezanten\" (boodschappers) van Christus. Wat is hun taak?",
            antwoorden: ["Oorlog voeren", "Geld inzamelen voor zichzelf", "Namens Christus mensen oproepen om vrede met God te sluiten", "Alleen reizen"],
            correct: "Namens Christus mensen oproepen om vrede met God te sluiten",
            bijbelplaats: "2 Korintiërs 5:20"
        },
        {
            vraag: "Wat raadt Paulus de gelovigen aan om te doen, om dichtbij God te blijven?",
            antwoorden: ["Anderen veroordelen", "Zichzelf eerlijk onderzoeken in het geloof", "Nergens over nadenken", "Alleen aan zichzelf denken"],
            correct: "Zichzelf eerlijk onderzoeken in het geloof",
            bijbelplaats: "2 Korintiërs 13:5"
        },
        {
            vraag: "Paulus noemt zichzelf en Apollos \"medewerkers\". Met wie werken ze samen?",
            antwoorden: ["Met de keizer", "Met God", "Met de koning", "Met niemand"],
            correct: "Met God",
            bijbelplaats: "1 Korintiërs 3:9"
        },
        {
            vraag: "Waar gaat 1 Korintiërs 15 vooral over, het hart van het geloof?",
            antwoorden: ["Dat Paulus beroemd werd", "Dat Jezus is opgestaan uit de dood, en de gelovigen ook zullen opstaan", "Over het weer in Korinte", "Over een grote reis"],
            correct: "Dat Jezus is opgestaan uit de dood, en de gelovigen ook zullen opstaan",
            bijbelplaats: "1 Korintiërs 15:20-22"
        }
    ],
    advanced: [
        {
            vraag: "Paulus vergelijkt het geloof met een wedstrijd. Wat moet je doen om de prijs te winnen?",
            antwoorden: ["Stoppen halverwege", "Wachten op anderen", "Doorzetten, net als een hardloper die doorrent", "Opgeven"],
            correct: "Doorzetten, net als een hardloper die doorrent",
            bijbelplaats: "1 Korintiërs 9:24"
        },
        {
            vraag: "Paulus zegt aan het eind: blijf waakzaam en sterk. Wat raadt hij aan?",
            antwoorden: ["Geef snel op", "Sta vast in het geloof en wees moedig", "Doe maar wat", "Vertrouw op niemand"],
            correct: "Sta vast in het geloof en wees moedig",
            bijbelplaats: "1 Korintiërs 16:13"
        },
        {
            vraag: "Paulus en de gelovigen spaarden geld op om iets goeds te doen. Waarvoor?",
            antwoorden: ["Om een paleis te bouwen", "Om er zelf beter van te worden", "Om arme gelovigen in Jeruzalem te helpen", "Om een schip te kopen"],
            correct: "Om arme gelovigen in Jeruzalem te helpen",
            bijbelplaats: "1 Korintiërs 16:1-3"
        },
        {
            vraag: "De mensen in Korinte kozen partij: \"ik ben van Paulus\", \"ik ben van Apollos\". Wat vond Paulus daarvan?",
            antwoorden: ["Dat het goed was", "Dat ze juist één moesten zijn, niet verdeeld", "Dat ze voor hem moesten kiezen", "Dat het niet uitmaakte"],
            correct: "Dat ze juist één moesten zijn, niet verdeeld",
            bijbelplaats: "1 Korintiërs 1:12-13"
        },
        {
            vraag: "Paulus zegt dat de gelovigen samen iets bijzonders zijn waarin Gods Geest woont. Wat?",
            antwoorden: ["Een leeg huis", "Een gewone school", "Een tempel van God", "Een markt"],
            correct: "Een tempel van God",
            bijbelplaats: "1 Korintiërs 3:16"
        },
        {
            vraag: "Paulus zegt: als je alles kunt, maar je hebt geen liefde, dan...",
            antwoorden: ["ben je niets", "ben je de allerbeste", "ben je het belangrijkst", "heb je alles"],
            correct: "ben je niets",
            bijbelplaats: "1 Korintiërs 13:2"
        },
        {
            vraag: "Een deel van het lichaam kan niet tegen een ander zeggen: \"ik heb je niet nodig.\" Wat leert Paulus daarmee?",
            antwoorden: ["Alleen de sterkste telt", "Elke gelovige is nodig", "Je kunt beter alleen zijn", "Sommigen mogen weg"],
            correct: "Elke gelovige is nodig",
            bijbelplaats: "1 Korintiërs 12:21"
        },
        {
            vraag: "Paulus zegt: kennis alleen maakt je trots, maar er is iets dat mensen echt opbouwt. Wat?",
            antwoorden: ["Liefde", "Geld", "Macht", "Snelheid"],
            correct: "Liefde",
            bijbelplaats: "1 Korintiërs 8:1"
        },
        {
            vraag: "Paulus zegt dat gelovigen leven door op God te vertrouwen, en niet door iets anders. Waardoor niet?",
            antwoorden: ["Door wat ze met hun ogen kunnen zien", "Door heel rijk te zijn", "Door heel sterk te zijn", "Door heel slim te zijn"],
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
            antwoorden: ["Het spreken in talen", "Kennis", "De liefde", "Wonderen doen"],
            correct: "De liefde",
            bijbelplaats: "1 Korintiërs 13:13"
        },
        {
            vraag: "Paulus schept niet op over zichzelf, maar ergens anders over. Waarover wel?",
            antwoorden: ["Over zijn geld", "Over zijn eigen kracht", "Over de Heer / over wat God doet", "Over zijn reizen"],
            correct: "Over de Heer / over wat God doet",
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
            antwoorden: ["Ze tellen niet mee", "Ze mogen weg", "Ze zijn juist heel belangrijk en nodig", "Ze worden nooit gezien"],
            correct: "Ze zijn juist heel belangrijk en nodig",
            bijbelplaats: "1 Korintiërs 12:22"
        },
        {
            vraag: "Paulus zegt dat God iets moois heeft klaargemaakt voor wie van hem houden. Hoe bijzonder is dat?",
            antwoorden: ["Zo mooi dat geen mens het ooit heeft gezien of kan bedenken", "Heel gewoon", "Niet de moeite waard", "Alleen voor belangrijke mensen"],
            correct: "Zo mooi dat geen mens het ooit heeft gezien of kan bedenken",
            bijbelplaats: "1 Korintiërs 2:9"
        }
    ],
    expert: [
        {
            vraag: "Er was iets mis in de gemeente van Korinte. Wat?",
            antwoorden: ["Ze maakten ruzie en waren verdeeld", "Ze sliepen te veel", "Ze woonden te ver weg", "Ze spraken een vreemde taal"],
            correct: "Ze maakten ruzie en waren verdeeld",
            bijbelplaats: "1 Korintiërs 1:10-11"
        },
        {
            vraag: "Paulus zegt dat we nu nog niet alles begrijpen, maar later wel. Waarmee vergelijkt hij dat?",
            antwoorden: ["Met een dichte deur", "Met kijken in een wazige spiegel", "Met een diepe slaap", "Met een lange reis"],
            correct: "Met kijken in een wazige spiegel",
            bijbelplaats: "1 Korintiërs 13:12"
        },
        {
            vraag: "Paulus vergelijkt de schat van het goede nieuws met iets kostbaars in iets gewoons. Waarin zit die schat?",
            antwoorden: ["In een gouden kist", "In een groot kasteel", "In kruiken van klei (gewone potten)", "In een diepe put"],
            correct: "In kruiken van klei (gewone potten)",
            bijbelplaats: "2 Korintiërs 4:7"
        },
        {
            vraag: "Paulus eindigt 2 Korintiërs met een zegen. Wat wenst hij de gelovigen toe?",
            antwoorden: ["De genade van Jezus, de liefde van God en de verbondenheid van de Geest", "Veel geld en macht", "Een lang leven vol roem", "Een grote reis"],
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
            vraag: "Paulus zegt dat ons lichaam zwakker wordt, maar dat er iets anders gebeurt van binnen. Wat?",
            antwoorden: ["Van binnen worden we elke dag vernieuwd", "Van binnen worden we ook zwakker", "Er verandert niets", "We worden bang"],
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
            antwoorden: ["Alleen de sterkste telt", "Juist als ik zwak ben, ben ik sterk (door God)", "Zwak zijn is altijd slecht", "Sterk zijn is genoeg"],
            correct: "Juist als ik zwak ben, ben ik sterk (door God)",
            bijbelplaats: "2 Korintiërs 12:10"
        },
        {
            vraag: "Hoeveel keer leed Paulus schipbreuk, schrijft hij in 2 Korintiërs?",
            antwoorden: ["Nooit", "Eén keer", "Drie keer", "Tien keer"],
            correct: "Drie keer",
            bijbelplaats: "2 Korintiërs 11:25"
        },
        {
            vraag: "Paulus schrijft dat de gelovigen zelf een soort \"brief\" zijn. Waarmee is die geschreven?",
            antwoorden: ["Met gewone inkt", "Met een pen op papier", "Door Gods Geest, in hun hart", "Met verf op een muur"],
            correct: "Door Gods Geest, in hun hart",
            bijbelplaats: "2 Korintiërs 3:3"
        },
        {
            vraag: "Aan het eind van het grote opstandingshoofdstuk bemoedigt Paulus de gelovigen. Wat zegt hij over hun werk voor God?",
            antwoorden: ["Dat het zinloos is", "Dat het nooit voor niets is", "Dat alleen sterke mensen het mogen doen", "Dat ze er beter mee kunnen stoppen"],
            correct: "Dat het nooit voor niets is",
            bijbelplaats: "1 Korintiërs 15:58"
        }
    ]
};

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
    if (demoNiveau) return "verdiend";       // demo-modus: alles behaald tonen
    const opgeslagen = localStorage.getItem(`kist_${kistKey}`);
    return kistVolgorde.includes(opgeslagen) ? opgeslagen : "vergrendeld";
}

function setKistStatus(kistKey, status) {
    if (!kistVolgorde.includes(status)) return;
    // Demo-modus: niets opslaan, alleen de weergave verversen.
    if (demoNiveau) {
        toonKist(kistKey);
        return;
    }
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
    "Johannes": "johannes",
    "Romeinen": "romeinen",
    "Handelingen": "handelingen",
    "1 & 2 Korintiërs": "korintiers"
};

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
    const opgeslagen = localStorage.getItem(`trofee_${boekKey}`);
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
        volgendeTimer = setTimeout(gaNaarVolgende, 2000);
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
    achtergrond: "images/vitrine-evangelien.png",
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
    achtergrond: "images/vitrine-handelingen.png",
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
    achtergrond: "images/vitrine-paulusbrieven.png",
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
    achtergrond: "images/vitrine-algemenebrieven.png",
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
    achtergrond: "images/vitrine-openbaring.png",
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
    const stand = localStorage.getItem(sleutel);
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
            img.src = `images/${nis.basis}-zilver.png`;
            img.classList.add(niveau === "geen" ? "sk-schaduw" : niveau);
        } else {
            img.src = `images/${nis.basis}-${niveau}.png`;
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
        achtergrond: "images/schatkamer.png",
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
                  { x: "7.18%",  top: "38.53%", hoogte: "14%" },
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
                img.src = "images/kist-diamant.png";
                img.alt = "Verborgen diamanten schatkist";
                const alleVerdiend = afstelModus || alleKistKeys.every(
                    (kistKey) => getKistStatus(kistKey) === "verdiend"
                );
                img.classList.toggle("vergrendeld", !alleVerdiend);
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
                    img.src = `images/${vitrineNis.basis}-zilver.png`;
                    img.dataset.afstelKey = sleutel;       // "zoneId:index"
                    img.dataset.afstelNaam = vitrineNis.naam;

                    // Eigen kunst ontbreekt nog -> evangelisten-trofee als
                    // tijdelijke stand-in (één keer; daarna opgeven).
                    img.addEventListener("error", () => {
                        if (img.dataset.standin) { img.remove(); return; }
                        img.dataset.standin = "1";
                        img.src = `images/${alleBoekKeys[i % alleBoekKeys.length]}-zilver.png`;
                    });

                    nisHouder.appendChild(img);
                });
            });
        }
    }

    const houder = zaalEl.querySelector(".sk-zones");
    if (!houder) return;
    houder.innerHTML = "";                       // schoon herbouwen bij elk openen

    zaal.zones.forEach((zone) => {
        const standen = zone.vitrine.nissen.map((nis) => leesTrofeeStand(nis.sleutel));
        const behaald = standen.filter((stand) => stand !== "geen").length;

        const knop = document.createElement("button");
        knop.type = "button";
        knop.className = "zaal-zone";
        knop.style.left   = zone.klik.left;
        knop.style.top    = zone.klik.top;
        knop.style.width  = zone.klik.width;
        knop.style.height = zone.klik.height;
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
    paneel.appendChild(vitrineKnoppen);

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
    // Groepen met een boekenplank openen die overlay; de overige (Handelingen,
    // Openbaring) tonen voorlopig nog de rustige "binnenkort"-melding.
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
        "Handelingen": "Handelingen"
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
            { id: "romeinen",            naam: "Romeinen",              beschikbaar: true,  cover: "images/boek-romeinen.png" },
            { id: "korintiers",          naam: "1 & 2 Korintiërs",      beschikbaar: true,  cover: "images/boek-korintiers.png" },
            { id: "galaten",             naam: "Galaten",               beschikbaar: false, cover: "images/boek-galaten.png" },
            { id: "efeziers",            naam: "Efeziërs",              beschikbaar: false, cover: "images/boek-efeziers.png" },
            { id: "filippenzen",         naam: "Filippenzen",           beschikbaar: false, cover: "images/boek-filippenzen.png" },
            { id: "kolossenzen-filemon", naam: "Kolossenzen & Filemon", beschikbaar: false, cover: "images/boek-kolossenzen-filemon.png" },
            { id: "tessalonicenzen",     naam: "1 & 2 Tessalonicenzen", beschikbaar: false, cover: "images/boek-tessalonicenzen.png" },
            { id: "timoteus-titus",      naam: "Timoteüs & Titus",      beschikbaar: false, cover: "images/boek-timoteus-titus.png" }
        ]
    },
    algemeen: {
        titel: "Algemene brieven",
        subtitel: "Kies een brief",
        // De vier gebundelde algemene brieven (zie trofee-overzicht.md). Nog geen
        // vragenpools -> allemaal beschikbaar: false. "Brieven van Johannes"
        // (1-3 Joh.) staat bewust los van het evangelie "Johannes".
        boeken: [
            { id: "hebreeen",        naam: "Hebreeën",             beschikbaar: false, cover: "images/boek-hebreeen.png" },
            { id: "jakobus",         naam: "Jakobus",              beschikbaar: false, cover: "images/boek-jakobus.png" },
            { id: "petrus-judas",    naam: "Petrus & Judas",       beschikbaar: false, cover: "images/boek-petrus-judas.png" },
            { id: "johannesbrieven", naam: "Brieven van Johannes", beschikbaar: false, cover: "images/boek-johannesbrieven.png" }
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
    plateauBron: "images/stenen_plateau.png",
    bordBron:    "images/naambordje.png",
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
        { naam: "Handelingen",        groep: "Handelingen",        boek: "images/handelingenboek.png",
          plateauX: "20.94%", boekX: "16.77%", bordX: "20.47%", naamX: "20.9%",
          boekBodem: "10%", plateauBodem: "-0.58%", bordBodem: "2.3%", naamBodem: "5.52%" },
        { naam: "Brieven van Paulus", groep: "Brieven van Paulus", boek: "images/brievenvanpaulusboek.png",
          plateauX: "35.85%", boekX: "31.51%", bordX: "35.85%", naamX: "35.95%",
          boekBodem: "10%", plateauBodem: "-0.57%", bordBodem: "2.29%", naamBodem: "5.54%" },
        { naam: "Algemene brieven",   groep: "Algemene brieven",   boek: "images/algemenebrievenboek.png",
          plateauX: "50.64%", boekX: "46.1%", bordX: "50.9%", naamX: "50.85%",
          boekBodem: "10%", plateauBodem: "-0.66%", bordBodem: "2.3%", naamBodem: "5.33%" },
        { naam: "Openbaring",         groep: "Openbaring",         boek: "images/apocalypseboek.png",
          plateauX: "65.75%", boekX: "60.92%", bordX: "66.06%", naamX: "66.45%",
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

        houder.append(plateau, knop, bord, naam);
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
            achtergrond: "images/nt2-kast-paneel1.png",
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
                        labelX: "41.69%", labelY: "71.49%", labelBreedte: "17.00%" },
                      { sleutel: "trofee_galaten", basis: "galaten", naam: "Galaten",
                        x: "65.49%", y: "60.13%", breedte: "17.80%",
                        labelX: "65.23%", labelY: "71.49%", labelBreedte: "16.80%" },
                      { sleutel: "trofee_efeziers", basis: "efeziers", naam: "Efeziërs",
                        x: "87.70%", y: "63.98%", breedte: "11.40%",
                        labelX: "87.69%", labelY: "71.92%", labelBreedte: "16.60%" },
                      { sleutel: "trofee_filippenzen", basis: "filippenzen", naam: "Filippenzen",
                        x: "18.96%", y: "86.62%", breedte: "11.20%",
                        labelX: "19.50%", labelY: "94.36%", labelBreedte: "17.00%" },
                      { sleutel: "trofee_kolossenzen_filemon", basis: "kolossenzen-filemon", naam: "Kolossenzen",
                        x: "41.70%", y: "87.26%", breedte: "11.20%",
                        labelX: "40.63%", labelY: "95.00%", labelBreedte: "15.40%" },
                      { sleutel: "trofee_tessalonicenzen", basis: "tessalonicenzen", naam: "Tessalonicenzen",
                        x: "65.23%", y: "87.48%", breedte: "11.60%",
                        labelX: "64.70%", labelY: "95.22%", labelBreedte: "13.00%" },
                      { sleutel: "trofee_timoteus_titus", basis: "timoteus-titus", naam: "Timoteüs",
                        x: "87.96%", y: "87.48%", breedte: "10.60%",
                        labelX: "87.96%", labelY: "95.00%", labelBreedte: "17.00%" }
                  ] }
            ]
        },
        {
            achtergrond: "images/nt2-kast-paneel2.png",
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
                        labelX: "80.51%", labelY: "38.39%", labelBreedte: "20.00%" }
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
    img.src = `images/${nis.basis}-zilver.png`;
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

// Afstelmodus (?afstel=aan): open meteen de zaal en activeer de afstel-UI.
if (afstelModus) openSchatkamer();
