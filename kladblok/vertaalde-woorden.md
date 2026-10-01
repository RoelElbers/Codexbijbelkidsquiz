# Vertaalde en verklaarde woorden in de game

Inventaris van 1 oktober 2026, voor controle. Alleen vastgesteld, niets aangepast.

## Totalen

| groep | woorden |
| --- | --- |
| Grieks | 59 |
| Hebreeuws | 9 |
| Aramees | 4 |
| Latijn | 9 |
| Namen | 25 |
| Nederlandse herkomst | 30 |
| **totaal** | **136** |

**Markeringen: 8**: ekklesia / ekklèsia, kuriakon / kyriakon (en kurios), pond / mina, Sanhedrin / synedrion, Messias, Rabbi / rabboeni, Talita koemi / Talita koem, zonde. Een markering betekent dat de game hetzelfde woord op verschillende plekken een andere betekenis, herkomst of schrijfwijze geeft. Ze staan bij het woord zelf met ⚠ en zijn hieronder nog eens samengevat.

## Hoe dit is samengesteld

- **Doorzocht:** alle vraagpools in `script.js` (`vragenData`, `verborgenSchatVragen`, `metgezellenVragen`; de velden vraag, antwoorden, correct, uitleg en reveal), de overige teksten in `script.js`, alle constanten in `ontdekken-inhoud.js`, `lang/nl.js` en alle HTML-pagina's.
- **Zoekwoorden:** Grieks, Hebreeuws, Aramees, Latijn, betekent, betekenis, letterlijk, komt van, vandaan, afgeleid, oorspronkelijk, het woord, de naam, vertaald, vernoemd, genoemd naar, bijnaam. Daarnaast alle korte `<em>`-woorden en elke tekst met Grieks of Hebreeuws schrift. Elke treffer is met de hand gelezen.
- **Wat er níet in staat:** uitleg van gewone Nederlandse begrippen zonder herkomst of vertaling (heiden, bekering, opstanding, genade, verloochenen, rein en onrein, overwinteren, melaats), uitleg van gebaren en uitdrukkingen ("aan de voeten van", het stof van je voeten schudden, handen opleggen) en afleiders in foute antwoorden.
- **Vindplaatsen:** het vraagnummer is de positie in de pool van dat boek en niveau, geteld in de volgorde van het bronbestand. Het veld staat tussen haakjes: vraag, correct (het goede antwoord), uitleg of reveal.
- **Zinnen:** woordelijk uit de bron gehaald. HTML-opmaak is weggelaten; `<em>` staat als *cursief*. Grieks en Hebreeuws schrift is bewaard. Staat de betekenis in het goede antwoord, dan staan vraag en antwoord er allebei bij.
- **Taal:** waar de game de taal zelf noemt, staat die er gewoon. Waar de game de taal niet noemt, staat dat erbij ("taal niet genoemd"); de indeling in een groep is dan van mij.

## Grieks (59)

Griekse woorden, met de betekenis die de game geeft. Ook woorden waarbij de game alleen zegt dat het om "het Griekse woord" gaat zonder het te noemen.

### achrēstos / euchrēstos

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 5 ("De naam Onesimus betekent "nuttig". Welke woordgrap maakt …") (uitleg)
  - Betekenis/herkomst: "achrēstos was, 'onbruikbaar', en nu euchrēstos, 'heel bruikbaar'"
  - Zin: Paulus schrijft dat hij vroeger achrēstos was, 'onbruikbaar', en nu euchrēstos, 'heel bruikbaar'.

### alfa en omega

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Openbaring · beginner · vraag 14 ("Helemaal aan het begin van Openbaring stelt God …") (vraag)
  - Betekenis/herkomst: "de eerste en de laatste letter van het alfabet"
  - Zin: Helemaal aan het begin van Openbaring stelt God Zichzelf voor met twee Griekse letters: de alfa en de omega — de eerste en de laatste letter van het alfabet.
- `script.js` — Openbaring · gevorderd · vraag 16 ("God noemt Zichzelf "de Alfa en de Omega". …") (correct)
  - Betekenis/herkomst: "Het zijn de eerste en de laatste letter van het Griekse alfabet"
  - Zin: Vraag: "God noemt Zichzelf "de Alfa en de Omega". Waar komen die twee woorden vandaan?" — goed antwoord: "Het zijn de eerste en de laatste letter van het Griekse alfabet"
- `ontdekken-inhoud.js` — Verborgen Schat, artikel › Waarom noemt Jezus Zichzelf "de Alfa en de Omega"? (ONTDEK_SCHAT)
  - Betekenis/herkomst: "Alfa is de eerste letter van het Griekse alfabet, omega de laatste"
  - Zin: Alfa is de eerste letter van het Griekse alfabet, omega de laatste — een beetje zoals onze A en Z.

### anepsios

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 12 ("Paulus noemt Marcus familie van Barnabas. Welke familieband …") (uitleg)
  - Betekenis/herkomst: "Dat betekent: de zoon van een oom of tante"
  - Zin: Dat betekent: de zoon van een oom of tante.

### apokalypsis

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (apocalyps)

- `script.js` — Openbaring · gevorderd · vraag 12 ("Het laatste boek van de Bijbel heet "Openbaring". …") (uitleg)
  - Betekenis/herkomst: "betekent "onthulling" of "openbaring""
  - Zin: Het Griekse woord is apokalypsis (ἀποκάλυψις) en betekent "onthulling" of "openbaring": iets wat verborgen was, wordt zichtbaar gemaakt.
- `ontdekken-inhoud.js` — Verborgen Schat, artikel › Wat betekent "apocalyps" eigenlijk? (ONTDEK_SCHAT)
  - Betekenis/herkomst: "betekent iets heel anders: "onthulling" of "openbaring""
  - Zin: Maar het Griekse woord *apokalypsis* betekent iets heel anders: "onthulling" of "openbaring" — het wegtrekken van een sluier, zodat je ziet wat eerst verborgen was.

### apostel / apostolos

- **Taal:** Grieks
- **Soort:** betekenis + herkomst

- `script.js` — Romeinen · gevorderd · vraag 14 ("Paulus noemt zichzelf meteen in de eerste zin …") (correct)
  - Betekenis/herkomst: "Iemand die wordt uitgezonden met een opdracht"
  - Zin: Vraag: "Paulus noemt zichzelf meteen in de eerste zin een "apostel". Wat betekent dat woord?" — goed antwoord: "Iemand die wordt uitgezonden met een opdracht"
- `script.js` — Romeinen · gevorderd · vraag 14 ("Paulus noemt zichzelf meteen in de eerste zin …") (uitleg)
  - Betekenis/herkomst: "Het woord komt van het Griekse werkwoord voor wegsturen"
  - Zin: Het woord komt van het Griekse werkwoord voor wegsturen.
- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Apostel (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Het woord betekent "gezant" of "boodschapper", van het Griekse *apostolos*: iemand die wordt uitgezonden"
  - Zin: Het woord betekent "gezant" of "boodschapper", van het Griekse *apostolos*: iemand die wordt uitgezonden.

### archiereus / archi-

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (aarts-)

- `ontdekken-inhoud.js` — Wie is wie — tempel en Schrift › Hogepriester (ONTDEK_WIE_TEMPEL)
  - Betekenis/herkomst: "betekent "hoogste" of "eerste"; daar komt ons "aarts-" vandaan"
  - Zin: Het begin, *archi-*, betekent "hoogste" of "eerste"; daar komt ons "aarts-" vandaan, zoals in aartsengel en aartsvader.

### architektōn

- **Taal:** Grieks
- **Soort:** herkomst (architect)

- `ontdekken-inhoud.js` — Wie is wie — beroepen › Bouwmeester (ONTDEK_WIE_BEROEPEN)
  - Betekenis/herkomst: "Het Griekse woord is *architektōn*, en daar komt ons woord architect vandaan"
  - Zin: Het Griekse woord is *architektōn*, en daar komt ons woord architect vandaan.

### assarion

- **Taal:** Grieks
- **Soort:** betekenis (munt)

- `ontdekken-inhoud.js` — Geld in de Bijbel › As (ONTDEK_GELD)
  - Betekenis/herkomst: "In het Grieks heet deze munt assarion"
  - Zin: In het Grieks heet deze munt assarion.

### batos (vat)

- **Taal:** Grieks, van het Hebreeuwse bat
- **Soort:** betekenis (maat)

- `script.js` — Lucas · expert · vraag 17 ("In de gelijkenis van de onrechtvaardige rentmeester was …") (uitleg)
  - Betekenis/herkomst: "(batos), naar de Hebreeuwse maat bat. Eén vat was ongeveer 22 liter"
  - Zin: In het Grieks heet deze maat βάτος (batos), naar de Hebreeuwse maat bat. Eén vat was ongeveer 22 liter, zo'n twee volle emmers.
- `ontdekken-inhoud.js` — Maten › Vat (ONTDEK_MATEN)
  - Betekenis/herkomst: "Vat (Grieks: batos, van het Hebreeuwse bat)"
  - Zin: Vat (Grieks: batos, van het Hebreeuwse bat) — ongeveer 22 liter, zo'n twee volle emmers.

### bezonnenheid (Grieks woord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Timoteüs & Titus · gevorderd · vraag 9 ("Paulus schrijft aan Timoteüs dat God ons geen …") (uitleg)
  - Betekenis/herkomst: "heeft te maken met een helder en gezond verstand"
  - Zin: Het Griekse woord dat Paulus gebruikt, heeft te maken met een helder en gezond verstand.

### brabeuō

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 18 ("In Kolossenzen 3:15 staat dat de vrede van …") (uitleg)
  - Betekenis/herkomst: "Het woord brabeuō betekent "scheidsrechter zijn""
  - Zin: Het woord brabeuō betekent "scheidsrechter zijn".

### broer (Grieks/Hebreeuws woord niet genoemd)

- **Taal:** "de talen van de Bijbel"
- **Soort:** betekenis

- `script.js` — Jakobus · expert · vraag 3 ("In het boek Handelingen komt een Jakobus voor …") (uitleg)
  - Betekenis/herkomst: "kon het woord dat wij met "broer" vertalen ook een andere naaste verwant aanduiden"
  - Zin: In de talen van de Bijbel kon het woord dat wij met "broer" vertalen ook een andere naaste verwant aanduiden.

### cheirographon

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Kolossenzen & Filemon · beginner · vraag 16 ("In Kolossenzen 2:14 schrijft Paulus dat God het …") (uitleg)
  - Betekenis/herkomst: "betekent letterlijk "handschrift""
  - Zin: Het Griekse woord cheirographon betekent letterlijk "handschrift": een schuldbekentenis die je met je eigen hand tekende.

### chrisma

- **Taal:** Grieks (taal niet genoemd)
- **Soort:** betekenis

- `kerken-katholiek-sacramenten.html` — sectie "Het vormsel"
  - Betekenis/herkomst: "met heilige olie, het chrisma"
  - Zin: De bisschop legt zijn hand op je hoofd, tekent met heilige olie, het chrisma, een kruis op je voorhoofd en zegt je naam, met de woorden: ontvang het zegel van de gave Gods, de Heilige Geest.

### Christus

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Marcus · expert · vraag 14 (""Messias" is Hebreeuws voor "de gezalfde". Welk woord …") (correct)
  - Betekenis/herkomst: "Christus"
  - Zin: Vraag: ""Messias" is Hebreeuws voor "de gezalfde". Welk woord betekent precies hetzelfde, maar dan in het Grieks?" — goed antwoord: "Christus"
- `ontdekken-inhoud.js` — Woordenboek › Messias (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "In het Grieks heet "de gezalfde" trouwens "Christus""
  - Zin: In het Grieks heet "de gezalfde" trouwens "Christus" — dus Messias en Christus betekenen precies hetzelfde, alleen in een andere taal.

### diadema / stephanos (kroon)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Openbaring · beginner · vraag 12 ("Jezus belooft: wie trouw blijft tot de dood, …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord dat hier voor kroon wordt gebruikt, kan de overwinningskrans zijn"
  - Zin: Het Griekse woord dat hier voor kroon wordt gebruikt, kan de overwinningskrans zijn die een winnaar bij een wedstrijd kreeg.
- `script.js` — Openbaring · expert · vraag 16 ("Johannes ziet iemand met veel "diademen" op Zijn …") (uitleg)
  - Betekenis/herkomst: "was onder andere de krans die een winnaar bij een wedstrijd kreeg"
  - Zin: Stephanos (στέφανος) was onder andere de krans die een winnaar bij een wedstrijd kreeg.
- `script.js` — Openbaring · expert · vraag 16 ("Johannes ziet iemand met veel "diademen" op Zijn …") (uitleg)
  - Betekenis/herkomst: "was een koninklijke hoofdband of kroon, een teken van koningschap"
  - Zin: Diadema (διάδημα) was een koninklijke hoofdband of kroon, een teken van koningschap.

### diakonos

- **Taal:** Grieks
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Diaken (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "betekent "dienaar""
  - Zin: Het Griekse woord *diakonos* betekent "dienaar".

### diaspora

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Jakobus · expert · vraag 11 ("Jakobus schrijft aan de "twaalf stammen in de …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord diaspora betekent verstrooiing"
  - Zin: Het Griekse woord diaspora betekent verstrooiing, alsof zaad is uitgestrooid over een groot veld.

### didrachme

- **Taal:** Grieks (taal niet genoemd)
- **Soort:** betekenis (munt)

- `ontdekken-inhoud.js` — Geld in de Bijbel (ONTDEK_GELD)
  - Betekenis/herkomst: "heet die belasting daarom de didrachme — twee drachmen"
  - Zin: In het Nieuwe Testament heet die belasting daarom de didrachme — twee drachmen (Matteüs 17:24).

### doulos

- **Taal:** Grieks
- **Soort:** betekenis (vertaling)

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Slaaf (knecht) (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: "wordt in de ene vertaling met slaaf vertaald, in de andere met knecht of dienaar"
  - Zin: Het Griekse woord *doulos* wordt in de ene vertaling met slaaf vertaald, in de andere met knecht of dienaar.

### ekklesia / ekklèsia ⚠

- **Taal:** Grieks
- **Soort:** betekenis + herkomst
- **⚠ Markering:** Schrijfwijze verschilt: *ekklesia* (twee vragen) tegenover *ekklèsia* (woordenboek, ook met Grieks schrift). De betekenis wordt ook verschillend gegeven: "vergadering" (Tessalonicenzen), "de mensen die bij elkaar geroepen zijn" (Johannes), "de groep die bij elkaar geroepen is" (woordenboek); die drie spreken elkaar niet tegen.

- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 14 ("Paulus schrijft aan de "gemeente" van Tessalonica; in …") (correct)
  - Betekenis/herkomst: "De vergadering waarop de burgers samen beslisten"
  - Zin: Vraag: "Paulus schrijft aan de "gemeente" van Tessalonica; in andere vertalingen staat daar "kerk". Het Griekse woord ekklesia bestond al eeuwen in elke Griekse stad. Wat was het toen?" — goed antwoord: "De vergadering waarop de burgers samen beslisten"
- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 14 ("Paulus schrijft aan de "gemeente" van Tessalonica; in …") (uitleg)
  - Betekenis/herkomst: "Ekklesia was al lang vóór het christendom een gewoon Grieks woord voor een vergadering"
  - Zin: Ekklesia was al lang vóór het christendom een gewoon Grieks woord voor een vergadering.
- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (uitleg)
  - Betekenis/herkomst: "Het Griekse ekklesia ging een andere weg"
  - Zin: Het Griekse ekklesia ging een andere weg: in het Latijn werd het ecclesia, en daaruit ontstonden het Franse église, het Spaanse iglesia en het Italiaanse chiesa.
- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (uitleg)
  - Betekenis/herkomst: "het andere de mensen die bij elkaar geroepen zijn"
  - Zin: Twee woorden voor dezelfde zaak — het ene noemt het huis van de Heer, het andere de mensen die bij elkaar geroepen zijn.
- `ontdekken-inhoud.js` — Woordenboek › Kerk (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Dat betekent letterlijk "de groep die bij elkaar geroepen is""
  - Zin: Dat betekent letterlijk "de groep die bij elkaar geroepen is" — van *ek* ("uit") en *kaleō* ("roepen").

### episkopos

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (bisschop)

- `script.js` — Timoteüs & Titus · gevorderd · vraag 15 ("Paulus schrijft over wie "opziener" wil worden. Wat …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord is episkopos: iemand die toezicht houdt"
  - Zin: Het Griekse woord is episkopos: iemand die toezicht houdt.
- `ontdekken-inhoud.js` — Woordenboek › Bisschop (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Het woord komt via het Latijn van het Griekse *episkopos*: iemand die toezicht houdt"
  - Zin: Het woord komt via het Latijn van het Griekse *episkopos*: iemand die toezicht houdt.
- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Opziener (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Iemand die toezicht houdt; van het Griekse *episkopos*"
  - Zin: Iemand die toezicht houdt; van het Griekse *episkopos*.

### euangelion / evangelie

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (engel)

- `script.js` — Marcus · beginner · vraag 11 ("Wat betekent het woord "evangelie"? …") (correct)
  - Betekenis/herkomst: "Goed nieuws"
  - Zin: Vraag: "Wat betekent het woord "evangelie"?" — goed antwoord: "Goed nieuws"
- `script.js` — Romeinen · expert · vraag 11 ("Paulus noemt zijn boodschap het "evangelie", een woord …") (correct)
  - Betekenis/herkomst: "Goed nieuws dat een bode kwam brengen, zoals een overwinning"
  - Zin: Vraag: "Paulus noemt zijn boodschap het "evangelie", een woord dat toen al bestond. Wat betekende het in de gewone taal?" — goed antwoord: "Goed nieuws dat een bode kwam brengen, zoals een overwinning"
- `ontdekken-inhoud.js` — Woordenboek › Evangelie (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Het woord betekent "goed nieuws""
  - Zin: Het woord betekent "goed nieuws".
- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Evangelist (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "betekent "goed nieuws": *eu* is goed, en een *angelos* is een bode"
  - Zin: Het Griekse *euangelion* betekent "goed nieuws": *eu* is goed, en een *angelos* is een bode.

### hagios

- **Taal:** Grieks (met Hebreeuws qadosj)
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Woordenboek › Heilig (heiligen) (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "In het Hebreeuws is dat *qadosj*, in het Grieks *hagios*"
  - Zin: In het Hebreeuws is dat *qadosj*, in het Grieks *hagios*.
- `script.js` — 1 & 2 Korintiërs · expert · vraag 12 ("Paulus begint zijn brief door de Korintiërs "heiligen" …") (correct)
  - Betekenis/herkomst: "Apart gezet voor God; Paulus noemt zo alle gelovigen"
  - Zin: Vraag: "Paulus begint zijn brief door de Korintiërs "heiligen" te noemen — en bespreekt daarna bladzijdenlang hun ruzies. Wat betekende dat woord bij hem?" — goed antwoord: "Apart gezet voor God; Paulus noemt zo alle gelovigen"

### hagnos

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Jakobus · gevorderd · vraag 10 ("Jakobus noemt een rijtje eigenschappen van de wijsheid …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord hagnos betekent rein of zuiver"
  - Zin: Het Griekse woord hagnos betekent rein of zuiver; welk van de twee er in jouw bijbel staat, hangt van de vertaling af.

### hebdomēkonta / duo

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Lucas · expert · vraag 8 ("Jezus stuurde tweeënzeventig leerlingen twee aan twee voor …") (uitleg)
  - Betekenis/herkomst: "(hebdomēkonta), 'zeventig', en in een deel van de handschriften staat daar δύο (duo) achter: 'twee'"
  - Zin: In het Grieks staat er ἑβδομήκοντα (hebdomēkonta), 'zeventig', en in een deel van de handschriften staat daar δύο (duo) achter: 'twee'.

### homoios

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Brieven van Johannes · expert · vraag 9 ("Johannes belooft iets moois voor het moment dat …") (uitleg)
  - Betekenis/herkomst: "betekent "lijkend op, van dezelfde soort""
  - Zin: Het Griekse woord dat hij gebruikt, homoios, betekent "lijkend op, van dezelfde soort".

### hudōr zōn

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Johannes · gevorderd · vraag 2 ("Jezus belooft de Samaritaanse vrouw 'levend water'. Wat …") (uitleg)
  - Betekenis/herkomst: "In het Grieks staat er hudōr zōn, "levend water""
  - Zin: In het Grieks staat er hudōr zōn, "levend water".

### ichthus

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Verborgen Schat (verborgenSchatVragen) · vraag 17 ("Op oude christelijke graven en muren staat vaak …") (correct)
  - Betekenis/herkomst: "De Griekse letters van "vis" zijn de beginletters van een korte geloofszin"
  - Zin: Vraag: "Op oude christelijke graven en muren staat vaak een vis getekend. Waarom juist een vis?" — goed antwoord: "De Griekse letters van "vis" zijn de beginletters van een korte geloofszin"
- `script.js` — Verborgen Schat (verborgenSchatVragen) · vraag 17 ("Op oude christelijke graven en muren staat vaak …") (reveal)
  - Betekenis/herkomst: "Het Griekse woord voor vis is ichthus"
  - Zin: Het Griekse woord voor vis is ichthus.

### kleinmoedigen (Grieks woord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 13 ("Paulus schrijft: "bemoedig de kleinmoedigen." Wat betekent dat …") (correct)
  - Betekenis/herkomst: "Mensen met een kleine ziel"
  - Zin: Vraag: "Paulus schrijft: "bemoedig de kleinmoedigen." Wat betekent dat Griekse woord letterlijk?" — goed antwoord: "Mensen met een kleine ziel"
- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 13 ("Paulus schrijft: "bemoedig de kleinmoedigen." Wat betekent dat …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord bestaat uit woorden voor "klein/weinig" en "ziel""
  - Zin: Het Griekse woord bestaat uit woorden voor "klein/weinig" en "ziel".

### koinonia / koinonoi

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Brieven van Johannes · expert · vraag 26 ("Johannes schrijft dat gelovigen bij elkaar én bij …") (correct)
  - Betekenis/herkomst: "Samen eigenaar zijn van één zaak"
  - Zin: Vraag: "Johannes schrijft dat gelovigen bij elkaar én bij God horen en samen in het geloof delen. Het Griekse woord daarvoor is koinonia. Dat woord werd ook gebruikt bij handel en samenwerking. Wat kon het daar betekenen?" — goed antwoord: "Samen eigenaar zijn van één zaak"
- `script.js` — Brieven van Johannes · expert · vraag 26 ("Johannes schrijft dat gelovigen bij elkaar én bij …") (uitleg)
  - Betekenis/herkomst: "Vissers met één gezamenlijk net heetten koinonoi"
  - Zin: Vissers met één gezamenlijk net heetten koinonoi (Lucas 5:10).

### koros (kor)

- **Taal:** Grieks, "een oude Hebreeuwse maat"
- **Soort:** betekenis (maat)

- `script.js` — Lucas · expert · vraag 18 ("In de gelijkenis van de onrechtvaardige rentmeester was …") (uitleg)
  - Betekenis/herkomst: "een oude Hebreeuwse maat"
  - Zin: In het Grieks staat er κόρος (koros), een oude Hebreeuwse maat.
- `script.js` — Lucas · expert · vraag 18 ("In de gelijkenis van de onrechtvaardige rentmeester was …") (uitleg)
  - Betekenis/herkomst: "één kor was ongeveer 220 liter"
  - Zin: Maar het was geen zak zoals wij die kennen: één kor was ongeveer 220 liter, zo'n 170 kilo tarwe.
- `ontdekken-inhoud.js` — Maten › Kor (ONTDEK_MATEN)
  - Betekenis/herkomst: "de grootste inhoudsmaat: tien vaten, dus ongeveer 220 liter"
  - Zin: Kor — de grootste inhoudsmaat: tien vaten, dus ongeveer 220 liter.

### kosmos

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Brieven van Johannes · expert · vraag 7 ("Johannes schrijft: "Heb de wereld niet lief." Toch …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord is kosmos, "wereld""
  - Zin: Het Griekse woord is kosmos, "wereld".

### kuriakon / kyriakon (en kurios) ⚠

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (kerk)
- **⚠ Markering:** Schrijfwijze verschilt: *kyriakon* (vraag) tegenover *kuriakon* en *kurios* (woordenboek). Betekenis is gelijk.

- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (correct)
  - Betekenis/herkomst: "Van kyriakon, 'wat van de Heer is'"
  - Zin: Vraag: "In de derde brief van Johannes staat het woord 'gemeente'; veel vertalingen schrijven daar 'kerk'. Van welk Grieks woord stamt ons Nederlandse woord kerk af?" — goed antwoord: "Van kyriakon, 'wat van de Heer is'"
- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (uitleg)
  - Betekenis/herkomst: "Kerk komt van kyriakon"
  - Zin: Kerk komt van kyriakon, "wat van de Heer is".
- `ontdekken-inhoud.js` — Woordenboek › Kerk (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Dat betekent "wat van de Heer is", van *kurios*, "Heer""
  - Zin: Dat betekent "wat van de Heer is", van *kurios*, "Heer".

### lepton / lepta

- **Taal:** Grieks
- **Soort:** betekenis (munt)

- `script.js` — Marcus · expert · vraag 10 ("De arme weduwe gooide twee van de allerkleinste …") (uitleg)
  - Betekenis/herkomst: "In het Grieks heet dit muntje een lepton"
  - Zin: In het Grieks heet dit muntje een lepton; twee lepta waren samen precies één quadrans.
- `ontdekken-inhoud.js` — Geld in de Bijbel › Lepton (ONTDEK_GELD)
  - Betekenis/herkomst: "Het allerkleinste muntje dat er bestond"
  - Zin: Het allerkleinste muntje dat er bestond.

### martys

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (martelaar)

- `script.js` — Openbaring · expert · vraag 14 ("Jezus noemt Antipas van Pergamum "Mijn trouwe getuige". …") (uitleg)
  - Betekenis/herkomst: "en dat betekende gewoon getuige"
  - Zin: Het Griekse woord is martys (μάρτυς), en dat betekende gewoon getuige — iemand die vertelt wat hij zelf gezien heeft, zoals voor de rechter.

### mysterion

- **Taal:** Grieks
- **Soort:** vertaling + herkomst (sacrament)

- `kerken-katholiek-sacramenten.html` — sectie "Het huwelijk"
  - Betekenis/herkomst: "In het Grieks staat daar *mysterion*, en de Latijnse Bijbel vertaalt dat met *sacramentum*"
  - Zin: In het Grieks staat daar *mysterion*, en de Latijnse Bijbel vertaalt dat met *sacramentum*.

### oikonomos

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (economie)

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Rentmeester (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: ""die het huis regelt", en daar komt ons woord economie vandaan"
  - Zin: Het Griekse woord is *oikonomos*, "die het huis regelt", en daar komt ons woord economie vandaan.

### ongeregeld (Grieks woord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 15 ("Paulus waarschuwt voor mensen die "ongeregeld" leven. Welk …") (uitleg)
  - Betekenis/herkomst: "Het woord betekent letterlijk "niet op zijn plek""
  - Zin: Het woord betekent letterlijk "niet op zijn plek".

### overste (Grieks woord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — leger › Overste (tribuun) (ONTDEK_WIE_LEGER)
  - Betekenis/herkomst: "In het Grieks heet hij letterlijk "aanvoerder van duizend""
  - Zin: In het Grieks heet hij letterlijk "aanvoerder van duizend".

### paidagōgos

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (pedagoog)

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Tuchtmeester (opvoeder) (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: ""kindergeleider", en daar komt ons woord pedagoog vandaan"
  - Zin: Het Griekse woord is *paidagōgos*, "kindergeleider", en daar komt ons woord pedagoog vandaan.

### parakletos

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Brieven van Johannes · expert · vraag 4 ("Johannes schrijft dat gelovigen die tóch verkeerd doen …") (uitleg)
  - Betekenis/herkomst: "iemand die je erbij roept om je te steunen"
  - Zin: De ene vertaling schrijft "pleitbezorger", de andere "helper", en in het Grieks staat er parakletos: iemand die je erbij roept om je te steunen.

### parousia

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 12 ("Voor de terugkomst van Jezus gebruikt Paulus het …") (vraag)
  - Betekenis/herkomst: "dat "komst" of "aanwezigheid" betekent"
  - Zin: Voor de terugkomst van Jezus gebruikt Paulus het Griekse woord parousia, dat "komst" of "aanwezigheid" betekent.
- `script.js` — 1 & 2 Tessalonicenzen · expert · vraag 12 ("Voor de terugkomst van Jezus gebruikt Paulus het …") (uitleg)
  - Betekenis/herkomst: "Parousia betekent "komst" of "aanwezigheid""
  - Zin: Parousia betekent "komst" of "aanwezigheid".

### pentēkostē

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (Pinksteren)

- `script.js` — Handelingen · expert · vraag 19 ("De Heilige Geest kwam op de dag dat …") (uitleg)
  - Betekenis/herkomst: ""de vijftigste", en daar komt ons woord Pinksteren vandaan"
  - Zin: Griekssprekende Joden noemden die dag pentēkostē, "de vijftigste", en daar komt ons woord Pinksteren vandaan.

### poiēma / poiēsis

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (poëzie)

- `script.js` — Efeziërs · expert · vraag 18 ("In Efeziërs 2:10 schrijft Paulus dat wij Gods …") (uitleg)
  - Betekenis/herkomst: "Paulus gebruikt het woord poiēma, "wat gemaakt is", "kunstwerk""
  - Zin: Paulus gebruikt het woord poiēma, "wat gemaakt is", "kunstwerk".
- `script.js` — Efeziërs · expert · vraag 18 ("In Efeziërs 2:10 schrijft Paulus dat wij Gods …") (uitleg)
  - Betekenis/herkomst: "waar ons woord "poëzie" vandaan komt"
  - Zin: Het komt van hetzelfde werkwoord als poiēsis, waar ons woord "poëzie" vandaan komt.

### polis / archōn (politarchen)

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (politiek, politie)

- `ontdekken-inhoud.js` — Wie is wie — bestuur › Stadsbestuurders (politarchen) (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "Het woord komt van *polis*, stad, en *archōn*, leider"
  - Zin: Het woord komt van *polis*, stad, en *archōn*, leider.
- `ontdekken-inhoud.js` — Wie is wie — bestuur › Stadsbestuurders (politarchen) (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "komen ook onze woorden politiek en politie"
  - Zin: Van *polis* komen ook onze woorden politiek en politie.

### politeuma

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Filippenzen · expert · vraag 13 ("Filippi was een Romeinse kolonie: de inwoners hadden …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord politeuma betekent "burgerschap""
  - Zin: Het Griekse woord politeuma betekent "burgerschap".

### pond / mina ⚠

- **Taal:** Grieks (bij het gewicht: woord niet genoemd)
- **Soort:** betekenis
- **⚠ Markering:** Twee betekenissen voor "pond": een gewicht van ongeveer 327 gram (Johannes 12:3) en een geldbedrag van honderd daglonen, de *mina* (Lucas 19:13). Dat is bewust: de vraag zegt zelf dat pond "niet altijd geld" betekent. Wel staat in het goede antwoord "ongeveer 300 gram" en in de uitleg "ongeveer 327 gram".

- `script.js` — Johannes · expert · vraag 15 (""Pond" betekent niet altijd geld. Waar gaat het …") (uitleg)
  - Betekenis/herkomst: "Het woord dat hier met 'pond' vertaald wordt, is een gewichtsmaat van ongeveer 327 gram"
  - Zin: Het woord dat hier met 'pond' vertaald wordt, is een gewichtsmaat van ongeveer 327 gram (een Romeins pond) — het gaat dus om het gewicht van de olie, niet om geld.
- `ontdekken-inhoud.js` — Geld in de Bijbel › Pond (ONTDEK_GELD)
  - Betekenis/herkomst: "In het Grieks heet dit een mina"
  - Zin: In het Grieks heet dit een mina.

### presbyteros / presbyteroi

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (priester)

- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Oudste (ouderling) (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Het woord betekent eigenlijk "oudere", van het Griekse *presbyteros*"
  - Zin: Het woord betekent eigenlijk "oudere", van het Griekse *presbyteros*.
- `kerken-katholiek-sacramenten.html` — sectie "De ziekenzalving"
  - Betekenis/herkomst: "is in het Grieks *presbyteroi*. Daar komt ons woord priester vandaan"
  - Zin: Het woord dat hier met "oudsten" vertaald is, is in het Grieks *presbyteroi*. Daar komt ons woord priester vandaan.

### prosēlytos

- **Taal:** Grieks
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — groepen › Proselieten (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "betekent "iemand die erbij gekomen is""
  - Zin: Het Griekse woord *prosēlytos* betekent "iemand die erbij gekomen is".

### Sanhedrin / synedrion ⚠

- **Taal:** Grieks (volgens de game)
- **Soort:** herkomst
- **⚠ Markering:** Tegenstrijdig: de vraag noemt *Sanhedrin* zelf het Griekse woord, het woordenboek zegt dat Sanhedrin *komt van* het Griekse *synedrion*. Het woordenboek klopt: in het Grieks van het Nieuwe Testament staat *synedrion*; Sanhedrin is de Hebreeuws-Aramese vorm daarvan.

- `script.js` — Handelingen · expert · vraag 13 ("De apostelen moesten voor "de Hoge Raad" verschijnen. …") (uitleg)
  - Betekenis/herkomst: "Deze raad heette in het Grieks het Sanhedrin"
  - Zin: Deze raad heette in het Grieks het Sanhedrin.
- `ontdekken-inhoud.js` — Wie is wie — tempel en Schrift › Hoge Raad (Sanhedrin) (ONTDEK_WIE_TEMPEL)
  - Betekenis/herkomst: "Het woord Sanhedrin komt van het Griekse *synedrion*: "samen zitten""
  - Zin: Het woord Sanhedrin komt van het Griekse *synedrion*: "samen zitten".

### stadion (stadie)

- **Taal:** Grieks
- **Soort:** betekenis + herkomst (stadion)

- `script.js` — Lucas · expert · vraag 16 ("Een 'stadie' was een afstandsmaat. Ongeveer hoe lang …") (uitleg)
  - Betekenis/herkomst: "Het Griekse woord is stadion, en daar komt ons woord voor het sportveld vandaan"
  - Zin: Het Griekse woord is stadion, en daar komt ons woord voor het sportveld vandaan: de hardloopbaan in een Grieks stadion was precies één stadie lang.

### synagōgē

- **Taal:** Grieks
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Woordenboek › Synagoge (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "betekent "bijeenkomst""
  - Zin: Het Griekse woord *synagōgē* betekent "bijeenkomst": eerst de mensen die samenkwamen, later ook het gebouw.

### tektōn

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Marcus · gevorderd · vraag 16 ("De mensen noemen Jezus "de timmerman". Wat maakte …") (uitleg)
  - Betekenis/herkomst: "het betekent vakman of bouwer"
  - Zin: Dat is breder dan ons 'timmerman': het betekent vakman of bouwer — iemand die met zijn handen maakt wat een dorp nodig heeft.
- `ontdekken-inhoud.js` — Wie is wie — beroepen › Timmerman (ONTDEK_WIE_BEROEPEN)
  - Betekenis/herkomst: "een vakman die bouwt, met hout, maar ook met steen"
  - Zin: In het Grieks staat hier *tektōn*: een vakman die bouwt, met hout, maar ook met steen.

### tetrarch

- **Taal:** Grieks (taal niet genoemd)
- **Soort:** betekenis

- `script.js` — Lucas · expert · vraag 23 ("Lucas noemt Herodes "tetrarch" van Galilea. Wat betekent …") (correct)
  - Betekenis/herkomst: "Bestuurder over een deel van een verdeeld rijk, lager in rang dan een koning"
  - Zin: Vraag: "Lucas noemt Herodes "tetrarch" van Galilea. Wat betekent dat woord?" — goed antwoord: "Bestuurder over een deel van een verdeeld rijk, lager in rang dan een koning"
- `script.js` — Lucas · expert · vraag 23 ("Lucas noemt Herodes "tetrarch" van Galilea. Wat betekent …") (uitleg)
  - Betekenis/herkomst: "letterlijk heerser over een vierde deel"
  - Zin: Ze werden tetrarch genoemd, letterlijk heerser over een vierde deel, maar in de praktijk was het gewoon de titel voor een vorst van lagere rang.
- `ontdekken-inhoud.js` — Wie is wie — bestuur › Tetrarch (viervorst) (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "Het woord betekent letterlijk "heerser over een vierde deel""
  - Zin: Het woord betekent letterlijk "heerser over een vierde deel".

### thriambeuō

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 19 ("In Kolossenzen 2:15 beschrijft Paulus de overwinning van …") (uitleg)
  - Betekenis/herkomst: "betekent "in een triomftocht meevoeren""
  - Zin: Het werkwoord thriambeuō betekent "in een triomftocht meevoeren".

### uitdoven (Grieks werkwoord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — 1 & 2 Tessalonicenzen · gevorderd · vraag 16 ("Paulus schrijft: "Doof de Geest niet uit." Aan …") (uitleg)
  - Betekenis/herkomst: "Het Griekse werkwoord werd gebruikt voor het blussen van een brand"
  - Zin: Het Griekse werkwoord werd gebruikt voor het blussen van een brand.

### wolk (Grieks woord niet genoemd)

- **Taal:** Grieks
- **Soort:** betekenis

- `script.js` — Hebreeën · expert · vraag 16 ("Hebreeën zegt dat alle geloofshelden die ons zijn …") (uitleg)
  - Betekenis/herkomst: "In het Grieks werd het woord voor wolk ook gebruikt voor een geweldige menigte mensen"
  - Zin: In het Grieks werd het woord voor wolk ook gebruikt voor een geweldige menigte mensen, ongeveer zoals wij spreken van een zee van mensen.

### zeloot

- **Taal:** Grieks (taal niet genoemd)
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — groepen › Zeloten (ijveraars) (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "Het woord zeloot betekent "ijveraar""
  - Zin: Het woord zeloot betekent "ijveraar": iemand die zich met hart en ziel voor iets inzet.

## Hebreeuws (9)

Hebreeuwse woorden. Namen staan bij Namen.

### Amen

- **Taal:** Hebreeuws
- **Soort:** betekenis

- `script.js` — Romeinen · expert · vraag 13 ("Paulus sluit een zin af met "Amen". Dat …") (correct)
  - Betekenis/herkomst: "Zo is het, het staat vast"
  - Zin: Vraag: "Paulus sluit een zin af met "Amen". Dat woord komt uit het Hebreeuws. Wat betekent het?" — goed antwoord: "Zo is het, het staat vast"
- `kerken-katholiek-mis.html` — sectie "De communie"
  - Betekenis/herkomst: "Dat betekent: "ja, zo is het""
  - Zin: Dat betekent: "ja, zo is het".

### bat

- **Taal:** Hebreeuws
- **Soort:** betekenis (maat)

- `script.js` — Lucas · expert · vraag 17 ("In de gelijkenis van de onrechtvaardige rentmeester was …") (uitleg)
  - Betekenis/herkomst: "naar de Hebreeuwse maat bat"
  - Zin: In het Grieks heet deze maat βάτος (batos), naar de Hebreeuwse maat bat.
- `ontdekken-inhoud.js` — Maten › Vat (ONTDEK_MATEN)
  - Betekenis/herkomst: "van het Hebreeuwse bat"
  - Zin: Vat (Grieks: batos, van het Hebreeuwse bat) — ongeveer 22 liter, zo'n twee volle emmers.

### Halleluja (hallelu, Jah)

- **Taal:** Hebreeuws
- **Soort:** betekenis

- `script.js` — Openbaring · gevorderd · vraag 14 ("In de hemel klinkt "Halleluja". Wat betekent dat …") (correct)
  - Betekenis/herkomst: "Prijs de HEER, in het Hebreeuws"
  - Zin: Vraag: "In de hemel klinkt "Halleluja". Wat betekent dat woord?" — goed antwoord: "Prijs de HEER, in het Hebreeuws"
- `script.js` — Openbaring · gevorderd · vraag 14 ("In de hemel klinkt "Halleluja". Wat betekent dat …") (uitleg)
  - Betekenis/herkomst: "Hallelu betekent "prijst", en Jah is de verkorte vorm van Gods naam"
  - Zin: Hallelu betekent "prijst", en Jah is de verkorte vorm van Gods naam.

### Hosanna

- **Taal:** Hebreeuws (taal niet genoemd)
- **Soort:** betekenis

- `script.js` — Marcus · expert · vraag 17 ("Bij Jezus' intocht in Jeruzalem roepen de mensen …") (correct)
  - Betekenis/herkomst: "Red ons"
  - Zin: Vraag: "Bij Jezus' intocht in Jeruzalem roepen de mensen "Hosanna!". Wat riepen ze daarmee eigenlijk?" — goed antwoord: "Red ons"

### Jom Kipoer

- **Taal:** Hebreeuws
- **Soort:** betekenis

- `script.js` — Hebreeën · expert · vraag 13 ("De brief aan de Hebreeën noemt de dag …") (uitleg)
  - Betekenis/herkomst: "De Grote Verzoendag, in het Hebreeuws Jom Kipoer"
  - Zin: De Grote Verzoendag, in het Hebreeuws Jom Kipoer, was de belangrijkste vastendag van het jaar.

### majim chajiem

- **Taal:** Hebreeuws
- **Soort:** betekenis

- `script.js` — Johannes · gevorderd · vraag 2 ("Jezus belooft de Samaritaanse vrouw 'levend water'. Wat …") (uitleg)
  - Betekenis/herkomst: "in het Hebreeuws van het Oude Testament majim chajiem"
  - Zin: De Bijbel maakt verschil tussen gewoon water en levend water, in het Hebreeuws van het Oude Testament majim chajiem.

### Messias ⚠

- **Taal:** Hebreeuws
- **Soort:** betekenis
- **⚠ Markering:** Verschil in nadruk: in Marcus (beginner) is het goede antwoord op "Wat betekent het woord Messias?" "De beloofde redder", met "de gezalfde" tussen haakjes. Elders is "de gezalfde" de betekenis en is "de beloofde redder" wie de Messias is.

- `script.js` — Marcus · beginner · vraag 10 ("Wat betekent het woord "Messias"? …") (correct)
  - Betekenis/herkomst: "De beloofde redder ("de gezalfde")"
  - Zin: Vraag: "Wat betekent het woord "Messias"?" — goed antwoord: "De beloofde redder ("de gezalfde")"
- `script.js` — Marcus · expert · vraag 14 (""Messias" is Hebreeuws voor "de gezalfde". Welk woord …") (vraag)
  - Betekenis/herkomst: ""Messias" is Hebreeuws voor "de gezalfde""
  - Zin: "Messias" is Hebreeuws voor "de gezalfde".
- `ontdekken-inhoud.js` — Woordenboek › Messias (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Een Hebreeuws woord dat "de gezalfde" betekent"
  - Zin: Een Hebreeuws woord dat "de gezalfde" betekent: iemand die met olie gezalfd werd als teken dat God hem uitkoos, zoals vroeger bij koningen.

### qadosj

- **Taal:** Hebreeuws
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Woordenboek › Heilig (heiligen) (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "In het Hebreeuws is dat *qadosj*"
  - Zin: In het Hebreeuws is dat *qadosj*, in het Grieks *hagios*.

### Rabbi / rabboeni ⚠

- **Taal:** Hebreeuws/Aramees (taal niet genoemd)
- **Soort:** betekenis
- **⚠ Markering:** Verschillende betekenis: "Meester" (vraag) tegenover "mijn meester" of "mijn leraar" (woordenboek).

- `script.js` — Johannes · gevorderd · vraag 14 ("Twee leerlingen noemen Jezus "Rabbi". Johannes vertelt er …") (correct)
  - Betekenis/herkomst: "Meester"
  - Zin: Vraag: "Twee leerlingen noemen Jezus "Rabbi". Johannes vertelt er meteen bij wat dat woord betekent. Wat is het?" — goed antwoord: "Meester"
- `ontdekken-inhoud.js` — Wie is wie — tempel en Schrift › Rabbi (rabboeni) (ONTDEK_WIE_TEMPEL)
  - Betekenis/herkomst: "Een aanspreekvorm die "mijn meester" of "mijn leraar" betekent"
  - Zin: Een aanspreekvorm die "mijn meester" of "mijn leraar" betekent, voor iemand die les gaf in de Schrift.

## Aramees (4)

Aramese woorden. Aramese namen en bijnamen (Kefas, Tabita, Kananeeër) staan bij Namen.

### Abba

- **Taal:** Aramees
- **Soort:** betekenis

- `script.js` — Marcus · expert · vraag 6 ("Welk Aramees woord sprak Jezus uit toen Hij …") (uitleg)
  - Betekenis/herkomst: "abba ('Vader')"
  - Zin: Zo doet hij het ook bij effata ('Ga open') en abba ('Vader').
- `script.js` — Galaten · expert · vraag 8 ("God zond de Geest van Zijn Zoon in …") (correct)
  - Betekenis/herkomst: "Abba, Vader!"
  - Zin: Vraag: "God zond de Geest van Zijn Zoon in ons hart. Wat roept die Geest volgens Paulus?" — goed antwoord: "Abba, Vader!"

### Effata

- **Taal:** Aramees
- **Soort:** betekenis

- `script.js` — Marcus · gevorderd · vraag 19 ("Als Jezus een dove man geneest, zegt Hij …") (correct)
  - Betekenis/herkomst: "Ga open"
  - Zin: Vraag: "Als Jezus een dove man geneest, zegt Hij "Effata". Marcus schrijft de vertaling er meteen bij. Wat betekent het?" — goed antwoord: "Ga open"
- `script.js` — Marcus · expert · vraag 6 ("Welk Aramees woord sprak Jezus uit toen Hij …") (uitleg)
  - Betekenis/herkomst: "effata ('Ga open')"
  - Zin: Zo doet hij het ook bij effata ('Ga open') en abba ('Vader').
- `script.js` — Johannes · expert · vraag 25 ("Welke talen sprak men in Israël in de …") (uitleg)
  - Betekenis/herkomst: "dat is de taal van Talita koem, Effata en Abba"
  - Zin: Thuis en op straat sprak men Aramees — dat is de taal van Talita koem, Effata en Abba.

### Maranata

- **Taal:** Aramees
- **Soort:** betekenis

- `script.js` — 1 & 2 Korintiërs · expert · vraag 14 ("Aan het slot van zijn brief schrijft Paulus …") (correct)
  - Betekenis/herkomst: "Kom, Heer!"
  - Zin: Vraag: "Aan het slot van zijn brief schrijft Paulus één woord in het Aramees: "Maranata". Wat betekent het?" — goed antwoord: "Kom, Heer!"

### Talita koemi / Talita koem ⚠

- **Taal:** Aramees
- **Soort:** betekenis
- **⚠ Markering:** Schrijfwijze verschilt: *Talita koemi* (Marcus, vraag én uitleg) tegenover *Talita koem* (Johannes, uitleg). Bij Johannes staat geen betekenis.

- `script.js` — Marcus · expert · vraag 6 ("Welk Aramees woord sprak Jezus uit toen Hij …") (uitleg)
  - Betekenis/herkomst: "Talita koemi betekent 'Meisje, sta op'"
  - Zin: Talita koemi betekent 'Meisje, sta op'.
- `script.js` — Johannes · expert · vraag 25 ("Welke talen sprak men in Israël in de …") (uitleg)
  - Betekenis/herkomst: "dat is de taal van Talita koem, Effata en Abba"
  - Zin: Thuis en op straat sprak men Aramees — dat is de taal van Talita koem, Effata en Abba.

## Latijn (9)

Latijnse woorden.

### Caesar ("kaisar")

- **Taal:** Latijn
- **Soort:** herkomst (keizer)

- `ontdekken-inhoud.js` — Wie is wie — bestuur › Keizer (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "In het Latijn sprak je Caesar uit als "kaisar", en daar komt ons woord keizer vandaan"
  - Zin: In het Latijn sprak je Caesar uit als "kaisar", en daar komt ons woord keizer vandaan.

### centurio / centum

- **Taal:** Latijn
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — leger › Honderdman (centurio) (ONTDEK_WIE_LEGER)
  - Betekenis/herkomst: "In het Latijn heette hij centurio, van *centum*, honderd"
  - Zin: In het Latijn heette hij centurio, van *centum*, honderd.

### cilicium

- **Taal:** Latijn (taal niet genoemd)
- **Soort:** betekenis + herkomst

- `script.js` — Handelingen · expert · vraag 20 ("Paulus verdiende zijn brood als tentenmaker. Waarvan werden …") (uitleg)
  - Betekenis/herkomst: "heette cilicium: geweven geitenhaar"
  - Zin: De stof waarvan die tenten werden gemaakt, heette cilicium: geweven geitenhaar, ruw en stug, maar zo dicht dat er geen regen doorheen kwam.
- `script.js` — Handelingen · expert · vraag 20 ("Paulus verdiende zijn brood als tentenmaker. Waarvan werden …") (uitleg)
  - Betekenis/herkomst: "De naam komt van Cilicië"
  - Zin: De naam komt van Cilicië, de streek waar de geiten vandaan kwamen — en dat is precies de streek waar Paulus geboren was, want Tarsus lag daar.

### ecclesia

- **Taal:** Latijn
- **Soort:** herkomst (église, iglesia, chiesa)

- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (uitleg)
  - Betekenis/herkomst: "in het Latijn werd het ecclesia"
  - Zin: Het Griekse ekklesia ging een andere weg: in het Latijn werd het ecclesia, en daaruit ontstonden het Franse église, het Spaanse iglesia en het Italiaanse chiesa.

### Ite, missa est / missa

- **Taal:** Latijn
- **Soort:** betekenis + herkomst (Mis)

- `kerken-katholiek-mis.html` — sectie "Wat je daarna doet"
  - Betekenis/herkomst: "*Missa* komt van het woord voor zenden, en daar komt ons woord Mis vandaan"
  - Zin: *Missa* komt van het woord voor zenden, en daar komt ons woord Mis vandaan.

### pastor

- **Taal:** Latijn
- **Soort:** betekenis + herkomst (pastoor, pastor)

- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Herder (in de gemeente) (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Het Latijnse woord voor herder is *pastor*"
  - Zin: Het Latijnse woord voor herder is *pastor*.

### pretorium

- **Taal:** Latijn (taal niet genoemd)
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — leger › Pretorium (ONTDEK_WIE_LEGER)
  - Betekenis/herkomst: "Eerst was het pretorium de tent van een Romeinse veldheer"
  - Zin: Eerst was het pretorium de tent van een Romeinse veldheer.

### sacramentum

- **Taal:** Latijn
- **Soort:** herkomst (sacrament)

- `kerken-katholiek-sacramenten.html` — sectie "Het huwelijk"
  - Betekenis/herkomst: "Uit dat woord komt ons woord sacrament"
  - Zin: Uit dat woord komt ons woord sacrament.

### sanctus

- **Taal:** Latijn
- **Soort:** betekenis + herkomst (sint)

- `ontdekken-inhoud.js` — Woordenboek › Heilig (heiligen) (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "het woordje "sint" komt van het Latijnse *sanctus*, "heilig""
  - Zin: Sint-Maarten en Sint-Nicolaas zijn daar bekende voorbeelden van; het woordje "sint" komt van het Latijnse *sanctus*, "heilig".

## Namen (25)

Namen van personen, plaatsen en groepen waarvan de game de betekenis of herkomst geeft.

### Areopagus (Marsheuvel)

- **Taal:** Grieks
- **Soort:** naam

- `script.js` — Handelingen · expert · vraag 21 ("Paulus werd meegenomen naar de Areopagus in Athene. …") (uitleg)
  - Betekenis/herkomst: "De naam betekent "heuvel van Ares""
  - Zin: De naam betekent "heuvel van Ares", de Griekse oorlogsgod — de Romeinen noemden hem Mars, vandaar dat je ook "Marsheuvel" leest.

### Babylon

- **Taal:** —
- **Soort:** naam (bijnaam)

- `script.js` — Petrus & Judas · expert · vraag 15 ("Aan het einde van zijn eerste brief stuurt …") (uitleg)
  - Betekenis/herkomst: ""Babylon" was toen een bijnaam voor Rome"
  - Zin: "Babylon" was toen een bijnaam voor Rome: de grote stad die macht heeft over de wereld en Gods volk vervolgt.

### Baptisten (baptizo)

- **Taal:** Grieks
- **Soort:** naam

- `kerken-protestant-kerken.html` — sectie "De baptisten"
  - Betekenis/herkomst: "De naam zegt het al: baptizo is Grieks voor dopen"
  - Zin: De naam zegt het al: baptizo is Grieks voor dopen.

### Barnabas

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Handelingen · beginner · vraag 14 ("Barnabas verkocht een stuk land en bracht het …") (correct)
  - Betekenis/herkomst: "Zoon van de vertroosting"
  - Zin: Vraag: "Barnabas verkocht een stuk land en bracht het geld naar de apostelen. Wat betekent de bijnaam Barnabas, die de apostelen hem gaven?" — goed antwoord: "Zoon van de vertroosting"

### Boanerges

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Marcus · expert · vraag 18 ("Jakobus en Johannes kregen van Jezus de bijnaam …") (correct)
  - Betekenis/herkomst: "Zonen van de donder"
  - Zin: Vraag: "Jakobus en Johannes kregen van Jezus de bijnaam Boanerges. Marcus vertelt erbij wat dat betekent. Wat is het?" — goed antwoord: "Zonen van de donder"

### Dekapolis

- **Taal:** Grieks (taal niet genoemd)
- **Soort:** naam

- `script.js` — Marcus · expert · vraag 22 ("De genezen man ging het verhaal vertellen in …") (uitleg)
  - Betekenis/herkomst: "Dekapolis betekent letterlijk tien steden"
  - Zin: Dekapolis betekent letterlijk tien steden.

### Dode Zee

- **Taal:** Nederlands
- **Soort:** naam

- `script.js` — Johannes · expert · vraag 12 ("Je kunt in de Dode Zee gaan zwemmen …") (uitleg)
  - Betekenis/herkomst: "vandaar de naam"
  - Zin: Het water zit zó vol zout dat er geen vis of plant in kan leven — vandaar de naam.

### Epicureeërs

- **Taal:** —
- **Soort:** naam

- `ontdekken-inhoud.js` — Wie is wie — groepen › Epicureeërs en stoïcijnen (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "De epicureeërs volgden de leraar Epicurus"
  - Zin: De epicureeërs volgden de leraar Epicurus: volgens hen was het doel van het leven een rustig bestaan, zonder angst en pijn, en bemoeiden de goden zich niet met mensen.

### Farizeeën (perushim)

- **Taal:** Hebreeuws
- **Soort:** naam

- `ontdekken-inhoud.js` — Wie is wie — groepen › Farizeeën (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "Hun naam komt van het Hebreeuwse *perushim*: "de afgezonderden""
  - Zin: Hun naam komt van het Hebreeuwse *perushim*: "de afgezonderden".

### Gennesaret

- **Taal:** —
- **Soort:** naam

- `script.js` — Johannes · expert · vraag 32 ("Het meer van Galilea heeft in de Bijbel …") (uitleg)
  - Betekenis/herkomst: "naar de vruchtbare vlakte aan de westoever"
  - Zin: Lucas noemt het het meer van Gennesaret (Lucas 5:1), naar de vruchtbare vlakte aan de westoever.

### Getsemane

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Marcus · expert · vraag 20 ("Jezus ging bidden in Getsemane, een plek met …") (correct)
  - Betekenis/herkomst: "Olijfpers"
  - Zin: Vraag: "Jezus ging bidden in Getsemane, een plek met olijfbomen. Wat betekent die naam?" — goed antwoord: "Olijfpers"

### Hebreeën

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Verborgen Schat (verborgenSchatVragen) · vraag 10 ("Het boek Hebreeën dankt zijn naam aan een …") (correct)
  - Betekenis/herkomst: "Een oude aanduiding voor het Joodse volk"
  - Zin: Vraag: "Het boek Hebreeën dankt zijn naam aan een oud woord. Wat betekent "Hebreeën"?" — goed antwoord: "Een oude aanduiding voor het Joodse volk"

### Immanuël

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Matteüs · expert · vraag 7 ("Wat betekent de naam Immanuël, die in Matteüs …") (correct)
  - Betekenis/herkomst: "God met ons"
  - Zin: Vraag: "Wat betekent de naam Immanuël, die in Matteüs wordt uitgelegd?" — goed antwoord: "God met ons"

### Kananeeër

- **Taal:** Aramees
- **Soort:** naam (bijnaam)

- `ontdekken-inhoud.js` — Wie is wie — groepen › Zeloten (ijveraars) (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "dat is hetzelfde woord in het Aramees"
  - Zin: In Matteüs en Marcus heet hij Simon de Kananeeër; dat is hetzelfde woord in het Aramees, en het heeft niets met het land Kanaän te maken.

### Kandake

- **Taal:** —
- **Soort:** naam (titel)

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Kamerheer (hoveling) (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: "Kandake was geen naam maar de titel van de koningin"
  - Zin: Ethiopië was toen het rijk ten zuiden van Egypte, ongeveer waar nu Soedan ligt, en Kandake was geen naam maar de titel van de koningin.

### Kefas

- **Taal:** Aramees
- **Soort:** naam (bijnaam)

- `script.js` — Johannes · expert · vraag 7 ("Wat was de bijnaam (in het Aramees: Kefas) …") (correct)
  - Betekenis/herkomst: "De rots"
  - Zin: Vraag: "Wat was de bijnaam (in het Aramees: Kefas) die Jezus aan Simon Petrus gaf, toen Andreas hem bij Jezus bracht?" — goed antwoord: "De rots"

### Kinneret

- **Taal:** Hebreeuws
- **Soort:** naam

- `script.js` — Johannes · expert · vraag 32 ("Het meer van Galilea heeft in de Bijbel …") (uitleg)
  - Betekenis/herkomst: "Die naam komt misschien van het Hebreeuwse woord voor een harp"
  - Zin: Die naam komt misschien van het Hebreeuwse woord voor een harp, omdat het meer die vorm heeft.

### Lazarus

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Johannes · beginner · vraag 6 ("Welke vriend van Jezus uit Betanië werd door …") (uitleg)
  - Betekenis/herkomst: "De naam betekent 'God helpt'"
  - Zin: De naam betekent 'God helpt' en kwam in die tijd veel voor.

### Onesimus

- **Taal:** Grieks
- **Soort:** naam

- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 5 ("De naam Onesimus betekent "nuttig". Welke woordgrap maakt …") (vraag)
  - Betekenis/herkomst: "De naam Onesimus betekent "nuttig""
  - Zin: De naam Onesimus betekent "nuttig".
- `script.js` — Kolossenzen & Filemon · gevorderd · vraag 5 ("De naam Onesimus betekent "nuttig". Welke woordgrap maakt …") (uitleg)
  - Betekenis/herkomst: "Onesimus is een Griekse naam en betekent 'nuttig'"
  - Zin: Onesimus is een Griekse naam en betekent 'nuttig'.

### Petrus

- **Taal:** taal niet genoemd
- **Soort:** naam (bijnaam)

- `kerken-katholiek-petrus.html` — sectie "Petrus en de paus"
  - Betekenis/herkomst: "Jezus noemde hem Petrus — dat betekent "rots""
  - Zin: Jezus noemde hem Petrus — dat betekent "rots".

### Sadduceeën

- **Taal:** —
- **Soort:** naam

- `ontdekken-inhoud.js` — Wie is wie — groepen › Sadduceeën (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "Hun naam komt van Sadok"
  - Zin: Hun naam komt van Sadok, de hogepriester in de tijd van koning David en koning Salomo; de belangrijkste priesterfamilies stamden van hem af.

### Siloam

- **Taal:** taal niet genoemd
- **Soort:** naam

- `script.js` — Johannes · expert · vraag 21 ("Jezus stuurt een blinde man naar het badwater …") (correct)
  - Betekenis/herkomst: "Gezonden"
  - Zin: Vraag: "Jezus stuurt een blinde man naar het badwater Siloam. Johannes schrijft erbij wat die naam betekent. Wat is het?" — goed antwoord: "Gezonden"

### Stoïcijnen

- **Taal:** —
- **Soort:** naam

- `ontdekken-inhoud.js` — Wie is wie — groepen › Epicureeërs en stoïcijnen (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "De stoïcijnen waren genoemd naar de Stoa, een zuilengang in Athene"
  - Zin: De stoïcijnen waren genoemd naar de Stoa, een zuilengang in Athene waar hun eerste leraar lesgaf.

### Tabita / Dorkas

- **Taal:** Aramees / Grieks
- **Soort:** naam

- `script.js` — Handelingen · expert · vraag 2 ("In de stad Joppe maakte Petrus een vrouw …") (uitleg)
  - Betekenis/herkomst: "Allebei betekenen ze gazelle"
  - Zin: Allebei betekenen ze gazelle.

### Tiberias

- **Taal:** —
- **Soort:** naam

- `script.js` — Johannes · expert · vraag 32 ("Het meer van Galilea heeft in de Bijbel …") (uitleg)
  - Betekenis/herkomst: "vernoemde naar keizer Tiberius"
  - Zin: Johannes noemt het ook het meer van Tiberias (Johannes 6:1), naar de stad die Herodes Antipas aan de oever bouwde en vernoemde naar keizer Tiberius.

## Nederlandse herkomst (30)

Nederlandse woorden waarvan de game de herkomst geeft ("daar komt ons woord … vandaan"), plus drie oude Nederlandse woorden die in de game worden verklaard. Staat het brontwoord ook in een andere groep, dan zijn de vindplaatsen hier dezelfde; de uitspraak over het Nederlandse woord is wat hier telt.

### aarts- (aartsengel, aartsvader)

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — tempel en Schrift › Hogepriester (ONTDEK_WIE_TEMPEL)
  - Betekenis/herkomst: "daar komt ons "aarts-" vandaan"
  - Zin: Het begin, *archi-*, betekent "hoogste" of "eerste"; daar komt ons "aarts-" vandaan, zoals in aartsengel en aartsvader.

### apocalyps

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `script.js` — Openbaring · gevorderd · vraag 12 ("Het laatste boek van de Bijbel heet "Openbaring". …") (uitleg)
  - Betekenis/herkomst: "Van datzelfde woord komt ons woord "apocalyps""
  - Zin: Van datzelfde woord komt ons woord "apocalyps".

### architect

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — beroepen › Bouwmeester (ONTDEK_WIE_BEROEPEN)
  - Betekenis/herkomst: "daar komt ons woord architect vandaan"
  - Zin: Het Griekse woord is *architektōn*, en daar komt ons woord architect vandaan.

### bende

- **Taal:** Nederlands (oud)
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Wie is wie — leger › Cohort (afdeling) (ONTDEK_WIE_LEGER)
  - Betekenis/herkomst: "dat betekent gewoon een groep soldaten"
  - Zin: Oudere vertalingen zeggen hier soms "bende", maar dat betekent gewoon een groep soldaten.

### bisschop

- **Taal:** uit het Grieks, via het Latijn
- **Soort:** herkomst

- `script.js` — Timoteüs & Titus · gevorderd · vraag 15 ("Paulus schrijft over wie "opziener" wil worden. Wat …") (uitleg)
  - Betekenis/herkomst: "Via het Latijn is daar later ons woord "bisschop" uit ontstaan"
  - Zin: Via het Latijn is daar later ons woord "bisschop" uit ontstaan.
- `ontdekken-inhoud.js` — Woordenboek › Bisschop (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Het woord komt via het Latijn van het Griekse *episkopos*"
  - Zin: Het woord komt via het Latijn van het Griekse *episkopos*: iemand die toezicht houdt.
- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Opziener (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Via het Latijn is daar later ons woord "bisschop" uit ontstaan"
  - Zin: Via het Latijn is daar later ons woord "bisschop" uit ontstaan.

### economie

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Rentmeester (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: "daar komt ons woord economie vandaan"
  - Zin: Het Griekse woord is *oikonomos*, "die het huis regelt", en daar komt ons woord economie vandaan.

### el

- **Taal:** Nederlands
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Maten › El (ONTDEK_MATEN)
  - Betekenis/herkomst: "zo lang als de afstand van je elleboog tot je vingertoppen"
  - Zin: El — ongeveer 45 centimeter, zo lang als de afstand van je elleboog tot je vingertoppen.

### engel

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Evangelist (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Van dat laatste woord komt ook ons woord engel"
  - Zin: Van dat laatste woord komt ook ons woord engel: een bode van God.

### keizer

- **Taal:** uit het Latijn
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — bestuur › Keizer (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "Het woord komt van Caesar, de familienaam van Julius Caesar"
  - Zin: Het woord komt van Caesar, de familienaam van Julius Caesar; de keizers na hem namen die naam aan als titel.

### kerk

- **Taal:** uit het Grieks, via het Germaans
- **Soort:** herkomst

- `script.js` — Brieven van Johannes · expert · vraag 24 ("In de derde brief van Johannes staat het …") (uitleg)
  - Betekenis/herkomst: "Via het Germaans werd dat kerk in het Nederlands"
  - Zin: Via het Germaans werd dat kerk in het Nederlands, Kirche in het Duits, church in het Engels en kirke in het Deens.
- `ontdekken-inhoud.js` — Woordenboek › Kerk (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Ons woord kerk komt van een ánder Grieks woord"
  - Zin: Ons woord kerk komt van een ánder Grieks woord: κυριακόν (*kuriakon*).

### martelaar

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `script.js` — Openbaring · expert · vraag 14 ("Jezus noemt Antipas van Pergamum "Mijn trouwe getuige". …") (vraag)
  - Betekenis/herkomst: "Uit dat Griekse woord voor getuige is een Nederlands woord ontstaan"
  - Zin: Uit dat Griekse woord voor getuige is een Nederlands woord ontstaan.

### Mis

- **Taal:** uit het Latijn
- **Soort:** herkomst

- `kerken-katholiek-mis.html` — sectie "Wat je daarna doet"
  - Betekenis/herkomst: "daar komt ons woord Mis vandaan"
  - Zin: *Missa* komt van het woord voor zenden, en daar komt ons woord Mis vandaan.

### nachtwaak

- **Taal:** Nederlands
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Tijd › Nachtwaak (ONTDEK_TIJD)
  - Betekenis/herkomst: "Wachters losten elkaar per wacht af — vandaar de naam"
  - Zin: Wachters losten elkaar per wacht af — vandaar de naam.

### pastoor / pastor

- **Taal:** uit het Latijn
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — gemeenten › Herder (in de gemeente) (ONTDEK_WIE_GEMEENTEN)
  - Betekenis/herkomst: "Daar komen onze woorden pastoor en pastor vandaan"
  - Zin: Daar komen onze woorden pastoor en pastor vandaan: de pastoor van een parochie en de pastor van een gemeente heten dus eigenlijk herder.

### pedagoog

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — huishouden › Tuchtmeester (opvoeder) (ONTDEK_WIE_HUISHOUDEN)
  - Betekenis/herkomst: "daar komt ons woord pedagoog vandaan"
  - Zin: Het Griekse woord is *paidagōgos*, "kindergeleider", en daar komt ons woord pedagoog vandaan.

### penning

- **Taal:** Nederlands (oud)
- **Soort:** betekenis

- `ontdekken-inhoud.js` — Geld in de Bijbel › Lepton (ONTDEK_GELD)
  - Betekenis/herkomst: "penning daar geen naam van één munt is, maar gewoon 'geldstuk' betekent"
  - Zin: Dat komt doordat penning daar geen naam van één munt is, maar gewoon 'geldstuk' betekent — een keuze die vierhonderd jaar geleden goed te begrijpen was, omdat de vertalers de muntnamen gebruikten die hun lezers kenden.

### Pinksteren

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `script.js` — Handelingen · expert · vraag 19 ("De Heilige Geest kwam op de dag dat …") (uitleg)
  - Betekenis/herkomst: "daar komt ons woord Pinksteren vandaan"
  - Zin: Griekssprekende Joden noemden die dag pentēkostē, "de vijftigste", en daar komt ons woord Pinksteren vandaan.

### politiek / politie

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — bestuur › Stadsbestuurders (politarchen) (ONTDEK_WIE_BESTUUR)
  - Betekenis/herkomst: "komen ook onze woorden politiek en politie"
  - Zin: Van *polis* komen ook onze woorden politiek en politie.
- `script.js` — Efeziërs · expert · vraag 18 ("In Efeziërs 2:10 schrijft Paulus dat wij Gods …") (uitleg)
  - Betekenis/herkomst: ""Politiek" en "pedagoog" komen ook uit het Grieks"
  - Zin: "Politiek" en "pedagoog" komen ook uit het Grieks, maar van andere woorden.

### poëzie

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `script.js` — Efeziërs · expert · vraag 18 ("In Efeziërs 2:10 schrijft Paulus dat wij Gods …") (correct)
  - Betekenis/herkomst: "Poëzie"
  - Zin: Vraag: "In Efeziërs 2:10 schrijft Paulus dat wij Gods maaksel zijn. Welk Nederlands woord komt van dezelfde Griekse stam als het woord dat hij gebruikt?" — goed antwoord: "Poëzie"
- `script.js` — Efeziërs · expert · vraag 18 ("In Efeziërs 2:10 schrijft Paulus dat wij Gods …") (uitleg)
  - Betekenis/herkomst: "waar ons woord "poëzie" vandaan komt"
  - Zin: Het komt van hetzelfde werkwoord als poiēsis, waar ons woord "poëzie" vandaan komt.

### priester

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `kerken-katholiek-sacramenten.html` — sectie "De ziekenzalving"
  - Betekenis/herkomst: "Daar komt ons woord priester vandaan"
  - Zin: Daar komt ons woord priester vandaan.

### sacrament

- **Taal:** uit het Latijn
- **Soort:** herkomst

- `kerken-katholiek-sacramenten.html` — sectie "Het huwelijk"
  - Betekenis/herkomst: "Uit dat woord komt ons woord sacrament"
  - Zin: Uit dat woord komt ons woord sacrament.

### simonie

- **Taal:** Nederlands, naar Simon
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — groepen › Tovenaars (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "Daarom heet het kopen van een kerkelijk ambt nu nog "simonie""
  - Zin: Daarom heet het kopen van een kerkelijk ambt nu nog "simonie".

### sint

- **Taal:** uit het Latijn
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Woordenboek › Heilig (heiligen) (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "het woordje "sint" komt van het Latijnse"
  - Zin: Sint-Maarten en Sint-Nicolaas zijn daar bekende voorbeelden van; het woordje "sint" komt van het Latijnse *sanctus*, "heilig".

### stadion

- **Taal:** uit het Grieks
- **Soort:** herkomst

- `script.js` — Lucas · expert · vraag 16 ("Een 'stadie' was een afstandsmaat. Ongeveer hoe lang …") (uitleg)
  - Betekenis/herkomst: "daar komt ons woord voor het sportveld vandaan"
  - Zin: Het Griekse woord is stadion, en daar komt ons woord voor het sportveld vandaan: de hardloopbaan in een Grieks stadion was precies één stadie lang.

### stoïcijns

- **Taal:** naar de Stoa
- **Soort:** herkomst

- `ontdekken-inhoud.js` — Wie is wie — groepen › Epicureeërs en stoïcijnen (ONTDEK_WIE_GROEPEN)
  - Betekenis/herkomst: "Als je nu zegt dat iemand ergens stoïcijns onder blijft"
  - Zin: Als je nu zegt dat iemand ergens stoïcijns onder blijft, bedoel je nog steeds dat hij heel rustig blijft.

### voorspraak

- **Taal:** Nederlands (oud)
- **Soort:** betekenis

- `script.js` — Brieven van Johannes · expert · vraag 4 ("Johannes schrijft dat gelovigen die tóch verkeerd doen …") (uitleg)
  - Betekenis/herkomst: "Voorspraak is een oud woord voor iemand die het woord voor je doet"
  - Zin: Voorspraak is een oud woord voor iemand die het woord voor je doet.

### Wekenfeest

- **Taal:** Nederlands
- **Soort:** herkomst

- `script.js` — Handelingen · expert · vraag 19 ("De Heilige Geest kwam op de dag dat …") (correct)
  - Betekenis/herkomst: "Het viel zeven weken na Pesach, aan het eind van de graanoogst"
  - Zin: Vraag: "De Heilige Geest kwam op de dag dat de Joden het Wekenfeest vierden. Waar komt die naam vandaan?" — goed antwoord: "Het viel zeven weken na Pesach, aan het eind van de graanoogst"

### zoen / verzoening

- **Taal:** Middelnederlands
- **Soort:** herkomst

- `script.js` — Brieven van Johannes · expert · vraag 25 ("Johannes noemt Jezus de "verzoening" voor onze zonden. …") (correct)
  - Betekenis/herkomst: "Zoen betekende eerst verzoening of vrede, en pas later een kus"
  - Zin: Vraag: "Johannes noemt Jezus de "verzoening" voor onze zonden. Het Nederlandse woord verzoening hangt samen met het woord zoen. Hoe zit dat?" — goed antwoord: "Zoen betekende eerst verzoening of vrede, en pas later een kus"
- `script.js` — Brieven van Johannes · expert · vraag 25 ("Johannes noemt Jezus de "verzoening" voor onze zonden. …") (uitleg)
  - Betekenis/herkomst: "In het Middelnederlands was een "soene" een vrede of een goedmaking"
  - Zin: In het Middelnederlands was een "soene" een vrede of een goedmaking.

### zonde ⚠

- **Taal:** taal niet genoemd ("het oude woord")
- **Soort:** betekenis
- **⚠ Markering:** Verschillende betekenis: volgens de vraag betekent "zonde" eigenlijk "iets verkeerds doen" en is "je doel missen" het beeld waarmee het wordt uitgelegd. Volgens het woordenboek betekent het oude woord zelf "je doel missen". Geen van beide zegt om welke taal het gaat; "je doel missen" past bij het Griekse *hamartia* en het Hebreeuwse *chatta't*, niet bij het Nederlandse woord zonde.

- `script.js` — Lucas · gevorderd · vraag 13 ("Het woord "zonde" betekent eigenlijk iets verkeerds doen. …") (vraag)
  - Betekenis/herkomst: "Het woord "zonde" betekent eigenlijk iets verkeerds doen"
  - Zin: Het woord "zonde" betekent eigenlijk iets verkeerds doen.
- `script.js` — Lucas · gevorderd · vraag 13 ("Het woord "zonde" betekent eigenlijk iets verkeerds doen. …") (correct)
  - Betekenis/herkomst: "Je doel missen, zoals een pijl die net naast de roos schiet"
  - Zin: Vraag: "Het woord "zonde" betekent eigenlijk iets verkeerds doen. Met welk beeld wordt dat oude woord vaak uitgelegd?" — goed antwoord: "Je doel missen, zoals een pijl die net naast de roos schiet"
- `ontdekken-inhoud.js` — Woordenboek › Zonde (ONTDEK_WOORDENBOEK)
  - Betekenis/herkomst: "Het oude woord betekent eigenlijk "je doel missen""
  - Zin: Het oude woord betekent eigenlijk "je doel missen" — alsof je met een pijl op de roos mikt en er net naast schiet.

### zondebok

- **Taal:** Nederlands
- **Soort:** herkomst

- `script.js` — Hebreeën · expert · vraag 13 ("De brief aan de Hebreeën noemt de dag …") (uitleg)
  - Betekenis/herkomst: "daar komt het beeld van de zondebok vandaan"
  - Zin: Daarna werd een tweede bok de woestijn in gestuurd, symbolisch beladen met de zonden van het volk — daar komt het beeld van de zondebok vandaan.

## Markeringen op een rij

- **ekklesia / ekklèsia** (Grieks): Schrijfwijze verschilt: *ekklesia* (twee vragen) tegenover *ekklèsia* (woordenboek, ook met Grieks schrift). De betekenis wordt ook verschillend gegeven: "vergadering" (Tessalonicenzen), "de mensen die bij elkaar geroepen zijn" (Johannes), "de groep die bij elkaar geroepen is" (woordenboek); die drie spreken elkaar niet tegen.
- **kuriakon / kyriakon (en kurios)** (Grieks): Schrijfwijze verschilt: *kyriakon* (vraag) tegenover *kuriakon* en *kurios* (woordenboek). Betekenis is gelijk.
- **pond / mina** (Grieks): Twee betekenissen voor "pond": een gewicht van ongeveer 327 gram (Johannes 12:3) en een geldbedrag van honderd daglonen, de *mina* (Lucas 19:13). Dat is bewust: de vraag zegt zelf dat pond "niet altijd geld" betekent. Wel staat in het goede antwoord "ongeveer 300 gram" en in de uitleg "ongeveer 327 gram".
- **Sanhedrin / synedrion** (Grieks): Tegenstrijdig: de vraag noemt *Sanhedrin* zelf het Griekse woord, het woordenboek zegt dat Sanhedrin *komt van* het Griekse *synedrion*. Het woordenboek klopt: in het Grieks van het Nieuwe Testament staat *synedrion*; Sanhedrin is de Hebreeuws-Aramese vorm daarvan.
- **Messias** (Hebreeuws): Verschil in nadruk: in Marcus (beginner) is het goede antwoord op "Wat betekent het woord Messias?" "De beloofde redder", met "de gezalfde" tussen haakjes. Elders is "de gezalfde" de betekenis en is "de beloofde redder" wie de Messias is.
- **Rabbi / rabboeni** (Hebreeuws): Verschillende betekenis: "Meester" (vraag) tegenover "mijn meester" of "mijn leraar" (woordenboek).
- **Talita koemi / Talita koem** (Aramees): Schrijfwijze verschilt: *Talita koemi* (Marcus, vraag én uitleg) tegenover *Talita koem* (Johannes, uitleg). Bij Johannes staat geen betekenis.
- **zonde** (Nederlandse herkomst): Verschillende betekenis: volgens de vraag betekent "zonde" eigenlijk "iets verkeerds doen" en is "je doel missen" het beeld waarmee het wordt uitgelegd. Volgens het woordenboek betekent het oude woord zelf "je doel missen". Geen van beide zegt om welke taal het gaat; "je doel missen" past bij het Griekse *hamartia* en het Hebreeuwse *chatta't*, niet bij het Nederlandse woord zonde.

## Wat verder opviel

- **Drie manieren van transcriberen.** Grieks staat soms met lengtestreepjes (*tektōn*, *pentēkostē*, *poiēma*, *paidagōgos*, *archōn*), soms zonder (*ekklesia*, *parakletos*, *parousia*, *koinonia*, *episkopos*), en één keer met een accent (*ekklèsia*). Ook *kyriakon* en *kuriakon* staan naast elkaar. Bij een paar woorden staat het Griekse schrift erbij (τέκτων, ἀποκάλυψις, μάρτυς, στέφανος, διάδημα, βάτος, κόρος, ἐκκλησία, κυριακόν), bij de meeste niet.
- **Taal niet altijd genoemd.** Bij Hosanna, Rabbi, Getsemane, Boanerges, Barnabas, Immanuël, Lazarus en Siloam geeft de game de betekenis, maar niet uit welke taal het woord komt. Bij Abba en Effata gebeurt dat wel, maar alleen in de uitleg bij een andere vraag.
- **Overlap tussen woordenboek en vragen.** Bij episkopos, ekklesia, kerk, tetrarch, apostel en evangelie geven woordenboek en vragen dezelfde uitleg, soms woordelijk (Opziener in Wie is wie en de uitleg bij Timoteüs & Titus · gevorderd · vraag 15 zijn vrijwel gelijk).

---

# Controles van de woordverklaringen

Elke controle krijgt een eigen sectie, met dezelfde indeling: KLOPT NIET, KLOPT MAAR KAN PRECIEZER, KLOPT, met de grondslag erbij. De inventaris hierboven blijft zoals hij is; correcties gebeuren in de game zelf.

## Controle 1 — Claude Code (1 okt 2026, uit het geheugen, niet nageslagen)

Getoetst aan de standaardwerken zoals ik ze ken: BDAG (Grieks), HALOT en Gesenius (Hebreeuws), Jastrow en Sokoloff (Aramees), Lewis & Short (Latijn), Philippa e.a., *Etymologisch Woordenboek van het Nederlands* (EWN), en het NA28-apparaat voor de tekstvarianten. Die werken zijn bij deze controle níet opengeslagen; elk oordeel is "naar mijn beste weten". Waar ik twijfel, staat dat erbij.

Uitkomst over de 136 woorden: **2 KLOPT NIET**, **26 KLOPT MAAR KAN PRECIEZER**, **108 KLOPT**.

### KLOPT NIET (2)

- **Sanhedrin** — Handelingen · expert · 13: "Deze raad heette in het Grieks het Sanhedrin". In het Grieks van het Nieuwe Testament staat *synedrion*; *Sanhedrin* is het Hebreeuws-Aramese leenwoord daarvan (zo in de Misjna). Het woordenboek heeft het wél goed ("komt van het Griekse *synedrion*: 'samen zitten'"). *Grondslag: BDAG s.v. συνέδριον; Jastrow s.v. סנהדרין.*
- **zonde** — woordenboek: "Het oude woord betekent eigenlijk 'je doel missen'". Dat geldt niet voor het Nederlandse woord *zonde* (Germaans \*sundjō, "schuld"). "Je doel missen" hoort bij het Griekse *hamartanō*/*hamartia* en het Hebreeuwse *chata*/*chatta't*. Juist dus, mits de taal genoemd wordt. De vraag bij Lucas (gevorderd · 13) is voorzichtiger ("met welk beeld wordt dat oude woord vaak uitgelegd") en kan blijven. *Grondslag: EWN s.v. zonde; BDAG s.v. ἁμαρτάνω; HALOT s.v. חטא.*

### KLOPT, MAAR KAN PRECIEZER (26)

**Grieks**

- **apostolos** — "Griekse werkwoord voor wegsturen" klopt letterlijk (*apostellō*), maar "uitzenden" dekt het beter; "wegsturen" klinkt afwijzend. *BDAG.*
- **batos / koros** — de inhoud is onzeker. Schattingen voor een bat lopen van ±22 tot ±40 liter (Josephus komt op ±39). Bij Maten staat "Sommige geleerden komen hoger uit", maar de vragen noemen 22 en 220 liter als feit. *Grondslag: Anchor Bible Dictionary, "Weights and Measures".*
- **ekklesia / ekklèsia** — gangbare transcriptie is *ekklēsia*; *ekklèsia* met accent is geen standaard. "Letterlijk de groep die bij elkaar geroepen is" rekt het woord op: *ek* = "uit", *ekkaleō* = "(burgers) oproepen"; in de tijd van het Nieuwe Testament betekende het gewoon "vergadering". *BDAG.*
- **kyriakon / kuriakon** — betekenis klopt; *kyriakon* en *kyrios* zijn de gangbaarder schrijfwijzen. *EWN s.v. kerk.*
- **homoios** — "lijkend op, van dezelfde soort" klopt, maar *homoios* kan ook gewoon "gelijk aan" betekenen. "Klinkt sterker dan Johannes bedoelt" is dus uitleg, geen feit over het woord. *BDAG.*
- **martys** — betekenis en herkomst van *martelaar* kloppen. Maar bij Antipas (Openbaring 2:13), die gedood werd, zien veel uitleggers juist het begin van de betekenis "martelaar"; "nog in de oude zin" is daarom discutabel. *BDAG s.v. μάρτυς.*
- **oikonomos → economie** (ook bij Nederlandse herkomst) — *economie* komt van *oikonomia* ("huishouding, beheer"), het verwante zelfstandig naamwoord, niet van *oikonomos* zelf. *EWN.*
- **politeuma** — "burgerschap" is verdedigbaar; BDAG geeft "staat, burgergemeenschap" (ook een kolonie van burgers in den vreemde), wat bij het beeld van Filippi nog beter past.
- **pond** — *litra* ≈ 327 gram. Het goede antwoord zegt "ongeveer 300 gram"; beter gelijktrekken met de uitleg.
- **uitdoven** (*sbennymi*) — "blussen, uitdoven" klopt, maar het woord wordt ook gebruikt voor lampen die vanzelf uitgaan (Matteüs 25:8). Dat het "bewust" gebeurt, komt uit de gebiedende vorm in 1 Tessalonicenzen 5:19, niet uit het woord. *BDAG.*

**Hebreeuws en Aramees**

- **Hosanna** — preciezer: "Red toch!" (*hoshi'a na*, Psalm 118:25). De game noemt de taal niet. *HALOT.*
- **Maranata** — dubbelzinnig: *marana tha*, "Onze Heer, kom!", of *maran atha*, "onze Heer komt/is gekomen". "Kom, Heer!" volgt de gangbare lezing, maar laat "onze" weg. *BDAG s.v. μαρανα θα.*
- **Messias** (Marcus · beginner · 10) — het goede antwoord "De beloofde redder" geeft de rol; de letterlijke betekenis "de gezalfde" staat alleen tussen haakjes. *HALOT s.v. משׁיח.*
- **Talita koemi / koem** — beide schrijfwijzen zijn echte lezingen van Marcus 5:41. De oudste handschriften (Sinaïticus, Vaticanus) en NA28 hebben *koum*, latere *koumi*; de NBV heeft "Talita koem". Kiezen dus, geen fout herstellen. *Grondslag: NA28-apparaat.*

**Namen**

- **Farizeeën (perushim)** en **Sadduceeën (Sadok)** — de gangbare afleidingen, maar niet zeker. Voor de sadduceeën wordt ook *tsaddiqim* ("rechtvaardigen") genoemd. *Anchor Bible Dictionary.*
- **Hebreeën** — het antwoord zegt waar het woord naar verwijst; de herkomst (van Eber, of van *'ever*, "de overkant") is onzeker en wordt niet gegeven. *HALOT s.v. עברי.*
- **Petrus** — strikt is *petros* "steen" en *petra* "rots"; in het Koinè-Grieks lopen ze in elkaar over. De Petrus-pagina noemt niet dat Petrus Grieks is. *BDAG.*

**Nederlandse herkomst**

- **el** — *el* betekende oorspronkelijk "onderarm"; *elleboog* is juist van *el* afgeleid. "Daar komt de naam vandaan" (de afstand van elleboog tot vingertoppen) klopt in de kern. *EWN s.v. el, elleboog.*
- **aarts-**, **priester**, **Pinksteren**, **engel** — allemaal via het (kerk)Latijn binnengekomen. De game slaat die tussenstap over, behalve bij *bisschop*. *EWN.*
- **penning** — klopt in de kern: in de Statenvertaling is *penning* een algemeen woord voor een munt. De afzonderlijke verzen (Matteüs 5:26 en 10:29; Marcus 12:42, waar de quadrans "oortje" heet) heb ik niet nagelezen.

### KLOPT (108)

**Grieks** (BDAG, tenzij anders vermeld): achrēstos/euchrēstos, alfa en omega, anepsios, apokalypsis, archiereus/archi-, architektōn, assarion, bezonnenheid (*sōphronismos*), brabeuō, broer (in het Hebreeuws *'ach* zeker; in het Grieks vooral via de Septuagint), cheirographon, chrisma, Christus, stephanos/diadema (Trench, *Synonyms*), diakonos, diaspora, didrachme, doulos, episkopos, euangelion (ook het "keizerlijke" gebruik, zoals in de inscriptie van Priëne), hagios, hagnos, hebdomēkonta/duo (Vaticanus 72, Sinaïticus 70: klopt; Genesis 10 in de Septuagint telt 72 volken), hudōr zōn, ichthus, kleinmoedigen (*oligopsychos*), koinonia/koinonoi (Lucas 5:10), kosmos, lepton/lepta, mysterion → sacramentum (Vulgaat, Efeziërs 5:32), ongeregeld (*ataktos*), overste (*chiliarchos*), paidagōgos, parakletos (*paraklētos* is gangbaarder), parousia, pentēkostē, poiēma/poiēsis, polis/archōn, presbyteros/presbyteroi, prosēlytos, stadion (±185 m), synagōgē, tektōn (Justinus, *Dialoog* 88), tetrarch, thriambeuō, wolk (*nephos* voor een menigte, ook klassiek), zeloot.

**Hebreeuws** (HALOT, Gesenius): Amen, bat (maar zie de onzekerheid bij batos), Halleluja (ook "vier keer op één plek", Openbaring 19:1–6), Jom Kipoer, majim chajiem (Jeremia 2:13), qadosj, Rabbi/rabboeni ("Meester" volgt Johannes' eigen uitleg in Johannes 1:38; "mijn meester" is letterlijker; beide kloppen).

**Aramees** (Jastrow, Sokoloff): Abba, Effata.

**Latijn** (Lewis & Short): Caesar/"kaisar", centurio/centum, cilicium, ecclesia → église/iglesia/chiesa, Ite missa est/missa (van *mittere*), pastor, pretorium, sacramentum, sanctus.

**Namen**: Areopagus/Marsheuvel, Babylon als schuilnaam voor Rome, Baptisten (*baptizō*), Barnabas en Boanerges (de betekenis is de eigen uitleg van Lucas en Marcus; de Semitische herkomst erachter is omstreden), Dekapolis, Dode Zee, Epicureeërs, Gennesaret, Getsemane (*gat shemanim*), Immanuël, Kananeeër (*qan'ana*), Kandake (titel van de koningin van Meroë), Kefas, Kinneret (de game zegt zelf "misschien"; de afleiding van "harp" is populair maar onzeker), Lazarus (*El'azar*), Onesimus, Siloam, Stoïcijnen, Tabita/Dorkas, Tiberias.

**Nederlandse herkomst** (EWN): apocalyps, architect, bende, bisschop, keizer, kerk, martelaar, Mis, nachtwaak, pastoor/pastor, pedagoog, poëzie, politiek/politie, sacrament, simonie, sint, stadion, stoïcijns, voorspraak, Wekenfeest, zondebok, zoen/verzoening.

## Beoordeling controle 1 (Roel en Claude in de chat, 1 okt 2026)

Besluiten over de punten uit controle 1. In de game is nog niets aangepast; wat hieronder "in de correctieronde" staat, gebeurt later.

- **Petrus** — niet aanpassen. *Petros*/*petra* ("steen"/"rots") speelt hier niet: Jezus sprak Aramees, en *Kefa* betekent rots. Johannes 1:42 zegt zelf dat Kefas vertaald Petrus is. "Petrus betekent rots" blijft staan.
- **Batos/koros** — de inhoud is echt onzeker: de archeologie komt op ongeveer 22 liter per bat, Josephus op ongeveer 39 liter. In de correctieronde de vragen zo aanpassen dat ze 22 en 220 liter niet als vast feit noemen.
- **Ekklesia** — in de correctieronde "betekent letterlijk" vervangen door "het woord is gevormd uit *ek* ('uit') en *kaleō* ('roepen')"; in de tijd van het Nieuwe Testament betekende het gewoon "vergadering".
- **Maranata** — "Kom, Heer!" blijft te verdedigen (Openbaring 22:20 geeft dezelfde roep in het Grieks: 'Kom, Heer Jezus!'). Bij de correctieronde bekijken of "onze" erbij moet ("Kom, onze Heer!").

## Controle 2 — ChatGPT (diepgaand onderzoek), delen 1–5, 1 okt 2026

Gecontroleerd met de zes bestanden in `kladblok/controle-chatgpt/`, zonder de uitkomsten van controle 1. Deel 6 (Nederlandse herkomst) gaf twee keer een onbetrouwbaar resultaat, omdat zes onderzoeken tegelijk waren gestart, en is niet meegenomen. De uitkomsten staan in de chat van 1 okt 2026.

## Controle 3 — Gemini, deel 6, 1 okt 2026

Deel 6 (Nederlandse herkomst, 30 woorden): **29 KLOPT**, **1 KLOPT NIET** (zonde), in lijn met controle 1.

## Correctieronde 1 (1 okt 2026)

Doorgevoerd op grond van controle 1, de beoordeling daarvan en controles 2 en 3. Eén regel per wijziging.

1. **Sanhedrin** (Handelingen, uitleg bij de Hoge Raad): "Deze raad heette in het Grieks het Sanhedrin." → "Deze raad heette het Sanhedrin."
2. **zonde** (Lucas, vraag): "Het woord "zonde" betekent eigenlijk iets verkeerds doen. Met welk beeld wordt dat oude woord vaak uitgelegd?" → "Iets verkeerds doen heet in de Bijbel zonde. Met welk beeld wordt het Griekse woord daarvoor vaak uitgelegd?" De antwoorden zijn gelijk gebleven.
3. **vat** (Lucas, uitleg): "ongeveer 22 liter" → "volgens de meeste schattingen ongeveer 22 liter … ; sommige geleerden komen hoger uit."
4. **kor** (Lucas, uitleg): "ongeveer 220 liter" → "volgens de meeste schattingen ongeveer 220 liter".
5. **pond** (Johannes, antwoorden en correct): "Een gewicht (ongeveer 300 gram)" → "Een gewicht (ruim 300 gram)", twee keer.
6. **Talita koemi** (Johannes, uitleg over de drie talen): "Talita koem," → "Talita koemi,".
7. **koinonoi** (Brieven van Johannes, uitleg): "Vissers met één gezamenlijk net heetten koinonoi" → "Lucas noemt Jakobus en Johannes de koinonoi van Simon: zijn compagnons in het vissersbedrijf (Lucas 5:10)."
8. **Lazarus** (Johannes, uitleg): "De naam betekent 'God helpt'" → "De naam is een vorm van Eleazar en betekent 'God heeft geholpen'."
9. **Onesimus** (Filemon, antwoorden, correct en uitleg van die ene vraag): "heel bruikbaar" → "goed bruikbaar", drie keer.
10. **cilicium** (Handelingen, uitleg bij de tentenmaker): "zo dicht dat er geen regen doorheen kwam" → "zo dicht dat het de regen goed tegenhield".
11. **zonde** (Woordenboek): "Het oude woord betekent eigenlijk "je doel missen"" → "Het Griekse woord voor zonde, *hamartia*, en het Hebreeuwse *chata* betekenen eigenlijk "je doel missen"".
12. **kerk/ekklesia** (Woordenboek › Kerk): "Dat betekent letterlijk "de groep die bij elkaar geroepen is" — van *ek* … en *kaleō* …" → "Het woord is gevormd uit *ek* ("uit") en *kaleō* ("roepen"), en betekende "vergadering"." Daarbij *ekklèsia* → *ekklesia*, vier keer.
13. **Sadduceeën** (Woordenboek): "Hun naam komt van Sadok" → "Hun naam wordt meestal in verband gebracht met Sadok".
14. **economie** (Woordenboek › Rentmeester): "en daar komt ons woord economie vandaan" → "Van hetzelfde woord komt *oikonomia*, het regelen van het huis, en daaruit is ons woord economie ontstaan."
15. **apocalyps** (Verborgen Schat, artikel): "het wegtrekken van een sluier, zodat je ziet wat eerst verborgen was" → "zoals wanneer je een sluier wegtrekt en ziet wat eerst verborgen was".
16. **Vulgaat** (sacramentenpagina, Het huwelijk): "de Latijnse Bijbel" → "de oude Latijnse Bijbel, de Vulgaat".

Daarbij:

- Bij het **Sanhedrin** is het Griekse *synedrion* bewust niet genoemd: het verklaart geen Nederlands woord.
- **Talita koemi** is de vaste schrijfwijze in de game.
- Het gedeelde cachenummer in `index.html` is van 324 naar 325 gegaan.
- **Ronde 2** (de nuances uit de controles) volgt nog.
