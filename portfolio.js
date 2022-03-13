var program = require('commander');
const {
    processTokenList,
    processPortfolio,
    getUSDPrice,
} = require('./portfolio-services');

function readCSV() {
    program
    .option('-t, --token <name>', 'get portfolio per token')
    .option('-d, --date <date>', 'get portfolio on specific date, format YYYY-MM-DD')
    .parse(process.argv);

    const options = program.opts();

    var userDate = null;
    if (options.date) {
        userDate = options.date; // if user provides date, use it
    }

    var tokenList = null;

    var getTokenList = processTokenList(userDate); // get token list in the portfolio

    getTokenList.then(function(processedTokenList) {
        if (!options.token) {
            tokenList = processedTokenList; // if user doesn't provide token, use all tokens in the portfolio
        } else {
            if (processedTokenList.has(options.token.toUpperCase())) {
                tokenList = new Set([options.token.toUpperCase()]); // if user provides token, and that token is in the portfolio, use that token
            } else {
                console.log('No token in portfolio');
                process.exit();
            }            
        }            

        if (tokenList.size > 0) {
            var getPortfolio = processPortfolio(tokenList, userDate); // get portfolio values for the token list
        
            getPortfolio.then(function(processedPortfolio) {
                getUSDPrice(processedPortfolio, tokenList, userDate); // get USD price for each token in the portfolio
            });
        } else {
            console.log('No token found');
            process.exit();
        }       

    });
}

readCSV();