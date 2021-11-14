const mongoose = require('mongoose')
const slugify = require('slugify')

const articleSchema = new mongoose.Schema({
    title:{
        type: String,
        required:true
    },
    description:{
        type: String,
    },
    markdown:{
        type: String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml:{
        type: String,
        required:true
    }
})

// articleSchema.pre('validate', (next)=>{
//     if(this.title != null){
//         this.slug = slugify(this.title, {lower: true, strict: true})
//         console.log('sluggy')
//     }else{
//         console.log('not slugged')
//     }
    
//     next();
// })


module.exports = mongoose.model('Article', articleSchema)
