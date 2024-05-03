//Requete récup des travaux//
const reponse = await fetch("http://localhost:5678/api/works");
const works = await reponse.json();

//Requete récup des catégories//
const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();

connexion();


// Récupération des éléments //
const porfolio = document.querySelector("#portfolio");//selection de la section portfolio//
const gallery = document.querySelector(".gallery"); //selection de la div gallery dans la section portfolio//
const footer = document.querySelector("footer");
const body = document.querySelector("body");
const divFiltres = document.querySelector(".filtres");
const login = document.getElementById("login");
const boutonModifier = document.getElementById("modifier");


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
    divFiltres.appendChild(buttonElement);//création du boutton Tous//

    for (let i = 0; i < categories.length; i++) {//création des bouttons catégories//
        const item = categories[i];

        const buttonElement = document.createElement("button");
        buttonElement.id = item.id;
        buttonElement.innerText = item.name;


        divFiltres.appendChild(buttonElement);
    }
    if (login.innerText == "logout"){
        divFiltres.classList.add("none");
    }
}
genererWorks(works);

genererFiltre(categories);




//fonction des boutons filtres//


const boutonTous = document.getElementById("0");
boutonTous.classList.add("clicked");// affichage de Tous par défaut//
boutonTous.addEventListener("click", function () {

    boutonTous.classList.add("clicked");
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
//récupération des éléments page de connexion//

const projet = document.getElementById("projet");
const contact = document.getElementById("pagecontact");
const main = document.getElementById("main");
const pageLogin = document.getElementById("pageLogin");


//Action des li de la navbar//

login.addEventListener("click", function (){
    if(login.innerText == "login"){
    main.classList.add("none");
    pageLogin.classList.remove("none");
    }else {
        logout();
        login.innerText = "login";
        divFiltres.classList.remove("none");
        boutonModifier.classList.add("none");
    }
})

projet.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
})

contact.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
})

if ((window.localStorage.getItem("token") !== 'undefined') && (window.localStorage.getItem("token") !== null)){
    login.innerText = "logout";
    divFiltres.classList.add("none");
    boutonModifier.classList.remove("none");
}

//Fonction envoye du formulaire pour connexion et récupération de l'userId et du token//
export function connexion() {
    const formulaireLogin = document.querySelector("#formulaireLogin");
    formulaireLogin.addEventListener("submit", function (event) {
        event.preventDefault()
        const email = event.target.querySelector("#emailLogin");
        const password = event.target.querySelector("#mdp");
        const Users = {
            "email": email.value,
            "password": password.value,
        };
        const chargeUtile = JSON.stringify(Users);
        fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body : chargeUtile
        }).then(reponse =>reponse.json())
        .then(login => {
            window.localStorage.setItem("token",login.token);
            window.localStorage.setItem("userId",login.userId);
            if (window.localStorage.getItem("token") !== 'undefined') {
                const login = document.getElementById("login");
                login.innerText = "logout";
                main.classList.remove("none");
                pageLogin.classList.add("none");
                const divFiltres = document.querySelector(".filtres");
                divFiltres.classList.add("none");
                boutonModifier.classList.remove("none");
            }
            else {
                alert("E-mail ou mdp incorrect");
            }
        
        })
    })
} 


function logout () {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
}


//popup modif//

const popup = document.getElementById("popup-overlay");
const popupAjout = document.getElementById("popup-ajout");
const popupSupprimer = document.getElementById("popup-supprimer");

const boutonClosePopup = document.getElementById("closePopup");
const boutonBackPopup = document.getElementById("backPopup");
const boutonAjout = document.getElementById("ajouterPhoto");

boutonModifier.addEventListener("click", function(){
    popup.classList.add("open");
    popupSupprimer.classList.add("open");
    listWorksSupprimer(works);
})

boutonClosePopup.addEventListener("click", function(){
    popup.classList.remove("open");
    popupAjout.classList.remove("open");
    popupSupprimer.classList.remove("open");
    boutonBackPopup.classList.remove("open");
})

boutonAjout.addEventListener("click", function(){
    popupAjout.classList.add("open");
    popupSupprimer.classList.remove("open");
    boutonBackPopup.classList.add("open");
})

boutonBackPopup.addEventListener("click", function(){
    popupSupprimer.classList.add("open");
    popupAjout.classList.remove("open");
    boutonBackPopup.classList.remove("open");
})

const worksDelete = document.querySelector(".worksDelete");

function listWorksSupprimer(works){ // fonction pour générer les photos dans la section portFolio à partir du serveur //
    worksDelete.innerHTML = ""
    for (let i = 0; i < works.length; i++) {
        const article = works[i];

        const figureElement = document.createElement("figure");//création de la balise <figure>

        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl; // création et ajout de l'image dans la balise <img>

        const buttonElement = document.createElement("button");
        buttonElement.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
        buttonElement.id = article.id;
        buttonElement.classList.add("boutonDelete");

        worksDelete.appendChild(figureElement);// On rattache la balise figure à la div //
        
        figureElement.appendChild(imageElement);// On rattache la balise img à figure//
        figureElement.appendChild(buttonElement);

    }
    const btnSupprimer = worksDelete.querySelectorAll(".boutonDelete"); //récupération des boutons supprimer
    console.log(btnSupprimer);

    btnSupprimer.forEach(function(btn) {
        btn.addEventListener('click', function (event) {
            event.preventDefault()
            supprimer(btn);
        })
      });


}

function supprimer(btn){
    const workId = btn.id;
    const chargeUtile = JSON.stringify(workId);
    fetch(`http://localhost:5678/api/works/${btn.id}`, {
            method: "DELETE",
            headers: { 
                'Authorization': `Bearer ${window.localStorage.getItem("token")}`
            } 
        }).then(listWorksSupprimer(works))
}

