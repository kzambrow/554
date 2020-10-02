// I Pledge My Honor That I Have Abided By The Stevens Honor System - Kamil Zambrowski

const express = require('express');
const router = express.Router();
const data = require('../data');
const movieData = data.movies;
const { ObjectId } = require('mongodb');


router.get('/movies/', async (req, res) => {
    try {
        let skip = req.query.skip;
        let take = req.query.take;
        const movies = await movieData.getAllMovies(skip, take);
        res.json(movies);
    } catch (e) {
        res.status(500).json({ error: e});
    }
});

router.get('/movies/:id', async (req, res) => {
    try {
        var id = req.params.id;
        var o_id = new ObjectId(id);
        const movie = await movieData.getMovieByID(o_id);
        res.json(movie);
    } catch (e) {
        res.status(404).json({ error: 'Movie not found'});
    }
});

router.post('/movies/', async (req, res) => {
    const movie = req.body;
    if (!movie.title || !movie.cast || !movie.info || !movie.plot || !movie.rating) {
        res.status(400).json( {error: "All fields must be entered"});
        return;
    }
    try {
        const {title, cast, info, plot, rating} = movie;
        const newMovie = await movieData.addMovie(title, cast, info, plot, rating);
        res.json(newMovie);
    } catch (e) {
        res.status(500).json( { error: e });
    }
});

router.put('/movies/:id', async (req, res) => {
    const movie = req.body;
    var id = req.params.id;
    var o_id = new ObjectId(id);
    if (!movie.title || !movie.cast || !movie.info || !movie.plot || !movie.rating) {
        res.status(400).json( {error: "All fields must be entered"});
        return;
    }
    try {
        await movieData.getMovieByID(o_id);
    } catch (e) {
        res.status(404).json({ error: 'Movie not found' });
        return;
    }
    try {
        const updatedMovie = await movieData.updateMovieCompletely(o_id, movie.title, movie.cast, movie.info, movie.plot, movie.rating);
        res.json(updatedMovie);
    } catch (e) {
        res.status(500).json({ error: e});
    }
});

router.patch('/movies/:id', async (req, res) => {
    var id = req.params.id;
    var o_id = new ObjectId(id);
    const movie = req.body;
    let updatedMovieObject = {};
    try {
        const oldMovie = await movieData.getMovieByID(o_id);
        if (movie.title && movie.title != oldMovie.title) {
            updatedMovieObject.title = movie.title;
        }
        if (movie.cast && movie.cast != oldMovie.cast) {
            updatedMovieObject.cast = movie.cast;
        }
        if (movie.info && movie.info != oldMovie.info) {
            updatedMovieObject.info = movie.info;
        }
        if (movie.plot && movie.plot != oldMovie.plot) {
            updatedMovieObject.plot = movie.plot;
        }
        if (movie.rating && movie.rating != oldMovie.rating) {
            updatedMovieObject.rating = movie.rating;
        }
    } catch (e) {
        res.status(404).json({ error: 'Movie not found' });
        return;
    }
    try {
        const updatedMovie = await movieData.updateMoviePartially(o_id, updatedMovieObject);
        res.json(updatedMovie);
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post('/movies/:id/comments', async (req, res) => {
    const comment = req.body;
    var id = req.params.id;
    var o_id = new ObjectId(id);
    if (!comment.name || !comment.comment) {
        res.status(400).json( {error: "All fields must be entered"});
        return;
    }
    try {
        await movieData.getMovieByID(o_id);
    } catch (e) {
        res.status(404).json({ error: 'Movie with this id not found' });
        return;
    }
    try {
        const movieNewComment = await movieData.addComment(o_id, comment.name, comment.comment);
        res.json(movieNewComment);
    } catch (e) {
        res.status(500).json( { error: e });
    }
});

router.delete('/movies/:movieId/:commentId', async (req, res) => {
    if (!req.params.movieId || !req.params.commentId) {
        res.status(400).json({ error: 'You must provide a movie id and a comment id to delete'});
        return;
    }
    mid = req.params.movieId;
    cid = req.params.commentId;
    mo_id = new ObjectId(mid);
    co_id = new ObjectId(cid);
    try {
        await movieData.getMovieByID(mo_id);
    } catch (e) {
        res.status(404).json({error: 'Movie Not Found'});
        return;
    }
    try {
        const movieDeletedComment = await movieData.removeComment(co_id, mo_id);
        res.json(movieDeletedComment);
    } catch (e) {
        res.status(500).json({ error: e});
    }
});

module.exports = router;