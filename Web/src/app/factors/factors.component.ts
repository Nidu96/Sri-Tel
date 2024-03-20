import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import * as AOS from 'aos'
import { AlertService } from '../alert/alert.service'
import { User } from '../models/user.model'
import { LocalStorage } from '../util/localstorage.service'
import { FactorsService } from './factors.service'

@Component({
    selector: 'app-factors',
    templateUrl: './factors.component.html',
    styleUrls: ['./factors.component.scss'],
})
export class FactorsComponent implements OnInit {
    public user: User
    public loggedInUser: User

    constructor(
        private router: Router,
        private alertService: AlertService,
        private factorsService: FactorsService
    ) {}

    ngOnInit() {
        AOS.init()
        if (this.router.url === '/factors') {
            document.body.style.backgroundImage =
                "url('assets/images/factors/factorsbanner2.jpg')"
            document.body.className = 'products-body'
        }
        this.loggedInUser = JSON.parse(
            localStorage.getItem(LocalStorage.LOGGED_USER)
        ) as User
    }
}
