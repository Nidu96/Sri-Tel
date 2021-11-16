export class Order {
    constructor( 
        public Id?: string,
        public IdForCustomer?: string,
        public UserEmail?: string,
        public DeliveryNote?: string,
        public Phone?: string,
        public RecepientName?: string,
        public RecepientPhone?: string,
        public Status?: string,
        public DateofPayment?: Date,
        public City?: string,
        public OrderedProducts?: Array<OrderedProduct>,
    ) {}
}

export class OrderedProduct {
    constructor( 
        public Id?: string,
        public OrderId?: string,
        public Quantity?: string,
        public ProductID?: string,
    ) {}
}