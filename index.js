const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

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
    response.send(`<p>Phonebook has infor for ${phonebook.length} people</p><p>${Date()}</p>`)
})
  
app.get('/api/persons', (request, response) => {
    response.json(phonebook)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const data = phonebook.find(person => person.id === id)
    if(data) {
        response.json(data)
    }
    else {
        response.status(404).end()
    }
  })
  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    response.status(204).end()
  })

  app.post('/api/persons', (request, response) => {
    let body = request.body
    if (body.name && body.number ){
        if(phonebook.find(person => person.name === body.name)) {
            return response.status(400).json({ 
                error: 'name must be unique' 
              })
        }
        else{
            newId = Math.floor(Math.random() * 9999999999)
            phonebook.push({"id":newId, "name":body.name, "number":body.number})
            body.id = newId
        }
    }
    else {
        return response.status(400).json({ 
            error: 'request must contain name and number' 
          })
    }
    response.json(body)
  })

  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })