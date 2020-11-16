const firebaseService = require('./Firebase');
const db = firebaseService.db;
const statisticsConfig = require("../config/statistics.json");

exports.updateAllStatistics = (conversionUsdValue, baseCurrency) => {
    updateCurrencyConvertedUsdValue(conversionUsdValue, baseCurrency);
    updateTotalUsdConverted(conversionUsdValue);
    updateTotalConversions();
}

const updateCurrencyConvertedUsdValue = (conversionUsdValue, sourceCurrency) => {
    (async () => {
        const document = db.collection(statisticsConfig.most_converted_collection_path).doc(sourceCurrency);
        const item = await document.get();

        if (item.exists) {
            await document.update({
                totalInUsd: item.data().totalInUsd + conversionUsdValue
            });
        } else {
            await document.create({ totalInUsd: conversionUsdValue });
        }
    })()
}

const updateTotalUsdConverted = (conversionUsdValue) => {
    (async () => {
        const document = db.collection(statisticsConfig.total_usd_collection_path).doc(statisticsConfig.total_usd_document_path);
        const item = await document.get();

        if (item.exists) {
            await document.update({
                result: item.data().result + conversionUsdValue
            });
        } else {
            await document.create({ result: conversionUsdValue });
        }
    })()
}

const updateTotalConversions = () => {
    (async () => {
        const document = db.collection(statisticsConfig.total_conversions_collection_path).doc(statisticsConfig.total_conversions_document_path);
        const item = await document.get();

        if (item.exists) {
            await document.update({
                result: item.data().result + 1
            });
        } else {
            await document.create({ result: 1 });
        }
    })()
}
