<h1 align="center">Stream Stick Widget</h1>

<p align="center">
  <a href="https://github.com/wielorzeczownik/stream-stick-widget/actions/workflows/release.yml"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&labelColor=2d333b&color=3fb950"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&color=2ea043"/><img src="https://img.shields.io/github/actions/workflow/status/wielorzeczownik/stream-stick-widget/release.yml?branch=main&style=flat-square&labelColor=2d333b&color=3fb950" alt="Build"/></picture></a> <a href="https://github.com/wielorzeczownik/stream-stick-widget/releases/latest"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&labelColor=2d333b&color=3fb950"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&color=2ea043"/><img src="https://img.shields.io/github/v/release/wielorzeczownik/stream-stick-widget?style=flat-square&labelColor=2d333b&color=3fb950" alt="Latest Release"/></picture></a> <a href="https://github.com/wielorzeczownik/stream-stick-widget/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/License-MIT-3fb950?style=flat-square&labelColor=2d333b"/><source media="(prefers-color-scheme: light)" srcset="https://img.shields.io/badge/License-MIT-2ea043?style=flat-square"/><img src="https://img.shields.io/badge/License-MIT-3fb950?style=flat-square&labelColor=2d333b" alt="License: MIT"/></picture></a>
  <br/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript"/>
  <a href="https://github.com/sigma-cw/widget-io"><img src="https://img.shields.io/badge/widget.io-compatible-3fb950?style=flat-square&labelColor=2d333b" alt="widget.io compatible"/></a>
  <img src="https://img.shields.io/badge/StreamElements-FEB800?style=flat-square&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEyIDJMMiA3bDEwIDUgMTAtNXoiLz48L3N2Zz4=&logoColor=white" alt="StreamElements"/>
  <img src="https://img.shields.io/badge/Twitch-9146FF?style=flat-square&logo=twitch&logoColor=white" alt="Twitch"/>
  <img src="https://img.shields.io/badge/YouTube-FF0000?style=flat-square&logo=youtube&logoColor=white" alt="YouTube"/>
  <img src="https://img.shields.io/badge/Kick-53FC18?style=flat-square&logo=kick&logoColor=black" alt="Kick"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/wielorzeczownik/stream-stick-widget/main/assets/logo.png" alt="Stream Stick – 3D stick pull overlay for StreamElements on Twitch, YouTube and Kick" width="400"/>
</p>

<p align="center">🇬🇧 English | 🇵🇱 <a href="README.pl.md">Polski</a></p>

A free StreamElements widget for Twitch, YouTube, and Kick – chat commands or Channel Points trigger a 3D stick-pull animation on screen. Supports custom pixel-art skins and optional pixelation censorship.

## How it works?

Viewers type a chat command or redeem a Channel Points reward on Twitch to pull the stick. A 3D voxel stick shoots up from the bottom of the screen, holds for a moment, then disappears. The stick skin, angle, size, and animation timing are all configurable. Custom PNG sprites are rendered as voxel art in real time.

## Features

- **Trigger via chat command** or **Channel Points** (Twitch only)
- **Cross-platform** – Twitch, YouTube, and Kick
- **3D voxel rendering** – built with Three.js, pixel-perfect sprite-to-voxel conversion at runtime
- **Multiple skins** – wooden stick, Minecraft stick, Minecraft pickaxe, or your own PNG
- **Custom skin upload** – any PNG with transparency becomes a sprite automatically
- **Pixelation censorship** – optional mosaic effect over the stick area
- **Fully configurable** – angle, length, color, hold duration, sound

## Installation

Download the latest release from [GitHub Releases](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest):

| File                                                                                                                     | For                                                                  |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- |
| [stick-widgetio.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick-widgetio.zip) | [widget.io](https://github.com/sigma-cw/widget-io) – import directly |
| [stick.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick.zip)                   | StreamElements custom widget – manual import                         |

### [widget.io](https://github.com/sigma-cw/widget-io)

1. Download [stick-widgetio.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick-widgetio.zip).
2. In [widget.io](https://github.com/sigma-cw/widget-io), click **Import** and select the zip.
3. Configure and save.

### StreamElements custom widget

1. Download [stick.zip](https://github.com/wielorzeczownik/stream-stick-widget/releases/latest/download/stick.zip) and extract it.
2. Go to **My Overlays** → **New Overlay** → **Add Widget** → **Custom Widget**.
3. Click **Open Editor** and fill in each tab with the matching file from the zip:
   - **HTML** → `HTML.html`
   - **CSS** → `CSS.css`
   - **JS** → `SCRIPT.js`
   - **Fields** → `FIELDS.json`
4. Click **Done**, configure the widget fields, and save.

## Setup

### Twitch: Channel Points

1. Create a Channel Points reward named exactly **Stick out** (or whatever you set in the widget fields).
2. In the widget settings, enable **Enable Channel Points reward**.
3. Disable **Enable chat command** if you don't want the chat command alongside it.

### Twitch: chat command

Enable **Enable chat command** in the widget settings. Viewers use `!pull` (or your custom command name) in chat.

### YouTube / Kick

Chat command is enabled by default. No extra setup needed.

## Configuration

Every setting below is a field in the widget editor. Values outside the accepted range are clamped, not rejected – the widget always starts.

| Field                                   | Type     | Default     | Accepted           | Meaning                                                                                                   |
| --------------------------------------- | -------- | ----------- | ------------------ | --------------------------------------------------------------------------------------------------------- |
| **Enable chat command**                 | checkbox | on          | on / off           | Registers the chat command on every platform.                                                             |
| **Chat command name**                   | text     | `pull`      | any                | Command viewers type, without the `!` prefix.                                                             |
| **Enable Channel Points (Twitch only)** | checkbox | on          | on / off           | Listens for Channel Points redemptions. Ignored on YouTube and Kick.                                      |
| **Channel Points reward name (exact)**  | text     | `Stick out` | any                | Must match the reward name on Twitch **exactly**, including capitalisation.                               |
| **Sound (mp3/ogg)**                     | sound    | _(empty)_   | URL or upload      | Played on each pull. Empty means a random built-in pop sound.                                             |
| **Sound volume (%)**                    | number   | `80`        | `0`–`100`          | Clamped into range.                                                                                       |
| **Pull duration (seconds)**             | number   | `3`         | `1`+               | How long the stick takes to rise. Values below `1` are raised to `1`.                                     |
| **Hold duration after pull (seconds)**  | number   | `1.2`       | `0`+               | How long the stick stays on screen before disappearing. Negatives become `0`.                             |
| **Stick length (px)**                   | number   | `300`       | `100`+             | On-screen length. Values below `100` are raised to `100`.                                                 |
| **Stick color**                         | colour   | `#8B4513`   | any colour         | Applies to the **wood** skin only; sprite skins keep their own pixel colours.                             |
| **Stick angle (degrees)**               | number   | `-65`       | any                | `0` = straight up, `-90` = left, `90` = right. Not clamped.                                               |
| **Stick skin**                          | dropdown | `Wood`      | see below          | `Wood`, `Minecraft — Stick`, `Minecraft — Pickaxe`, or `Custom (below)`.                                  |
| **Custom skin (PNG with transparency)** | image    | _(empty)_   | URL or upload      | Used only when the skin is `Custom`. Converted to voxels at runtime, capped at 16 px on the longest side. |
| **Censorship**                          | dropdown | `None`      | `None`, `Pixelate` | Optional mosaic over the stick area.                                                                      |

> A custom skin is fetched with `crossOrigin="anonymous"`. If the host does not send CORS headers the sprite silently falls back to nothing, so prefer uploading the image through the widget editor.

## Building from source

Requirements: [Node.js](https://nodejs.org) 24+.

```bash
git clone https://github.com/wielorzeczownik/stream-stick-widget.git
cd stream-stick-widget
npm install
npm run build
```

The built widget files land in `widget/compiled/`. The StreamElements-ready zip is in `widget/dist/`. For [widget.io](https://github.com/sigma-cw/widget-io), the export zip is in `widget/export/`.
