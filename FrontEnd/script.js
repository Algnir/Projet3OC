//Requete récup des travaux//
const reponse = await fetch("http://localhost:5678/api/works");
let works = await reponse.json();


//Requete récup des catégories//
const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();


//***** Récupération des éléments ***** //
const gallery = document.querySelector(".gallery"); //selection de la div gallery dans la section portfolio//
const divFiltres = document.querySelector(".filtres");//selection de la div ou seront les boutons filtres//
const btnModifier = document.getElementById("modifier");//selection du bouton de la modal modifier//
const projet = document.getElementById("projet");//selection du li projet de la navbar//
const contact = document.getElementById("pagecontact");//selection du li contact de la navbar//
const login = document.getElementById("login");///selection du li login de la navbar//
const main = document.getElementById("main");//selection de la section main ou il y a le portfolio//
const pageLogin = document.getElementById("pageLogin");//selection de la div login pour la dite page//


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


function genererFiltre(categories){// fonction pour générer les boutons filtres en fonction des catégories//
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


    for (let i = 0; i < (categories.length+1); i++) {
        document.getElementById(i).addEventListener("click", function () {
            for (let y = 0; y < (categories.length+1); y++){
                document.getElementById(y).classList.remove("clicked");
            }
            document.getElementById(i).classList.add("clicked");
            if(i==0){// partie pour le bouton Tous
                gallery.innerHTML = "";
                genererWorks(works);
            } else{
                const filterWorks = works.filter((work) => work.category.name == categories[i-1].name);

                gallery.innerHTML = "";//supression de la galerie sinon on aura les images d'avant qui se rajoute//
                genererWorks(filterWorks);//generation de la galleries//
            }
        });
    }


    if (login.innerText == "logout"){
        divFiltres.classList.add("none");
    }
}


//Action des li de la navbar//

login.addEventListener("click", function (){
    if(login.innerText == "login"){
    main.classList.add("none");
    pageLogin.classList.remove("none");
    login.classList.add("bold");
    }else {
        logout();
        login.innerText = "login";
        divFiltres.classList.remove("none");
        btnModifier.classList.add("none");
    }
})

projet.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
    login.classList.remove("bold");
    window.location.href="#projet";
})

contact.addEventListener("click", function (){
    main.classList.remove("none");
    pageLogin.classList.add("none");
    login.classList.remove("bold");
    window.location.href="#contact";
})

if ((window.localStorage.getItem("token") !== 'undefined') && (window.localStorage.getItem("token") !== null)){
    login.innerText = "logout";
    divFiltres.classList.add("none");
    btnModifier.classList.remove("none");
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
                btnModifier.classList.remove("none");
                login.classList.remove("bold");
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

btnModifier.addEventListener("click", function(){
    popup.classList.add("open");
    popupSupprimer.classList.add("open");

    SelectionBtnSupprimer(works);
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

function galleryWorksSuppression(works){ // fonction pour générer les photos dans la popup-delete à partir du serveur //
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
    SelectionBtnSupprimer (works);

}

function SelectionBtnSupprimer (works){
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

//popup ajout//
function ajoutNewWork() {
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.addEventListener("submit", async function (event) {
        event.preventDefault()
        var formData = new FormData();
        const img = event.target.querySelector("#newWork");
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


function previewImage(){//fonction chargement image insérer//
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


document.getElementById('newWork').addEventListener('change', function(event) {
    previewImage()
});


function resetFormulaire(){
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.reset();
}


//******** initialisation des fonctions ********/
genererWorks(works);
genererFiltre(categories);
connexion();
galleryWorksSuppression(works);
ajoutNewWork();




