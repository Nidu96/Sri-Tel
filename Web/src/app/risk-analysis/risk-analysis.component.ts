import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import {
    NgbDate,
    NgbModal,
    ModalDismissReasons,
    NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap'
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal'
import { AlertService } from 'src/app/alert/alert.service'
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service'
import { LocalStorage } from 'src/app/util/localstorage.service'
import * as AOS from 'aos'
import { Router } from '@angular/router'
import { User } from '../models/user.model'
import { UserService } from '../admin/dashboard/user.service'
import { PredictionHistory } from '../models/prediction-history.model'
import { Chart } from 'angular-highcharts';

@Component({
    selector: 'app-risk-analysis',
    templateUrl: './risk-analysis.component.html',
    styleUrls: ['./risk-analysis.component.scss'],
})
export class RiskAnalysisComponent implements OnInit {
    public loggedInUser: User
    public user: User

    //form fields
    public id: string
    public predictionslist: Array<PredictionHistory> = []
    public heartdiseasesriskchart: any;
    public strokeriskchart: any;
    public mentaldiseasesriskchart: any;
    public combinedriskchart: any;

    constructor(
        private bsModalService: BsModalService,
        private userService: UserService,
        private router: Router,
        private parserFormatter: NgbDateParserFormatter,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        AOS.init()
        localStorage.setItem(LocalStorage.LANDING_BODY, '0')
        this.loggedInUser = JSON.parse(
            localStorage.getItem(LocalStorage.LOGGED_USER)
        ) as User
        this.GetPedictions(0)
    }

    GetPedictions(startlimit) {
        this.userService.getpredictions(startlimit, '1', this.loggedInUser).subscribe(
            (data) => {
                this.predictionslist = data
                this.CreateHeartDiseaseRiskChart()
                this.CreateStrokeRiskChart()
                this.CreateMentalDiseaseRiskChart()
                this.CreateCombinedRiskChart()
            },
            (error) => {
                this.alertService.clear()
                this.alertService.error('Error!')
            }
        )
    }

//#region charts
    CreateHeartDiseaseRiskChart(){
        var data: Number = this.predictionslist[0].HeartDiseasesRiskProbabilty
        var heartdiseasesyes = parseFloat(data.toFixed(2).toString())
        var heartdiseasesno = parseFloat((100 - parseFloat(data.toString())).toFixed(2).toString())
        var heartdiseasearr = [{name: "High", y: heartdiseasesyes},{name: "Low", y: heartdiseasesno}]
        this.heartdiseasesriskchart = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                style: {
                    font: '14px "Eagle"'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %', 
                        distance: -30,
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textOutline: '0px contrast',
                        }
                    },
                    showInLegend: true
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            colors: ['#c670e6', '#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            series: [{
                name: 'Heart Diseases Risk',
                colorByPoint: true,
                type: undefined,
                data: heartdiseasearr
            }]
        });
        
    }

    CreateStrokeRiskChart(){
        var data: Number = this.predictionslist[0].StrokeRiskProbabilty
        var strokeyes = parseFloat(data.toFixed(2).toString())
        var strokeno = parseFloat((100 - parseFloat(data.toString())).toFixed(2).toString())
        var strokearr = [{name: "High", y: strokeyes},{name: "Low", y: strokeno}]
        this.strokeriskchart = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                style: {
                    font: '14px "Eagle"'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %', 
                        distance: -30,
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textOutline: '0px contrast',
                        }
                    },
                    showInLegend: true
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            colors: ['#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            series: [{
                name: 'Stroke Risk',
                colorByPoint: true,
                type: undefined,
                data: strokearr
            }]
        });
        
    }

    CreateMentalDiseaseRiskChart(){
        var data: Number = this.predictionslist[0].MentalDiseasesRiskProbabilty
        var mentaldiseasesyes = parseFloat(data.toFixed(2).toString())
        var mentaldiseasesno = parseFloat((100 - parseFloat(data.toString())).toFixed(2).toString())
        var mentaldiseasearr = [{name: "High", y: mentaldiseasesyes},{name: "Low", y: mentaldiseasesno}]
        this.mentaldiseasesriskchart = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                style: {
                    font: '14px "Eagle"'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %', 
                        distance: -30,
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textOutline: '0px contrast',
                        }
                    },
                    showInLegend: true
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            colors: ['#DDDF00', '#24CBE5', '#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            series: [{
                name: 'Mental Diseases Risk',
                colorByPoint: true,
                type: undefined,
                data: mentaldiseasearr
            }]
        });
        
    }

    CreateCombinedRiskChart(){
        var data: Number = this.predictionslist[0].CombinedRiskProbabilty
        var combinedriskyes = parseFloat(data.toFixed(2).toString())
        var combinedriskno = parseFloat((100 - parseFloat(data.toString())).toFixed(2).toString())
        var combinedriskarr = [{name: "High", y: combinedriskyes},{name: "Low", y: combinedriskno}]
        this.combinedriskchart = new Chart({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: '',
                style: {
                    font: '14px "Eagle"'
                }
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %', 
                        distance: -30,
                        style: {
                            fontSize: '12px',
                            fontWeight: 'bold',
                            textOutline: '0px contrast',
                        }
                    },
                    showInLegend: true
                }
            },
            legend: {
                enabled: true,
                verticalAlign: 'bottom'
            },
            colors: ['#64E572', '#FF9655', '#FFF263', '#6AF9C4'],
            series: [{
                name: 'Cardiovascular Diseases Risk When having Mental Illnesses',
                colorByPoint: true,
                type: undefined,
                data: combinedriskarr
            }]
        });
        
    }
//#endregion
}
