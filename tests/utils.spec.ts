import {calculateByRate, calculateTotalCart} from '../src/utils';

import {expect} from 'chai';
import {Cart, CartRates, ConversionRates, PriceRate} from "../src/models";

describe('| utils test suite | ', () => {
    it('conversion test', () => {
        const rates = new ConversionRates();
        rates.fillRates({
            "rubles": 59.97,
            "euros": 0.85,
            "dollars": 1.0,
            "pounds": 0.77,
            "yens": 110.69
        });

        const exp = new CartRates();
        exp.addRate(new PriceRate("rubles", 599.7));
        exp.addRate(new PriceRate("euros", 8.5));
        exp.addRate(new PriceRate("dollars", 10));
        exp.addRate(new PriceRate("pounds", 7.7));
        exp.addRate(new PriceRate("yens", 1106.9));

        expect(calculateByRate(rates, 10)).to.eql(exp);
    });

    it('total calculation test', () => {
        const originalCart = [
            {price: 10},
            {price: 20},
            {price: 30},
            {price: 40}
        ];

        const rates = new ConversionRates();
        rates.fillRates({
            "rubles": 59.97,
            "euros": 0.85,
            "dollars": 1.0,
            "pounds": 0.77,
            "yens": 110.69
        });

        const cart = new Cart();
        cart.fillSelectedCart(originalCart);

        const exp = new CartRates();
        exp.addRate(new PriceRate("rubles", 5997));
        exp.addRate(new PriceRate("euros", 85));
        exp.addRate(new PriceRate("dollars", 100));
        exp.addRate(new PriceRate("pounds", 77));
        exp.addRate(new PriceRate("yens", 11069));

        expect(calculateTotalCart(cart, rates)).to.eql(exp);
    });
});
