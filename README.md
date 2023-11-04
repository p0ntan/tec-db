# Teknisk studie för att jämföra snabbheten vid frågor till databas via ett api

Försök till en teknisk studie som jämför mongodb och mariadb med att skapa och uppdatera mycket data där datan är baserat på inputs från en användare/testare.

Data sätts in med en .sql fill vid uppstart till databasen.

Starta alla containrar med (kan ta lite tid med nedladdningar som behövs)
```
docker-compose up -d --build
```

Kommandot hämtar två containrar (mariadb och p0ntan/local-oha:1.0) remote samt bygger en express-server lokalt. Kör man kommandot en gång till kan man skippa --build flaggan.

Kör sedan oha med
```
docker-compose run oha
```

## Routes

```
/                       root, hämtar ingen data
/mariadb/users          hämtar alla användare
/mariadb/users/12       hämtar användare baserat på id
```

## Kommandon

I containern kan man testa kommandot:
```
oha -c 10000 http://express-server:1337
```

Url till server utanför nätverket
```
http://localhost:1337/
```
