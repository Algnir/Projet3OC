//Requete récup des travaux//
const reponse = await fetch("http://localhost:5678/api/works");
let works = await reponse.json();


//Requete récup des catégories//
const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();


//***** Récupération des éléments ***** //
const gallery = document.querySelector(".gallery"); //selection de la div gallery dans la section portfolio//
const divFiltres = document.querySelector(".filtres");
const login = document.getElementById("login");
const boutonModifier = document.getElementById("modifier");
const projet = document.getElementById("projet");
const contact = document.getElementById("pagecontact");
const main = document.getElementById("main");
const pageLogin = document.getElementById("pageLogin");


function genererWorks(works){// fonction pour générer les photos dans la section portFolio à partir du serveur //
    gallery.innerHTML = "" 
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

genererFiltre(categories);

//*****fonction des boutons filtres*****//

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



//*****LOGIN*****//
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
    SelectionBoutonSupprimer ();
})

boutonClosePopup.addEventListener("click", function(){
    popup.classList.remove("open");
    popupAjout.classList.remove("open");
    popupSupprimer.classList.remove("open");
    boutonBackPopup.classList.remove("open");
    resetFormulaire();
    previewImage();
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
    resetFormulaire();
    previewImage();
})

const worksDelete = document.querySelector(".worksDelete");

function galleryWorksSuppression(works){ // fonction pour générer les photos dans la section portFolio à partir du serveur //
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
    SelectionBoutonSupprimer (works);

}

function SelectionBoutonSupprimer (works){
    const btnSupprimer = worksDelete.querySelectorAll(".boutonDelete"); //récupération des boutons supprimer

    btnSupprimer.forEach(function(btn) {
        btn.addEventListener('click', async function () {
            await fetch(`http://localhost:5678/api/works/${btn.id}`, { //requête suppression de l'élément ou le btn a été cliqué
                method: "DELETE",
                headers: { 
                    'Authorization': `Bearer ${window.localStorage.getItem("token")}`
                } 
            })
            const reponse = await fetch("http://localhost:5678/api/works");
            works = await reponse.json(); 
            genererWorks(works);
            galleryWorksSuppression(works);
        })
    });
}

//ajout Works//
function ajoutNewWork() {
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.addEventListener("submit", async function (event) {
        event.preventDefault()
        var formData = new FormData();
        const img = event.target.querySelector("#newWork");
        console.log(img);
        const titre = event.target.querySelector("#titreNewWork");
        const categories = event.target.querySelector("#categoriesNewWork");
        formData.append('image',img.files[0]);
        formData.append('title', titre.value);
        formData.append('category', categories.value);

        try {
        const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        },
        body: formData
        })

        if (!response.ok) {
                throw new Error('Échec du traitement de formulaire.');
        }

            console.log('Formulaire soumis avec succès.');

        const reponse = await fetch("http://localhost:5678/api/works");
        works = await reponse.json(); 
        genererWorks(works);
        galleryWorksSuppression(works);
        resetFormulaire();
        previewImage();
            
    } catch(error) {
            console.error(error);
        };
    });
}

document.getElementById('newWork').addEventListener('change', function(event) { //fonction chargement image insérer
    const input = event.target;
    const preview = document.getElementById('previewImage');
    const inputPhoto = document.getElementById("btnAjoutPhoto");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
        preview.classList.remove("none");
        inputPhoto.classList.add("none");

    }
    else {
        preview.classList.add("none");
        inputPhoto.classList.remove("none");
    }
});

function previewImage(){
    const input = document.getElementById('newWork');
    const preview = document.getElementById('previewImage');
    const inputPhoto = document.getElementById("btnAjoutPhoto");

    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            preview.src = e.target.result;
        };

        reader.readAsDataURL(input.files[0]);
        preview.classList.remove("none");
        inputPhoto.classList.add("none");

    }
    else {
        preview.classList.add("none");
        inputPhoto.classList.remove("none");
    
    }
}


function resetFormulaire(){
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.reset();
}

ajoutNewWork();
connexion();
genererWorks(works);
galleryWorksSuppression(works);



