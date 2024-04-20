const express = require('express')

const router = express.Router();
router.post('/',(req,res)=>{ //실제로는 post / post
    res.json([
        {id:1,content:'post test'}
    ])
})

router.delete('/',(req,res)=>{ // delete / post
    res.json({id:1})
})

module.exports = router;