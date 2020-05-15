require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const MOVIES = require('./moviedex.json')

const app = express()

app.use(morgan('dev'))
app.use(cors())
app.use(helmet())

const apiToken = process.env.API_TOKEN

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    if (!authToken || (authToken && authToken.split(' ')[1] !== apiToken)) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
    // move to the next middleware
    next()
  })

app.get('/movies', function handleGetMovies(req, res) {

    let response = MOVIES

    //.search will return 0 if it can find the pattern in the string provided
    //.search is a regex function created to help identify patters
    if (req.query.genre) {
        const lowerCaseGenreQuery = req.query.genre.toLowerCase();
        response = response.filter(movie => 
            movie.genre.toLowerCase().search(`${lowerCaseGenreQuery}`) === 0
        )
    }
    

    if (req.query.country) {
        const lowerCaseCountryQuery = req.query.country.toLowerCase();
        response = response.filter(movie =>
            movie.country.toLowerCase().search(`${lowerCaseCountryQuery}`) === 0
            ) 
        }

    if (req.query.avg_vote) {
        response = response.filter(movie =>
            Number(movie.avg_vote) >= Number(req.query.avg_vote)
        ) 
    }

    res.json(response)
})

const PORT = 8000

app.listen(PORT, () => {
    console.log(`Server listening at https://localhost:${PORT}`)
})