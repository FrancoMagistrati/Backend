class Product {
    constructor(title, description, price, thumbnail, code, stock) {
      this.title = title;
      this.description = description;
      this.price = price;
      this.thumbnail = thumbnail;
      this.code = code;
      this.stock = stock;
    }
  }
  
  class ProductManager {
    constructor() {
      this.products = [];
      this.nextId = 1; 
    }
  
    addProduct = (title, description, price, thumbnail, code, stock) => {
     
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son requeridos.");
        return;
      }
  
     
      for (const product of this.products) {
        if (product.code === code) {
          console.log("El producto tiene que tener un código unico.");
          return;
        }
      }
  
     
      const newProduct = new Product(
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );
      newProduct.id = this.nextId++;
      this.products.push(newProduct);
     
    }
  
    getProducts() {
      if(this.products.length === 0){
        console.log("No hay productos")
      }else{
        return this.products;
      }
  
    }
  
    getProductById(id) {
      
      const product = this.products.find((product) => product.id === id);
  
      if (!product) {
        console.log('El producto con el id:' +id + ' No fue encontrado');
  
      }
  
      return product;
    }
  }
  
  
  
  const CallProducts = new ProductManager();



  
  
  console.log(CallProducts.getProducts());
  
  //console.log(CallProducts.getProductById());