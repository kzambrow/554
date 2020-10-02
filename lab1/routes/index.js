const movieRoutes = require('./api');

const constructorMethod = (app) => {
    app.use('/api', movieRoutes);

    app.use('*', (req, res) => {
        res.sendStatus(404);
    });
};

module.exports = constructorMethod;