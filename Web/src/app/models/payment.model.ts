export class Payment {
    constructor( 
        public Id?: string,
        public UserId?: string,
        public StripeProductKey?: string,
        public Price?: Number,
        public NameOnCard?: string,
        public CardNumber?: string,
        public ExpMonth?: Number,
        public ExpYear?: Number,
        public CVV?: string,
    ) {}
}

export class Bill {
    constructor( 
        public Id?: string,
        public UserId?: string,
        public TotalAmount?: string,
        public Payment?: string,
        public DatePublished?: string
    ) {}
}