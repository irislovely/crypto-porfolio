## About This Project

Using NodeJS to write a command line program to query a user's crypto portfolio.

## How to run

From the root folder of project, we can run the command **portfolio [options]** to query portfolio from the "transactions.csv" file in the same root folder.

```bash
node portfolio [options]

Options:
  -t, --token <name>  get portfolio per token  
  -d, --date <date>   get portfolio on specific date, format YYYY-MM-DD  
  -h, --help          display help for command
```
If there is no option provided, then the program will return the latest portfolio value per token in USD.
```bash
node portfolio
```

If a token name is provided via --token option, then the program will return the latest portfolio value for that token in USD.
```bash
node portfolio --token eth
```

If a date is provided via --date option, then the program will return the portfolio value per token in USD on that date.
```bash
node portfolio --date 2019-10-25
```

If a token and a date both provided via --token and --date, the the program will return the portfolio value of that token in USD on that date.
```bash
node portfolio --token eth --date 2019-10-25
```

## Logic of the code

After receiving the command from CLI, we will load the list of all tokens that currenly are in the portfolio. During this, we'll also check if user input a date, then we'll query data on that date. If we don't have any data on that date, then we'll respond with the message 'No token found'.

Then we'll check if user specified a token or not. If no, then we'll process and return the data of all token. If yes, then we'll compare if user has that token in their portfolio: if yes we'll continue the process, if not we'll respond with the message 'No token in portfolio'.

After processing all the input from user, before showing the final results, we'll call to CryptoCompare API to get the current exchange rates, and apply it to the result. The final response will has the information of the portfolio with token name, amount of that token, and the total value of that token in USD.

```bash
node portfolio --token eth --date 2019-10-25

Current exchange rates: { ETH: { USD: 2580.52 } }
Requested date: 2019-10-25
Latest Porfolio: Map(1) {
  'ETH' => { amount: 2.4294279999999997, USD: 6269.187542559999 }
}
```

## Structure of project

- **portfolio.js** contains main codes of the program
- **portfolio-services.js** contains logic and helper codes
- **cryptocompare-price.js** contains codes to interact with CryptoCompare API

## Packages

In additional of the standard **async** and **axios** packages, this project also utilised **commander** package (https://github.com/tj/commander.js) to easily make a CLI with options.

## Limitations

- Need more optimization and better technique to improve the speed of reading data from CSV file
- There might be some error/exception that hasn't been found/fixed during the development