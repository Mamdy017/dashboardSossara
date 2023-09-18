import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { LoginService } from "src/app/services/login.service";
import { StorageService } from "src/app/services/sotarage.service";
import { environment } from "src/environments/environment";
const URL_PHOTO = environment.Url_PHOTO;
@Component({
  selector: "app-my-account",
  templateUrl: "./my-account.component.html",
  styleUrls: ["./my-account.component.scss"],
})
export class MyAccountComponent implements OnInit {
  public userName: string;
  public profileImg: "assets/images/dashboard/profile.jpg";
  connexionReussi = false;
  connexionEchoue = false;
  currentUser: any;


  constructor(public router: Router, private storage:StorageService, private connexion: LoginService,) {

  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  ngOnInit() {
    if (this.storage.connexionReussi()) {
      this.connexionReussi = true;
      // this.roles = this.storage.recupererUser().roles;
    }

    this.currentUser = this.storage.recupererUser();

    console.log("mes donnees", this.currentUser)
  }

  
  logoutFunc(): void {
    this.connexion.logout().subscribe({
      next: res => {
        this.storage.clean();
        this.router.navigateByUrl('auth/login');
      },
      error: err => {
      }
    });
  }
}
