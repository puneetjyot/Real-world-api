const {user,userdetails}=require("./model");


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
  
    const User=db.define('user',user);
    const UserDetails=db.define('userdetail',userdetails);
    UserDetails.belongsTo(User,{foreignKey:'user_id'});
    User.hasOne(UserDetails,{foreignKey:'user_id'});
    User.belongsToMany(User,{as:'follower',foreignKey:'followingUserId',through:'followcontrol'})
    User.belongsToMany(User,{as:'following',foreignKey:'followerUserId',through:'followcontrol'})

   db.sync();
    module.exports= {
        db,
        User,
        UserDetails
    }

   
