# 📱 ZeFit Mobile App

Mobilna aplikacija za članove ZeFit teretane.
Povezana je direktno na Supabase backend koji koristi i ZeFit Admin Panel.

Aplikacija omogućava članovima:

- registraciju i login (Supabase Auth)

- pregled članarine i paketa

- pregled dolazaka i uplata

- primanje objava od strane admina

- uređivanje vlastitog profila

- prikaz unikatnog barkoda koji se skenira pri ulasku u teretanu

> Frontend: Expo + React Native + TypeScript
> Backend: Supabase (Auth, Database, Storage, RLS)

# ✨ Features
## 🔐 Auth – Registracija & Login

- registracija novih članova

- login preko email + password

- session čuvanje i automatsko osvježavanje sesije

- integracija sa Supabase RLS – svaki korisnik vidi samo svoje podatke

## 🏋️‍♂️ Moj profil

- Korisnik može vidjeti i uređivati:

- ime i prezime

- email

- broj telefona

- avatar (upload u Storage)

- clan_kod (npr. ZE-123456)

- datum učlanjenja

- status članarine (active / pending / expired)

## 🧾 Članarine i paketi

Aplikacija prikazuje sve podatke iz clanarine_clanova:

- aktivni paket

- prošli paketi

- cijena

- period važenja

- status paketa

- automatski preračun statusa (expired / active / pending)

Korisnik može vidjeti:

- kada članarina ističe

- koji paket trenutno koristi

- historiju svih prethodnih paketa

## 💳 Uplate

Podaci iz tabele placanja:

- datum uplate

- iznos

- način plaćanja (keš, kartica — kasnije)

- na koji paket je uplata vezana

- Sve prikazano u čistom i preglednom UI-u.

## 📅 Dolasci

Lista svih dolazaka iz tabele dolasci:

- vrijeme ulaska

- vrijeme izlaska

- opcioni izračun trajanja boravka u teretani

Uz to:

- grafikon dolazaka za posljednjih 7 / 30 dana

- broj ukupnih posjeta

## 📰 Objave / Novosti

Mobilna app prima sve objave kreirane u ZeFit Admin Panelu:

- naslov

- sadržaj

- slika (ako postoji)

- datum objave

- Korisnik sve vidi u listi, kao mali feed.

## 🪪 Digitalna članska kartica (Barcode)

Na dnu korisničkog profila nalazi se digitalna kartica:

- generisani barkod ili QR kod

- jedinstveni za svakog člana (clan_kod)

- koristi se za ulaz u teretanu

- recepcija skenira kod i prati dolaske u realnom vremenu

## 🧱 Tehnologije

> Expo (React Native)

> React Native Navigation

> TypeScript

> Supabase

> Auth (login, registration)

- Database (članovi, paketi, uplate, dolasci)

- Storage (profilne slike)

- Row Level Security (RLS)

- Recharts / Victory za graf dolazaka

- Zustand / Context API za globalni state

## 🗄️ Struktura baze koju mobilna app koristi

Mobilna aplikacija komunicira sa tabelama:

- clanovi

- clanarine_clanova

- tipovi_clanarina

- placanja

- dolasci

- posts

### Sve je filtrirano preko RLS tako da član vidi samo svoje podatke.

## ⚙️ Pokretanje projekta
### 1. Kloniranje
git clone https://github.com/<tvoj-username>/<mobile-repo>.git
cd <mobile-repo>

### 2. Instalacija
npm install

### 3. Env varijable

Kreiraj .env ili koristi app.config.js:

EXPO_PUBLIC_SUPABASE_URL=...
EXPO_PUBLIC_SUPABASE_ANON_KEY=...

### 4. Start development server
npx expo start


Skeniraj QR kod u Expo Go aplikaciji.

## 📦 Build (Production)

Korištenjem Expo EAS servisa:

Android:
eas build -p android

iOS:
eas build -p ios

## 🔐 Sigurnost

svi podaci ograničeni preko RLS pravila

mobilna app ima samo "user" permissions

admin panel ima admin role i koristi odvojene rute

barkod se generiše i prikazuje ali nije moguće mijenjati ga ručno

## 🧭 Roadmap ideje (moguće dodatno napraviti)

push notifikacije (isticanje članarine, promocije)

dark/light tema

rezervacija treninga

online plaćanje

leaderboard najaktivnijih članova

### 👨‍💻 Autor

Mobilna aplikacija ZeFit razvijena je od strane studenta softverskog inženjerstva, uz saradnju sa ZeFit teretanom.
Kod je pisan profesionalno, modularno i spreman za produkciju.
