const mongoose = require("mongoose");

if(!([5,3].includes(process.argv.length))) {
    console.log('give a password to get all db entries. Otherwise Provide a password, name, and number to add a new person to the db')
}

const password = process.argv[2]

const url =
    `mongodb+srv://jacksporter24:${password}@fullstack.yhxkbxb.mongodb.net/phonebookApp?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 5){
    person = new Person({
        name: process.argv[3],
        number: process.argv[4],
    })

    person.save().then(result =>{
        console.log(`added ${person.name} number ${person.number} to phonebook`)
        console.log(result)
        mongoose.connection.close()
    })
} else {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
            console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
    })
}
