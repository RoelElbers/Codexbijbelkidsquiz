/*
  Bijbelkidsquiz — Bijbeltraining
  Thema: "Maten, geld & tijd"
  16 vragen, afgestemd op de getallen van de eigen uitlegpagina.

  KEUZES (voor de meekijkende theologen):
  - Alle antwoorden staan in veilige "ongeveer"-marges, zodat geen kind
    onterecht fout wordt gerekend bij maten waar de schattingen uiteenlopen.
  - Elke vraag is verankerd aan een evangelieverhaal waar de eenheid in voorkomt.
  - Vraag 7 (de "el", Matteüs 6:27): sommige vertalingen lezen "een el aan je
    LENGTE toevoegen", andere "aan je LEVENSDUUR". Voor deze vraag maakt dat niet
    uit — we vragen alleen wát een el is — maar het is bewust een vraag naar de
    maat en niet naar de uitleg van de tekst.
  - Bewust GEPARKEERD (vielen nergens in een kindvriendelijk verhaal): het "vat"
    (22 l) en de "kor" (220 l) los. Eventueel later koppelbaar aan Lucas 16
    (de oneerlijke rentmeester), maar voor kinderen vrij obscuur.

  LET OP voor de integratie: dit is een neutrale structuur. Pas de veldnamen
  (niveau / vraag / opties / antwoord / bijbelplaats) aan zodat ze EXACT
  overeenkomen met de bestaande vragenstructuur in het project.
*/

const matenGeldTijdVragen = [
  // --- Geld ---
  {
    niveau: "beginner",
    vraag: "Welk muntje was het allerkleinste dat in de Bijbel voorkomt?",
    opties: ["Penning", "Denarie", "Talent", "Pond"],
    antwoord: "Penning",
    bijbelplaats: "Marcus 12:41-44 (de arme weduwe)"
  },
  {
    niveau: "gevorderd",
    vraag: "De arme weduwe gaf twee penningen. Hoeveel was dat samen ongeveer in geld van nu?",
    opties: ["Een paar euro (zo'n 2 à 3 euro)", "Ongeveer 100 euro", "Een dagloon (150-200 euro)", "Meer dan 1000 euro"],
    antwoord: "Een paar euro (zo'n 2 à 3 euro)",
    bijbelplaats: "Lucas 21:1-4"
  },
  {
    niveau: "gevorderd",
    vraag: "Een denarie was het loon voor hoeveel werk?",
    opties: ["Eén hele dag werken", "Eén uur werken", "Eén week werken", "Eén maand werken"],
    antwoord: "Eén hele dag werken",
    bijbelplaats: "Matteüs 20:1-16 (de arbeiders in de wijngaard)"
  },
  {
    niveau: "expert",
    vraag: "Hoeveel denarie zaten er in één talent?",
    opties: ["Zesduizend", "Honderd", "Duizend", "Zestig"],
    antwoord: "Zesduizend",
    bijbelplaats: "Matteüs 25:14-30 (de gelijkenis van de talenten)"
  },
  {
    niveau: "expert",
    vraag: "Hoe lang moest een gewone arbeider ongeveer werken om één talent te verdienen?",
    opties: ["Vijftien tot twintig jaar", "Honderd dagen", "Ongeveer een jaar", "Een paar maanden"],
    antwoord: "Vijftien tot twintig jaar",
    bijbelplaats: "Matteüs 25:14-30 (de gelijkenis van de talenten)"
  },
  {
    niveau: "expert",
    vraag: "\"Pond\" betekent niet altijd geld. Waar gaat het bij het \"pond kostbare olie\" om?",
    opties: ["Een gewicht (ongeveer 300 gram)", "Honderd daglonen", "Een afstand", "Een tijdsmaat"],
    antwoord: "Een gewicht (ongeveer 300 gram)",
    bijbelplaats: "Johannes 12:3 (de zalving in Betanië)"
  },

  // --- Lengte ---
  {
    niveau: "gevorderd",
    vraag: "Een \"el\" is ongeveer zo lang als…",
    opties: ["De afstand van je elleboog tot je vingertoppen (zo'n 45 cm)", "Je voet", "Je hand", "Een grote stap"],
    antwoord: "De afstand van je elleboog tot je vingertoppen (zo'n 45 cm)",
    bijbelplaats: "Matteüs 6:27"
  },
  {
    niveau: "expert",
    vraag: "Emmaüs lag ongeveer zestig stadiën van Jeruzalem. Hoeveel kilometer is dat ongeveer?",
    opties: ["Bijna elf kilometer", "Ongeveer 2 kilometer", "Ongeveer 50 kilometer", "Ongeveer 100 kilometer"],
    antwoord: "Bijna elf kilometer",
    bijbelplaats: "Lucas 24:13 (de Emmaüsgangers)"
  },
  {
    niveau: "gevorderd",
    vraag: "Jezus zei: dwingt iemand je één mijl mee te gaan, ga er dan twee. Hoe lang was een Romeinse mijl ongeveer?",
    opties: ["Anderhalve kilometer (zo'n 1.500 meter)", "Honderd meter", "Tien kilometer", "Een halve kilometer"],
    antwoord: "Anderhalve kilometer (zo'n 1.500 meter)",
    bijbelplaats: "Matteüs 5:41"
  },

  // --- Inhoud ---
  {
    niveau: "beginner",
    vraag: "Waar veranderde Jezus op de bruiloft in Kana het water in wijn?",
    opties: ["In grote stenen kruiken", "In een beker", "In een put", "In leren zakken"],
    antwoord: "In grote stenen kruiken",
    bijbelplaats: "Johannes 2:1-11"
  },
  {
    niveau: "expert",
    vraag: "De stenen kruiken in Kana hielden elk twee of drie metreet. Hoeveel liter was dat ongeveer per kruik?",
    opties: ["Zo'n 80 tot 120 liter", "Ongeveer 5 liter", "Ongeveer 10 liter", "Meer dan 500 liter"],
    antwoord: "Zo'n 80 tot 120 liter",
    bijbelplaats: "Johannes 2:6"
  },
  {
    niveau: "gevorderd",
    vraag: "Jezus zei dat je een lamp niet ónder de korenmaat zet, maar erop. Wat was een korenmaat?",
    opties: ["Een bak of mand voor graan (zo'n 9 liter)", "Een muntstuk", "Een lengtemaat", "Een soort lamp"],
    antwoord: "Een bak of mand voor graan (zo'n 9 liter)",
    bijbelplaats: "Matteüs 5:15"
  },
  {
    niveau: "expert",
    vraag: "In de gelijkenis van het zuurdeeg verstopte een vrouw gist in drie maten (seah) meel. Waar was dat genoeg voor?",
    opties: ["Brood voor een heleboel mensen", "Eén klein broodje", "Eén gezin voor één dag", "Te weinig voor brood"],
    antwoord: "Brood voor een heleboel mensen",
    bijbelplaats: "Matteüs 13:33 (de gelijkenis van het zuurdeeg)"
  },

  // --- Tijd ---
  {
    niveau: "gevorderd",
    vraag: "De dag begon bij zonsopgang. Hoe laat was ongeveer het \"derde uur\"?",
    opties: ["Ongeveer negen uur 's ochtends", "Ongeveer drie uur 's nachts", "Rond het middaguur", "Drie uur 's middags"],
    antwoord: "Ongeveer negen uur 's ochtends",
    bijbelplaats: "Marcus 15:25"
  },
  {
    niveau: "expert",
    vraag: "Volgens Marcus stierf Jezus op het \"negende uur\". Hoe laat was dat ongeveer?",
    opties: ["Ongeveer drie uur 's middags", "Ongeveer negen uur 's ochtends", "Rond middernacht", "Bij zonsopgang"],
    antwoord: "Ongeveer drie uur 's middags",
    bijbelplaats: "Marcus 15:33-34"
  },
  {
    niveau: "gevorderd",
    vraag: "De Romeinen verdeelden de nacht in vier \"wachten\". Jezus noemde ze toen hij zei: waak dan! Welke vier waren dat?",
    opties: ["De avond, middernacht, het hanengekraai en de vroege ochtend", "Zonsopgang, ochtend, middag en avond", "Lente, zomer, herfst en winter", "Het eerste, tweede, derde en vierde uur"],
    antwoord: "De avond, middernacht, het hanengekraai en de vroege ochtend",
    bijbelplaats: "Marcus 13:35"
  }
];
