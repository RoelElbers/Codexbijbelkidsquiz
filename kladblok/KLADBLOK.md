# Kladblok Bijbelkidsquiz

> **Afspraak:** plak dit bestand aan het begin van een chatsessie —
> Claude in de chat kan de repo niet lezen. Zeggen we ergens "daar kijken
> we later naar", dan eindigt Claude dat bericht met een kant-en-klaar
> regeltje om hieronder te plakken.
> Claude Code leest de repo wel en kan regels er direct zelf in zetten.
> Formaat: `- JJJJ-MM-DD — één zin, genoeg om het terug te herkennen.`
>
> Korte punten staan hier. Groeit iets uit tot een uitgewerkt plan, dan
> krijgt het een eigen bestand in deze map en blijft hier één regel staan
> die ernaar verwijst. De index blijft zo het enige wat je hoeft te lezen.

## Ideeën (onuitgewerkt)
- 2026-08-11 — Hemeltrap als spelelement: voortgang beleven als het
  beklimmen van een trap of toren, i.p.v. alleen een voortgangsbalk.
- 2026-08-11 — Schatkamer mobiel/tablet: trofeeën die één voor één
  voorbijscrollen i.p.v. de vaste zaalindeling.
- 2026-08-11 — OT-zaal met de Ark van het Verbond als middenstuk.

## Later doen (concreet)
- 2026-08-11 — Apart veld voor de zeven vragen die achtergrondkennis
  toetsen en geen aanwijsbaar vers hebben; uitgesteld tot de
  vragenreeksen klaar zijn.
- 2026-08-11 — Tabletondersteuning echt testen. Harde eis, nog niet gedaan.
- 2026-08-11 — AI-video's (~1 min per avatar, later per bijbelboek) op
  aparte video-CDN. Wacht op nieuwe computer.
- 2026-08-11 — Muziek: tweede register zoeken — ingetogen variant voor
  tijdens het spelen, naast de melodische voor startscherm en beloning.
- 2026-08-15 — Reveal van Malchus en Hebreeën splitsen: het inzicht blijft in
  de reveal, het verhaal gaat naar het naslagscherm. Beide hebben nu geen
  naslagtekst, dus inkorten betekent er een schrijven.
- 2026-08-15 — iPhone: game werkt, maar het scherm beweegt tijdens gebruik.
  Vermoedelijk de in- en uitschuivende Safari-adresbalk in combinatie met
  100vh in #game-container; dvh is de kandidaat-oplossing. Eerst rustig
  observeren wanneer het precies gebeurt.

## Goed om te weten
*Staande aandachtspunten. Ze vragen geen actie, maar moeten wel meegewogen
worden bij een volgende wijziging.*

- 2026-08-15 — Rolverdeling Verborgen Schat: de plek volgt de lengte, niet
  andersom. Past de uitleg in 2-3 zinnen, dan is een reveal genoeg. Is er
  meer te vertellen, dan reveal voor het inzicht en naslag voor het verhaal.
  Feitelijke uitleg mag ook alleen in de naslag staan. Geen quotum: niet
  elke vraag hoeft beide te hebben.
- 2026-08-15 — Beide bedankpagina's werken, maar worden aangeroepen vanaf een
  redirect-URL búiten de repo: bedankt.html vanuit het Forminit-dashboard,
  bedankt-donatie.html vanuit de Mollie-betaallink (ingesteld en getest met
  een echte betaling). Het aandachtspunt is dus niet dat er nog iets moet,
  maar dat hernoemen of verplaatsen ze stil breekt: geen enkele href of src
  in het project wijst ernaar, dus een zoekactie in de repo vindt niets.

## Besloten: niet doen
- Telefoonondersteuning — bewust uitgesteld, mogelijk nooit.
- Contact- en bedankpagina omzetten naar de u-vorm — bewust niet. Een fout
  melden is juist iets wat een kind zelf doet. Het steunblok in de game,
  steunen.html, bedankt-donatie.html en de privacyverklaring staan wél in de
  u-vorm: die route is voor de gever.

## Gedaan
- (afgeronde punten hierheen schuiven met de datum van afronden)
