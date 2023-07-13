require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const Person = require('./models/person')
const app = express()

app.use(express.json())

app.use(express.static('build'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan('tiny', {
  skip: function (req, res) { return req.method === "POST" }
}))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  skip: function (req, res) { return req.method !== "POST" }
}))

app.use(cors())


let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    Person.find({}).then (persons => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`)
    })
})
  
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
      response.json(persons)
    })
})
app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
      if(person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(person => {
      response.status(204).end()
    })
    .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {
    let body = request.body
    if (body.name && body.number ){
        const newPerson = new Person({
            name: body.name,
            number: body.number
          })
          newPerson.save().then(savedPerson => {
            response.json(savedPerson)
          })
          .catch(error => next(error))
        
    }
    else {
        return response.status(400).json({ 
            error: 'request must contain name and number' 
          })
    }
  })

  app.put('/api/persons/:id', (request, response, next) => {
    let body = request.body
    const person ={
      name: body.name,
      number: body.number
    }
    Person.findByIdAndUpdate(request.params.id, person, { new: true})
      .then(updatedPerson => {
        response.json(updatedPerson)
      })
      .catch(error => next(error))
  })


  const errorHandler = (error, request, response, next) => {
    console.log(error.name)
    console.error(error.message)
    
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
  
    next(error)
  }
  
  app.use(errorHandler)



  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })