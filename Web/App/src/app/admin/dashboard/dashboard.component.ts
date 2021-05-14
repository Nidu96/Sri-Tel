import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser, SystemPermissions } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { UserService } from './user.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { AccessControlService } from '../access-control/access-control.service';
import { AccessControl } from 'src/app/models/accesscontrol.mode';
import { LocalStorage } from 'src/app/util/localstorage.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public closeResult = '';
  public ModalRef : BsModalRef;
  public user: SystemUser;

  //form fields
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
  public savebtn: boolean = true

  @ViewChild('createnewuser', {static: false}) createnewuser: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private userService: UserService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService,
    private accesscontrolService: AccessControlService) { }

  ngOnInit() {
    this.GetUsers()
    this.GetAccessControls()
  }

  Initialize(){
    this.id = "";
    this.fullname = "";
    this.nic = "";
    //this.dob = new NgbDate(00,00,0000);
    this.address = "";
    this.username = "";
    this.phone = "";
    this.status = ""
    this.userrole = ""
    this.permissionlist = []
  }

  CreateUser() {
    this.ModalRef = this.bsModalService.show(this.createnewuser)
    this.savebtn = true
    this.Initialize()
    this.CreatePermittedSystemList()
  }

  SaveUser(){
    this.alertService.clear()

    if(this.Validations()){
      this.alertService.info('Please wait..')
      this.user = new SystemUser();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.user.Id = this.id.trim();
      }
      this.user.Name = this.fullname.trim();
      this.user.NIC = this.nic.trim();
      if(this.dob != undefined){
        this.user.DOB = this.parserFormatter.format(this.dob).trim();
      }
      this.user.Address = this.address.trim();
      this.user.Username = this.username.trim();
      if(this.password != null && this.password != undefined && this.password != ""){
        this.user.Password = this.password.trim();
      }
      this.user.Phone = this.phone.trim();
      this.user.Active = this.status.trim();
      this.user.UserRole = this.userrole.trim();
      this.user.PermissionsList = this.permissionlist;
  
      setTimeout(() => { 
        this.userService.saveuser(this.user).subscribe(data => {
          this.alertService.clear()
          this.alertService.success('Successfully saved!')
          this.CloseModal()
          this.GetUsers()
          this.Initialize()
        },
        error => { 
          this.alertService.clear()
          this.alertService.error('Error!')
        });
      }, 50);
    }
  }

  Validations(){
    this.alertService.clear()
    if(this.fullname == null || this.fullname == undefined || this.fullname == ""){
      this.alertService.error('Name is required')
      return false
    }

    if(this.nic == null || this.nic == undefined || this.nic == ""){
      this.alertService.error('NIC is required')
      return false
    }

    if(this.dob == null || this.dob == undefined){
      this.alertService.error('Date of birth is required')
      return false
    }

    if(this.address == null || this.address == undefined || this.address == ""){
      this.alertService.error('Address is required')
      return false
    }

    var re = /\S+@\S+\.\S+/;
    if(this.username == null || this.username == undefined || this.username == ""){
      this.alertService.error('Email is required')
      return false
    }else if(!re.test(this.username)){
      this.alertService.error('Invalid email')
      return false
    }

    if(this.phone == null || this.phone == undefined || this.phone == ""){
      this.alertService.error('Phone is required')
      return false
    }

    if(this.status == null || this.status == undefined || this.status == ""){
      this.alertService.error('Status is required')
      return false
    }

    if(this.userrole == null || this.userrole == undefined || this.userrole == ""){
      this.alertService.error('User Role is required')
      return false
    }

    if(this.permissionlist == null || this.permissionlist == undefined || this.permissionlist.length == 0){
      this.alertService.error('Select atleast one system')
      return false
    }

    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
  }


  GetUsers(){
    this.userService.getusers().subscribe(data => {
      this.userlist = data
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  ViewUser(id: string){
    this.alertService.clear()
    this.user = new SystemUser();
    this.user.Id = id
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data

      this.id = data.id.trim();
      this.fullname = data.name.trim();
      this.nic = data.nic.trim();
      this.dob = new NgbDate(parseInt(data.dob.split('-')[0]), parseInt(data.dob.split('-')[1]),
      parseInt(data.dob.split('-')[2]))
      this.address = data.address.trim();
      this.username = data.username.trim();
      this.phone = data.phone.trim();
      this.status = data.active.trim();
      this.userrole = data.userRole.trim();
      data.permissionsList.forEach((permission:any) => { 
        this.permissionlist.push({UserId: permission.userId, SystemId: permission.systemId});
      });
      this.CreatePermittedSystemList()
      
      this.ModalRef = this.bsModalService.show(this.createnewuser)
      this.savebtn = false
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  EditUser(id: string){
    this.alertService.clear()
    this.user = new SystemUser();
    this.user.Id = id
    this.userService.getuserdata(this.user).subscribe(data => {
      this.user = data

      this.id = data.id.trim();
      this.fullname = data.name.trim();
      this.nic = data.nic.trim();
      this.dob = new NgbDate(parseInt(data.dob.split('-')[0]), parseInt(data.dob.split('-')[1]),
      parseInt(data.dob.split('-')[2]))
      this.address = data.address.trim();
      this.username = data.username.trim();
      this.password = data.password.trim();
      this.phone = data.phone.trim();
      this.status = data.active.trim();
      this.userrole = data.userRole.trim();
      data.permissionsList.forEach((permission:any) => { 
        this.permissionlist.push({UserId: permission.userId, SystemId: permission.systemId});
      });

      this.CreatePermittedSystemList()

      this.ModalRef = this.bsModalService.show(this.createnewuser)
      this.savebtn = true
    },
    error => { 
      this.alertService.clear()
      this.alertService.error('Error!')
    });
  }

  DeleteUser(id: string){
    this.alertService.clear()
    let tmpuser = JSON.parse(localStorage.getItem(LocalStorage.LOGGED_USER)) as SystemUser;
    if(tmpuser.Id == id){
      this.alertService.error('Cannot delete the logged in user')
    }else{
      if(confirm("Are you sure you want to delete this user?")){
        this.alertService.clear()
        this.user = new SystemUser();
        this.user.Id = id
        this.userService.deleteuser(this.user).subscribe(data => {
          this.alertService.success('Successfully deleted!')
          this.GetUsers()
        },
        error => { 
          this.alertService.clear()
          this.alertService.error('Error!')
        });
      }
    }
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

  SelectedSystem(event: any, systemid: string){
    if(this.permissionlist == undefined){
      this.permissionlist = [];
    }else{
      if(event.target.checked == false){
        this.permissionlist.splice(this.permissionlist.indexOf({UserId: this.id, SystemId: systemid}), 1);
      }else{
        this.permissionlist.push({UserId: this.id, SystemId: systemid});
      }
      
    }
  }

  CreatePermittedSystemList(){
    this.syslist = []
    if(this.accesscontrollist != undefined){
        this.accesscontrollist.forEach((accesscontrol:any) => { 
          if(accesscontrol.enabled == "enable"){
            this.syslist.push({Id: accesscontrol.id, Hyperlink: accesscontrol.hyperlink, SystemName: accesscontrol.systemName
              , Enabled: accesscontrol.enabled, Checked: false})
          }
        }); 
    }
    if(this.permissionlist != null && this.permissionlist != undefined){
        this.permissionlist.forEach((permission:any) => { 
          this.syslist.forEach((sys:any) => { 
            if(permission.SystemId == sys.Id){
              sys.Checked = true
            }
          }); 
        });
    }
    return this.syslist;
  }
}
