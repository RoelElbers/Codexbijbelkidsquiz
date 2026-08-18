# Projectinstructies — Bijbelkidsquiz

Vaste conventies van dit project. Volg ze zonder er per sessie naar te vragen.

## Commits

- **Geen `Co-Authored-By`-trailer.** Deze repository gebruikt die conventie niet.
  Voeg hem aan geen enkele commit toe.
- **Rechtstreeks op `main`.** Geen feature-branches, geen pull requests.
- **Eén milestone per commit.** Niet meerdere losse wijzigingen samen.
- Schrijf het commitbericht naar een tijdelijk bestand en gebruik
  `git commit -F <bestand>`, zodat er geen editor nodig is.

## Cache-buster in `index.html`

`style.css`, `lang/nl.js` en `script.js` dragen **samen één nummer** en gaan
**altijd samen omhoog**, ook als er maar één van de drie is gewijzigd. Nooit per
bestand ophogen, nooit terug in nummer. Lees de huidige stand uit `index.html`
zelf (regel 22 voor de stylesheet, onderaan `<body>` voor de twee scripts).

De favicons in `icons/` hebben een **eigen teller** en staan hier los van; die
niet meebumpen.

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
