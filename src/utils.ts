// ---------------------------------------------------------------------
// imports
// ---------------------------------------------------------------------

import {
    flow as _flow,
    keys as _keys,
    map as _map,
    partial as _partial,
    reduce as _reduce,
    sum as _sum,
} from 'lodash';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

import {Cart, CartRates, ConversionRates, PriceRate, Product} from './models';

// ---------------------------------------------------------------------
// retrieval logic
// ---------------------------------------------------------------------

const loadRates = (url: string): Observable<ConversionRates> => Observable.create(((observer) => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            const data = JSON.parse(xhr.responseText);
            const rates = new ConversionRates();
            rates.fillRates(data);
            observer.next(rates);
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

export const calculateByRate = (curRates: ConversionRates, totalSum: number): CartRates =>
    _reduce(curRates.getCurrencies(),
        (acc: CartRates, key: string) => {
            acc.addRate(new PriceRate(key, curRates.getByName(key) * totalSum));
            return acc;
        }, new CartRates());

export const calculateTotalCart = (cart: Cart, rates: ConversionRates): CartRates =>
    _flow(
        (cart: Cart) => cart.getPrices(),
        _sum,
        <Function>_partial(calculateByRate, rates)
    )(cart);

export const getTotalCart = (cart: Cart, url: string): Observable<CartRates> =>
    loadRates(url)
        .flatMap((rates: ConversionRates) => {
    return Observable.of(calculateTotalCart(cart, rates))
        });
