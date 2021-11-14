const express = require('express')

const articleModel = require('../models/articleModel')

const slugify = require('slugify')

const router = express.Router()

const createDomPurify = require('dompurify')

const {JSDOM} = require('jsdom')

const marked = require('marked')

const domPurify = createDomPurify(new JSDOM().window)

// rout to write new article

router.get('/new', (req, res)=>{
    res.render('articles/new', {article: new articleModel()})
})


// rout to get article

 router.get('/:slug', async (req,res)=>{
     const article = await articleModel.findOne({slug:req.params.slug})
     if(article == null) res.redirect('/')
     res.render('articles/show', {article :article})
 })

// rout to delete existing article

 router.delete('/:id', async (req, res)=>{
    await articleModel.findByIdAndDelete(req.params.id)
    res.redirect('/')
 })


const saveAndRedirect = (path)=>{
    return async(req, res)=>{
        let article = req.article 
        let slugy = slugify(req.body.title, {lower: true, strict: true})
     let sanitzeMKD = domPurify.sanitize(marked.parse(req.body.markdown))
    //  let article = new articleModel({
    //     title:req.body.title,
    //     description:req.body.description,
    //     markdown:req.body.markdown,
    //     slug: slugy,
    //     sanitizedHtml:sanitzeMKD,
    // })
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.slug = slugy
        article.sanitizedHtml = sanitzeMKD
    try {
        await article.save()
        res.redirect(`/articles/${article.slug}`)
        console.log(req.body.title )
    } catch (error) {
        console.log(error)
        res.render(`articles/${path}`,{article:article})
    }
    }
}

//  code to save article to database
router.post('/', async(req,res, next)=>{
    //  let slugy = slugify(req.body.title, {lower: true, strict: true})
    //  let sanitzeMKD = domPurify.sanitize(marked.parse(req.body.markdown))
    // let article = new articleModel({
    //     title:req.body.title,
    //     description:req.body.description,
    //     markdown:req.body.markdown,
    //     slug: slugy,
    //     sanitizedHtml:sanitzeMKD,
    // })

    // try {
    //     await article.save()
    //     res.redirect(`/articles/${article.slug}`)
    //     console.log(req.body.title )
    // } catch (error) {
    //     console.log(error)
    //     res.render('articles/new',{article:article})
    // }
   req.article = new articleModel();
   next();
},saveAndRedirect('new'))

// rout to edit article

router.get('/edit/:id', async(req, res)=>{
    const article = await articleModel.findById(req.params.id)
    res.render('articles/edit', {article: article})
})

router.put('/:id', async(req, res, next)=>{
    req.article = await articleModel.findById(req.params.id)
    next()
}, saveAndRedirect('edit'))


module.exports = router