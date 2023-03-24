function recupererPanier() {
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? [];
    return produitsPanier;
}

async function recupererInfosProduit(articleId) {
    const reponse = await fetch(`http://localhost:3000/api/products/${articleId}`);
    const infoProduit = await reponse.json();
    return infoProduit;
}

function enregistrerPanier(produitsPanier) {
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

function verifierQuantiteModifiee(quantiteArticleCourant) {
    if (quantiteArticleCourant.value > 100){
        quantiteArticleCourant.value = 100;
    }
}

function mettreAJourQuantiteTotale(ancienneQuantite, nouvelleQuantite) {
    quantiteTotale = document.getElementById("totalQuantity");
    const nouveauTotalQuantite = parseInt(quantiteTotale.innerText,10) - parseInt(ancienneQuantite,10) + parseInt(nouvelleQuantite,10);
    console.log(nouveauTotalQuantite);
    quantiteTotale.innerText = nouveauTotalQuantite;
}

function mettreAJourPrixTotal(ancienneQuantite, nouvelleQuantite) {

}
function modifierQuantite(quantiteArticleCourant) {
    const dataArticle= quantiteArticleCourant.closest('article');
    const produitsPanier = recupererPanier();
    let ancienneQuantite = 0;
    console.log(dataArticle.getAttribute("data-id"),
    dataArticle.getAttribute("data-color"),
    quantiteArticleCourant.value
    );
    for (const produitDansPanier of produitsPanier) {
        if (dataArticle.getAttribute("data-color")===produitDansPanier.couleur
        && dataArticle.getAttribute("data-id")===produitDansPanier.id){
            ancienneQuantite = produitDansPanier.quantite;
            produitDansPanier.quantite = Math.min(quantiteArticleCourant.value,100); 
            break;
        }
    }
    enregistrerPanier(produitsPanier);
    mettreAJourQuantiteTotale(ancienneQuantite, quantiteArticleCourant.value)
}

function supprimerArticle() {
    
}

async function genererProduits() {
    const produits = recupererPanier();
    const sectionItems = document.getElementById("cart__items");
    let totalPrix = 0;
    let totalQuantite = 0;
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
        quantiteProduit.addEventListener('change', function () {
            verifierQuantiteModifiee(this);
            modifierQuantite(this);
        });
        
        const divDelete= document.createElement("div");
        divDelete.classList.add("cart__item__content__settings__delete");
        const suppressionProduit = document.createElement("p");
        suppressionProduit.innerText = "Supprimer";
        suppressionProduit.addEventListener('click', function () {
            console.log("élément supprimé")
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
    totalPrice.innerText = totalPrix.toLocaleString('fr-FR');
}
genererProduits();