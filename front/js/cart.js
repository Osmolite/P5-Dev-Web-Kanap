/**
 * Récupère le tableau des produits désirés dans le LocalStorage
 * @return { Array } produitsPanier - Tableau de tous les produits mis dans le panier par l'utilisateur
 */
function recupererPanier() {
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? []; 
    //Si le panier est vide on renvoie un tableau vide
    return produitsPanier;
}

/**
 * Récupère les informations d'un produit dans l'API grâce à l'Id
 * @param { String } articleId - Id du produit dont on souhaite récupérer les informations
 * @return { Object } infoProduit - Objet contenant les informations sur le produit 
 * dont l'Id est en paramètre
 */
async function recupererInfosProduit(articleId) {
    const reponse = await fetch(`http://localhost:3000/api/products/${articleId}`);
    const infoProduit = await reponse.json();
    return infoProduit;
}

/**
 * Envoie des informations du panier dans le LocalStorage
 * @param { Array } produitsPanier - Tableau de tous les produits mis dans le panier par l'utilisateur
 */
function enregistrerPanier(produitsPanier) {
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

/**
 * Limite la quantité modifiée sur un article du panier à 100
 * @param { Input.<Number> } quantiteArticleCourant - La nouvelle quantité désirée par l'utilisateur
 */
function verifierQuantiteModifiee(quantiteArticleCourant) {
    if (quantiteArticleCourant.value > 100){
        quantiteArticleCourant.value = 100;
    }
}

/**
 * Recalcul à chaque modification du panier le prix total et le nombre d'articles total
 * @param { (Integer | String | Number) } ancienneQuantite - Ancienne quantité du produit avant modification
 * @param { (Integer | String | Number) } nouvelleQuantite - Nouvelle quantité du produit après modification
 * de l'utilisateur
 * @param { String } articleId - Id du produit qui est entrain d'être modifié dans le panier
 */
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

/**
 * Mis à jour de la quantité du produit modifié du panier dans le LocalStorage
 * @param { Input.<Number> } quantiteArticleCourant - Nouvelle quantité du produit après modification 
 * par l'utilisateur
 */
function modifierQuantite(quantiteArticleCourant) {
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
            if (quantiteArticleCourant.value <= 0) {
                quantiteArticleCourant.value = 1;
            }
            produitDansPanier.quantite = Math.min(quantiteArticleCourant.value,100);
            break;
        }
    }
    enregistrerPanier(produitsPanier);
    mettreAJourTotaux(ancienneQuantite, quantiteArticleCourant.value,dataArticle.getAttribute("data-id"))
}

/**
 * Supprimer l'article souhaité dans le panier et le LocalStorage
 * @param { HTMLParagraphElement } lienSupprimer - Lien qui déclenche l'appel de 
 * la fonction lorsqu'on clique dessus
 */
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

/**
 * Génère l'affichage de produits du panier et des totaux
 */
async function genererProduits() {
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
    totalPrice.innerText = totalPrix;
}

/**
 * Vérifie l'exactitude des données du formulaire de commande puis appel la fonction 
 * passerCommande si le formulaire est juste
 */
async function validerCommande() {
    const contact = {
    "firstName": document.getElementById("firstName").value,
    "lastName": document.getElementById("lastName").value,
    "address": document.getElementById("address").value,
    "city": document.getElementById("city").value,
    "email": document.getElementById("email").value
    }
    //Utilisation d'expressions Regex pour filtrer le formulaire
    let filtreTexte = /^[a-zA-ZÀ-ÿ- ]{2,}$/;
    let filtreEmail = /^[A-Za-z0-9](([_\.\-]?[a-zA-Z0-9]+)*)@([A-Za-z0-9]+)(([_\.\-]?[a-zA-Z0-9]+)*)\.([A-Za-z]{2,})$/;
    let filtreAdresse = /^[A-Za-zÀ-ÿ0-9- ]{5,}$/;

    let contactOk = true;

    if (!filtreTexte.test(contact.firstName)){
        document.getElementById("firstNameErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    } else {
        document.getElementById("firstNameErrorMsg").innerText = "";
    }
    if (!filtreTexte.test(contact.lastName)){
        document.getElementById("lastNameErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    } else {
        document.getElementById("lastNameErrorMsg").innerText = "";
    }
    if (!filtreAdresse.test(contact.address)){
        document.getElementById("addressErrorMsg").innerText = "L'adresse n'est pas valide";
        contactOk = false;
    } else {
        document.getElementById("addressErrorMsg").innerText = "";
    }
    if (!filtreTexte.test(contact.city)){
        document.getElementById("cityErrorMsg").innerText = "Le champ n'est pas valide";
        contactOk = false;
    } else {
        document.getElementById("cityErrorMsg").innerText = "";
    }
    if (!filtreEmail.test(contact.email)){
        document.getElementById("emailErrorMsg").innerText = "L'adresse email n'est pas valide";
        contactOk = false;
    } else {
        document.getElementById("emailErrorMsg").innerText = "";
    }
    console.log(contactOk);
    if (contactOk) {
        await passerCommande(contact);
    }
}

/**
 * Renvoie le numéro de commande et redirige l'utilisateur sur la page confirmation
 * @param { Object } contact - Object contenant toutes les informations du formulaire de commande
 */
async function passerCommande(contact) {
    const products = recupererListeIdsPanier();
    const data = {
        "contact": contact,
        "products": products
    }
    const reponse = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        headers: {'Content-Type': 'application/json;charset=utf-8'}, 
        body: JSON.stringify(data)
      })
    const orderDetails= await reponse.json();
    window.location = `./confirmation.html?orderId=${orderDetails.orderId}`
    console.log(orderDetails);
}

/**
 * Crée et renvoie le tableau des Ids des produits dans le panier
 * @return { Array } listeIdsPanier - Tableau des Ids des produits du panier
 */
function recupererListeIdsPanier () {
    const produitsPanier = recupererPanier();
    let listeIdsPanier = [];
    produitsPanier.forEach(element => listeIdsPanier.push(element.id));
    console.log(listeIdsPanier);
    return listeIdsPanier;
}
genererProduits();

document.getElementById("order").type = "button";
const boutonCommander = document.getElementById("order");
//Evenement sur le bouton Commander permettant de lancer la vérification du formulaire
boutonCommander.addEventListener('click', function () {
    validerCommande();
});