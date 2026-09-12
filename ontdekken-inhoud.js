/* ============================================================================
   ontdekken-inhoud.js — de teksten van de Ontdekken-hub
   ----------------------------------------------------------------------------
   Alleen inhoud, geen logica. De rubriekenstructuur staat in script.js
   (ontdekRubrieken); dit bestand levert de blokken waar die naar verwijst.
   Wordt vóór script.js ingeladen en draagt hetzelfde cache-busternummer als
   style.css, lang/nl.js en script.js.

   Twee vormen:

     lexicon   een lijst { term, uitleg[, bijbelplaats] }
               bijbelplaats is optioneel en ontbreekt nu overal.

     artikel   een lijst getypeerde blokken; elk blok rendert op een bestaande
               CSS-klasse, dus er is geen nieuwe opmaak nodig:
                 { kader: "…" }   .naslag-kadertje
                 { kop:   "…" }   h3.naslag-kop
                 { item:  "…" }   p.naslag-item   (mag inline HTML bevatten)
                 { noot:  "…" }   p.naslag-noot
                 { tabel: { koppen: […], rijen: [[…]] } }   table.naslag-tabel
   ========================================================================== */

/* eslint-disable no-unused-vars */

// --- Woorden: het woordenboek (44 termen, alfabetisch) ----------------------
const ONTDEK_WOORDENBOEK = [
    { term: "Allerheiligste", uitleg: "Het meest heilige, afgesloten deel binnen in de tempel. Volgens de traditie was God daar zelf aanwezig, en alleen de hogepriester mocht er binnen." },
    { term: "Altaar", uitleg: "Een verhoogde plek, vaak van steen, waar offers aan God werden gebracht." },
    { term: "Apostel", uitleg: "Het woord betekent \"gezant\" of \"boodschapper\", van het Griekse <em>apostolos</em>: iemand die wordt uitgezonden. In de oudheid was een apostel geen gewone postbode, maar een officiële afgezant — zoals een ambassadeur — die namens een koning op pad ging; zijn woorden golden als de woorden van de koning zelf. In het Nieuwe Testament koos Jezus twaalf van zijn leerlingen (discipelen) uit en zond hen uit om zijn boodschap te verspreiden en zieken te genezen; vanaf dat moment waren zij zijn apostelen. In de eerste kerk werd de eis zelfs strenger: een echte apostel moest Jezus tijdens zijn leven hebben meegemaakt én hem na zijn dood weer levend hebben gezien. Eén beroemde uitzondering is Paulus: hij had de levende Jezus nooit ontmoet, maar noemde zich tóch apostel, omdat de opgestane Jezus hém — volgens zijn eigen verhaal, in een visioen op weg naar Damascus — persoonlijk had uitgekozen en uitgezonden." },
    { term: "Bekering", uitleg: "Je leven omdraaien: stoppen met de verkeerde kant op gaan en kiezen om het goede te doen, en zo bij God gaan horen. Je kunt het zien als een ommekeer van 180 graden — je loopt letterlijk de andere kant op. In de Bijbel hoort daar vaak spijt bij over wat je fout deed, en het verlangen om opnieuw te beginnen." },
    { term: "Discipel", uitleg: "Een leerling van Jezus die met hem meetrok en van hem leerde. \"Discipel\" en \"leerling\" betekenen hetzelfde. Jezus had veel discipelen; uit die grote groep koos hij een kleinere groep apostelen die hij eropuit stuurde." },
    { term: "Eeuwig leven", uitleg: "Leven dat nooit ophoudt, samen met God — ook na de dood." },
    { term: "Evangelie", uitleg: "Het woord betekent \"goed nieuws\". Het zijn ook de vier boeken die het leven van Jezus vertellen: Matteüs, Marcus, Lucas en Johannes. Elke schrijver kreeg later zijn eigen symbool — de mens, de leeuw, de stier en de adelaar — precies de tekens die je in dit spel als trofee kunt verdienen." },
    { term: "Farizeeër", uitleg: "Iemand uit een Joodse groep die het heel serieus nam om precies volgens Gods regels te leven, tot in de kleinste details. Op zich knap, maar in de evangeliën botsen de farizeeën vaak met Jezus: volgens hem ging het hun te veel om de regels en te weinig om de mensen daarachter." },
    { term: "Gelijkenis", uitleg: "Een kort verhaaltje dat Jezus vertelde om iets groots uit te leggen met iets gewoons. Door over schapen, zaadjes of een verloren muntje te vertellen, maakte hij een diepe les ineens begrijpelijk. Het bekendste voorbeeld is misschien wel het verhaal van de verloren zoon." },
    { term: "Gemeente", uitleg: "In de Bijbel is een gemeente de groep christenen die in één stad bij elkaar hoort, bijvoorbeeld \"de gemeente in Filippi\". Er waren toen nog geen kerkgebouwen: de mensen kwamen gewoon bij elkaar thuis. Vandaag gebruiken christenen hier twee woorden voor. Sommige groepen noemen zich een kerk — bijvoorbeeld de Katholieke Kerk, de Protestantse Kerk of de Orthodoxe Kerk. Andere groepen noemen zich een gemeente — bijvoorbeeld evangelische gemeenten, baptistengemeenten en pinkstergemeenten. Allebei is goed. Het gaat namelijk niet om het gebouw of om de naam, maar om de mensen die samen bij Jezus horen. En dat zijn ze allemaal. <em>Zie ook: kerk.</em>" },
    { term: "Genade", uitleg: "Iets goeds krijgen wat je niet verdiend hebt; onverdiende vriendelijkheid. Het is een cadeau, geen beloning — je hoeft er niets voor te presteren. In de Bijbel gaat het vaak over Gods genade: dat hij goed is voor mensen, ook als ze het niet \"verdiend\" hebben." },
    { term: "Heiden", uitleg: "In de Bijbel: iemand die niet bij het Joodse volk hoorde en de God van Israël (nog) niet kende — het betekent gewoon \"niet-Jood\". Het was geen scheldwoord, gewoon een aanduiding. Bijzonder is dat Jezus juist ook heidenen hielp — iets wat veel mensen toen verbaasde." },
    { term: "Heilige Geest", uitleg: "De Heilige Geest is God zelf: de derde persoon van de Drie-eenheid. Christenen geloven in één God in drie personen — de Vader, de Zoon (Jezus) en de Heilige Geest — die samen tóch één God zijn. De Heilige Geest werkt in mensen: hij geeft moed en troost en helpt hen om dichter bij God te leven. Je kunt hem niet zien, net zomin als je de wind ziet, maar je merkt wel wat hij doet." },
    { term: "Hemelvaart", uitleg: "Het moment waarop Jezus, na zijn opstanding, omhoogging naar de hemel en niet langer op aarde bij zijn leerlingen bleef. Christenen herdenken dit op Hemelvaartsdag — voor veel kinderen ook gewoon een vrije donderdag." },
    { term: "Hogepriester", uitleg: "De belangrijkste priester, een soort baas van de tempel in Jeruzalem. Hij mocht als enige, en maar één keer per jaar, in het meest heilige deel van de tempel komen." },
    { term: "Kerk", uitleg: "Het woord kerk betekent twee dingen. Het is het gebouw waar christenen samenkomen. Maar het is vooral de groep mensen zelf: de kerk zijn de christenen, niet de stenen. In het Grieks, de taal waarin het Nieuwe Testament is geschreven, staat er <span class=\"grieks\">ἐκκλησία</span> (<em>ekklèsia</em>). Dat betekent letterlijk \"de groep die bij elkaar geroepen is\" — van <em>ek</em> (\"uit\") en <em>kaleō</em> (\"roepen\"). In een Griekse stad was de <em>ekklèsia</em> de vergadering van alle burgers, die met een roep bijeen werd geroepen. Paulus gebruikt datzelfde woord voor de christenen: mensen die door God bij elkaar geroepen zijn. In onze Bijbel wordt <em>ekklèsia</em> soms vertaald met \"gemeente\" en soms met \"kerk\" — het is dus hetzelfde woord. Ons woord kerk komt van een ánder Grieks woord: <span class=\"grieks\">κυριακόν</span> (<em>kuriakon</em>). Dat betekent \"wat van de Heer is\", van <em>kurios</em>, \"Heer\". Toen de christenen na een paar honderd jaar eigen gebouwen kregen om in samen te komen, noemden ze zo'n gebouw het <em>kuriakon</em>: het huis van de Heer. Dat woord reisde mee naar het noorden van Europa en werd daar kerk — en ook het Duitse <em>Kirche</em> en het Engelse <em>church</em>. Grappig genoeg had het Grieks dus twee woorden: <em>ekklèsia</em> voor de mensen en <em>kuriakon</em> voor het gebouw. Wij hebben daar één woord van gemaakt. Als je \"kerk\" zegt, kun je dus allebei bedoelen — en meestal bedoelen we de mensen. <em>Zie ook: gemeente.</em>" },
    { term: "Koninkrijk van God", uitleg: "Niet een land dat je op de kaart kunt aanwijzen, maar een manier om te zeggen: daar waar God de koning is en alles goed en eerlijk gaat. Jezus sprak er heel vaak over. Soms heet het ook \"het hemelrijk\" of \"het koninkrijk der hemelen\"." },
    { term: "Kruisiging", uitleg: "Een wrede Romeinse straf waarbij iemand aan een kruis werd vastgemaakt. Jezus werd op deze manier ter dood gebracht." },
    { term: "Martelaar", uitleg: "Iemand die aan zijn geloof vasthoudt, zelfs als hij daarvoor gedood wordt. Stefanus was de eerste in de vroege kerk." },
    { term: "Messias", uitleg: "Een Hebreeuws woord dat \"de gezalfde\" betekent: iemand die met olie gezalfd werd als teken dat God hem uitkoos, zoals vroeger bij koningen. De Messias is de beloofde redder op wie het volk lang wachtte. Christenen geloven dat Jezus die Messias is. In het Grieks heet \"de gezalfde\" trouwens \"Christus\" — dus Messias en Christus betekenen precies hetzelfde, alleen in een andere taal." },
    { term: "Offer", uitleg: "Iets waardevols dat je aan God geeft. Vroeger was dat vaak een dier, dat op het altaar in de tempel werd gebracht." },
    { term: "Openbaring", uitleg: "Iets wat God laat zien of bekendmaakt dat mensen uit zichzelf niet konden weten. Het is ook de naam van het laatste boek van de Bijbel." },
    { term: "Opstanding", uitleg: "Weer levend worden na de dood. Het bekendste voorbeeld is Jezus, die volgens de evangeliën op de derde dag na zijn dood weer opstond — dat vieren christenen met Pasen. Het is het grote keerpunt waar de evangeliën naartoe werken." },
    { term: "Pasen (Pesach)", uitleg: "Pesach is het Joodse feest waarop het volk viert dat God hen lang geleden uit de slavernij in Egypte bevrijdde. Jezus vierde dit feest ook. Voor christenen kreeg Pasen er later een tweede betekenis bij: het feest van Jezus' opstanding." },
    { term: "Profeet", uitleg: "Iemand die namens God spreekt. Geen waarzegger met een glazen bol: een profeet voorspelt niet zomaar wat er gaat gebeuren, maar roept de mensen vooral op om naar God te luisteren — ook als ze dat liever niet horen. Een waarschuwing is meestal een laatste kans om het anders te doen. Toen de profeet Jona aankondigde dat de stad Nineve zou vergaan, kregen de inwoners spijt en veranderden ze hun leven — en toen liet God het onheil niet doorgaan. Dat laat zien dat God het aangekondigde onheil eigenlijk niet wíl: liever ziet hij dat mensen veranderen. (Jona baalde daar trouwens flink van.)" },
    { term: "Rechtvaardig", uitleg: "Eerlijk en betrouwbaar; iemand die anderen eerlijk behandelt en leeft zoals God het bedoelt." },
    { term: "Sabbat", uitleg: "De vaste rustdag in de week, voor Joden de zaterdag. Op die dag werkten de mensen niet, maar namen ze tijd voor God en voor rust. Er waren strenge regels over wat wel en niet mocht — zo streng zelfs dat sommigen vonden dat Jezus de regels overtrad toen hij op de sabbat iemand beter maakte." },
    { term: "Sadduceeën", uitleg: "Een groep voorname Joden, vaak priesters, rond de tempel. Ze geloofden niet in een opstanding uit de dood — en daarin verschilden ze juist van de farizeeën." },
    { term: "Schriftgeleerde", uitleg: "Een echte kenner van de heilige boeken: iemand die ze van buiten kende en aan anderen uitlegde, een beetje als een professor van de Bijbel van toen. Schriftgeleerden hadden veel aanzien en kwamen in de evangeliën vaak in gesprek — en in discussie — met Jezus." },
    { term: "Stadhouder", uitleg: "Een bestuurder die namens de Romeinse keizer de baas was over een gebied. Pontius Pilatus was de stadhouder over Judea." },
    { term: "Synagoge", uitleg: "Het gebouw waar Joodse mensen bij elkaar kwamen om te bidden, te leren en uit de heilige boeken te lezen. Anders dan de tempel was er niet één synagoge, maar stond er in bijna elk dorp en elke stad een. Jezus kwam er vaak en leerde er de mensen." },
    { term: "Tempel", uitleg: "Het grote, heilige gebouw in Jeruzalem waar de mensen God vereerden. Let op het verschil met een synagoge: synagogen stonden in elk dorp, maar dé tempel was er maar één. In de geschiedenis waren er eigenlijk twee. De eerste werd rond 960 v.Chr. gebouwd door koning Salomo en in 586 v.Chr. verwoest door de Babyloniërs. De tweede werd na de ballingschap herbouwd — voltooid rond 515 v.Chr., onder leiding van Zerubbabel — en eeuwen later door koning Herodes enorm vergroot en verfraaid; dát is de tempel uit Jezus' tijd. In het jaar 70 n.Chr. verwoestten de Romeinen ook die. Zou er ooit een nieuwe tempel komen, dan zou dat dus de derde tempel zijn." },
    { term: "Tollenaar", uitleg: "Een belastingontvanger die geld ophaalde voor de Romeinse bezetters. Veel mensen zagen hem als een verrader, en hij rekende vaak stiekem een beetje te veel — handig voor zijn eigen portemonnee. Toch koos Jezus er één als leerling uit: Matteüs, die later zelfs een evangelie schreef." },
    { term: "Vasten", uitleg: "Een tijd lang niet of veel minder eten, om je aandacht helemaal op God te richten." },
    { term: "Verbond", uitleg: "Een bijzondere, plechtige afspraak tussen God en de mensen — sterker dan een gewone belofte, meer als een blijvende band. De Bijbel vertelt over verschillende verbonden, bijvoorbeeld met Noach en met Abraham. Jezus sprak bij het Laatste Avondmaal over een \"nieuw verbond\"." },
    { term: "Vergeving", uitleg: "Niet boos blijven over iets wat verkeerd is gedaan, maar het loslaten en opnieuw beginnen." },
    { term: "Verkondigen", uitleg: "Het goede nieuws over God en Jezus aan mensen vertellen, zodat zo veel mogelijk mensen het horen." },
    { term: "Verzoeking", uitleg: "De aandrang om iets te doen waarvan je diep vanbinnen weet dat het niet goed is." },
    { term: "Wet (de Wet)", uitleg: "De regels die God volgens de Bijbel via Mozes aan het volk Israël gaf, zoals de Tien Geboden. Met \"de Wet\" worden soms ook de eerste boeken van de Bijbel bedoeld, waarin die regels staan. Joden in Jezus' tijd hechtten er veel waarde aan om volgens de Wet te leven." },
    { term: "Wonder", uitleg: "Iets bijzonders dat je niet op een gewone manier kunt verklaren, en dat laat zien hoe groot Gods kracht is. In de evangeliën doet Jezus veel wonderen: hij maakt zieken beter, stilt een storm en geeft blinden hun zicht terug. Een wonder is in de Bijbel meestal ook een teken: het wil iets duidelijk maken." },
    { term: "Zaligspreking", uitleg: "Een van de uitspraken van Jezus die begint met \"Gelukkig zijn zij die…\", over wie het bij God écht goed heeft. Jezus sprak ze uit tijdens een beroemde toespraak op een berg, de Bergrede. Vaak draaien ze de gewone verwachting om: juist wie het moeilijk heeft, wordt gelukkig genoemd." },
    { term: "Zegenen", uitleg: "Iemand namens God het goede toewensen, vaak met woorden of met een hand op het hoofd." },
    { term: "Zendeling", uitleg: "Iemand die op reis gaat, vaak ver van huis, om anderen over Jezus te vertellen. Paulus was zo iemand." },
    { term: "Zonde", uitleg: "Alles wat stukgaat tussen mensen onderling en tussen mensen en God: iets verkeerds doen, tegen wat goed is en tegen wat God wil. Het oude woord betekent eigenlijk \"je doel missen\" — alsof je met een pijl op de roos mikt en er net naast schiet." },
];

// --- Hoe leefden ze toen ----------------------------------------------------
// Het kadertje dat vroeger boven het hele Maten-scherm stond; nu één keer,
// als inleiding boven de drie onderwerpen.
const ONTDEK_HOE_INLEIDING = "Sommige maten kennen we vrij precies, andere niet — dan zeggen we dat er eerlijk bij. En oud geld omrekenen naar euro's van nu is eigenlijk niet te doen, want toen was alles anders. Daarom rekenen we vaak in \"daglonen\": wat een gewone arbeider op één dag verdiende.";

const ONTDEK_GELD = [
    { kop: "Geld in de Bijbel" },
    { noot: "Reken je dit heel ruw om naar Nederland in 2026, met een flinke marge, dan kom je ongeveer op de bedragen hieronder — uitgaand van een dagloon van zo'n 150 à 200 euro. Exacte bedragen zijn het niet, maar ze geven je wel een idee." },
    { item: "<span class=\"naslag-term\">Romeins geld</span> — het geld van de keizer" },
    { item: "<span class=\"naslag-term\">Denarie</span> — € 150 à 200, het loon voor één hele dag werken. Naar zilver: ongeveer € 7. Een zilveren muntje van vier gram met het hoofd van de keizer erop. Jezus vroeg om zo'n munt toen Hem gevraagd werd of je belasting moest betalen (Matteüs 22:19). In de gelijkenis van de arbeiders krijgt iedereen er één voor een dag werken (Matteüs 20:2). Kijk eens naar het verschil tussen die twee bedragen: het zilver in de munt is bijna niets waard, maar je verdiende er wél een hele dag mee." },
    { item: "<span class=\"naslag-term\">As</span> — € 10 à 12, een zestiende dagloon, ongeveer een half uur werken. Voor één as kocht je twee mussen, en tóch vergeet God er geen enkele van (Matteüs 10:29). In het Grieks heet deze munt assarion. In veel Bijbels staat \"stuiver\" of \"duit\"." },
    { item: "<span class=\"naslag-term\">Quadrans</span> — € 2 à 3, een vierenzestigste dagloon, ongeveer tien minuten werken (Matteüs 5:26)." },
    { item: "<span class=\"naslag-term\">Lepton</span> — € 1 à 2, een honderdachtentwintigste dagloon. Het allerkleinste muntje dat er bestond. De arme weduwe gaf er twee, en Jezus zei dat zij het meeste had gegeven (Marcus 12:42, Lucas 21:2). Twee lepta zijn samen precies een quadrans. In oudere Nederlandse Bijbels heet dit muntje een penning. Maar diezelfde Bijbels noemen ook de denarie een penning, en de quadrans, en het muntje waarvoor je twee mussen kocht. Dat komt doordat penning daar geen naam van één munt is, maar gewoon 'geldstuk' betekent — een keuze die vierhonderd jaar geleden goed te begrijpen was, omdat de vertalers de muntnamen gebruikten die hun lezers kenden. In de kanttekeningen leggen ze er netjes bij uit wat elke munt waard was. Alleen wie de kanttekening niet leest, denkt al snel dat het overal om kleingeld gaat." },
    { item: "<span class=\"naslag-term\">Grieks geld</span> — het geld van de handel" },
    { item: "<span class=\"naslag-term\">Drachme</span> — € 150 à 200, ongeveer één dagloon. Naar zilver: ongeveer € 8. Bijna hetzelfde waard als een denarie. De vrouw die haar tiende drachme kwijtraakt, keert daarvoor haar hele huis om (Lucas 15:8)." },
    { item: "<span class=\"naslag-term\">Didrachme</span> — € 300 à 400, twee daglonen. Naar zilver: ongeveer € 16. Twee drachmen, en precies het bedrag van de tempelbelasting (Matteüs 17:24)." },
    { item: "<span class=\"naslag-term\">Stater</span> — € 600 à 800, vier daglonen. Naar zilver: ongeveer € 30. Petrus vond er een in de bek van een vis, genoeg voor de tempelbelasting van hen beiden (Matteüs 17:27)." },
    { item: "<span class=\"naslag-term\">Pond</span> — € 15.000 à 20.000, honderd daglonen: ruim drie maanden werken. Naar zilver: ongeveer € 800. Tien dienaren krijgen er elk één om mee te handelen (Lucas 19:13). In het Grieks heet dit een mina." },
    { item: "<span class=\"naslag-term\">Talent</span> — € 900.000 à 1,2 miljoen, zesduizend daglonen. Naar zilver: ongeveer € 48.000. De allergrootste geldmaat. Daar zou een arbeider vijftien tot twintig jaar voor moeten werken. Als gewicht aan zilver of goud was een talent ongeveer 33 kilo (van zo'n 20 tot 40 kilo). In de gelijkenis van de onbarmhartige dienaar is iemand tienduizend talenten schuldig (Matteüs 18:24). Dat is met opzet een onmogelijk bedrag: je zou er tweehonderdduizend jaar voor moeten werken." },
    { item: "<span class=\"naslag-term\">Tempelgeld</span> — geld apart" },
    { item: "Iedere volwassen man betaalde één keer per jaar een halve sikkel voor de tempel. Die regel staat al in het Oude Testament (Exodus 30:13). In de tijd van Jezus was dat bedrag twee daglonen: € 300 à 400. In het Nieuwe Testament heet die belasting daarom de didrachme — twee drachmen (Matteüs 17:24)." },
    { item: "Maar betalen mocht niet met gewone Romeinse munten: daar stond het hoofd van de keizer op, en die hoorde niet in de tempel. Daarom zaten er geldwisselaars op het tempelplein, en daarom kon je er niet omheen (Matteüs 21:12)." },
    { item: "Wat de Bijbel er niet bij zegt: met wélk geld er dan wél betaald werd. Archeologen hebben ontdekt dat het meestal zilvergeld uit de stad Tyrus was, omdat dat het zuiverste zilver had. Maar die naam staat niet in de Bijbel zelf." },
];

const ONTDEK_MATEN = [
    { kop: "Lengte" },
    { item: "<span class=\"naslag-term\">El</span> — ongeveer 45 centimeter, zo lang als de afstand van je elleboog tot je vingertoppen. Daar komt de naam vandaan. Omdat niet iedereen even lange armen heeft, was hij niet overal precies gelijk." },
    { item: "<span class=\"naslag-term\">Stadie</span> — een afstandsmaat van ongeveer 185 meter. Emmaüs lag zo'n zestig stadiën van Jeruzalem: ruim elf kilometer." },
    { item: "<span class=\"naslag-term\">Mijl</span> — de Romeinse mijl was ongeveer 1.500 meter (anderhalve kilometer), oorspronkelijk duizend dubbele passen van een soldaat. Jezus zei: als iemand je dwingt één mijl mee te gaan, ga er dan twee." },
    { kop: "Inhoud" },
    { noot: "Hier weten we het minder zeker: er bestond geen officiële standaard, en de potten en vaten van toen waren niet allemaal even groot." },
    { item: "<span class=\"naslag-term\">Vat</span> — ongeveer 22 liter, zoiets als een flinke emmer. Sommige geleerden komen hoger uit." },
    { item: "<span class=\"naslag-term\">Kor</span> — de grootste inhoudsmaat: tien vaten, dus ongeveer 220 liter. In Nederlandse Bijbels staat op die plaats meestal 'zakken'." },
    { item: "<span class=\"naslag-term\">Seah</span> — een derde van een vat, zo'n 7 liter, al lopen de schattingen uiteen. Drie seah meel was genoeg om voor een heleboel mensen brood te bakken." },
    { item: "<span class=\"naslag-term\">Korenmaat</span> — een bak of mand waar ongeveer negen liter graan in kon, zoiets als een flinke emmer. Jezus zei dat je een lamp niet ónder de korenmaat zet, maar erop, zodat iedereen het licht ziet." },
    { item: "<span class=\"naslag-term\">Metreet</span> — een grote inhoudsmaat van ongeveer 39 liter. De stenen kruiken op de bruiloft in Kana hielden er elk twee of drie van — dus zo'n 80 tot 120 liter per kruik." },
];

const ONTDEK_TIJD = [
    { kop: "Tijd" },
    { item: "<span class=\"naslag-term\">Uren</span> — de tijdsaanduidingen in de Bijbel werken anders dan onze moderne klok. In de tijd van Jezus begon de dag bij zonsopgang, ongeveer om 6.00 uur. De tijd tot zonsondergang werd in twaalf uren verdeeld. De tabel laat zien rond welk tijdstip op onze klok elk Bijbels uur ongeveer uitkomt." },
    { tabel: { koppen: ["Bijbels uur", "Onze tijd (ongeveer)"], rijen: [["1e uur", "07.00"], ["2e uur", "08.00"], ["3e uur", "09.00"], ["4e uur", "10.00"], ["5e uur", "11.00"], ["6e uur", "12.00"], ["7e uur", "13.00"], ["8e uur", "14.00"], ["9e uur", "15.00"], ["10e uur", "16.00"], ["11e uur", "17.00"], ["12e uur", "18.00 (zonsondergang)"]] } },
    { noot: "Goed om te weten: bij de Romeinen en de Joden begon het eerste uur eigenlijk al bij zonsopgang, rond 6.00 uur. In de meeste bijbelcommentaren wordt het eerste uur echter rond 7.00 uur gerekend. Wij volgen hier die gangbare indeling — zo blijven de bekende voorbeelden hieronder (zoals het negende uur rond 15.00 uur) goed kloppen." },
    { item: "<span class=\"naslag-term\">Bekende voorbeelden</span>" },
    { item: "<span class=\"naslag-term\">Het derde uur</span> → ongeveer 9.00 uur. Bij Pinksteren zei Petrus: \"Het is pas het derde uur van de dag\" (Handelingen 2:15)." },
    { item: "<span class=\"naslag-term\">Het zesde uur</span> → ongeveer 12.00 uur. Rond het middaguur sprak Jezus bij de put met de Samaritaanse vrouw (Johannes 4:6)." },
    { item: "<span class=\"naslag-term\">Het negende uur</span> → ongeveer 15.00 uur. Rond dit uur stierf Jezus aan het kruis (Matteüs 27:46-50). Het was ook een vast uur van gebed: Petrus en Johannes gingen toen naar de tempel (Handelingen 3:1)." },
    { item: "<span class=\"naslag-term\">Zomer en winter: niet elk uur even lang</span>" },
    { item: "Er zit behoorlijk wat verschil tussen zomer en winter. Israël ligt ongeveer op dezelfde breedtegraad als Zuid-Spanje en Noord-Afrika. Daardoor zijn de verschillen kleiner dan in Nederland, maar nog steeds duidelijk merkbaar. Voor Jeruzalem gelden ongeveer deze tijden:" },
    { tabel: { koppen: ["Periode", "Zonsopgang", "Zonsondergang"], rijen: [["Winter (± 21 dec)", "± 06.35", "± 16.40"], ["Lente (± 21 mrt)", "± 05.45", "± 17.55"], ["Zomer (± 21 jun)", "± 05.30", "± 19.45"], ["Herfst (± 21 sep)", "± 06.20", "± 18.20"]] } },
    { item: "De daglengte varieert dus van ongeveer 10 uur in de winter tot ruim 14 uur in de zomer. En omdat men die daglengte altijd in twaalf gelijke delen verdeelde, duurde één \"uur\" in de winter ongeveer 50 minuten en in de zomer ongeveer 70 minuten. Daarom viel bijvoorbeeld het \"negende uur\" niet altijd precies op 15.00 uur volgens onze klok, maar ergens midden tot laat in de middag." },
    { item: "<span class=\"naslag-term\">Voorbeeld: het negende uur</span>" },
    { tabel: { koppen: ["", "Winter (dag ± 10 uur)", "Zomer (dag ± 14 uur)"], rijen: [["Zonsopgang", "06.35", "05.30"], ["Eén Bijbels uur", "± 50 min", "± 70 min"], ["Negende uur", "± 14.05", "± 15.55"]] } },
    { item: "<span class=\"naslag-term\">Nachtwaak</span> — in de tijd van Jezus verdeelden de Romeinen de nacht in vier \"wachten\" van ongeveer drie uur, samen van zes uur 's avonds tot zes uur 's ochtends. Wachters losten elkaar per wacht af — vandaar de naam." },
    { tabel: { koppen: ["Nachtwaak", "Tijd"], rijen: [["1e", "18.00 – 21.00 uur"], ["2e", "21.00 – 24.00 uur"], ["3e", "24.00 – 3.00 uur"], ["4e", "3.00 – 6.00 uur"]] } },
    { item: "De vierde nachtwaak is op het einde van de nacht, vlak voor zonsopgang. Toen Jezus over het water naar de leerlingen liep, was het de vierde nachtwaak (Matteüs 14:25): het moet dus na 3.00 uur zijn geweest, ergens tot aan zonsopgang. In het Oude Testament kende men er nog maar drie, van zo'n vier uur." },
];

// --- Verborgen patronen: de drie artikelen ----------------------------------
// De id's zijn ongewijzigd overgenomen: verborgenSchatVragen verwijst ernaar
// via catecheseId, en die pool blijft ongemoeid.
const ONTDEK_PATRONEN = [
    {
        id: "verborgen-getallen-153",
        naam: "De 153 vissen",
        type: "artikel",
        inhoud: [
            { item: "Na zijn opstanding liet Jezus zich aan zijn leerlingen zien bij het meer. Ze hadden de hele nacht gevist en niets gevangen. Op Jezus' woord gooiden ze het net nóg een keer uit — en nu zat het zó vol dat ze het bijna niet aan land kregen. Toen ze de vissen telden, waren het er precies honderddrieënvijftig. En het mooie: hoe vol het net ook zat, het scheurde niet (Johannes 21)." },
            { item: "Waarom zou Johannes zo'n precies getal opschrijven? Johannes is namelijk een schrijver die van verborgen lagen houdt: in zijn evangelie zit vaak een diepere betekenis onder de oppervlakte. En bij dit getal hebben uitleggers door de eeuwen heen iets bijzonders gezien." },
            { item: "De kerkvader Hiëronymus schrijft dat men in zijn tijd geloofde dat er precies 153 soorten vissen in de zee bestonden — élke soort die er was. Het beeld werd dan: het net van het evangelie haalt mensen binnen uit élk volk, uit de hele wereld. De blijde boodschap is niet voor één groep, maar voor iedereen." },
            { item: "En dat het net niet scheurde? Ook dat lazen ze als een boodschap: in dat ene net is plaats voor allemaal, en er gaat niemand verloren." },
            { item: "Sommige uitleggers, zoals Augustinus, keken naar het getal zelf. 153 is namelijk de optelsom van alle getallen van 1 tot en met 17 (1 + 2 + 3 + … + 17 = 153). En 17, zeiden zij, is 10 + 7: de tien geboden plus de zeven gaven van Gods Geest. Zo werd 153 een teken van álle mensen die bij God horen — door zijn wet én door zijn genade." },
            { item: "Er zit zelfs nog een wiskundig wonder in: 153 is óók gelijk aan 1×1×1 + 5×5×5 + 3×3×3 (dat is 1 + 125 + 27). Een getal dat zó keurig in elkaar past, voelt niet zomaar gekozen." },
            { item: "Belangrijk om te weten: deze betekenissen staan niet allemaal letterlijk in de Bijbel — het zijn uitleggingen die door de eeuwen heen zijn ontstaan. Maar ze laten prachtig zien hoe gelovigen in zo'n klein detail een grote boodschap ontdekten: het goede nieuws van Jezus is bestemd voor de hele wereld." },
        ]
    },
    {
        id: "verborgen-patronen-paulus-brieven",
        naam: "De verborgen schat in de brieven van Paulus",
        type: "artikel",
        inhoud: [
            { item: "Heb je je weleens afgevraagd waarom de brieven van Paulus in de Bijbel in deze volgorde staan? Het is niet de volgorde waarin hij ze schreef. De brieven zijn ongeveer gerangschikt op lengte: de langste (de brief aan de Romeinen) staat vooraan, en zo wordt het steeds korter, tot het kleine briefje aan Filemon achteraan. Eerst komen de brieven aan gemeenten, daarna de brieven aan personen." },
            { item: "Maar er gebeurt iets moois als je de brieven anders leest — niet op lengte, maar op tijd. Op de volgorde waarin Paulus ze schreef, van zijn eerste jaren als apostel tot vlak voor zijn dood. Dan ontdek je een patroon dat je anders nooit zou zien. Een soort verborgen schat." },
            { item: "Vroeg in zijn leven, in de eerste brief aan de Korintiërs (rond het jaar 54), schrijft Paulus: \"Want ik ben de minste van de apostelen.\" (1 Korintiërs 15:9). De minste van de apostelen — dat is al nederig. En er zijn maar twaalf apostelen, dus dat is nog een kleine groep om de laagste van te zijn." },
            { item: "Jaren later, als hij gevangenzit in Rome, schrijft hij in de brief aan de Efeziërs (rond het jaar 60): \"Mij, de allerminste van alle gelovigen…\" (Efeziërs 3:8). Nu is hij niet meer de minste van de apostelen, maar de minste van alle gelovigen. De groep is veel groter geworden, en Paulus zet zichzelf onderaan." },
            { item: "En helemaal aan het einde van zijn leven, in de eerste brief aan Timoteüs (rond het jaar 64), schrijft hij: \"Christus Jezus is in de wereld gekomen om zondaars te redden, en ik ben de grootste van hen.\" (1 Timoteüs 1:15). Niet meer de minste apostel, niet meer de minste gelovige, maar de grootste van alle zondaars." },
            { item: "Zie je het patroon? Hoe ouder Paulus werd en hoe dichter hij bij God leefde, hoe kleiner hij zichzelf maakte. Dat lijkt misschien gek — je zou denken dat iemand die zoveel voor God deed juist trotser zou worden. Maar bij Paulus is het andersom. Hoe meer hij Gods liefde leerde kennen, hoe duidelijker hij zag hoe groot die genade voor hém was." },
            { item: "En let op iets belangrijks: Paulus bleef gewoon apostel. Hij heeft die taak nooit weggegooid. Hij hield twee dingen tegelijk vast — \"ik ben een apostel van Jezus Christus\" én \"ik ben de grootste zondaar\". Dat spreekt elkaar niet tegen. Je mag weten wie je in God bent, en tegelijk klein blijven voor Hem." },
            { item: "Paulus zegt dit nergens hardop. Hij schrijft niet: \"let op, ik word steeds nederiger.\" Je ontdekt het pas als je zijn brieven naast elkaar legt op volgorde van tijd. Daarom is het echt een verborgen schat: hij ligt verstopt in de volgorde, en je vindt hem alleen als je goed zoekt." },
            { item: "Eén ding om eerlijk bij te zeggen: de jaartallen hierboven zijn ongeveer — geleerden weten niet op de dag nauwkeurig wanneer Paulus elke brief schreef. En dat Paulus \"steeds nederiger\" werd, is iets wat wij ontdekken als we de brieven op tijd ordenen; het is een prachtige ontdekking, geen regel die zo in de Bijbel staat. Maar de drie teksten zijn er echt, en ze zijn in deze volgorde geschreven. Dat maakt het zo bijzonder." },
            { item: "Word jij van binnen groter of kleiner naarmate je meer leert? Paulus laat zien dat echt dichtbij God komen je juist nederig maakt — niet omdat je niks waard bent, maar omdat je steeds beter ziet hoe groot Gods liefde is." },
        ]
    },
    {
        id: "verborgen-patronen-sandwich",
        naam: "De sandwich-techniek van Marcus",
        type: "artikel",
        inhoud: [
            { item: "Marcus blijkt een knappe verteller. Hij begint een verhaal, schuift er een tweede verhaal tussen, en pakt dan de draad van het eerste weer op — net als twee boterhammen met beleg ertussen. Geleerden noemen dit de sandwich-techniek (met een moeilijk woord: intercalatie)." },
            { item: "Het mooiste inzicht: de nadruk ligt meestal op het verhaal ín het midden — net als bij een echte sandwich is het beleg waar het om draait. Dat binnenste verhaal is vaak de sleutel tot de betekenis, en de twee verhalen eromheen helpen je dat te begrijpen." },
            { item: "Bij Jaïrus en de zieke vrouw (Marcus 5) staat zo het geloof van de vrouw in het midden, met een knipoog: het getal twaalf komt in beide verhalen terug — de vrouw is twaalf jaar ziek, het meisje twaalf jaar oud. Een ander bekend voorbeeld is de tempelreiniging, ingeklemd tussen de vervloeking en het verdorren van een vijgenboom (Marcus 11)." },
            { item: "Zo blijkt dat Marcus zijn evangelie zorgvuldig heeft opgebouwd — niet als losse verhalen, maar als één doordacht geheel. Kun jij nog een sandwich vinden als je Marcus leest?" },
        ]
    },
];

// --- Verborgen Schat (op slot) ----------------------------------------------
// De eerste twaalf komen één op één uit de oude naslagpagina en volgen de
// volgorde van de vragen 1 t/m 12. Daarna vier onderwerpen voor de vragen
// 13 t/m 16, die op de oude pagina ontbraken: twee verwijzingen naar een
// bestaand artikel, en twee plekken waar de tekst nog geschreven moet worden.
const ONTDEK_SCHAT = [
    { id: "van-wie-was-het-huis-met-de-bovenzaal-va", naam: "Van wie was het huis met de bovenzaal van het Laatste Avondmaal?", type: "artikel", inhoud: [ { item: "Hier moeten we eerlijk zijn — en juist dat maakt het een echte schat. De evangeliën noemen de eigenaar namelijk níet. Jezus stuurt zijn leerlingen achter \"een man met een kruik water\" aan; die brengt hen naar een huis met een grote bovenzaal, maar een naam krijgen we niet (Marcus 14, Lucas 22). In een kerk in Jeruzalem staat een inscriptie uit de zesde eeuw die een huis aanwijst als dat van Maria, de moeder van Johannes Marcus. Sindsdien wordt die bovenzaal vaak met haar huis verbonden — ook omdat de eerste christenen later juist bij háár thuis bij elkaar kwamen (Handelingen 12:12). Het mooie om te weten is dus het verschil: wat zwart-op-wit in de Bijbel staat (een naamloze gastheer) en wat er later bij is gekomen (het huis van Maria). Allebei waardevol, maar het is goed om ze uit elkaar te houden." } ] },
    { id: "wat-betekent-apocalyps-eigenlijk", naam: "Wat betekent \"apocalyps\" eigenlijk?", type: "artikel", inhoud: [ { item: "Veel mensen denken bij \"apocalyps\" meteen aan het einde van de wereld, aan rampen en ondergang. Maar het Griekse woord <em>apokalypsis</em> betekent iets heel anders: \"onthulling\" of \"openbaring\" — het wegtrekken van een sluier, zodat je ziet wat eerst verborgen was. Daarom heet het laatste Bijbelboek in het Nederlands ook \"Openbaring\". Het wil dus niet vooral angst aanjagen, maar iets láten zien. En dat is precies waarom dit zo goed bij de Verborgen Schat past: een verborgen schat onthullen is letterlijk wat een apocalyps doet." } ] },
    { id: "waarom-noemt-jezus-zichzelf-de-alfa-en-d", naam: "Waarom noemt Jezus zichzelf \"de Alfa en de Omega\"?", type: "artikel", inhoud: [ { item: "Alfa is de eerste letter van het Griekse alfabet, omega de laatste — een beetje zoals onze A en Z. Door zichzelf zo te noemen zegt Jezus: ik ben er vanaf het allereerste begin én tot aan het einde van alles. Er is geen moment dat buiten hem valt; hij staat aan het begin van het verhaal én aan het slot. Zo zegt hij in twee letters iets enorms over wie hij is." } ] },
    { id: "wie-wordt-in-openbaring-het-lam-genoemd", naam: "Wie wordt in Openbaring \"het Lam\" genoemd, en waarom juist een lam?", type: "artikel", inhoud: [ { item: "Met \"het Lam\" wordt steeds Jezus bedoeld. Een lam is een kwetsbaar, zachtmoedig dier, en het werd vroeger gebruikt als offerdier — het beeld wijst dus naar Jezus die zichzelf opofferde. Het verrassende is dat juist dit geofferde Lam in Openbaring de grote overwinnaar is. Niet de sterkste of de hardste wint, maar het Lam dat zichzelf gaf. Die omkering — kwetsbaarheid die overwint — is een van de diepste lagen van het boek." } ] },
    { id: "waar-staat-het-getal-zeven-symbolisch-vo", naam: "Waar staat het getal zeven symbolisch voor?", type: "artikel", inhoud: [ { item: "In Openbaring kom je zeven overal tegen: zeven gemeenten, zeven zegels, zeven bazuinen, zeven schalen. Dat is geen toeval. In de Bijbel staat zeven voor volheid, voor \"helemaal compleet\" — denk aan de zeven dagen waarin de schepping af was. Het gaat dus niet om precies tellen, maar om volledigheid. Wie dat doorheeft, leest Openbaring anders: het wil zeggen dat Gods plan helemaal compleet wordt, tot in alle hoeken." } ] },
    { id: "hoe-eindigt-de-bijbel-in-openbaring", naam: "Hoe eindigt de Bijbel in Openbaring?", type: "artikel", inhoud: [ { item: "Niet met ondergang, maar met hoop. In de laatste hoofdstukken komt er een nieuwe hemel en een nieuwe aarde, waar God zelf bij de mensen woont en waar geen tranen, dood of pijn meer zijn. En er gebeurt iets moois: de levensboom uit het paradijs, helemaal aan het begin van de Bijbel, keert terug. Zo komt het hele verhaal rond — het paradijs dat in Genesis verloren ging, wordt aan het einde hersteld. De Bijbel sluit zich als een grote cirkel." } ] },
    { id: "wat-betekent-een-tijd-tijden-en-een-halv", naam: "Wat betekent \"een tijd, tijden en een halve tijd\"?", type: "artikel", inhoud: [ { item: "Het klinkt cryptisch, maar je kunt het gewoon uitrekenen: een \"tijd\" is een jaar, \"tijden\" is twee jaar, en een \"halve tijd\" een half jaar — samen drieënhalf jaar. De Bijbel noemt diezelfde periode elders met andere woorden: 42 maanden, of 1260 dagen. En de uitdrukking dook eeuwen eerder al op in het boek Daniël — Openbaring pakt dat beeld bewust weer op." } ] },
    { id: "waar-komen-de-vier-levende-wezens-vandaa", naam: "Waar komen de vier levende wezens vandaan?", type: "artikel", inhoud: [ { item: "De vier wezens rond Gods troon — een leeuw, een rund, een mens en een arend — komen uit een eeuwenoud visioen van de profeet Ezechiël. Het bijzondere: deze vier gezichten werden later de symbolen van de vier evangelisten. De leeuw hoort bij Marcus, het rund bij Lucas, de mens bij Matteüs en de arend bij Johannes. Precies de vier die je in dit spel als trofeeën kunt verdienen!" } ] },
    { id: "de-boom-des-levens-begin-en-einde", naam: "De boom des levens — begin en einde", type: "artikel", inhoud: [ { item: "De Bijbel begint en eindigt bij dezelfde boom. In het paradijs (Genesis) staat de boom des levens, en helemaal aan het eind, in het nieuwe Jeruzalem (Openbaring), staat hij er weer — met bladeren tot genezing van de volken. Tussen die twee bomen in speelt het hele verhaal van de Bijbel zich af. Let op: in het paradijs stonden twee bijzondere bomen; alleen de boom des levens komt aan het eind terug, niet de boom van kennis van goed en kwaad." } ] },
    { id: "de-zeven-gemeenten", naam: "De zeven gemeenten", type: "artikel", inhoud: [ { item: "Openbaring begint als een brief aan zeven echte gemeenten in Klein-Azië (het huidige Turkije): Efeze, Smyrna, Pergamum, Tyatira, Sardis, Filadelfia en Laodicea. Het getal zeven is geen toeval — het staat in de Bijbel voor volheid. Door aan zéven gemeenten te schrijven, schrijft Johannes eigenlijk aan de hele kerk." } ] },
    { id: "het-nieuwe-jeruzalem", naam: "Het nieuwe Jeruzalem", type: "artikel", inhoud: [ { item: "Aan het slot van Openbaring daalt een schitterende stad uit de hemel neer: het nieuwe Jeruzalem. Het mooiste is niet het goud of de edelstenen, maar wat erbij gezegd wordt: God woont nu voorgoed bij de mensen, en Hij wist alle tranen weg. Geen dood, geen verdriet en geen pijn meer. Daar loopt het hele verhaal van de Bijbel op uit." } ] },
    // Eén canonieke versie: het artikel in Verborgen patronen.
    { id: "de-sandwich-techniek-van-marcus", naam: "De sandwich-techniek van Marcus", verwijstNaar: "verborgen-patronen-sandwich" },

    // Vragen 13 en 14: het artikel bestaat al in Verborgen patronen.
    { id: "de-153-vissen", naam: "De 153 vissen", verwijstNaar: "verborgen-getallen-153" },
    { id: "de-brieven-van-paulus", naam: "De volgorde van de brieven van Paulus", verwijstNaar: "verborgen-patronen-paulus-brieven" },

    // Vragen 15 en 16: plek gemaakt, tekst nog te schrijven.
    { id: "het-oor-van-malchus", naam: "Het oor van Malchus", type: "artikel",
      inhoud: [ { item: "Deze uitleg wordt nog geschreven." } ] },
    { id: "de-brief-aan-de-hebreeen", naam: "De brief aan de Hebree\u00ebn", type: "artikel",
      inhoud: [ { item: "Deze uitleg wordt nog geschreven." } ] },

    // Vraag 17: het poortje-verhaal bij Marcus 10:25-27.
    { id: "het-oog-van-de-naald", naam: "Waarom \"het oog van de naald\" waarschijnlijk geen poortje was", type: "artikel",
      inhoud: [
          { item: "Je hoort het vaak: het oog van de naald zou een laag poortje in de muur van Jeruzalem zijn geweest, waar een kameel alleen doorheen kon als hij eerst alle bagage aflegde. Een mooi beeld — je moet je spullen loslaten om erdoor te komen." },
          { item: "Toch klopt er iets niet. Als je de oudste christelijke uitleggers erop naslaat, mensen als Origenes, Chrysostomus en Augustinus, dan bespreken die deze tekst uitgebreid, maar noemt geen van hen een poort. Het verhaal duikt pas veel later op, in preken." },
          { item: "Wat Jezus waarschijnlijk juist bedoelde, is dat het beeld ónmogelijk is. Een enorme kameel door een piepklein naaldgaatje: dat kán niet. En dat is precies de bedoeling. De leerlingen schrikken en vragen: wie kan er dan nog gered worden? Jezus antwoordt: bij mensen is dit onmogelijk, maar bij God is alles mogelijk." }
      ] },
];
