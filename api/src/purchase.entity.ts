import { IAddress, ILineItems } from "./interface";

export class Purchase {
    reference_id: string;
    number: string;
    admin_url: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    billing_address: IAddress;
    shipping_address: IAddress;
    line_items: ILineItems[];
    currency: string;
    total_price: number;
    subtotal_price: number;
    payment_status: string;
    payment_method: string;
    tracking_numbers: string;
    referring_site: string;
    status_url: string;
    billet_url: string;
    billet_line: string;
    billet_expired_at: string;
    original_created_at: string
  }