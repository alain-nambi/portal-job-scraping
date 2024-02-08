import express from 'express';
import bodyParser from "body-parser";
import cors from "cors";

const app = express();

app.use(bodyParser.json());
app.use(cors())

const port = 3018; 

import { scrapeJobData } from './utilities/scrape.js';

app.post('/get-pdf', async (req, res) => {
    const { pageNumber } = req.body;
    try {
        const { message, jobLists } = await scrapeJobData(pageNumber);
        if (message === 'data_pdf_saved') {
            res.status(200).json({
                message: 'Enregistrement du PDF avec succès',
                jobLists: jobLists,
            });
        } else {
            res.status(500).json({
                error: 'Erreur lors de l\'enregistrement du PDF',
            });
        }
    } catch (err) {
        res.status(500).json({
            error: err.message,
        });
    }
});


app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
