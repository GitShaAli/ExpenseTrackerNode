const User = require('../models/user');
const bcrypt = require('bcrypt');
const { json } = require('body-parser');
const jwt = require('jsonwebtoken');
const Razorpay = require('razorpay');



function isNotValidInput(string){
    if(string==undefined || string.length==0){
        return true;
    }
    else{
        return false;
    }
}



exports.getUserName=async(req,res)=>{
    try {
        console.log("--->");
        const eid = req.query.id;
        const data = await User.findAll({where:{id:eid}});
        if(data){
            res.json(data);
        }
    else{
        res.json({user:'notPremium'});
    }
    } catch (error) {
        
    }
}
exports.signup= async(req,res)=>{
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        if(isNotValidInput(name)||isNotValidInput(email)||isNotValidInput(password)){
            return res.status(400).json({success:false,message:'Something Missing : Check Inputs'})
        }
        const exist = await User.findOne({ where : {email : req.body.email }});
        if(!exist){
            bcrypt.hash(password,10,async(err,hash)=>{
                await User.create({name,email,password:hash})
                res.status(201).json({success:true,message:'User Created'})
            })
        }
        else{
            throw new Error('User Already Exists');
        }
    }
    catch(err) {
        res.status(500).json({success:false,message:err.message});
      };
}

function generateAccessToken(id,uname){
    return jwt.sign({userId:id,name:uname},'secret')
}
let instance = new Razorpay({
    key_id: "rzp_test_hEgAjnMPViP1IE",
    key_secret: "nurdapp3iUQ23cwce4yNBHAz"
})







exports.login= async(req,res)=>{
    try{
        const email = req.body.email;
        const password = req.body.password;
        if(isNotValidInput(email)||isNotValidInput(password)){
            return res.status(400).json({success:false,message:"Something Missing : Check Inputs"})
        }
        const user = await User.findOne({ where : {email : req.body.email }});
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    throw new Error('something went wrong');
                }
                if(result===true){
                    res.status(200).json({success:true,message:"SuccessFully Logged In",token:generateAccessToken(user.id,user.name)})
                }
                else{
                    res.status(401).json({success:false,message:"Wrong Password"})
                }
            })
        }
        else{
            throw new Error("User Not Found");
        }
    }
    catch(err) {
        res.status(404).json({success:false,message:err.message});
      };
}



exports.getUserType = async(req,res)=>{
    try{
        const data = await User.findAll({where:{id:req.user.id}})
        if(data){
            res.json({data});
        }
    }catch(err){
        console.log(err);
    }
}

