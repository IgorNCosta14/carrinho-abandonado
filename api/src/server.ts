import "dotenv/config";
import axios from "axios";
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors())

app.post('/', async (req: Request, res:Response) => {
    const objectSent = req.body;

    const objectSentJSON = JSON.stringify(objectSent);

    console.log(objectSentJSON)

    let base64 = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SERVER}`)
    const response = await axios.post('https://api.reportana.com/2022-05/abandoned-checkouts', objectSentJSON, {
        headers: {
            'Authorization': `Basic ${base64}`,
            'Content-Type': 'application/json'
        }
    });
    
    console.log(response.status, response.data);
    res.status(response.status).json(response.data);
})

app.listen(3000, () => console.log("Server is running!"));