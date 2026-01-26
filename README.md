# Kieszonkowe potwory/ポケットモンスター

Projekt full‑stack aplikacji webowej inspirowanej światem Pokémonów. Aplikacja umożliwia
użytkownikom zakładanie kont, przeglądanie Pokédexu, zarządzanie ulubionymi Pokémonami,
interakcje społeczne oraz eksplorację świata w przyjaznym, pixel‑artowym interfejsie.

*Funkcjonalności*

-Rejestracja i logowanie użytkowników (JWT + refresh token)  
-Profil użytkownika  
-Pokédex (dane z zewnętrznego API Pokémon)  
-System ulubionych Pokémonów  
-Lista znajomych i interakcje  
-Widok mapy / eksploracji  
-Onboarding (kilka ekranów startowych)  
-Widok sklepu  
-Responsywny interfejs (mobile‑first)  

*Wykorzystne technologie*

Frontend (client)
-Vue 3 (Composition API)  
-Vite  
-Vue Router  
-HTML5 / CSS3 (custom UI, pixel‑art style)  

Backend (server)
-Node.js  
-Express.js  
-MongoDB (Mongoose)  
-JWT (access + refresh tokens)  

Zewnętrzne API
-Pokémon API – https://pokeapi.co/docs/v2#moves-section

*Projekt bazy danych:* https://dbdiagram.io/d/68f627632e68d21b415176ce?fbclid=IwY2xjawNjBuVleHRuA2FlbQIxMQABHrAut_gU6xpqYggILeNRRFaoqbePra3KrnKC2bdvHwGrAL3ITYS-mJMWz2l0_aem_MICC1eths_5zeJvUlps6VQ

*Struktura projektu*  
![alt text](image.png)

*Konfiguracja środowiska*  
Przykładowa konfiguracja plików .env:

client:
```
VITE_API_URL="http://localhost:(port_server)"
VITE_PORT=(port_client)
```

server:
```
PORT = (port_server)
NODE_ENV = "development"

CLIENT_URL = "http://localhost:(port_client)"
MONGODB_CONNECTION_STRING = "mongodb://localhost:27017/NazwaBazyDanych"

BCRYPT_SALT_ROUNDS = 12

JWT_SECRET = "TOP-SECRET"
JWT_EXPIRES = "30m"
JWT_EXPIRES_REMEMBER = "30m"

JWT_REFRESH_SECRET = "TOP-SECRET_TOP-SECRET"
REFRESH_EXPIRES = "12h"
REFRESH_EXPIRES_REMEMBER = "14d"
```

*Uruchomienie projektu*  
w roocie projektu  
```

npm run dev 
```


*Przykładowe widoki*  

<img width="2554" height="1208" alt="obraz" src="https://github.com/user-attachments/assets/4416353e-f46e-4c05-b50e-6adb7e0a6309" />  
Menu główne  

<img width="2559" height="1358" alt="obraz" src="https://github.com/user-attachments/assets/5a0cfe11-fd5d-4637-9c32-9c70465273bd" />  
Mapa  

<img width="2559" height="1357" alt="obraz" src="https://github.com/user-attachments/assets/336c4c1c-08f3-4386-aa6a-a08ead3969e0" />  
Profil użytkownika 

<img width="2559" height="1359" alt="obraz" src="https://github.com/user-attachments/assets/e84b51ec-2ec2-47d9-872c-ebe2acb1c1b7" />  
Handel Pokemonów  

<img width="2559" height="1354" alt="obraz" src="https://github.com/user-attachments/assets/68a84e0b-872a-4a0d-98b9-dad83c848065" />  
Ulubione  

<img width="2559" height="1357" alt="obraz" src="https://github.com/user-attachments/assets/9b39e8c3-cd3c-4173-9a8b-eed24f5f4b31" />  
Posiadane pokemony  








  


