/*
  ============================================================================
  OPDRACHT VOOR CLAUDE CODE  (lees dit eerst, leg je plan uit, wacht op akkoord)
  ============================================================================

  Dit bestand bevat twee taken. Doe ze allebei, maar leg eerst je plan uit en
  wacht op akkoord van de gebruiker voordat je iets in script.js wijzigt.

  TAAK 1 — Nieuw, OPTIONEEL veld "uitleg" bij vragen
  --------------------------------------------------
  - Sommige vragen hieronder hebben een extra veld "uitleg" (een paar zinnen
    achtergrond). De meeste vragen in het spel hebben dat NIET.
  - Toon de uitleg ná het beantwoorden, op dezelfde plek en in dezelfde stijl
    waar nu de Bijbelplaats verschijnt (in checkAntwoord, onder het resultaat).
  - Toon de uitleg ALLEEN als het veld bestaat. Vragen zonder "uitleg" moeten
    zich precies gedragen zoals nu — er mag niets breken aan bestaande vragen.
  - Kijk eerst hoe de Bijbelplaats nu wordt getoond en hang de uitleg daar
    logisch onder (bijv. een eigen regeltje onder "Lees het na in: …").

  TAAK 2 — Tien nieuwe vragen toevoegen aan Matteüs Beginner
  ----------------------------------------------------------
  - Voeg de tien vragen hieronder toe aan vragenData["Matteüs"].beginner.
  - Ze staan al in exact het bestaande objectformaat
    ({ vraag, antwoorden, correct, bijbelplaats, [uitleg] }) — niets omzetten.
  - Deze tien zijn al gecontroleerd tegen de huidige Matteüs Beginner-pool en
    bevatten geen dubbele. Een extra dubbelcheck mag, maar zou niets moeten
    vinden. De pool gaat hiermee van 10 naar 20 vragen.
  - De pool-, hussel-, win- en scorelogica blijft ongemoeid; de bestaande
    trekking (10 willekeurig uit de pool) pakt de grotere pool vanzelf op.

  LET OP: dit bestand vervangt het eerdere "matteus-beginner-uitbreiding.js"
  (dat bevatte deels dubbele vragen — gebruik dat niet meer). Dit is een
  referentiefragment; na het inbouwen mag dit bestand weg.
  ============================================================================
*/

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
        vraag: "Op welk dier reed Jezus toen hij Jeruzalem binnenkwam?",
        antwoorden: ["Een ezel", "Een paard", "Een kameel", "Een os"],
        correct: "Een ezel",
        bijbelplaats: "Matteüs 21:1-9",
        uitleg: "Een koning die ten oorlog trok kwam meestal op een paard. Jezus koos bewust een ezel — een teken van vrede. Zo liet hij zien wat voor koning hij wilde zijn."
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
