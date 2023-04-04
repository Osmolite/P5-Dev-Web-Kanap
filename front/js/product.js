/**
 * Récupère l'Id et les informations du produit à afficher
 * @return { Promise }
 * @return { Promise.resolve<Object> } produitCourant - Objet contenant toutes 
 * les informations du produit à afficher
 */
async function lireProduitCourant() {
    const url= new URL(window.location.href);
    const id= url.searchParams.get("id");  
    const reponse = await fetch(`http://localhost:3000/api/products/${id}`);
    const produitCourant = await reponse.json();
    return produitCourant
}

/**
 * Affiche toutes les informations du produit désiré sur la page produit
 */
async function afficherProduitCourant() {
    const produitCourant = await lireProduitCourant();
    
    // Affichage de l'image
    const item_imgElement = document.querySelector(".item__img");
    const imageElement = document.createElement("img");
    imageElement.src = produitCourant.imageUrl;
    imageElement.alt = produitCourant.altTxt;
    item_imgElement.appendChild(imageElement);
    
    // Affichage du titre
    const titleElement = document.getElementById("title");
    titleElement.innerText = produitCourant.name;
    
    // Affichage du prix
    const prixElement = document.getElementById("price");
    prixElement.innerText = produitCourant.price;
    
    // Affichage de la description
    const descriptionElement = document.getElementById("description");
    descriptionElement.innerText = produitCourant.description;
    
    // Affichage des choix de couleurs
    const colorElement = document.getElementById("colors");   
    const colors = produitCourant.colors;
    for (const color of colors) {
        const option = document.createElement("option");
        option.text= color;
        option.value=color;
        colorElement.appendChild(option);
    }
    
}

/**
 * Récupère l'id, la couleur et la quantité pour l'affichage dans le panier
 * @return { Object } produit - Objet contenant toutes les informations 
 * pour l'affichage du produit dans le panier
 */
function recupererProduit() {
    const url= new URL(window.location.href);
    const id= url.searchParams.get("id"); 
    const color= document.getElementById("colors").value;
    const quantity= document.getElementById("quantity").value;
    produit={"id":id,"couleur":color,"quantite":quantity};
    return produit
}

/**
 * Limite visuellement la quantité du produit à 100 sur la page produit
 */
function verifierQuantiteAffichee() {
    if (document.getElementById("quantity").value > 100){
        document.getElementById("quantity").value = 100;
    }
}

/**
 * Ajoute le produit désiré au panier, si il est déjà présent, il incrémente juste la quantité
 * @param { Object } produit - Objet contenant l'id, la couleur et la quantité du produit désiré
 * @return { Array } produitsPanier - Tableau de tous les produits mis dans le panier par l'utilisateur
 */
function ajouterOuIncrementerProduit(produit) {
    //Ajout du nouveau produit ou incrémentation de la quantité (Max 100) du produit déjà existant dans le panier
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? [];
    let produitDejaExistant = false;
    //Parcours du tableau panier à la recherche du produit qu'on souhaite ajouter
    for (const produitDansPanier of produitsPanier) {
        console.log(produitsPanier);
        const quantiteNumeriqueProduit = parseInt(produit.quantite,10);
        const quantiteNumeriqueProduitPanier = parseInt(produitDansPanier.quantite,10);
        if (produit.couleur===produitDansPanier.couleur && produit.id===produitDansPanier.id){
            produitDansPanier.quantite = Math.min(
                quantiteNumeriqueProduit + quantiteNumeriqueProduitPanier,
                100
            );
            produitDejaExistant = true;
            break;
        }
    }
    //Le produit n'est pas présent dans le panier, on l'ajoute donc
    if (!produitDejaExistant) {
        produitsPanier.push(produit);
    }
    return produitsPanier
}

/**
 * Envoie des produits du panier dans le LocalStorage 
 * @param { Array } produitsPanier - Tableau de tous les produits mis dans le panier par l'utilisateur
 */
function enregistrerPanier(produitsPanier) {
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

/**
 * Met à jour le panier avec le nouveau produit désiré dès qu'elle est appelé 
 * avec le bouton ajouter au panier
 */
function ajouterAuPanier() {
    verifierQuantiteAffichee();
    const produit = recupererProduit();
    const produitsPanier = ajouterOuIncrementerProduit(produit);
    enregistrerPanier(produitsPanier);
    
}

afficherProduitCourant();

const boutonPanier = document.getElementById("addToCart");
//Evenement pour déclencher l'ajout au panier
boutonPanier.addEventListener(
    "click", 
    ajouterAuPanier
    );