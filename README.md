# Dokumentacja API

## Ogólne Informacje

- **URL**: `http://localhost:3000`
- **Wymagane Nagłówki**: 
  - `Content-Type: application/json` dla żądań POST
  - `Authorization: Bearer <token>` dla żądań wymagających uwierzytelnienia

## Endpointy

### Autentykacja

#### Logowanie
- **URL**: `/login`
- **Metoda**: POST
- **Parametry body**: 
  - `username`: String
  - `password`: String
- **Odpowiedź**: Token JWT w przypadku sukcesu

#### Rejestracja
- **URL**: `/register`
- **Metoda**: POST
- **Parametry body**: 
  - `firstName`: String
  - `lastName`: String
  - `username`: String
  - `password`: String
  - `email`: String
  - `phone`: String
  - `isAdmin`: String ('1' dla admina, '0' dla zwykłego użytkownika)
- **Odpowiedź**: ID użytkownika w przypadku sukcesu

#### Wylogowanie
- **URL**: `/logout`
- **Metoda**: GET

### Produkty

#### Pobranie Wszystkich Produktów
- **URL**: `/products`
- **Metoda**: GET
- **Wymagane**: Token JWT

#### Dodanie Produktu
- **URL**: `/add-product`
- **Metoda**: POST
- **Parametry body**: 
  - `name`: String
  - `description`: String
  - `price`: Number
- **Wymagane**: Token JWT i uprawnienia admina

#### Edycja Produktu
- **URL**: `/edit-product/:id`
- **Metoda**: POST
- **Parametry URL**: 
  - `id`: ID produktu
- **Parametry body**: 
  - `name`: String
  - `description`: String
  - `price`: Number
- **Wymagane**: Token JWT i uprawnienia admina

#### Usunięcie Produktu
- **URL**: `/delete-product/:id`
- **Metoda**: GET
- **Parametry URL**: 
  - `id`: ID produktu
- **Wymagane**: Token JWT i uprawnienia admina

### Użytkownicy

#### Pobranie Wszystkich Użytkowników
- **URL**: `/dashboard`
- **Metoda**: GET
- **Wymagane**: Token JWT i uprawnienia admina

#### Dodanie Użytkownika
- **URL**: `/add-user`
- **Metoda**: POST
- **Parametry body**: 
  - `firstName`: String
  - `lastName`: String
  - `username`: String
  - `password`: String
  - `email`: String
  - `phone`: String
  - `isAdmin`: String ('1' dla admina, '0' dla zwykłego użytkownika)
- **Wymagane**: Token JWT i uprawnienia admina

#### Edycja Użytkownika
- **URL**: `/edit-user/:id`
- **Metoda**: POST
- **Parametry URL**: 
  - `id`: ID użytkownika
- **Parametry body**: 
  - `firstName`: String (opcjonalnie)
  - `lastName`: String (opcjonalnie)
  - `username`: String (opcjonalnie)
  - `password`: String (opcjonalnie)
  - `email`: String (opcjonalnie)
  - `phone`: String (opcjonalnie)
  - `isAdmin`: String ('1' dla admina, '0' dla zwykłego użytkownika) (opcjonalnie)
- **Wymagane**: Token JWT i uprawnienia admina

#### Usunięcie Użytkownika
- **URL**: `/delete-user/:id`
- **Metoda**: GET
- **Parametry URL**: 
  - `id`: ID użytkownika
- **Wymagane**: Token JWT i uprawnienia admina

## Wylogowanie

- **URL**: `/logout`
- **Metoda**: GET
- **Wymagane**: Token JWT

## Błędy i Logowanie

- Wszelkie błędy są rejestrowane w logach aplikacji.
- Logi posiadają rotację codzienną i są przechowywane przez 14 dni.
