function recupererPanier() {
    const panier = localStorage.getItem("Panier");
    const produitsPanier = JSON.parse(panier) ?? [];
    return produitsPanier;
}

async function recupererInfosProduit(articleId) {
    console.log(articleId);
    const reponse = await fetch(`http://localhost:3000/api/products/${articleId}`);
    const infoProduit = await reponse.json();
    return infoProduit;
}

async function genererProduits() {
    const produits = recupererPanier();
    const sectionItems = document.getElementById("cart__items");
    let totalPrix = 0;
    let totalQuantite = 0;
	for (let i = 0; i < produits.length; i++) {
		const article = produits[i];
        const infoProduit = await recupererInfosProduit(article.id);
        console.log(infoProduit);
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

        const divDelete= document.createElement("div");
        divDelete.classList.add("cart__item__content__settings__delete");
        const suppressionProduit = document.createElement("p");
        suppressionProduit.innerText = "Supprimer";
        // // Création d’une balise dédiée à un produit
        // const lienElement = document.createElement("a");
        // lienElement.href = `./product.html?id=${article._id}`;
		// const articleElement = document.createElement("article");

		// // Création des balises 
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
    console.log("Le prix total est de " + totalPrix + " €");
    console.log("Il y a " + totalQuantite + " articles dans le panier")
}
genererProduits();