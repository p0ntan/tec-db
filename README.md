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
Alla routes är GET-routes för att enklare kunna använda sig utav [oha](https://github.com/hatoo/oha) för att skicka många requests. Man kan välja att använda mongodb eller mariadb i URL:en. Med parameten ?nores=1 skickas datan inte till klienten, för att man ska kunna jämföra vad som kan ta tid och hitta delar man kan försöka göra effektiva.

```
<db> = mariadb eller mongodb

/                   root, hämtar ingen data

Read (cRud)
/<db>/users         hämtar alla användare
    query:
        nores=1     hämtar data men skickar inte vidare till klienten

/<db>/usersview     hämtar alla användare via en vy
    query:
        nores:1     hämtar data men skickar inte vidare till klienten

/<db>/singleuser    hämtar användare baserat på id

Update (crUd)
/<db>/update/users  uppdaterar lösenord hos slumpmässig användare

Create and read long texts

Create
/mariadb/create/varchar
/mariadb/create/text
/mariadb/create/mediumtext

    Alla routes kan användas med query length=<length> (medium/long)
        varchar/text/mediumtext:
            utan query = "test med kort sträng" (20 tecken) 
        varchar/text/mediumtext
            medium = 10163 tecken
        text
            long = 20325 tecken
        mediumtext
            long = 99999 tecken

Read
/mariadb/varchar/:id
/mariadb/text/:id
/mariadb/mediumtext/:id

``` 

## Oha

[Oha](https://github.com/hatoo/oha) används för att testa frågor till servern.

### I container
Starta upp containern med oha:
```
docker-compose run oha
```

I containern kan man testa kommandot.

```
oha -c 10000 http://express-server:1337/

ex.
oha -c 10000 http://express-server:1337/mariadb/users
oha -c 10000 http://express-server:1337/mongodb/users
```

I containern finns även ett testskript man kan köra för enklare testning
```
./testscript.bash -h

Ex.
./testscript.bash read
./testscript.bash read --mongo

./testscript.bash update
./testscript.bash update --mongo
```

### Oha lokalt

Att ladda ner oha lokalt ger bättre svarstider då man har en färre container igång.

Url till server utanför nätverket
```
http://localhost:1337/
```
