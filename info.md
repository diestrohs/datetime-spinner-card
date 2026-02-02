# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit iOS-style Spinner-Interface zur Zeitauswahl.

## Features

- ✨ Pixel-perfektes HA Design mit nativer input_datetime Entity Row Optik
- 🎯 Material Design Text Field Implementierung (MDC Variables)
- 🎨 Vollständig anpassbar (Icon, Farbe, Name)
- 🔍 Automatische Icon-Übernahme von der Entity
- ⚙️ Flexible Minuten-Schrittweite (1, 5, 10, 15, 30)
- 🔄 Konfigurierbare Spinner-Wiederholungen (1-10)
- 🖼️ Visual Editor für einfache Konfiguration
- 🕐 Unterstützt `input_datetime.*` und `time.*` Entities
- 🚗 Kompatibel mit EVCC Scheduler Integration

## Installation

1. Kopieren Sie `time-spinner-card.js` nach `config/www/time_picker_spinner/`
2. Fügen Sie die Ressource in Home Assistant hinzu:
   - **Einstellungen** → **Dashboards** → **Ressourcen**
   - URL: `/local/time_picker_spinner/time-spinner-card.js`
   - Typ: **JavaScript Module**

## Verwendung

```yaml
type: custom:time-spinner-card
entity: input_datetime.wakeup_time
name: Weckzeit
icon: mdi:alarm
icon_color: "#ff9800"
minute_step: 5
```

Für EVCC Scheduler:

```yaml
type: custom:time-spinner-card
entity: time.evcc_elroq_repeating_plan_1_time
name: Ladestart
icon: mdi:ev-station
icon_color: "#4caf50"
minute_step: 15
```

## Weitere Informationen

Siehe [README.md](https://github.com/diestrohs/time-spinner-card) für vollständige Dokumentation.
