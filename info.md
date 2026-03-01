# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit iOS-style Spinner-Interface zur flexiblen Datums- und Zeitauswahl für `input_datetime`, `date` und `time` Entities.

## Version 0.1.4

### Änderungen in v0.1.4

✨ **Neue Features**
- Visual Editor vollständig übersetzt (Deutsch/Englisch)
  - Automatische Spracherkennung aus Home Assistant
  - Alle Labels, Helper-Texte und Optionen in beiden Sprachen

💅 **Verbesserungen**
- Smart Save Button: Primary-Farbe nur bei tatsächlichen Änderungen
  - Normale Farbe beim Öffnen (wie Cancel Button)
  - Wechselt zu Primary-Farbe nur nach Benutzerinteraktion
  - Verhindert ungewollte Farbe während des initialen Snappings

- Button-Alignment in allen Modi optimiert
  - Save Button rechtsbündig zum letzten Wheel (Minutes oder AM/PM)
  - Cancel Button linksbündig
  - Funktioniert in allen Szenarien: time only, date only, date & time

## Version 0.1.3

### Änderungen in v0.1.3

✨ **Neue Features**
- `show_label` Config-Option für optionale Label in Buttons ("dd.mm.yyyy", "hh:mm")
- Tile-ähnliches Layout mit rechts-ausgerichteten Buttons (`margin-left: auto`)
- Adaptive Button-Höhen: 40px (ohne Label) / 56px (mit Label)
- Konsistente Card-Höhe durch `min-height: 56px` auf entity-row

🧹 **Code-Bereinigung**
- Rekursions-Bug in `_formatDateByLocale()` behoben
- Ungenutzten Methode `_getTimeZone()` entfernt
- Redundante Methode `_getFormatLabel()` entfernt
- Code-Konsistenz und Wartbarkeit verbessert

## Version 0.1.2

### Änderungen in v0.1.2

⚡ **Performance-Optimierungen**
- Wiederholte Berechnung von `Math.floor(this.repeat / 2)` optimiert
- Unbenutzte Funktion `updateDaysWheel()` entfernt

📝 **Dokumentation**
- Screenshot für Date+Time Spinner entfernt (nicht mehr verfügbar)

### Features

📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute mit iOS-style Spinner  
🔀 **Flexible Entity-Konfiguration** - `entity`, `date_entity` und `time_entity` beliebig kombinierbar  
🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen auslesen oder in der Konfiguration überschreiben  
🎨 **Angelehnt an HA Design** - Aussehen ähnlich wie input_datetime Entity Row  
📱 **Mobile-Optimiert** - Responsive Design für iPhone, iPad und andere Geräte  
✨ **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🏷️ **Optional Labels in Buttons** - Zeigt Datumsformat (dd.mm.yyyy) und Zeit-Format (hh:mm) in den Buttons  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen  
🖼️ **Visual Editor** - Komfortable Konfiguration über die Home Assistant UI  
🌙 **Theme-Support** - Passt sich automatisch an Dark/Light Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*`, `date.*` und `time.*` Entities  
🌍 **Vollständige Mehrsprachigkeit** - 17+ Sprachen mit lokalisierten Buttons und Datumsformaten  
⏰ **12-Stunden AM/PM-Format** - Automatische Format-Erkennung aus HA Benutzereinstellungen  

### Neue Features in v0.1.0

⏰ **12-Stunden-Zeit-Format mit AM/PM-Unterstützung**
- Automatische Format-Erkennung aus Home Assistant Benutzereinstellungen
- Lokalisierte Zeit-Anzeige (z.B. "10:00 AM" oder "22:30")
- Separates AM/PM-Selektions-Rad im Overlay
- Dynamische Stunden-Bereich (1-12 für 12h, 0-23 für 24h)
- Automatische Konvertierung zwischen 12h und 24h Format beim Speichern
- Unterstützung für HA-Einstellungen: '12', '24', 'language', 'system'

✨ **Verbesserungen**
- AM/PM-Rad begrenzt auf nur 2 Werte ohne Wiederholungen (kompakt)
- Zeit-Label bleibt konstant 'hh:mm' unabhängig vom Format
- Nahtlose Integration mit HA Locale-Einstellungen
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
