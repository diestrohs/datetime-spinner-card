# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [0.0.4] - 2026-01-29

### Geändert
- 🎨 **Native HA Input-Field Design** - Eingabefeld folgt nun dem Standard Home Assistant Datetime-Card Design
  - Transparenter Hintergrund mit subtiler Fill-Color
  - Nur unterer Border (2px) statt Rundung
  - Border wechselt zu Primärfarbe bei Interaktion
  - Monospace-Schrift für bessere Zeit-Lesbarkeit
- 🎯 **OK-Button Hervorhebung** - OK-Button mit Primärfarbe und transparentem Hintergrund (wie HA Dropdowns)
- 📐 **Optimiertes Layout** - Abstände und Größen identisch zur HA datetime Card
- 🔘 **Button-Ausrichtung** - "Abbrechen" linksbündig, "OK" rechtsbündig im Spinner

### Technische Details
- Eingabefeld: `border-bottom: 2px solid var(--divider-color)`
- Hover/Active: Border wechselt zu `var(--primary-color)`
- Layout: `min-height: 56px`, `padding: 8px 16px`, `gap: 8px`
- OK-Button: `background: rgba(var(--rgb-primary-color), 0.12)`
- Vollständige card_mod Kompatibilität für Custom-Styling

## [0.0.3] - 2026-01-29

### Hinzugefügt
- 🔍 **Automatische Icon-Übernahme von der Entity** - Wenn kein Icon konfiguriert ist, wird automatisch das Icon der Entity verwendet

### Technische Details
- Basiert auf der stabilen v0.0.1 Version
- Nur minimale Änderung: Eine Zeile Code für Icon-Übernahme
- Korrekte UTF-8 Kodierung ohne BOM
- Keine anderen Änderungen an der Funktionalität

## [0.0.2] - 2026-01-29 ⚠️ DEFEKT - NICHT VERWENDEN

**WARNUNG**: Diese Version ist defekt und funktioniert nicht!
- TypeScript-Dateien können nicht direkt im Browser ausgeführt werden
- Bitte verwenden Sie v0.0.1 oder v0.0.3+

## [0.0.1] - 2026-01-28

### Hinzugefügt
- 🎉 Erstes öffentliches Release
- ✨ iOS-style Spinner-Interface für Zeit-Auswahl
- 🎨 Vollständig konfigurierbare Darstellung (Icon, Farbe, Name)
- ⚙️ Variable Minuten-Schrittweite (1, 5, 10, 15, 30 Minuten)
- 🔄 Konfigurierbare Anzahl von Spinner-Wiederholungen (1-10)
- 🖼️ Vollständiger Visual Editor für Home Assistant UI
- 🕐 Unterstützung für `input_datetime.*` Entities
- 🕐 Unterstützung für `time.*` Entities
- ⚡ Lit 3.x basierte Implementierung
- 🌙 Automatischer Dark/Light Theme Support
- 📱 Shadow DOM für vollständige Style-Isolation
- 🎯 Automatische Service-Erkennung (`input_datetime.set_datetime` vs `time.set_value`)
- 🚗 Kompatibilität mit EVCC Scheduler Integration
- 📦 HACS-ready Konfiguration

### Features im Detail

#### Entity-Unterstützung
- Automatische Erkennung des Entity-Typs
- `input_datetime.*` verwendet `input_datetime.set_datetime` Service
- `time.*` verwendet `time.set_value` Service (z.B. für EVCC Scheduler)

#### Visual Editor
- Entity Picker mit Domain-Filter (`input_datetime`, `time`)
- Icon Picker mit allen Material Design Icons
- Textfelder für Name und Icon-Farbe
- Numerische Felder für Minuten-Schrittweite und Wiederholungen
- Hilfe-Texte für gültige Werte

#### Konfiguration
- `entity` (erforderlich): Entity ID
- `name` (optional): Display-Name (Standard: "Terminzeit")
- `icon` (optional): Material Design Icon (Standard: "mdi:clock")
- `icon_color` (optional): CSS-Farbe oder Variable
- `minute_step` (optional): Schrittweite 1, 5, 10, 15, 30 (Standard: 5)
- `repeat` (optional): Wiederholungen 1-10 (Standard: 3)

### Technische Details
- Lit 3.x Framework
- ES6+ Module via unpkg CDN
- Shadow DOM mit CSS Custom Properties
- Reactive Properties System
- Event-basierte Konfiguration
- requestAnimationFrame für Performance
- Debounced Scroll-Snapping (80ms)

### Bekannte Einschränkungen
- Nur Zeit-Auswahl (keine Datums-Auswahl)
- Overlay ist modal (blockiert Hintergrund)
- Benötigt moderne Browser mit ES6+ Support

[0.0.1]: https://github.com/diestrohs/time-spinner-card/releases/tag/v0.0.1
