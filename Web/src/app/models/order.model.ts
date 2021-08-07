export class Order {
    constructor( 
        public Id?: string,
        public UserEmail?: string,
        public ProductID?: string,
        public DateofPayment?: Date
    ) {}
}