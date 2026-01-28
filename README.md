# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit Spinner-Interface zur Zeitauswahl für `input_datetime` und `time` Entities.

## Version 0.0.3

### Features

✨ **Intuitive Spinner-Bedienung** - iOS-Style Time Picker mit flüssigem Scroll-Verhalten  
🎨 **Vollständig anpassbar** - Icon, Farbe, Name und mehr konfigurierbar  
🔍 **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen  
🖼️ **Visual Editor** - Komfortable Konfiguration über die Home Assistant UI  
🌙 **Theme-Support** - Passt sich automatisch an Dark/Light Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*` und `time.*` Entities  

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Gehen Sie zu "Frontend"
3. Klicken Sie auf das Menü (⋮) oben rechts
4. Wählen Sie "Custom repositories"
5. Fügen Sie die Repository-URL hinzu: `https://github.com/diestrohs/time-spinner-card`
6. Installieren Sie "Time Spinner Card"
7. Fügen Sie die Ressource in Home Assistant hinzu (wird meist automatisch gemacht)

### Manuelle Installation

1. Laden Sie `time-spinner-card.js` herunter
2. Kopieren Sie die Datei nach `config/www/time_picker_spinner/`
3. Fügen Sie die Ressource in Home Assistant hinzu:
   - Gehen Sie zu **Einstellungen** → **Dashboards** → **Ressourcen**
   - Klicken Sie auf **Ressource hinzufügen**
   - URL: `/local/time_picker_spinner/time-spinner-card.js`
   - Ressourcentyp: **JavaScript Module**

## Verwendung

### Basis-Konfiguration

```yaml
type: custom:time-spinner-card
entity: input_datetime.wakeup_time
```

### Erweiterte Konfiguration

```yaml
type: custom:time-spinner-card
entity: time.evcc_elroq_repeating_plan_1_time
name: Startzeit
icon: mdi:timer-refresh
icon_color: "#44739e"
minute_step: 15
repeat: 3
```

### Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `entity` | string | **erforderlich** | Entity ID (`input_datetime.*` oder `time.*`) |
| `name` | string | `"Terminzeit"` | Anzeigename der Card |
| `icon` | string | *Entity-Icon oder `"mdi:clock"`* | Material Design Icon (übernimmt automatisch das Icon der Entity, falls nicht gesetzt) |
| `icon_color` | string | `"var(--primary-text-color)"` | Icon-Farbe (Hex, CSS-Farbe oder CSS-Variable) |
| `minute_step` | number | `5` | Minuten-Schrittweite (1, 5, 10, 15, 30) |
| `repeat` | number | `3` | Anzahl Wiederholungen im Spinner (1-10) |

## Visual Editor

Die Card verfügt über einen vollständigen Visual Editor in der Home Assistant UI:

1. Fügen Sie eine neue Card hinzu
2. Suchen Sie nach "Time Spinner Card"
3. Konfigurieren Sie alle Optionen über die grafische Oberfläche
4. Entity-Picker, Icon-Picker und alle Felder sind direkt verfügbar

## Beispiele

### Wecker mit 5-Minuten-Schritten

```yaml
type: custom:time-spinner-card
entity: input_datetime.alarm_time
name: Weckzeit
icon: mdi:alarm
icon_color: "#ff9800"
minute_step: 5
```

### Terminplanung mit 15-Minuten-Schritten

```yaml
type: custom:time-spinner-card
entity: input_datetime.appointment_time
name: Terminzeit
icon: mdi:calendar-clock
icon_color: "#2196f3"
minute_step: 15
repeat: 5
```

### EV-Ladeplanung mit 30-Minuten-Schritten (EVCC Scheduler)

```yaml
type: custom:time-spinner-card
entity: time.evcc_elroq_repeating_plan_1_time
name: Ladestart
icon: mdi:ev-station
icon_color: "#4caf50"
minute_step: 30
repeat: 5
```

> **Hinweis**: Funktioniert perfekt mit [EVCC Scheduler Integration](https://github.com/diestrohs/ha-evcc-scheduler)

## Kompatibilität

- **Home Assistant**: 2024.1 oder höher
- **Browser**: Alle modernen Browser mit ES6+ Support
- **Entities**: 
  - `input_datetime.*` (verwendet `input_datetime.set_datetime`)
  - `time.*` (verwendet `time.set_value` - kompatibel mit EVCC Scheduler und anderen Integrationen)

## Technische Details

- **Framework**: Lit 3.x
- **Shadow DOM**: Ja (vollständige Isolation)
- **Event System**: Custom Events für Config-Änderungen
- **Styling**: CSS Custom Properties für Theme-Integration

## Bekannte Einschränkungen

- Unterstützt nur `input_datetime` und `time` Entities
- Nur Zeit-Auswahl (keine Datums-Auswahl)
- Overlay ist modal (blockiert Hintergrund-Interaktionen)

## Roadmap

- [ ] Datums-Auswahl Support
- [ ] Mehr Styling-Optionen
- [ ] Animationen konfigurierbar machen
- [ ] Tastatur-Shortcuts
- [ ] Accessibility-Verbesserungen

## Lizenz

MIT License

## Changelog

### Version 0.0.1 (2026-01-28)

🎉 **Erstes Release**

- ✨ Basis-Funktionalität mit Spinner-Interf (1-10)
- 🖼️ Vollständiger Visual Editor
- ⚡ Lit-basierte Implementierung mit Shadow DOM
- 🌙 Theme-Support
- 🕐 Unterstützung für `input_datetime.*` und `time.*` Entities
- 🚗 Kompatibel mit EVCC Scheduler Integrationre Spinner-Wiederholungen
- 🖼️ Vollständiger Visual Editor
- ⚡ Lit-basierte Implementierung mit Shadow DOM
- 🌙 Theme-Support

## Support

Bei Problemen oder Feature-Requests erstellen Sie bitte ein Issue auf GitHub.
