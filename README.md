# Chazeau — Ardèche, France

Een rustige presentatie van het landgoed, met één pagina per taal (Duits, Nederlands, Frans en Brits Engels), een toegankelijke fotogalerij en rechtstreeks contact met de officiële makelaar. De actuele prijs staat bij de makelaar.

## Lokaal bekijken

Gebruik Node.js 20 of nieuwer en Python 3. Er zijn geen npm-afhankelijkheden nodig.

```sh
npm run build
npm run dev
```

Open de lokale website op poort 3000. De eerste taal volgt de browservoorkeur; een bewuste taalkeuze wordt op het apparaat onthouden. De expliciete adressen `/de/`, `/nl/`, `/fr/` en `/en/` zijn altijd direct bruikbaar en vindbaar voor zoekmachines.

## Teksten en foto's aanpassen

Alle teksten en de volgorde van de foto's staan in `content.mjs`. De huidige foto's zijn de door de eigenaar aangeleverde voorbeeldbeelden.

1. Plaats de grote foto als WebP in `assets/photos/` en een miniatuur met dezelfde naam in `assets/thumbs/`.
2. Pas de `photos`-lijst in `content.mjs` aan. Gebruik `portrait: true` bij een staande foto, zodat de volledige foto zichtbaar blijft.
3. Voeg per taal een passende fotobeschrijving toe in de `alt`-lijst.
4. Voer `npm run build` uit. Bij een gekoppeld Vercel-project publiceert een commit naar de productiebranch de wijziging.

De grote beelden zijn geoptimaliseerd en bevatten geen EXIF-locatiegegevens. De galerij ondersteunt miniaturen, pijlen, toetsenbord en veegbewegingen. Er worden geen externe lettertypen of cookies gebruikt. Bezoekersstatistieken lopen via Vercel Web Analytics (cookieloos), zichtbaar onder Analytics in het Vercel-project.

## Publicatie

Importeer de GitHub-repository in Vercel als een project met framework **Other**. `vercel.json` bevat de buildopdracht en uitvoermap. Voeg `chazeau-ardeche.com` en `www.chazeau-ardeche.com` toe in Vercel en gebruik de door Vercel opgegeven DNS-records in Cloudflare. Laat één adres doorverwijzen naar het andere.

Er zijn geen geheime sleutels, database of omgevingsvariabelen nodig voor deze website. De bronbestanden zijn het uitgangspunt; `dist/` wordt bij iedere build opnieuw aangemaakt.
