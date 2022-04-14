const express=require("express")
const { format } = require("express/lib/response")
const router=express.Router()
const {ensureAuth} =require('../middleware/auth') 
const story = require("../models/story")

const Story=require('../models/story')
//Login and landing page
router.get("/add",ensureAuth,(req,res)=>{
   
    res.render("stories/add")
})

router.get('/:id',ensureAuth,async(req,res)=>{
  try{let story=await Story.findById(req,params.id).populate('user').lean()
if (!story){
  return res.render('error/404')
}res.render('stories/show',{story})
}
  catch(err){console.log(err);}
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
router.get("/",ensureAuth,async(req,res)=>{
    try{
        const stories=await Story.find({status:'public'}).populate('user').sort({createdAt:'desc'}).lean()
        res.render('stories/index',{
            stories,
        })
   }catch(err){
    res.render('error/500')           
    console.log(err);}
})
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean()
  
      if (!story) {
        return res.render('error/404')
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories')
      } else {
        res.render('stories/edit', {
          story,
        })
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  })
  router.put("/:id",ensureAuth,async(req,res)=>{
    try{

    let story =await Story.findById(req.params.id).lean()
    if (!story){
      return res.render('error/404')
    }
    if (story.user != req.user.id) {
      res.redirect('/stories')
    } else {
     story=await Story.findOneAndDelete({_id:req.params.body},req.body,{
       new:true,
       runValidators:true
     })
     res.redirect('/dashboard')
    } }catch(err){console.log(err);}
    // res.render("stories/add")
})
router.delete('/:id',ensureAuth,async(req,res)=>{
  try{
    await Story.remove({_id:req.params.id})
    res.redirect('/dashboard')
  }catch(err){console.log(err);}
})
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean()

    res.render('stories/index', {
      stories,
    })
  } catch (err) {
    console.error(err)
    res.render('error/500')
  }
})

module.exports=router