import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StorageService } from "src/app/services/sotarage.service";

@Component({
  selector: "app-crypto",
  templateUrl: "./crypto.component.html",
  styleUrls: ["./crypto.component.scss"],
})
export class CryptoComponent implements OnInit {
  connexionReussi = false;
  connexionEchoue = false;
  currentUser: any;

  constructor(public router: Router, private storage: StorageService) {
 
  }

  ngOnInit() {
    if (this.storage.connexionReussi()) {
      this.connexionReussi = true;
      // this.roles = this.storage.recupererUser().roles;
    }

    this.currentUser = this.storage.recupererUser();
    // console.log("mes donnees au de la du formulaire", this.currentUser);
  }
}
