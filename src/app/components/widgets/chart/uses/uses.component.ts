import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-uses',
  templateUrl: './uses.component.html',
  styleUrls: ['./uses.component.scss']
})
export class UsesComponent {

  public uses = chartData.uses
}
