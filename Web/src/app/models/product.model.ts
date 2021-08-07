export class Product {
    constructor( 
        public Id?: string,
        public Title?: string,
        public Image?: string,
        public ImageFile?: string,
        public Description?: string,
        public Category?: string,
        public DatePublished?: Date
    ) {}
}