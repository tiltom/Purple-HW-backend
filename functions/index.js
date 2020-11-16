const functions = require('firebase-functions');
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
const utils = require('./utils');
const firebaseService = require('./services/Firebase');
const db = firebaseService.db;
const conversionService = require('./services/Conversion');
const statisticsService = require('./services/Statistics');
const statisticsConfig = require('./config/statistics.json');

app.get('/api/currencies', (req, res) => {
    (async () => {
        try {
            const response = await fetch(conversionService.currenciesEndpointUrl)
            const json = await response.json();

            return res.status(200).send(conversionService.getListOfCurrencies(json));
        } catch (error) {
            console.log(error);
            return res.status(500).send(error);
        }
    })();
});

app.post('/api/convert', (req, res) => {
    (async () => {
        try {
            const { amount, from, to } = req.body;
            const validationResult = conversionService.validateConversion(amount, from, to);

            if (!validationResult) {
                return res.status(500).send({ error: 'Input validation failed' });
            }

            const response = await fetch(conversionService.getConvertEndpointUrl(from, to))
            const json = await response.json();
            console.log(validationResult);

            const result = conversionService.getConversionResult(json, amount, from, to);

            statisticsService.updateAllStatistics(result.conversionUsdValue, to);

            return res.status(200).send({ result: result.conversionValue });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/statistics/total-usd', (req, res) => {
    (async () => {
        try {
            const document = db.collection(statisticsConfig.total_usd_collection_path).doc(statisticsConfig.total_usd_document_path);
            const item = await document.get();
            const response = item.data();

            return res.status(200).send({ result: utils.roundToTwoDecimals(response.result) });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/statistics/most-converted', (req, res) => {
    (async () => {
        try {
            const document = db.collection(statisticsConfig.most_converted_collection_path).orderBy(statisticsConfig.total_usd_result_field, "desc").limit(1);
            const items = await document.get();
            const item = items.docs[0];

            const response = item ?
                { currency: item.id, totalUsd: item.data().totalInUsd } :
                { currency: '', totalUsd: '' };

            return res.status(200).send(response);
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

app.get('/api/statistics/conversion-requests', (req, res) => {
    (async () => {
        try {
            const document = db.collection(statisticsConfig.total_conversions_collection_path).doc(statisticsConfig.total_conversions_document_path);
            const item = await document.get();
            const response = item.data();

            return res.status(200).send({ result: response.result });
        } catch (error) {
            return res.status(500).send(error);
        }
    })();
});

exports.app = functions.https.onRequest(app);
