exports.roundToTwoDecimals = (originalValue) => Math.round((originalValue + Number.EPSILON) * 100) / 100
