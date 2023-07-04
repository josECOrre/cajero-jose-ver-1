import { insertCash,withdrawCash,showError } from "./functions";

const date = new Date();
const nfCo = new Intl.NumberFormat('es-Co');
const dealings = JSON.parse(localStorage.getItem('dealings')) || [];
const accounts = JSON.parse(localStorage.getItem('accounts'));
const userData = JSON.parse(localStorage.getItem('account'));
const isLogin = localStorage.getItem("isLogin");

// DOM VARIABLES
const fragment = document.createDocumentFragment();
const template = document.querySelector(".dealing-template").content;
const modal = document.querySelector(".modal");
let formTitle = document.querySelector(".form-title");
const formTransaction = document.querySelector(".form-transaction");
const dealingContent = document.querySelector(".dealing-empty");
const receipt = document.querySelector(".receipt");
const receiptContent = document.querySelector(".receipt-content");

document.addEventListener("DOMContentLoaded", e => {
  if(!isLogin) window.location.href = "login.html";
  document.querySelector(".current-year").textContent = date.getFullYear();

  if(dealings.length === 0) dealingContent.textContent = "Aún no tienes movimientos.";
  else dealingContent.classList.add("none");

  if(userData) {
    document.querySelector('.number-account').textContent = userData.numberAccount;
    document.querySelector('.user-account').textContent = userData.owner;
  }

  if(userData.dealings) {
    userData.dealings.slice(0, 10).forEach((el) => {
      template.querySelector(".date").textContent = `${el.date} a las: ${el.hour}`;
      
      if(el.type === "insert") {
        template.querySelector(".icon").classList.add("bx-money");
        template.querySelector(".type-transaction").textContent = "Ingreso de dinero.";
        template.querySelector(".amount").textContent = `+$ ${nfCo.format(el.amount)}`;
      };
  
      if(el.type === "withdraw") {
        const icon = template.querySelector(".icon");
        icon.classList.remove("bx-money");
        icon.classList.add("bx-money-withdraw");
        template.querySelector(".type-transaction").textContent = "Retiro de dinero.";
        template.querySelector(".amount").textContent = `-$ ${nfCo.format(el.amount)}`;
      };
  
      let clone = document.importNode(template, true);
      fragment.appendChild(clone);
    })
    document.querySelector(".dealing-cards").appendChild(fragment);
  } 
  else {
    dealingContent.textContent = "Aún no tienes movimientos.";
  }
})

document.addEventListener('click', e => {
  let validTransaction ;
  let typeTransaction;

  if(e.target.matches(".open-modal")) {
    e.preventDefault();
    modal.classList.remove("none");

    const dealing = {
      date: date.toLocaleDateString(),
      hour: date.toLocaleTimeString(),
      type: "insert"
    };

    if(e.target.matches(".insert")) {
      formTitle.textContent = "Ingresar Dinero";
      typeTransaction = "insert";
    }
    if(e.target.matches(".withdraw")) {
      formTitle.textContent = "Retirar Dinero";
      typeTransaction = "withdraw";
    }

    // Submit Event
    formTransaction.addEventListener("submit", e => {
      e.preventDefault();
      let amount = formTransaction.querySelector("input[name='amount']").value;
      const passcode = formTransaction.querySelector("input[name='passcode']");
      const btnTransaction = document.querySelector("#btn-transaction");
      const loader =  document.querySelector(".form-loader");

      if(isNaN(amount)) showError("El valor debe ser un numero.")
      else amount = Number(amount);

      //Load spinning
      loader.classList.remove("none");
      btnTransaction.classList.add("none");

      setTimeout(() => {
        if(passcode.value === userData.passcode) {
          if(typeTransaction === "insert") {
            validTransaction = insertCash(userData, amount);
            receiptContent.querySelector(".receipt-type").textContent = "Ingreso de dinero";
          };

          if(typeTransaction === "withdraw") {
            validTransaction = withdrawCash(userData, amount);
            receiptContent.querySelector(".receipt-type").textContent = "Retiro de dinero";
            dealing.type = "withdraw";         
          } 

          if(validTransaction) {
            //Set and save a dealing into localStorage
            dealing.amount = amount;
            dealings.unshift(dealing);
            localStorage.setItem("dealings", JSON.stringify(dealings));
            userData.dealings = JSON.parse(localStorage.getItem('dealings'));
            localStorage.setItem("account", JSON.stringify(userData)); 

            // Get index to the current account into localstorage accounts, then update that position whit realized dealings
            const found = accounts.findIndex(el => el.documentId === userData.documentId);
            accounts[found] = JSON.parse(localStorage.getItem("account"));
            localStorage.setItem("accounts", JSON.stringify(accounts));

            receiptContent.querySelector(".receipt-date").textContent = `${dealing.date} - ${dealing.hour}`;
            receiptContent.querySelector(".receipt-amount").textContent = `$ ${nfCo.format(amount)}`;
            modal.classList.add("none");
            receipt.classList.remove("none");

            setTimeout(() => {
              location.reload();
            }, 4000)     
          } 
          else {
            if(typeTransaction === "insert") {
              showError(`El valor ingresado supera el máximo permitido.`);
              formTransaction.reset();
            }
            else {
              showError(`El saldo es insuficiente.`);
              formTransaction.reset();
            };
            formTransaction.reset();
          }
        } 
        else {
          showError("Clave Errada.");
          formTransaction.reset();
        }
        btnTransaction.classList.remove("none");
        loader.classList.add("none");
      }, 3000);
    })
  }

  if(e.target.matches(".show-balance")) {
    document.querySelector(".balance-account").textContent = `$ ${nfCo.format(userData.balance)}`;
    e.target.classList.add("none");
    document.querySelector(".close-balance").classList.remove("none"); 
  }

  if(e.target.matches(".close-balance")) {
    document.querySelector(".balance-account").textContent = "$ ****";
    e.target.classList.add("none");
    document.querySelector(".show-balance").classList.remove("none"); 
  }

  if(e.target.matches(".close-modal") || e.target.matches(".modal")) {
    e.preventDefault();
    formTransaction.reset();
    modal.classList.add("none");
  };

  if(e.target.matches(".logout")) {
    document.querySelector(".modal-logout").classList.remove("none");
  }

  if(e.target.matches(".btn-cancel")) {
    document.querySelector(".modal-logout").classList.add("none");
  }

  if(e.target.matches(".btn-confirm")) {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("account");
    localStorage.removeItem("dealings");
    location.reload();
  }
})