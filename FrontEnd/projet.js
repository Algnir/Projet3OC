const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();

const porfolio = document.querySelector("#portfolio");//selection de la section portfolio//
const gallery = document.querySelector(".gallery"); //selection de la div gallery dans la section portfolio//
const footer = document.querySelector("footer");
const body = document.querySelector("body");


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

function genererFiltre(categories){;
    const buttonElement = document.createElement("button");
    buttonElement.id = "0";
    buttonElement.innerText = "Tous";
    portfolio.insertBefore(buttonElement,gallery);//création du boutton Tous//

    for (let i = 0; i < categories.length; i++) {//création des bouttons catégories//
        const item = categories[i];

        const buttonElement = document.createElement("button");
        buttonElement.id = item.id;
        buttonElement.innerText = item.name;


        portfolio.insertBefore(buttonElement,gallery);
    }


}
genererWorks(works);

genererFiltre(categories);


//fonction des boutons filtres//
const boutonTous = document.getElementById("0");
boutonTous.classList.add("clicked");// affichage de Tous par défaut//
boutonTous.addEventListener("click", function () {

    boutonTous.classList.add("clicked");v
    boutonAppartements.classList.remove("clicked");
    boutonObjets.classList.remove("clicked");
    boutonHotelsetRestaurants.classList.remove("clicked");

    gallery.innerHTML = "";//supression de la galerie sinon on aura les images d'avant qui se rajoute//
    genererWorks(works);//generation de la galleries//
});

const boutonObjets = document.getElementById("1");
boutonObjets.addEventListener("click", function () {

    boutonObjets.classList.add("clicked");// ajout de la class pour le css et supression pour les autres boutons//
    boutonAppartements.classList.remove("clicked");
    boutonTous.classList.remove("clicked");
    boutonHotelsetRestaurants.classList.remove("clicked");

    const objetsWorks = works.filter((work) => work.category.name == "Objets" )//création de la liste avec que objets//
    gallery.innerHTML = "";//supression de la galerie sinon on aura les images d'avant qui se rajoute//
    genererWorks(objetsWorks);//affichage de la nouvelle liste//
});

const boutonAppartements = document.getElementById("2");
boutonAppartements.addEventListener("click", function () {

    boutonAppartements.classList.add("clicked");// ajout de la class pour le css et supression pour les autres boutons//
    boutonTous.classList.remove("clicked");
    boutonObjets.classList.remove("clicked");
    boutonHotelsetRestaurants.classList.remove("clicked");

    const AppartementsWorks = works.filter((work) => work.category.name == "Appartements" )//création de la liste avec que appartements//
    gallery.innerHTML = "";//supression de la galerie sinon on aura les images d'avant qui se rajoute//
    genererWorks(AppartementsWorks);//affichage de la nouvelle liste//
});

const boutonHotelsetRestaurants = document.getElementById("3");
boutonHotelsetRestaurants.addEventListener("click", function () {

    boutonHotelsetRestaurants.classList.add("clicked");// ajout de la class pour le css et supression pour les autres boutons//
    boutonAppartements.classList.remove("clicked");
    boutonObjets.classList.remove("clicked");
    boutonTous.classList.remove("clicked");

    const HotelsetRestaurantsWorks = works.filter((work) => work.category.name == "Hotels & restaurants" )//création de la liste avec que hotels et restaurants//
    gallery.innerHTML = "";//supression de la galerie sinon on aura les images d'avant qui se rajoute//
    genererWorks(HotelsetRestaurantsWorks);//affichage de la nouvelle liste//
});



//page de login//

const login = document.getElementById("login");
const projet = document.getElementById("projet");
const contact = document.getElementById("pagecontact");
const main = document.getElementById("main");
const pageLogin = document.getElementById("pageLogin");
login.addEventListener("click", function (){
    main.classList.add("none");
    pageLogin.classList.remove("none");
})

projet.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
})

contact.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
})