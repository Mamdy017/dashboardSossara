import { Component } from '@angular/core';
import * as data from '../../../../shared/data/dashboard/social'
@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent {

  public facebook = data.facebook
  public instagram = data.instagram
  public twitter = data.twitter

  public photoClicks = data.photoClicks
  public likeClicks = data.likeClicks

}
