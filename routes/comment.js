const route = require('express').Router();
const { decryptToken } = require('../services/tokenservice');
const { User, UserDetails, Article, Tags,Comments } = require('../db/index');
var Slug = require('slug')

route.post('/:slug/comments',async(req,res)=>{

    if(req.headers.token){
        Decryptedtoken = decryptToken(req.headers.token);

        if (Decryptedtoken.email !== null) {
            const user = await User.findOne({
                where: {
                    email: Decryptedtoken.email
                }
            })

            let userdetails = await UserDetails.findOne({
                where: {
                    user_id: user.user_id
                }
            })
    try{
       
    const newcomments=await Comments.create({
        body:req.body.comment.body,
        slug:req.params.slug,
        id:userdetails.id
    })
    console.log(newcomments)
    let comment=await Comments.findOne({
        where:{
            commentid:newcomments.commentid
        },
        include:[{
            model:UserDetails, as: 'author',
            attributes: ['username', 'bio', 'image']

        }]
    })
    return res.status(201).json({comment})

    

    }

catch (err) {
    return res.status(500).json({
        errors: {
            body: [err]
        }
    })
}
        }
        else{
            
                return res.status(401).json({
                    errors: {
                        message: ["UnAuthoriseddd User"]
                    }
                })
        }
    }
    else{
        return res.status(401).json({
            errors: {
                message: ["UnAuthoriseddd User"]
            }
        })
    }
})



route.get('/:slug/comments',async(req,res)=>{
try{
    const article=await Article.findOne({
        where:{slug:req.params.slug}
    })
    console.log(article.__proto__)
    let comments=[]
    mulcomments=await article.getComments()
    for(var i = 0; i < mulcomments.length;i++){
        let comment=await Comments.findOne({
            where:{
                commentid:mulcomments[i].commentid
            },
            include:[{
                model:UserDetails, as: 'author',
                attributes: ['username', 'bio', 'image']
    
            }]
        })
        comments.push(comment)
  }



    res.status(200).json({
        comments
    })
}
catch(err){
    return res.status(500).json({
        errors: {
            body: [err.message]
        }
    })
}
})

route.delete('/:slug/comments/:id',async(req,res)=>{

    if(req.headers.token){
        Decryptedtoken = decryptToken(req.headers.token);

        if (Decryptedtoken.email !== null) {
            try{
                const user = await User.findOne({
                    where: {
                        email: Decryptedtoken.email
                    }
                })
    
                let userdetails = await UserDetails.findOne({
                    where: {
                        user_id: user.user_id
                    }
                })
                const deletecomment=await Comments.findOne({
                    where:{
                        commentid:req.params.id
                    }
                })

                if(deletecomment.id===userdetails.id){

                    const article=await Article.findOne({
                        where:{slug:req.params.slug}
                    })
                    console.log(article.__proto__)

                    article.removeComment(deletecomment)
                    Comments.destroy({
                        where:{
                            commentid:req.params.id
                        }
                    })
                    return res.status(200).json({

                    })
                }
                else{
                    return res.status(401).json({
                        errors: {
                            message: ["UnAuthoriseddd User"]
                        }
                    })
                }






            }
            catch(err){
                return res.status(500).json({
                    errors: {
                        body: [err.message]
                    }
                })
            }
        }
        else{
            return res.status(401).json({
                errors: {
                    message: ["UnAuthoriseddd User"]
                }
            })
        }
    }
    else{
        return res.status(401).json({
            errors: {
                message: ["UnAuthoriseddd User"]
            }
        })
    }






})

module.exports = route;
