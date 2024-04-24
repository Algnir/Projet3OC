const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();

const porfolio = document.querySelector("#portfolio");//selection de la section portfolio//
const gallery = document.querySelector(".gallery"); //selection de la div gallery dans la section portfolio//


/*const buttonList = [Tous,Objets,Appartements,Hotels & Restaurants];*/

function genererWorks(works){ // fonction pour générer les photos dans la section portFolio à partir du serveur //
    for (let i = 0; i < works.length; i++) {
        const article = works[i];

        const figureElement = document.createElement("figure");//création de la balise <figure>

        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl; // création et ajout de l'image dans la balise <img>

        const nomElement = document.createElement("figcaption");
        nomElement.innerText = article.title;// création et ajout du titre dans la balise <figcaption>

        gallery.appendChild(figureElement);// On rattache la balise figure à la div gallery //
        
        figureElement.appendChild(imageElement);// On rattache la balise img à figure//
        figureElement.appendChild(nomElement);// On rattache la balise figcaption à figure//
    }

}

function genererFiltre(categories){
    const buttonElement = document.createElement("button");
    buttonElement.id = "0";
    buttonElement.innerText = "Tous";
    portfolio.insertBefore(buttonElement,gallery);

    for (let i = 0; i < categories.length; i++) {
        const item = categories[i];

        const buttonElement = document.createElement("button");
        buttonElement.id = item.id;
        buttonElement.innerText = item.name;


        portfolio.insertBefore(buttonElement,gallery);
    }


}
genererWorks(works);

genererFiltre(categories);
