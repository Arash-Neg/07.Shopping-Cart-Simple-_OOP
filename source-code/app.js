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
