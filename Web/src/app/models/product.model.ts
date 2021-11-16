export class Product {
    constructor( 
        public Id?: string,
        public CategoryId?: string,
        public Title?: string,
        public Image?: string,
        public ImageFile?: string,
        public Price?: string,
        public Quantity?: number,
        public Description?: string,
        public DatePublished?: Date
    ) {}
}