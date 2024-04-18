import { productsData } from "./products.js";

const cartBtn = document.querySelector(".cart-btn"); //Cart Button
const cartModal = document.querySelector(".cart"); //Modal
const backDrop = document.querySelector(".backdrop"); // Backdrop
const closeModal = document.querySelector(".cart-item-confirm"); // Close Modal

const cartItems = document.querySelector(".cart-items"); //Number of Items
const cartTotal = document.querySelector(".cart-total"); //Cart total Price
const cartContent = document.querySelector(".cart-content"); // Items added to the Cart Modal
const productsDOM = document.querySelector(".products-center"); //Shop Items
const clearCartBtn = document.querySelector(".clear-cart"); //Cart Modal Clear Button

//* 1.Get Products
class Products {
  getProducts() {
    return productsData;
  }
}

//* 2.Display Products
class UI {
  displayProducts(products) {
    let results = "";
    products.forEach((product) => {
      results += `<div class="product">
      <div class="img-container">
        <img src=${product.imageUrl} class="product-img" />
      </div>
      <div class="product-desc">
        <p class="product-price">$ ${product.price}</p>
        <p class="product-title">${product.title}</p>
      </div>
      <button class="btn add-to-cart " data-id = ${product.id}>
        Add to Cart
      </button>
    </div>`;
    });
    productsDOM.innerHTML = results;
  }
}

//*3. Store the Products in Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products)) || [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const productsData = products.getProducts();
  const ui = new UI();
  ui.setupApp();
  ui.displayProducts(productsData);

  Storage.saveProducts(productsData);
});

function showModalFunction() {
  backDrop.style.display = "block";
  cartModal.style.opacity = 1;
  cartModal.style.top = "20%";
}

function closeModalFunction() {
  backDrop.style.display = "none";
  cartModal.style.opacity = 0;
  cartModal.style.top = "-100%";
}

cartBtn.addEventListener("click", showModalFunction);
closeModal.addEventListener("click", closeModalFunction);
backDrop.addEventListener("click", closeModalFunction);
