# Jämför snabbheten mellan olika operationer i mariadb eller mongodb
Ett verktyg att testa olika datatyper och dess hastighet i olika databaser.

Syftet med detta repo är att själv kunna testa olika databasfrågor för att avgöra vilken databas som kan passa bäst och kunna hitta eventuella flaskhalsar som kan göra en applikation långsammare. Repot kan köras lokalt med ett kommando, där man själv kan lägga till egna sql-frågor eller annat i databasen.

Vid uppstart av repot läses det in 1000 kunder i vardera databas, MariaDB och MongoDB, med liknande kunddata. I MariaDB finns flera tabeller som kan joinas, och i MongoDB är det endast en collection som istället har nästlad data som kan sorteras ut.

Nedanför undersökningen och slutsats finns instruktioner om hur man själv kan sätta upp repot lokalt och köra i containers.

## Undersökning

De olika delarna förutom D testas i CRUD, då D inte kommer vara en del som kommer ha så stor inverkan på applikationen då den troligen sällan kommer användas.

För READ används routen /&lt;db&gt;/usersview som i MariaDB är en vy som i sin tur joinar 3 olika tabeller (user, card och admin) och i MongoDB filtreras istället datan så att man får likvärdiga svar.

För UPDATE används routen /&lt;db&gt;/update/users som uppdaterar hash hos en slupmässig användare. Värt att notera att det här kan ta något längre tid att slumpa fram ett id till MongoDB, något som skulle kunna påverka slutresultatet. 

För CREATE används routen /&lt;db&gt;/create/users som skapar en användare, där samma användarnamn och hash används vid varje ny användare (username är alltså inte unikt i testet, endast id).

För varje request som görs skapas en databasuppkoppling, vilket det kan påverka resultatet om en databas har en långsammare uppkopplingstid.

Vilken prestanda en dator har kommer påverka resultatet, man ska här nog se req/s i förhållande till samma request till den andra databasen.

## Tester

Testerna har gjorts lokalt genom att köra kommandot:
```
oha -c 10000 <url>
```
Kommandot har körts 10 gånger pr test och sedan tas ett genomsnittsvärde.

/ root (refvärde, inga frågor till databasen)
~ 1500 req/s

### MariaDb
/usersview – testas när det är 1000 rader i databasen
~ 200 req/s

/update/users – testas när det är 1000 rader i databasen
~1200 req/s

/create/users
~1100 req/s

### MongoDB
/usersview – testas när det är 1000 kunder i databasen
~ 80 req/s

/update/users – testas när det är 1000 kunder i databasen
~ 300 req/s

/create/users
~ 330 req/s

## Slutsats
MariaDB är avsevärt mycket snabbare än MongoDB i detta testet, speciellt i avsende av att uppdatera och skapa användare. En möjlig orsak kan mycket väl vara att man gör en ny uppkoppling till varje request, vilket skulle kunna öka hastigheten för MongoDB, men ett sådant test har inte gjorts. MongoDB kan eventuellt ha mer funktionalitet som kan väga upp för snabbheten, beroende på vad man ser för sig en applikation ska göra.

Är hastighet det som avgör ser jag för mig att man väljer MariaDB över MongoDB.

## Testa själv

Data sätts in med en .sql fil vid uppstart till mariadb, och likvärdig data läses in till mongodb med ett json-objekt.

Starta alla containrar med (kan ta lite tid med nedladdningar som behövs).
```
docker-compose up -d --build
```

Kommandot hämtar tre containrar (mariadb, mongo och p0ntan/local-oha:1.0) remote samt bygger en express-server lokalt.

Det vill spara en local volym i docker för detta, detta gör att man kan jobba i containern och installera paket som sedan sparas i den lokala volymen. För att ta bort volymen när man stänger nätverket kör kommandot:
```
docker-compose down -v
```

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

Create (Crud)
/<db>/create/users  lägger till ny användare

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
