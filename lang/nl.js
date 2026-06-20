// =========================
// lang/nl.js — Nederlandse labels
// Eerste taalbestand van het project; de rest van de app is voorlopig nog
// hardcoded Nederlands. Dit bestand zet teksten die we meertalig willen houden
// los van de logica/afbeeldingen, zodat er later een tweede taal naast kan.
//
// Nu: de korte boekafkortingen voor de NT-prijzenkast op scherm 2. Gekeyd op de
// `basis` van de trofee (de bestandsnaam-slug, zoals in de vitrineconfigs), niet
// op de localStorage-sleutel — zo kan de kast-renderer ze direct opzoeken via
// nis.basis. De volledige namen blijven in de Schatkamer/vitrineconfigs.
// =========================
const NL = {
    afkortingen: {
        "handelingen":         "Hand.",
        "romeinen":            "Rom.",
        "korintiers":          "1-2 Kor.",
        "galaten":             "Gal.",
        "efeziers":            "Ef.",
        "filippenzen":         "Fil.",
        "kolossenzen-filemon": "Kol. & Flm.",
        "tessalonicenzen":     "1-2 Tess.",
        "timoteus-titus":      "Tim. & Tit.",
        "hebreeen":            "Heb.",
        "jakobus":             "Jak.",
        "petrus-judas":        "Petr. & Jud.",
        "johannesbrieven":     "1-3 Joh.",
        "openbaring":          "Op."
    }
};
