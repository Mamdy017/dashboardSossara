import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-components',
  templateUrl: './table-components.component.html',
  styleUrls: ['./table-components.component.scss']
})
export class TableComponentsComponent implements OnInit {

  public numbers = [1, 2, 3, 4, 5];
  
  constructor() { }

  ngOnInit(): void {
  }

}
