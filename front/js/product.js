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

function ajouterProduitPanier(produit) {
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier);
    produitsPanier.push(produit);
    console.log(produitsPanier);
    return produitsPanier
}

function stockageProduit() {
    produit = recupererProduit();
    const produitsPanier = ajouterProduitPanier(produit);
    const panier = JSON.stringify(produitsPanier);
    localStorage.setItem("Panier", panier);
}

afficherProduitCourant();

const boutonPanier = document.getElementById("addToCart");

boutonPanier.addEventListener(
    "click", 
    stockageProduit
    );