# Pobranie wszystkich kontaktów

GET http://localhost:3000/api/contacts

###

# Pobranie kontaktu po ID

GET http://localhost:3000/api/contacts/:id

###

# Dodanie nowego kontaktu

POST http://localhost:3000/api/contacts
Content-Type: application/json

{
"name": "John Doe",
"email": "johndoe@example.com",
"phone": "(123) 456-7890"
}

###

# Aktualizacja istniejącego kontaktu

PUT http://localhost:3000/api/contacts/:id
Content-Type: application/json

{
"name": "Jane Doe",
"email": "janedoe@example.com",
"phone": "(987) 654-3210"
}

###

# Usunięcie kontaktu

DELETE http://localhost:3000/api/contacts/:id

###

# Aktualizacja statusu "favorite" kontaktu

PATCH http://localhost:3000/api/contacts/:id/favorite
Content-Type: application/json

{
"favorite": true
}
