import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

class Cart {
  constructor(id) {
    this.id = id;
    this.products = [];
  }
}

class CartManager {
  constructor() {
    this.carts = [];
    this.cartFilePath = path.join(__dirname, '../../carrito.json');
  }

  createCart() {
    const cart = new Cart(crypto.randomUUID());
    this.carts.push(cart);
    return cart;
  }

  getCartById(id) {
    const cart = this.carts.find(carrito => carrito.id === id);
    if (cart) {
      return cart;
    } else {
      return false;
    }
  }

  addProduct(cid, pid) {
    const cart = this.getCartById(cid);
    const prodIndex = cart.products.findIndex(prod => prod.id === pid);

    if (prodIndex !== -1) {
      cart.products[prodIndex].quantity += 1;
    } else {
      cart.products.push({ id: pid, quantity: 1 });
    }

    
    fs.writeFileSync(this.cartFilePath, JSON.stringify(this.carts, null, 2), 'utf8');

    return true;
  }
}

export default CartManager;
