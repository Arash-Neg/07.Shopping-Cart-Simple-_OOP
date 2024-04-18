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
  
  addToCartBtns() {
    cartButtons = [...document.querySelectorAll(".add-to-cart")];
    cartButtons.forEach((btn) => {
      //get all buttons id after rendering to the DOM
      const btnIds = Number(btn.dataset.id);

      //item validation by ID
      const isInCart = cart.find((p) => p.id === btnIds);
      if (isInCart) {
        btn.textContent = "Added";
        btn.disabled = true;
        btn.blur();
      }

      btn.addEventListener("click", (event) => {
        event.target.textContent = "Added";
        event.target.disabled = true;
        event.target.blur();

        //get the product using id
        const productsAdded = {
          ...Storage.getProductsById(Number(btnIds)), //OR - event.target.dataset.id
          quantity: 1,
        };

        //add to cart
        cart = [...cart, productsAdded];

        //save to local storage
        Storage.saveCart(cart);

        //update cart value
        this.setCartValue(cart);

        //add cart item
        this.addCartItems(productsAdded);
      });
    });
  }
}

//*3. Store the Products in Local Storage
class Storage {
  static saveProducts(products) {
    localStorage.setItem("Products", JSON.stringify(products)) || [];
  }

  static getProductsById(id) {
    const _products = JSON.parse(localStorage.getItem("Products"));
    return _products.find((p) => p.id === id); //returns an object
  }

  static saveCart(cart) {
    localStorage.setItem("CartItems", JSON.stringify(cart)) || [];
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
