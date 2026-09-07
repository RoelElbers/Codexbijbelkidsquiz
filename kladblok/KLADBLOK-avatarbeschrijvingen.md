# Avatarbeschrijvingen — compleet, tien van tien

*Genoteerd 07-09-2026, bijgewerkt dezelfde dag. Status: klaar voor invoer.
Vervangt de eerdere geparkeerde versie met alleen Rebekka en Debora.*

Korte introteksten bij de avatars. De set is nu compleet: alle tien de avatars
in `avatarNamen` (`script.js` r. 7196) hebben er een, dus de reden om te parkeren
— een halve set — is vervallen.

**Vorm:** één alinea per avatar, één concreet beeld, geen moraal aan het slot.
Geschreven voor kinderen van 10–12, neutrale formulering, geen confessioneel
gekleurde termen.

## Mozes — Exodus 3

Mozes hoedde de schapen van zijn schoonvader in de woestijn toen hij een struik
zag branden die maar niet opbrandde. Hij liep erheen om beter te kijken, en toen
klonk er een stem die hem bij zijn naam riep. Hij moest zijn sandalen uitdoen,
want de grond waar hij stond was heilig.

## Esther — Ester 4 en 5

Esther was koningin geworden, maar niemand aan het hof wist dat ze bij het Joodse
volk hoorde. Toen haar volk in gevaar kwam, moest ze naar de koning — ongevraagd,
en dat mocht niet. Drie dagen bereidde ze zich voor. Daarna trok ze haar mooiste
kleren aan en liep de troonzaal binnen.

## Judith — het boek Judit

Judith woonde in een stad die werd belegerd door een enorm leger. Het water
raakte op en de mensen wilden zich overgeven. Zij niet. Ze trok haar rouwkleren
uit, maakte zich mooi en liep de stadspoort uit, recht op het vijandelijke kamp
af — en redde haar stad. Haar verhaal staat in het boek Judit, dat je niet in
elke Bijbel vindt.

## Samuel — 1 Samuel 3

Samuel sliep in de tempel, vlak bij de lamp die de hele nacht bleef branden. Toen
hoorde hij zijn naam. Hij rende naar de oude priester Eli, maar die had niets
gezegd. Ga maar slapen, zei Eli. Het gebeurde nog een keer. En nog een keer. Toen
wist Eli genoeg: dit was God, die Samuel riep. Ga terug, zei hij, en als je het
weer hoort, zeg dan dat je luistert.

## Jozef — Genesis 37

Jozef was de lieveling van zijn vader en kreeg een prachtig kleed dat zijn broers
niet kregen. Bovendien had hij dromen. In de ene bogen de bundels graan van zijn
broers zich voor die van hem. In de andere bogen de zon, de maan en elf sterren
voor hem. Hij vertelde ze gewoon aan tafel, alsof het het nieuws van de dag was.
Zijn broers vonden dat niet grappig.

## Elia — 1 Koningen 17

Elia moest zich verstoppen bij een beek, ver van iedereen. Er groeide daar niets
en er woonde niemand. Toch kreeg hij elke ochtend en elke avond eten: raven
brachten hem brood en vlees, en uit de beek dronk hij. Tot op een dag de beek
droogviel, omdat het al lang niet meer geregend had.

## Ruth — Ruth 2

Ruth kwam als vreemdeling in een land waar ze niemand kende, samen met haar
schoonmoeder Noömi. Ze hadden niets. Dus ging Ruth het veld in om aren te rapen
die de maaiers hadden laten liggen — dat mocht, want zo hoorde het volgens de
wet. Ze werkte de hele dag, en de eigenaar van het veld merkte haar op.

## Maria — Lucas 1

Maria was een jonge vrouw en ze woonde in Nazaret, een dorp waar nooit iets
bijzonders gebeurde. Toen stond er een engel voor haar die zei dat ze een zoon
zou krijgen. Ze schrok en vroeg hoe dat kon. Het antwoord begreep ze niet
helemaal, maar ze zei toch ja.

## Debora — Rechters 4 en 5

Debora was rechter én profetes. Ze zat onder een palmboom tussen Rama en Betel,
en van heinde en ver kwamen mensen naar haar toe om hun ruzies te laten
beslechten. Toen het volk in het nauw zat, riep zij Barak op om op te trekken —
en na de overwinning zong ze het lied dat nog steeds in de Bijbel staat.

## Rebekka — Genesis 24

Bij de bron buiten de stad kwam Rebekka water halen, haar kruik op haar schouder.
Toen een vreemdeling om een slok vroeg, gaf ze hem te drinken én schepte ze water
voor al zijn kamelen — dorstige dieren die liters wegdrinken. Dat ene gebaar
veranderde haar hele leven: ze werd de vrouw van Isaak.

## Aandachtspunten

Bij **Judith** is het slot van het verhaal bewust weggelaten; dat is te heftig
voor deze leeftijd. De zin over het boek staat achteraan, zodat een kind eerst
weet wie ze is en pas daarna waar ze te vinden is.

Bij **Maria** staat bewust "ze woonde in Nazaret" en niet "uit Nazaret". Lucas 1
zegt alleen dat de engel daarheen werd gestuurd; over haar afkomst of waar ze
opgroeide staat niets in de Bijbel. Dat ze haar jeugd in de tempel in Jeruzalem
doorbracht komt uit het Protevangelium van Jakobus en hoort volgens de
plaatsingsregel niet in een gewone tekst thuis.

Bij **Samuel** loopt de herhaling — drie keer opstaan in het donker — bewust door
in de zinsbouw. Niet inkorten.

Bij uitbreiding naar nieuwe avatars dezelfde lengte en toon aanhouden.

## Wat er nog moet gebeuren voor invoer

De teksten zijn klaar, maar er is nog **geen plek in de code** waar ze terecht
kunnen. `avatarNamen` (`script.js` r. 7196) koppelt een sleutel alleen aan een
weergavenaam:

```js
const avatarNamen = {
    mozes: "Mozes",
    ...
};
```

Er is geen veld voor een beschrijving en geen scherm dat er een toont. Invoeren
betekent dus twee dingen: de teksten ergens in de data zetten — een tweede
object naast `avatarNamen`, of `avatarNamen` uitbreiden naar objecten met `naam`
en `beschrijving` — en beslissen wáár het kind ze te zien krijgt. Het
keuzescherm (`index.html`, de tien `.avatar-keuze-btn`) is de voor de hand
liggende plek, maar daar staat nu alleen een portret met een naam eronder, en
tien alinea's passen daar niet zomaar bij.
