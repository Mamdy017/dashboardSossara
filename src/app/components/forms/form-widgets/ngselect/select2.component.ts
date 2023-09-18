import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select2',
  templateUrl: './select2.component.html',
  styleUrls: ['./select2.component.scss']
})
export class Select2Component implements OnInit {
  public defaultBindingsList = [
    { value: "1", label: "Alabama", job: "Developer" },
    { value: "2", label: "Wyoming", job: "Developer" },
    { value: "3", label: "Coming", job: "Designer",disabled:true },
    { value: "4", label: "Hanry Die", job: "Designer" },
    { value: "5", label: "John Doe", job: "Designer" },
  ];
  
  public disable: boolean = false
  public selectedCity: string;
  public selectedCity1: string;
  public selectedCities: string[]=[];
  public selectedCitiesOuline: string[]=[];
  public selectgroupby: string;
  public multipleSelectedCity: string[];
  public multipleSelectedCity1: string[];
  public rtl: string[];
public dropdowns=[
  {
    buttonColor:"primary",
    defaultBindingsList:this.defaultBindingsList
  },
  {
    buttonColor:"secondary",
    defaultBindingsList:this.defaultBindingsList
  },
  {
    buttonColor:"success",
    defaultBindingsList:this.defaultBindingsList
  },
  {
    buttonColor:"info",
    defaultBindingsList:this.defaultBindingsList
  },
  {
    buttonColor:"warning",
    defaultBindingsList:this.defaultBindingsList
  },
  {
    buttonColor:"inverse",
    defaultBindingsList:this.defaultBindingsList
  },
];
  constructor() { }

  ngOnInit(): void {
  }

}
