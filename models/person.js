const mongoose = require("mongoose");

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

console.log('connecting to mongodb at', url)

mongoose.connect(url).then(() => {
    console.log('Connected to Monogodb')
}).catch(error => {
    console.log('Failed to connect to MongoDB', error.message)
})

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) =>{
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)

// if(process.argv.length === 5){
//     person = new Person({
//         name: process.argv[3],
//         number: process.argv[4],
//     })

//     person.save().then(result =>{
//         console.log(`added ${person.name} number ${person.number} to phonebook`)
//         console.log(result)
//         mongoose.connection.close()
//     })
// } else {
//     Person.find({}).then(result => {
//         console.log('phonebook:')
//         result.forEach(person => {
//             console.log(`${person.name} ${person.number}`)
//         })
//         mongoose.connection.close()
//     })
//}
