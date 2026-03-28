# DateTime Spinner Card

Eine moderne Home Assistant Lovelace Card mit Spinner-Interface im iOS-Stil zur flexiblen Datums- und Zeitauswahl für `input_datetime`, `date` und `time` Entities.

## Version 0.2.2

### Screenshots

| Card Ansicht | Date Spinner | Time Spinner | Week Forecast |
|---|---|---|---|
| ![Card](https://raw.githubusercontent.com/diestrohs/datetime-spinner-card/main/docs/assets/screenshot_card.png) | ![Date](https://raw.githubusercontent.com/diestrohs/datetime-spinner-card/main/docs/assets/screenshot_date.png) | ![Time](https://raw.githubusercontent.com/diestrohs/datetime-spinner-card/main/docs/assets/screenshot_time.png) | ![Week Forecast](https://raw.githubusercontent.com/diestrohs/datetime-spinner-card/main/docs/assets/screenshot_week_forcast.png) |

### Funktionen

📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute mit Spinner im iOS-Stil  
🔀 **Flexible Entity-Konfiguration** - `entity`, `date_entity` und `time_entity` beliebig kombinierbar  
⚡ **"Heute"-Button** - Schnellauswahl für aktuelles Datum im Date-Picker  
🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen auslesen oder in der Konfiguration überschreiben  
🎨 **Angelehnt an HA Design** - Aussehen ähnlich wie input_datetime Entity Row  
📱 **Mobile-Optimiert** - Responsive Design für iPhone, iPad und andere Geräte  
✨ **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🏷️ **Optional Labels in Buttons** - Zeigt Datumsformat (dd.mm.yyyy) und Zeit-Format (hh:mm) in den Buttons  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen (1-10)  
🖼️ **Visueller Editor** - Komfortable Konfiguration über die Home Assistant UI mit DE/EN Übersetzungen  
🌙 **Theme-Unterstützung** - Passt sich automatisch an dunkle/helle Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*`, `date.*` und `time.*` Entities  
🌍 **Vollständige Mehrsprachigkeit** - 16+ Sprachen mit lokalisierten Buttons und Datumsformaten  
⏰ **12-Stunden AM/PM-Format** - Automatische Format-Erkennung aus HA Benutzereinstellungen  
🎯 **Smart Save Button** - Primary-Farbe nur bei tatsächlichen Änderungen für bessere UX  
📐 **Optimiertes Button-Layout** - Perfekte Ausrichtung in allen Modi (date/time/combined)  
📅 **Wochenvorschau-Modus** - 7-Tage-Datumsauswahl mit intelligenter Monatsnamen-Kürzung (week_forecast)  
📏 **Kompakte Button-Breite** - Optimiert auf 140px für effiziente Raumausnutzung  
📳 **Haptisches Feedback (iOS)** - Fühlbares Feedback beim Scrollen in HA iOS App (konfigurierbar)  
🎯 **Smart Forecast-Vorwahl** - Vergangene Daten wählen im Wochenmodus automatisch „Heute“ vor

## Aktuelles Release (0.2.2)

- Aktiver Date-/Time-Button erhält jetzt eine Primary-farbene untere Border, solange der Spinner offen ist
- Umsetzung über dynamische `spinner-open` Klasse in Abhängigkeit von `overlayOpen` und `overlayType`
- Vorherige Verbesserungen aus `0.2.1` bleiben vollständig enthalten

Alle Details zu allen Versionen stehen im [CHANGELOG.md](CHANGELOG.md).

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Geben Sie in der Suche `DateTime Spinner Card` ein
3. Installieren Sie "DateTime Spinner Card"

**Falls die Card noch nicht in HACS verfügbar ist** (z.B. während der Review-Phase):

1. HACS → Menü (⋮) → **Custom repositories**
2. Repository hinzufügen:
  - **Repository**: `https://github.com/diestrohs/datetime-spinner-card`
  - **Typ**: `Lovelace`
3. Speichern, dann HACS neu laden
4. Suchen Sie nach "DateTime Spinner Card" und installieren Sie die Card

### Manuelle Installation

1. Laden Sie `datetime-spinner-card.js` herunter
2. Kopieren Sie die Datei nach `/config/www/datetime-spinner-card/`
3. Fügen Sie die Ressource in Home Assistant hinzu:
   - Gehen Sie zu **Einstellungen** → **Dashboards** → **Ressourcen**
   - Klicken Sie auf **Ressource hinzufügen**
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

### Wochenvorschau-Modus (7-Tage-Auswahl)

```yaml
type: custom:datetime-spinner-card
date_entity: date.appointment_date
name: Termin
icon: mdi:calendar-check
icon_color: "#4caf50"
week_forecast: true
```

Dieser Modus zeigt eine 7-Tage-Vorschau:
- **Heute** und **Morgen** als lesbare Labels
- Weitere Tage im Format "Mo. 31. Sep." (Wochentag 2 Zeichen + Tag + Monat intelligent gekürzt)
- Vergangene Tage sind deaktiviert (nur Zukunftsdaten auswählbar)
- Optimal für Terminbuchungen und Planungen

### Erweiterte Konfiguration mit Min/Max Jahren

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.birthdate
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
minute_step: 15
repeat: 3
```

### Konfigurationsoptionen

| Option | Typ | Standard | Beschreibung |
|--------|-----|----------|--------------|
| `entity` | string | *optional* | Kombinierte Entity ID (`input_datetime.*`, `date.*` oder `time.*`) - erkennt automatisch Typ |
| `date_entity` | string | *optional* | Separate Datums-Entity (`date.*` oder `input_datetime.*`) |
| `time_entity` | string | *optional* | Separate Zeit-Entity (`time.*` oder `input_datetime.*`) |
| `name` | string | `"Terminzeit"` | Anzeigename der Card |
| `icon` | string | *Entity-Icon oder `"mdi:clock"`* | Material Design Icon (übernimmt automatisch das Icon der Entity, falls nicht gesetzt) |
| `icon_color` | string | `"var(--primary-text-color)"` | Icon-Farbe (Hex, CSS-Farbe oder CSS-Variable) |
| `layout` | string | `"horizontal"` | Layout-Modus: `"horizontal"` (Icon+Name+Buttons in einer Zeile) oder `"vertical"` (Icon+Name oben, Buttons darunter) |
| `show_label` | boolean | `false` | Labels in Buttons anzeigen (Datumsformat + Zeitformat) |
| `week_forecast` | boolean | `false` | Wochenvorschau-Modus: 7-Tage-Auswahl mit "Heute", "Morgen" und formatierte Tage (z.B. "Mo. 31. Sep.") |
| `minute_step` | number | `5` | Minuten-Schrittweite (1, 5, 10, 15, 30) |
| `repeat` | number | `3` | Anzahl Wiederholungen im Spinner (1-10) |
| `min_year` | number | *aus Attribut* | Minimales Jahr im Spinner (Fallback: 1900) |
| `max_year` | number | *aus Attribut* | Maximales Jahr im Spinner (Fallback: 2099) |

## Visueller Editor

Die Card verfügt über einen vollständigen visuellen Editor in der Home Assistant UI:

1. Fügen Sie eine neue Card hinzu
2. Suchen Sie nach "DateTime Spinner Card"
3. Konfigurieren Sie alle Optionen über die grafische Oberfläche
4. Entity-Picker, Icon-Picker und alle Felder sind direkt verfügbar

## Beispiele

### Wecker mit 5-Minuten-Schritten

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.alarm_time
name: Weckzeit
icon: mdi:alarm
icon_color: "#ff9800"
minute_step: 5
show_label: true
```

### Terminplanung mit Datum und Zeit (separate Entities)

```yaml
type: custom:datetime-spinner-card
date_entity: date.appointment_date
time_entity: time.appointment_time
name: Termin
icon: mdi:calendar-clock
icon_color: "#2196f3"
minute_step: 15
repeat: 5
```

### Geburtsdatum mit Jahres-Beschränkung und Label

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.birthday
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
show_label: true
```

### EV-Ladeplanung mit 30-Minuten-Schritten (EVCC Scheduler)

```yaml
type: custom:datetime-spinner-card
entity: time.evcc_elroq_repeating_plan_1_time
name: Ladestart
icon: mdi:ev-station
icon_color: "#4caf50"
minute_step: 30
repeat: 5
```

> **Hinweis**: Funktioniert perfekt mit [EVCC Scheduler Integration](https://github.com/diestrohs/ha-evcc-scheduler)

## Card_Mod Anpassungen

Die Card ist vollständig mit [card_mod](https://github.com/thomasloven/lovelace-card-mod) kompatibel. Sie können damit benutzerdefinierte Layouts und Designs erstellen.

### Standard-Layout (ohne card_mod)

Ohne card_mod wird die Card wie eine standard HA datetime Card dargestellt:
- Icon links
- Name in der Mitte
- Einfaches Zeit-Button (hh:mm) rechts
- Minimalistisches Design

### Custom Layout mit Spinner-Anzeige

Mit card_mod können Sie ein Spinner-Grid-Layout erstellen:

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.wakeup_time
name: Weckzeit
card_mod:
  style:
    .entity-row: |
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: 12px;
      padding: 16px;
    .name: |
      font-weight: 500;
    .time-btn: |
      width: 120px;
      border: 2px solid var(--primary-color);
      border-radius: 8px;
      background: linear-gradient(135deg, rgba(68, 115, 158, 0.1), transparent);
      font-weight: bold;
      font-size: 16px;
```

### Farben und Styling

```yaml
type: custom:datetime-spinner-card
entity: input_datetime.appointment_time
name: Termine
icon_color: "#FF6B6B"
card_mod:
  style:
    .time-btn: |
      width: 90px;
      background: rgba(255, 107, 107, 0.1);
      border: 2px solid #FF6B6B;
      color: #FF6B6B;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
    .time-btn:hover: |
      background: rgba(255, 107, 107, 0.2);
      transform: scale(1.05);
```

### Flex-Layout mit zusätzlichen Elementen

```yaml
type: custom:datetime-spinner-card
entity: time.start_time
name: Startzeit
card_mod:
  style:
    .entity-row: |
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 20px;
      background: var(--primary-background-color);
      border-radius: 8px;
      border-left: 4px solid var(--primary-color);
    .name: |
      font-size: 16px;
      font-weight: 600;
      flex: 1;
    .time-btn: |
      width: 100px;
      height: 40px;
      border-radius: 6px;
      border: 2px solid var(--primary-color);
      background: transparent;
      font-weight: bold;
      transition: all 0.3s;
    .time-btn:hover: |
      background: var(--primary-color);
      color: var(--primary-background-color);
```

## Kompatibilität und Responsive Design

- **Home Assistant**: 2024.1 oder höher
- **Browser**: Alle modernen Browser mit ES6+ Support
- **Mobil-Optimiert**: Vollständig responsive für iPhone, iPad und kleine Bildschirme
- **Entities**: `input_datetime.*`, `date.*`, `time.*`
- **Dienste**: Automatische Erkennung (`input_datetime.set_datetime`, `date.set_date`, `time.set_value`)
- **Lokalisierung**: 16+ Sprachen (de, en, fr, es, it, nl, pl, pt, sv, hu, cs, ro, ru, uk, ja, zh, ko)
- **Zeit-Formate**: Automatische Erkennung 12h/24h aus HA Benutzereinstellungen
- **Datums-Formate**: DMY, MDY, YMD basierend auf HA Locale-Einstellungen

## Bekannte Einschränkungen

- Overlay ist modal (blockiert Hintergrund-Interaktionen)
- Benötigt mindestens eine Entity-Konfiguration (`entity` oder `date_entity`/`time_entity`)
- Minuten-Schrittweite nur in vordefinierten Werten (1, 5, 10, 15, 30)

## Implementierte Funktionen (Stand v0.1.2)

✅ **Basis-Funktionalität**
- Spinner-Interface im iOS-Stil für Datum und Zeit
- Separate oder kombinierte Entity-Konfiguration
- Visueller Editor in Home Assistant UI

✅ **Datumsfunktionen**
- Jahr, Monat, Tag Auswahl mit Spinner-Wheels
- "Heute"-Button für Schnellauswahl (16+ Sprachen lokalisiert)
- Min/Max Jahr aus Entity-Attributen oder Config
- Automatische Tagesanzahl-Anpassung pro Monat (28-31)
- Highlighting für aktuell ausgewähltes Datum

✅ **Zeitfunktionen**
- 12-Stunden-Format mit AM/PM-Rad
- 24-Stunden-Format
- Automatische Format-Erkennung aus HA Settings
- Flexible Minuten-Schrittweite (1, 5, 10, 15, 30)

✅ **UI/UX**
- Button-Layout: "Heute" (links), "Abbrechen" (mitte), "Speichern" (rechts)
- Flexibles Spacing zwischen Buttons (5px minimum)
- Theme-Unterstützung (dunkler/heller Modus)
- Mobile-responsive Design
- Icon-Übernahme von Entity
- Optional Labels in Buttons (Datumsformat + Zeitformat)
- Tile-ähnliches Layout mit rechts-ausgerichteten Buttons
- Adaptive Button-Höhen (40px - 56px)

✅ **Lokalisierung**
- 16+ Sprachen vollständig unterstützt
- Datums-Format aus HA Locale (DMY/MDY/YMD)
- Zeit-Format aus HA Settings (12h/24h)
- Lokalisierte Button-Texte ("Heute", "Speichern", "Abbrechen")

## Roadmap

- [ ] Mehr Styling-Optionen
- [ ] Animationen konfigurierbar machen
- [ ] Tastatur-Shortcuts
- [ ] Accessibility-Verbesserungen (ARIA-Labels)
- [ ] Custom Date Range Validierung
- [ ] Sekunden-Unterstützung

## Lizenz

MIT License

## Support

Bei Problemen oder Feature-Anfragen erstellen Sie bitte ein Issue auf GitHub.
