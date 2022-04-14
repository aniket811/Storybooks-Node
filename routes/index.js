const express=require("express")
const { format } = require("express/lib/response")
const router=express.Router()
const {ensureAuth,ensureGuest} =require('../middleware/auth') 

const Story=require('../models/story')
//Login and landing page
router.get("/",ensureGuest,(req,res)=>{
   
    res.render("login",{
        layout:'login'
    })
})
router.get("/dashboard",ensureAuth,async(req,res)=>{
    try{
        const stories=await Story.find({user:req.user.id}).lean()
        res.render("dashboard",{
            name:req.user.firstName,stories
        })
    }

    catch(err){
        res.render('error/500')
        console.log(err);}
    
    
})

module.exports=router