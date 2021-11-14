const express = require('express');

const mongoose = require('mongoose')

const articleRouter = require('./route/article')

const myRouter = require('./route/myrout')

const Article = require('./models/articleModel')

const methodOverride = require('method-override')

const app = express();

// nongodb connection

mongoose.connect('mongodb://localhost/blogPost', { useNewUrlParser:true, useUnifiedTopology:false}, err =>{
    if(!err){
        console.log('connected')
    }else{
        console.log(err)
    }
})

// const con = mongoose.connection;
// con.on('open', ()=> console.log('connected'))

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended:false}))

app.use(methodOverride("_method"))

app.use(express.static('./views/public'))

app.use('/articles', articleRouter)

//app.use('/articles', articleRouter)

// just to test my routing

app.use('/myRouter', myRouter)

// home page render

app.get('/', async(req,res)=>{

// this data were just for test

// const articles = [{
//     title: "Test Article",
//     createdAt: new Date,
//     description: "Test description"
// },
// {
//     title: "Test Article2",
//     createdAt: new  Date,
//     description: "Test description2"
// }
// ];

// app.get('/articles/:id', (req,res)=>{
// res.send(req.body.id)
// })

const articles = await Article.find().sort({createdAt : 'desc'});

res.render('articles/index', {articles: articles})

});


app.get('*',(req,res)=>{
    res.status(404).send(`cannot get <b>${req.url}</b> coz we dont have it...<br><a href='/'>Would you like to navigate back to home page`)
})

app.listen(8080,()=>{
    console.log('app is listening on port 8080')
});