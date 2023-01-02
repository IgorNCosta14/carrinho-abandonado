import { PurchaseStatus } from "./purchaseStatus.entity";

interface INewPurchase {
    reference_id: string;
    payment_status: string;
}

export class puchasesService {
    Puchases: PurchaseStatus[] = [];

    async createPurchase({
        reference_id,
        payment_status
    }:INewPurchase): Promise<void> {
        const purchaseStatus = new PurchaseStatus();

        Object.assign(purchaseStatus, {
            reference_id,
            payment_status
        })

        this.Puchases.push(purchaseStatus);
    }

    // return value or null
    async findPurchase(reference_id: string):Promise<PurchaseStatus> {
        const purchaseStatusExist = this.Puchases.find((purchaseStatus) => purchaseStatus.reference_id === reference_id);

        if(purchaseStatusExist) {
            return purchaseStatusExist;
        }
    }

    async deletePurchase(reference_id: string):Promise<void> {
        const purchaseStatusExist =this.Puchases.find((purchaseStatus) => purchaseStatus.reference_id === reference_id);
        
        const indexOfPurchaseStatusExist = this.Puchases.indexOf(purchaseStatusExist);

        if (purchaseStatusExist) {
            this.Puchases.splice(indexOfPurchaseStatusExist, 1);
        };
    }
}