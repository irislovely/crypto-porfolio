const fs = require('fs');
const rl = require('readline');
const CryptoPrice = require('./cryptocompare-price');

function initLineReader() {
    return rl.createInterface({
        input: fs.createReadStream('transactions.csv') // read data from transactions.csv
    });
}

// Convert timestamp to date YYYY-MM-DD
function convertDate(timestamp) {    
    var date = new Date(timestamp * 1000);
    var iso = date.toISOString().match(/(\d{4}\-\d{2}\-\d{2})T(\d{2}:\d{2}:\d{2})/)

    return iso[1];
}

// Calculate the amount of the token
function calculateAssets(portfolio, dataFromLine, tokenList) {    
    tokenList.forEach(function(token) {                
        if (dataFromLine.token === token) {
            var amount = portfolio.get(token);
            if (!amount) amount = 0;

            if (dataFromLine.transaction_type === 'DEPOSIT') {
                amount += parseFloat(dataFromLine.amount);
            } else if (dataFromLine.transaction_type === 'WITHDRAWAL') {
                amount -= parseFloat(dataFromLine.amount);
            }
            
            portfolio.set(token, amount);
        }                
    }); 
}

// Get token list in the portfolio
function processTokenList(userDate) {
    return new Promise(function(resolve) {
        var lineReader = initLineReader();

        var tokenList = new Set();
        var skipHeader = 0;

        lineReader.on('line', function (line) {
            var dataFromLine = {};
            var lineSplit = line.split(',');

            dataFromLine.timestamp = lineSplit[0];
            dataFromLine.token = lineSplit[2];

            if (skipHeader > 0) {
                if (userDate) {
                    if (convertDate(dataFromLine.timestamp) === userDate) {
                        tokenList.add(dataFromLine.token);
                    }
                } else {
                    tokenList.add(dataFromLine.token);
                }
            }

            skipHeader++;
        });

        lineReader.on('close', function (line) {
            resolve(tokenList);
        });
    })
}

// Get portfolio values for the token list
function processPortfolio(tokenList, userDate) {
    return new Promise(function(resolve) {
        var lineReader = initLineReader();

        var portfolio = new Map();
        var skipHeader = 0;

        lineReader.on('line', function (line) {
            var dataFromLine = {};
            var lineSplit = line.split(',');

            dataFromLine.timestamp = lineSplit[0];
            dataFromLine.transaction_type = lineSplit[1];
            dataFromLine.token = lineSplit[2];
            dataFromLine.amount = lineSplit[3];

            if (skipHeader > 0) {
                if (userDate) {
                    if (convertDate(dataFromLine.timestamp) === userDate) {
                        calculateAssets(portfolio, dataFromLine, tokenList);
                    }
                } else {
                    calculateAssets(portfolio, dataFromLine, tokenList);
                }
            }

            skipHeader++;            
        });

        lineReader.on('close', function (line) {                        
            resolve(portfolio);
        }); 
    });
}

// Get USD price for each token in the portfolio
function getUSDPrice(portfolio, tokenList, userDate) {
    var latestPortfolio = portfolio;
    const price = new CryptoPrice(); // get exchange rates from cryptocompare

    price.getPrice(tokenList).then(data => {
        console.log('Current exchange rates: %o', data);

        if (userDate) {
            console.log('Requested date: %s', userDate);
        }

        latestPortfolio.forEach(function(value, key) {
            latestPortfolio.set(key, {amount: value, USD: value * data[key]['USD']});
        });
        console.log('Latest Porfolio: %o', latestPortfolio);
    });    
}

module.exports = {
    processTokenList,
    processPortfolio,
    getUSDPrice,
};