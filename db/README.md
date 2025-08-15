# ORM Prisma Datenbankschema für CRM

## Einrichtung

**Initialisierung**  
   Führe den folgenden Befehl aus, um Prisma zu initialisieren:  
   ```bash
   npx prisma init
   ```

**Datenbank erstellen & Migrationen durchführen**
Führe die Migrationen aus, um die Datenbankstruktur zu erstellen:    
```bash 
npm run migrate
```

**Client generieren**
Generiere den Prisma-Client und kopiere die Daten in die Backend- und Frontend-Projekte:
```bash
npm run generate
```

💡 Hinweis / Note:
Nach npm run generate werden die generierten Daten automatisch in die Projekte backend und frontend kopiert.

Stelle sicher, dass die Datenbankverbindung in der prisma/schema.prisma korrekt konfiguriert ist.