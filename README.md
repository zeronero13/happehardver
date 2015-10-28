#   Alkalmazások fejlesztése gyakorlat

### Első beadandó feladat

Csoport: AF 6. csoport

Neptun: DF2KIE

[GitHub link] (https://github.com/zeronero13/happehardver)

[Heroku link] (happehardver.herokuapp.com)
    
**Feladat:**

Ingyenesen hírdetési oldal, ahol felhasználó egy gyors, és ingyenes regisztráció után hírdetések adhat fel.

### Követelmények

#### Követelmények összegyűjtése: a nyújtandó szolgáltatások ismertetése rövid, szöveges leírásként, sokszor felsorolásként jelenik meg.
1. Funkcionális elvárások
    
  + Felhasználó képes legyen az oldal hírdetések között böngészni, és keresni.
  + Felhasználó képes legyen regisztrálni, és bejelentkezni az oldalra.
  + Bejelentkezés után lehetséges legyen új hírdetések felvételére.
  + Meglévő saját hírdetések között keresni
  + Meglévő saját hírdetéseket szerkeszteni, és törölni
        
2. Nem funkcionális követelmények

#### Használatieset-modell
+ Szerepkörök: lista rövid leírással
  1. Nem bejelentkezett felhasználó
  - Nem bejelentkezett, vagy nem regisztrált felhasználók. Képesek bejelentkezés nélkül az aktív hírdetések böngészni az oldalon.
  2. Bejelentkezett felhasználó
  - Regisztrált, bejelentkezett felhaszálók kik képesek saját hírdetéseiket listázni, keresni közöttük. Felvenni új hírdetéseket, szerkeszteni azokat, illetve törölni közülük.
  3. Operátorként bejelentkezett
  - Operátorok, avagy adminisztrátorok kik az oldalon található tartalom szerkesztésért, moderálásért, és egyéb mindennapos eseményekkel foglalkoznak.
 
### Tervezés

#### Architektúra terv
1. komponensdiagram
2. Oldaltérkép
  + /                 Index oldal
  + /list             Listázni, és keresni a hírdetéseket
  + /auth/login       Felhasználó beléptetése
  + /auth/signup      Felhasználó regisztráció
  + /auth/logout      Felhasználó kiléptetése
  + /user/list        Felhasználó tételeinek listázása, keresés
  + /user/upload      Felhasználó hírdetés feladása
  + /user/edit/:id    Felhasználó adott :id hírdetésének szerkesztése    
  + /user/delete/:id  Felhasználó adott :id hírdetésének törlése
  + /op/categories    Oldal operátornak oldal kategóriák listázása, modósítása (jelenleg csak felvétel)
3. Végpontok
  + /
  Get: Oldal megejelenítés
  + /list
  Get: Oldal megejelenítés
  + /auth/login
  Get: Oldal megejelenítés
  + /auth/signup
  Get: Oldal megejelenítés
  Post: Megprobálja belépteti a usert majd átirányít
  + /auth/logout
  Use: Kilépteti a felhasználó
  + /user/list
  et: Oldal megejelenítés
  + /user/upload
  Get: Oldal megejelenítés
  Post: Felhasználó által feltölteni kívánt tétel feldolgozása
  + /user/edit/:id
  Get: Oldal megejelenítés
  Post: Felhasználó tételének modósításának feldolgozása
  + /user/delete/:id
  Use: Felhasználó tételének törlése feldolgozása
  + /op/categories
  Get: Operátor oldal megejelenítés
  Post: Kategória felvételének feldolgozása

#### Felhasználóifelület-modell
1. Oldalvázlatok
  * Böngészés tételek között (docs/images/list_mockup.jpg)
![Böngészés tételek között](docs/images/list_mockup.jpg)

  * Felhasználó bejelentkezése (docs/images/login_mockup.jpg)
![Felhasználó bejelentkezése](docs/images/login_mockup.jpg)

  * Felhasználó hírdetls feltöltése (docs/images/upload_mockup.jpg)
![Felhasználó hírdetls feltöltése](docs/images/upload_mockup.jpg)

2. Designterv (végső megvalósítás kinézete)

    
#### Osztálymodell
1. Adatmodell, Adatbázisterv
  * Felhasználó hírdetés feltöltése (docs/images/models.png)
![Felhasználó hírdetés feltöltése](docs/images/models.png)
    
2. Állapotdiagram
  * Felhasználó bejelentkezése (docs/images/login_states.png)
![Felhasználó bejelentkezése](docs/images/login_states.png)
        
#### Dinamikus működés
1. Szekvenciadiagram    
  * Egy hírdetés feltöltése (docs/images/create_item_diagram.jpg)
![Egy hírdetés feltöltése](docs/images/create_item_diagram.jpg)

### Implementáció

####Fejlesztőeszközök

Fejlesztőeszközök: C9

Kódtár, verzió kontrol: Github

Fejlszetés technológiák: Javascript, Node.js

Deploy teszteléshez: Heroku

Node.js mellett használt modulok:
  * Flash
  * Waterline, Sails
  * Express, Express-Session, Express-Validator 
  * Passport, Passport-local, Bcryptjs
  * Body-Parser, Handlebars
  * Chai, Mocha

####Könyvtárstruktúrában lévő mappák funkciójának bemutatása
**./.tmp** 
Rejtett könyvtár Sails-Disk használatában, itt találhatóak tárolással kapcsolatos fájlok.
    
**./docs**
Dokumentumok, és hozzájuk tartozó egyéb anyagok könyvtára.
    
**./config**
Ide kerülnek a konfigurációhoz használatos fájlok.
    
**./models**
Modeleket, és közöttük fentlévő kapcsolatok leíró fájlok.
    
**./node_modules**
Ide kerülnek a szükséges "dependencies" modulok miket installál.
    
**./public**
Oldal számára egyéb erőforrások. CSS fájlok, fontok, js fájlok,...
    
**./test**
App teszteléséhez itt találhatóak a js fájlok.
    
**./views**
Az oldalon megjelenő templétek, partials találhatóak itt.
    
**./index.js**
Fő belépési pont az App-be.
    
**./package.json**
App-ről szükséges információkat tárolja. Pl. App neve, belépési pont melyik fájl, dependencies,....
    
### Tesztelés
A tesztek futtatása: **npm test**

#### Egység tesztelés (Mocha, Chai segítségével)
**Teszteljük a "user" model-en végezhető müveletek (user.test.js):**

* Felhasználó létrehozása
* Felhasználó törlése
* Egy felhasználó  megkeresése
* Felhasználó modósítása
* Felhasználó tárolt és által megadott jelszó összehasonlítása, helyességének vizsgálata
    

####Funkciónális teszt (Selenium IDE Firefox plugin)
**Funkciónális teszt:**
+ Teszt case: /test/Selenium/basic test case
  *Kezdőlap megjelenés
  *Böngészés lapra ugrás
  *Böngészés lapon keresés
  *Oldalra való regisztráció
  *Oldalra való belépés
  *Termék feltöltés
  *Saját termékek között keresés
  *Termék szerkesztése
  *Termék törlése

### Felhasználói dokumentáció
**Telepítés lépései: hogyan kerül a Githubról a célgépre a program**
  1. Egyik lehetőség kiadni alábbi parancsot, és klónozni github repot:
  git clone https://github.com/zeronero13/happehardver

  2. C9-ről push-olni a projektet adott helyre
  
  3. Letölteni becsomagolva githubról majd feltölteni
    
  **Szükséges "dependencies" telepítése**

  npm install 
    
  **Tesztek lefuttatása**

  npm test
  npm run watch-test
    
  **App elindítása**
  
  npm start
