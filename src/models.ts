// ---------------------------------------------------------------------
// imports
// ---------------------------------------------------------------------

import {
    find as _find,
    keys as _keys,
    map as _map,
    reduce as _reduce
} from 'lodash';

// ---------------------------------------------------------------------
// models
// ---------------------------------------------------------------------

export class Product {
    price: number;

    constructor(price: number) {
        this.price = price;
    }

    getPrice() {
        return this.price;
    }
}

export class Cart {
    products: Product[];

    constructor() {
        this.products = [];
    }

    getProducts() {
        return this.products;
    }

    fillSelectedCart(selectedCart) {
        this.products = _map(selectedCart, (el: any) => new Product(el.price))
    }

    getPrices(): number[] {
        return _map(this.getProducts(), (o: Product) => o.getPrice());
    }
}

export class PriceRate {
    currencyName: string;
    value: number;

    constructor(name: string, v: number) {
        this.currencyName = name;
        this.value = v;
    }
}

export class CartRates {
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

export class ConversionRate {
    name: string;
    value: number;

    constructor(n: string, v: number) {
        this.name = n;
        this.value = v;
    }
}

export class ConversionRates {
    rates: ConversionRate[];

    constructor() {
        this.rates = [];
    }

    getRates() {
        return this.rates;
    }

    getCurrencies() {
        return _map(this.rates, (el: ConversionRate) => el.name);
    }

    getByName(name: string) {
        return _find(this.rates, {name}).value;
    }

    fillRates(rates: any) {
        this.rates = _map(_keys(rates),
            (el) => new ConversionRate(el, rates[el]));
    }
}
