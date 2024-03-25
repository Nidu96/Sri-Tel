import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import {
    NgbDate,
    NgbModal,
    ModalDismissReasons,
    NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { User } from 'src/app/models/user.model'
import { AlertService } from 'src/app/alert/alert.service'
import { LocalStorage } from 'src/app/util/localstorage.service'
import * as AOS from 'aos'
import { UserService } from '../admin/dashboard/user.service'
import { PredictionHistory } from '../models/prediction-history.model'

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
    public closeResult = ''
    public ModalRef: BsModalRef
    public loggedInUser: User

    //form fields
    public id: string;
    public fullname: string;
    public username: string;
    public phone;
    public password: string;
    public confirmpassword: string;
    public status: string;
    public userrole: string;
    public weight;
    public height;
    public bmi;
    public issmokingyes: boolean;
    public isalcoholdrinkingyes: boolean;
    public physicalhealth;
    public mentalhealth;
    public isdiffwalkingyes: boolean;
    public isphysicalactivityyes: boolean;
    public genhealth;
    public sleeptime;
    public isheartdiseaseyes: boolean;
    public isstrokeyes: boolean;
    public userlist: Array<User> = []
    public syslist: Array<any>
    public savebtnactive: boolean = true
    public predictions: PredictionHistory

    @ViewChild('createnewuser', { static: false })
    createnewuser: TemplateRef<any>

    constructor(
        private bsModalService: BsModalService,
        private userService: UserService,
        private parserFormatter: NgbDateParserFormatter,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        // AOS.init()
        this.loggedInUser = JSON.parse(
            localStorage.getItem(LocalStorage.LOGGED_USER)
        ) as User
        localStorage.setItem(LocalStorage.LANDING_BODY, '0')
        this.Initialize()
        this.fullname = this.loggedInUser.Name
        this.username = this.loggedInUser.Username
        this.password = atob(this.loggedInUser.Token.split("basic")[1].trim()).split(":")[1];
        this.confirmpassword = atob(this.loggedInUser.Token.split("basic")[1].trim()).split(":")[1];
        this.phone = this.loggedInUser.Phone
        this.weight = this.loggedInUser.Weight;
        this.height = this.loggedInUser.Height;
        this.bmi = this.loggedInUser.BMI;
        this.issmokingyes = this.loggedInUser.IsSmokingYes
        this.isalcoholdrinkingyes = this.loggedInUser.IsAlcoholDrinkingYes;
        this.physicalhealth = this.loggedInUser.PhysicalHealth;
        this.mentalhealth = this.loggedInUser.MentalHealth;
        this.isdiffwalkingyes = this.loggedInUser.IsDiffWalkingYes;
        this.isphysicalactivityyes = this.loggedInUser.IsPhysicalActivityYes;
        this.genhealth = this.loggedInUser.GenHealth;
        this.sleeptime = this.loggedInUser.SleepTime;
        this.isheartdiseaseyes = this.loggedInUser.IsHeartDiseaseYes;
        this.isstrokeyes = this.loggedInUser.IsStrokeYes;
        this.savebtnactive = true
    }

    Initialize() {
        this.weight = 0;
        this.height = 0;
        this.bmi = 0;
        this.issmokingyes = false;
        this.isalcoholdrinkingyes = false;
        this.physicalhealth = 0;
        this.mentalhealth = 0;
        this.isdiffwalkingyes = false;
        this.isphysicalactivityyes = false;
        this.genhealth = 0;
        this.sleeptime = 0;
        this.isheartdiseaseyes = false;
        this.isstrokeyes = false;
        this.savebtnactive = true
    }

    Cancel(){
        this.Initialize();
    }
    
    SaveUser() {
        this.alertService.clear()

        if (this.Validations()) {
            this.savebtnactive = false
            this.alertService.info('Please wait..')

            this.loggedInUser.Name = this.fullname.trim()
            this.loggedInUser.Username = this.username.trim()
            if (
                this.password != null &&
                this.password != undefined &&
                this.password !=  ''
            ) {
                this.loggedInUser.Password = this.password.trim()
            }
            this.loggedInUser.Phone = this.phone;
            this.userService
                .saveuser(this.loggedInUser, this.loggedInUser)
                .subscribe(
                    (data) => {
                        this.alertService.clear()
                        this.alertService.success('Successfully saved!')
                        localStorage.setItem(
                            LocalStorage.LOGGED_USER,
                            JSON.stringify(this.loggedInUser)
                        )
                        this.savebtnactive = true
                    },
                    (error) => {
                        this.alertService.clear()
                        this.alertService.error('Error!')
                    }
                )
        }
    }

    Validations() {
        this.alertService.clear()
        if (
            this.fullname == null ||
            this.fullname == undefined ||
            this.fullname == ''
        ) {
            this.alertService.error('Name is required')
            return false
        }

        var re = /\S+@\S+\.\S+/
        if (
            this.username == null ||
            this.username == undefined ||
            this.username == ''
        ) {
            this.alertService.error('Email is required')
            return false
        } else if (!re.test(this.username)) {
            this.alertService.error('Invalid email')
            return false
        }

        if (this.phone == null || this.phone == undefined) {
            this.alertService.error('Phone is required')
            return false
        }

        if (
            this.confirmpassword == null ||
            this.confirmpassword == undefined ||
            this.confirmpassword == '' ||
            this.confirmpassword != this.password
        ) {
            this.alertService.error('Please confirm the password')
            return false
        }

        return true
    }

    SaveAnalysis() {
        this.alertService.clear()

        if (this.AnalysisValidations()) {
            this.savebtnactive = false
            this.alertService.info('Please wait..')

            this.loggedInUser.Weight = this.weight;
            this.loggedInUser.Height = this.height;
            this.bmi = this.loggedInUser.BMI = this.bmi;
            this.loggedInUser.IsSmokingYes = this.issmokingyes;
            this.loggedInUser.IsAlcoholDrinkingYes = this.isalcoholdrinkingyes;
            this.loggedInUser.PhysicalHealth = this.physicalhealth;
            this.loggedInUser.MentalHealth = this.mentalhealth;
            this.loggedInUser.IsDiffWalkingYes = this.isdiffwalkingyes;
            this.loggedInUser.IsPhysicalActivityYes = this.isphysicalactivityyes;
            this.loggedInUser.GenHealth = this.genhealth;
            this.loggedInUser.SleepTime = this.sleeptime;
            this.loggedInUser.IsHeartDiseaseYes = this.isheartdiseaseyes;
            this.loggedInUser.IsStrokeYes = this.isstrokeyes;

            this.userService
                .saveanalysis(this.loggedInUser, this.loggedInUser)
                .subscribe(
                    (data) => {
                        this.alertService.clear()
                        this.alertService.success('Successfully saved!')
                        this.calculatePredictedProbability()
                        localStorage.setItem(
                            LocalStorage.LOGGED_USER,
                            JSON.stringify(this.loggedInUser)
                        )
                        this.savebtnactive = true
                    },
                    (error) => {
                        this.alertService.clear()
                        this.alertService.error('Error!')
                    }
                )
        }
    }

    AnalysisValidations() {
        this.alertService.clear()
        var re = /^\d*\.?\d*$/

        if (this.weight == null || this.weight == undefined) {
            this.alertService.error('Weight is required and should be a number')
            return false
        } else if(!re.test(this.weight.toString())){
            this.alertService.error('Weight should be a number')
            return false
        }

        if (this.height == null || this.height == undefined) {
            this.alertService.error('Height is required and should be a number')
            return false
        } else if(!re.test(this.height.toString())){
            this.alertService.error('Height should be a number')
            return false
        }

        if (this.bmi == null || this.bmi == undefined) {
            this.alertService.error('BMI is required and should be a number')
            return false
        } else if(!re.test(this.bmi.toString())){
            this.alertService.error('BMI should be a number')
            return false
        }

        if (this.mentalhealth == null || this.mentalhealth == undefined) {
            this.alertService.error('Mental health status is required and should be a number')
            return false
        } else if(!re.test(this.mentalhealth.toString())){
            this.alertService.error('Mental health status should be a number')
            return false
        }

        if (this.physicalhealth == null || this.physicalhealth == undefined) {
            this.alertService.error('Physical health status is required and should be a number')
            return false
        } else if(!re.test(this.physicalhealth.toString())){
            this.alertService.error('Physical health status should be a number')
            return false
        }

        if (this.genhealth == null || this.genhealth == undefined) {
            this.alertService.error('General health status is required')
            return false
        }

        if (this.sleeptime == null || this.sleeptime == undefined) {
            this.alertService.error('Sleep time is required and should be a number')
            return false
        } else if(!re.test(this.sleeptime.toString())){
            this.alertService.error('Sleep time should be a number')
            return false
        }

        if (this.isalcoholdrinkingyes == null || this.isalcoholdrinkingyes == undefined) {
            this.alertService.error('Alchohol drinking status is required')
            return false
        }

        if (this.issmokingyes == null || this.issmokingyes == undefined) {
            this.alertService.error('Smoking status is required')
            return false
        }

        if (this.isphysicalactivityyes == null || this.isphysicalactivityyes == undefined) {
            this.alertService.error('Physical activity status is required')
            return false
        }

        if (this.isdiffwalkingyes == null || this.isdiffwalkingyes == undefined) {
            this.alertService.error('Difficulty walking status is required')
            return false
        }

        if (this.isheartdiseaseyes == null || this.isheartdiseaseyes == undefined) {
            this.alertService.error('Heart diseases status is required')
            return false
        }

        if (this.isstrokeyes == null || this.isstrokeyes == undefined) {
            this.alertService.error('Stroke status is required')
            return false
        }
        return true
    }

    SavePredictions(predictedHeartDiseasesProbability, predictedStrokeProbability, predictedMentalDiseasesProbability, combinedProbability) {
        this.alertService.clear()
        this.predictions = new PredictionHistory()
        this.predictions.UserId = this.loggedInUser.Id;
        this.predictions.HeartDiseasesRiskProbabilty = predictedHeartDiseasesProbability;
        this.predictions.StrokeRiskProbabilty = predictedStrokeProbability;
        this.predictions.MentalDiseasesRiskProbabilty = predictedMentalDiseasesProbability;
        this.predictions.CombinedRiskProbabilty = combinedProbability;
        let year = new Date(new Date()).getFullYear()
        let month = new Date(new Date()).getMonth() + 1
        let date = new Date(new Date()).getDate()
        let tempdate = year + '-' + month + '-' + date
        this.predictions.DatePublished = tempdate;
        this.userService
            .savepredictions(this.predictions, this.loggedInUser)
            .subscribe(
                (data) => {
                    this.alertService.clear()
                    this.alertService.success('Successfully saved!')
                },
                (error) => {
                    this.alertService.clear()
                    this.alertService.error('Error!')
                }
            )
    }

//#region 'Calculations'
    calculateBMI(){
        var bmival = ""
        if(this.weight != 0 && this.weight != null && this.weight != undefined 
            && this.height != 0 && this.height != null && this.height != undefined ){
            bmival = (Number(this.weight) / (Number(this.height) * Number(this.height))).toFixed(2)
        }
        this.bmi = Number(bmival)
    }

    calculatePredictedProbability(){
        var MentalHealth = this.mentalhealth;
        var BMI = this.bmi;
        var SmokingYes = this.issmokingyes == true ? 1:0;
        var AlcoholDrinkingYes = this.isalcoholdrinkingyes == true ? 1:0;
        var PhysicalHealth = this.physicalhealth;
        var DiffWalkingYes = this.isdiffwalkingyes == true ? 1:0;
        var PhysicalActivityYes = this.isphysicalactivityyes == true ? 1:0;
        var GenHealthFair = this.genhealth == 'Fair' ? 1:0;
        var GenHealthGood = this.genhealth == 'Good' ? 1:0;
        var GenHealthPoor = this.genhealth == 'Poor' ? 1:0;
        var GenHealthVeryGood = this.genhealth == 'Very Good' ? 1:0;
        var SleepTime = this.sleeptime;
        const predictedHeartDiseasesProbability = this.predictHeartDisease(BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) * 100;
        const predictedStrokeProbability = this.predictStroke(BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) * 100;
        const predictedMentalDiseasesProbability = this.predictMentalDiseases(PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) * 100;
        const combinedProbability = this.predictCVDRisk(MentalHealth, BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) * 100;
        this.SavePredictions(predictedHeartDiseasesProbability, predictedStrokeProbability, predictedMentalDiseasesProbability, combinedProbability)
    }

    predictHeartDisease(BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) {
  
        // Coefficients from the logistic regression model
        const intercept = -4.1259703;
        const coef_BMI = -0.0035544;
        const coef_SmokingYes = 0.5021451;
        const coef_AlcoholDrinkingYes = -0.5490177;
        const coef_PhysicalHealth = 0.0015145;
        const coef_DiffWalkingYes = 0.6540042;
        const coef_PhysicalActivityYes = -0.0547622;
        const coef_GenHealthFair = 1.9985704;
        const coef_GenHealthGood = 1.420966;
        const coef_GenHealthPoor = 2.4721658;
        const coef_GenHealthVeryGood = 0.7084722;
        const coef_SleepTime = 0.0505009;
      
        // Calculate the log odds based on the coefficients and predictor values
        const logOdds = intercept +
                  BMI * coef_BMI +
                  SmokingYes * coef_SmokingYes +
                  AlcoholDrinkingYes * coef_AlcoholDrinkingYes +
                  PhysicalHealth * coef_PhysicalHealth +
                  DiffWalkingYes * coef_DiffWalkingYes +
                  PhysicalActivityYes * coef_PhysicalActivityYes +
                  GenHealthFair * coef_GenHealthFair +
                  GenHealthGood * coef_GenHealthGood +
                  GenHealthPoor * coef_GenHealthPoor +
                  GenHealthVeryGood * coef_GenHealthVeryGood +
                  SleepTime * coef_SleepTime;
      
        // Calculate the probability of heart disease using the logistic function
        const probability = 1 / (1 + Math.exp(-logOdds));
        return probability;
    }

    predictStroke(BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) {
  
        // Coefficients from the logistic regression model
        const intercept = -4.540990;
        const coef_BMI = -0.017658;
        const coef_SmokingYes = 0.307094;
        const coef_AlcoholDrinkingYes = -0.426032;
        const coef_PhysicalHealth = 0.004774;
        const coef_DiffWalkingYes = 0.970274;
        const coef_PhysicalActivityYes = -0.107860;
        const coef_GenHealthFair = 1.760029;
        const coef_GenHealthGood = 1.218661;
        const coef_GenHealthPoor = 2.093943;
        const coef_GenHealthVeryGood = 0.618886;
        const coef_SleepTime = 0.057761;
      
        // Calculate the log odds based on the coefficients and predictor values
        const logOdds = intercept +
                  BMI * coef_BMI +
                  SmokingYes * coef_SmokingYes +
                  AlcoholDrinkingYes * coef_AlcoholDrinkingYes +
                  PhysicalHealth * coef_PhysicalHealth +
                  DiffWalkingYes * coef_DiffWalkingYes +
                  PhysicalActivityYes * coef_PhysicalActivityYes +
                  GenHealthFair * coef_GenHealthFair +
                  GenHealthGood * coef_GenHealthGood +
                  GenHealthPoor * coef_GenHealthPoor +
                  GenHealthVeryGood * coef_GenHealthVeryGood +
                  SleepTime * coef_SleepTime;
      
        // Calculate the probability of stroke using the logistic function
        const probability = 1 / (1 + Math.exp(-logOdds));
        return probability;
    }

    predictMentalDiseases(PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) {
  
        // Coefficients from the logistic regression model
        const intercept = -1.6059489;
        const coef_PhysicalHealth = 0.0445812;
        const coef_DiffWalkingYes = -0.0247972;
        const coef_PhysicalActivityYes = -0.1011481;
        const coef_GenHealthFair = 1.1601883;
        const coef_GenHealthGood = 0.6975336;
        const coef_GenHealthPoor = 1.3900905;
        const coef_GenHealthVeryGood = 0.3203412;
        const coef_SleepTime = -0.1689265;
      
        // Calculate the log odds based on the coefficients and predictor values
        const logOdds = intercept +
                  PhysicalHealth * coef_PhysicalHealth +
                  DiffWalkingYes * coef_DiffWalkingYes +
                  PhysicalActivityYes * coef_PhysicalActivityYes +
                  GenHealthFair * coef_GenHealthFair +
                  GenHealthGood * coef_GenHealthGood +
                  GenHealthPoor * coef_GenHealthPoor +
                  GenHealthVeryGood * coef_GenHealthVeryGood +
                  SleepTime * coef_SleepTime;
      
        // Calculate the probability of mental health disease using the logistic function
        const probability = 1 / (1 + Math.exp(-logOdds));
        return probability;
    }

    predictCVDRisk(MentalHealth, BMI, SmokingYes, AlcoholDrinkingYes, PhysicalHealth, DiffWalkingYes, PhysicalActivityYes, GenHealthFair, GenHealthGood, GenHealthPoor, GenHealthVeryGood, SleepTime) {
  
        // Coefficients from the logistic regression model for heart diseases when having mental diseases
        const intercept_HD = -4.1159441;
        const coef_MentalHealthYes_HD = -0.3648028;
        const coef_BMI_HD = -0.0032044;
        const coef_SmokingYes_HD = 0.5113103;
        const coef_AlcoholDrinkingYes_HD = -0.5273060;
        const coef_PhysicalHealth_HD = 0.0040254;
        const coef_DiffWalkingYes_HD = 0.6543616;
        const coef_PhysicalActivityYes_HD = -0.0589297;
        const coef_GenHealthFair_HD = 2.0328350;
        const coef_GenHealthGood_HD = 1.4332654;
        const coef_GenHealthPoor_HD = 2.5366333;
        const coef_GenHealthVeryGood_HD = 0.7120793;
        const coef_SleepTime_HD = 0.0447955;
      
        // Calculate the log odds based on the coefficients and predictor values
        const logOdds_HD = intercept_HD +
                  MentalHealth * coef_MentalHealthYes_HD
                  BMI * coef_BMI_HD +
                  SmokingYes * coef_SmokingYes_HD +
                  AlcoholDrinkingYes * coef_AlcoholDrinkingYes_HD +
                  PhysicalHealth * coef_PhysicalHealth_HD +
                  DiffWalkingYes * coef_DiffWalkingYes_HD +
                  PhysicalActivityYes * coef_PhysicalActivityYes_HD +
                  GenHealthFair * coef_GenHealthFair_HD +
                  GenHealthGood * coef_GenHealthGood_HD +
                  GenHealthPoor * coef_GenHealthPoor_HD +
                  GenHealthVeryGood * coef_GenHealthVeryGood_HD +
                  SleepTime * coef_SleepTime_HD;
      
        // Calculate the probability of heart disease when having mental diseases
        const predicted_probability_heart_diseases = 1 / (1 + Math.exp(-logOdds_HD));
        
        // Coefficients from the logistic regression model for stroke when having mental diseases
        const intercept_S = -4.534221;
        const coef_MentalHealthYes_S = -0.054022;
        const coef_BMI_S = -0.017602;
        const coef_SmokingYes_S = 0.308488;
        const coef_AlcoholDrinkingYes_S = -0.42240;
        const coef_PhysicalHealth_S = 0.005160;
        const coef_DiffWalkingYes_S = 0.970069;
        const coef_PhysicalActivityYes_S = -0.108520;
        const coef_GenHealthFair_S = 1.765308;
        const coef_GenHealthGood_S = 1.220693;
        const coef_GenHealthPoor_S = 2.103452;
        const coef_GenHealthVeryGood_S = 0.619519;
        const coef_SleepTime_S = 0.056973;
      
        // Calculate the log odds based on the coefficients and predictor values
        const logOdds_S = intercept_S +
                  MentalHealth * coef_MentalHealthYes_S
                  BMI * coef_BMI_S +
                  SmokingYes * coef_SmokingYes_S +
                  AlcoholDrinkingYes * coef_AlcoholDrinkingYes_S +
                  PhysicalHealth * coef_PhysicalHealth_S +
                  DiffWalkingYes * coef_DiffWalkingYes_S +
                  PhysicalActivityYes * coef_PhysicalActivityYes_S +
                  GenHealthFair * coef_GenHealthFair_S +
                  GenHealthGood * coef_GenHealthGood_S +
                  GenHealthPoor * coef_GenHealthPoor_S +
                  GenHealthVeryGood * coef_GenHealthVeryGood_S +
                  SleepTime * coef_SleepTime_S;
      
        // Calculate the probability of heart disease when having mental diseases
        const predicted_probability_stroke = 1 / (1 + Math.exp(-logOdds_S));

        //Get the joint probability (probability of both heart disease and stroke occurring)
        const joint_probability = predicted_probability_heart_diseases * predicted_probability_stroke

        //Calculate the combined probability of either heart disease or stroke occurring
        const combined_probability = predicted_probability_heart_diseases + predicted_probability_stroke - joint_probability
        return combined_probability;
    }

//#endregion
}
