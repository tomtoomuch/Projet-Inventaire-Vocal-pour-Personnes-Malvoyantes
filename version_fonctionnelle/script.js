let model;
let semanticData = {};
let dernierePhrase = "";

const imageUpload = document.getElementById("imageUpload");
const image = document.getElementById("image");
const analyserBtn = document.getElementById("analyserBtn");
const lireBtn = document.getElementById("lireBtn");
const inventaireDiv = document.getElementById("inventaire");
const descriptionP = document.getElementById("description");

// 1. Charger le modèle IA
async function chargerModele() {
    model = await cocoSsd.load();
    console.log("Modèle chargé");
}

// 2. Charger le fichier JSON
async function chargerSemantic() {
    const response = await fetch("semantic.json");
    semanticData = await response.json();
    console.log("JSON chargé :", semanticData);

}

    // 3. Afficher l’image choisie
imageUpload.addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
        image.src = URL.createObjectURL(file);
    }
});

// 4. Détecter les objets
async function detecterObjets() {
    if (!image.src) {
        alert("Veuillez choisir une image.");
        return;
    }

    const predictions = await model.detect(image);

    console.log("Predictions:", predictions);

    const inventaire = genererInventaire(predictions);

    afficherInventaire(inventaire);

    const phrase = genererPhrase(inventaire);

    dernierePhrase = phrase;

    descriptionP.textContent = phrase;

    lirePhrase(phrase);
}

// 5. Créer l’inventaire par classe
function genererInventaire(predictions) {
    const inventaire = {};

    predictions.forEach(prediction => {
        const objet = prediction.class;

        inventaire[objet] = (inventaire[objet] || 0) + 1;
    });

    return inventaire;
}

// 6. Chercher la traduction dans le JSON
function enrichirObjet(classe) {
    return semanticData[classe] || {
        fr: classe,
        categorie: "catégorie inconnue",
        definition: "Aucune définition disponible pour cet objet."
    };
}

// 7. Afficher l’inventaire
function afficherInventaire(inventaire) {
    inventaireDiv.innerHTML = "";

    for (let objet in inventaire) {
        const info = enrichirObjet(objet);
        const quantite = inventaire[objet];

        inventaireDiv.innerHTML += `
            <p>
                <strong>${quantite} ${info.fr}</strong><br>
                Catégorie : ${info.categorie}<br>
                Définition : ${info.definition}
            </p>
        `;
    }
}

// 8. Générer une phrase vocale
function genererPhrase(inventaire) {
    const elements = [];

    for (let objet in inventaire) {
        const info = enrichirObjet(objet);
        const quantite = inventaire[objet];

        elements.push(`${quantite} ${info.fr}`);
    }

    if (elements.length === 0) {
        return "Aucun objet n’a été détecté dans l’image.";
    }

    return `J’ai détecté ${elements.join(", ")} dans l’image.`;
}

// 9. Lire à voix haute
function lirePhrase(texte) {
    const utterance = new SpeechSynthesisUtterance(texte);

    utterance.lang = "fr-FR";
    utterance.rate = 1;
    utterance.pitch = 1;

    speechSynthesis.speak(utterance);
}

// 10. Boutons
analyserBtn.addEventListener("click", detecterObjets);

lireBtn.addEventListener("click", function() {
    if (dernierePhrase) {
        lirePhrase(dernierePhrase);
    }
});

// 11. Démarrage
chargerModele();
chargerSemantic();
