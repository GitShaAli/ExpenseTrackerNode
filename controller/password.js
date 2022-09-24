// const { v4: uuidv4 } = require('uuid');
const uuid = require('uuid');
const sgMail = require('@sendgrid/mail');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forget = require('../models/forgotpassword');
const { HttpResponse } = require('aws-sdk');


// uuidv4();


exports.forgetPassword = async(req,res)=>{
    try {
        const email = req.body.email;
        console.log(email)
        const user = await User.findOne({where : { email }});
        console.log(user);
        const id = uuid.v4();
        if(user){
            sgMail.setApiKey(process.env.SENDGRID_API_KEY)
            const msg = {
                to: email,
                from: 'alishafeeq81@gmail.com',
                subject: 'Password Reset',
                text: 'rest In...',
                html: `<a href="http://localhost:3000/called/password/resetpassword/?id=${id}">Click here to Reset password</a>`,
            }
            const addForget = Forget.create({id,isactive:true,userId:user.id})
            if(addForget){
                sgMail.send(msg)
                .then((response) => {
                    console.log(response[0].statusCode)
                    console.log(response[0].headers)
                    return res.json({message: 'reset intiated.. ', sucess: true})

                })
                .catch((error) => {
                    console.log(error)
                    throw new Error("error");
                })
            }
        }else {
            throw new Error('user not exist')
        }
    } catch(err){
        return res.json({ message: "Reset link not send", sucess: false });
    }

}

exports.resetPassword = (req, res) => {
    const id =  req.query.id;
    // console.log(req.query);
    Forget.findOne({ where : { id }}).then(field => {
        if(field){
            field.update({ active: false});
            // res.status(200).sendFile(`E:/ExpenseTracker-NodeJs/resetform.html`)
            
            res.send(`<html>

            <form action="http://localhost:3000/called/password/toReset/">
            <input type="hidden" name="fid" value="${id}"></input>
            <input name="newpassword" type="password" placeholder="Enter new Password" required></input>
            <button>reset</button>
            </form>
        </html>`
        )
        res.end()
        }
    })
}



exports.setNewPassword = (req,res)=>{
    console.log('in')
    const id = req.query.fid;
    const newPass = req.query.newpassword;
    // console.log(req.query)
    Forget.findOne({ where : { id }}).then(userid => {
        if(userid){
            const uId = userid.userId;
            console.log(userid.userId)
            User.findOne({ where : { id:uId}}).then(user => {
                bcrypt.hash(newPass, 10, (err, hash)=>{
                    user.update({ password:hash}).then(() => {
                        const link = 'http://localhost:3000/login.html';
                        
                        res.send(`<html>
                                    <body>
                                    Successfully update the new password please try login ...
                                    <a href='${link}' target="_blank">Click here to login</a>
                                    </body>
                                </html>`)
                        // res.render('login.html')
                        // res.status(201).json({message: 'Successfully update the new password'})
                    })
                })
            })
        }
    })
}