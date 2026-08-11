# -*- coding: utf-8 -*-
"""SJABLOON voor het toevoegen van een reeks woord-/begripsvragen aan script.js.

GEBRUIK
-------
1. Kopieer dit bestand naar toevoegen_reeksNN.py (NN = het nieuwe reeksnummer).
2. Vul REEKS, THEMA en BLOKKEN in.
3. Voer uit vanuit de projectmap (waar script.js staat).
4. Controleer het resultaat, draai controleer-consistentie.py, hoog de
   cache-buster in index.html op, commit, push.
5. Verwijder het gekopieerde script. Dit sjabloon blijft staan.

Het gekopieerde bestand wordt genegeerd door .gitignore (patroon
toevoegen_reeks*.py); dit sjabloon niet.

WAT HET SCRIPT BEWAAKT
----------------------
- Het anker (de kopregel van de vorige reeks) komt exact 1x voor.
- De nieuwe reeks bestaat nog niet; de vorige reeks bestaat wel.
- Elke boeksleutel bestaat werkelijk in script.js.
- Elke vraag heeft 4 unieke opties, met het juiste antwoord erbij.
- Geen enkele vraagtekst komt al elders in script.js voor.
- Regeleindes blijven LF; het schrijft niets weg als er iets niet klopt.

CONVENTIES DIE JE NIET MOET LOSLATEN
------------------------------------
- Gebruik in vraagteksten gewone rechte aanhalingstekens ("), geen
  typografische. De rest van de pool doet dat ook. json.dumps escapet ze zelf.
- Em-dash en de ellips zijn wel gewoon in gebruik en mogen.
- io.open met newline="" bij lezen en schrijven; anders zet Python op Windows
  stilletjes CRLF terug.
- Blokken komen VOOR de vorige reeks te staan, zodat de volgorde in het
  bestand aflopend blijft (NN, NN-1, NN-2, ...).
"""

import io
import json
import os
import re
import sys

PAD = "script.js"

# ---------------------------------------------------------------------
# INVULLEN: nummer van de nieuwe reeks en het nummer van de vorige.
# ---------------------------------------------------------------------
REEKS = 19
VORIGE_REEKS = 18

# Themabeschrijving, komt in de commentaarkop boven het blok.
# Kort houden; mag over twee regels.
THEMA_REGEL_1 = "recht en straf in het Nieuwe Testament"
THEMA_REGEL_2 = ""   # laat leeg als een regel genoeg is

# Het anker is de kopregel van de vorige reeks. Niet aanpassen zolang de
# kopregels dezelfde vorm houden.
ANKER = (
    "// =====================================================================\n"
    "// Woorden & begrippen uit de bijbeltekst zelf (reeks %d:\n" % VORIGE_REEKS
)

# ---------------------------------------------------------------------
# INVULLEN: de vragen, gegroepeerd per (boek, niveau).
#
# Boeksleutels moeten exact overeenkomen met wat in script.js staat, dus
# bijvoorbeeld "1 & 2 Tessalonicenzen" en "Brieven van Johannes".
# Niveaus: "beginner", "advanced" of "expert".
#
# Het veld uitleg is optioneel; laat het weg als er geen uitleg is.
# ---------------------------------------------------------------------
BLOKKEN = [
    ("VOORBEELDBOEK", "expert", [
        {
            "vraag": "Voorbeeldvraag met een woord tussen \"aanhalingstekens\"?",
            "antwoorden": [
                "Het juiste antwoord",
                "Een afleider uit dezelfde categorie",
                "Nog een afleider, aantoonbaar fout",
                "Een derde afleider, mag grappig zijn",
            ],
            "correct": "Het juiste antwoord",
            "bijbelplaats": "Boek 1:1",
            "uitleg": "Twee tot vier zinnen. Niet de vraag herhalen, wel iets toevoegen.",
        },
    ]),
]


# =====================================================================
# Vanaf hier hoeft niets aangepast te worden.
# =====================================================================

def fout(boodschap):
    print("AFGEBROKEN: " + boodschap)
    sys.exit(1)


def lengterangen(blokken):
    """Rapporteert op welke plaats het juiste antwoord staat als je de vier
    opties op lengte sorteert. Als rang 1 domineert, is het juiste antwoord
    systematisch de langste optie: een verklapper. Streef naar spreiding."""
    telling = {1: 0, 2: 0, 3: 0, 4: 0}
    uniek_langst = []
    for boek, niveau, vragen in blokken:
        for v in vragen:
            lengtes = sorted((len(a) for a in v["antwoorden"]), reverse=True)
            rang = lengtes.index(len(v["correct"])) + 1
            telling[rang] += 1
            if len(v["correct"]) == lengtes[0] and lengtes[0] != lengtes[1]:
                uniek_langst.append(v["vraag"][:55])
    return telling, uniek_langst


def main():
    if not os.path.exists(PAD):
        fout("script.js niet gevonden in " + os.getcwd())

    with io.open(PAD, "r", encoding="utf-8", newline="") as f:
        bron = f.read()

    # ---------------- guards op het bestand ----------------
    if "\r\n" in bron:
        fout("script.js bevat CRLF-regeleindes; verwacht LF.")
    if bron.count(ANKER) != 1:
        fout("anker (kopregel reeks %d) komt %d keer voor, verwacht 1."
             % (VORIGE_REEKS, bron.count(ANKER)))
    if "reeks %d" % REEKS in bron:
        fout("reeks %d staat al in het bestand." % REEKS)
    if "reeks %d" % VORIGE_REEKS not in bron:
        fout("reeks %d ontbreekt; het bestand is niet wat verwacht werd."
             % VORIGE_REEKS)

    # ---------------- guards op de vragen ----------------
    bestaande = set()
    for m in re.finditer(r'^\s*vraag:\s*(["\'])(.*)\1,\s*$', bron, re.M):
        bestaande.add(m.group(2).strip().lower())

    aantal = 0
    for boek, niveau, vragen in BLOKKEN:
        if 'vragenData["%s"] = {' % boek not in bron:
            fout("boeksleutel ontbreekt in script.js: %s" % boek)
        if niveau not in ("beginner", "advanced", "expert"):
            fout("onbekend niveau: %s" % niveau)
        for v in vragen:
            aantal += 1
            kop = v["vraag"][:60]
            if len(v["antwoorden"]) != 4:
                fout("geen 4 antwoorden bij: %s" % kop)
            if len(set(v["antwoorden"])) != 4:
                fout("dubbele antwoordoptie bij: %s" % kop)
            if v["correct"] not in v["antwoorden"]:
                fout("correct antwoord staat niet in de lijst bij: %s" % kop)
            if not v.get("bijbelplaats"):
                fout("bijbelplaats ontbreekt bij: %s" % kop)
            if v["vraag"].strip().lower() in bestaande:
                fout("deze vraag staat al in script.js: %s" % kop)
            if "\u201c" in v["vraag"] or "\u201d" in v["vraag"]:
                fout("typografische aanhalingstekens bij: %s" % kop)

    # ---------------- blok opbouwen ----------------
    def js(s):
        return json.dumps(s, ensure_ascii=False)

    streep = "// =====================================================================\n"
    delen = [streep, "// Woorden & begrippen uit de bijbeltekst zelf (reeks %d:\n" % REEKS]
    if THEMA_REGEL_2:
        delen.append("// %s\n" % THEMA_REGEL_1)
        delen.append("// %s)\n" % THEMA_REGEL_2)
    else:
        delen.append("// %s)\n" % THEMA_REGEL_1)
    delen.append(streep)

    for boek, niveau, vragen in BLOKKEN:
        delen.append('vragenData["%s"].%s.push(\n' % (boek, niveau))
        items = []
        for v in vragen:
            regels = [
                "    {",
                "        vraag: %s," % js(v["vraag"]),
                "        antwoorden: [%s]," % ", ".join(js(a) for a in v["antwoorden"]),
                "        correct: %s," % js(v["correct"]),
            ]
            if v.get("uitleg"):
                regels.append("        bijbelplaats: %s," % js(v["bijbelplaats"]))
                regels.append("        uitleg: %s" % js(v["uitleg"]))
            else:
                regels.append("        bijbelplaats: %s" % js(v["bijbelplaats"]))
            regels.append("    }")
            items.append("\n".join(regels))
        delen.append(",\n".join(items))
        delen.append("\n);\n\n")

    nieuw = bron.replace(ANKER, "".join(delen) + ANKER, 1)

    # ---------------- controle achteraf ----------------
    patroon = r'^\s*vraag: ["\']'
    voor = len(re.findall(patroon, bron, re.M))
    na = len(re.findall(patroon, nieuw, re.M))
    if na - voor != aantal:
        fout("verwacht +%d vragen, gevonden +%d." % (aantal, na - voor))
    if "\r\n" in nieuw:
        fout("er zijn CRLF-regeleindes ontstaan.")

    with io.open(PAD, "w", encoding="utf-8", newline="") as f:
        f.write(nieuw)

    print("Reeks %d toegevoegd." % REEKS)
    print("  vragen: %d -> %d" % (voor, na))
    print("  regels: %d -> %d" % (bron.count("\n"), nieuw.count("\n")))
    for boek, niveau, vragen in BLOKKEN:
        print("  %-26s %-9s +%d" % (boek, niveau, len(vragen)))

    telling, uniek = lengterangen(BLOKKEN)
    print("\n  Lengterang van het juiste antwoord (1 = langste optie):")
    print("    " + "  ".join("rang %d: %d" % (r, telling[r]) for r in (1, 2, 3, 4)))
    if uniek:
        print("  Let op, hier is het juiste antwoord de enige langste optie:")
        for k in uniek:
            print("    - " + k)
    print("\n  Vergeet niet: cache-buster in index.html ophogen "
          "(style.css, lang/nl.js, script.js samen; favicons niet).")


if __name__ == "__main__":
    main()
