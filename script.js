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
                vraag: "Welke munt kregen de arbeiders in de wijngaard afgesproken als loon voor een hele dag werk?",
                antwoorden: ["Een denarie", "Een talent", "Een penning", "Een pond"],
                correct: "Een denarie",
                bijbelplaats: "Matteüs 20:2"
            },
            {
                vraag: "Hoe groot was de schuld van de dienaar in de gelijkenis van de onbarmhartige dienaar?",
                antwoorden: ["Honderd denarie", "Duizend talenten", "Tienduizend talenten", "Honderd talenten"],
                correct: "Tienduizend talenten",
                bijbelplaats: "Matteüs 18:24"
            },
            {
                vraag: "Op welk moment van de nacht kwam Jezus over het water naar de leerlingen toe, volgens Matteüs?",
                antwoorden: ["Bij zonsondergang", "Rond middernacht", "Tijdens de vierde nachtwaak (tegen de ochtend)", "Bij het eerste hanengekraai"],
                correct: "Tijdens de vierde nachtwaak (tegen de ochtend)",
                bijbelplaats: "Matteüs 14:25"
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
                vraag: "Een 'el' was een oude lengtemaat. Waarop was die gebaseerd?",
                antwoorden: ["De lengte van een onderarm, ongeveer 45 cm", "De lengte van een voet", "De lengte van een stap", "De hoogte van een man"],
                correct: "De lengte van een onderarm, ongeveer 45 cm",
                bijbelplaats: "Matteüs 6:27"
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
                bijbelplaats: "Marcus 11:7"
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
                vraag: "De arme weduwe gooide twee van de allerkleinste muntjes in de offerkist. Hoe werden die kleinste munten genoemd?",
                antwoorden: ["Denarie", "Talenten", "Penningen (lepta)", "Ponden"],
                correct: "Penningen (lepta)",
                bijbelplaats: "Marcus 12:42"
            },
            {
                vraag: "Jezus roept op tot waakzaamheid en noemt vier momenten: 's avonds laat, middernacht, hanengekraai en 's morgens vroeg. In hoeveel van zulke 'nachtwaken' was de nacht verdeeld?",
                antwoorden: ["Twee", "Drie", "Vier", "Zes"],
                correct: "Vier",
                bijbelplaats: "Marcus 13:35"
            },
            {
                vraag: "De arme weduwe gaf twee penningen (lepta), de allerkleinste muntjes. Hoeveel waren die ongeveer waard?",
                antwoorden: ["Bijna niets, een heel klein deel van een dagloon", "Ongeveer een dagloon", "Ongeveer tien daglonen", "Ongeveer honderd daglonen"],
                correct: "Bijna niets, een heel klein deel van een dagloon",
                bijbelplaats: "Marcus 12:42"
            },
            {
                vraag: "De Romeinen verdeelden de nacht in vier 'nachtwaken'. Ongeveer hoe lang duurde één nachtwaak?",
                antwoorden: ["Ongeveer 1 uur", "Ongeveer 3 uur", "Ongeveer 6 uur", "De hele nacht"],
                correct: "Ongeveer 3 uur",
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
    vragen = kiesWillekeurigeVragen(vragenData[gekozenBoek][niveau], 10);

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

    // Toon de bijbelplaats pas NA het antwoorden, onder het resultaat.
    if (huidig.bijbelplaats) {
        resultaat.innerHTML = `${melding}<div class="bijbelplaats">Lees het na in: ${huidig.bijbelplaats}</div>`;
    } else {
        resultaat.innerHTML = melding;
    }

    if (oefenModus) {
        // Oefenmodus: geen timer. De feedback + bijbelplaats blijven staan
        // tot het kind zelf op "Volgende" klikt, zodat het rustig kan nalezen.
        const volgendeKnop = document.createElement("button");
        volgendeKnop.className = "answer-btn oefen-volgende";
        volgendeKnop.textContent = "Volgende →";
        volgendeKnop.onclick = gaNaarVolgende;
        resultaat.appendChild(volgendeKnop);
    } else {
        setTimeout(gaNaarVolgende, 2500);
    }
}

function gaNaarVolgende() {
    huidigeVraag++;
    if (huidigeVraag < vragen.length) {
        laadVraag();
    } else {
        eindScherm();
    }
}

function terugNaarStartscherm() {
    document.getElementById("quiz-scherm").style.display = "none";
    document.getElementById("niveau-scherm").style.display = "none";

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
    // Stap 3: naslag- en uitleglijst.
}

function eindScherm() {
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

// Avatar + spelernaam direct uit localStorage tonen, zodat ze tussen sessies
// behouden blijven.
updateAvatarWeergave();

// Klik-handlers voor de vier avatar-keuze-knoppen in het nieuw-spel-scherm.
// Wijzigt alleen de visuele selectie; pas op "Start" wordt het opgeslagen.
document.querySelectorAll(".avatar-keuze-btn").forEach((knop) => {
    knop.addEventListener("click", () => markeerAvatarKeuze(knop.dataset.avatar));
});
