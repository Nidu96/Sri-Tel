import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { Credentials } from '../models/credentials.model'
import { LoginService } from './login.service'
import { AlertService } from '../alert/alert.service'
import { UserService } from '../admin/dashboard/user.service'
import { LocalStorage } from '../util/localstorage.service'
import { User } from '../models/user.model'

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    public username: string = ''
    public password: string = ''
    public credentials: Credentials
    public user: User
    public loginattempts: number = 0

    constructor(
        private router: Router,
        private loginService: LoginService,
        private alertService: AlertService,
        private userService: UserService
    ) {}

    ngOnInit() {
        localStorage.setItem(LocalStorage.LANDING_BODY, '0')
    }

    LoginBtnClickEvent() {
        this.alertService.clear()
        localStorage.clear()
        if (this.loginattempts != 3) {
            this.credentials = new Credentials()
            this.credentials.Username = this.username
            this.credentials.Password = this.password

            this.alertService.info('Please wait..')
            this.loginService.authenticate(this.credentials).subscribe(
                (data) => {
                    this.alertService.clear()
                    this.user = new User()
                    if (
                        data[0] == null ||
                        data[0] == undefined ||
                        data[0] == ''
                    ) {
                        this.alertService.error('Invalid username or password')
                    } else if (data[0].Password == 'invalid') {
                        this.alertService.error(
                            'You have only ' +
                                (3 - this.loginattempts) +
                                ' attempts left'
                        )
                        this.loginattempts += 1
                    } else if (data[0].Username == 'usernotexists') {
                        this.alertService.error('User does not exists')
                    } else if (data[0].Active == 'deactive') {
                        this.alertService.error(
                            'This account is deactivated. please contact the admin to activate'
                        )
                    } else {
                        this.user = data[0]

                        this.user.Id = data[0].Id
                        this.user.Name = data[0].Name
                        this.user.Username = data[0].Username
                        if (data.password != null) {
                            this.user.Password = data[0].Password
                        }
                        this.user.Active = data[0].Active
                        this.user.UserRole = data[0].UserRole
                        this.user.Weight = data[0].Weight
                        this.user.Height = data[0].Height
                        this.user.BMI = data[0].BMI
                        this.user.IsSmokingYes = data[0].IsSmokingYes
                        this.user.IsAlcoholDrinkingYes = data[0].IsAlcoholDrinkingYes
                        this.user.PhysicalHealth = data[0].PhysicalHealth
                        this.user.MentalHealth = data[0].MentalHealth
                        this.user.IsDiffWalkingYes = data[0].IsDiffWalkingYes
                        this.user.IsPhysicalActivityYes = data[0].IsPhysicalActivityYes
                        this.user.GenHealth = data[0].GenHealth
                        this.user.SleepTime = data[0].SleepTime
                        this.user.IsHeartDiseaseYes = data[0].IsHeartDiseaseYes
                        this.user.IsStrokeYes = data[0].IsStrokeYes

                        if (this.user.UserRole == 'admin') {
                            this.router.navigateByUrl('profile')
                        } else {
                            this.router.navigateByUrl('/')
                        }
                        localStorage.setItem(
                            LocalStorage.LOGGED_USER,
                            JSON.stringify(this.user)
                        )
                        this.username = ''
                        this.password = ''
                        this.loginattempts = 0
                    }
                },
                (error) => {
                    this.alertService.clear()
                    this.alertService.error('Error!')
                }
            )
        } else {
            this.userService.getuserdata(this.user).subscribe(
                (data) => {
                    this.user.Id = data[0].Id
                    this.user.Name = data[0].Name
                    this.user.Username = data[0].Username
                    if (data.password != null) {
                        this.user.Password = data[0].Password
                    }
                    this.user.Active = data[0].Active
                    this.user.UserRole = data[0].UserRole
                    this.user.Active = 'deactive'
                    this.userService.register(this.user).subscribe(
                        (data) => {
                            this.alertService.error('This account is blocked')
                        },
                        (error) => {
                            this.alertService.clear()
                            this.alertService.error('Error!')
                        }
                    )
                },
                (error) => {
                    this.alertService.clear()
                    this.alertService.error('Error!')
                }
            )
        }
    }
}
