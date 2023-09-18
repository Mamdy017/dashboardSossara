import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ArchwizardModule } from 'angular-archwizard';
import { SharedModule } from '../../shared/shared.module';
import { BaseInputsComponent } from './form-controls/base-inputs/base-inputs.component';
import { CheckboxRadioComponent } from './form-controls/checkbox-radio/checkbox-radio.component';
import { FormValidationComponent } from './form-controls/form-validation/form-validation.component';
import { InputGroupsComponent } from './form-controls/input-groups/input-groups.component';
import { MegaOptionsComponent } from './form-controls/mega-options/mega-options.component';
import { DefaultFormComponent } from './form-Layouts/default-form/default-form.component';
import { FormWizardFourComponent } from './form-Layouts/form-wizard-four/form-wizard-four.component';
import { FormWizardThreeComponent } from './form-Layouts/form-wizard-three/form-wizard-three.component';
import { FormWizardTwoComponent } from './form-Layouts/form-wizard-two/form-wizard-two.component';
import { FormWizardComponent } from './form-Layouts/form-wizard/form-wizard.component';
import { ClipboardComponent } from './form-widgets/clipboard/clipboard.component';
import { Select2Component } from './form-widgets/ngselect/select2.component';
import { SwitchComponent } from './form-widgets/switch/switch.component';
import { TouchspinComponent } from './form-widgets/touchspin/touchspin.component';
import { FormsRoutingModule } from './forms-routing.module';


@NgModule({
  declarations: [
    FormValidationComponent,
    CheckboxRadioComponent,
    InputGroupsComponent,
    MegaOptionsComponent,
    BaseInputsComponent,
    TouchspinComponent,
    Select2Component,
    SwitchComponent,
    ClipboardComponent,
    DefaultFormComponent,
    FormWizardComponent,
    FormWizardTwoComponent,
    FormWizardThreeComponent,
    FormWizardFourComponent,
  ],

  imports: [
    CommonModule,
    FormsRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    NgbModule,
    ArchwizardModule,
    SharedModule,
    NgSelectModule,
  ]
})
export class FormModule { }
