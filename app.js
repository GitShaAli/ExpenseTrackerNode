const path = require('path');

const userRoutes = require('./routes/user')

const bodyParser = require('body-parser');

const express = require('express');

const fs=require('fs');

const cors=require("cors");

const crypto = require('crypto');

const Razorpay = require('razorpay');

const sequelize = require('./util/database');

const dotenv = require('dotenv');

const helmet = require("helmet");

const morgan = require('morgan');

const https = require('https');

dotenv.config();
const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),{flags:'a'})


// const privateKey = fs.readFileSync('server.key');
// const certificate = fs.readFileSync('server.cert');

const User = require('./models/user');
const Download = require('./models/download');
const Expense = require('./models/expense');
const Order = require('./models/orders');
const ForgotPasswordRequest=require('./models/forgotpassword')
const Income=require('./models/income')
const ExpenseTotal=require('./models/total')

app.use(bodyParser.json());
app.use(cors());
// app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined',{stream:accessLogStream}));
app.use(express.static(path.join(__dirname, 'public')));


app.use('/user',userRoutes);

app.use('/restit',userRoutes)

app.use('/expense',userRoutes);

app.use('/income',userRoutes);

app.use('/purchase',userRoutes);

app.use('/userType',userRoutes)

app.use('/called',userRoutes);


app.use((req, res) => {

  console.log('urlll', req.url);
  console.log('Req is succesfful');
  res.sendFile(path.join(__dirname, `public/${req.url}`));
})

app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true, 
    directives: { 
      'script-src': ["'self'", "https://cdnjs.cloudflare.com/"]  
    }
  }
})
);
// app.use(express.static(path.join(__dirname, 'public')));
User.hasMany(Expense);
User.hasMany(Income);
User.hasMany(Download);
User.hasOne(Order);
Order.belongsTo(User);


User.hasMany(ForgotPasswordRequest);

User.hasOne(ExpenseTotal);
ExpenseTotal.belongsTo(User);

sequelize
// .sync({ force: true })
.sync()
.then(()=> {
    // https.createServer({key:privateKey,cert:certificate},app).listen(3000);
     app.listen(3000);
  })
.catch(err => {
  console.log(err);
})