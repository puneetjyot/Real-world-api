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
passport.authenticate('local',{failureRedirect:'../login',successRedirect:'../user',failureFlash:true}),
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

route.get('/user', async function(req, res) {
 
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
  await  User.findOne({
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


route.put('/user',async function(req,res){

  if(req.headers.token){
  Decryptedtoken= decryptToken(req.headers.token);
  
  console.log(Decryptedtoken.email)
  if(Decryptedtoken.email!==null){
   const updateuser= await User.findOne({
      where:{
        email:Decryptedtoken.email
      }
    })
    
   const updateuserdetails= await UserDetails.findOne({
      where:{
        user_id:updateuser.user_id
      } 
     })
     
console.log(updateuserdetails)

  
try{
  
  if(req.body.email){
    updateuser.email=req.body.email;
  }
  if(req.body.password)
  {   

    updateuser.password=req.body.password;
  }
  if(req.body.username){
    updateuserdetails.username=req.body.username;
  }
 
  if(req.body.image){
    updateuserdetails.image=req.body.image;
  }
  if(req.body.bio){
    updateuserdetails.bio=req.body.bio;
  }
const updateduser=await updateuser.save();

const updateduserdetails=await updateuserdetails.save();
const usertoken=  generateToken(updateduser.email);

res.status(201).json({
  user: {
    email: updateduser.email,
    username: updateduserdetails.username,
    bio: updateduserdetails.bio,
    image: updateduserdetails.image,
   token:usertoken
  }
})


}
catch(err){
  res.sendStatus(500).json({
    errors:{
        body: err
    }
  })
}

  }
  
  else{

    return   res.json({
      errors:{
        message:[Decryptedtoken.error]
      }
    })
    }
  }
else{
  return res.status(401).json({
    errors:{
      message:["UnAuthorised User"]
    }
  })
}
})


module.exports = route;
