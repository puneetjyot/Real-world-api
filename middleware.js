
function validateUsername(req,res,next){
  if(req.headers.token!=undefined){
    if(req.body.user.username==''){
        return res.status(400).json({
            errors:{
                body: ["username is not provided"]
                }
          })
    }
  }
  else{
    if(req.body.user.username==''||req.body.user.username==undefined){
        return res.status(400).json({
            errors:{
                body: ["username is not provided"]
            }
          })
        
        
    }
  }
    
    next();

}

function validatePassword(req,res,next){
    if(req.headers.token!=undefined){
        if(req.body.user.password&&req.body.user.password.length<6){
            return res.status(400).json({
                errors:{
                    body: ["password is too short or undefined"]
                    }
              })
        }
      }
   
   else{
    if(req.body.user.password.length< 6||req.body.user.password==undefined){
        return res.status(400).json({
            errors:{
                body: ["password is too short or undefined"]
            }
          })
        
        
    }
}
    next();

}

function validateEmail(req,res,next){
    if(req.headers.token!=undefined){
        if(req.body.user.email==""){
            return res.status(400).json({
                errors:{
                    body: ["email is not provided"]
                }
              })
        }
      }
   else{
    if(req.body.user.email==''||req.body.user.email==undefined){
        return res.status(400).json({
            errors:{
                body: ["email is not provided"]
            }
          })
        
        
    }
}
    next();

}
module.exports={
    validateUsername,validateEmail,validatePassword
}