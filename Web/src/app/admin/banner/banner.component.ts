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
import { BannerService } from './banner.service'
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service'
import { LocalStorage } from 'src/app/util/localstorage.service'
import { NgxImageCompressService } from 'ngx-image-compress'
import { DatePipe } from '@angular/common'
import { Router } from '@angular/router'
import { Banner } from 'src/app/models/banner.model'

@Component({
    selector: 'app-banner',
    templateUrl: './banner.component.html',
    styleUrls: ['./banner.component.scss'],
})
export class BannerComponent implements OnInit {
    public loggedInUser: User
    public pbanners: number = 1
    public bannercount: number = 0
    public closeResult = ''
    public ModalRef: BsModalRef
    public banner: Banner

    //form fields
    public id: string
    public title: string
    public description: string
    public datepublished: Date
    public fileToUpload
    public image
    public showImage: boolean = false
    public valueChanged: boolean = false
    public bannerlist: Array<Banner> = []
    public savebtn: boolean = true
    public savebtnactive: boolean = true

    @ViewChild('createnewbanner', { static: false })
    createnewbanner: TemplateRef<any>

    constructor(
        private bsModalService: BsModalService,
        private bannerService: BannerService,
        private router: Router,
        private parserFormatter: NgbDateParserFormatter,
        private alertService: AlertService,
        private imageCompress: NgxImageCompressService
    ) {}

    ngOnInit() {
        this.bannerlist = []
        localStorage.setItem(LocalStorage.LANDING_BODY, '0')
        this.loggedInUser = JSON.parse(
            localStorage.getItem(LocalStorage.LOGGED_USER)
        ) as User
        if (this.loggedInUser != null && this.loggedInUser != undefined) {
            if (this.loggedInUser.UserRole != 'admin') {
                this.router.navigateByUrl('/')
            }
        }
        this.GetBanners(0)
    }

    Initialize() {
        this.id = ''
        this.title = ''
        this.description = ''
        this.image = ''
        this.showImage = false
        this.datepublished = new Date()
        this.savebtnactive = true
    }

    CreateBanner() {
        this.ModalRef = this.bsModalService.show(this.createnewbanner)
        this.savebtn = true
        this.savebtnactive = true
        this.Initialize()
    }

    SaveBanner() {
        this.alertService.clear()
        this.savebtnactive = false

        if (this.Validations()) {
            this.banner = new Banner()

            if (this.id != null && this.id != undefined && this.id != '') {
                this.banner.Id = this.id
            }
            this.banner.Title = this.title
            this.banner.Image = this.image
            this.banner.Description = this.description
            let year = new Date(this.datepublished).getFullYear()
            let month = new Date(this.datepublished).getMonth() + 1
            let date = new Date(this.datepublished).getDate()
            let tempdate = year + '-' + month + '-' + date
            this.banner.DatePublished = tempdate

            this.bannerService
                .savebanner(this.banner, this.loggedInUser)
                .subscribe(
                    (data) => {
                        this.alertService.success('Successfully saved!')
                        this.CloseModal()
                        this.bannerlist = []
                        this.GetBanners(0)
                        this.Initialize()
                    },
                    (error) => {
                        this.alertService.clear()
                        this.alertService.error('Error!')
                        this.savebtnactive = true
                    }
                )
        } else {
            this.savebtnactive = true
        }
    }

    Validations() {
        this.alertService.clear()
        if (this.title == null || this.title == undefined || this.title == '') {
            this.alertService.error('Title is required')
            return false
        }

        if (this.image == null || this.image == undefined || this.image == '') {
            this.alertService.error('Image is required')
            return false
        }
        return true
    }

    CloseModal() {
        this.ModalRef.hide()
        this.Initialize()
    }

    GetBanners(startlimit) {
        this.bannerService.getbanners(startlimit, '10').subscribe(
            (data) => {
                data.forEach((element) => {
                    var i = this.bannerlist.findIndex(
                        (x) => x.Id === element.Id
                    )
                    if (
                        this.bannerlist.findIndex((x) => x.Id === element.Id) ==
                        -1
                    ) {
                        this.bannerlist.push(element)
                    }
                })
            },
            (error) => {
                this.alertService.clear()
                this.alertService.error('Error!')
            }
        )
    }

    ViewBanner(id: string) {
        this.alertService.clear()
        this.banner = new Banner()
        this.banner.Id = id
        this.bannerService.getbannerdata(this.banner).subscribe(
            (data) => {
                this.banner = data[0]

                this.id = data[0].Id
                this.title = data[0].Title
                this.image = data[0].Image
                this.description = data[0].Description
                this.datepublished = new Date(data[0].DatePublished)
                this.showImage = true

                this.ModalRef = this.bsModalService.show(this.createnewbanner)
                this.savebtn = false
            },
            (error) => {
                this.alertService.clear()
                this.alertService.error('Error!')
            }
        )
    }

    EditBanner(id: string) {
        this.alertService.clear()
        this.banner = new Banner()
        this.banner.Id = id
        this.bannerService.getbannerdata(this.banner).subscribe(
            (data) => {
                this.banner = data[0]

                this.id = data[0].Id
                this.title = data[0].Title
                this.image = data[0].Image
                this.description = data[0].Description
                this.datepublished = new Date(data[0].DatePublished)
                this.showImage = true

                this.ModalRef = this.bsModalService.show(this.createnewbanner)
                this.savebtn = true
            },
            (error) => {
                this.alertService.clear()
                this.alertService.error('Error!')
            }
        )
    }

    DeleteBanner(id: string, image: string) {
        if (confirm('Are you sure you want to delete this Banner?')) {
            this.alertService.clear()
            this.banner = new Banner()
            this.banner.Id = id
            this.banner.Image = image
            this.bannerService
                .deletebanner(this.banner, this.loggedInUser)
                .subscribe(
                    (data) => {
                        this.alertService.success('Successfully deleted!')
                        this.bannerlist = []
                        this.GetBanners(0)
                    },
                    (error) => {
                        this.alertService.clear()
                        this.alertService.error('Error!')
                    }
                )
        }
    }

    FileUpload(event: any) {
        this.fileToUpload = null
        let data: any
        data = event.target.files[0]
        if (data != null && data != undefined) {
            this.fileToUpload = data
            var reader = new FileReader()
            reader.readAsDataURL(data) // read file as data url
            reader.onload = (e) => {
                // called once readAsDataURL is completed
                this.image = (<FileReader>e.target).result
                this.showImage = true

                this.imageCompress
                    .compressFile(this.image, -1, 50, 50)
                    .then((result) => {
                        this.image = result
                        console.warn(
                            'Size in bytes is now:',
                            this.image.byteCount(result)
                        )
                    })
            }
            this.valueChanged = true
        }
    }

    pagination(event) {
        if (this.bannercount < event) {
            var tempcount = Math.abs(event - 1.5) * 10
            if (event == 1) tempcount = 0
            this.GetBanners(tempcount)
        }
        this.pbanners = event
        this.bannercount = event
    }
}
