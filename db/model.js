const Sequelize = require('sequelize')

const DT = Sequelize.DataTypes;
var slug = require('slug')
console.log(slug('i ♥ unicode'))



const user = {
    user_id: {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
    email:  {
      type:DT.STRING(50),
      allowNull:false,
      unique:true
          },
    password:{
        type:DT.STRING(50),
        allowNull:false
        
    }
  }
  
  const userdetails = {
    user_id: DT.UUID,
    username: {
      type:DT.STRING(50),
      allowNull:false,
      unique:true
          },
   
    bio: DT.STRING(200),
    image: DT.STRING(200)
  }
  //const fo
  const article={
    slug:{type:DT.STRING,unique:true,primaryKey:true},
    title:DT.STRING(50),
    description:DT.STRING(50),
    body:DT.STRING(200),
    favoriteCount:{type:DT.INTEGER,defaultValue:0},


  }
  const tagmodel={
    tag:{type:DT.STRING,primaryKey:true}
  }
  const comments={
    body:{type:DT.STRING},
    commentid:{type:DT.INTEGER,primaryKey:true,autoIncrement: true}
  }
  
  module.exports = {
    user,
    userdetails,
    article,
    tagmodel,
    comments
  }
  