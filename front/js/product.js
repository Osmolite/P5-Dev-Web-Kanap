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

    // Affichage du titre
    const prixElement = document.getElementById("price");
    prixElement.innerText = produitCourant.price;

    // Création d’une balise dédiée à un produit
    // const lienElement = document.createElement("a");
    // lienElement.href = `./product.html?id=${article._id}`;
    // const articleElement = document.createElement("article");
    
    // Création des balises 
    // const imageElement = document.createElement("img");
    // imageElement.src = article.imageUrl;
    // imageElement.alt = article.altTxt;
    // const nomElement = document.createElement("h3");
    // nomElement.classList.add("productName");
    // nomElement.innerText = article.name;
    // const descriptionElement = document.createElement("p");
    // descriptionElement.classList.add("productDescription");
    // descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";
    
    // On rattache la balise article a la section Fiches
    // sectionFiches.appendChild(lienElement);
    // lienElement.appendChild(articleElement);
    
    // articleElement.appendChild(nomElement);
    // articleElement.appendChild(descriptionElement);
}

afficherProduitCourant();