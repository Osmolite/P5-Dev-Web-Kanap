function lireOrderId() {
    //Récupération de l'Id du produit à afficher
    const url= new URL(window.location.href);
    const orderId= url.searchParams.get("orderId");
    return orderId;
}

const numeroCommande = document.getElementById("orderId");
numeroCommande.innerText = lireOrderId();