const route = require('express').Router();
const { decryptToken } = require('../services/tokenservice');
const { User, UserDetails, Article, Tags,Comments } = require('../db/index');



route.get('/',async(req,res)=>{
    try{
    const tags=await Tags.findAll({
        attributes:['tag']
    })

    return res.status(200).json
    (
        {tags}
        
    
        )

}

catch(err){
    return res.status(500).json({
        errors: {
            body: [err.message]
        }
    })
}
})








module.exports = route;
