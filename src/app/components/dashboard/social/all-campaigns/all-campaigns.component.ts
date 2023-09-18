import { Component } from '@angular/core';

@Component({
  selector: 'app-all-campaigns',
  templateUrl: './all-campaigns.component.html',
  styleUrls: ['./all-campaigns.component.scss']
})
export class AllCampaignsComponent {

  public show: boolean = false 

  toggle() {
    this.show = !this.show
  }
  
  public campaigns = [
    {
      colorClass: "facebook",
      icon: "facebook",
      name: "Jane Cooper",
      country: "UK",
      growth: "45.6",
      growthArrow: "trending-up",
      amount: "9,786",
      badge: "Active"
    },
    {
      colorClass: "instagram",
      icon: "instagram",
      name: "Floyd Miles",
      country: "DE",
      growth: "12.3",
      growthArrow: "trending-down",
      amount: "19,7098",
      badge: "Active"
    },
    {
      colorClass: "pinterest",
      icon: "pinterest",
      name: "Guy Hawkins",
      country: "ES",
      growth: "65.6",
      growthArrow: "trending-up",
      amount: "90,986",
      badge: "Active"
    },
    {
      colorClass: "twitter",
      icon: "twitter",
      name: "Travis Wright",
      country: "ES",
      growth: "35.6",
      growthArrow: "trending-down",
      amount: "23,654",
      badge: "Inactive"
    },
    {
      colorClass: "you-tube",
      icon: "youtube-play",
      name: "Mark Green",
      country: "UK",
      growth: "45.6",
      growthArrow: "trending-up",
      amount: "12,796",
      badge: "Inactive"
    },
  ]
}
