# Mieste Vykstantis Renginiai

Node.js pagrindu sukurta programa, skirta renginių valdymui, vartotojų registracijai ir prisijungimo funkcionalumams.

## Funkcijos
- Vartotojų registracija
- Vartotojų prisijungimas
- Saugus slaptažodžių šifravimas naudojant `bcryptjs`
- Sesijų valdymas
- Atsakanti naudotojo sąsaja su Bootstrap
- RESTful API taškai

---

## Reikalavimai
Prieš paleidžiant projektą, įsitikinkite, kad turite įdiegtas šias programas:
1. **Node.js** (v14 arba aukštesnė versija) - [Atsisiųsti Node.js](https://nodejs.org/)
2. **MySQL** - [Atsisiųsti MySQL](https://dev.mysql.com/downloads/)
3. **Git** (pasirinktinai) - [Atsisiųsti Git](https://git-scm.com/)

---

## Diegimo Gidas

### 1 veiksmas: Nukopijuokite Repository
Jei projektas yra patalpintas repository, naudokite:
```bash
git clone <repository-url>
cd Mieste-vykstantis-renginiai
```
Kitu atveju, įsitikinkite, kad turite paruoštą projekto aplanką vietoje.

---

### 2 veiksmas: Įdiekite Priklausomybės
Pereikite į projekto katalogą ir įdiekite reikalingus Node.js paketus:
```bash
npm install
```

---

### 3 veiksmas: Suformuokite MySQL Duomenų Bazę
1. Atidarykite savo MySQL serverį.
2. Sukurkite duomenų bazę:
   ```sql
   CREATE DATABASE uzduotis;
   ```
3. Naudokite šį skriptą, kad sukurti reikalingas lenteles:
   ```sql
   USE uzduotis;

   CREATE TABLE users (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       email VARCHAR(255) NOT NULL UNIQUE,
       password VARCHAR(255) NOT NULL
   );

   CREATE TABLE events (
       id INT AUTO_INCREMENT PRIMARY KEY,
       name VARCHAR(255) NOT NULL,
       description TEXT,
       location VARCHAR(255),
       event_date DATETIME NOT NULL,
       user_id INT,
       FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
   );
   ```

4. Atnaujinkite MySQL prisijungimo duomenis `server.js` faile:
   ```javascript
   const db = mysql.createConnection({
       host: 'localhost',
       user: 'root',  // Jūsų MySQL vartotojo vardas
       password: '',  // Jūsų MySQL slaptažodis
       database: 'uzduotis'
   });
   ```

---

### 4 veiksmas: Paleiskite Serverį
Paleiskite šį komandą, kad pradėtumėte serverį:
```bash
node server.js
```

---

### 5 veiksmas: Atidarykite Programą
1. Atidarykite naršyklę ir pereikite į:
   - Registracija: `http://localhost:3000/register`
   - Prisijungimas: `http://localhost:3000/login`
   - Vartotojo skydelis: Pasiekiama po prisijungimo per `http://localhost:3000/api/dashboard`.

---

## API Taškai
| Endpoint         | Metodas | Aprašymas                   | Užklausos kūnas                              |
|------------------|---------|-----------------------------|---------------------------------------------|
| `/api/register`  | POST    | Registruoti naują vartotoją  | `{ "name": "Vardas", "email": "El. paštas", "password": "Slaptažodis" }` |
| `/api/login`     | POST    | Prisijungti su esamu vartotoju| `{ "email": "El. paštas", "password": "Slaptažodis" }` |
| `/api/dashboard` | GET     | Pasiekti vartotojo skydelį   | Reikia sesijos slapuko                      |
| `/api/logout`    | POST    | Atsijungti nuo dabartinio vartotojo | Nėra užklausos kūno                        |

---

## Sukurta naudojant
- **Node.js**
- **Express.js**
- **MySQL**
- **Bootstrap** (atsakanti naudotojo sąsaja)
- **bcryptjs** (slaptažodžių šifravimas)
- **express-session** (sesijų valdymas)

---

## Dažniausiai Pasitaikantys Klausimai
- **Duomenų bazės prisijungimo klaida**:
  - Patikrinkite, ar MySQL serveris veikia ir ar `server.js` faile nurodyti prisijungimo duomenys teisingi.
- **Portas jau naudojamas**:
  - Pakeiskite `PORT` kintamąjį `server.js` faile arba sustabdykite kitą paslaugą, naudojančią tą patį portą.
- **Trūksta priklausomybių**:
  - Paleiskite `npm install`, kad įdiegtumėte trūkstamus paketus.
