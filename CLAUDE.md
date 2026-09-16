# Projectinstructies — Bijbelkidsquiz

Vaste conventies van dit project. Volg ze zonder er per sessie naar te vragen.

## Gedragsafspraken

**Noem openstaande punten niet ongevraagd.** `kladblok/wachtlijst.md` houdt bij
wat er nog ligt; nieuwe punten worden daar aan toegevoegd zodra ze opkomen, en
een punt wordt eruit gehaald in dezelfde commit waarin het wordt afgerond. Sluit
een antwoord niet af met een opsomming van wat er nog openstaat, tenzij er
expliciet naar gevraagd wordt. Meld wel altijd wat er in de huidige opdracht is
afgeweken, mislukt of opgevallen — dat hoort bij het werk zelf.

## Commits

- **Geen `Co-Authored-By`-trailer.** Deze repository gebruikt die conventie niet.
  Voeg hem aan geen enkele commit toe.
- **Rechtstreeks op `main`.** Geen feature-branches, geen pull requests.
- **Eén milestone per commit.** Niet meerdere losse wijzigingen samen.
- Schrijf het commitbericht naar een tijdelijk bestand en gebruik
  `git commit -F <bestand>`, zodat er geen editor nodig is.

## Cache-buster in `index.html`

`style.css`, `lang/nl.js`, `ontdekken-inhoud.js` en `script.js` dragen **samen
één nummer** en gaan **altijd samen omhoog**, ook als er maar één van de vier is
gewijzigd. Nooit per bestand ophogen, nooit terug in nummer. Lees de huidige
stand uit `index.html` zelf (regel 22 voor de stylesheet, onderaan `<body>` voor
de drie scripts).

`ontdekken-inhoud.js` staat bewust vóór `script.js`: `ontdekRubrieken` verwijst
naar de constanten uit dat bestand.

De favicons in `icons/` hebben een **eigen teller** en staan hier los van; die
niet meebumpen.

### Avatarteller — ander ophoogmoment

De avatarportretten in `images/Avatars/` dragen een **eigen `?v=`-teller**,
los van de cache-buster hierboven. Let op het verschil in ophoogmoment:

| teller | gaat omhoog zodra |
| --- | --- |
| cache-buster | `style.css`, `lang/nl.js`, `ontdekken-inhoud.js` of `script.js` wijzigt |
| **avatarteller** | **een bestand in `images/Avatars/` wijzigt** |

Ze liften dus niet met elkaar mee. Een nieuwe render verandert niets aan de
code, en een codewijziging verandert niets aan de portretten.

**Waarom hij er is.** Een avatar houdt zijn bestandsnaam wanneer het portret
wordt vervangen — `avatar-rebekka.webp` blijft `avatar-rebekka.webp`. De URL
verandert dan niet, dus een bezoeker die het oude portret in zijn
browsercache heeft, blijft dat zien tot de HTTP-cache van dat bestand
verloopt. De teller maakt de URL wél nieuw.

**Dertien plekken, allemaal tegelijk.** Blijft er één achter, dan ziet de
bezoeker in het ene scherm het nieuwe portret en in het andere het oude. Dat
is bij testen niet te betrappen, want dan is de cache toch vers.

```
index.html: 107        het startschermportret
index.html: 266-302    de tien keuzeknoppen
script.js : 7214       const AVATAR_VERSIE
script.js : 7394       updateAvatarWeergave()
script.js : 7561       de spelerkiezer
```

De twee plekken in `script.js` lezen `AVATAR_VERSIE`; in `index.html` staat
het nummer elf keer voluit. Regelnummers schuiven — zoek desnoods op
`Avatars/` in beide bestanden, dat vindt ze alle dertien. De toelichting bij
de teller staat ook boven in `index.html`, naast die van de scèneplaten.

## Vervangingen in `script.js`

Tekstvervangingen in `script.js` gaan via een **Python-script met een
exact-match vervanging en `assert c == 1`**, niet met de hand en niet met een
losse zoek-vervangactie. Zo is gegarandeerd dat precies één plek wordt geraakt.

```python
c = tekst.count(OUD)
assert c == 1, "verwacht 1 treffer, gevonden %d" % c
```

## Vragen

Een vraag eindigt nooit op een losstaand vraagwoord ('Wat?', 'Wie?').
De vraagzin wordt altijd volledig uitgeschreven, zodat het kind precies
weet waar de vraag naar zoekt.

Het gaat om deze vraagwoorden, hoofdletterongevoelig:

> Wat, Wie, Wiens, Wier, Waar, Waarom, Waarheen, Waarmee, Waarvoor,
> Waarvan, Waardoor, Waarover, Waarnaartoe, Hoe, Hoelang, Hoeveel,
> Wanneer, Welke, Welk

De controle kijkt naar de **slotzin**: alles na het laatste zinseinde
(`.` `:` `;` `!` `?` `—` `–`), of de hele vraag als dat er niet is.
Bestaat die slotzin uit niets anders dan één of meer *blokjes*, dan is de
vraag niet af. Een blokje is een vraagwoord met hooguit één voorzetsel
ervoor; tussen twee blokjes staat witruimte, eventueel met een komma, 'en'
of 'of' ertussen.

> aan, bij, door, in, met, na, naar, om, op, over, tot, tussen, uit, van,
> voor, zonder

Dus deze mogen geen van alle:

> `... zeiden iets tegen hen. Wat?` — `... spaarden geld op. Waarvoor?`
> `... voor iemand kunt doen. Voor wie?` — `... naar het andere. Van welk
> naar welk?` — `Met wie en waarom?` — `Wie, wat, waar?`

Een volledige zin die toevallig op een vraagwoord eindigt mag wél: `Paulus
zegt: doe alles in de naam van wie?` is goed, want daar hoort het kind
precies wat er gevraagd wordt. Zodra er buiten de blokjes nog een gewoon
woord in de slotzin staat, slaat de controle niet aan — `Van welk rijk naar
welk rijk gingen zij?` is dus in orde. Woorden die toevallig op een
vraagwoord eindigen ('zowat?', 'vanwaar?') slaan evenmin aan.

**`controleer-consistentie.py` controleert hierop** (sectie 9), over
`vragenData` en over de losse pools `verborgenSchatVragen` en
`metgezellenVragen`. Een treffer is een PROBLEEM, geen waarschuwing: de
exitcode wordt 1.

### Aanvulzinnen worden uitgeschreven

Een vraag bevat **altijd een volledige vraagzin en eindigt op een vraagteken**.
Een aanvulzin die op een beletselteken `…` eindigt is geen vraag: het kind
krijgt dan een half afgemaakte zin in plaats van iets wat het gevraagd wordt.
Zo'n zin wordt uitgeschreven tot een echte vraag.

Een beletselteken **middenin** mag wel, mits er een echte vraagzin op volgt —
het citaat mag onaf zijn, de vraag erover niet:

> `Paulus schrijft: "Het leven is voor mij Christus…" Hoe vult hij die zin aan?`

Wordt een aanvulzin uitgeschreven, dan **wijzigen de antwoorden mee**, want die
sluiten grammaticaal aan op de oude, onafgemaakte zin. Met `antwoorden` wijzigt
dus ook `correct` mee. `bijbelplaats` blijft ongewijzigd.

> was: `Paulus zegt: wat je ook doet, doe het…` — antwoorden `["in liefde", …]`
> wordt: `Paulus zegt dat het bij alles wat je doet om één ding gaat. Waar
> gaat het hem om?` — antwoorden `["Dat je het in liefde doet", …]`

### Hoofdletter bij verwijzingen naar God, Jezus en de Heilige Geest

Een voornaamwoord dat naar God, Jezus of de Heilige Geest verwijst, krijgt een
**hoofdletter**. Dat geldt overal waar spelers tekst zien: `script.js`
(`vraag`, `antwoorden`, `correct`, `uitleg`), `ontdekken-inhoud.js`,
`lang/nl.js` en de HTML-pagina's.

- `hij`, `hem` → `Hij`, `Hem`
- bezittelijk `zijn` → `Zijn` (`Zijn leerlingen`, `Zijn dood`)

**Wat er níet onder valt.** Hier gaat het bij het nalopen het vaakst mis:

- het **werkwoord** `zijn` — `ze zijn blij`, `moet zijn`, `geroepen zijn`. Dit
  is veruit de grootste groep valse treffers; let er extra op.
- `zich` en `zichzelf`.
- **zelfstandige naamwoorden** krijgen alleen een hoofdletter als het een
  titel of naam is voor God of Jezus: `de Vader`, `de Zoon`, `de Zoon van God`,
  `de Heer`. Algemene woorden blijven klein, ook als ze in de context naar
  Jezus verwijzen: `een zoon baren`, `de goede herder`, `een koning`.
  Voornaamwoorden volgen wél altijd de hoofdletterregel — `een zoon baren, en
  men zal Hem Immanuël noemen`.
- `hij`/`hem`/`zijn` voor **andere personen** — ook in een zin die over Jezus
  of God gaat. Denk aan Paulus, Petrus, Pilatus, Mozes, Jozef, Johannes.
- **personages in gelijkenissen** (de vader, de koning, de herder, de
  bruidegom), ook al staan ze symbolisch voor God.

Eén uitzondering op die laatste regel staat bewust in de pool: de goede herder
in Johannes 10:11 kreeg wél een hoofdletter, omdat Jezus daar van zichzelf zegt
dát Hij het is.

**Wijzigt een tekst in `antwoorden`, dan wijzigt dezelfde tekst in `correct`
mee.** Controleer na afloop dat elk `correct`-antwoord nog letterlijk in zijn
`antwoorden`-lijst staat.

#### Ook de eerste persoon en de aanspreekvorm

De regel geldt niet alleen voor verwijzingen ín de derde persoon. Hij geldt ook:

- **als God, Jezus of de Geest zélf spreekt** — `ik`, `mij`, `me`, `mijn`,
  `m'n`, `mijzelf`, `mezelf` worden `Ik`, `Mij`, `Me`, `Mijn`, `M'n`,
  `Mijzelf`, `Mezelf`. Bijvoorbeeld: `Kom, volg Mij`, `Dit is Mijn lichaam`,
  `Weid Mijn schapen`, `Mijn trouwe getuige`.
- **als iemand God of Jezus aanspreekt** — `u`, `uw`, `jij`, `je`, `jou`,
  `jouw` worden `U`, `Uw`, `Jij`, `Je`, `Jou`, `Jouw`.

**Ook in letterlijke citaten**, ook waar de bijbelvertaling zelf een kleine
letter gebruikt. De spelling van het spel gaat hier voor die van de vertaling.

**Wat er níet onder valt:**

- **woorden van andere sprekers**: Paulus (`in mijn lichaam`), Petrus, Maria,
  profeten die over zichzelf spreken, mensen die bidden (`help mij`,
  `Heer, ik ben niet waardig`).
- **aanspreekvormen tegen een engel** blijven klein, óók als die engel namens
  God spreekt. Zo blijft in Maria's antwoord aan Gabriël `Laat er met mij
  gebeuren wat u gezegd hebt` allebei klein.
- **personages in gelijkenissen die zelf spreken** (de vader, de koning).
- `je`, `jij`, `jou` die **het kind of de lezer** aanspreken. Dit is veruit de
  grootste groep valse treffers — van de bijna duizend kandidaten in ronde 2
  viel het overgrote deel hierin. Let er extra op.
- `uw` in een gebod dat de **hoorder** aanspreekt: `Heb de Heer uw God lief`,
  `Eer uw vader en moeder`.

De hoofdletter bij God, Jezus en de Heilige Geest geldt ook in foute
antwoorden, en wordt nooit als weggever gezien: zo schrijven we God altijd. Een
hoofdletter die alleen in het goede antwoord of alleen in een afleider staat, is
dus geen reden om een vraag aan te passen. Controleer bij nieuwe vragen alleen
of verwijzingen naar God, Jezus of de Geest overal een hoofdletter hebben, ook
in de afleiders.

#### Namen die bij het nalopen als goddelijke naam tellen

Een controle op deze regel zoekt eerst naar blokken waarin God of Jezus wordt
genoemd. Gebruik deze lijst; hij is bewust ruim:

> God, Gods, Jezus, Christus, Heer, Heere, Heilige Geest, Geest, Messias,
> **Immanuël**, Vader, Zoon, Lam, Verlosser, Redder, Heiland, Zaligmaker,
> Schepper, Gezalfde, Alfa, Omega

`Immanuël` stond er eerst niet bij. Daardoor bleef de vraag bij Matteüs 1:23
bij een eerdere controle buiten beeld: dat blok noemt Jezus nergens anders.

## Plaatsingsregel — gewone pool of Verborgen Schat

Waar materiaal terechtkomt hangt af van hoe vast de herkomst ervan ligt.

**Vaststaande basis → de gewone vraagpools.** De bijbeltekst zelf,
identificeerbare vroegkerkelijke bronnen, gevestigde exegese.

**Herkomst ligt niet vast → de Verborgen Schat.** Overleveringen, dingen die je
alleen buiten de Bijbel vindt. Daar rechtvaardigt "verborgen" het opzoeken.

Voorbeeld, uit `kladblok/KLADBLOK-avatarbeschrijvingen.md`: bij Maria staat
bewust "ze woonde in Nazaret" en niet "uit Nazaret". Lucas 1 zegt alleen dat de
engel daarheen werd gestuurd; over haar afkomst staat er niets. Dat ze opgroeide
in de tempel in Jeruzalem komt uit het Protevangelium van Jakobus en blijft
daarom uit de gewone tekst.

## Controleren

**Node.js v24 LTS staat op dit systeem.** Draai na elke wijziging in
`script.js`:

```
node --check script.js
```

Daarnaast:

```
python controleer-consistentie.py
```

Dat script leest `script.js` met een eigen JS-parser, is read-only en geeft
exitcode 1 zodra er een probleem is.

Na inhoudelijke wijzigingen aan vragen ook `python maak-vragen-export.py`
draaien. `vragen-export.md` is automatisch gegenereerd, staat in `.gitignore` en
wordt nooit met de hand bewerkt — corrigeer altijd in `script.js`.
