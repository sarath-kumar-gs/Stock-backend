const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StocksSchema = new Schema({
    name: { type: String  },
    current_market_price: { type: String },
    market_cap: { type: String },
    stock: { type: String,  },
    dividend_yield: { type: String },
    roce: { type: String },
    roe_previous: { type: String },
    debt_equity:{ type: String },
    eps: { type: String },
    reserves: { type: String },
    debt: { type: String }

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = Stocks = mongoose.model("stocks", StocksSchema);
