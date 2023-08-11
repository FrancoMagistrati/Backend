import { promises as fs } from "fs";

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
    this.id = Product.incrementarId()
  }
  static incrementarId(){
      if(this.idIncrement){
        this.idIncrement++
      }else{
        this.idIncrement = 1
      }
      return this.idIncrement
  }
}


class ProductManager {
  constructor() {
    this.path = "./productos.json";
    this.nextId = 1;
  }

  async addProduct(product) {
    if (
      !product.title ||
      !product.description ||
      !product.price ||
      !product.thumbnail ||
      !product.code ||
      !product.stock
    ) {
      console.log("Todos los campos deben estar completos");
      return;
    }
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const productos = prods.find(
      (prod) =>
        prod.title === product.title &&
        prod.description === product.description &&
        prod.price === product.price &&
        prod.thumbnail === product.thumbnail &&
        prod.code === product.code &&
        prod.stock === product.stock
    );
    if (productos) {
      console.log("Producto ya fue agregado");
    } else {
  
      

      prods.push(product);
      await fs.writeFile(this.path, JSON.stringify(prods, null, 2));
    }
  }

  async getProducts() {
    await fs.access(this.path);
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    if (prods) {
      console.log(prods);
    } else {
      console.log("No hay productos");
    }
  }

  async getProductById(id) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const productos = prods.find((prod) => prod.id === id);
    if (productos) {
      console.log(productos);
    } else {
      console.log("Producto no encontrado");
    }
  }

  async deleteProduct(id) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const productos = prods.find((prod) => prod.id === id);
    if (productos) {
      await fs.writeFile(this.path, JSON.stringify(prods.filter((prod) => prod.id != id))
      );
    } else {
      console.log("Producto no encontrado");
    }
  }

  async updateProduct(id, product) {
    const prods = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const indice = prods.findIndex((prod) => prod.id === id);

    if (indice != -1) {
      prods[indice].title = product.title;
      prods[indice].description = product.description;
      prods[indice].price = product.price;
      prods[indice].thumbnail = product.thumbnail;
      prods[indice].code = product.code;
      prods[indice].stock = product.stock;
      await fs.writeFile(this.path, JSON.stringify(prods));
    } else {
      console.log("El producto no existe");
    }
  }
}
export default new ProductManager()

let producto = new Product("zapas", "nike", 100, "ABC123", 10, []);



let manager = new ProductManager();

