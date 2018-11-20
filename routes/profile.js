const route = require('express').Router();
const {generateToken,decryptToken}=require('../services/tokenservice');
const { User, UserDetails }  = require('../db/index');


route.post('/:username/follow',async(req,res)=>{
    	console.log(req.params.username)
    if(!req.headers.token)
    {
        return res.status(401).json({
            errors:{
              message:["UnAuthorised User"]
            }
          })
    }
    else{
        Decryptedtoken= decryptToken(req.headers.token);
        if(Decryptedtoken.email!==null){
          const followeruser=  await  User.findOne({
                where:{
                  email:Decryptedtoken.email
                }
              })
              try{
              const username=req.params.username;
              const followinguserdetails=await UserDetails.findOne({
                  where:{
                      username
                  }
              })
              const userid=followinguserdetails.user_id;
              const followinguser=await User.findByPrimary(userid);


              followeruser.addFollowing(followinguser)
              
              return res.status(201).json({
                profile: {
                  username: followinguserdetails.username,
                  bio: followinguserdetails.bio,
                  image: followinguserdetails.image,
                 following:true
                }
              })
            }
            catch(err){
                console.log("dhfhsdbhdsbhfsd")
                return res.status(404).json({
                    errors:{
                      message:[err.message]
                    }
                  })
            }     
            }
        
        
    }
   

})

route.delete('/:username/follow',async(req,res)=>{
    console.log(req.params.username)
    if(!req.headers.token)
    {
        return res.status(401).json({
            errors:{
              message:["UnAuthorised User"]
            }
          })
    }
    else{
        Decryptedtoken= decryptToken(req.headers.token);
        if(Decryptedtoken.email!==null){
          const followeruser=  await  User.findOne({
                where:{
                  email:Decryptedtoken.email
                }
              })
              try{
              const username=req.params.username;
              const followinguserdetails=await UserDetails.findOne({
                  where:{
                      username
                  }
              })
              const userid=followinguserdetails.user_id;
              const followinguser=await User.findByPrimary(userid);

              followeruser.removeFollowing(followinguser)
              
              return res.status(201).json({
                profile: {
                  username: followinguserdetails.username,
                  bio: followinguserdetails.bio,
                  image: followinguserdetails.image,
                 following:false
                }
              })
            }
            catch(err){
                return res.status(401).json({
                    errors:{
                      message:[err.message]
                    }
                  })
            }     
            }
        
        
    }
   
}
)

route.get('/:username',async (req,res)=>{


    try{
        const username=req.params.username;
        let isFollowing
        const followinguserdetails=await UserDetails.findOne({
            where:{
                username
            }
        })

        if(!req.headers.token){
            return res.status(201).json({
                profile: {
                  username: followinguserdetails.username,
                  bio: followinguserdetails.bio,
                  image: followinguserdetails.image,
                 following:false
                }
              })
        }
        else{

            Decryptedtoken= decryptToken(req.headers.token);
            if(Decryptedtoken.email!==null){
              const followeruser=  await  User.findOne({
                    where:{
                      email:Decryptedtoken.email
                    }
                  })
                  const userid=followinguserdetails.user_id;
                  const followinguser=await User.findByPrimary(userid);
    
                 isFollowing= await followeruser.hasFollowing(followinguser)

                 
                  console.log(isFollowing)
                  return res.status(201).json({
                    profile: {
                      username: followinguserdetails.username,
                      bio: followinguserdetails.bio,
                      image: followinguserdetails.image,
                     following:isFollowing
                    }
                  })
               
                }
                else{
                    return res.status(401).json({
                        errors:{
                            body:["UnAutorised User"]
                        }
                    })
                }

        }
       
    }
   
    
    catch(err){
        return res.status(404).json({
            errors:{
                body:[err.message]
            }
        })
    }

} 
    
)

module.exports=route