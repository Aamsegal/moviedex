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

/*const filterByCriteria = (criteria, next, filterResults, query) => {
    debugger
    if (criteria[next]){
        const newFilterResults = filterResults.filter(result => result[criteria[next]] === query[criteria[next]])
        
        return filterByCriteria(criteria, next + 1, newFilterResults, query)
    }
    return filterResults
}*/

//The code above is stuff I did with my mentor to condense the iff statements bellow
//im keeping it here for future reference

app.get('/movies', function handleGetMovies(req, res) {
    //const response = filterByCriteria(Object.keys(req.query), 0, MOVIES, req.query)
    //used with the commented code above
    let response = MOVIES
    
    if (req.query.genre) {
        response = response.filter(movie =>
            movie.genre.toLowerCase() === req.query.genre.toLowerCase()
            ) 
        }

    if (req.query.country) {
        response = response.filter(movie =>
            movie.country.toLowerCase() === req.query.country.toLowerCase()
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