const Expense = require('../models/expense');
const TotalTable = require('../models/total');
const Income = require('../models/income');
const { json } = require('body-parser');
const { Console } = require('console');
const { where } = require('sequelize');
const User = require('../models/user');
const Download = require('../models/download');
const sequelize = require('sequelize');
let items_per_page=5;

exports.addExpense= async(req,res)=>{
    try{
        // const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;
        const category = req.body.category;

        // console.log("------>"+{userId:req.user.id})
        const data = await Expense.create({description,price,category,userId:req.user.id})
        if(data){
            const total = await TotalTable.findAll({where:{userId:req.user.id}})
            if(total.length>0){
                let addTotal = Number(total[0].total)+Number(price);
                await TotalTable.update({total:addTotal},{where:{userId:req.user.id}})
            }
            else{
                await TotalTable.create({total:price,userId:req.user.id})
            }
            res.status(201).json({data,success:true,message:'Expense Added'})
        }
        else{
            console.log("err ===>"+err)
        }
    }
    catch(err) {
        console.log(err);
      };
}

exports.addIncome= async(req,res)=>{
    try{
        // const title = req.body.title;
        const description = req.body.description;
        const price = req.body.price;

        // console.log("------>"+{userId:req.user.id})
        const data = await Income.create({description,price,userId:req.user.id})
        if(data){
            res.status(201).json({data,success:true,message:'Income Added'})
        }
        else{
            console.log("err ===>"+err)
        }
    }
    catch(err) {
        console.log(err);
      };
}
exports.addPageRange = (req,res)=>{
    const pageRange=+req.query.pageLimit;
    items_per_page=pageRange;
    res.json({message:'success'});
}

exports.allIncome= async(req,res)=>{
    try{
        const data = await Income.findAll({where:{userId:req.user.id}})
        if(data){
            res.json({data});
        }
    }catch(err){
        console.log(err);
    }
}
exports.getAllUserExpenseShower = async(req,res)=>{
    try{
            console.log("--->");
            const eid = req.query.userId;
            const data = await Expense.findAll({where:{userId:eid}});
            if(data){
                res.json({data});
            }
        else{
            res.json({user:'notPremium'});
        }
        }catch(err){
            console.log(err);
        }
}


exports.deleteExpense = async(req,res)=>{
    const eid = req.body.id;
    // const item = await Expense.findByPk(id)
    Expense.destroy({where:{id:eid,userId:req.user.id}})

      return  res.status(201).json({message:"Deleted"})
    
}


exports.getExpenses = async(req,res)=>{
    try{
        const page=+req.query.page;
        console.log("page"+page);
        const off = (page-1) * items_per_page;
        let totalItem;
        const expense = await Expense.findAll({where:{userId:req.user.id}})
        if(expense){
            totalItem = expense.length;
        }
        const data = await Expense.findAll({where:{userId:req.user.id},offset: off, limit: items_per_page,subQuery:false})
        if(data){
            res.status(200).json({data,totalItem,page,lastPage:Math.ceil(totalItem/items_per_page)});
        }
       
    }catch(err){
        res.status(400)
        console.log(err);
    }
}

exports.getAllExpenses= async(req,res)=>{
    try{
        if(req.user.ispremiumuser!=null){
            const data = await TotalTable.findAll({ order: sequelize.literal('total DESC')});
            // const users = await User.findAll({where:{userId:data.user.id}});
            if(data){
                res.json({data});
            }
        }
        else{
            res.json({user:'notPremium'});
        }
        }catch(err){
            
            console.log(err);
        }
}

exports.getAllDownloads = async(req,res)=>{
    try{
        const data = await Download.findAll({where:{userId:req.user.id}});
        if(data){
            res.json({data});
        }
    }catch(err){
        console.log(err);
    }
}

