
async function lireListeProduits() {
	//Récupération des données dans l'API
    const reponse = await fetch("http://localhost:3000/api/products");
    const produits = await reponse.json();
    return produits
}

async function genererProduits() {
	//Création des fiches produits
    const produits = await lireListeProduits();
	for (let i = 0; i < produits.length; i++) {
		const article = produits[i];

		// Récupération de l'élément du DOM qui accueillera les fiches
		const sectionFiches = document.querySelector(".items");

		// Création d’une balise dédiée à un produit
        const lienElement = document.createElement("a");
        lienElement.href = `./product.html?id=${article._id}`;
		const articleElement = document.createElement("article");

		// Création des balises 
		const imageElement = document.createElement("img");
		imageElement.src = article.imageUrl;
		imageElement.alt = article.altTxt;
		const nomElement = document.createElement("h3");
		nomElement.classList.add("productName");
		nomElement.innerText = article.name;
		const descriptionElement = document.createElement("p");
        descriptionElement.classList.add("productDescription");
		descriptionElement.innerText = article.description ?? "Pas de description pour le moment.";

		// On rattache les balises à la section Fiches
        sectionFiches.appendChild(lienElement);
        lienElement.appendChild(articleElement);
		articleElement.appendChild(imageElement);
		articleElement.appendChild(nomElement);
		articleElement.appendChild(descriptionElement);
	}
}

genererProduits();