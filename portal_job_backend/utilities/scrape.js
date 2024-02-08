import cheerio from "cheerio";
import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import prompts from "prompts";
import {
  contenuAnnonceSelector,
  itemAnnonceSelector,
  itemDetailSelector,
} from "../constants/index.js";
import { extractJobData } from "./extract.js";

const webDevUrl =
  "https://www.portaljob-madagascar.com/emploi/liste/secteur/informatique-web/page/";

// const comptaURL = "https://www.portaljob-madagascar.com/emploi/liste/secteur/gestion-comptabilite-finance/page/"

const findTextByHTMLTag = ($annonce, HTMLTag) => {
  const textFound = $annonce
    .find(contenuAnnonceSelector)
    .find(HTMLTag)
    .text()
    .trim();
  if (textFound) {
    return textFound;
  } else {
    console.log("Aucune texte n'a été récupérée");
  }
};

const scrapeJobData = async (pageNumber) => {
  try {
    const jobLists = [];

    if (pageNumber) {
      const loadingSpinnerScrapping = ora({
        text: chalk.white(
          "Récupération des données sur les offres d'emploi en ligne..."
        ),
        spinner: "dots",
        color: "white",
      });

      loadingSpinnerScrapping.start();


      for (let i = 0; i <= pageNumber; i++) {
        const result = await axios.get(webDevUrl + i);
        if (result.data) {
          const $ = cheerio.load(result.data);
          const itemAnnounce = $(itemAnnonceSelector);

          if (itemAnnounce) {
            itemAnnounce.each(async function (_index, annonce) {
              const { jobData } = await extractJobData($(annonce));

              if (jobData.title && jobData.company && jobData.contractType) {
                jobLists.push(jobData);
              }
            });
          }
        }
      }

      if (jobLists) {
        loadingSpinnerScrapping.succeed(
          chalk.white(`Récupération des données de ${pageNumber} pages terminées !`)
        );

        return { message: "data_pdf_saved", jobLists: jobLists };
      } else {
        loadingSpinnerScrapping.fail(
          chalk.redBright(
            "Aucune donnée récupérée. Veuillez vérifier l'URL ou réessayer plus tard"
          )
        );

        return { message: "fails", jobLists: [] };
      }
    } else {
      console.log('No page');
    }

  } catch (error) {
    chalk.redBright(
      "\n Une erreur s'est produite lors de la récupération des données"
    );
    console.error(error.message);
  }
};

export { findTextByHTMLTag, scrapeJobData };
