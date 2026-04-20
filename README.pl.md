<h1 align="center">Stream Stick Widget</h1>

<p align="center">
  <a href="https://github.com/wielorzeczownik/stream-stick-widget/actions/workflows/release.yml"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&labelColor=2d333b&color=3fb950"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&color=2ea043"/><img src="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&labelColor=2d333b&color=3fb950" alt="Build"/></picture></a> <a href="https://github.com/wielorzeczownik/stream-stick-widget/releases/latest"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&labelColor=2d333b&color=3fb950"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&color=2ea043"/><img src="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&labelColor=2d333b&color=3fb950" alt="Najnowsze wydanie"/></picture></a> <a href="https://github.com/wielorzeczownik/stream-stick-widget/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/License-MIT-3fb950?style=flat-square&labelColor=2d333b"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/License-MIT-2ea043?style=flat-square"/><img src="https://img.shields.io/badge/License-MIT-3fb950?style=flat-square&labelColor=2d333b" alt="Licencja: MIT"/></picture></a>
  <br/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <a href="https://github.com/sigma-cw/widget-io"><img src="https://img.shields.io/badge/widget.io-compatible-3fb950?style=flat-square&labelColor=2d333b" alt="widget.io compatible"/></a>
  <img src="https://img.shields.io/badge/StreamElements-FEB800?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNXoiLz48L3N2Zz4=&logoColor=white" alt="StreamElements"/>
  <img src="https://img.shields.io/badge/Twitch-9146FF?style=flat-square&logo=twitch&logoColor=white" alt="Twitch"/>
  <img src="https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="YouTube"/>
  <img src="https://img.shields.io/badge/Kick-53FC18?style=flat-square&logo=kick&logoColor=black" alt="Kick"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/wielorzeczownik/stream-stick-widget/main/assets/logo.png" alt="Stream Stick Widget – animacja 3D w StreamElements dla Twitcha, YouTube i Kicka" width="400"/>
</p>

<p align="center">🇬🇧 <a href="README.md">English</a> | 🇵🇱 Polski</p>

Darmowy widget do StreamElements dla Twitcha, YouTube i Kicka — komenda na czacie lub Channel Points wyzwalają animację 3D wysuwającego się kija na ekranie. Obsługuje własne skórki w stylu pixel-art i opcjonalną pixelizację.

## Jak to działa?

Widzowie wpisują komendę na czacie lub realizują nagrodę Channel Points na Twitchu, żeby wysunąć kij. Trójwymiarowy kij wokseli wyskakuje z dołu ekranu, chwilę się trzyma, po czym znika. Skórka, kąt, rozmiar i timing animacji są w pełni konfigurowalne. Własne sprite'y PNG są konwertowane na woksele w czasie rzeczywistym.

## Funkcje

- **Wyzwalanie komendą czatu** lub **Channel Points** (tylko Twitch)
- **Wieloplatformowość** – Twitch, YouTube i Kick
- **Renderowanie 3D wokseli** – zbudowane na Three.js, konwersja sprite → woksel w czasie rzeczywistym
- **Wiele skórek** – drewniany kij, patyk Minecraft, kilof Minecraft lub własny PNG
- **Upload własnej skórki** – dowolny PNG z przezroczystością staje się sprite'em automatycznie
- **Pixelizacja (cenzura)** – opcjonalny efekt mozaiki nad obszarem kija
- **W pełni konfigurowalny** – kąt, długość, kolor, czas trzymania, dźwięk

## Instalacja

Pobierz najnowsze wydanie z [GitHub Releases](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest):

| Plik                                                                                                                     | Dla                                                                      |
| ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ |
| [stick-widgetio.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick-widgetio.zip) | [widget.io](https://github.com/sigma-cw/widget-io) – import bezpośrednio |
| [stick.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick.zip)                   | StreamElements custom widget – import ręczny                             |

### [widget.io](https://github.com/sigma-cw/widget-io)

1. Pobierz [stick-widgetio.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick-widgetio.zip).
2. W [widget.io](https://github.com/sigma-cw/widget-io) kliknij **Import** i wybierz plik zip.
3. Skonfiguruj i zapisz.

### StreamElements custom widget

1. Pobierz [stick.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick.zip) i rozpakuj.
2. Przejdź do **My Overlays** → **New Overlay** → **Add Widget** → **Custom Widget**.
3. Kliknij **Open Editor** i wypełnij każdą zakładkę odpowiednim plikiem z archiwum:
   - **HTML** → `HTML.html`
   - **CSS** → `CSS.css`
   - **JS** → `SCRIPT.js`
   - **Fields** → `FIELDS.json`
4. Kliknij **Done**, skonfiguruj pola widgetu i zapisz.

## Konfiguracja

### Twitch: Channel Points

1. Utwórz nagrodę Channel Points o nazwie dokładnie **Stick out** (lub zgodnie z ustawieniami widgetu).
2. W ustawieniach widgetu włącz **Enable Channel Points reward**.
3. Wyłącz **Enable chat command**, jeśli nie chcesz komendy czatu równolegle.

### Twitch: komenda czatu

Włącz **Enable chat command** w ustawieniach widgetu. Widzowie używają `!pull` (lub własnej nazwy komendy) na czacie.

### YouTube / Kick

Komenda czatu jest domyślnie włączona. Nie wymaga dodatkowej konfiguracji.

## Budowanie ze źródeł

Wymagania: [Node.js](https://nodejs.org) 24+.

```bash
git clone https://github.com/wielorzeczownik/stream-stick-widget.git
cd stream-stick-widget
npm install
npm run build
```

Zbudowane pliki widgetu trafiają do `widget/compiled/`. Paczka gotowa dla StreamElements jest w `widget/dist/`. Eksport dla [widget.io](https://github.com/sigma-cw/widget-io) jest w `widget/export/`.
