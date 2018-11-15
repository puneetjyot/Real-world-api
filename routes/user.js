const route = require('express').Router();
const {generateToken,decryptToken}=require('../services/tokenservice');
const {generateUUID}=require('../services/uuidservice');
const passport = require('../authenticate/init')
const key=require('../key');
const {validateUsername,validatePassword,validateEmail} =require('../middleware');
const { User, UserDetails }  = require('../db/index');
const jwt = require('jsonwebtoken')

route.post('/users', validateUsername,validatePassword,validateEmail,async (req, res) => {

  const userid= await generateUUID();
  const usertoken= await generateToken(req.body.email);
  
  try {
    const registerUser = await User.create({
      email: req.body.email,
      password: req.body.password,
      user_id: userid,

    })

    const registerUserDetails = await UserDetails.create({
      user_id: userid,
      username: req.body.username
    })

    res.status(201).json({
      user: {
        email: registerUser.email,
        username: registerUserDetails.username,
        bio: null,
        image: null,
       token:usertoken
      }
    })
  } catch(err) {
    res.sendStatus(500).json({
      errors:{
          body: err
      }
    })
  }

})



route.post('/users/login',
passport.authenticate('local',{failureRedirect:'../login',successRedirect:'../users',failureFlash:true}),
async(req,res)=>{


  try{

   
  }
  catch(err){
    res.sendStatus(500).json({
      errors:{
          body: err
      }
    })
  }

})

route.get('/users', async function(req, res) {
 
  let userid,email
 if(!req.headers.token){
   userid=req.user.dataValues.user_id;
   email=req.user.dataValues.email;
   console.log("no token")
 }
 else{
   console.log(decryptToken(req.headers.token))
   Decryptedtoken= decryptToken(req.headers.token);
  
  console.log(Decryptedtoken.email)
  if(Decryptedtoken.email!==null){
    await User.findOne({
      where:{
        email:Decryptedtoken.email
      }
    })
    .then((tokenuser)=>{
     userid=tokenuser.dataValues.user_id
     email=tokenuser.dataValues.email
    })

  }
  else{
    console.log("------------------")

  return   res.json({
    errors:{
      message:[Decryptedtoken.error]
    }
  })
  }
 }
  console.log(userid)
 await UserDetails.findOne({
  where: {
   user_id:userid
  }
})
  .then((user)=>{

  userdetails=user.dataValues;
  const usertoken=  generateToken(email);

  res.status(201).json({
    user: {
      email: email,
      username: userdetails.username,
      bio: userdetails.bio,
      image: userdetails.image,
     token:usertoken
    }
  })
      })
});
route.get('/login', function(req, res) {
  res.json({ errors: {
   body:[ req.flash().error]
  } });
});

module.exports = route;
