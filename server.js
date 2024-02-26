
const express = require("express");
const app = express();
const cors=require('cors')
const corsOptions = require('./config/corsOptions');
const authenticateToken = require('./middleware/authenticateToken')
const cookieParser = require('cookie-parser');

const PORT = process.env.PORT || 3500;

app.use(cors());

app.use(express.json())
app.use(cookieParser());

app.use(express.urlencoded({extended:false}))
// app.use(express.json({ type: 'application/vnd.api+json' }));



app.use('/login',require('./routes/loginRoute'))
app.use('/register',require('./routes/registerRoute'))
app.use('/refresh', require('./routes/refresh'));
app.use(authenticateToken)//middleware to authenticate the accesstoken ->Must be placed only before the routes that are protected
app.use('/expense', require('./routes/trackExpense'))
app.use('/income', require('./routes/trackIncome'))
app.use('/goals', require('./routes/trackGoals'))
app.use('/subscriptions', require('./routes/trackSubscription'))


app.listen(PORT, () => console.log(`server running on Port ${PORT}`));
// client.connect();
