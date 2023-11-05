# Teknisk studie för att jämföra snabbheten vid frågor till databas via ett api

Försök till en teknisk studie som jämför mongodb och mariadb med att skapa och uppdatera mycket data där datan är baserat på inputs från en användare/testare.

Data sätts in med en .sql fil vid uppstart till databasen.

Starta alla containrar med (kan ta lite tid med nedladdningar som behövs).
```
docker-compose up -d --build
```

Kommandot hämtar tre containrar (mariadb, mongo och p0ntan/local-oha:1.0) remote samt bygger en express-server lokalt. Nästa gång man startar upp nätverket har man redan byggt alla containers som behövs och kan köra kommandot utan --build flaggan.

## Lokala ändringar

Servern och sql-datan läses in som volymer. När containrarna är igång kan man själv lägga till funktionalitet i app.js om man vill testa själv. I containrarna för mongodb och mariadb kan man använda cli för att gå direkt in i databasen.

### MariaDB
För att komma in i mariadb:
```
docker exec -it mariadb bash
mariadb
```

För att komma in i mongodb:
```
docker exec -it mongo bash
mongosh
```

## Routes
Alla routes är GET-routes för att enklare kunna använda sig utav [oha](https://github.com/hatoo/oha) för att skicka många requests. Routes utgår från att hämta data via mariadb, men vissa routes kan man med en param ?mongo=1 istället hämta data från mongodb. Med parameten ?nores=1 skickas datan inte till klienten, för att man ska kunna jämföra vad som kan ta tid och hitta delar man kan försöka göra effektiva.

```
/                   root, hämtar ingen data

Read (cRud)
/users              hämtar alla användare
    params:
        nores=1     hämtar data men skickar inte vidare till klienten
        mongo=1     hämtar data från mongodb
/usersview          hämtar alla användare via en vy
    params:
        nores:1     hämtar data men skickar inte vidare till klienten
/users/12           hämtar användare baserat på id

Update (crUd)
/update/users       uppdaterar lösenord hos slumpmässig användare

``` 

## Oha i container
[Oha](https://github.com/hatoo/oha) används för att testa frågor till servern.

Starta upp containern med oha:
```
docker-compose run oha
```

I containern kan man testa kommandot.

```
oha -c 10000 http://express-server:1337/

ex.
oha -c 10000 http://express-server:1337/users
```

Url till server utanför nätverket
```
http://localhost:1337/
```
