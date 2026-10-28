# Wachtlijst

*Aangelegd 4 september 2026. Wat er nog ligt. Nieuwe punten komen hier bij zodra
ze opkomen; een punt gaat er weer uit in dezelfde commit waarin het wordt
afgerond. Zie de gedragsafspraak in `CLAUDE.md`: dit staat hier zodat het niet in
elk antwoord herhaald hoeft te worden.*

## Opschoning

- **Vrijgaveregels in `.claude/settings.local.json` opschonen.** Er staan er
  432, opgebouwd met "altijd toestaan" (o.a. losse Python-, `Start-Process`- en
  `curl`-aanroepen die zonder vraag code draaien). Aparte klus, gesignaleerd bij
  de /doctor-check van 13 oktober 2026.
- **De twee bronbestanden zijn gewaarschuwd, niet opgeschoond.**
  `verborgen-schat-vragen-bijbelkidsquiz.md` (zes zinnen met "overlevering") en
  `verborgen-schat-naslag-bijbelkidsquiz.md` (drie echte treffers). Ze dragen
  sinds 04-09 een waarschuwing bovenaan; de teksten zelf staan er nog.
  Zie `kladblok/bronnen-audit.md`.
- **Woordenboekterm "Allerheiligste"** in `ontdekken-inhoud.js` r. 27: "Volgens
  de traditie was God daar zelf aanwezig". De laatste naamloze bronvermelding in
  dat bestand. Anders van aard dan de andere gevallen — hier gaat het om de
  Joodse tempeltheologie; Exodus 25:22 en Leviticus 16 zijn de aanwijsbare
  plaatsen.
- **"Erfzonde" als woordenboekterm overwegen.** Toe te voegen aan
  `ONTDEK_WOORDENBOEK` in `ontdekken-inhoud.js`; dat is de plek waar begrippen
  kort worden uitgelegd, naast termen als *Genade*, *Verbond*, *Vergeving* en
  *Zonde*. Verder alleen behandelen waar het bij een concrete vraag hoort. Niet
  op de kerkpagina's: die laten zien wat een traditie meebrengt en leggen geen
  leer uit.
- **Eén vaste voettekst op alle pagina's.** De linkregel in de <footer>
  verschilt nu per pagina (de kerkpagina's missen Steunen, contact en steunen
  hebben ook Voor ouders en begeleiders). Gelijktrekken als aparte klus.
  Gesignaleerd 28 oktober 2026.

## Bouw en gedrag van het spel

- **Lege rubriek in de Ontdekken-hub.** "Waar gebeurde het" heeft
  `onderwerpen: []` (`script.js` r. 8654). De knop staat er wel en is niet
  vergrendeld, dus hij leidt naar een leeg lijstscherm. Hij hoort vergrendeld
  te zijn zolang de rubriek leeg is. ("Wie is wie" is sinds 26-09 gevuld met
  Tempel en synagoge.)
- **Ontdekken-hub opnieuw indelen: Ontdekken → rubriek → onderwerp →
  artikel.** De eerste twee lagen bestaan al (`ontdekRubrieken` met
  `onderwerpen[]`); wat ontbreekt is een artikellaag met eigen config, zoals
  `ONTDEK_WOORDENBOEK` die nu al heeft. Per artikel: `id`, `titel`,
  `onderwerp`, `samenvatting`, `tekst`, `zieOok`, `zichtbaar` (half af werk
  kan dan in het bestand blijven staan) en `volgorde`. Een rubriek met weinig
  artikelen slaat de onderwerplaag over en toont meteen de artikelen. Het
  woordenboek wordt een rubriek als alle andere. Rubrieksnamen open houden
  ("Wie is wie", niet "De twaalf apostelen"), zodat één artikel al genoeg is
  en het menu niet onaf lijkt. Eerste vulling: artikel "Jakobus de
  Rechtvaardige" in de rubriek Wie is wie, onderwerp apostelen; tekst staat in
  de chat van 18 september 2026. Raakt twee bestaande punten: het punt
  hierboven over lege rubrieken en het punt onderaan over eigen webadressen
  (de artikel-`id` kan meteen als slug voor een latere URL dienen).
- **Avatarbeschrijvingen liggen klaar, maar er is geen plek om ze te tonen.**
  De set is sinds 07-09 compleet: alle tien de avatars hebben een alinea. De
  parkeerreden — een halve set — is daarmee vervallen. Wat ontbreekt is de
  invoer zelf: `avatarNamen` (`script.js` r. 7196) koppelt een sleutel alleen
  aan een weergavenaam, er is geen veld voor een beschrijving en geen scherm
  dat er een toont. Zie `kladblok/KLADBLOK-avatarbeschrijvingen.md`, laatste
  paragraaf, voor de twee keuzes die daarbij horen.
- **`BETA_MODUS` op `false`.** `script.js` r. 4. Zolang die op `true` staat toont
  het startscherm het "TESTVERSIE"-lint. Moet om vóór de release.
- **Aanhalingstekens in antwoorden gelijktrekken binnen een pool.** Bij Brieven
  van Johannes brons staan bij vraag 8 alle vier de antwoorden tussen enkele
  aanhalingstekens ('Mijn kinderen' enz.), terwijl vraag 7 ze alleen om één
  woord in het goede antwoord heeft ('kinderen'). Aanhalingstekens in maar één
  optie trekken de aandacht en kunnen een aanwijzing worden. Meenemen bij het
  doorlopen van die pool, en daarna breder nakijken: staan er elders
  antwoordsets waarin maar één optie aanhalingstekens heeft?
- **Brieven van Johannes is scheef verdeeld: 11 brons, 15 zilver, 26 goud.**
  Goud is twee keer zo groot als bij de andere boeken en brons de kleinste van
  de game, waardoor in brons bijna elke vraag elke ronde langskomt. Bij het
  doorlopen van goud nagaan of er vragen bij zitten die eigenlijk brons of
  zilver zijn.
- **Verborgen Schat: vragen en artikelen zonder koppeling** (bijgewerkt 28 okt
  2026, na de controleronde):
  - Artikelen zonder vraag: apocalyps, Alfa en Omega, het Lam, hoe de Bijbel
    eindigt, de boom des levens, de zeven gemeenten. Eventueel later een vraag
    bij maken.
  - Vragen zonder artikel: Malchus, Hebreeën, Tertius, Galaten (grote
    letters), P52, hoofdstukken en verzen, de codex, de vis. Alleen een
    artikel schrijven als het echt iets toevoegt aan de toelichting.
  - De lege artikelen over Malchus en Hebreeën zijn op 28 okt 2026 weggehaald
    (de oude Malchus-uitleg over een Romeinse soldaat en de doodstraf klopte
    niet: Malchus was de dienaar van de hogepriester).
  - Meenemen bij de herindeling van de Ontdekken-hub (zie het punt daarover),
    niet los oppakken.
- **Fullscreen-knop over de naslagtekst op de tablet.** Op 820×1180 (tablet
  staand) valt de ronde fullscreen-knop rechtsboven over het begin van de tekst
  in het naslagvak van Ontdekken. Bestond al vóór Wie is wie. Meenemen bij het
  opnieuw indelen van het menu / de tabletondersteuning.
- **Donatiezone van de lantaarn weg zodra `PLAKBOEK_ACTIEF` op `true` gaat.**
  Met de plakboekvlag is de lantaarn linksonder het Bijbelkidsalbum; zonder
  vlag is hij nog de donatielantaarn (`.donatie-zone`, `initDonatieLantaarn`
  in `script.js`). Gaat het album definitief live, dan verdwijnt de
  donatiezone van de lantaarn. Doneren gaat dan alleen via Instellingen →
  Steun de Bijbelkidsquiz en via de pagina Voor ouders en begeleiders.
  Bewuste keuze: geen geldvraag op het scherm van het kind, ook geen pop-up.
- **Bijbelkidsalbum: plek van het opschrift onder de lantaarn.** Achtergrond
  en boek van het albumscherm zijn definitief (`images/album/`). Alleen de
  plek van het opschrift "Bijbelkidsalbum" onder de lantaarn
  (`.album-opschrift` in `style.css`) wacht nog op Roels oordeel.
- **Naslagvakken op lage desktopschermen.** Bij Steun, de Ontdekken-hub en het
  Woordenboek valt op 1280×720 en 1366×768 de rand van het vak boven en onder
  14–16px buiten beeld; de inhoud blijft bereikbaar (scrolt binnen het vak).
  Voorstel: max-height met calc(100vh - 32px). Gesignaleerd 28 oktober 2026.

## Vragenwerk

- **Afleidersronde over alle pools.** Dezelfde soort correcties als bij
  Kolossenzen, Tessalonicenzen en Timoteüs & Titus, maar dan boekbreed:
  afleiders die hetzelfde beweren, scheve antwoordlengtes, vraagteksten die het
  antwoord weggeven.
- **Nieuwe Ontdekken-rubriek "Eén Bijbel, verschillende lezingen" (werknaam):**
  een plek voor teksten die christenen verschillend lezen, waar elke traditie
  vanuit haar eigen teksten wordt beschreven, zonder dat de game kiest. Hier
  past een lang artikel; in het woordenboek zou het te lang worden. Eerste
  onderwerpen: de broers van Jezus (Jakobus G3; de uitleg daar wordt dan kort,
  met een verwijzing) en de ziekenzalving (Jakobus B5); beide zijn hieronder
  uitgewerkt. Later bijvoorbeeld: doop, avondmaal en eucharistie, de biecht en
  de schuldbelijdenis, de heiligen en de voorbede, Petrus en de rots (Matteüs 16:18), de paasdatum. Nagaan
  of een vraag aan zo'n artikel gekoppeld kan worden, zoals bij de Verborgen
  Schat (catecheseId).
  - Artikel over de broers van Jezus (Jakobus G3):
    Argumenten (besproken op 20 en 21 okt 2026):
    - Katholiek: "broer" kan ook een naaste verwant zijn (Abraham en Lot,
      Genesis 13:8); Maria, de moeder van Jakobus en Jozef (Matteüs 27:56),
      mogelijk dezelfde als Maria van Klopas (Johannes 19:25); Maria wordt aan
      de leerling toevertrouwd (Johannes 19:26-27); geen andere kinderen bij
      Bethlehem, de vlucht naar Egypte en de terugkeer ("het kind en Zijn
      moeder", Matteüs 2:13-14, 21) of de twaalfjarige Jezus in de tempel
      (Lucas 2:41-51); Lucas had Maria als bron. De kerk herdenkt Jakobus en
      Simeon als verwanten van de Heer (Hegesippus, 2e eeuw).
      - Twee zussen die allebei Maria heten ligt niet voor de hand; daarom lezen
        veel uitleggers "zuster" in Johannes 19:25 als verwante. Volgens
        Hegesippus (2e eeuw) was Klopas een broer van Jozef; als Maria van Klopas
        zijn vrouw was, was zij de schoonzus van Maria. (Johannes 19:25 kan
        gelezen worden met drie of met vier vrouwen bij het kruis; deze
        redenering gaat uit van drie.)
    - Orthodox: zonen van Jozef uit een eerder huwelijk (verdedigd door
      Epiphanius van Salamis, 4e eeuw, in zijn Panarion; ook Eusebius,
      Kerkgeschiedenis 2.1, noemt Jakobus een zoon van Jozef).
    - Protestants: jongere broers en zussen, zonen en dochters van Maria en
      Jozef; Jezus heet "eerstgeboren" (Lucas 2:7), "totdat" (Matteüs 1:25), de
      broers worden bij naam genoemd (Matteüs 13:55, Marcus 6:3) en komen vaker
      terug (Johannes 7:5, Handelingen 1:14, 1 Korintiërs 9:5).
    - Goed om te weten: Luther, Calvijn en Zwingli hielden vast aan Maria's
      blijvende maagdelijkheid; de lezing "echte broers" werd onder protestanten
      pas later de meest gangbare.
    - Bronnen in het artikel bij naam noemen, met een korte uitleg wie het
      waren. Hegesippus (2e eeuw) schreef de geschiedenis van de eerste gemeenten
      op; zijn werk is verloren, maar zijn woorden zijn bewaard bij Eusebius,
      Kerkgeschiedenis 3.11 en 4.22 (rond 325). Daar staan ook Klopas als broer
      van Jozef en Simeon als neef van de Heer. Epiphanius van Salamis was een
      bisschop uit de 4e eeuw. Apocriefe geschriften, zoals het Protevangelie van
      Jakobus, NIET als bron noemen: dat kan ouders afschrikken.
  - Artikel over de ziekenzalving en het bidden voor zieken (Jakobus B5,
    Jakobus 5:14-15):
    - De kerken geven hier heel verschillend invulling aan; elke kerk
      beschrijven vanuit wat zij zelf waardevol vindt: de ziekenzalving in de
      katholieke en de orthodoxe kerk; gebed en soms handoplegging in
      protestantse kerken, in sommige ook zalving met olie.
    - Genezing (Jakobus 5:15) zorgvuldig noemen: God geneest soms, zonder de
      belofte dat Hij het altijd doet. Concept: "Soms geneest God iemand, zoals
      in de Bijbel; soms helpt Hij de zieke op een andere manier en staat Hij
      naast hem."
    - Bij B5 blijft het antwoord neutraal ("bidden"); de uitleg daar wordt
      kort, met een verwijzing naar het artikel.
    - Het woordenboeklemma "Zalven" staat sinds 23 okt 2026 in het Woordenboek
      (koningen, priesters, Messias, Jakobus 5:14). In het artikel ernaar
      verwijzen.
  - Artikel over de biecht en de schuldbelijdenis (Brieven van Johannes B2,
    1 Johannes 1:9):
    - De uitleg bij B2 is op 21 okt 2026 weggehaald; dit onderwerp krijgt een
      plek in de rubriek. Magisterium wees erop dat ook de orthodoxe kerk de
      biecht als sacrament kent, en sommige protestantse kerken een persoonlijke
      belijdenis bij een predikant.
    - Oude uitlegtekst van B2: Je zonden belijden betekent dat je eerlijk tegen
      God zegt wat je verkeerd hebt gedaan. Dat doe je niet om God iets te
      vertellen wat Hij nog niet weet, maar omdat het opgeruimd staat tussen
      jullie. Hoe gelovigen dat doen, verschilt. De een bidt het thuis. In de
      kerk spreken de gelovigen het vaak samen uit, aan het begin van de dienst;
      dat heet een schuldbelijdenis. In de Katholieke Kerk bestaat daarnaast de
      biecht.
  - Artikel over het Onzevader (aanleiding: lemma Verzoeking, 23 okt 2026):
    - Het belangrijkste gebed van de christenen; dit artikel mag uitgebreid
      zijn.
    - Twee versies in de Bijbel: Matteüs 6:9-13 en Lucas 11:2-4. Het slot "Want
      van U is het koninkrijk…" staat niet in de oudste handschriften van
      Matteüs, maar wel al in de Didache (hoofdstuk 8), die ook zegt dat
      christenen het drie keer per dag baden.
    - De zesde bede: het Griekse peirasmos betekent zowel verleiding als
      beproeving. Jakobus 1:13: God verleidt niemand; God kan wel beproeven
      (Abraham; Deuteronomium 8:2).
      - Katholiek Nederland en Vlaanderen, sinds Advent 2016: "en breng ons
        niet in beproeving" (daarvoor: "en leid ons niet in bekoring"). De
        invoering ging niet zonder discussie.
      - Protestants (NBG51, HSV): "en leid ons niet in verzoeking". NBV21:
        "breng ons niet in beproeving".
      - Frankrijk, sinds Advent 2017: "Et ne nous laisse pas entrer en
        tentation" (laat ons niet binnengaan in de verleiding).
      - Paus Franciscus, interview met TV2000, december 2017: "leid ons niet in
        verzoeking" is geen goede vertaling; een vader brengt zijn kind niet in
        verleiding. Hij noemde de Franse oplossing als goed voorbeeld.
      - Italië, sinds 2020: "non abbandonarci alla tentazione" (laat ons niet
        alleen in de verleiding).
      - Duitsland: de bisschoppen besloten in 2018 "führe uns nicht in
        Versuchung" te houden.
      - Engels: katholiek "lead us not into temptation"; de oecumenische tekst
        (ELLC, 1988) "save us from the time of trial"; NRSV "do not bring us to
        the time of trial". Bij "the time of trial" denken veel uitleggers aan
        de grote beproeving aan het einde.
    - Verder: "verlos ons van de boze" (protestants) of "van het kwade"
      (katholiek): het Griekse woord kan allebei betekenen. En "schuld" of
      "schulden".
    - Bronnen: rkkerk.nl (invoering 2016), Kerknet en NRL (toelichting), NOS
      (verzet 2016), Catholic News Agency en America Magazine (paus Franciscus,
      dec 2017; Duitsland, jan 2018). Bij het schrijven ook de Franse en
      Italiaanse officiële documenten erbij nemen.
    - Als het artikel er staat: in het woordenboeklemma "Verzoeking" (en
      eventueel "Gebed") een <em>Zie ook</em> naar het artikel zetten. Het lemma
      noemt het Onzevader bewust niet (besloten 23 okt 2026): het artikel krijgt
      een eigen plek, zodat het niet herhaald of te kort behandeld wordt.
  - Artikel over ambt en priesterschap (aanleiding: Wie is wie, Priester en
    Oudste, 28 okt 2026):
    - In de katholieke en orthodoxe kerk is de priester gewijd; protestanten
      spreken van het priesterschap van alle gelovigen (1 Petrus 2:9). Elke
      traditie beschrijven vanuit wat zij zelf waardevol vindt.
    - Ons woord "priester" komt via het Latijn van het Griekse presbyteros,
      "oudste"; de tempelpriester heet in het Grieks hiereus.
    - In het Nieuwe Testament overlappen "oudste" en "opziener" (Titus 1:5-7);
      later ontwikkelden de kerken hun ambten verschillend (bisschop, priester,
      ouderling, diaken).
    - Het lemma "Priester" in Wie is wie bleef bewust ongewijzigd; als het
      artikel er staat, vanuit Priester, Oudste en Opziener ernaar verwijzen.
- **Mariapagina (kerken-katholiek-maria.html): de Tenhemelopneming en
  de Onbevlekte Ontvangenis.** Twee katholieke geloofspunten over Maria
  die nu ontbreken (aanvulling uit de ChatGPT-controle van 28 okt 2026).
  Nieuw werk, geen correctie: later uitschrijven, voorleggen en laten
  controleren.
- **Jaarlijks nalopen (veranderende gegevens):** zilverprijs (okt 2026: € 1,55 per gram) in
  Hoe leefden ze toen › Geld en in de woordenboeklemma's Denarie en Talent; het dagloon
  (€ 150–200); het aantal Samaritanen (Wie is wie); de tijden van zonsopgang en -ondergang
  (Tijd); en bij Talent de vraag "vijftien tot twintig jaar" of "zo'n twintig jaar".

## Controle door Magisterium en ChatGPT — nog te doen

- Voor ouders en begeleiders (voor-ouders.html), inclusief de uitleg over de
  bijbelteksten; moet blijven kloppen met kerken.html.
- De donatiepagina en bedankt-donatie.html.
- De metgezellenvragen (Hemeltrap-pool), als die nog niet langs
  Magisterium/ChatGPT zijn gegaan.
- Controle of er ergens nog "Gevorderd" staat naast "Advanced".

Al gedaan: Ontdekken (Woordenboek, Wie is wie, Hoe leefden ze toen, Verborgen
patronen, Verborgen Schat), de kerkenpagina's en de avatarteksten, afgerond 28
okt 2026.

## Groter werk: eigen webadressen voor de Ontdekken-artikelen

De artikelen en het woordenboek in de Ontdekken-hub zijn nu alleen bereikbaar
via JavaScript, in een overlay onder `index.html`. Ze hebben geen eigen
webadres. Daardoor kan Google ze niet of nauwelijks indexeren: er is geen URL om
naar te verwijzen en de tekst staat niet in de HTML die een crawler ophaalt.

Om vindbaar te worden op zoekopdrachten als "wat is een plengoffer" zouden die
artikelen eigen HTML-pagina's moeten worden, zoals de kerkpagina's dat al zijn.
Dat is bouwwerk, geen opschoning, en het staat los van de release van
1 oktober.

Zie het punt over het opnieuw indelen van de Ontdekken-hub, onder "Bouw en
gedrag van het spel": de artikel-`id` uit die indeling kan meteen als slug voor
zo'n latere URL dienen.

## Groter werk: Engelse versie later mogelijk maken

`lang/nl.js` bevat de UI-teksten al, dus die stap is gezet. Wat nog aan het
Nederlands vastzit:

1. **De vragenpools staan in `script.js`** en zijn niet vertaalbaar maar
   herschrijfbaar — ze hangen aan Nederlandse vertaalkeuzes.
2. **Boeknamen zijn tegelijk sleutel en weergave** (`vragenData`, `boekNaarKey`,
   bestandsnamen van trofeeën). Dat vraagt om een taalvrije sleutel met een
   aparte weergavenaam.
3. **De denominatielijn gaat uit van het Nederlandse kerklandschap** en werkt
   anders in het Engels.

Nu geen voorbereidend werk doen, wel de afspraak: **elke nieuwe structuur krijgt
een taalvrije id als sleutel en de zichtbare tekst in een apart veld.**

## Beveiliging en openbaarheid

- **Kunnen de werkbestanden via de site gedownload worden?** Testen in de
  browser of bijv. https://bijbelkidsquiz.nl/kladblok/wachtlijst.md, /CLAUDE.md
  en de .docx-bestanden in de hoofdmap te openen zijn. Zo ja: werkbestanden uit
  de gepubliceerde map halen (aparte map of privérepo, of Pages vanuit een
  aparte map laten publiceren). De code die de game zelf nodig heeft, is altijd
  via de browser in te zien; dat is eigen aan een website. Gesignaleerd 20
  oktober 2026, samen met een ICT'er. Getest 28 oktober 2026: ja, alle vier
  (wachtlijst.md, CLAUDE.md, de .docx, controleer-consistentie.py) gaven 200.
  robots.txt schermt niets af en noemt /kladblok/ zelfs met naam. Oplossen samen
  met het punt over de privérepo.
- **GitHub-repo privé zetten (onderzoeken, nog niet doen).** Nu zijn de
  werkbestanden en de hele geschiedenis voor iedereen leesbaar. GitHub Pages
  vanuit een privérepo vereist een betaald GitHub-abonnement (Pro of hoger). Bij
  de overstap ook de regel in CLAUDE.md onder "Commits" bijwerken ("De
  repository is openbaar"). De git-geschiedenis nooit verwijderen of
  herschrijven: die is het bewijs van auteurschap. Gesignaleerd 20 oktober 2026.
- **Tweestapsverificatie op het GitHub-account controleren.** Wie het account
  overneemt, kan de live site aanpassen. GitHub → Settings → Password and
  authentication. Gesignaleerd 28 oktober 2026.
- **Kleine punten van de ICT'er.** Bij de controle van 28 oktober 2026 vond hij
  de aanpak goed, met een paar kleine punten voor later. Die nog bij Roel
  opvragen en hier uitschrijven.
