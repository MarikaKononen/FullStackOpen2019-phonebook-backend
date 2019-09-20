require('dotenv').config()
const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const morgan     = require('morgan')
const cors       = require('cors')
const Person = require('./models/person')

// app config
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())
app.use(express.static('build'))



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

const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
}

morgan.token('person', function (req, res) { 
    return JSON.stringify(req.body) 
})

// ROUTE for SHOW all persons
app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
})

//ROUTE for SHOW one person
app.get('/api/persons/:id', (req, res) => {
   Person.findById(req.params.id).then(person =>{
       res.json(person.toJSON())
   })
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

// CREATE ROUTE
app.post('/api/persons', (req, res) => {
    const body = req.body
    console.log('body', body)
    
    if (body.name === undefined){
        return res.status(400).json({error: 'name missing'})
    }
    
    if (persons.find(p => p.name === body.name)){
        return res.status(400).json({error: 'name must be unique'})
    }
    
    if ( body.number === undefined){
        return res.status(400).json({error: 'number missing'})
    }

    const person = new Person({
        name: body.name,
        number: body.number || false
    })

    person.save().then(savedPerson =>{
        res.json(savedPerson.toJSON())
    })

})

// DELETE ROUTE
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    person = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const unknownEndpoint = (req, res) => {
    console.log('unknownEndpoint')
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})