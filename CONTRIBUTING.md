# Beitragen zu Time Spinner Card

Vielen Dank für dein Interesse, zu diesem Projekt beizutragen! 🎉

## Wie kann ich beitragen?

### Bug Reports

Wenn du einen Bug findest:

1. Überprüfe, ob der Bug bereits gemeldet wurde
2. Falls nicht, erstelle ein [neues Issue](https://github.com/diestrohs/time-spinner-card/issues/new?template=bug_report.md)
3. Fülle das Bug Report Template vollständig aus
4. Füge relevante Logs und Screenshots hinzu

### Feature Requests

Hast du eine Idee für ein neues Feature?

1. Überprüfe, ob das Feature bereits vorgeschlagen wurde
2. Erstelle ein [neues Issue](https://github.com/diestrohs/time-spinner-card/issues/new?template=feature_request.md)
3. Beschreibe den Use Case und die gewünschte Lösung

### Pull Requests

1. **Fork** das Repository
2. **Clone** deinen Fork: `git clone https://github.com/diestrohs/time-spinner-card.git`
3. Erstelle einen **Feature Branch**: `git checkout -b feature/mein-feature`
4. **Commit** deine Änderungen: `git commit -m 'Add: Mein tolles Feature'`
5. **Push** zum Branch: `git push origin feature/mein-feature`
6. Erstelle einen **Pull Request**

## Entwicklung

### Voraussetzungen

- Home Assistant Installation (2024.1.0+)
- Moderner Browser mit ES6+ Support
- Text Editor / IDE

### Lokale Entwicklung

1. Kopiere `time-spinner-card.js` nach `config/www/time_picker_spinner/`
2. Füge die Ressource in Home Assistant hinzu
3. Füge eine Test-Card zu deinem Dashboard hinzu
4. Bearbeite die Datei und lade die Seite neu (Hard Refresh: Ctrl+Shift+R)

### Code-Stil

- Verwende 2 Spaces für Einrückungen
- Folge den Lit Element Best Practices
- Kommentiere komplexe Logik
- Halte Funktionen klein und fokussiert

### Testing

Teste deine Änderungen mit:

- ✅ `input_datetime.*` Entities
- ✅ `time.*` Entities
- ✅ Verschiedene `minute_step` Werte (1, 5, 10, 15, 30)
- ✅ Dark und Light Theme
- ✅ Mobile und Desktop Browser
- ✅ Visual Editor

## Commit Messages

Verwende aussagekräftige Commit Messages:

- `Add: Neues Feature`
- `Fix: Bug-Beschreibung`
- `Update: Bestehende Funktionalität verbessert`
- `Docs: Dokumentation aktualisiert`
- `Style: Code-Formatierung`
- `Refactor: Code umstrukturiert`

## Lizenz

Indem du zu diesem Projekt beiträgst, stimmst du zu, dass deine Beiträge unter der MIT License lizenziert werden.

## Fragen?

Falls du Fragen hast, erstelle einfach ein Issue oder kontaktiere die Maintainer!

Vielen Dank! 🙏
