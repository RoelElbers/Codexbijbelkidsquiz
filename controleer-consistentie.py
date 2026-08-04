# -*- coding: utf-8 -*-
"""
controleer-consistentie.py — bewaakt dat elk NT-boek in alle configbronnen
op dezelfde manier geregistreerd staat.

Waarom dit bestaat: één boek moet op zes plekken kloppen (boekNaarKey, een
vitrineconfig, boekenplanken, nt2Kast, NL.afkortingen en een vragenpool) en
niets bewaakte tot nu toe dat die met elkaar in de pas lopen. Zo kon
boekNaarKey een andere volgorde krijgen dan boekenplanken zonder dat er iets
piepte — dat was alleen met het blote oog te zien.

Dit script is READ-ONLY: het wijzigt geen enkel bestand en schrijft alleen een
rapport naar de terminal. Exitcode 1 zodra er een probleem is, anders 0.

Parseren gebeurt met de JS-parser uit maak-vragen-export.py (zelfde aanpak,
geen node nodig); die module wordt hier als bibliotheek ingeladen.

Draaien:
    python controleer-consistentie.py
"""

import io
import importlib.util
import os
import re
import sys

HIER = os.path.dirname(os.path.abspath(__file__))
SCRIPT_JS = os.path.join(HIER, "script.js")
NL_JS = os.path.join(HIER, "lang", "nl.js")
IMAGES = os.path.join(HIER, "images")

# ---------------------------------------------------------------------------
#  De parser uit maak-vragen-export.py hergebruiken
# ---------------------------------------------------------------------------
# Het bestand heeft koppeltekens in de naam en is dus niet met een gewone
# import te laden; via importlib kan het wel. De module heeft een
# __main__-guard, dus inladen voert de export NIET uit.

def _laad_exportmodule():
    pad = os.path.join(HIER, "maak-vragen-export.py")
    spec = importlib.util.spec_from_file_location("maak_vragen_export", pad)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


MVE = _laad_exportmodule()
JSParser = MVE.JSParser
ParseFout = MVE.ParseFout


# ---------------------------------------------------------------------------
#  Vaste kennis over de opzet van het spel
# ---------------------------------------------------------------------------

VITRINES = [
    "evangelienVitrine",
    "handelingenVitrine",
    "paulusbrievenVitrine",
    "algemeneBrievenVitrine",
    "openbaringVitrine",
]

# De vier evangeliën staan op scherm 1 (eigen kast) en horen daarom bewust
# NIET in boekenplanken, nt2Kast of NL.afkortingen. Zonder deze uitzondering
# zou controle 1 vier valse meldingen geven.
EVANGELIEN = ["Matteüs", "Marcus", "Lucas", "Johannes"]

# Handelingen en Openbaring zijn enkel-boek-groepen: een klik gaat via
# directBoekPerGroep rechtstreeks naar het boek, er is geen plank met een
# keuze. Ze horen dus wel in nt2Kast maar bewust niet in boekenplanken.
ZONDER_PLANK = ["Handelingen", "Openbaring"]

# Welke plank hoort bij welk deel van boekNaarKey (voor de volgordecontrole).
PLANKEN = ["paulus", "algemeen"]

NIVEAUS = ["beginner", "advanced", "expert"]
NIVEAU_LABEL = {"beginner": "beginner", "advanced": "gevorderd", "expert": "expert"}

STANDEN = ["brons", "zilver", "goud"]


# ---------------------------------------------------------------------------
#  Uitvoer
# ---------------------------------------------------------------------------

problemen = []
waarschuwingen = []


def schrijf(regel=""):
    """Printen dat ook overleeft op een Windows-console zonder UTF-8."""
    try:
        print(regel)
    except UnicodeEncodeError:
        print(regel.encode("ascii", "replace").decode("ascii"))


def kop(nummer, titel):
    schrijf()
    schrijf("=" * 78)
    schrijf("%d. %s" % (nummer, titel))
    schrijf("=" * 78)


def probleem(regel):
    problemen.append(regel)
    schrijf("  PROBLEEM     : %s" % regel)


def waarschuwing(regel):
    waarschuwingen.append(regel)
    schrijf("  WAARSCHUWING : %s" % regel)


def ok(regel):
    schrijf("  OK           : %s" % regel)


def info(regel):
    schrijf("  %s" % regel)


# ---------------------------------------------------------------------------
#  Bronnen inlezen
# ---------------------------------------------------------------------------

def lees_bestand(pad):
    with io.open(pad, encoding="utf-8") as f:
        return f.read()


def lees_literaal(bron, patroon, omschrijving):
    """Zoekt een declaratie en leest het object/array dat erop volgt."""
    m = re.search(patroon, bron, re.M)
    if not m:
        raise ParseFout("%s niet gevonden" % omschrijving)
    p = JSParser(bron)
    p.i = m.end() - 1
    return p.lees_waarde()


def lees_boeknaarkey(bron):
    return lees_literaal(bron, r"^const boekNaarKey = \{", "boekNaarKey")


def lees_vitrines(bron):
    uit = {}
    for naam in VITRINES:
        uit[naam] = lees_literaal(
            bron, r"^const %s = \{" % re.escape(naam), naam)
    return uit


def lees_boekenplanken(bron):
    return lees_literaal(bron, r"^const boekenplanken = \{", "boekenplanken")


def lees_nt2kast(bron):
    return lees_literaal(bron, r"^const nt2Kast = \{", "nt2Kast")


def lees_afkortingen(bron_nl):
    return lees_literaal(bron_nl, r"^\s*afkortingen: \{", "NL.afkortingen")


def kast_nissen(kast):
    """Alle nissen uit alle panelen/groepen, in bronvolgorde."""
    uit = []
    for paneel in kast.get("panelen", []):
        for groep in paneel.get("groepen", []):
            uit.extend(groep.get("nissen", []))
    return uit


def vitrine_nissen(vitrines):
    """[(vitrinenaam, nis), ...] over alle vitrines heen."""
    uit = []
    for naam in VITRINES:
        for nis in vitrines[naam].get("nissen", []):
            uit.append((naam, nis))
    return uit


# ---------------------------------------------------------------------------
#  Sleutel-/basisconventies
# ---------------------------------------------------------------------------
# boekNaarKey levert de slug met underscores (kolossenzen_filemon).
#   sleutel = "trofee_" + slug                 -> trofee_kolossenzen_filemon
#   basis   = slug met koppeltekens            -> kolossenzen-filemon
# Twee bewuste conventies, geen fout — dit script controleert alleen dat ze
# consequent worden toegepast.

def slug_naar_basis(slug):
    return slug.replace("_", "-")


def basis_naar_slug(basis):
    return basis.replace("-", "_")


def slug_naar_sleutel(slug):
    return "trofee_" + slug


# ---------------------------------------------------------------------------
#  1. Registratiematrix
# ---------------------------------------------------------------------------

def controle_registratie(boeknaarkey, vitrines, planken, kast, afkortingen, pools):
    kop(1, "Registratiematrix — staat elk boek in alle bronnen waar het hoort?")

    slug_naar_naam = dict((slug, naam) for naam, slug in boeknaarkey.items())
    basis_naar_naam = dict((slug_naar_basis(slug), naam)
                           for slug, naam in slug_naar_naam.items())

    # Per bron: welke boeknamen komen erin voor (plus wat er niet te herleiden is).
    in_vitrine, in_kast, in_plank, in_afk = set(), set(), set(), set()
    onbekend = []

    for vitrinenaam, nis in vitrine_nissen(vitrines):
        naam = basis_naar_naam.get(nis.get("basis"))
        if naam:
            in_vitrine.add(naam)
        else:
            onbekend.append("%s: nis met basis %r hoort bij geen enkel boek uit "
                            "boekNaarKey" % (vitrinenaam, nis.get("basis")))

    for nis in kast_nissen(kast):
        naam = basis_naar_naam.get(nis.get("basis"))
        if naam:
            in_kast.add(naam)
        else:
            onbekend.append("nt2Kast: nis met basis %r hoort bij geen enkel boek "
                            "uit boekNaarKey" % nis.get("basis"))

    for planknaam, plank in planken.items():
        for boek in plank.get("boeken", []):
            naam = basis_naar_naam.get(boek.get("id"))
            if naam:
                in_plank.add(naam)
            else:
                onbekend.append("boekenplanken.%s: boek met id %r hoort bij geen "
                                "enkel boek uit boekNaarKey"
                                % (planknaam, boek.get("id")))

    for basis in afkortingen:
        naam = basis_naar_naam.get(basis)
        if naam:
            in_afk.add(naam)
        else:
            onbekend.append("NL.afkortingen: %r hoort bij geen enkel boek uit "
                            "boekNaarKey" % basis)

    in_pool = set(naam for naam in pools if naam in boeknaarkey)
    for naam in pools:
        if naam not in boeknaarkey:
            onbekend.append("vragenData['%s'] staat niet in boekNaarKey" % naam)

    # Verwachting per boek per bron.
    kolommen = ["boekNaarKey", "vragenData", "vitrine", "boekenplank",
                "nt2Kast", "afkorting"]
    breedte = max(len(n) for n in boeknaarkey) + 2

    schrijf("  %-*s %s" % (breedte, "boek",
                           " ".join("%-12s" % k for k in kolommen)))
    schrijf("  " + "-" * (breedte + 13 * len(kolommen)))

    for naam in boeknaarkey:
        evangelie = naam in EVANGELIEN
        verwacht = {
            "boekNaarKey": True,
            "vragenData": True,
            "vitrine": True,
            "boekenplank": not evangelie and naam not in ZONDER_PLANK,
            "nt2Kast": not evangelie,
            "afkorting": not evangelie,
        }
        aanwezig = {
            "boekNaarKey": True,
            "vragenData": naam in in_pool,
            "vitrine": naam in in_vitrine,
            "boekenplank": naam in in_plank,
            "nt2Kast": naam in in_kast,
            "afkorting": naam in in_afk,
        }
        cellen = []
        for k in kolommen:
            if aanwezig[k] and verwacht[k]:
                cellen.append("ja")
            elif not aanwezig[k] and not verwacht[k]:
                cellen.append("n.v.t.")
            elif verwacht[k]:
                cellen.append("ONTBREEKT")
            else:
                cellen.append("ONVERWACHT")
        schrijf("  %-*s %s" % (breedte, naam,
                               " ".join("%-12s" % c for c in cellen)))

    schrijf()
    fouten = 0
    for naam in boeknaarkey:
        evangelie = naam in EVANGELIEN
        verwacht = {
            "vragenData": True,
            "vitrine": True,
            "boekenplank": not evangelie and naam not in ZONDER_PLANK,
            "nt2Kast": not evangelie,
            "afkorting": not evangelie,
        }
        aanwezig = {
            "vragenData": naam in in_pool,
            "vitrine": naam in in_vitrine,
            "boekenplank": naam in in_plank,
            "nt2Kast": naam in in_kast,
            "afkorting": naam in in_afk,
        }
        for bron in verwacht:
            if verwacht[bron] and not aanwezig[bron]:
                probleem("'%s' staat wel in boekNaarKey maar ontbreekt in %s"
                         % (naam, bron))
                fouten += 1
            elif not verwacht[bron] and aanwezig[bron]:
                probleem("'%s' staat in %s terwijl dat niet de bedoeling is"
                         % (naam, bron))
                fouten += 1

    for regel in onbekend:
        probleem(regel)
        fouten += 1

    if not fouten:
        ok("%d boeken, alle zes bronnen lopen in de pas." % len(boeknaarkey))
    info("Uitzonderingen die bewust zijn ingebouwd:")
    info("  - de evangelien (%s) staan op scherm 1 en horen niet in "
         "boekenplanken, nt2Kast of afkortingen" % ", ".join(EVANGELIEN))
    info("  - %s zijn enkel-boek-groepen (directBoekPerGroep) en hebben geen "
         "plank" % " en ".join(ZONDER_PLANK))


# ---------------------------------------------------------------------------
#  2. Volgordecontrole
# ---------------------------------------------------------------------------

def controle_volgorde(boeknaarkey, planken):
    kop(2, "Volgorde — loopt boekNaarKey gelijk met de boekenplanken?")

    basis_naar_naam = dict((slug_naar_basis(slug), naam)
                           for naam, slug in boeknaarkey.items())

    for planknaam in PLANKEN:
        plank = planken.get(planknaam)
        if plank is None:
            probleem("boekenplanken.%s bestaat niet" % planknaam)
            continue

        plank_namen = []
        for boek in plank.get("boeken", []):
            naam = basis_naar_naam.get(boek.get("id"))
            plank_namen.append(naam if naam else "?%s" % boek.get("id"))

        # Dezelfde boeken, maar in de volgorde van boekNaarKey.
        selectie = set(plank_namen)
        sleutel_namen = [n for n in boeknaarkey if n in selectie]

        titel = plank.get("titel", planknaam)
        if sleutel_namen == plank_namen:
            ok("%s (%s): dezelfde volgorde in beide bronnen (%d boeken)"
               % (planknaam, titel, len(plank_namen)))
        else:
            probleem("%s (%s): boekNaarKey en boekenplanken.%s staan in een "
                     "andere volgorde" % (planknaam, titel, planknaam))
            schrijf("      boekNaarKey        : %s" % " | ".join(sleutel_namen))
            schrijf("      boekenplanken.%-6s: %s"
                    % (planknaam, " | ".join(plank_namen)))
            for i, (a, b) in enumerate(zip(sleutel_namen, plank_namen), 1):
                if a != b:
                    schrijf("      positie %d: boekNaarKey heeft '%s', de plank "
                            "heeft '%s'" % (i, a, b))


# ---------------------------------------------------------------------------
#  3. Naamconventies
# ---------------------------------------------------------------------------

def controle_naamconventies(boeknaarkey, vitrines, kast):
    kop(3, "Naamconventies — sleutel met underscores, basis met koppeltekens")

    slugs = set(boeknaarkey.values())
    gecontroleerd = 0
    fouten = 0

    bronnen = [(naam, nis) for naam, nis in vitrine_nissen(vitrines)]
    bronnen += [("nt2Kast", nis) for nis in kast_nissen(kast)]

    for bronnaam, nis in bronnen:
        sleutel = nis.get("sleutel")
        basis = nis.get("basis")
        gecontroleerd += 1

        slug = basis_naar_slug(basis) if basis else None
        if slug not in slugs:
            probleem("%s: basis %r is niet te herleiden tot een waarde in "
                     "boekNaarKey" % (bronnaam, basis))
            fouten += 1
            continue

        verwachte_sleutel = slug_naar_sleutel(slug)
        if sleutel != verwachte_sleutel:
            probleem("%s: sleutel %r hoort %r te zijn (boekNaarKey-waarde %r)"
                     % (bronnaam, sleutel, verwachte_sleutel, slug))
            fouten += 1

        verwachte_basis = slug_naar_basis(slug)
        if basis != verwachte_basis:
            probleem("%s: basis %r hoort %r te zijn (boekNaarKey-waarde %r)"
                     % (bronnaam, basis, verwachte_basis, slug))
            fouten += 1

        if "-" in sleutel:
            probleem("%s: sleutel %r bevat een koppelteken; sleutels gebruiken "
                     "underscores" % (bronnaam, sleutel))
            fouten += 1
        if "_" in basis:
            probleem("%s: basis %r bevat een underscore; basissen gebruiken "
                     "koppeltekens" % (bronnaam, basis))
            fouten += 1

    if not fouten:
        ok("%d nissen gecontroleerd; sleutel en basis volgen overal de "
           "conventie." % gecontroleerd)


# ---------------------------------------------------------------------------
#  4. Afkortingen
# ---------------------------------------------------------------------------

def controle_afkortingen(kast, afkortingen):
    kop(4, "Afkortingen — alleen de kast (scherm 2) heeft ze nodig")

    nodig = []
    for nis in kast_nissen(kast):
        if nis.get("basis") not in nodig:
            nodig.append(nis["basis"])

    fouten = 0
    for basis in nodig:
        if basis not in afkortingen:
            probleem("nt2Kast gebruikt basis %r, maar NL.afkortingen heeft er "
                     "geen afkorting voor" % basis)
            fouten += 1

    for basis in afkortingen:
        if basis not in nodig:
            probleem("NL.afkortingen bevat %r (%r), maar die basis komt niet in "
                     "nt2Kast voor" % (basis, afkortingen[basis]))
            fouten += 1

    info("nodig volgens nt2Kast : %d" % len(nodig))
    info("aanwezig in NL        : %d" % len(afkortingen))
    if not fouten:
        ok("sluitend — geen ontbrekende en geen overbodige afkortingen.")
        info("De vitrines in de Schatkamer tonen de volledige naam en hebben "
             "dus geen afkorting nodig.")


# ---------------------------------------------------------------------------
#  5. Afbeeldingsbestanden
# ---------------------------------------------------------------------------

def controle_afbeeldingen(vitrines, kast, planken):
    kop(5, "Afbeeldingen — trofeeplaten en boekcovers")

    # Welke standen een basis nodig heeft, hangt af van de vitrine waar hij bij
    # hoort. Vitrines met kleurViaFilter: true laden altijd de zilveren plaat en
    # kleuren brons/goud via CSS-filters (zie de toelichting bovenaan de
    # vitrineconfigs in script.js); die hebben dus maar één bestand nodig.
    # Zonder die uitzondering meldt deze controle tientallen bestanden die
    # bewust niet bestaan.
    standen_per_basis = {}
    for vitrinenaam, nis in vitrine_nissen(vitrines):
        filter_aan = bool(vitrines[vitrinenaam].get("kleurViaFilter"))
        standen_per_basis[nis["basis"]] = (["zilver"] if filter_aan else STANDEN)

    # Kast-nissen erven de standen van hun vitrine; een basis die alleen in de
    # kast staat, wordt volledig gecontroleerd.
    for nis in kast_nissen(kast):
        standen_per_basis.setdefault(nis["basis"], STANDEN)

    ontbreekt = 0
    gecontroleerd = 0
    via_filter = 0
    for basis in sorted(standen_per_basis):
        standen = standen_per_basis[basis]
        if standen == ["zilver"]:
            via_filter += 1
        for stand in standen:
            bestand = "%s-%s.webp" % (basis, stand)
            gecontroleerd += 1
            if not os.path.isfile(os.path.join(IMAGES, bestand)):
                probleem("images/%s ontbreekt" % bestand)
                ontbreekt += 1

    info("trofeeplaten gecontroleerd : %d (voor %d basissen)"
         % (gecontroleerd, len(standen_per_basis)))
    info("waarvan kleurViaFilter     : %d basissen; die hebben alleen "
         "-zilver.webp nodig" % via_filter)

    covers = 0
    for planknaam, plank in planken.items():
        for boek in plank.get("boeken", []):
            pad = boek.get("cover")
            if not pad:
                continue
            covers += 1
            vol = os.path.join(HIER, pad.replace("/", os.sep))
            if not os.path.isfile(vol):
                probleem("boekenplanken.%s: cover %s ontbreekt"
                         % (planknaam, pad))
                ontbreekt += 1
    info("boekcovers gecontroleerd   : %d" % covers)

    if not ontbreekt:
        ok("alle verwachte afbeeldingen staan in images/.")


# ---------------------------------------------------------------------------
#  6. Vragentelling (informatief)
# ---------------------------------------------------------------------------

def controle_vragen(boeknaarkey, pools):
    kop(6, "Vragentelling per boek (informatief)")

    breedte = max(len(n) for n in boeknaarkey) + 2
    schrijf("  %-*s %10s %10s %10s %10s" % (breedte, "boek", "beginner",
                                            "gevorderd", "expert", "totaal"))
    schrijf("  " + "-" * (breedte + 44))

    eind = dict((n, 0) for n in NIVEAUS)
    eindtotaal = 0
    leeg = []

    for naam in boeknaarkey:
        niveaus = pools.get(naam, {})
        rij = []
        totaal = 0
        for niveau in NIVEAUS:
            aantal = len(niveaus.get(niveau, []))
            rij.append(aantal)
            totaal += aantal
            eind[niveau] += aantal
            if aantal == 0:
                leeg.append((naam, NIVEAU_LABEL[niveau]))
        eindtotaal += totaal
        schrijf("  %-*s %10d %10d %10d %10d"
                % (breedte, naam, rij[0], rij[1], rij[2], totaal))

        onbekend = [n for n in niveaus if n not in NIVEAUS]
        if onbekend:
            waarschuwing("'%s' heeft een onbekend niveau: %s"
                         % (naam, ", ".join(sorted(onbekend))))

    schrijf("  " + "-" * (breedte + 44))
    schrijf("  %-*s %10d %10d %10d %10d"
            % (breedte, "TOTAAL", eind["beginner"], eind["advanced"],
               eind["expert"], eindtotaal))
    schrijf()
    info("%d vragen over %d boeken." % (eindtotaal, len(boeknaarkey)))

    for naam, niveau in leeg:
        waarschuwing("'%s' heeft geen enkele vraag op %s" % (naam, niveau))
    if not leeg:
        ok("elk boek heeft vragen op alle drie de niveaus.")


# ---------------------------------------------------------------------------

def main():
    schrijf("Consistentiecontrole boekregistratie — Bijbelkidsquiz")
    schrijf("Read-only: dit script wijzigt niets, het rapporteert alleen.")

    bron = lees_bestand(SCRIPT_JS)
    bron_nl = lees_bestand(NL_JS)

    boeknaarkey = lees_boeknaarkey(bron)
    vitrines = lees_vitrines(bron)
    planken = lees_boekenplanken(bron)
    kast = lees_nt2kast(bron)
    afkortingen = lees_afkortingen(bron_nl)

    parsemeldingen = []
    pools = MVE.lees_vragendata(bron, parsemeldingen)

    schrijf()
    schrijf("Bronnen ingelezen:")
    schrijf("  boekNaarKey    : %d boeken" % len(boeknaarkey))
    schrijf("  vitrines       : %d configs, %d nissen"
            % (len(vitrines), len(vitrine_nissen(vitrines))))
    schrijf("  boekenplanken  : %d planken, %d boeken"
            % (len(planken), sum(len(p.get("boeken", [])) for p in planken.values())))
    schrijf("  nt2Kast        : %d panelen, %d nissen"
            % (len(kast.get("panelen", [])), len(kast_nissen(kast))))
    schrijf("  NL.afkortingen : %d" % len(afkortingen))
    schrijf("  vragenData     : %d boeken" % len(pools))

    for melding in parsemeldingen:
        waarschuwing("parser: %s" % melding)

    controle_registratie(boeknaarkey, vitrines, planken, kast, afkortingen, pools)
    controle_volgorde(boeknaarkey, planken)
    controle_naamconventies(boeknaarkey, vitrines, kast)
    controle_afkortingen(kast, afkortingen)
    controle_afbeeldingen(vitrines, kast, planken)
    controle_vragen(boeknaarkey, pools)

    schrijf()
    schrijf("=" * 78)
    schrijf("SAMENVATTING")
    schrijf("=" * 78)
    schrijf("  problemen      : %d" % len(problemen))
    schrijf("  waarschuwingen : %d" % len(waarschuwingen))
    if problemen:
        schrijf()
        schrijf("  De boekregistratie loopt niet in de pas. Losse punten:")
        for regel in problemen:
            schrijf("    - %s" % regel)
        return 1
    schrijf()
    schrijf("  Schoon: elk boek staat overal geregistreerd zoals bedoeld.")
    return 0


if __name__ == "__main__":
    try:
        sys.exit(main())
    except ParseFout as e:
        schrijf("PARSEFOUT — controle afgebroken, een config is niet te lezen:")
        schrijf("  %s" % e)
        sys.exit(1)
