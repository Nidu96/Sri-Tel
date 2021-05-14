import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {NgbDate, NgbModal, ModalDismissReasons, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { BsModalService,BsModalRef}   from 'ngx-bootstrap/modal';
import { SystemUser } from 'src/app/models/systemuser.model';
import { AlertService } from 'src/app/alert/alert.service';
import { AccessControlService } from './access-control.service';
import { DatepickerServiceInputs } from '@ng-bootstrap/ng-bootstrap/datepicker/datepicker-service';
import { AccessControl } from 'src/app/models/accesscontrol.mode';

@Component({
  selector: 'app-access-control',
  templateUrl: './access-control.component.html',
  styleUrls: ['./access-control.component.scss']
})
export class AccessControlComponent implements OnInit {

  public closeResult = '';
  public ModalRef : BsModalRef;
  public accesscontrol: AccessControl;

  //form fields
  public id: string;
  public hyperlink: string;
  public systemname: string;
  public status: string;
  public accesscontrollist: Array<AccessControl> = []
  public savebtn: boolean = true

  @ViewChild('createnewaccesscontrol', {static: false}) createnewaccesscontrol: TemplateRef<any>
  
  constructor(private bsModalService :BsModalService, private accesscontrolService: AccessControlService, 
    private parserFormatter: NgbDateParserFormatter, private alertService: AlertService) { }

  ngOnInit() {
    this.GetAccessControls()
  }

  Initialize(){
    this.id = "";
    this.hyperlink = "";
    this.systemname = "";
  }

  CreateAccessControl() {
    this.ModalRef = this.bsModalService.show(this.createnewaccesscontrol)
    this.savebtn = true
    this.Initialize()
  }

  SaveAccessControl(){
    this.alertService.clear()

    if(this.Validations()){
      this.accesscontrol = new AccessControl();

      if(this.id != null && this.id != undefined && this.id != ""){
        this.accesscontrol.Id = this.id.trim();
      }
      this.accesscontrol.Hyperlink = this.hyperlink.trim();
      this.accesscontrol.SystemName = this.systemname.trim();
      this.accesscontrol.Enabled = this.status.trim();

      this.accesscontrolService.saveaccesscontrol(this.accesscontrol).subscribe(data => {
        this.alertService.success('Successfully saved!')
        this.CloseModal()
        this.GetAccessControls()
        this.Initialize()
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }
  }


  Validations(){
    this.alertService.clear()
    if(this.systemname == null || this.systemname == undefined || this.systemname == ""){
      this.alertService.error('SystemName is required')
      return false
    }

    if(this.hyperlink == null || this.hyperlink == undefined || this.hyperlink == ""){
      this.alertService.error('Hyperlink is required')
      return false
    }

    if(this.status == null || this.status == undefined || this.status == ""){
      this.alertService.error('Status is required')
      return false
    }

    return true
  }

  CloseModal(){
    this.ModalRef.hide();
    this.Initialize()
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

  ViewAccessControl(id: string){
    this.alertService.clear()
    this.accesscontrol = new AccessControl();
    this.accesscontrol.Id = id
    this.accesscontrolService.getaccesscontroldata(this.accesscontrol).subscribe(data => {
      this.accesscontrol = data

      this.id = data.id.trim();
      this.hyperlink = data.hyperlink.trim();
      this.systemname = data.systemName.trim();
      this.status = data.enabled.trim();

      this.ModalRef = this.bsModalService.show(this.createnewaccesscontrol)
      this.savebtn = false
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  EditAccessControl(id: string){
    this.alertService.clear()
    this.accesscontrol = new AccessControl();
    this.accesscontrol.Id = id
    this.accesscontrolService.getaccesscontroldata(this.accesscontrol).subscribe(data => {
      this.accesscontrol = data

      this.id = data.id.trim();
      this.hyperlink = data.hyperlink.trim();
      this.systemname = data.systemName.trim();
      this.status = data.enabled.trim();

      this.ModalRef = this.bsModalService.show(this.createnewaccesscontrol)
      this.savebtn = true
    },
    error => {
      this.alertService.clear() 
      this.alertService.error('Error!')
    });
  }

  DeleteAccessControl(id: string){
    if(confirm("Are you sure you want to delete this access control?")){
      this.alertService.clear()
      this.accesscontrol = new AccessControl();
      this.accesscontrol.Id = id
      this.accesscontrolService.deleteaccesscontrol(this.accesscontrol).subscribe(data => {
        this.alertService.success('Successfully deleted!')
        this.GetAccessControls()
      },
      error => {
        this.alertService.clear() 
        this.alertService.error('Error!')
      });
    }
  }
}

