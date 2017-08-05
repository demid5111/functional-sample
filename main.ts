import * as _ from 'lodash';

// ---------------------------------------------------------------------
// preparations
// ---------------------------------------------------------------------

const originalCart = [
    {
        price: 20
    },
    {
        price: 45
    },
    {
        price: 67
    },
    {
        price: 1305
    }
];

const currencyRates = {
    'rubles': 59.97,
    'euros': 0.85,
    'dollars': 1.0,
    'pounds': 0.77,
    'yens': 110.69
};

// ---------------------------------------------------------------------
// logic
// ---------------------------------------------------------------------

const getPrice = (o) => o.price;

const accumulateCart = (cart) => _.reduce(cart, (acc, el) => {
    acc += getPrice(el);
    return acc;
}, 0);

const calculateTotalCart = (totalSum, currencyRates) => _.reduce(_.keys(currencyRates), (acc, key) => {
    acc[key] = currencyRates[key] * totalSum;
    return acc;
}, {});

// ---------------------------------------------------------------------
//
// ---------------------------------------------------------------------

const res = calculateTotalCart(accumulateCart(originalCart), currencyRates);
console.log(res);



