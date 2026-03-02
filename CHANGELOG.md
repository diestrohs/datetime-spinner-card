# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

## [0.1.5] - 2026-03-02

### Hinzugefügt
- **Monatsnamen-Kürzung in Wochenvorschau** - Intelligente Abbreviatur von langen Monatsnamen
  - Monate mit ≤4 Zeichen bleiben unverändert (März, Mai, Juni, Juli)
  - Längere Monate werden auf 3 Zeichen + Punkt gekürzt (Jan., Feb., Apr., Sep., etc.)
  - Konsistente Formatierung über alle Sprachen (16+ Sprachen unterstützt)
  - Anwendbar in Wochenvorschau und Forecast-Wheel

### Verbessert
- **Button-Breite Optimierung** - Reduziert von 180px auf 140px für kompaktere Layouts
  - Bessere Raumausnutzung ohne Text-Cutoff bei Standard-Datumsformat
  - Wochenvorschau: min-width 140px für optimale Balance zwischen Kompaktheit und Readability

## [0.1.4] - 2026-03-02

### Hinzugefügt
- **Visual Editor Übersetzungen** - Vollständige Deutsch und Englisch Übersetzungen
  - Automatische Spracherkennung aus Home Assistant
  - Alle Labels, Helper-Texte und Optionen übersetzt

### Verbessert
- **Smart Save Button** - Primary-Farbe nur bei tatsächlichen Änderungen
  - Normale Farbe beim Öffnen des Spinners (wie Cancel Button)
  - Wechselt zu Primary-Farbe nur nach Benutzerinteraktion
  - Verhindert ungewollte Farbe während des initialen Snappings

- **Button-Alignment** - Korrigierte Ausrichtung in allen Modi
  - Save Button rechtsbündig zum letzten Wheel (Minutes oder AM/PM)
  - Cancel Button linksbündig
  - Today Button (falls vorhanden) linksbündig mit Cancel rechts davon
  - Funktioniert in allen Szenarien: time only, date only, date & time

## [0.1.3] - 2026-03-02

### Hinzugefügt
- **`show_label` Config-Option** - Optionale Label in Buttons (Datumsformat + Zeitformat)
  - Standardmäßig `false` (kein Label)
  - Zeigt "dd.mm.yyyy" und "hh:mm" in den Buttons wenn aktiviert
  - Toggle im Visual Editor vorhanden
  - Keine Höhen-Veränderung bei Aktivierung/Deaktivierung

- **Tile-ähnliches Layout**
  - Buttons auf der rechten Seite ausgerichtet (`margin-left: auto`)
  - Konsistente Höhe durch `min-height: 56px` auf entity-row
  - Responsive Design mit flexbox

- **Adaptive Button-Höhen**
  - 40px ohne Label
  - 56px mit Label
  - Smooth Transition zwischen Layouts

### Behoben
- **Kritischer Rekursions-Bug in `_formatDateByLocale()`** 
  - Methode rief sich selbst auf statt Formatierungs-Logik auszuführen
  - Wurde zu Duplikat konsolidiert

### Geändert
- Entfernte ungenutzete Methode `_getTimeZone()`
- Entfernte redundante Methode `_getFormatLabel()`
- Card-Höhe jetzt `height: auto` (nimmt nur benötigte Höhe ein)
- Verbesserter Code-Flow und Wartbarkeit

### Dokumentation
- `show_label` Config-Option dokumentiert
- Beispiele mit Labels aktualisiert
- Features-Liste erweitert

## [0.1.2] - 2026-02-05

### Verbesserungen
- Performance: Wiederholte Berechnung von `Math.floor(this.repeat / 2)` optimiert
- Unbenutzte Funktion `updateDaysWheel()` entfernt

### Dokumentation
- Screenshot für Date+Time Spinner entfernt (nicht mehr verfügbar)

## [0.1.1] - 2026-02-05

### Behoben
- **Highlighting korrekt bei "Heute"-Button**
  - Datum-Wheels werden jetzt mit buildWheel() neu erstellt vor setInitial()
  - Behebt Problem bei Monaten mit unterschiedlichen Tagen (z.B. 31 → 28)
  - Highlighting zeigt jetzt das richtige Datum an, wenn "Heute" geklickt wird

## [0.1.0] - 2026-02-05

### Hinzugefügt
- **12-Stunden-Zeit-Format mit AM/PM-Unterstützung**
  - Automatische Format-Erkennung aus Home Assistant Benutzereinstellungen
  - Lokalisierte Zeit-Anzeige (z.B. "10:00 AM" oder "22:30")
  - Separates AM/PM-Selektions-Rad im Overlay
  - Dynamische Stunden-Bereich (1-12 für 12h, 0-23 für 24h)
  - Automatische Konvertierung zwischen 12h und 24h Format beim Speichern
  - Unterstützung für HA-Einstellungen: '12', '24', 'language', 'system'

### Verbesserungen
- AM/PM-Rad begrenzt auf nur 2 Werte ohne Wiederholungen (kompakt)
- Zeit-Label bleibt konstant 'hh:mm' unabhängig vom Format
- Nahtlose Integration mit HA Locale-Einstellungen

## [0.0.10] - 2026-02-05

### Verbesserungen
- **Optimierte Platznutzung**
  - Name-Bereich nutzt jetzt maximalen verfügbaren Platz (flex: 1)
  - Reduzierte Abstände für kompakteres Layout (5px statt 16px)
  - Zeit-Button schmaler (min-width: 70px) für ausgewogene Proportionen
  - Mehr Platz für längere Entitätsnamen bei gleicher Button-Funktionalität

### Geändert
- Name padding-right: 16px → 5px
- Button margin-left: 16px → 5px
- Zeit-Button erhält eigene Breite für bessere Text-Proportionen

## [0.0.9] - 2026-02-04

### Hinzugefügt
- **Vollständige Mehrsprachigkeit für Buttons**
  - "Save"/"Speichern"-Button lokalisiert für alle 17 Sprachen
  - "Cancel"/"Abbrechen"-Button lokalisiert für alle 17 Sprachen
  - Deutsch: "Speichern" statt "OK"
  - Englisch: "Save" statt "OK"
  - Weitere Sprachen mit nativen Übersetzungen (Französisch, Spanisch, Italienisch, etc.)

### Verbesserungen
- Button-Abstand erhöht auf 4px (verhindert visuelles Zusammenstoßen)
- Bessere Lesbarkeit der Buttons im Time-Only Spinner

## [0.0.8] - 2026-02-04

### Hinzugefügt
- Code cleanup und Optimierungen
- Bug fixes und Verbesserungen

### Behoben
- Duplicate `_getEntityType()` Methode entfernt
- Code quality improvements

### Dokumentation
- README aktualisiert mit v0.0.7 Features
- CHANGELOG erweitert

## [0.0.7] - 2026-02-04

### Hinzugefügt
- **Vollständige Datums-Auswahl (yyyy-mm-dd)**
  - Jahr-Spinner (konfigurierbar mit min_year/max_year)
  - Monat-Spinner (1-12)
  - Tag-Spinner (dynamisch berechnet für jeden Monat/Jahr)
  - Automatische Tag-Validierung (z.B. Feb 30 → Feb 28/29)
- **Flexible Entity-Konfiguration**
  - `date_entity`: Separate Date Entity (`date.*` oder `input_datetime.*`)
  - `time_entity`: Separate Time Entity (`time.*` oder `input_datetime.*`)
  - `entity`: Kombiniert beide Komponenten (automatische Erkennung)
  - Beliebig kombinierbar (nur Datum, nur Zeit, oder beides)
- **Min/Max Jahr-Kontrolle**
  - Aus Entity-Attributen (`min_year`, `max_year`) auslesen
  - Via Config überschreibbar (`min_year: 1950`, `max_year: 2030`)
  - Fallback auf 1900-2099
- **Support für alle Entity-Types**
  - `input_datetime.*` (mit `input_datetime.set_datetime`)
  - `date.*` (mit `date.set_date`)
  - `time.*` (mit `time.set_value`)
- **Mobile-Responsive Design**
  - Optimierte Spinner-Breiten für verschiedene Bildschirmgrößen
  - iPhone-optimierte Layouts
  - Vertikale Ausrichtung für alle Element-Typen
  - Responsive Schriftgrößen und Abstände
- **Performance-Optimierungen**
  - Caching von Year-Range-Berechnungen
  - Helper-Methoden zur Code-Reduktion
  - Effiziente CSS-Klassen-Berechnung

### Behoben
- **Flickering-Fix**: Date-Wheel wird nicht mehr während des Scrollens aktualisiert, nur nach Abschluss
  - `smoothSnap` Parameter für kontrolliertes Scroll-Snapping
  - `behavior: auto` für Date-Wheels (keine Animationen)
  - `behavior: smooth` für Time-Spinner (bessere UX)
- **Vertikale Ausrichtung**: Korrekte Alignment von Spinner-Elementen und Trennzeichen
- **Responsive-Fehler**: Spinner-Größe passt sich jetzt korrekt an Bildschirmgröße an

### Dokumentation
- README.md mit neuen Date-Features, Beispielen und separaten Entity-Konfigurationen aktualisiert
- info.md mit Datums-Support erweitert
- Konfigurationsbeispiele für verschiedene Use-Cases hinzugefügt

## [0.0.6] - 2026-02-02

### Geändert
- **Feinabstimmung der Abstände für perfekte Ausrichtung**
  - Icon-Name Abstand optimiert: `margin-left: 4px` (statt 8px) für engeren Abstand
  - Vertikales Entity-Row Padding hinzugefügt: `padding: 4px 16px` für korrekte Card-Höhe
  - Finale visuelle Anpassung für 100%ige Übereinstimmung mit HA input_datetime

### Behoben
- Verhindere vertikale Verschiebung der Zeit bei Eingabe-Focus/Active (padding-bottom Anpassung)

### Dokumentation
- CHANGELOG, README und info.md mit allen v0.0.5 Verbesserungen aktualisiert

## [0.0.5] - 2026-02-02

### Geändert
- **Pixel-perfekte Ausrichtung mit Home Assistant input_datetime Entity Row**
  - Exakte Material Design Text Field Implementierung mit allen MDC CSS Custom Properties
  - Kopiert hui-generic-entity-row Struktur, Spacing und Flex-Layout
  - Implementiert ha-date-input/ha-time-input Styling 1:1
  - Nutzt `--state-icon-color` für Icons (state-badge Standard)
  - Korrekte Icon-Abmessungen: `flex: 0 0 40px` mit `padding: 8px`
  - Name/Info Spacing: `margin-left: 4px`, `padding-right: 16px`
  - Eingabefeld Spacing: `margin-left: 16px` für optimalen Abstand
  - Eingabefeld Höhe: `min-height: 56px` mit `padding: 24px 12px 12px`
  - "hh:mm" Label perfekt positioniert: `top: 8px` für idealen Abstand zur Uhrzeit
  - Entity-Row: `padding: 4px 16px` für korrekte vertikale Card-Höhe
  - Border-radius 4px 4px 0 0 für Material Text Field Erscheinung
  - Roboto Font Family für Label, primäre Textfarbe für Uhrzeit-Anzeige
  - Zentrierte Zeit-Anzeige mit korrekten vertikalen Abständen
  - Hover und Focus States mit MDC-Variablen:
    - Border: 1px solid `--mdc-text-field-idle-line-color`
    - Background: `--mdc-text-field-fill-color` (whitesmoke Fallback)
    - Hover: `--mdc-text-field-hover-line-color` und hover-fill-color
    - Focus/Active: 2px solid `--mdc-theme-primary`

### Technische Details
- 20+ iterative Styling-Verfeinerungen für pixelgenaue Übereinstimmung
- Home Assistant Frontend Repository detailliert analysiert (home-assistant/frontend)
- Styles extrahiert und adaptiert aus:
  - `hui-generic-entity-row` (Entity Row Layout und Flex-Properties)
  - `state-badge` (Icon Dimensionen und Spacing)
  - `state-info` (Name/Info Margins und Text-Styles)
  - `ha-time-input` / `ha-base-time-input` (Eingabefeld Höhe und Padding)
  - Material Design Text Field Komponenten (MDC Variables)
- Ergebnis: Vollständig identisches Aussehen mit nativen HA Datetime Cards

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
