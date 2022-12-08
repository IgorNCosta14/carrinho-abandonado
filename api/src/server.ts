import "dotenv/config";
import axios from "axios";
import express, { request, Request, Response } from "express";

const app = express();
app.use(express.json());


const objetoTest = {
    reference_id: "199559911995199559911995",
    reason_type: null,
    number: "199559911995199559911995",
    admin_url: "https://example.com/admin/carts/123456789",
    customer_name: "testtesttesttest",
    customer_email: "testtesttest@gmail.com",
    customer_phone: "+5511911111111",
    billing_address: {
        name: "test test",
        first_name: "test",
        last_name: "test",
        company: null,
        phone: "+5511911111111",
        address1: "Av Belisário Ramos, 3735",
        address2: "Sagrado Coração Jesus",
        city: "Lages",
        province: "Santa Catarina",
        province_code: "SC",
        country: "Brazil",
        country_code: "BR",
        zip: "88508100",
        latitude: null,
        longitude: null
    },
    shipping_address: {
        name: "João Moraes",
        first_name: "João",
        last_name: "Moraes",
        company: null,
        phone: "+5511911111111",
        address1: "Av Belisário Ramos, 3735",
        address2: "Sagrado Coração Jesus",
        city: "Lages",
        province: "Santa Catarina",
        province_code: "SC",
        country: "Brazil",
        country_code: "BR",
        zip: "88508100",
        latitude: null,
        longitude: null
    },
    line_items: [
        {
            title: "Óculos",
            variant_title: "Preto",
            quantity: 1,
            price: 49.9,
            path: "https://example.com/products/1234",
            image_url: "https://example.com/products/1234/image.jpg", 
            "tracking_number": null
        },
        {
            title: "Óculos",
            variant_title: "Azul",
            quantity: 1,
            price: 59.9,
            path: "https://example.com/products/5678",
            image_url: "https://example.com/products/5678/image.jpg", 
            "tracking_number": null
        }
    ],
    currency: "BRL",
    total_price: 124.8,
    subtotal_price: 109.8,
    referring_site: "https://www.facebook.com/",
    checkout_url: "https://example.com/carts/123456789",
    completed_at: "2022-12-09 17:30",
    original_created_at: "2022-12-09 17:30"
}

app.post('/', async (req: Request, res:Response) => {
    // let base64 = btoa(`${process.env.CLIENT_ID}:${process.env.CLIENT_SERVER}`)
    // const response = await axios.post('https://api.reportana.com/2022-05/abandoned-checkouts', objetoTest, {
    //     headers: {
    //         Authorization: `Basic ${base64}`
    //     }
    // });

    // res.status(response.status).json(response.data);
    res.status(201).send("test ok")
})

app.listen(3000, () => console.log("Server is running!"));