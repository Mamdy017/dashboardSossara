import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-average',
  templateUrl: './average.component.html',
  styleUrls: ['./average.component.scss']
})
export class AverageComponent {

  @Input() data: any

  constructor() {
    
  }
}
