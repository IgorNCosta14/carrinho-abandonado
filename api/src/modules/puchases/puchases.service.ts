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

    async findPurchase(reference_id: string) {
    
    }
}