const mongoose = require('mongoose')

if( process.argv.length < 3){
    consonle.log('give password as argument')
    process.exit(1)
}
const argvLength = process.argv.length
const password  = process.argv[2]
const newName   = process.argv[3]
const newNumber = process.argv[4]

const url = `mongodb+srv://pasi:${password}@cluster0-5a5zn.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const personSchema = new mongoose.Schema({
    name: String, 
    number: String
})

const Person = mongoose.model('Person', personSchema)

if( argvLength > 4){
    const person = new Person({
        name: `${newName}`,
        number: `${newNumber}`
    })
    
    person.save().then(response => {
        console.log(`added ${newName} ${newNumber} to the phonebook`)
        mongoose.connection.close()
    })

}

if( argvLength < 4){
    console.log('Phonebook:')
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
      })
}

