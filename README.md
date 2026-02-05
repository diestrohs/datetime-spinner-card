# Time Spinner Card

Eine moderne Home Assistant Lovelace Card mit iOS-style Spinner-Interface zur flexiblen Datums- und Zeitauswahl für `input_datetime`, `date` und `time` Entities.

## Version 0.1.1

### Screenshots

| Card Ansicht | Date Spinner | Time Spinner | Date + Time Spinner |
|---|---|---|---|
| ![Card](https://raw.githubusercontent.com/diestrohs/time-spinner-card/main/docs/assets/screenshot_card.png) | ![Date](https://raw.githubusercontent.com/diestrohs/time-spinner-card/main/docs/assets/screenshot_date.png) | ![Time](https://raw.githubusercontent.com/diestrohs/time-spinner-card/main/docs/assets/screenshot_time.png) | ![DateTime](https://raw.githubusercontent.com/diestrohs/time-spinner-card/main/docs/assets/screenshot_datetime.png) |

### Features

📅 **Datums- und Zeitauswahl** - Jahr, Monat, Tag, Stunde und Minute mit iOS-style Spinner  
🔀 **Flexible Entity-Konfiguration** - `entity`, `date_entity` und `time_entity` beliebig kombinierbar  
⚡ **"Heute"-Button** - Schnellauswahl für aktuelles Datum im Date-Picker  
🎯 **Min/Max Jahr-Kontrolle** - Aus Entity-Attributen auslesen oder in der Konfiguration überschreiben  
🎨 **Angelehnt an HA Design** - Aussehen ähnlich wie input_datetime Entity Row  
📱 **Mobile-Optimiert** - Responsive Design für iPhone, iPad und andere Geräte  
✨ **Automatische Icon-Übernahme** - Übernimmt standardmäßig das Icon der Entity  
⚙️ **Flexible Minuten-Schrittweite** - 1, 5, 10, 15 oder 30 Minuten  
🔄 **Konfigurierbare Wiederholungen** - Anpassbare Anzahl der Spinner-Wiederholungen (1-10)  
🖼️ **Visual Editor** - Komfortable Konfiguration über die Home Assistant UI  
🌙 **Theme-Support** - Passt sich automatisch an Dark/Light Themes an  
⚡ **Lit-basiert** - Moderne Web Components mit Shadow DOM  
🕐 **Universelle Entity-Unterstützung** - Funktioniert mit `input_datetime.*`, `date.*` und `time.*` Entities  
🌍 **Vollständige Mehrsprachigkeit** - 16+ Sprachen mit lokalisierten Buttons und Datumsformaten  
⏰ **12-Stunden AM/PM-Format** - Automatische Format-Erkennung aus HA Benutzereinstellungen  
🎨 **Button-Layout optimiert** - "Heute" links, "Abbrechen" mittig, "Speichern" rechts mit flexiblem Spacing  

### Neue Features in v0.1.1

🐛 **Bugfix: "Heute"-Button Highlighting**
- Highlighting wird jetzt korrekt angezeigt, wenn der "Heute"-Button geklickt wird
- Behebt Problem bei Wechsel zwischen Monaten mit unterschiedlichen Tageszahlen (z.B. 31 → 28 Tage)

### Features in v0.1.0

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

## Installation

### HACS (empfohlen)

1. Öffnen Sie HACS in Home Assistant
2. Geben Sie in der Suche `Time Spinner Card` ein
3. Installieren Sie "Time Spinner Card"

**Falls die Card noch nicht in HACS verfügbar ist** (z.B. während der Review-Phase):

1. HACS → Menü (⋮) → **Custom repositories**
2. Repository hinzufügen:
   - **Repository**: `https://github.com/diestrohs/time-spinner-card`
   - **Typ**: `Lovelace`
3. Speichern, dann HACS neu laden
4. Suchen Sie nach "Time Spinner Card" und installieren Sie die Card

### Manuelle Installation

1. Laden Sie `time-spinner-card.js` herunter
2. Kopieren Sie die Datei nach `config/www/time_picker_spinner/`
3. Fügen Sie die Ressource in Home Assistant hinzu:
   - Gehen Sie zu **Einstellungen** → **Dashboards** → **Ressourcen**
   - Klicken Sie auf **Ressource hinzufügen**
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
| `minute_step` | number | `5` | Minuten-Schrittweite (1, 5, 10, 15, 30) |
| `repeat` | number | `3` | Anzahl Wiederholungen im Spinner (1-10) |
| `min_year` | number | *aus Attribut* | Minimales Jahr im Spinner (Fallback: 1900) |
| `max_year` | number | *aus Attribut* | Maximales Jahr im Spinner (Fallback: 2099) |

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

### Terminplanung mit Datum und Zeit (separate Entities)

```yaml
type: custom:time-spinner-card
date_entity: date.appointment_date
time_entity: time.appointment_time
name: Termin
icon: mdi:calendar-clock
icon_color: "#2196f3"
minute_step: 15
repeat: 5
```

### Geburtsdatum mit Jahres-Beschränkung

```yaml
type: custom:time-spinner-card
entity: input_datetime.birthday
name: Geburtsdatum
icon: mdi:cake-variant
icon_color: "#ff6f7f"
min_year: 1950
max_year: 2023
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
type: custom:time-spinner-card
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
type: custom:time-spinner-card
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
type: custom:time-spinner-card
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

## Implementierte Features (Stand v0.1.1)

✅ **Basis-Funktionalität**
- iOS-style Spinner-Interface für Datum und Zeit
- Separate oder kombinierte Entity-Konfiguration
- Visual Editor in Home Assistant UI

✅ **Datum-Features**
- Jahr, Monat, Tag Auswahl mit Spinner-Wheels
- "Heute"-Button für Schnellauswahl (16+ Sprachen lokalisiert)
- Min/Max Jahr aus Entity-Attributen oder Config
- Automatische Tagesanzahl-Anpassung pro Monat (28-31)
- Highlighting für aktuell ausgewähltes Datum

✅ **Zeit-Features**
- 12-Stunden-Format mit AM/PM-Rad
- 24-Stunden-Format
- Automatische Format-Erkennung aus HA Settings
- Flexible Minuten-Schrittweite (1, 5, 10, 15, 30)

✅ **UI/UX**
- Button-Layout: "Heute" (links), "Abbrechen" (mitte), "Speichern" (rechts)
- Flexibles Spacing zwischen Buttons (5px minimum)
- Theme-Support (Dark/Light Mode)
- Mobile-responsive Design
- Icon-Übernahme von Entity

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

## Changelog

### Version 0.0.9 (2026-02-04)

**Vollständige Mehrsprachigkeit für Buttons**
- "Save"/"Speichern"-Button lokalisiert für alle 17 Sprachen
- "Cancel"/"Abbrechen"-Button lokalisiert für alle 17 Sprachen
- Deutsch: "Speichern" statt "OK"
- Englisch: "Save" statt "OK"
- Button-Abstand erhöht auf 4px (verhindert visuelles Zusammenstoßen)

**Lokalisierung und Personalisierung des Datumsformats**
- Datumsformat respektiert HA-Personalisierungseinstellungen (DMY, MDY, YMD, language, system)
- Dynamische Formatanzeige basierend auf Benutzerlocale
- Unterstützt 19 verschiedene Sprach-/Regionseinstellungen mit lokalen Datumsformaten
- Automatische Anpassung an Benutzer-Zeitzone

Weitere Sprachen mit nativen Übersetzungen: Französisch, Spanisch, Italienisch, Niederländisch, Polnisch, Portugiesisch, Schwedisch, Ungarisch, Tschechisch, Rumänisch, Russisch, Ukrainisch, Japanisch, Chinesisch, Koreanisch

### Version 0.0.8 (2026-02-04)

- Code cleanup und Optimierungen
- Duplicate Methoden entfernt
- Code quality improvements

### Version 0.0.7 (2026-02-04)

- Vollständige Datums-Auswahl (yyyy-mm-dd)
- Flexible Entity-Konfiguration
- Min/Max Jahr-Kontrolle
- Support für alle Entity-Types
- Mobile-Responsive Design
- Performance-Optimierungen

### Version 0.0.1 (2026-01-28)

🎉 **Erstes Release**

- ✨ Basis-Funktionalität mit Spinner-Interface
- 🖼️ Vollständiger Visual Editor
- ⚡ Lit-basierte Implementierung mit Shadow DOM
- 🌙 Theme-Support
- 🕐 Unterstützung für `input_datetime.*` und `time.*` Entities

## Support

Bei Problemen oder Feature-Requests erstellen Sie bitte ein Issue auf GitHub.
