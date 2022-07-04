const express =  require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const cors = require("cors");

const csv = require('csvtojson')
const csvFilePath = './stocks.csv';

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

var userModel = require('./models/Stocks');

mongoose.connect('mongodb+srv://root:root@cluster0.fblmw.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true});
var conn = mongoose.connection;
conn.on('connected', function() {
    console.log('database is connected successfully');
});
conn.on('disconnected',function(){
    console.log('database is disconnected successfully');
})
conn.on('error', console.error.bind(console, 'connection error:'));

app.get('/upload',async (req,res)=>{
    try {
        const jsonArray=await csv().fromFile(csvFilePath);
    
       let dataArray =  jsonArray.map(item=>{
            let obj = {}
            obj.name = item.Name
            obj.current_market_price = item['Current Market Price']
            obj.market_cap = item['Market Cap']
            obj.stock = item['Stock P/E']
            obj.dividend_yield = item['Dividend Yield']
            obj.roce = item['ROCE %']
            obj.roe_previous = item['ROE Previous Annum']
            obj.debt_equity = item['Debt to Equity']
            obj.eps = item['EPS']
            obj.reserves = item['Reserves']
            obj.debt = item['Debt']
            return obj
        })
        let response = await userModel.insertMany(dataArray)
        console.log(response)

        res.send('upload')
    }catch(err){
        console.log(err)
    }
});

app.get('/list', async(req, res) => {
    const listStocks = await userModel.find({ 'name': new RegExp(req.query.name, 'i') },{name:1})
    res.status(200).json({ status: 1, message: "Stocks fetched successfully.",  data: listStocks, errors: {} })
});

app.get('/list/:id', async(req, res) => {
    const listStocks = await userModel.findById(req.params.id)
    res.status(200).json({ status: 1, message: "Stock data fetched successfully.", data: listStocks, errors: {} })
});



app.listen(4000,(err)=>{
    if(err) throw err
console.log("Server listening at 4000")
})

