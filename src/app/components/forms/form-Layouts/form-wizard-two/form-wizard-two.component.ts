import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-form-wizard-two',
  templateUrl: './form-wizard-two.component.html',
  styleUrls: ['./form-wizard-two.component.scss']
})
export class FormWizardTwoComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  maxDate: Date;
 
  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService
  ) {
    this.maxDate = new Date();
   }


  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required,Validators.email]],
      password: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      birthdate: [null, Validators.required],
      hasPassport: ['', Validators.required],
    })
    this.fourthFormGroup = this._formBuilder.group({
      state: ['', Validators.required],
      city: ['', Validators.required],
    })
  }
  public finish(){
    this.toaster.success('Successfully Registered')
  }

   
}