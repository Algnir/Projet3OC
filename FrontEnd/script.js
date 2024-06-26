//Requete récup des travaux//
const reponse = await fetch("http://localhost:5678/api/works");
let works = await reponse.json();

//Requete récup des catégories//
const reponse2 = await fetch("http://localhost:5678/api/categories");
const categories = await reponse2.json();


//***** Récupération des éléments HTML***** //
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


    for (let i = 0; i < (categories.length+1); i++) { //boucle action des boutons catégories//
        document.getElementById(i).addEventListener("click", function () {
            for (let h = 0; h < (categories.length+1); h++){
                document.getElementById(h).classList.remove("clicked");
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


    if ((window.localStorage.getItem("token") !== 'undefined') && (window.localStorage.getItem("token") !== null)){//condition affichage des boutons filtres
        divFiltres.classList.add("none");
    }
}


//Action des li de la navbar//

login.addEventListener("click", function (){
    if((window.localStorage.getItem("token") == 'undefined') || (window.localStorage.getItem("token") == null)){// condition qui amene à la page de login si pas log
    main.classList.add("none");
    pageLogin.classList.remove("none");
    login.classList.add("bold");
    for (let h = 0; h < (categories.length+1); h++){ //enleve le bouton cliqué
        document.getElementById(h).classList.remove("clicked");
    }
    gallery.innerHTML = ""; //regenere la galerie
    genererWorks(works);
    }else { // enleve le token et redonne l'accès à la page en mode visiteur
        logout();
        verifToken();
    }
})

projet.addEventListener("click", function (){//quitte la page login et va à la section projet//
    main.classList.remove("none");
    pageLogin.classList.add("none");
    login.classList.remove("bold");
    resetFormulaireLogin();
    window.location.href="#projet";
})

contact.addEventListener("click", function (){//quitte la page login et va à la section contact//
    main.classList.remove("none");
    pageLogin.classList.add("none");
    login.classList.remove("bold");
    resetFormulaireLogin();
    window.location.href="#contact";
})


function verifToken(){ // fonction qui vérifie si il y a un token de stocker et ajuste l'affichage en fonction //
    if ((window.localStorage.getItem("token") !== 'undefined') && (window.localStorage.getItem("token") !== null)){ //affichage logout ou login//
        login.innerText = "logout";
        divFiltres.classList.add("none");
        btnModifier.classList.remove("none");
    }else{
        login.innerText = "login"
        divFiltres.classList.remove("none");
        btnModifier.classList.add("none");
    }
}

verifToken();



//*****LOGIN*****//
//Fonction envoye du formulaire pour connexion et récupération de l'userId et du token//
function connexion() {
    const formulaireLogin = document.querySelector("#formulaireLogin");
    formulaireLogin.addEventListener("submit",async function (event) {
        event.preventDefault()
        const errorMsg = document.querySelector(".errorLogin");
        const email = event.target.querySelector("#emailLogin");// récupération du formulaire pour en faire la charge utile à envoyer
        const password = event.target.querySelector("#mdp");
        const Users = {
            "email": email.value,
            "password": password.value,
        };
        const chargeUtile = JSON.stringify(Users);

        try {
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body : chargeUtile
            })

            if (!response.ok){
                email.classList.add("error-login");
                password.classList.add("error-login");
                errorMsg.classList.remove("none");
            }else {
                const user = await response.json();
                window.localStorage.setItem("token",user.token);
                window.localStorage.setItem("userId",user.userId);
                verifToken();
                resetFormulaireLogin();
                main.classList.remove("none");
                pageLogin.classList.add("none");
                const divFiltres = document.querySelector(".filtres");
                divFiltres.classList.add("none");
                btnModifier.classList.remove("none");
                login.classList.remove("bold");
                window.location.href="#projet"; // sinon quand la page login se ferme on arrive sur contact
            }
            
        }catch(error) {
            console.error(error);
        }
    })
}


function logout () { //fonction qui supprime l'userid et le token pour la déconnexion 
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

btnModifier.addEventListener("click", function(){// bouton accès popup
    popup.classList.add("open");
    popupSupprimer.classList.add("open");
    SelectionBtnSupprimer(works);
})

boutonClosePopup.addEventListener("click", function(){ //bouton pour fermer la popup
    popup.classList.remove("open");
    popupAjout.classList.remove("open");
    popupSupprimer.classList.remove("open");
    boutonBackPopup.classList.remove("open");
    resetFormulairePhoto();
    previewImage();
})

boutonAjout.addEventListener("click", function(){// bouton pour aller sur la popup ajout
    popupAjout.classList.add("open");
    popupSupprimer.classList.remove("open");
    boutonBackPopup.classList.add("open");
})

boutonBackPopup.addEventListener("click", function(){ //bouton pour retourner sur la popup delete
    popupSupprimer.classList.add("open");
    popupAjout.classList.remove("open");
    boutonBackPopup.classList.remove("open");
    resetFormulairePhoto();
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
            const reponse = await fetch("http://localhost:5678/api/works"); //réactualisation de la liste des travaux
            works = await reponse.json(); 
            genererWorks(works);
            galleryWorksSuppression(works);
        })
    });
}

//popup ajout//
function ajoutNewWork() { //fonction ajout d'une nouvelle photo
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.addEventListener("submit", async function (event) {
        event.preventDefault()
        var formData = new FormData(); //body à envoyé dans la requête
        const img = event.target.querySelector("#newWork");
        const titre = event.target.querySelector("#titreNewWork");
        const categories = event.target.querySelector("#categoriesNewWork");
        formData.append('image',img.files[0]);
        formData.append('title', titre.value);
        formData.append('category', categories.value);

        try {
        const response = await fetch('http://localhost:5678/api/works', { //requête envoye donnée avec le token gardé en mémoire
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        },
        body: formData
        })

        if (!response.ok) {
                throw new Error('Échec du traitement de formulaire.');
        }

        const reponse = await fetch("http://localhost:5678/api/works"); //réactualisation de la liste des travaux
        works = await reponse.json(); 
        genererWorks(works);
        galleryWorksSuppression(works);
        resetFormulairePhoto();//reset du formulaire après ajout
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
        const reader = new FileReader(); // ajout du reader pour la preview

        reader.onload = function(e) {
            preview.src = e.target.result; // changement de la source de l'img pour mettre le fichier lu
        };

        reader.readAsDataURL(input.files[0]); //lecture du fichier jpg/png
        preview.classList.remove("none");//affichage de l'image
        inputPhoto.classList.add("none");

    }
    else {
        preview.classList.add("none");// si il n'y pas d'image affiche le bouton ajout image
        inputPhoto.classList.remove("none");
    
    }
}


document.getElementById('newWork').addEventListener('change', function(event) { //lecture de la fonction preview quand on input un fichier
    previewImage()
});


function resetFormulairePhoto(){
    const ajoutPhoto = document.querySelector("#ajoutPhoto");
    ajoutPhoto.reset();
}

function resetFormulaireLogin(){
    const login = document.querySelector("#formulaireLogin");
    const errorMsg = document.querySelector(".errorLogin");
    const email = document.querySelector("#emailLogin");// récupération du formulaire pour en faire la charge utile à envoyer
    const password = document.querySelector("#mdp");
    email.classList.remove("error-login");
    password.classList.remove("error-login");
    errorMsg.classList.add("none");
    login.reset();
}


//******** initialisation des fonctions ********/
genererWorks(works);
genererFiltre(categories);
connexion();
galleryWorksSuppression(works);
ajoutNewWork();




