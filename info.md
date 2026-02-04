# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit iOS-style Spinner-Interface zur flexiblen Datums- und Zeitauswahl für `input_datetime`, `date` und `time` Entities.

## Version 0.0.9

### Features

📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute mit iOS-style Spinner  
🔀 **Flexible Entity-Konfiguration** - `entity`, `date_entity` und `time_entity` beliebig kombinierbar  
🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen auslesen oder in der Konfiguration überschreiben  
🎨 **Angelehnt an HA Design** - Aussehen ähnlich wie input_datetime Entity Row  
📱 **Mobile-Optimiert** - Responsive Design für iPhone, iPad und andere Geräte  
✨ **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen  
🖼️ **Visual Editor** - Komfortable Konfiguration über die Home Assistant UI  
🌙 **Theme-Support** - Passt sich automatisch an Dark/Light Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*`, `date.*` und `time.*` Entities  
🌍 **Vollständige Mehrsprachigkeit** - 17+ Sprachen mit lokalisierten Buttons und Datumsformaten  

### Neue Features in v0.0.9

✨ **Vollständige Mehrsprachigkeit für Buttons**
- "Save"/"Speichern"-Button lokalisiert für alle 17 Sprachen
- "Cancel"/"Abbrechen"-Button lokalisiert für alle 17 Sprachen
- Deutsch: "Speichern" statt "OK", Englisch: "Save" statt "OK"

🌍 **Lokalisierung und Personalisierung des Datumsformats**
- Datumsformat respektiert HA-Personalisierungseinstellungen (DMY, MDY, YMD, language, system)
- Dynamische Formatanzeige basierend auf Benutzerlocale
- Unterstützt 19 verschiedene Sprach-/Regionseinstellungen
- Automatische Anpassung an Benutzer-Zeitzone

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Geben Sie in der Suche `Time Spinner Card` ein
3. Installieren Sie "Time Spinner Card"

### Manuelle Installation

1. Laden Sie `time-spinner-card.js` herunter
2. Kopieren Sie die Datei nach `config/www/time_picker_spinner/`
3. Fügen Sie die Ressource in Home Assistant hinzu:
   - **Einstellungen** → **Dashboards** → **Ressourcen**
   - URL: `/local/time_picker_spinner/time-spinner-card.js`
   - Ressourcentyp: **JavaScript Module**

## Verwendung

### Basis-Konfiguration (Kombinierte Entity)

```yaml
type: custom:time-spinner-card
entity: input_datetime.wakeup_time
```

### Separate Datums- und Zeit-Entities

```yaml
type: custom:time-spinner-card
date_entity: date.appointment_date
time_entity: time.appointment_time
name: Termin
icon: mdi:calendar-clock
icon_color: "#2196f3"
```

### Erweiterte Konfiguration mit Min/Max Jahren

```yaml
type: custom:time-spinner-card
entity: input_datetime.birthday
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
minute_step: 15
repeat: 3
```

## Konfigurationsoptionen

| Option | Beschreibung |
|--------|--------------|
| `entity` | Kombinierte Entity ID (`input_datetime.*`, `date.*` oder `time.*`) |
| `date_entity` | Separate Datums-Entity (`date.*` oder `input_datetime.*`) |
| `time_entity` | Separate Zeit-Entity (`time.*` oder `input_datetime.*`) |
| `name` | Anzeigename der Card (Standard: "Terminzeit") |
| `icon` | Material Design Icon (übernimmt automatisch das Icon der Entity) |
| `icon_color` | Icon-Farbe (Hex, CSS-Farbe oder CSS-Variable) |
| `minute_step` | Minuten-Schrittweite: 1, 5, 10, 15, 30 (Standard: 5) |
| `repeat` | Anzahl Wiederholungen im Spinner 1-10 (Standard: 3) |
| `min_year` | Minimales Jahr im Spinner (Standard: 1900 oder Entity-Attribut) |
| `max_year` | Maximales Jahr im Spinner (Standard: 2099 oder Entity-Attribut) |

## Kompatibilität

- **Home Assistant**: 2024.1 oder höher
- **Browser**: Alle modernen Browser mit ES6+ Support
- **Entities**: `input_datetime.*`, `date.*`, `time.*`
- **Dienste**: `input_datetime.set_datetime`, `date.set_date`, `time.set_value`

## Weitere Informationen

Siehe [README.md](https://github.com/diestrohs/time-spinner-card) für vollständige Dokumentation, Beispiele und card_mod Anpassungen.
