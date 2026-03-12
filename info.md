# DateTime Spinner Card

Eine moderne Home Assistant Lovelace Card mit Spinner-Interface im iOS-Stil zur flexiblen Datums- und Zeitauswahl für `input_datetime`, `date` und `time` Entities.

## Aktuelles Release (0.2.1)

- Entity-Felder im visuellen Editor wieder als Auswahl-Picker nutzbar
- Umlaute und Übersetzungen im Editor korrigiert
- Wochenvorschau-Label für Datums-Buttons auf `wd. d. month` gesetzt

Alle Details zu allen Versionen stehen im [CHANGELOG.md](CHANGELOG.md).

## Funktionen

📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute mit Spinner im iOS-Stil  
🔀 **Flexible Entity-Konfiguration** - `entity`, `date_entity` und `time_entity` beliebig kombinierbar  
🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen auslesen oder in der Konfiguration überschreiben  
🎨 **Angelehnt an HA Design** - Aussehen ähnlich wie input_datetime Entity Row  
📱 **Mobile-Optimiert** - Responsive Design für iPhone, iPad und andere Geräte  
✨ **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🏷️ **Optional Labels in Buttons** - Zeigt Datumsformat (dd.mm.yyyy) und Zeit-Format (hh:mm) in den Buttons  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen  
🖼️ **Visueller Editor** - Komfortable Konfiguration über die Home Assistant UI  
🌙 **Theme-Unterstützung** - Passt sich automatisch an dunkle/helle Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*`, `date.*` und `time.*` Entities  
🌍 **Vollständige Mehrsprachigkeit** - 17+ Sprachen mit lokalisierten Buttons und Datumsformaten  
⏰ **12-Stunden AM/PM-Format** - Automatische Format-Erkennung aus HA Benutzereinstellungen  
📅 **Wochenvorschau-Modus** - 7-Tage-Datumsauswahl mit intelligenter Monatsnamen-Kürzung  
📏 **Kompakte Button-Breite** - Optimiert auf 140px für effiziente Raumausnutzung  

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Geben Sie in der Suche `DateTime Spinner Card` ein
3. Installieren Sie "DateTime Spinner Card"

### Manuelle Installation

1. Laden Sie `datetime-spinner-card.js` herunter
2. Kopieren Sie die Datei nach `/config/www/datetime-spinner-card/`
3. Fügen Sie die Ressource in Home Assistant hinzu:
   - **Einstellungen** → **Dashboards** → **Ressourcen**
   - URL: `/local/datetime-spinner-card/datetime-spinner-card.js`
   - Ressourcentyp: **JavaScript Module**

## Verwendung

### Basis-Konfiguration (Kombinierte Entity)

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.wakeup_time
```

### Separate Datums- und Zeit-Entities

```yaml
type: custom:datetime-spinner-card
date_entity: date.appointment_date
time_entity: time.appointment_time
name: Termin
icon: mdi:calendar-clock
icon_color: "#2196f3"
```

### Erweiterte Konfiguration mit Min/Max Jahren

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.birthday
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
minute_step: 15
repeat: 3
```

### Wochenvorschau-Modus (7-Tage-Auswahl)

```yaml
type: custom:datetime-spinner-card
date_entity: date.appointment_date
name: Termin
icon: mdi:calendar-check
icon_color: "#4caf50"
week_forecast: true
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
| `layout` | Layout-Modus: `horizontal` (Standard) oder `vertical` |
| `show_label` | Labels in Buttons anzeigen (Datumsformat + Zeitformat) - Standard: false |
| `week_forecast` | Wochenvorschau-Modus: 7-Tage-Auswahl mit "Heute", "Morgen" und formatierte Tage (z.B. "Mo. 31. Sep.") - Standard: false |
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

Siehe [README.md](https://github.com/diestrohs/datetime-spinner-card) für vollständige Dokumentation, Beispiele und card_mod Anpassungen.
