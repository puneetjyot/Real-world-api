const {user,userdetails,article,tagmodel,comments}=require("./model");


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
    const Article=db.define('article',article);
    Article.belongsTo(UserDetails,{as:'author',foreignKey:'id'})
    UserDetails.hasMany(Article ,{foreignKey:'id'})
    const Tags=db.define('tagmodel',tagmodel)
    Article.belongsToMany(Tags,{foreignKey:'slug',through:'articletagcontrol'})
    Tags.belongsToMany(Article,{foreignKey:'tag',through:'articletagcontrol'})
    Article.belongsToMany(UserDetails,{as:'favoritedBy',foreignKey:'slug',through:'FavouriteControl'})
    UserDetails.belongsToMany(Article,{as:'favoritedArticles',foreignKey:'id',through:'FavouriteControl'})
   Comments=db.define('comment',comments)
     Comments.belongsTo(Article,{foreignKey:'slug'})
     Article.hasMany(Comments,{foreignKey:'slug'})
     Comments.belongsTo(UserDetails,{as:'author',foreignKey:'id'})
     UserDetails.hasMany(Comments ,{foreignKey:'id'})


   db.sync();
    module.exports= {
        db,
        User,
        UserDetails,
        Article,
        Tags,
        Comments
    }

   
