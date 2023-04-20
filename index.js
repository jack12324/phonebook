require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Person = require('./models/person')

app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('body', request => {
    if(request.method === 'POST') {
        return (
            JSON.stringify(request.body)
        )
    } else{
        return null
    }
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
    const datetime = new Date()

    Person.count({})
        .then( count =>{
            const message =
                `<section>
                    <p>Phonebook has info for ${count} people</p>
                    <time>${datetime}</time>
                </section>`
            response.send(message)
        })
        .catch(error => next(error))
})
app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(persons => {
            if(persons) {
                response.json(persons)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if(person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, {new: true})
        .then( updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body

    if(!body.name){
        return response.status(400).json({
            error: 'Name is missing'
        })
    }

   if(!body.number) {
        return response.status(400).json({
            error: 'Number is missing'
        })
    }

    // if (persons.some(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: `${body.name} already exists in phonebook`
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            response.json(savedPerson)
        })
        .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then(() => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const error_handler = (error, request, response, next) =>{
    console.error(error.message)

    if(error.name === 'CastError'){
        return response.status(400).send({error: 'malformed id'})
    }

    next(error)
}

app.use(error_handler)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})
