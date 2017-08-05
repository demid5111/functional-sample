import {
    flow as _flow,
    keys as _keys,
    map as _map,
    partial as _partial,
    reduce as _reduce,
    sum as _sum,
} from 'lodash';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/of';

// ---------------------------------------------------------------------
// models
// ---------------------------------------------------------------------

class Product {
    price: number;

    constructor(price: number) {
        this.price = price;
    }
}

class Cart {
    products: Product[];

    constructor(products: Product[]) {
        this.products = products;
    }

    getProducts() {
        return this.products;
    }
}

class PriceRate {
    currencyName: string;
    value: number;

    constructor(name: string, v: number) {
        this.currencyName = name;
        this.value = v;
    }
}

class CartRates {
    rates: PriceRate[];

    constructor() {
        this.rates = []
    }

    addRate(rate: PriceRate) {
        this.rates.push(rate);
    }

    getRates() {
        return _reduce(this.rates, (acc, rate: PriceRate) => {
            acc[rate.currencyName] = rate.value;
            return acc;
        }, {});
    }
}

class ConversionRate {
    name: string;
    value: number;
}

class ConversionRates {
    rates: ConversionRate[];

    constructor(rates: ConversionRate[]) {
        this.rates = rates;
    }

    getRates() {
        return this.rates;
    }
}

// ---------------------------------------------------------------------
// preparations
// ---------------------------------------------------------------------

const originalCart = new Cart([new Product(20), new Product(45), new Product(67), new Product(1305)]);

// ---------------------------------------------------------------------
// retrieval logic
// ---------------------------------------------------------------------

const loadRates = (url: string): Observable<ConversionRates> => Observable.create(((observer) => {
    let xhr = new XMLHttpRequest();

    xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText) as ConversionRates;
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

const getPrice = (o: Product): number => o.price;
const getPrices = (cart: Cart): number[] => _map(cart.getProducts(), getPrice);

const calculateByRate = (curRates: ConversionRates, totalSum: number): CartRates =>
    _reduce(_keys(curRates), (acc: CartRates, key: string) => {
        acc.addRate(new PriceRate(key, curRates[key] * totalSum));
        return acc;
    }, new CartRates());

const calculateTotalCart = (cart: Cart, rates): CartRates =>
    _flow(
        getPrices,
        _sum,
        <Function>_partial(calculateByRate, rates)
    )(cart);

const getTotalCart = (cart: Cart, url: string): Observable<CartRates> =>
    loadRates(url)
        .flatMap((rates: ConversionRates) => Observable.of(calculateTotalCart(cart, rates)));

// ---------------------------------------------------------------------
// usage
// ---------------------------------------------------------------------

getTotalCart(originalCart, 'rates.json')
    .subscribe((data: CartRates) => console.log(data.getRates()));

