export class CheckPaymentModel {
  paid: boolean = false;
  paymentUrl: string = null;
}

export class PaymentOptions {
  enabled: boolean = false;
  paymentUrl: string = null;
  title: string = null;
  name: string = null;
  email: string = null;
  allowMethods: any[] = [];
  denyMethods: any[] = [];
  products: PaymentProduct[] = [];
}

export class PaymentSuccessRequest {
  secretKey: string = null;
  payment_provider: string = null;
  provider_reference: string = null;
  payment_date: string = null;
  amount: number = null;
  currency: string = null;
  our_reference: string = null;
  product_id: number = null;
}

class PaymentProduct {
  id: number = null;
  title: string = null;
  amount: number = null;
  currency: string = null;
}
