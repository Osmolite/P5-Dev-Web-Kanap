async function lireProduitCourant() {
    const url= new URL(window.location.href);
    const id= url.searchParams.get("id");    
    const reponse = await fetch(`http://localhost:3000/api/products/${id}`);
    const produitCourant = await reponse.json();
    return produitCourant
}

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
    
    // Affichage des choix de couleur
    const colorElement = document.getElementById("colors");   
    const colors = produitCourant.colors;
    for (const color of colors) {
        const option = document.createElement("option");
        option.text= color;
        option.value=color;
        colorElement.appendChild(option);
    }
    
}

function recupererProduit() {
    const url= new URL(window.location.href);
    const id= url.searchParams.get("id"); 
    const color= document.getElementById("colors").value;
    const quantity= document.getElementById("quantity").value;
    produit={"id":id,"couleur":color,"quantite":quantity};
    return produit
}

function ajouterOuIncrementerProduit(produit) {
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? [];
    let produitDejaExistant = false;
    for (const produitDansPanier of produitsPanier) {
        console.log(produitsPanier);
        const quantiteNumeriqueProduit = parseInt(produit.quantite,10);
        const quantiteNumeriqueProduitPanier = parseInt(produitDansPanier.quantite,10);
        if (produit.couleur===produitDansPanier.couleur && produit.id===produitDansPanier.id){
            produitDansPanier.quantite = quantiteNumeriqueProduit + quantiteNumeriqueProduitPanier;
            produitDejaExistant = true;
            break;
        }
    }
    if (!produitDejaExistant) {
        produitsPanier.push(produit);
    }
    return produitsPanier
}

function enregistrerPanier(produitsPanier) {
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

function ajouterAuPanier() {
    const produit = recupererProduit();
    const produitsPanier = ajouterOuIncrementerProduit(produit);
    enregistrerPanier(produitsPanier);
}

afficherProduitCourant();

const boutonPanier = document.getElementById("addToCart");

boutonPanier.addEventListener(
    "click", 
    ajouterAuPanier
    );