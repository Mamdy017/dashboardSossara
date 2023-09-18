import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';

@Component({
  selector: 'app-base-inputs',
  templateUrl: './base-inputs.component.html',
  styleUrls: ['./base-inputs.component.scss']
})
export class BaseInputsComponent implements OnInit {
  options$: Observable<number[]>;
  constructor() {
    this.options$=of([1,2,3,4,5,6]);
   }

  ngOnInit(): void {
  }

}
