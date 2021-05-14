import { Component, OnInit } from '@angular/core';
import { AccessControl } from '../models/accesscontrol.mode';
import { SystemPermissions, SystemUser } from '../models/systemuser.model';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from '../admin/dashboard/user.service';
import { AccessControlService } from '../admin/access-control/access-control.service';
import { AlertService } from '../alert/alert.service';
import { LocalStorage } from '../util/localstorage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  public user: SystemUser;
  public id: string;
  public fullname: string;
  public nic: string;
  public dob: NgbDate;
  public phone: string;
  public address: string;
  public username: string;
  public password: string;
  public status: string;
  public userrole: string;
  public accesscontrollist: Array<AccessControl>
  public permissionlist: Array<SystemPermissions> = []
  public userlist: Array<SystemUser> = []
  public syslist: Array<any>;
  
  constructor(private bsModalService :BsModalService, private userService: UserService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,
    private accesscontrolService: AccessControlService) { }

  ngOnInit() {
    this.GetAccessControls()
    this.GetUser()
  }

  GetAccessControls(){
    this.accesscontrolService.getaccesscontrols().subscribe(data => {
      this.accesscontrollist = data
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  GetUser(){
    this.alertService.clear()
    this.user  = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data

      this.id = data.id.trim();
      this.fullname = data.name.trim();
      this.nic = data.nic.trim();
      this.dob = data.dob
      this.address = data.address.trim();
      this.username = data.username.trim();
      this.password = data.password.trim();
      this.phone = data.phone.trim();
      this.status = data.active.trim();
      this.userrole = data.userRole.trim();
      this.permissionlist = data.permissionsList
      this.CreatePermittedSystemList()

    },
    error => {
      this.alertService.clear() 
      this.alertService.error('No data found')
    });
  }

  CreatePermittedSystemList(){
    this.syslist = []
    if(this.permissionlist != undefined && this.accesscontrollist != undefined){
      this.permissionlist.forEach((permission:any) => { 
        this.accesscontrollist.forEach((accesscontrol:any) => { 
          if(permission.systemId == accesscontrol.id && accesscontrol.enabled == "enable"){
            this.syslist.push({Id: accesscontrol.id, Hyperlink: accesscontrol.hyperlink, SystemName: accesscontrol.systemName
              , Enabled: accesscontrol.enabled, Checked: true})
          }
        }); 
      }); 
    }
    return this.syslist;
  }

}
