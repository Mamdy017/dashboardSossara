import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-validation',
  templateUrl: './validation.component.html',
  styleUrls: ['./validation.component.scss']
})
export class ValidationComponent implements OnInit {

  public loginForm: UntypedFormGroup;
  public show: boolean = false;

  constructor(private fb: UntypedFormBuilder) { 
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  showPassword() {
    this.show = !this.show;
  }

}
