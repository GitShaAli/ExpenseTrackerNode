const fs = require('fs');
const pdf = require('pdf-creator-node');
const Expense = require('../models/expense');
const Income = require('../models/income');
const Download = require('../models/download');
const path = require('path');
const AWS = require('aws-sdk');
const UserService = require('../services/userServices')
const S3Service = require('../services/s3Services')
const { json } = require('body-parser');
const fsExtra = require('fs-extra')

exports.downloadFile = async(req,res)=>{
    const userId = req.user.id;
    try{
        const html = fs.readFileSync(('template.html'), 'utf-8')
        const datasIn = await Expense.findAll({where:{userId:req.user.id}})
        const IncomeDatas = await Income.findAll({where:{userId:req.user.id}})
        const filename = `ExpenseDownload_${userId}.pdf`;
        var options = {
            "format": "Letter",
            "orientation": "portrait",
            "type":'pdf',
        }
        
        let array = [];
        let iArray = [];
        if(datasIn){
            datasIn.forEach(item => {
                const expense = {
                    description: item.description,
                    price: item.price,
                    category: item.category
                }
                array.push(expense);
            });
        }
        if(IncomeDatas){
            IncomeDatas.forEach(item => {
                const income = {
                    description: item.description,
                    price: item.price,
                }
                iArray.push(income);
            });
        }
        let total = 0;
        array.forEach(i => {
            total += i.price
        });
        const obj = {
            explist: array,
            incomeList:iArray,
            total: total
        }
        const document = {
            html: html,
            data: {
                expense: obj
            },
            path: '../doc/' + filename
        }
        pdf.create(document, options)
            .then(async() => {
                const reader = fs.readFileSync('../doc/' + filename)
                const fileUrl = await S3Service.uploadToS3(reader,userId);
                console.log(fileUrl)
                const addToDownload = await Download.create({url:fileUrl,userId:req.user.id})
                const folder = '../doc'
                fsExtra.emptyDirSync(folder)
                res.status(201).json({fileUrl:fileUrl,down:addToDownload})
            })


    }catch(err){
        console.log(err);
        res.status(500).json({success:false,err:err})
    }
}