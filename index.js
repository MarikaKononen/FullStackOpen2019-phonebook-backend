const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')


let persons = [
      {
        "name": "Arto Hellas",
        "number": "040-123456",
        "id": 1
      },
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-43-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      }
]  
// ROUTE for SHOW all persons
app.get('/api/persons', (req, res) => {
    res.json(persons)
})

//ROUTE for SHOW one person
app.get('/persons/:id', (req, res) =>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person){
        res.json(person)
    } else {
        res.status(404).end()
    }
}) 

// ROUTE for SHOW info
app.get('/info', (req, res) => {
    let numberOfPersons = persons.length;
    let today = new Date()
    let firstLine1 = 'Phonbook has info for '
    let firstLine2 = ' people'
    let firstLine = firstLine1 + numberOfPersons + firstLine2

    res.send(`<p>${firstLine}</p><p>${today}</p>`)
})

// DELETE ROUTE
app.delete('/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    person = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})