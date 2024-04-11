const express = require('express');
const app = express()
const dbConfig = require('./models/db')
const db = dbConfig.db
const cors = require('cors');

var cookieParser = require('cookie-parser');
const session = require('express-session');
app.use(session({
    secret: "sobeeLogKey",
    resave: false,
    saveUninitialized: true,
}));

app.use(cookieParser());

require('dotenv').config();

app.use(cors());

app.use(express.json());
app.set("port",process.env.PORT || 8081);
app.use(
    express.urlencoded({
        extended: false
    })
)

app.get("/",(req,res) => {
    res.send("Welcome")
})

app.listen(app.get("port"),()=>{
    console.log(`Server running at http://localhost:${app.get("port")}`);
})

app.use('/',require('./routes'));
