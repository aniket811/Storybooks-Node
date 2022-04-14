const express=require("express")
const passport =require('passport')
//(const { Passport } = require("passport/lib")
// const passport = require("../config/passport")
const router=express.Router()
//Login and landing page
router.get("/google",passport.authenticate('google',{scope:['profile']}))
router.get("/google/callback",passport.authenticate('google',{failureRedirect:'/'}),(req,res)=>{
    res.redirect('/dashboard')
})
// logout
router.get('/logout',(req,res)=>{
    req.logOut()
    res.redirect('/')
})
module.exports=router