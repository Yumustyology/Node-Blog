const express = require('express')
const articleModel = require('../models/articleModel')
const router = express.Router()

router.get('/new', (req, res)=>{
    res.render('/articles/new', {article: new articleModel()})
})

router.get('/edit/:id', async(res, req)=>{
    const article = await  articleModel.findById(req.params.id)
    res.render('/articles/edit', {article: article})
})

router.get('/:slug', async(req,res)=>{
    const article = await articleModel.findOne({slug:req.params.slug})
if (article == null)res.redirect('/')    
res.render('articles/show', {article:article})
})




router.delete('/:id', async(req,res)=>{
    await articleModel.findByIdAndDelete(req.params.id)
    res.redirect('/')
})


const saveAndRedirect = (path)=>{
    return async(req,res)=>{
     let article = req.article
    article.title = req.body.title
    article.description = req.body.description
    article.markdown = req.body.markdown

try {
    article = await article.save()
    res.redirect(`/articles/${article.slug}`)
} catch (error) {
    res.render( `articles/${path}`, {article:article})
}

}
}

router.post('/', async(req,res,next)=>{
    //     let article = new articleModel({
    //         title:req.body.title,
    //         description:req.body.description,
    //         markdown:req.body.markdown,
    //     })
    //     try {
    //         article = await article.save()
    //         res.redirect(`/articles/${article.slug}`)
    //     } catch (error) {
    //         res.render( `articles/new`, {article:article})
    //     }
    
    req.article =  new articleModel()
    next()    
     },saveAndRedirect('new'))
    