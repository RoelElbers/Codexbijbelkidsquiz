# Plaatsen in de game — inventaris

Voorbereiding op de rubriek "Waar gebeurde het". Stand 19 november 2026.
De volledige lijst staat in `plaatsen-in-de-game.csv` (puntkomma als
scheidingsteken, opent zo in Excel).

## Wat er is doorzocht

- **script.js**: alle 988 vragen in `vragenData` (vraag, antwoorden, uitleg),
  de 14 `metgezellenVragen` en de 19 `verborgenSchatVragen` (ook de tekst
  `reveal` die na het antwoord verschijnt). Het veld `bijbelplaats` niet, en
  `correct` ook niet (dat is een kopie van een antwoord).
- **ontdekken-inhoud.js**: woordenboek, Wie is wie, Hoe leefden ze toen,
  Verborgen patronen en Verborgen Schat (niet het veld `bijbelplaats`).
- **kerken\*.html**: de negen kerkpagina's, alleen de zichtbare tekst.

Gezocht is op alle namen uit de vier kolommen van het register
(`BijbelKidsQuiz_NT_geografisch_register_v2.xlsx`, tabblad Register, 184
rijen), ontdubbeld, als heel woord. Een eerdere telling met de werkversie (v1,
183 rijen) staat in de git-geschiedenis. Namen van meer woorden gaan voor: "meer van
Galilea" telt niet ook nog als "Galilea", "Caesarea Filippi" niet ook als
"Caesarea" en "Filippi". Bijbelboeken (Romeinen, Efeziërs, Filippenzen …)
tellen niet mee. De niveaus heten in de CSV brons, zilver en goud.

## Hoeveel plaatsen

**80 plaatsen uit het register** komen in de game voor (van de 184), samen
**674 vermeldingen**: 483 in de vragen, 175 in Ontdekken en 16 op de
kerkpagina's.

Daarnaast staan er **47 plaatsnamen in de game die niet in het register
staan** (119 vermeldingen), zie onder.

Vier namen zijn niet aan één registerrij te koppelen, omdat het register ze
splitst: **Antiochië** (Syrië of Pisidië), **Babylon** (historisch, 1 Petrus
of Openbaring), **Betanië** (bij Jeruzalem of over de Jordaan) en
**Samaria** (stad of streek). Ze tellen hierboven als één plaats.

## De tien die het vaakst voorkomen

| # | plaats | vermeldingen | waarvan in vragen |
| --- | --- | --- | --- |
| 1 | Jeruzalem | 115 | 88 |
| 2 | Rome | 77 | 52 |
| 3 | Israël | 59 | 41 |
| 4 | Filippi | 31 | 25 |
| 5 | Korinte | 23 | 16 |
| 6 | Egypte | 22 | 18 |
| 7 | Judea | 18 | 7 |
| 8 | Efeze | 16 | 8 |
| 8 | Galilea | 16 | 7 |
| 10 | Antiochië | 15 | 14 |
| 10 | Jordaan | 15 | 12 |

Kanttekeningen bij de telling:

- **Israël** is meestal het volk, niet het land. De telling is daar ruw.
- **Rome** staat ook op de kerkpagina's als zetel van de paus (7 keer).
- **Myra** staat er één keer in, alleen bij Sint-Nicolaas (woordenboek), niet
  bij een gebeurtenis uit het Nieuwe Testament.
- 16 plaatsen komen maar één keer voor, onder meer Berea, Troas, Lydda,
  Siloam, Betesda, Salem en Syrië.
- Zeven plaatsen staan alleen in Ontdekken of op de kerkpagina's, niet in een
  vraag: Myra, Kanaän, Idumea, Kenchreeën, Tyatira, Filadelfia en Sardes.

## Spellingen die afwijken

Vergeleken met de kolommen NBV21, Willibrord 1995 en HSV in het register.
Let op: het register is een werkversie, de spellingen daarin zijn nog niet
gecontroleerd.

**Afwijkend van NBV21:** geen. Twee opmerkingen:

- **Gerizim** — het register heeft geen spelling in NBV21, Willibrord of HSV:
  daar staat "deze berg" (Johannes 4:20). De naam komt in de game wel voor
  (2 keer).
- **Dekapolis** — de game volgt hier het register: Dekapolis in alle drie de
  kolommen. Let op: de NBV21-spelling in v2 komt van ChatGPT; in v1 stond
  daar nog Decapolis. Roel heeft alleen de Willibrord-spelling zelf
  nagekeken. Of de NBV21 Dekapolis of Decapolis heeft, is dus
  nog niet bevestigd.

**Afwijkend van alleen de HSV** (de game volgt hier NBV21 en Willibrord):
Arimatea, Betanië, Betesda, Betlehem, Getsemane, Golgota, Kafarnaüm, Korinte,
Lystra, Malta, Nazaret, Nineve, Pergamum, Sardes, Tessalonica, Tyatira en meer
van Galilea / Tiberias / Gennesaret (HSV: "zee van").

**Twee spellingen van dezelfde plaats in de game zelf:** niet gevonden. Wel
staan er voor een paar plaatsen **verschillende namen** in de game:

- meer van Galilea (11), meer van Tiberias (3), meer van Gennesaret (3) en
  Kinneret (2, als oude naam). Alle drie de "meer van"-namen staan ook in het
  register.
- Joppe (6) en Jafo (1).
- Dode Zee (16) en Zoutzee (2).
- Areopagus (3) en Marsheuvel (1).

## Plaatsnamen in de game die niet in het register staan (nakijken)

Gevonden met een zoekslag op hoofdletterwoorden na "in", "naar", "uit", "bij"
enz., op woorden als stad, berg, zee en eiland, en op een lijst bekende
plaatsnamen. Daarna met de hand geschift; personen, volken (behalve
Gerasenen), bijbelboeken en feesten zijn eruit. Een kandidatenlijst, geen
volledige.

**Bijbels of uit de oudheid:**
Dode Zee (16), Romeinse Rijk (16, een rijk, geen plaats in strikte zin),
Klein-Azië (6), Middellandse Zee (5), Babylonië (4), Hermon (4), Berseba (3),
Zoutzee (2), Kinneret (2), Tabor (2), Perzië (2), Dan (3, "van Dan tot
Berseba"), Hebron (1), Jafo (1), Gerasenen (1, hoort bij de
registerrij Gerasa), Marsheuvel (1), burcht Antonia (2), Stoa (1, in Athene),
Eden (1, "het nieuwe Eden"), Olympia (1), Zwarte Zee (1), Gallië (1),
Libanon (2).

**Modern of buiten de Bijbel** (vooral uitleg, Ontdekken en kerkpagina's):
Nederland (9), Turkije (7), Azië (2), Europa (2), Afrika (2), India,
Engeland, Manchester, China, Heiloo, Achterhoek, Nijmegen, Brazilië,
Australië, Oeganda, Verenigde Staten, Chicago, Peru, Vaticaanstad,
Sint-Pietersplein, Sixtijnse Kapel, Ghana, Suriname, Indonesië (elk 1).

Voor het register zijn vooral de bijbelse kandidaten interessant: Dode Zee,
Middellandse Zee, Klein-Azië, Hermon, Tabor, Berseba en Dan en Hebron komen
in de vragen voor, maar hebben geen registerrij. (Salem stond hier eerst ook;
die heeft in v2 een eigen rij.)
