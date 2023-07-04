
import bankAccounts from "./data";

const MAX_BALANCE = 5000000;
const MIN_BALANCE = 100000;

export const findAccount = (arr, documentId) => arr.find(acc => acc.documentId === documentId);

export const getAccount = (documentId) => {
  const account = bankAccounts.find(acc => acc.documentId === documentId);

  const promise = new Promise((resolve, reject) => {
    (account) 
      ?resolve(account)
      : reject(`Account does not exist!`);
  })
  return promise;
}

export const showError = (message) => {
  const alert = document.querySelector(".error-alert");
  alert.classList.remove("none");
  document.querySelector(".error-msg").textContent = message;

  setTimeout(() => {
    alert.classList.add('none');
  }, 4000);      
}

export const insertCash = (obj, amount) => {
    if((obj.balance + amount) > MAX_BALANCE) return;
    
    obj.balance += amount;
    localStorage.setItem("account", JSON.stringify(obj));
    return true;
}

export const withdrawCash = (obj, amount) => {
    if((obj.balance - amount) < MIN_BALANCE) return;
    
    obj.balance -= amount;
    localStorage.setItem("account", JSON.stringify(obj));
    return true;
}

export const setAccounts = (arr, obj) => {
  arr.push(obj);
  localStorage.setItem("accounts", JSON.stringify(arr));  
  localStorage.setItem("account", JSON.stringify(obj));
}