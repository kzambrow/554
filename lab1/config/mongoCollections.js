// I Pledge My Honor That I Have Abided By The Stevens Honor System - Kamil Zambrowski


const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
    let _col = undefined;

    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

module.exports = {
    movies: getCollectionFn('movies')
};