import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartistModule } from 'ng-chartist';
import { NgChartsModule } from 'ng2-charts';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { SharedModule } from '../../shared/shared.module';
import { ChartsRoutingModule } from './charts-routing.module';

import { ApexChartComponent } from './apex-chart/apex-chart.component';
import { ChartistComponent } from './chartist/chartist.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { GoogleComponent } from './google/google.component';
import { KnobChartComponent } from './knob-chart/knob-chart.component';

@NgModule({
  declarations: [GoogleComponent, ChartjsComponent, ChartistComponent, ApexChartComponent, KnobChartComponent],
  imports: [
    CommonModule,
    ChartsRoutingModule,
    Ng2GoogleChartsModule,
    NgChartsModule,
    ChartistModule,
    NgApexchartsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ChartModule { }
