import { Router } from "express";
import fs from "fs";
import path from "path";

const cartRouter = Router();


function readProductsFromFile() {
  const productsData = fs.readFileSync(path.join(__dirname, "../../products.json"), "utf8");
  const products = JSON.parse(productsData);
  return products;
}


function readCartFromFile() {
  const cartData = fs.readFileSync(path.join(__dirname, "../../carrito.json"), "utf8");
  const cart = JSON.parse(cartData);
  return cart;
}


function writeCartToFile(cart) {
  const cartData = JSON.stringify(cart, null, 2);
  fs.writeFileSync(path.join(__dirname, "../../carrito.json"), cartData, "utf8");
}


cartRouter.post("/", (req, res) => {
  const cartId = generateUniqueId();
  const newCart = {
    id: cartId,
    products: []
  };

  const products = readProductsFromFile();


  newCart.products = products;

  writeCartToFile(newCart);

  res.send(newCart);
});

cartRouter.get("/:cid", (req, res) => {
  const { cid } = req.params;

  const cart = readCartFromFile();

  if (cart.id !== cid) {
    res.status(404).send("Carrito no encontrado");
    return;
  }

  res.send(cart.products);
});


cartRouter.post("/:cid/product/:pid", (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  const cart = readCartFromFile();

  if (cart.id !== cid) {
    res.status(404).send("Carrito no encontrado");
    return;
  }

  const existingProduct = cart.products.find(product => product.product === pid);

  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.products.push({
      product: pid,
      quantity: quantity
    });
  }


  writeCartToFile(cart);

  res.send(cart.products);
});



function generateUniqueId() {
  return Math.random().toString(36).substr(2, 9);
}

export default cartRouter;
