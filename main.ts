import {
    flow as _flow,
    keys as _keys,
    map as _map,
    partial as _partial,
    sum as _sum,
    reduce as _reduce
} from 'lodash';

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
const getPrices = (cart) => _map(cart, getPrice);

const calculateTotal = (curRates, totalSum) => _reduce(_keys(curRates), (acc, key) => {
    acc[key] = curRates[key] * totalSum;
    return acc;
}, {});

const getTotalCart = (cart) =>
    _flow(
        getPrices,
        _sum,
        <Function>_partial(calculateTotal, currencyRates)
    )(cart);
// ---------------------------------------------------------------------
// usage
// ---------------------------------------------------------------------

console.log(getTotalCart(originalCart));
