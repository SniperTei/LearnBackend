var express = require('express');

var router = express.Router();

// GET /movies
router.get('/movie-list', (req, res) => {
  // Logic to fetch all movies from the database
  // Replace this with your own implementation
  // 打印req
  // console.log('movie-list req:', req);
  const movies = [
    { id: 1, title: 'Movie 1' },
    { id: 2, title: 'Movie 2' },
    { id: 3, title: 'Movie 3' }
  ];

  res.json(movies);
});

// GET /movies/:id
router.get('/detail/:id', (req, res) => {
  const movieId = req.params.id;

  // Logic to fetch a movie by ID from the database
  // Replace this with your own implementation
  const movie = { id: movieId, title: `Movie ${movieId}` };

  res.json(movie);
});

// POST /movies
router.post('/', (req, res) => {
  // Logic to create a new movie in the database
  // Replace this with your own implementation
  const newMovie = req.body;

  res.json(newMovie);
});

// PUT /movies/:id
router.put('/detail/:id', (req, res) => {
  const movieId = req.params.id;

  // Logic to update a movie by ID in the database
  // Replace this with your own implementation
  const updatedMovie = req.body;

  res.json(updatedMovie);
});

// DELETE /movies/:id
router.delete('/detail/:id', (req, res) => {
  const movieId = req.params.id;

  // Logic to delete a movie by ID from the database
  // Replace this with your own implementation

  res.sendStatus(204);
});

module.exports = router;