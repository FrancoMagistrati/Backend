const form = document.getElementById("idForm");
const productsTable = document.getElementById("tableBody");
const socket = io();

socket.emit('loadProducts');

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const product = Object.fromEntries(formData)
    socket.emit('addProduct', product);
    e.target.reset();
})

socket.on('product', (product) => {
    let productHtml = "";
    product.forEach(prod => {
        productHtml += `<tr id='row-${prod.id}'>
        <td>${prod.title}</td>
        <td>${prod.description}</td>
        <td>${prod.price}</td>
        <td>${prod.thumbnail}</td>
        <td>${prod.code}</td>
        <td>${prod.stock}</td>
       </tr> `
    });
    productsTable.innerHTML = productHtml;
});