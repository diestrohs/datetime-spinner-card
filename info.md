# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit iOS-style Spinner-Interface zur flexiblen Datums- und Zeitauswahl.

## Features

- 📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute
- 🔀 **Flexible Entity-Konfiguration** - Separate oder kombinierte Entities
- 🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen oder Config
- 🎨 **Vollständig anpassbar** - Icon, Farbe, Name, Minuten-Schrittweite
- � **Mobile-Optimiert** - Responsive Design für iPhone und iPad
- �🔍 **Automatische Icon-Übernahme** von der Entity
- ⚙️ **Flexible Minuten-Schrittweite** (1, 5, 10, 15, 30)
- 🔄 **Konfigurierbare Spinner-Wiederholungen** (1-10)
- 🖼️ **Visual Editor** für einfache Konfiguration
- 🕐 **Unterstützt alle Entity-Types**: `input_datetime.*`, `date.*`, `time.*`
- 🚗 **Kompatibel mit EVCC Scheduler** und anderen Integrationen

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

Mit separaten Entities:

```yaml
type: custom:time-spinner-card
date_entity: date.appointment_date
time_entity: time.appointment_time
name: Termin
icon: mdi:calendar-clock
icon_color: "#2196f3"
minute_step: 15
```

Mit Datums-Beschränkung:

```yaml
type: custom:time-spinner-card
entity: input_datetime.birthday
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
```

## Weitere Informationen

Siehe [README.md](https://github.com/diestrohs/time-spinner-card) für vollständige Dokumentation.
