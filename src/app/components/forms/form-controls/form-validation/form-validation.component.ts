import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-validation',
  templateUrl: './form-validation.component.html',
  styleUrls: ['./form-validation.component.scss']
})
export class FormValidationComponent implements OnInit {
  public validate = false;
  public tooltipValidation = false;
  constructor() { }

  ngOnInit(): void {
  }
   
  public submit() {
    this.validate = !this.validate;
  }
  public tooltipSubmit() {
    this.tooltipValidation = !this.tooltipValidation;
  }

}
