function recupererPanier() {
    //Récupération des produits dans le localStorage
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? []; //Si le panier est vide on renvoie un tableau vide
    return produitsPanier;
}

async function recupererInfosProduit(articleId) {
    //Récupération des informations sur un produit grâce à l'Id dans l'API
    const reponse = await fetch(`http://localhost:3000/api/products/${articleId}`);
    const infoProduit = await reponse.json();
    return infoProduit;
}

function enregistrerPanier(produitsPanier) {
    //Envoie du panier dans le localStorage
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

function verifierQuantiteModifiee(quantiteArticleCourant) {
    //Limitation de la quantité du produit à 100 si jamais on souhaite modifier la quantité
    if (quantiteArticleCourant.value > 100){
        quantiteArticleCourant.value = 100;
    }
}

async function mettreAJourTotaux(ancienneQuantite, nouvelleQuantite, articleId) {
    //Total d'articles et Prix total sont recalculés puis réaffichés
    quantiteTotale = document.getElementById("totalQuantity");
    //Recalcul de la quantité en passant toutes les valeurs en entier
    const variationQuantite = parseInt(nouvelleQuantite,10) - parseInt(ancienneQuantite,10)
    const nouveauTotalQuantite = parseInt(quantiteTotale.innerText,10) + variationQuantite;
    quantiteTotale.innerText = nouveauTotalQuantite;
    //Récupération des informations du produit ajouté grâce à l'Id
    const infoProduit = await recupererInfosProduit(articleId);
    //Recalcul du prix en fonction du prix et de la variation de quantité du produit modifié
    const differencePrix = infoProduit.price * variationQuantite;
    prixTotal = document.getElementById("totalPrice");
    prixTotal.innerText = parseInt(prixTotal.innerText,10) + differencePrix;
}

function modifierQuantite(quantiteArticleCourant) {
    //Modification de la quantité d'un produit dans le localStorage
    //Récupération de l'Id et de la couleur en remontant à la balise article
    const dataArticle= quantiteArticleCourant.closest('article');
    const produitsPanier = recupererPanier();
    let ancienneQuantite = 0;
    console.log(dataArticle.getAttribute("data-id"),
    dataArticle.getAttribute("data-color"),
    quantiteArticleCourant.value
    );
    //Parcours du panier à la recherche de l'article que l'on souhaite modifier
    for (const produitDansPanier of produitsPanier) {
        if (dataArticle.getAttribute("data-color")===produitDansPanier.couleur
        && dataArticle.getAttribute("data-id")===produitDansPanier.id){
            ancienneQuantite = produitDansPanier.quantite;
            produitDansPanier.quantite = Math.min(quantiteArticleCourant.value,100); 
            break;
        }
    }
    enregistrerPanier(produitsPanier);
    mettreAJourTotaux(ancienneQuantite, quantiteArticleCourant.value,dataArticle.getAttribute("data-id"))
}

function supprimerArticle(lienSupprimer) {
    //Récupération de l'Id et de la couleur en remontant à la balise article
    const dataArticle= lienSupprimer.closest('article');
    const produitsPanier = recupererPanier();
    let ancienneQuantite = 0;
    //Parcours du panier à la recherche de l'article que l'on souhaite modifier
    let indiceProduitASupprimer = -1;
    for (const produitIndice in produitsPanier) {
        const produitDansPanier = produitsPanier[produitIndice]; 
        if (dataArticle.getAttribute("data-color")===produitDansPanier.couleur
        && dataArticle.getAttribute("data-id")===produitDansPanier.id){
            indiceProduitASupprimer = produitIndice;
            ancienneQuantite = produitDansPanier.quantite; 
            break;
        }
        
    }
    if (indiceProduitASupprimer>=0) {
        produitsPanier.splice(indiceProduitASupprimer,1);
        dataArticle.remove();
    }
    enregistrerPanier(produitsPanier);
    mettreAJourTotaux(ancienneQuantite, 0,dataArticle.getAttribute("data-id"))
}

async function genererProduits() {
    //Génère chaque ligne du panier avec chaque produit, son prix, la quantité et la couleur
    const produits = recupererPanier();
    const sectionItems = document.getElementById("cart__items");
    let totalPrix = 0;
    let totalQuantite = 0;
    //Parcours du panier pour afficher chaque produit et ses informations
    for (let i = 0; i < produits.length; i++) {
        const article = produits[i];
        const infoProduit = await recupererInfosProduit(article.id);
        const articleItem = document.createElement("article");
        articleItem.classList.add("cart__item");
        articleItem.setAttribute("data-id",article.id);
        articleItem.setAttribute("data-color",article.couleur);
        
        const divImg = document.createElement("div");
        divImg.classList.add("cart__item__img");
        
        const imageCanape = document.createElement("img");
        imageCanape.src = infoProduit.imageUrl;
        imageCanape.alt = infoProduit.altTxt;
        
        const divContent = document.createElement("div");
        divContent.classList.add("cart__item__content");
        
        const divDescription= document.createElement("div");
        divDescription.classList.add("cart__item__content__description");
        
        const nomProduit = document.createElement("h2");
        nomProduit.innerText = infoProduit.name;
        const couleurProduit = document.createElement("p");
        couleurProduit.innerText = article.couleur;
        const prixProduit = document.createElement("p");
        prixProduit.innerText = `${infoProduit.price} €`;
        
        const divSettings= document.createElement("div");
        divSettings.classList.add("cart__item__content__settings");
        const divQuantity= document.createElement("div");
        divQuantity.classList.add("cart__item__content__settings__quantity");
        const libelleQuantiteProduit = document.createElement("p");
        libelleQuantiteProduit.innerText = "Qté : ";
        const quantiteProduit = document.createElement("input");
        quantiteProduit.classList.add("itemQuantity");
        quantiteProduit.type = "number";
        quantiteProduit.name = "itemQuantity";
        quantiteProduit.min = 1;
        quantiteProduit.max = 100;
        quantiteProduit.value = article.quantite;
        //Evenement permettant de modifier la quantité d'un produit
        quantiteProduit.addEventListener('change', function () {
            verifierQuantiteModifiee(this);
            modifierQuantite(this);
        });
        
        const divDelete= document.createElement("div");
        divDelete.classList.add("cart__item__content__settings__delete");
        const suppressionProduit = document.createElement("p");
        suppressionProduit.innerText = "Supprimer";
        //Evenement permettant de supprimer un produit du panier
        suppressionProduit.addEventListener('click', function () {
            supprimerArticle(this);
        });
        
        // On rattache les sous-elements a la section article
        sectionItems.appendChild(articleItem);
        articleItem.appendChild(divImg);
        divImg.appendChild(imageCanape);
        articleItem.appendChild(divContent);
        divContent.appendChild(divDescription);
        divDescription.appendChild(nomProduit);
        divDescription.appendChild(couleurProduit);
        divDescription.appendChild(prixProduit);
        articleItem.appendChild(divSettings);
        divSettings.appendChild(divQuantity);
        divQuantity.appendChild(libelleQuantiteProduit);
        divQuantity.appendChild(quantiteProduit);
        divSettings.appendChild(divDelete);
        divDelete.appendChild(suppressionProduit);
        
        totalPrix = totalPrix + infoProduit.price * article.quantite;
        const quantiteNumeriqueProduit = parseInt(article.quantite,10);
        totalQuantite = totalQuantite + quantiteNumeriqueProduit;
    }
    
    const totalQuantity = document.getElementById("totalQuantity");
    totalQuantity.innerText = totalQuantite;
    const totalPrice = document.getElementById("totalPrice");
    totalPrice.innerText = totalPrix; //.toLocaleString('fr-FR');
}

async function validerCommande() {
    const contact = {
    "firstName": document.getElementById("firstName").value,
    "lastName": document.getElementById("lastName").value,
    "address": document.getElementById("address").value,
    "city": document.getElementById("city").value,
    "email": document.getElementById("email").value
    }

    let filtreTexte = /^[a-zA-ZÀ-ÿ- ]{2,}$/;
    let filtreEmail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    let filtreAdresse = /^[A-Za-zÀ-ÿ0-9- ]{5,}$/;

    let contactOk = true;

    if(!filtreTexte.test(contact.firstName)){
        document.getElementById("firstNameErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    }
    if(!filtreTexte.test(contact.lastName)){
        document.getElementById("lastNameErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    }
    if(!filtreAdresse.test(contact.address)){
        document.getElementById("addressErrorMsg").innerText = "L'adresse n'est pas valide";
        contactOk = false;
    }
    if(!filtreTexte.test(contact.city)){
        document.getElementById("cityErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    }
    if(!filtreEmail.test(contact.email)){
        document.getElementById("emailErrorMsg").innerText = "L'adresse email n'est pas valide";
        contactOk = false;
    }
    console.log(contactOk);
    if(contactOk) {
        await passerCommande(contact);
    }
}

async function passerCommande(contact) {
    const products = [
        "107fb5b75607497b96722bda5b504926",
        "415b7cacb65d43b2b5c1ff70f3393ad1",
        "a557292fe5814ea2b15c6ef4bd73ed83"
    ];
    const data = {
        "contact": contact,
        "products": products
    }
    console.log(data);
    const reponse = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'}, 
        body: JSON.stringify(data)
      })
    const orderDetails= await reponse.json();
    console.log(orderDetails.orderId);
    window.location = `./confirmation.html?orderId=${orderDetails.orderId}`
}

genererProduits();

document.getElementById("order").type = "button";
const boutonCommander = document.getElementById("order");
boutonCommander.addEventListener('click', function () {
    validerCommande();
});