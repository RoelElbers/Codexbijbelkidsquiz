# -*- coding: utf-8 -*-
"""
maak-kist-export.py — bouwt kist-export.md opnieuw op uit script.js.

Waarom naast maak-vragen-export.py nog een export: vragen-export.md toont de
vragen per boek, en dat is precies de context die een kind bij een schatkist
NIET heeft. In de kist komen alle boeken door elkaar. Een vraag die "deze
brief" zegt leest daar ineens als een raadsel — of de boeknaam verklapt het
antwoord zodra je hem erbij zet. Dit bestand laat de kistpool zien zoals de
speler hem krijgt: op volgorde, zonder boekkoppen, met de herkomst pas ONDER
de vraag. Zo kun je nalezen of een vraag op zichzelf staat.

De drie secties volgen de drie kisten:
    brons  -> beginner
    zilver -> advanced
    goud   -> expert

Dit script bouwt dezelfde pool als alleVragenVoorNiveau() in script.js: boek
voor boek in de volgorde van vragenData, en vragen met `kist: false` blijven
eruit. Wijkt de JS-kant ooit af, dan klopt deze export niet meer.

Parseren gebeurt met de JS-parser uit maak-vragen-export.py; die module wordt
hier als bibliotheek ingeladen, net als in controleer-consistentie.py. Geen
node nodig en geen tweede kopie van de parser die uit de pas kan gaan lopen.

Dit script schrijft ALLEEN kist-export.md (staat in .gitignore) en raakt
script.js niet aan.

Draaien:
    python maak-kist-export.py
"""

import io
import importlib.util
import os
import sys
from datetime import datetime

HIER = os.path.dirname(os.path.abspath(__file__))
BRON = os.path.join(HIER, "script.js")
DOEL = os.path.join(HIER, "kist-export.md")


# ---------------------------------------------------------------------------
#  De parser uit maak-vragen-export.py hergebruiken
# ---------------------------------------------------------------------------
# Koppeltekens in de bestandsnaam maken een gewone import onmogelijk; via
# importlib lukt het wel. De module heeft een __main__-guard, dus inladen
# voert de vragenexport NIET uit.

def _laad_exportmodule():
    pad = os.path.join(HIER, "maak-vragen-export.py")
    spec = importlib.util.spec_from_file_location("maak_vragen_export", pad)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


MVE = _laad_exportmodule()
ParseFout = MVE.ParseFout
LETTERS = MVE.LETTERS

# (stand, niveausleutel in script.js, kopje) — de volgorde van de secties.
KISTEN = [
    ("Brons", "beginner", "De bronzen kist"),
    ("Zilver", "advanced", "De zilveren kist"),
    ("Goud", "expert", "De gouden kist"),
]

KIST_VELD = "kist"


# ---------------------------------------------------------------------------
#  De kistpool samenstellen
# ---------------------------------------------------------------------------

def hoort_in_kist(vraag):
    """Spiegelt `v.kist !== false` uit alleVragenVoorNiveau().

    Bewust net zo streng als de JS-kant: alleen exact de boolean false houdt
    een vraag buiten de pool. Een string "false" doet dus gewoon mee, precies
    zoals in het spel — controle 8 van controleer-consistentie.py piept
    daarover, hier volgen we simpelweg wat de browser doet.
    """
    return vraag.get(KIST_VELD) is not False


def bouw_pool(pools, niveau, meldingen):
    """(boek, vraagobject) voor één niveau, in de volgorde van vragenData."""
    uit = []
    overgeslagen = 0
    for boek in pools:
        vragen = pools[boek].get(niveau, [])
        for i, vraag in enumerate(vragen):
            if not isinstance(vraag, dict):
                meldingen.append("%s/%s[%d]: vraagobject is geen object maar %s"
                                 % (boek, niveau, i, type(vraag).__name__))
                continue
            if not hoort_in_kist(vraag):
                overgeslagen += 1
                continue
            uit.append((boek, vraag))
    return uit, overgeslagen


# ---------------------------------------------------------------------------
#  Opmaak
# ---------------------------------------------------------------------------

def schrijf_vraag(uit, nummer, boek, niveau, vraag):
    """Vraag eerst, herkomst pas eronder — zie de toelichting bovenaan."""
    uit.append("**%d. %s**" % (nummer, vraag.get("vraag", "(geen vraagtekst)")))
    uit.append("")
    for j, antwoord in enumerate(vraag.get("antwoorden") or []):
        letter = LETTERS[j] if j < len(LETTERS) else str(j + 1)
        merk = "  ✅ **(juist)**" if antwoord == vraag.get("correct") else ""
        uit.append("- %s. %s%s" % (letter, antwoord, merk))
    uit.append("")
    plaats = vraag.get("bijbelplaats") or "(geen bijbelplaats)"
    uit.append("_Herkomst: %s · %s · %s_" % (boek, niveau, plaats))
    uit.append("")


def bouw_markdown(secties, meldingen, buiten_totaal):
    nu = datetime.now().strftime("%d-%m-%Y %H:%M")
    uit = []
    uit.append("# Kist-export — Bijbelkidsquiz")
    uit.append("")
    uit.append("> **AUTOMATISCH GEGENEREERD — NIET MET DE HAND BEWERKEN.**")
    uit.append("> Gemaakt door `maak-kist-export.py` op %s uit `vragenData` in "
               "`script.js`." % nu)
    uit.append("> Wijzigingen in dit bestand gaan verloren bij de volgende "
               "export. Pas vragen aan in `script.js` en draai "
               "`python maak-kist-export.py` opnieuw. Dit bestand staat in "
               "`.gitignore`.")
    uit.append("")
    uit.append("_Dit is de pool zoals `alleVragenVoorNiveau()` hem samenstelt: "
               "alle boeken achter elkaar in de volgorde van `vragenData`, "
               "zonder boekkoppen ertussen. De herkomst staat bewust ONDER de "
               "vraag, zodat je de vraag eerst leest zoals een kind hem in de "
               "kist krijgt — als hij dan niet te volgen is, hoort hij daar "
               "niet._")
    uit.append("")
    uit.append("**Pools:** " + " · ".join(
        "%s (%s) %d vragen" % (stand.lower(), niveau, len(pool))
        for stand, niveau, _, pool, _ in secties))
    uit.append("")
    uit.append("%d vragen dragen `kist: false` en staan hier dus niet in; die "
               "blijven wel gewoon in de boekmodus." % buiten_totaal)
    uit.append("")

    if meldingen:
        uit.append("## ⚠️ Meldingen bij deze export (%d)" % len(meldingen))
        uit.append("")
        for regel in meldingen:
            uit.append("- %s" % regel)
        uit.append("")
    else:
        uit.append("_Geen parse- of controlemeldingen: de export is compleet._")
        uit.append("")

    for stand, niveau, kopje, pool, overgeslagen in secties:
        uit.append("---")
        uit.append("")
        uit.append("# %s — %s (`%s`)" % (stand, kopje, niveau))
        uit.append("")
        uit.append("**%d vragen in deze pool.**%s"
                   % (len(pool),
                      "" if not overgeslagen
                      else "  _(%d overgeslagen met `kist: false`.)_"
                           % overgeslagen))
        uit.append("")
        for i, (boek, vraag) in enumerate(pool, 1):
            schrijf_vraag(uit, i, boek, niveau, vraag)

    return "\n".join(uit) + "\n"


# ---------------------------------------------------------------------------

def main():
    with io.open(BRON, encoding="utf-8") as f:
        bron = f.read()

    meldingen = []
    pools = MVE.lees_vragendata(bron, meldingen)

    secties = []
    for stand, niveau, kopje in KISTEN:
        pool, overgeslagen = bouw_pool(pools, niveau, meldingen)
        secties.append((stand, niveau, kopje, pool, overgeslagen))

    buiten_totaal = sum(s[4] for s in secties)

    # Volledigheidscontrole: wat we exporteren plus wat we bewust overslaan
    # hoort samen precies de vragenData-telling van dit niveau te zijn.
    for stand, niveau, _, pool, overgeslagen in secties:
        in_data = sum(len(pools[boek].get(niveau, [])) for boek in pools)
        if len(pool) + overgeslagen != in_data:
            meldingen.append(
                "VOLLEDIGHEID: %s (%s) telt %d in de pool + %d overgeslagen, "
                "maar vragenData heeft er %d op dit niveau."
                % (stand, niveau, len(pool), overgeslagen, in_data))

    markdown = bouw_markdown(secties, meldingen, buiten_totaal)
    with io.open(DOEL, "w", encoding="utf-8", newline="\n") as f:
        f.write(markdown)

    # Console bewust zonder emoji: de Windows-console is geen UTF-8.
    print("Kist-export geschreven naar %s" % DOEL)
    for stand, niveau, _, pool, overgeslagen in secties:
        print("  %-7s (%-9s): %d vragen%s"
              % (stand.lower(), niveau, len(pool),
                 "" if not overgeslagen
                 else "  (%d overgeslagen met kist: false)" % overgeslagen))
    print("  TOTAAL             : %d vragen in de drie kisten"
          % sum(len(s[3]) for s in secties))
    if meldingen:
        print("  meldingen          : %d (zie bovenaan de export)" % len(meldingen))
        for regel in meldingen[:20]:
            print("    - %s" % regel.encode("ascii", "replace").decode("ascii"))
        if len(meldingen) > 20:
            print("    ... en nog %d" % (len(meldingen) - 20))
    else:
        print("  meldingen          : geen")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ParseFout as e:
        print("PARSEFOUT — export afgebroken, script.js niet volledig te lezen:")
        print("  %s" % e)
        sys.exit(1)
