const path = require('path');

const express = require('express');

const Controller = require('../controller/user');

const expenseController = require('../controller/expense');

const userAuth = require('../middleware/auth');

const router = express.Router();

const premium = require('../controller/purchase.js')

const PasswordController = require('../controller/password')

const FileController = require('../controller/download')

router.post('/signup', Controller.signup);

router.post('/login', Controller.login);

router.post('/addexpense', userAuth.authenticate,expenseController.addExpense);

router.post('/addincome', userAuth.authenticate,expenseController.addIncome);

router.post('/allexpenses/pagePerView',expenseController.addPageRange);

router.get('/allincome', userAuth.authenticate,expenseController.allIncome);

router.get('/download', userAuth.authenticate,FileController.downloadFile);

router.get('/allexpenses',userAuth.authenticate, expenseController.getExpenses);

router.get('/allDownloads',userAuth.authenticate, expenseController.getAllDownloads);

router.get('/allUserexpenses',userAuth.authenticate, expenseController.getAllExpenses);

router.get('/allUserExpenseShower', expenseController.getAllUserExpenseShower);

router.post('/deleteExpense',userAuth.authenticate,expenseController.deleteExpense);

router.get('/premiummembership',userAuth.authenticate,premium.purchasepremium);

router.post('/updatetransactionstatus',userAuth.authenticate,premium.updateTransactionStatus);

router.get('/member',userAuth.authenticate,Controller.getUserType);

router.get('/getUserName',Controller.getUserName);

router.post('/password/forgotpassword',PasswordController.forgetPassword);

router.get('/password/resetpassword',PasswordController.resetPassword);

router.get('/password/toReset',PasswordController.setNewPassword);



module.exports = router;