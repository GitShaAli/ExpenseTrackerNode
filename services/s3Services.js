const fs = require('fs');
const pdf = require('pdf-creator-node');
const options = require('../helpers/options');
const Expense = require('../models/expense');
const path = require('path');
const AWS = require('aws-sdk');
const UserService = require('../services/userServices')
const { json } = require('body-parser');


exports.uploadToS3 = (datas,userId)=>{
    // datas=JSON.stringify(datas);
    const BUCKET_NAME = process.env.BUCKET_NAME;
    const IAM_USER_KEY = process.env.IAM_USER_KEY;
    const IAM_USER_SECRET = process.env.IAM_USER_SECRET;

    let s3Bucket= new AWS.S3({
        accessKeyId:IAM_USER_KEY,
        secretAccessKey:IAM_USER_SECRET
    })

    var params={
            Bucket:BUCKET_NAME,
            Key:`ExpenseDownload_${userId}.pdf`,
            Body:datas,
            ACL:'public-read',
            ContentType : 'application/pdf',
    }
    return new Promise((resolve,reject)=>{
        s3Bucket.upload(params,(err,s3res)=>{
            if(err){
                console.log("Something went wrong")
                reject(err);
            }
            else{
                resolve(s3res.Location);
            }
        })
    })
    

}