export class SystemUser {
    constructor( 
        public Id?: string,
        public Name?: string,
        public NIC?: string,
        public DOB?: string,
        public Address?: string,
        public Username?: string,
        public Password?: string,
        public Phone?: string,
        public Active?: string,
        public UserRole?: string,
        public PermissionsList?: Array<SystemPermissions>,
        public OTP?: string,
    ) {}
}

export class SystemPermissions {
    constructor( 
        public Id?: string,
        public UserId?: string,
        public SystemId?: string
    ) {}
}