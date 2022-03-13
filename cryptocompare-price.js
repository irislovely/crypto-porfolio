const axios = require('axios');

class CryptoPrice {
    // send token list to cryptocompare API to get exchange rates
    getPrice(tokenList) {        
        let tokenArray = Array.from(tokenList).join(',');        
        let url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tokenArray}&tsyms=USD&api_key=92a6afec2e3bf28bcaa8fa76ed949d5125ff9f1721fc9a4c8b9d5a710fd1438f`;
        
        return axios.get(url).then(response => response.data)
    }    
}

module.exports = CryptoPrice;