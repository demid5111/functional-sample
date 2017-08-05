import {
    flow as _flow,
    keys as _keys,
    map as _map,
    partial as _partial,
    sum as _sum,
    reduce as _reduce
} from 'lodash';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

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

// ---------------------------------------------------------------------
// retrieval logic
// ---------------------------------------------------------------------

const loadRates = (url: string) => Observable.create(((observer) => {
        let xhr = new XMLHttpRequest();

        xhr.addEventListener('load', () => {
            if (xhr.status === 200) {
                let data = JSON.parse(xhr.responseText);
                observer.next(data);
                observer.complete();
            } else {
                observer.error(xhr.statusText);
            }
        });

        xhr.open('GET', url);
        xhr.send();
    }));

// ---------------------------------------------------------------------
// calculation logic
// ---------------------------------------------------------------------

const getPrice = (o) => o.price;
const getPrices = (cart) => _map(cart, getPrice);

const calculateTotal = (curRates, totalSum) => _reduce(_keys(curRates), (acc, key) => {
    acc[key] = curRates[key] * totalSum;
    return acc;
}, {});

const calculateTotalCart = (cart, rates) => _flow(
    getPrices,
    _sum,
    <Function>_partial(calculateTotal, rates)
)(cart);

const getTotalCart = (cart, url: string) => loadRates(url)
    .flatMap((rates) => Observable.of(calculateTotalCart(cart, rates)));

// ---------------------------------------------------------------------
// usage
// ---------------------------------------------------------------------

getTotalCart(originalCart, 'rates.json')
    .subscribe((data) => console.log(data));

