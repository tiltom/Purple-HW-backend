# Purple-HW-backend
This repository contains backend for currency converter (Purple interview assignment).

## Notes to the solution
* The code uses Firebase and Firestore, however, it couldn't be hosted there with a free plan so you need to run it locally. Just `cd` into `functions` folder and type `npm run serve` in your favorite terminal.
* I decided to use https://www.currencyconverterapi.com/ for the currency rates. Unfortunately (as all of the similar products I've seen) it has certain limitations so you will need to generate your own API key.
You can make **100 API calls per hour** with it and you can generate it by visiting https://free.currencyconverterapi.com/free-api-key and entering an email (mailinator email is sufficient).
You can use it in the app by modifying `convert_api_key` in `config/converter.json`.
