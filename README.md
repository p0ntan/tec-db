# Teknisk studie för att jämföra snabbheten vid frågor till databas via ett api

Försök till en teknisk studie som jämför mongodb och mariadb med att skapa och uppdatera mycket data där datan är baserat på inputs från en användare/testare.

Enda det nu gör är starta två containrar med mariadb som databas, där data sätts in med en .sql fill vid uppstart. Sedan startar den en server där endast routen '/' är hämtar data från databasen.

Starta alla containrar med
```
docker-compose up -d --build
```

http://localhost:1337/
