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

@Component({
    selector: 'app-analysis-history',
    templateUrl: './analysis-history.component.html',
    styleUrls: ['./analysis-history.component.scss'],
})
export class AnalysisHistoryComponent implements OnInit {
    public loggedInUser: User
    ppredictions: number = 1
    public historycount: number = 0
    public closeResult = ''
    public ModalRef: BsModalRef
    public user: User

    //form fields
    public id: string
    public predictionslist: Array<PredictionHistory> = []

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
        this.userService.getpredictions(startlimit, '10', this.loggedInUser).subscribe(
            (data) => {
                this.predictionslist = data
            },
            (error) => {
                this.alertService.clear()
                this.alertService.error('Error!')
            }
        )
    }

    DeletePrediction(id: string) {
        if (confirm('Are you sure you want to delete this Banner?')) {
            this.alertService.clear()
            this.userService
                .deleteprediction(id, this.loggedInUser)
                .subscribe(
                    (data) => {
                        this.alertService.success('Successfully deleted!')
                        this.predictionslist = []
                        this.GetPedictions(0)
                    },
                    (error) => {
                        this.alertService.clear()
                        this.alertService.error('Error!')
                    }
                )
        }
    }

    pagination(event) {
        if (this.historycount < event) {
            var tempcount = Math.abs(event - 1.5) * 10
            if (event == 1) tempcount = 0
            this.GetPedictions(tempcount)
        }
        this.ppredictions = event
        this.historycount = event
    }
}
