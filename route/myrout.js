const express = require('express');
const router  = express.Router();

router.get('/', (req,res)=>{

    res.send('yo i just created a rout');

})

module.exports = router;