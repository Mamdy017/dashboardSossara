import { Component } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart'

@Component({
  selector: 'app-skill-status',
  templateUrl: './skill-status.component.html',
  styleUrls: ['./skill-status.component.scss']
})
export class SkillStatusComponent {

  public skillStatus = chartData.skillStatus
}
