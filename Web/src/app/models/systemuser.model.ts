export class SystemUser {
    constructor( 
        public Id?: string,
        public Name?: string,
        public Username?: string,
        public Password?: string,
        public Phone?: string,
        public Active?: string,
        public UserRole?: string,
        public Roaming?: string,
        public RingingTone?: string,
        public WorkPackage?: string,
        public StudentPackage?: string,
        public FamilyPackage?: string,
        public FamilyPlusPackage?: string,
        public WorkStudentPackage?: string,
        public Token?: string
    ) {}
}
