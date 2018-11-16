
function validateUsername(req,res,next){
  if(req.headers.token!=undefined){
    if(req.body.username==''){
        return res.status(400).json({
            errors:{
                body: ["username is not provided"]
                }
          })
    }
  }
  else{
    if(req.body.username==''||req.body.username==undefined){
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
        if(req.body.password.length<6){
            return res.status(400).json({
                errors:{
                    body: ["password is too short or undefined"]
                    }
              })
        }
      }
   
   else{
    if(req.body.password.length< 6||req.body.password==undefined){
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
        if(req.body.email==""){
            return res.status(400).json({
                errors:{
                    body: ["email is not provided"]
                }
              })
        }
      }
   else{
    if(req.body.email==''||req.body.email==undefined){
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