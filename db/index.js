const Sequelize = require('sequelize')
const db= new Sequelize({
dialect:'sqlite',
storage:__dirname+'data.db'
});

var test = db.authenticate()
    .then(function () {
        console.log("CONNECTED! ");
    })
    .catch(function (err) {
        console.log(err);
    })
    .done();
    module.exports= {
        db,
    }