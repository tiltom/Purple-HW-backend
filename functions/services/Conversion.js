const config = require('../config/converter.json');
const utils = require('../utils');

exports.getListOfCurrencies = (json) => {
    const currencies = [];

    if (json.results) {
        Object.keys(json.results).forEach(key => currencies.push({
            value: json.results[key].id,
            label: json.results[key].currencyName
        }));
    }
    return currencies;
}

exports.currenciesEndpointUrl = `${config['convert_api_base_url']}${config['convert_api_currencies_list_endpoint']}?apiKey=${config['convert_api_key']}`;

exports.getConvertEndpointUrl = (sourceCurrency, destinationCurrency) => {
    const convertPair = `${sourceCurrency}_${destinationCurrency}`;
    const statisticsPair = `${sourceCurrency}_USD`;

    return `${config.convert_api_base_url}${config.convert_api_convert_endpoint}?q=${convertPair},${statisticsPair}&compact=ultra&apiKey=${config.convert_api_key}`;
}

exports.getConversionResult = (document, amount, sourceCurrency, destinationCurrency) => {
    const conversionValue = getConversionResult(document, amount, sourceCurrency, destinationCurrency);
    const conversionUsdValue = getConversionResult(document, amount, destinationCurrency, "USD");

    return { conversionValue: utils.roundToTwoDecimals(conversionValue), conversionUsdValue };
}

exports.validateConversion = (amount, sourceCurrency, destinationCurrency) => {
    if (isNaN(amount) || parseFloat(amount) <= 0)
        return false;

    if (sourceCurrency === '' || destinationCurrency === '')
        return false;

    return sourceCurrency !== destinationCurrency;
}

const getConversionResult = (document, amount, sourceCurrency, destinationCurrency) => {
    const convertPair = `${sourceCurrency}_${destinationCurrency}`;
    const convertRate = document[`${convertPair}`];
    return amount * convertRate;
}
