const express = require('express')
const morgan = require('morgan')
const MOVIES = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))

app.get('/movies', (req, res) => {
    res.json(MOVIES)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`)
})