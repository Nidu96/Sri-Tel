export class PredictionHistory {
    constructor( 
        public Id?: string,
        public UserId?: string,
        public HeartDiseasesRiskProbabilty?: Number,
        public StrokeRiskProbabilty?: Number,
        public MentalDiseasesRiskProbabilty?: Number,
        public CombinedRiskProbabilty?: Number,
        public DatePublished?: string
    ) {}
}