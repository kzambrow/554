// I Pledge My Honor That I Have Abided By The Stevens Honor System - Kamil Zambrowski

const mongoCollections = require('../config/mongoCOllections');
const movies = mongoCollections.movies;
const uuid = require('uuid');
const { ObjectId } = require('mongodb');

const exportedMethods = {

    async getAllMovies(skip, take) {
        const movieCollection = await movies();
        let list = await movieCollection.find({}).toArray();
        let customList = [{}];
        if (!skip && !take) {
            for (let i = 0; i<20; i++) {
                customList.push(list[i]);
            }
            return customList;
        }
        if (skip && !take) {
            let value = parseInt(skip);
            if (!value || typeof value !== 'number') throw "skip parameter must be a number";
            else {
                for (let i = value; (i < list.length) && (i < value+20); i++) {
                    customList.push(list[i]);
                }
                return customList;
            }
        }
        if (!skip && take) {
            let value = parseInt(take);
            if (!value || typeof value !== 'number') throw "take parameter must be a number";
            else {
                for (let i = 0; (i<value) && (i<list.length) && (i<100); i++) {
                    customList.push(list[i]);
                }
                return customList;
            }
        }
        if (skip && take) {
            let skipVal = parseInt(skip);
            let takeVal = parseInt(take);
            if (!skipVal || typeof skipVal !== 'number') throw "skip parameter must be a number";
            if (!takeVal || typeof takeVal !== 'number') throw "take parameter must be a number";
            else {
                for (let i = skipVal; (i<takeVal+skipVal) && (i < list.length) && (i<100); i++) {
                    customList.push(list[i]);
                }
                return customList;
            }
        }
    },

    async getMovieByID(id) {
        if (!id) throw "Id not provided";
        const movieCollection = await movies();
        const movie = await movieCollection.findOne({ _id: id});
        if (!movie) throw "Movie not found";
        return movie;
    },

    async addMovie(title, cast, info, plot, rating) {
        if (!title || !cast || !info || !plot || !rating) throw "not all details provided";
        if (typeof title != 'string') throw "title must be a string";
        if (!Array.isArray(cast)) throw "cast must be an array";
        for (let i=0; i<cast.length; i++) {
            if (typeof cast[i] != 'object') throw "cast members must be objects in an array";
            if (!cast[i].firstName || typeof cast[i].firstName != 'string') throw "cast member must have a first name that is a string";
            if (!cast[i].lastName || typeof cast[i].lastName != 'string') throw "cast member muts have a last name that is a string";
        }
        if (typeof info != 'object') throw "info must be an object";
        if (!info.director || typeof info.director != 'string') throw "info must have a director whos name is a string";
        if (!info.yearReleased || typeof info.yearReleased != 'number') throw "info must have a release year that is a number";
        if (typeof plot != 'string') throw "plot must be a string";
        if (typeof rating != 'number') throw "rating must be a number";

        const movieCollection = await movies();
        const newMovie = {
            _id: ObjectId(),
            title: title,
            cast: cast,
            info: info,
            plot: plot,
            rating: rating,
            comments: []
        }

        const newInsertInformation = await movieCollection.insertOne(newMovie);
        const newId = newInsertInformation.insertedId;
        return await this.getMovieByID(newId);
    },

    async updateMovieCompletely(id, title, cast, info, plot, rating) {
        if (!id) throw "must provide id";
        if (!title || !cast || !info || !plot || !rating) throw "not all details provided";
        if (typeof title != 'string') throw "title must be a string";
        if (!Array.isArray(cast)) throw "cast must be an array";
        for (let i=0; i<cast.length; i++) {
            if (typeof cast[i] != 'object') throw "cast members must be objects in an array";
            if (!cast[i].firstName || typeof cast[i].firstName != 'string') throw "cast member must have a first name that is a string";
            if (!cast[i].lastName || typeof cast[i].lastName != 'string') throw "cast member must have a last name that is a string";
        }
        if (typeof info != 'object') throw "info must be an object";
        if (!info.director || typeof info.director != 'string') throw "info must have a director whos name is a string";
        if (!info.yearReleased || typeof info.yearReleased != "number") throw "info must have a release year that is a number";
        if (typeof plot != 'string') throw "plot must be a string";
        if (typeof rating != 'number') throw "rating must be a number";
        const movieCollection = await movies();
        const updatedInfo = await movieCollection.updateOne({_id: id}, { $set: {title: title, cast: cast, info: info, plot: plot, rating: rating}});
        if (!updatedInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "could not update the movie";
        }
        return await this.getMovieByID(id);
        
    },

    async updateMoviePartially(id, updatedMovie) {
        if (!id) throw "must provide id";
        const updatedMovieData = {};
        const movieCollection = await movies();
        if (updatedMovie.title){
            updatedMovieData.title = updatedMovie.title;
        }
        if (updatedMovie.cast){
            updatedMovieData.cast = updatedMovie.cast;
        }
        if (updatedMovie.info){
            updatedMovieData.info = updatedMovie.info;
        }
        if (updatedMovie.plot){
            updatedMovieData.plot = updatedMovie.plot;
        }
        if (updatedMovie.rating){
            updatedMovieData.rating = updatedMovie.rating;
        }
        const updatedInfo = await movieCollection.updateOne({ _id: id }, { $set: updatedMovie});
        if (!updatedInfo.matchedCount && !updateInfo.modifiedCount) {
            throw "could not update the movie";
        }
        return await this.getMovieByID(id);
    },

    async addComment(movieID, name, comment) {
        if (!movieID) throw "must provide movie id";
        if (!name) throw "must provide a name";
        if (!comment) throw "must provide a commment";
        if (typeof name != 'string') throw "name must be a string";
        if (typeof comment != 'string') throw "comment must be a string";
        const movieCollection = await movies();
        const newComment = {
            _id: ObjectId(),
            name: name,
            comment: comment
        }

        const newInsertInformation = await movieCollection.updateOne({_id: movieID}, {$addToSet: {comments: newComment}});
        if (!newInsertInformation.matchedCount && !newInsertInformation.modifiedCount) throw "could not add comment to movie";
        return await this.getMovieByID(movieID);
    },

    async removeComment(commentId, movieId) {
        if (!commentId) throw "must provide a comment id";
        if (!movieId) throw "must provide a movie id";
        const movieCollection = await movies();
        const removeInfo = await movieCollection.updateOne({ _id: movieId }, {$pull: { comments: {_id: commentId}}});
        if (!removeInfo.matchedCount && !removeInfo.modifiedCount) {
            throw "could not remove this comment";
        }
        return await this.getMovieByID(movieId);
    }

};

module.exports = exportedMethods;