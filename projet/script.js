// Projet-Inventaire-Vocal-pour-Personnes-Malvoyantes
// Détection d'objets et inventaire vocal pour personnes malvoyantes
// Ce projet utilise TensorFlow.js et le modèle COCO-SSD pour détecter des objets dans une image téléchargée par l'utilisateur. Il génère ensuite un inventaire des objets détectés et lit cet inventaire à voix haute.

// Variables globales
let model;
let inventaire = {};
let dictionnaire_JSON = {};
let quantite;
let objet;
let predictions = [];

// Récupération des éléments du DOM
const imageUpload = document.getElementById("imageUpload");
const img = document.getElementById("img");
const result = document.getElementById("result");

async function loadModel() {
    model = await cocoSsd.load();
    console.log("Modèle COCO-SSD chargé");
}

function chargerImage() {
    const file = imageUpload.files[0];
    img.src = URL.createObjectURL(file);
    console.log("Image chargée:", img.src);
    img.onload = () => {
        dessinerImage(img);
        console.log("Image prête pour la détection");   
    };
}

function dessinerImage(img){
    const imgWidth = img.width;
    const imgHeight = img.height;
    console.log(`Dimensions de l'image: ${imgWidth}x${imgHeight}`);
    const canvas = document.getElementById("imageCanvas");
    const ctx = canvas.getContext("2d");
    if (imgWidth < canvas.width || imgHeight < canvas.height) {
        ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
    }
    else {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
}

async function chargerEnrichissement() {
    // Chargement d'un JSON au clic du bouton
    fetch("./inventaire_enrichi.json")
        .then(async (response) => {
            dictionnaire_JSON = await response.json();
        })
        .then(data => {
            console.log("Données enrichies chargées:", data);
            // Traiter les données enrichies
            dictionnaire_JSON.forEach(classe => {
                if (classe in inventaire) {
                    console.log(`Classe ${classe} trouvée dans l'inventaire`);
                }
            });
        })
        .catch(error => console.error("Erreur lors du chargement des données enrichies:", error));
}

// Fonction enrichirObjet(class) {}

async function detectObjects() {
    //console.log(img);
    predictions = await model.detect(img);
    console.log("Predictions:", predictions);
    genererInventaire(predictions);
}
    
function genererInventaire(predictions) {
    console.log("Génération de l'inventaire à partir des prédictions...");
    predictions.forEach (prediction => {
        console.log(`Détection d'un objet: ${prediction.class} avec une confiance de ${(prediction.score * 100).toFixed(2)}%`);
        inventaire[prediction.class] = (inventaire[prediction.class] || 0) + 1;
        console.log("Inventaire mis à jour :", inventaire);
        for (let objet in inventaire) {
            quantite = inventaire[objet];
            console.log(`${objet} : ${quantite}`);
        };
    });
    return inventaire, quantite;
};

function afficherInventaire(inventaire) {
    for (let objet in inventaire) {
        result.innerHTML += 
            `<p>
                ${objet} : ${inventaire[objet]}
            </p>`
        ;
    }
}; //Score : ${(prediction.score * 100).toFixed(2)} %

function genererPhrase(inventaire) {

    return texte;
};

function lirePhrase(texte) {
    const trigger = document.getElementById("trigger");
    const utterance = new SpeechSynthesisUtterance(result.textContent);
    utterance.lang = "en-EN";
    speechSynthesis.speak(utterance);
}

function BoundingBoxes(predictions) {

}

loadModel();
imageUpload.addEventListener("change", chargerImage);
inventaire = genererInventaire(predictions);
//afficherInventaire(inventaire);