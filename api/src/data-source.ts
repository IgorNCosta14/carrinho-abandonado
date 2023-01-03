import { DataSource } from "typeorm";
import { PurchaseStatus } from "./modules/puchases/purchaseStatus.entity";

export const AppDataSource = new DataSource({
    type: "sqlite",
    database: "turbo",
    synchronize: true,
    logging: true,
    entities: [PurchaseStatus],
    subscribers: [],
    migrations: [],
})

AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })