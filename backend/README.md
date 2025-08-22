# Backend-Teil / Backend Part – CRM

**API:** REST  
**ORM:** Prisma  
**Technologien / Tech Stack:** Node.js, Express  

## Prisma Client  
Im Ordner `generated/prisma-client` befinden sich die generierten Dateien für den **Prisma Client**.  
Diese werden benötigt, um die **Datentypen (Types)** für die **Entities** aus der Datenbank zu erhalten.  

## Daten generieren / Generate Data Types  
Um neue Typdefinitionen zu erstellen oder bestehende zu aktualisieren, bitte im **DB**-Projekt folgenden Befehl ausführen:  

```bash
npm run generate
```

💡 Hinweis / Note:
Der prisma-client wird automatisch aus dem Datenbankschema erstellt. Änderungen am Schema erfordern das erneute Ausführen des obigen Befehls.

Create admin:
npx ts-node src/scripts/createAdmin.ts
