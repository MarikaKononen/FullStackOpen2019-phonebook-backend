const mongoose   = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

// database config 
const url = process.env.DBURLPHONEBOOK
console.log('connecting to ', url)  

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 3,
        unique: true,
        uniqueCaseInsensitive: true,
        required: true
    }, 
    number: {
        type: String,
        minlength: 8,
        required: true
    }
})



personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
personSchema.plugin(uniqueValidator,{ message: 'Error, the name exists already in the database, it must be unique.' })


module.exports =  mongoose.model('Person', personSchema)