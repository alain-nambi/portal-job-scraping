import cheerio from "cheerio"; // Bibliothèque pour parser le HTML
import axios from "axios"; // Bibliothèque pour faire des requêtes HTTP
import chalk from "chalk"; // Bibliothèque pour colorer les sorties dans la console
import ora from "ora"; // Bibliothèque pour afficher des spinners dans la console
import pLimit from "p-limit"; // Bibliothèque pour limiter les requêtes simultanées
import {
  contenuAnnonceSelector,
  itemAnnonceSelector,
  itemDetailSelector,
} from "../constants/index.js"; // Sélecteurs CSS constants pour le scraping
import { extractJobData } from "./extract.js"; // Fonction pour extraire les données des annonces

const webDevUrl = "https://www.portaljob-madagascar.com/emploi/liste/secteur/informatique-web/page/";

// Fonction pour trouver et extraire du texte à partir d'une balise HTML spécifique
const findTextByHTMLTag = ($annonce, HTMLTag) => {
  const textFound = $annonce
    .find(contenuAnnonceSelector) // Trouver le conteneur de l'annonce
    .find(HTMLTag) // Trouver la balise HTML spécifique
    .text() // Extraire le texte
    .trim(); // Supprimer les espaces superflus
  if (textFound) {
    return textFound; // Retourner le texte trouvé
  } else {
    console.log("Aucune texte n'a été récupérée"); // Message si aucun texte n'est trouvé
  }
};

// Fonction pour récupérer les données des offres d'emploi à partir d'une page donnée
const scrapeJobData = async (pageNumber) => {
  try {
    const jobLists = []; // Tableau pour stocker les données des offres d'emploi
    const limit = pLimit(1); // Limiter à 2 requêtes simultanées

    if (pageNumber) {
      const loadingSpinnerScrapping = ora({
        text: chalk.white("Récupération des données sur les offres d'emploi en ligne..."),
        spinner: "dots",
        color: "white",
      });

      loadingSpinnerScrapping.start(); // Démarrer le spinner de chargement

      // Fonction pour faire une pause entre les requêtes
      // const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      // Tableau de promesses limitées
      const promises = [];
      for (let i = 1; i <= pageNumber; i++) {
        promises.push(
          limit(async () => {
            console.log(pageNumber, [i]);
            // await delay(50); // Pause de 5 secondes entre les requêtes
            const result = await axios.get(webDevUrl + i); // Faire la requête HTTP pour la page i
            if (result.data) {
              const $ = cheerio.load(result.data); // Charger le HTML de la page
              const itemAnnounce = $(itemAnnonceSelector); // Sélectionner les annonces

              if (itemAnnounce) {
                const jobDataPromises = [];
                itemAnnounce.each((_index, annonce) => {
                  jobDataPromises.push(
                    extractJobData($(annonce)).then(({ jobData }) => {
                      if (jobData.title && jobData.company && jobData.contractType) {
                        jobLists.push(jobData); // Ajouter les données de l'annonce au tableau
                      }
                    })
                  );
                });
                await Promise.all(jobDataPromises); // Attendre que toutes les promesses soient résolues
              }
            }
          })
        );
      }

      await Promise.all(promises); // Attendre que toutes les promesses limitées soient résolues

      if (jobLists.length > 0) {
        loadingSpinnerScrapping.succeed(
          chalk.white(`Récupération des données de ${pageNumber} pages terminée !`)
        );

        return { message: "data_pdf_saved", jobLists: jobLists }; // Retourner les données récupérées
      } else {
        loadingSpinnerScrapping.fail(
          chalk.redBright("Aucune donnée récupérée. Veuillez vérifier l'URL ou réessayer plus tard")
        );

        return { message: "fails", jobLists: [] }; // Retourner un message d'échec
      }
    } else {
      console.log('Le numéro de page est manquant'); // Message si le numéro de page est manquant
    }

  } catch (error) {
    console.error(
      chalk.redBright("\nUne erreur s'est produite lors de la récupération des données"),
      error.message
    ); // Afficher l'erreur
  }
};

export { findTextByHTMLTag, scrapeJobData }; // Exporter les fonctions
