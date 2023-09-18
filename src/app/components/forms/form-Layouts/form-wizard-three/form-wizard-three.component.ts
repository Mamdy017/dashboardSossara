import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MustMatch } from '../../../../shared/validators/passwordMatch';

@Component({
  selector: 'app-form-wizard-three',
  templateUrl: './form-wizard-three.component.html',
  styleUrls: ['./form-wizard-three.component.scss']
})
export class FormWizardThreeComponent implements OnInit {
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(
    private _formBuilder: FormBuilder,
    private toaster: ToastrService
  ) { }


  ngOnInit(): void {
    this.firstFormGroup = this._formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      cnfPassword: ['', Validators.required],
    },
      {
        validator: MustMatch('password', 'cnfPassword')
      });
    this.thirdFormGroup = this._formBuilder.group({
      dd: [null, [Validators.required, Validators.pattern('[0-9]{2}')]],
      mm: [null, [Validators.required, Validators.pattern('[0-9]{2}')]],
      yyyy: [null, [Validators.required, Validators.pattern('[0-9]{4}')]],
    })
  }
  public finish() {
    this.toaster.success('Successfully Registered')
  }
}