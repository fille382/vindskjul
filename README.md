# Vindskydd & Hyddor i Skåne 🏕️

En offline-kapabel karta (PWA) för friluftsliv i Skåne — vindskydd, grillplatser, Skåneleden, busshållplatser, matbutiker, vattenstationer och sevärdheter.

## Funktioner

- **1 100+ vindskydd och grillplatser** i hela Skåne, plus handplockade favoriter
- **Skåneleden SL1–SL7** med exakt dragning, färgkodad per delled
- **Slinglager**: välj en delled och se allt inom 1 km från leden — vindskydd, grillplatser, matbutiker, vattenstationer och sevärdheter
- **Busshållplatser** (9 800+) för att ta sig till och från leden
- **Matbutiker** grupperade per kedja (ICA, Coop, Lidl, Willys, Hemköp, City Gross)
- **Sevärdheter**: utsiktspunkter, slott, fornminnen
- **Offline-stöd**: service worker cachar sidan, all data och besökta kartrutor
- **Mobilanpassad**: ren kartvy i mobilen, installerbar på hemskärmen
- **Utskrift**: skriv ut aktuellt kartutsnitt och ta med på papper
- Filterval sparas mellan besök (localStorage)

## Datakällor

- Platsdata: [OpenStreetMap](https://www.openstreetmap.org/copyright) via Overpass API (ODbL)
- Skåneledens geometri: OpenStreetMap + [Waymarked Trails](https://hiking.waymarkedtrails.org/) API
- Kartrutor: OpenStreetMap standard + Waymarked Trails (ledöverlägg)
- Handplockade platser: [Stiftelsen Skånska Landskap](https://skanskalandskap.se/), [Skåneleden](https://www.skaneleden.se/), Malmö stad

Datafilerna (`*_skane.js`, `skaneleden_led.js`) är ögonblicksbilder hämtade juli 2026.

## Körning

Öppna `index.html` direkt i webbläsaren, eller servera mappen över http för fullt PWA-stöd (offline + hemskärmsinstallation).

Byggd med [Leaflet](https://leafletjs.com/) + [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster). Ingen byggprocess — bara statiska filer.
