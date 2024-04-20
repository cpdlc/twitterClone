const express = require('express');
const bcrypt = require('bcrypt')
const {User,Post} = require('../models');
const passport = require('passport')

const router = express.Router();

router.post('/login', (req,res,next)=>{
    passport.authenticate('local',(err,user,info)=>{
        if(err){
            console.error(err)
           return next(err)
        }
        if(info){
            return res.status(401).send(info.reason)
        }
        return req.login(user, async(loginErr)=>{
            if(loginErr){
                console.error(loginErr)
                return next(loginErr)
            }
            const fullUserWithoutPassword = await User.findOne({
                where:{id:user.id},
                attributes:{
                    exclude:['password']
                },
                include: [{
                    model: Post,
                    attributes: ['id'],
                  }, {
                    model: User,
                    as: 'Followings',
                    attributes: ['id'],
                  }, {
                    model: User,
                    as: 'Followers',
                    attributes: ['id'],
                  }]
            })

            return res.status(200).json(fullUserWithoutPassword);
        })
})(req,res,next);
});

router.post('/',async (req,res,next)=>{   //post/user
    try {
        const exUser = await User.findOne({
            where:{
                email:req.body.email,
            }
        });
        if(exUser){
           return res.status(403).send('이미 사용주인 아이디 입니다.')//return 안붙이면 아래도 실행
        }
        const hashedPassword = await bcrypt.hash(req.body.password,12);
    await User.create({   //await은 비동기
        email:req.body.email,
        nickname:req.body.nickname,
        password:hashedPassword,
    });
    // res.setHeader('Access-Control-Allow-Origin','http://localhost:3060')
    res.status(200).send("ok")
    } catch (error) {
        console.error(error);
        next(error)// status 500
    }

    
    res.send("ok");
})

    router.post('user/logout',(req,res,next)=>{
        req.logout();
        req.session.destroy();
        res.send('ok')
    })


module.exports = router;