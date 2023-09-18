import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-login-tool-tip',
  templateUrl: './tool-tip.component.html',
  styleUrls: ['./tool-tip.component.scss']
})
export class ToolTipComponent implements OnInit {

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
