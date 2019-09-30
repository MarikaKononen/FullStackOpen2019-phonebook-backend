require('dotenv').config()
const express    = require('express')
const app        = express()
const bodyParser = require('body-parser')
const morgan     = require('morgan')
const cors       = require('cors')
const Person = require('./models/person')

// app config
app.use(express.static('build'))
app.use(bodyParser.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
app.use(cors())

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
app.get('/api/persons/:id', (req, res, next) => {
   Person.findById(req.params.id)
   .then(person =>{
       if(person){
        res.json(person.toJSON())
       } else {
           res.status(404).end()
       }
   })
   .catch(error => next(error))
}) 

// ROUTE for SHOW info
app.get('/info', (req, res) => {
    
    Person.countDocuments()
    .then(count => {
        let numberOfPersons = count
        let today = new Date()
        let firstLine1 = 'Phonbook has info for '
        let firstLine2 = ' people'
        let firstLine = firstLine1 + numberOfPersons + firstLine2
        console.log(count)
        res.send(`<p>${firstLine}</p><p>${today}</p>`)
    })
    .catch(error => next(error))
    
})

// CREATE ROUTE
app.post('/api/persons', (req, res, next) => {
    const body = req.body
    console.log('body', body)

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person
    .save()
    .then(savedPerson => savedPerson.toJSON())
    .then(savedAndFormattedPerson => {
     res.json(savedAndFormattedPerson)
    })
    .catch(error => next(error))
})

// UPDATE ROUTE
app.put('/api/persons/:id', (req, res, next) =>{
    const body = req.body
    
    if ( body.number === ""){
        return res.status(400).json({error: 'number missing'})
    }
    
    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
     .then(updatedPerson => updatedPerson.toJSON())
     .then(updatedAndFormattedPerson => {
         res.json(updatedAndFormattedPerson)
     })
     .catch(error => next(error))
})

// DELETE ROUTE
app.delete('/api/persons/:id', (req, res, next) => {
    Person.findByIdAndRemove(req.params.id)
        .then(result => {
            res.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (req, res) => {
    console.log('unknownEndpoint')
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

// error handling
const errorHandler = (error, req, res, next) => {
    console.error(error.message)

    if (error.name === 'CastError' && error.kind == 'ObjectId'){
        return res.status(400).send({error: 'malformatted id'})

    } else if(error.name === 'ValidationError'){
        return res.status(400).json({ error: error.message })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})