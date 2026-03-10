# Beitragen zu DateTime Spinner Card

Vielen Dank für Ihr Interesse, zu diesem Projekt beizutragen! 🎉

## Wie kann ich beitragen?

### Bug Reports

Wenn Sie einen Bug finden:

1. Überprüfen Sie, ob der Bug bereits gemeldet wurde
2. Falls nicht, erstellen Sie ein [neues Issue](https://github.com/diestrohs/datetime-spinner-card/issues/new?template=bug_report.md)
3. Füllen Sie die Bug-Report-Vorlage vollständig aus
4. Fügen Sie relevante Logs und Screenshots hinzu

### Feature Requests

Haben Sie eine Idee für ein neues Feature?

1. Überprüfen Sie, ob das Feature bereits vorgeschlagen wurde
2. Erstellen Sie ein [neues Issue](https://github.com/diestrohs/datetime-spinner-card/issues/new?template=feature_request.md)
3. Beschreiben Sie den Anwendungsfall und die gewünschte Lösung

### Pull-Requests

1. Erstellen Sie eine **Repository-Abspaltung**
2. **Klonen** Sie Ihre Repository-Abspaltung: `git clone https://github.com/diestrohs/datetime-spinner-card.git`
3. Erstellen Sie einen **Feature-Branch**: `git checkout -b feature/mein-feature`
4. **Commit** Ihre Änderungen: `git commit -m 'Add: Mein tolles Feature'`
5. **Pushen** Sie den Branch: `git push origin feature/mein-feature`
6. Erstellen Sie einen **Pull-Request**

## Entwicklung

### Voraussetzungen

- Home Assistant Installation (2024.1.0+)
- Moderner Browser mit ES6+ Support
- Text Editor / IDE

### Lokale Entwicklung

1. Kopieren Sie `datetime-spinner-card.js` nach `/config/www/datetime-spinner-card/`
2. Fügen Sie die Ressource in Home Assistant hinzu
3. Fügen Sie eine Test-Card zu Ihrem Dashboard hinzu
4. Bearbeiten Sie die Datei und laden Sie die Seite neu (Hard Refresh: Ctrl+Shift+R)

### Code-Stil

- Verwenden Sie 2 Spaces für Einrückungen
- Folgen Sie den Lit-Element-Best-Practices
- Kommentieren Sie komplexe Logik
- Halten Sie Funktionen klein und fokussiert

### Testing

Testen Sie Ihre Änderungen mit:

- ✅ `input_datetime.*` Entities
- ✅ `time.*` Entities
- ✅ Verschiedene `minute_step` Werte (1, 5, 10, 15, 30)
- ✅ Dunkles und helles Theme
- ✅ Mobile und Desktop Browser
- ✅ Visueller Editor

## Commit-Nachrichten

Verwenden Sie aussagekräftige Commit-Nachrichten:

- `Add: Neues Feature`
- `Fix: Bug-Beschreibung`
- `Update: Bestehende Funktionalität verbessert`
- `Docs: Dokumentation aktualisiert`
- `Stil: Code-Formatierung`
- `Refactor: Code umstrukturiert`

## Lizenz

Indem Sie zu diesem Projekt beitragen, stimmen Sie zu, dass Ihre Beiträge unter der MIT License lizenziert werden.

## Fragen?

Falls Sie Fragen haben, erstellen Sie einfach ein Issue oder kontaktieren Sie die Maintainer!

Vielen Dank! 🙏
