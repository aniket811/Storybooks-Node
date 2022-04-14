const express=require("express")
const { format } = require("express/lib/response")
const router=express.Router()
const {ensureAuth} =require('../middleware/auth') 

const Story=require('../models/story')
//Login and landing page
router.get("/add",ensureAuth,(req,res)=>{
   
    res.render("stories/add")
})

router.post("/",ensureAuth,async(req,res)=>{
   try{
    req.body.user=req.user.id
    await Story.create(req.body)
    res.redirect('/dashboard')
   }catch(err){
    res.render('error/500')   
    console.log(err);}
    //res.render("stories/add")
})

module.exports=router