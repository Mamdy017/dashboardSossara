import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/sotarage.service';
import { environment } from "src/environments/environment";
const URL_PHOTO = environment.Url_PHOTO;
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss'],
})
export class EditProfileComponent implements OnInit {

  public myProfile: FormGroup;
  public editProfile: UntypedFormGroup;

  connexionReussi = false;
  connexionEchoue = false;
  currentUser: any;
  public show: boolean = false;
  public showcn: boolean = false;
  public last: boolean = false;
  
  constructor(private fb: UntypedFormBuilder,public router: Router, private storage:StorageService, private connexion: LoginService) { 
    this.editProfile = this.fb.group({
      password: ["", Validators.required],
      lastPassword: ["", Validators.required],
      cnPpassword: ["", Validators.required],
    });
  }

  ngOnInit(): void {

    this.monProfil();
    // this.modifierProfil();
    if (this.storage.connexionReussi()) {
      this.connexionReussi = true;
      // this.roles = this.storage.recupererUser().roles;
    }

    this.currentUser = this.storage.recupererUser();
    console.table("mes donnees table",this.currentUser);
    this.myProfile.patchValue({
      username: this.currentUser.user?.username,
      email: this.currentUser.user?.email,
      telephone: this.currentUser.user?.telephone,
      // Assurez-vous que le nom de la clé "photo" correspond à celle de votre modèle de formulaire
      photo: this.currentUser.user?.photo,
    });

  }

  monProfil(){
    this.myProfile = this.fb.group({
      email: ['', [Validators.email]],
      username: [''],
      telephone: [],
      photo: new FormControl(""),
      fileSource: new FormControl("", [Validators.required]),
    });
  }

modifier(){
  const formData = new FormData();
  formData.append("titre", this.myProfile.value.username);
  formData.append("telephone", this.myProfile.value.telephone);

  formData.append("email", this.myProfile.value.email);
  formData.append("photo", this.myProfile.value.fileSource);

  console.log("mes donnees", formData);
  alert(this.myProfile.value.username)
  alert(this.myProfile.value.telephone)

  alert(this.myProfile.value.fileSource.name)
  alert( this.myProfile.value.email)
}
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + '/uploads/images/';
    return baseUrl + photoFileName;
  }

  onFileChangePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.myProfile.patchValue({
        fileSource: file,
      });
      console.log("photo", event.photo);
    }
  }
  updatePassword(){
    
  }

  showPassword() {
    this.show = !this.show;
  }
  showCnPassword() {
    this.showcn = !this.showcn;
  }
  showlastPassword() {
    this.last = !this.last;
  }
}
