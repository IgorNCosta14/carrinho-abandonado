import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class PurchaseStatus {

    @PrimaryColumn()
    reference_id: string;

    @Column()
    payment_status: string;
}