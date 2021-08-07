export class Payment {
    constructor( 
        public Id?: string,
        public UserId?: string,
        public TutorialId?: string,
        public TutorialName?: string,
        public StripeProductKey?: string,
        public Price?: Number,
        public NameOnCard?: string,
        public CardNumber?: string,
        public ExpMonth?: Number,
        public ExpYear?: Number,
        public CVV?: string,
    ) {}
}