const Sequelize = require('sequelize')
const DT = Sequelize.DataTypes;

const user = {
    userid: {
      type: DT.UUID,
      primaryKey: true,
      defaultValue: DT.UUIDV1
    },
    username: {
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
    userid: DT.UUID,
    email:  {
        type:DT.STRING(50),
        allowNull:false,
        unique:true
            },
    bio: DT.STRING(200),
    image: DT.STRING(200)
  }
  
  module.exports = {
    user,
    userdetails
  }
  