// ---------------------------------------------------------------------
// imports
// ---------------------------------------------------------------------

import {getTotalCart} from './utils';
import {Cart, CartRates} from './models';

// ---------------------------------------------------------------------
// preparations
// ---------------------------------------------------------------------

const originalCart = [
    {price: 20},
    {price: 45},
    {price: 67},
    {price: 1305}
];

const cart = new Cart();
cart.fillSelectedCart(originalCart);

// ---------------------------------------------------------------------
// usage
// ---------------------------------------------------------------------

getTotalCart(cart, 'rates.json')
    .subscribe((data: CartRates) => console.log(data.getRates()));
