export class User {
    constructor(
        public Id?: string,
        public Name?: string,
        public Username?: string,
        public Password?: string,
        public Phone?: Number,
        public Active?: string,
        public UserRole?: string,
        public Weight?: Number,
        public Height?: Number,
        public BMI?: Number,
        public IsSmokingYes?: boolean,
        public IsAlcoholDrinkingYes?: boolean,
        public PhysicalHealth?: Number,
        public MentalHealth?: Number,
        public IsDiffWalkingYes?: boolean,
        public IsPhysicalActivityYes?: boolean,
        public GenHealth?: Number,
        public SleepTime?: Number,
        public IsHeartDiseaseYes?: boolean,
        public IsStrokeYes?: boolean,
        public Token?: string
    ) {}
}
