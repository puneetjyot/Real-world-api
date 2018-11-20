const route = require('express').Router();
const { decryptToken } = require('../services/tokenservice');
const { User, UserDetails, Article, Tags } = require('../db/index');
var Slug = require('slug')


route.post('/', async (req, res) => {

    if (req.headers.token) {

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

            try {


                const newarticle = await Article.create({
                    id: userdetails.id,
                    title: req.body.article.title,
                    slug: Slug(req.body.article.title),
                    description: req.body.article.description,
                    body: req.body.article.body,
                })
                let article = await Article.findOne({
                    where: {
                        slug: newarticle.slug
                    },
                    include: [{

                        model: UserDetails, as: 'author',
                        attributes: ['username', 'bio', 'image']
                    }]
                })
                let taglist = req.body.article.tagList
                if (taglist) {
                    for (let singletag of taglist) {
                        const newtags = await Tags.findOrCreate({
                            where: { tag: singletag }
                        })
                        await article.addTagmodels(newtags[0])
                    }
                }
                const newtaglist = (await article.getTagmodels()).map(tag => {
                    return tag.tag
                });
                article = article.toJSON();
                article.favourite = false;
                article.author.following = false;
                article.id = undefined;
                article.tagList = newtaglist
                return res.status(201).json(article)
            }
            catch (err) {
                return res.status(500).json({
                    errors: {
                        body: [err.message]
                    }
                })
            }
        }
        else {
            return res.status(401).json({
                errors: {
                    message: ["UnAuthoriseddd User"]
                }
            })
        }
    }
    else {
        return res.status(401).json({
            errors: {
                message: ["UnAuthorised User"]
            }
        })
    }
})

route.get('/:slug', async (req, res) => {
    console.log(req.params.slug);
    let usernamed;
    let userDetails;
    let articleuser
    if (req.headers.token) {

        Decryptedtoken = decryptToken(req.headers.token);
        if (Decryptedtoken.email !== null) {

            try {
                await User.findOne({
                    where: {
                        email: Decryptedtoken.email
                    }
                })
                    .then((tokenuser) => {
                        userid = tokenuser.dataValues.user_id
                        email = tokenuser.dataValues.email
                        articleuser = tokenuser
                    })

                userDetails = await UserDetails.findOne({
                    where: {
                        user_id: userid,
                    }


                })
                usernamed = userDetails.dataValues.username;

            }
            catch (err) {
                return res.sendStatus(500).json({
                    errors: {
                        body: err
                    }
                })
            }


        }
    }

    try {

        let article = await Article.findOne({
            where: {
                slug: req.params.slug
            },
            include: [{

                model: UserDetails, as: 'author',
                attributes: ['username', 'bio', 'image']
            }]
        })
        if (!article) {
            throw {
                message: 'Article not found'
            }

        }
        const authorDetails = await article.getAuthor();

        let isFollowing = false;

        if (userDetails) {
            const author = await User.findOne({
                where: {
                    user_id: authorDetails.user_id
                }
            })

            isFollowing = await author.hasFollower(articleuser);
        }

        const tags = (await article.getTagmodels()).map(tag => {
            return tag.tag
        })
        let isFavorited = await userDetails.hasFavoritedArticle(article);

        article = article.toJSON();
        article.favorited = isFavorited;
        article.tagList = tags;
        article.article_id = undefined;
        article.user_id = undefined;
        article.author.following = isFollowing;

        return res.status(200).json({
            article
        })

    }
    catch (err) {
        return res.sendStatus(500).json({
            errors: {
                body: err
            }
        })
    }

})


route.put('/:slug', async (req, res) => {
    let userdetails
    let user
    if (req.headers.token) {
        const updatearticle = await Article.findOne({
            where: {
                slug: req.params.slug
            }
        })
        console.log(updatearticle.dataValues.id)
        Decryptedtoken = decryptToken(req.headers.token);
        user = await User.findOne({

            where: {
                email: Decryptedtoken.email
            }
        })
        userdetails = await UserDetails.findOne({
            where: {
                user_id: user.dataValues.user_id
            }
        })
        Decryptedtoken.email
        if (updatearticle.dataValues.id === userdetails.dataValues.id) {


            try {

                if (req.body.article.title) {

                    updatearticle.title = req.body.article.title

                    updatearticle.slug = Slug(req.body.article.title)

                }

                if (req.body.article.description) {
                    updatearticle.description = req.body.article.description
                }
                if (req.body.article.body) {
                    updatearticle.body = req.body.article.body
                }

                const updatedarticle = await updatearticle.save();
                const tags = (await updatedarticle.getTagmodels()).map(tag => {
                    return tag.tag
                })
                console.log(tags)

                let article = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    },
                    include: [{

                        model: UserDetails, as: 'author',
                        attributes: ['username', 'bio', 'image']
                    }]
                })
                if (!article) {
                    throw {
                        message: 'Article not found'
                    }

                }
                const authorDetails = await article.getAuthor();

                let isFollowing = false;
                if (userdetails) {
                    console.log(authorDetails.__proto__)
                    const author = await User.findOne({
                        where: {
                            user_id: authorDetails.user_id
                        }
                    })

                    isFollowing = await author.hasFollower(user);
                }
                article = article.toJSON();
                article.favorited = false;
                article.tagList = tags;
                article.article_id = undefined;
                article.user_id = undefined;
                article.author.following = isFollowing;
                //  updatedarticle= updatedarticle.toJSON()
                // updatedarticle.tagList = tags;

                return res.status(200).json({
                    article
                })

            }
            catch (err) {
                return res.sendStatus(500).json({
                    errors: {
                        body: err
                    }
                })
            }




        }
        else {
            return res.status(401).json({
                errors: {
                    body: ["User Not Authorised"]
                }
            })
        }


    }
    else {
        return res.status(401).json({
            errors: {
                body: ["User Not Authorised"]
            }
        })
    }

})
route.delete('/:slug', async (req, res) => {

    if (req.headers.token) {

        Decryptedtoken = decryptToken(req.headers.token);
        if (Decryptedtoken.email !== null) {
            try {


                const deletearticle = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    }
                })

                user = await User.findOne({
                    where:
                    {
                        email: Decryptedtoken.email
                    }
                })

                userdetails = await UserDetails.findOne({
                    where: {
                        user_id: user.user_id
                    }
                })
                console.log(deletearticle.id)
                if (userdetails.id === deletearticle.id) {
                    userdetails.removeArticle(deletearticle);

                    Article.destroy({
                        where: {
                            slug: req.params.slug
                        }
                    })
                    return res.status(200).json({
                        article: {

                        }
                    })
                }
                else {
                    return res.status(401).json({
                        errors: {
                            body: ["Unauthorised User"]
                        }
                    })
                }
            }
            catch (err) {
                return res.sendStatus(500).json({
                    errors: {
                        body: err
                    }
                })
            }
        }
        else {
            return res.status(401).json({
                errors: {
                    body: ["Unauthorised User"]
                }
            })
        }
    }
    else {
        console.log("deleting")

        return res.status(401).json({
            errors: {
                body: ["Unauthorised User"]
            }
        })
    }


})




route.get('/', async (req, res) => {

    let { tag, author, favorited, offset, limit } = req.query;
    let userdetails = undefined
    let user
    let favoriteuserdetail
    if (!limit) {
        limit = 20
    }
    if (!offset) {
        offset = 0;
    }
    if(favorited){
        favoriteuserdetail=await UserDetails.findOne({
            where:{
                username:favorited
            }
        })
        console.log(favoriteuserdetail.dataValues.username)
    }
    if (req.headers.token) {
        Decryptedtoken = decryptToken(req.headers.token);

        if (Decryptedtoken.email !== null) {
            user = await User.findOne({
                where: {
                    email: Decryptedtoken.email
                }
            })

            userdetails = await UserDetails.findOne({
                where: {
                    user_id: user.user_id
                }
            })
        }
        else {
            return res.status(401).json({
                errors: {
                    message: ["UnAuthoriseddd User"]
                }
            })
        }
    }


    try {
        let allarticles
       if(favorited){
        allarticles=await favoriteuserdetail.getFavoritedArticles();


       }
       else if(tag){
           console.log("in tags")
           tagdetails=await Tags.findByPk(tag)

            allarticles=await tagdetails.getArticles()
        }
       else{
         allarticles = await Article.findAll({
            include: [{

                model: UserDetails, as: 'author',
                attributes: ['username', 'bio', 'image']
            }],
            limit: limit,
            offset: offset
        });
    }
        let articles = []

        for (let article of allarticles) {




           
            const authorDetails = await article.getAuthor();

            let isFollowing = false;

            if (userdetails) {
                const singleauthor = await User.findOne({
                    where: {
                        user_id: authorDetails.user_id
                    }
                })

                isFollowing = await singleauthor.hasFollower(user);
            }

            const tags = (await article.getTagmodels()).map(tag => {
                return tag.tag
            })
            let isFavorited = await userdetails.hasFavoritedArticle(article);
          //  console.log(userdetails.__proto__)
            article = article.toJSON();
            article.favorited = isFavorited
            article.tagList = tags;
            article.article_id = undefined;
            article.user_id = undefined;
            if(favorited||tag) {
                article.author = {
                  username: authorDetails.username,
                  bio: authorDetails.bio,
                  image: authorDetails.image
                }
                article.FavouriteControl=undefined
              } 
            article.author.following = isFollowing;


            if (!author) {
                articles.push(article)
            }
            else if (article.author.username === author) {
                articles.push(article)

            }









        }

        return res.status(200).json(articles)

    }
    catch (err) {
        return res.sendStatus(500).json({
            errors: {
                body: err
            }
        })
    }
})

route.post('/:slug/favorite', async (req, res) => {
    let user;
    let userdetails;
    if (req.headers.token) {

        Decryptedtoken = decryptToken(req.headers.token);
        if (Decryptedtoken.email !== null) {
            try {

                user = await User.findOne({
                    where:
                    {
                        email: Decryptedtoken.email
                    }
                })

                userdetails = await UserDetails.findOne({
                    where: {
                        user_id: user.user_id
                    }
                })

                let article = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    }
                })
                console.log(userdetails.__proto__)
                userdetails.addFavoritedArticle(article)
                let singlearticle = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    },
                    include: [{

                        model: UserDetails, as: 'author',
                        attributes: ['username', 'bio', 'image']
                    }]
                })

                const authorDetails = await article.getAuthor();

                let isFollowing = false;
                if (userdetails) {
                    const author = await User.findOne({
                        where: {
                            user_id: authorDetails.user_id
                        }
                    })

                    isFollowing = await author.hasFollower(user);
                }
                console.log(isFollowing)

                //console.log(userdetails.__proto__)

                const tags = (await article.getTagmodels()).map(tag => {
                    return tag.tag
                })

                singlearticle = singlearticle.toJSON();
                singlearticle.favorited = true;
                singlearticle.tagList = tags;
                singlearticle.article_id = undefined;
                singlearticle.user_id = undefined;
                singlearticle.author.following = isFollowing;
                return res.status(200).json({
                    singlearticle
                })

            }
            catch (err) {
                return res.sendStatus(500).json({
                    errors: {
                        body: err
                    }
                })
            }
        }
        else {
            return res.status(401).json({
                errors: {
                    body: ["Unauthorised User"]
                }
            })
        }
    }
    else {
        console.log("deleting")

        return res.status(401).json({
            errors: {
                body: ["Unauthorised User"]
            }
        })
    }

})

route.delete('/:slug/favorite', async (req, res) => {
    let user;
    let userdetails;
    if (req.headers.token) {

        Decryptedtoken = decryptToken(req.headers.token);
        if (Decryptedtoken.email !== null) {
            try {

                user = await User.findOne({
                    where:
                    {
                        email: Decryptedtoken.email
                    }
                })

                userdetails = await UserDetails.findOne({
                    where: {
                        user_id: user.user_id
                    }
                })

                let article = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    }
                })

                userdetails.removeFavoritedArticle(article)
                let singlearticle = await Article.findOne({
                    where: {
                        slug: req.params.slug
                    },
                    include: [{

                        model: UserDetails, as: 'author',
                        attributes: ['username', 'bio', 'image']
                    }]
                })

                const authorDetails = await article.getAuthor();

                let isFollowing = false;
                if (userdetails) {
                    const author = await User.findOne({
                        where: {
                            user_id: authorDetails.user_id
                        }
                    })

                    isFollowing = await author.hasFollower(user);
                }
                console.log(isFollowing)

                //console.log(userdetails.__proto__)

                const tags = (await article.getTagmodels()).map(tag => {
                    return tag.tag
                })

                singlearticle = singlearticle.toJSON();
                singlearticle.favorited = false;
                singlearticle.tagList = tags;
                singlearticle.article_id = undefined;
                singlearticle.user_id = undefined;
                singlearticle.author.following = isFollowing;
                return res.status(200).json({
                    singlearticle
                })

            }
            catch (err) {
                return res.sendStatus(500).json({
                    errors: {
                        body: err
                    }
                })
            }
        }
        else {
            return res.status(401).json({
                errors: {
                    body: ["Unauthorised User"]
                }
            })
        }
    }
    else {
        console.log("deleting")

        return res.status(401).json({
            errors: {
                body: ["Unauthorised User"]
            }
        })
    }

})
module.exports = route;
