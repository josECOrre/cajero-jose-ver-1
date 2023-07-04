import { getAccount,findAccount,showError,setAccounts } from "./functions";
const form = document.querySelector('.form');
const accounts = JSON.parse(localStorage.getItem("accounts")) || [];

form.addEventListener('submit', e => {
  e.preventDefault();
  const documentId = e.target.documentId.value || "";
  const password = e.target.password.value || "";

  getAccount(documentId)
    .then(response => {
      if(password !== response.passcode) showError("Contraseña Incorrecta");
      if(documentId === response.documentId && password === response.passcode) {
        if(accounts.length === 0) setAccounts(accounts, response);
        const existingAccount = findAccount(accounts, documentId);
        if(existingAccount) {
          localStorage.setItem("account", JSON.stringify(existingAccount));
          if(existingAccount.dealings) localStorage.setItem("dealings", JSON.stringify(existingAccount.dealings));
        } 
        else {
          setAccounts(accounts, response);
        }
        localStorage.setItem("isLogin", true);
        window.location.href = "./index"
      } 
    }).catch(err => showError(err))
});