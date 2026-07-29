# -*- coding: utf-8 -*-
"""
maak-vragen-export.py — bouwt vragen-export.md opnieuw op uit script.js.

Waarom een eigen parser en geen node: node staat op de werk-pc niet op PATH,
en we willen geen extra afhankelijkheid voor een leeshulpje. Daarom leest dit
script de JS-literalen zelf in met een kleine recursive-descent parser die
strings, commentaar en geneste objecten/arrays aankan.

Geexporteerd worden:
  1. vragenData          — de gewone boekenpools (boek -> niveau -> vragen)
  2. verborgenSchatVragen— losse pool, staat bewust buiten vragenData
  3. metgezellenVragen   — losse pool, staat bewust buiten vragenData

Draaien:
    python maak-vragen-export.py
"""

import io
import os
import re
import sys
from datetime import datetime

HIER = os.path.dirname(os.path.abspath(__file__))
BRON = os.path.join(HIER, "script.js")
DOEL = os.path.join(HIER, "vragen-export.md")

# Losse pools die bewust buiten vragenData staan. Naam in script.js -> kopje.
LOSSE_POOLS = [
    ("verborgenSchatVragen", "Verborgen Schat",
     "Losse pool voor de Verborgen Schat. Staat buiten vragenData en komt dus "
     "niet in de gewone boekenrondes voor."),
    ("metgezellenVragen", "De Metgezellen",
     "Losse pool met bewust extreem moeilijke naamvragen. Staat buiten "
     "vragenData zodat ze niet naar de schatkisten lekken; nog niet aan de UI "
     "gekoppeld."),
]


class ParseFout(Exception):
    """Opgeworpen zodra er iets niet te parsen valt — nooit stil overslaan."""


# ---------------------------------------------------------------------------
#  Mini-parser voor JS-literalen
# ---------------------------------------------------------------------------

class JSParser:
    def __init__(self, bron):
        self.s = bron
        self.i = 0

    # -- hulp ---------------------------------------------------------------

    def positie(self, i=None):
        """Regel:kolom van een index, voor bruikbare foutmeldingen."""
        i = self.i if i is None else i
        regel = self.s.count("\n", 0, i) + 1
        kolom = i - (self.s.rfind("\n", 0, i) + 1)
        return "regel %d, kolom %d" % (regel, kolom + 1)

    def fout(self, boodschap):
        fragment = self.s[self.i:self.i + 60].replace("\n", "\\n")
        raise ParseFout("%s (%s) bij: %s" % (boodschap, self.positie(), fragment))

    def spring_wit(self):
        """Whitespace en commentaar overslaan."""
        while self.i < len(self.s):
            c = self.s[self.i]
            if c in " \t\r\n":
                self.i += 1
            elif self.s.startswith("//", self.i):
                eind = self.s.find("\n", self.i)
                self.i = len(self.s) if eind == -1 else eind + 1
            elif self.s.startswith("/*", self.i):
                eind = self.s.find("*/", self.i + 2)
                if eind == -1:
                    self.fout("niet-afgesloten blokcommentaar")
                self.i = eind + 2
            else:
                return

    def verwacht(self, teken):
        self.spring_wit()
        if self.i >= len(self.s) or self.s[self.i] != teken:
            self.fout("'%s' verwacht" % teken)
        self.i += 1

    def kijk(self):
        self.spring_wit()
        return self.s[self.i] if self.i < len(self.s) else ""

    # -- waarden ------------------------------------------------------------

    def lees_waarde(self):
        c = self.kijk()
        if c == "{":
            return self.lees_object()
        if c == "[":
            return self.lees_array()
        if c in "\"'`":
            return self.lees_string()
        if c == "-" or c.isdigit():
            return self.lees_getal()
        m = re.compile(r"(true|false|null|undefined)\b").match(self.s, self.i)
        if m:
            self.i = m.end()
            return {"true": True, "false": False}.get(m.group(1))
        self.fout("onbekende waarde")

    def lees_string(self):
        aanhaal = self.s[self.i]
        start = self.i
        self.i += 1
        uit = []
        while True:
            if self.i >= len(self.s):
                self.i = start
                self.fout("niet-afgesloten string")
            c = self.s[self.i]
            if c == "\\":
                volgende = self.s[self.i + 1]
                simpel = {"n": "\n", "t": "\t", "r": "\r", "b": "\b",
                          "f": "\f", "v": "\v", "0": "\0"}
                if volgende == "u":
                    if self.s[self.i + 2] == "{":
                        eind = self.s.index("}", self.i)
                        uit.append(chr(int(self.s[self.i + 3:eind], 16)))
                        self.i = eind + 1
                    else:
                        uit.append(chr(int(self.s[self.i + 2:self.i + 6], 16)))
                        self.i += 6
                elif volgende == "x":
                    uit.append(chr(int(self.s[self.i + 2:self.i + 4], 16)))
                    self.i += 4
                elif volgende == "\n":
                    self.i += 2                      # regelvervolg
                elif volgende in simpel:
                    uit.append(simpel[volgende])
                    self.i += 2
                else:
                    uit.append(volgende)             # \" \' \\ \` enz.
                    self.i += 2
                continue
            if aanhaal == "`" and c == "$" and self.s[self.i + 1:self.i + 2] == "{":
                self.i = start
                self.fout("template-literal met ${...} kan niet statisch gelezen worden")
            if c == aanhaal:
                self.i += 1
                return "".join(uit)
            uit.append(c)
            self.i += 1

    def lees_getal(self):
        m = re.compile(r"-?\d+(\.\d+)?([eE][+-]?\d+)?").match(self.s, self.i)
        if not m:
            self.fout("ongeldig getal")
        self.i = m.end()
        tekst = m.group(0)
        return float(tekst) if ("." in tekst or "e" in tekst.lower()) else int(tekst)

    def lees_array(self):
        self.verwacht("[")
        uit = []
        while True:
            if self.kijk() == "]":
                self.i += 1
                return uit
            uit.append(self.lees_waarde())
            if self.kijk() == ",":
                self.i += 1
            elif self.kijk() == "]":
                self.i += 1
                return uit
            else:
                self.fout("',' of ']' verwacht in array")

    def lees_object(self):
        self.verwacht("{")
        uit = {}
        while True:
            if self.kijk() == "}":
                self.i += 1
                return uit
            c = self.kijk()
            if c in "\"'`":
                sleutel = self.lees_string()
            elif c == "[":
                self.fout("berekende sleutel ([...]) wordt niet ondersteund")
            else:
                m = re.compile(r"[A-Za-z_$][\w$]*").match(self.s, self.i)
                if not m:
                    self.fout("sleutel verwacht in object")
                sleutel = m.group(0)
                self.i = m.end()
            self.verwacht(":")
            uit[sleutel] = self.lees_waarde()
            if self.kijk() == ",":
                self.i += 1
            elif self.kijk() == "}":
                self.i += 1
                return uit
            else:
                self.fout("',' of '}' verwacht in object")


# ---------------------------------------------------------------------------
#  Statements uit script.js halen
# ---------------------------------------------------------------------------

def lees_vragendata(bron, meldingen):
    """boek -> niveau -> lijst met vraagobjecten, in bronvolgorde."""
    pools = {}

    def voeg_toe(boek, niveau, vragen):
        pools.setdefault(boek, {}).setdefault(niveau, []).extend(vragen)

    # 1. de definitie zelf: const vragenData = { ... };
    m = re.search(r"^const vragenData = \{", bron, re.M)
    if not m:
        raise ParseFout("'const vragenData = {' niet gevonden in script.js")
    p = JSParser(bron)
    p.i = m.end() - 1
    for boek, niveaus in p.lees_object().items():
        if not isinstance(niveaus, dict):
            meldingen.append("vragenData['%s'] is geen object met niveaus" % boek)
            continue
        for niveau, vragen in niveaus.items():
            voeg_toe(boek, niveau, vragen)

    # 2. losse statements: vragenData["Boek"].niveau.push(...) of ["Boek"] = {...}
    for m in re.finditer(r"^vragenData\[", bron, re.M):
        p = JSParser(bron)
        p.i = m.end() - 1
        boek = None
        try:
            p.verwacht("[")
            boek = p.lees_string()
            p.verwacht("]")

            keten = []
            while p.kijk() == ".":
                p.i += 1
                mm = re.compile(r"[A-Za-z_$][\w$]*").match(p.s, p.i)
                if not mm:
                    p.fout("eigenschapsnaam verwacht na '.'")
                keten.append(mm.group(0))
                p.i = mm.end()

            if keten and keten[-1] == "push":
                niveau = keten[-2] if len(keten) >= 2 else None
                if niveau is None:
                    p.fout("push() zonder niveau in de keten")
                p.verwacht("(")
                while True:
                    if p.kijk() == ")":
                        p.i += 1
                        break
                    voeg_toe(boek, niveau, [p.lees_waarde()])
                    if p.kijk() == ",":
                        p.i += 1
            elif not keten:
                p.verwacht("=")
                waarde = p.lees_object()
                for niveau, vragen in waarde.items():
                    voeg_toe(boek, niveau, vragen)
            else:
                p.fout("onbekende vorm: vragenData[...].%s" % ".".join(keten))
        except ParseFout as e:
            meldingen.append("vragenData[%r] op %s: %s"
                             % (boek, p.positie(m.start()), e))
    return pools


def lees_losse_pool(bron, naam, meldingen):
    m = re.search(r"^const %s = \[" % re.escape(naam), bron, re.M)
    if not m:
        meldingen.append("pool '%s' niet gevonden in script.js" % naam)
        return []
    p = JSParser(bron)
    p.i = m.end() - 1
    try:
        return p.lees_array()
    except ParseFout as e:
        meldingen.append("pool '%s': %s" % (naam, e))
        return []


# ---------------------------------------------------------------------------
#  Controle en opmaak
# ---------------------------------------------------------------------------

LETTERS = "ABCDEFGH"


def controleer(v, herkomst, meldingen):
    """Inhoudelijke controle per vraag; geeft de waarschuwingen terug."""
    waarschuwingen = []
    if not isinstance(v, dict):
        meldingen.append("%s: vraagobject is geen object maar %s"
                         % (herkomst, type(v).__name__))
        return ["geen geldig vraagobject"]
    if not v.get("vraag"):
        waarschuwingen.append("vraagtekst ontbreekt")
    antwoorden = v.get("antwoorden")
    if not isinstance(antwoorden, list) or not antwoorden:
        waarschuwingen.append("antwoorden ontbreken")
    else:
        if len(antwoorden) != 4:
            waarschuwingen.append("%d antwoorden in plaats van 4" % len(antwoorden))
        if len(set(antwoorden)) != len(antwoorden):
            waarschuwingen.append("dubbele antwoordoptie")
        if v.get("correct") not in antwoorden:
            waarschuwingen.append("correct staat niet letterlijk in antwoorden")
    if not v.get("correct"):
        waarschuwingen.append("correct-veld ontbreekt")
    for w in waarschuwingen:
        meldingen.append("%s: %s" % (herkomst, w))
    return waarschuwingen


def schrijf_vraag(uit, nummer, v, waarschuwingen):
    kop = "**%d. %s**" % (nummer, v.get("vraag", "(geen vraagtekst)"))
    if waarschuwingen:
        kop += "  ⚠️ _%s_" % "; ".join(waarschuwingen)
    uit.append(kop)
    uit.append("")
    for j, a in enumerate(v.get("antwoorden") or []):
        letter = LETTERS[j] if j < len(LETTERS) else str(j + 1)
        merk = "  ✅ **(juist)**" if a == v.get("correct") else ""
        uit.append("- %s. %s%s" % (letter, a, merk))
    uit.append("")
    uitleg = v.get("uitleg")
    uit.append("- _Uitleg:_ %s" % (uitleg if uitleg else "**(GEEN UITLEG)**"))
    if v.get("reveal"):
        uit.append("- _Reveal:_ %s" % v["reveal"])
    if v.get("bijbelplaats"):
        uit.append("- _Bijbelplaats:_ %s" % v["bijbelplaats"])
    uit.append("")


def tel_vragen_in_bron(bron, notities):
    """
    Volledigheidscontrole: tel elk 'vraag:'-veld in de bron en lees de tekst met
    dezelfde parser. Velden die niet statisch te lezen zijn (template-literal met
    ${...}, bijv. de placeholder-generator) horen niet in de export en worden als
    notitie gemeld, niet als gemiste vraag. Zo blijft een echte misser zichtbaar.
    """
    statisch = 0
    for m in re.finditer(r"^\s*vraag:\s*", bron, re.M):
        p = JSParser(bron)
        p.i = m.end()
        try:
            p.lees_string()
            statisch += 1
        except ParseFout as e:
            regel = bron.count("\n", 0, m.start()) + 1
            notities.append("regel %d: vraagveld is dynamisch opgebouwd en hoort "
                            "niet in de export (%s)" % (regel, e))
    return statisch


def bouw_markdown(pools, losse, meldingen, notities, aantallen):
    nu = datetime.now().strftime("%d-%m-%Y %H:%M")
    uit = []
    uit.append("# Vragen-export — Bijbelkidsquiz")
    uit.append("")
    uit.append("> **AUTOMATISCH GEGENEREERD — NIET MET DE HAND BEWERKEN.**")
    uit.append("> Gemaakt door `maak-vragen-export.py` op %s uit `vragenData` en de "
               "losse pools in `script.js`." % nu)
    uit.append("> Wijzigingen in dit bestand gaan verloren bij de volgende export. "
               "Pas vragen aan in `script.js` en draai `python maak-vragen-export.py` "
               "opnieuw. Dit bestand staat in `.gitignore`.")
    uit.append("")
    uit.append("**Totaal: %d vragen** — %d in `vragenData`, %d in de pools daarbuiten."
               % (aantallen["totaal"], aantallen["vragenData"], aantallen["los"]))
    uit.append("")

    if meldingen:
        uit.append("## ⚠️ Meldingen bij deze export (%d)" % len(meldingen))
        uit.append("")
        for r in meldingen:
            uit.append("- %s" % r)
        uit.append("")
    else:
        uit.append("_Geen parse- of controlemeldingen: de export is compleet._")
        uit.append("")

    if notities:
        uit.append("## ℹ️ Notities (geen probleem)")
        uit.append("")
        for r in notities:
            uit.append("- %s" % r)
        uit.append("")

    uit.append("---")
    uit.append("")
    uit.append("# Deel 1 — Boekenpools (`vragenData`)")
    uit.append("")
    uit.append("_Dit zijn de vragen die in de gewone rondes langskomen._")
    uit.append("")

    for boek, niveaus in pools.items():
        uit.append("## %s" % boek)
        uit.append("")
        for niveau, vragen in niveaus.items():
            uit.append("### %s — %d vragen" % (niveau.capitalize(), len(vragen)))
            uit.append("")
            for i, v in enumerate(vragen, 1):
                schrijf_vraag(uit, i, v, controleer(
                    v, "%s/%s[%d]" % (boek, niveau, i - 1), []))
        uit.append("---")
        uit.append("")

    uit.append("# Deel 2 — Pools BUITEN `vragenData`")
    uit.append("")
    uit.append("_Let op: deze vragen horen **niet** bij een boek of niveau en komen "
               "niet in de gewone boekenrondes voor. Ze staan bewust apart in "
               "`script.js`._")
    uit.append("")

    for naam, kop, toelichting in LOSSE_POOLS:
        vragen = losse.get(naam, [])
        uit.append("## %s (`%s`) — %d vragen" % (kop, naam, len(vragen)))
        uit.append("")
        uit.append("_%s_" % toelichting)
        uit.append("")
        for i, v in enumerate(vragen, 1):
            schrijf_vraag(uit, i, v, controleer(v, "%s[%d]" % (naam, i - 1), []))
        uit.append("---")
        uit.append("")

    return "\n".join(uit) + "\n"


# ---------------------------------------------------------------------------

def main():
    with io.open(BRON, encoding="utf-8") as f:
        bron = f.read()

    meldingen = []
    pools = lees_vragendata(bron, meldingen)
    losse = {naam: lees_losse_pool(bron, naam, meldingen)
             for naam, _, _ in LOSSE_POOLS}

    # inhoudelijke controle (vult meldingen); de opmaak roept controleer()
    # nog eens aan met een wegwerplijst, puur voor de inline-waarschuwing.
    for boek, niveaus in pools.items():
        for niveau, vragen in niveaus.items():
            for i, v in enumerate(vragen):
                controleer(v, "%s/%s[%d]" % (boek, niveau, i), meldingen)
    for naam, vragen in losse.items():
        for i, v in enumerate(vragen):
            controleer(v, "%s[%d]" % (naam, i), meldingen)

    n_data = sum(len(v) for n in pools.values() for v in n.values())
    n_los = sum(len(v) for v in losse.values())
    aantallen = {"vragenData": n_data, "los": n_los, "totaal": n_data + n_los}

    notities = []
    verwacht = tel_vragen_in_bron(bron, notities)
    if verwacht != aantallen["totaal"]:
        meldingen.append(
            "VOLLEDIGHEID: de bron bevat %d statisch leesbare vraagvelden, maar er "
            "zijn er %d geexporteerd — er is iets gemist."
            % (verwacht, aantallen["totaal"]))

    markdown = bouw_markdown(pools, losse, meldingen, notities, aantallen)
    with io.open(DOEL, "w", encoding="utf-8", newline="\n") as f:
        f.write(markdown)

    # Console bewust zonder emoji: de Windows-console is geen UTF-8.
    print("Export geschreven naar %s" % DOEL)
    print("  vragenData        : %d vragen in %d boeken" % (n_data, len(pools)))
    for naam, _, _ in LOSSE_POOLS:
        print("  %-18s: %d vragen" % (naam, len(losse.get(naam, []))))
    print("  buiten vragenData : %d vragen" % n_los)
    print("  TOTAAL            : %d vragen" % aantallen["totaal"])
    print("  volledigheid      : %d verwacht uit de bron -> %s"
          % (verwacht, "OK" if verwacht == aantallen["totaal"] else "AFWIJKING"))
    if notities:
        print("  notities          : %d (dynamische vraagvelden, niet exporteerbaar)"
              % len(notities))
        for r in notities:
            print("    - %s" % r.encode("ascii", "replace").decode("ascii"))
    if meldingen:
        print("  meldingen         : %d (zie bovenaan de export)" % len(meldingen))
        for r in meldingen[:20]:
            print("    - %s" % r.encode("ascii", "replace").decode("ascii"))
        if len(meldingen) > 20:
            print("    ... en nog %d" % (len(meldingen) - 20))
    else:
        print("  meldingen         : geen")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ParseFout as e:
        print("PARSEFOUT — export afgebroken, script.js niet volledig te lezen:")
        print("  %s" % e)
        sys.exit(1)
