import { Component, ElementRef, NgZone } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { BienService } from 'src/app/services/bien.service';
import { StorageService } from 'src/app/services/sotarage.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ajouter-biens',
  templateUrl: './ajouter-biens.component.html',
  styleUrls: ['./ajouter-biens.component.scss']
})
export class AjouterBiensComponent {
  requiredFileType: any;
  maxImageCount: number = 0; // Limite maximale d'images
  isButtonDisabled: boolean = false; // Variable pour désactiver le bouton si la limite est atteinte
  les_commodite: any[] = [];
  commodite: any;
  adresse: any;
  region: any;
  statusBien: any;
  pays: any;
  commune: any;
  typebien: any;
  periode: any;
  bienImmo: any;
  BienLoueRecens: any;
  commodite1: any;
  commodite2: any;
  isLocataire = false;
  isAgence = false;
  roles: string[] = [];
  commodite3: any;
  regions: any = [];
  communes: any = [];
  photo: File[] = [];
  image: File[] = [];
  images: File[] = [];
  fileName: any;
  valuesSelect: any = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  status: any = ['A louer', 'A vendre'];
  message: string;
  currentUser: any;
  connexionReussi: boolean;



  constructor(
    // private DataService: DataService,
    public router: Router,
    // private serviceCommodite: CommoditeService,
    // private storageService: StorageService,
    // private userService: UserService,
    private elRef: ElementRef,
    private storage: StorageService,
    private ngZone: NgZone,
    private ajouterBien: BienService
    // private serviceBienImmo: BienimmoService
  ) { }

  // public routes = routes;
  selectedValue: string | any = 'pays';
  selectedValueR: string | any = 'region';
  fliesValues: any = [];
  valuesFileCurrent: String = 'assets/img/mediaimg-2.jpg';
  errorMessage: any = '';
  isSuccess: any = false;
  files: any = [];
  // photo: any;
  // message: string | undefined;
  selectedFiles: any;
  imagesArray: string[] = []; // Array to store URLs of selected images

  //CHARGER L'IMAGE
  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
    const reader = new FileReader();

    for (const file of this.selectedFiles) {
      if (this.images.length < 8) {
        reader.onload = (e: any) => {
          this.images.push(file);
          this.image.push(e.target.result);
          this.checkImageCount(); // Appel de la fonction pour vérifier la limite d'images
          console.log(this.image);
          this.maxImageCount = this.image.length
        };
        reader.readAsDataURL(file);
      } // Vérifiez si la limite n'a pas été atteinte
    }
    this.form.photo = this.images;
    this.checkImageCount(); // Assurez-vous de vérifier à nouveau la limite après le traitement
  }

  // Fonction pour vérifier la limite d'images et désactiver le bouton si nécessaire
  checkImageCount(): void {
    if (this.images.length >= 8) {
      this.isButtonDisabled = true;
    } else {
      this.isButtonDisabled = false;
    }
  }

  onChangeCommodite() {
    if (this.les_commodite) {
      const commoditeArray = [];
      for (const item of this.les_commodite) {
        if (item.selected) {
          commoditeArray.push(item.id);
        }
      }
      this.form.commodite = commoditeArray;
      console.log(this.form.commodite);
    }
  }

  form: any = {
    commodite: null,
    type: null,
    commune: null,
    nb_piece: null,
    nom: null,
    chambre: null,
    cuisine: null,
    toilette: null,
    surface: null,
    prix: null,
    statut: null,
    description: null,
    quartier: null,
    periode: null,
    rue: null,
    porte: null,
    longitude: null,
    latitude: null,
    photo: null,
    commoditeChecked: false,
    selectedCommodities: [], // Nouveau tableau pour stocker les commodités sélectionnées
  };

  initMap() {
    const mapOptions = {
      center: { lat: 12.639231999999997, lng: -7.998184000000001 }, // Coordonnées initiales de la carte
      zoom: 15 // Niveau de zoom initial
    };
  
    const map = new google.maps.Map(document.getElementById('map'), mapOptions);
  
    // Créer un marqueur initial au centre de la carte
    const initialMarker = new google.maps.Marker({
      position: mapOptions.center,
      map: map,
      draggable: true // Rend le marqueur draggable
    });
  
    // Attachez un gestionnaire d'événements pour mettre à jour les coordonnées lorsque le marqueur est déplacé
    google.maps.event.addListener(initialMarker, 'dragend', (markerEvent: { latLng: { lat: () => any; lng: () => any; }; }) => {
      this.form.latitude = markerEvent.latLng.lat();
      this.form.longitude = markerEvent.latLng.lng();
  
      console.log('Latitude :', this.form.latitude);
      console.log('Longitude :', this.form.longitude);
    });
  
    // Attachez un gestionnaire d'événements pour déplacer le marqueur lorsqu'il est cliqué
    google.maps.event.addListener(initialMarker, 'click', (markerEvent: { latLng: { lat: () => any; lng: () => any; }; }) => {
      const newLatLng = new google.maps.LatLng(
        initialMarker.getPosition().lat() + 0.001, // Déplacez le marqueur d'une petite quantité en latitude
        initialMarker.getPosition().lng() + 0.001  // Déplacez le marqueur d'une petite quantité en longitude
      );
  
      initialMarker.setPosition(newLatLng);
  
      // Mettez à jour les coordonnées dans votre formulaire
      this.form.latitude = newLatLng.lat();
      this.form.longitude = newLatLng.lng();
  
      console.log('Latitude :', this.form.latitude);
      console.log('Longitude :', this.form.longitude);
    });
  }
  


  ngOnInit(): void {
    this.initMap();
    if (this.storage.connexionReussi()) {
      this.connexionReussi = true;
      // this.roles = this.storage.recupererUser().roles;
    }
    // Aos.init({ disable: 'mobile' });
    // if (this.storage.isLoggedIn()) {
    //   // this.isLoggedIn = true;
    //   this.roles = this.storage.getUser().user.role;
    //   console.log(this.roles);
    //   if (this.roles[0] == "ROLE_LOCATAIRE") {
    //     this.isLocataire = true
    //   } else if (this.roles[0] == "ROLE_AGENCE") {
    //     this.isAgence = true
    //   }
    // }

    // //AFFICHER LA LISTE DES COMMODITES
    this.ajouterBien.commodite().subscribe((data) => {
      this.les_commodite = data.commodite;
      this.adresse = data;
      this.pays = data.pays;
      this.region = data.region;
      this.commune = data.commune;
      this.typebien = data.type;
      this.periode = data.periode;
      console.log(data);
    });

    // //AFFICHER LA LISTE DES BIENS IMMO
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe((data) => {
    //   this.bienImmo = data.biens;
    //   console.log(this.bienImmo);
    // });

    // //AFFICHER LA LISTE DES BIENS IMMO RECENTS A LOUER
    // this.serviceBienImmo.AfficherLaListeBienImmo().subscribe((data) => {
    //   this.BienLoueRecens = data.biens;
    //   console.log(this.BienLoueRecens);
    // });
  }

  onChange(newValue: any) {
    this.regions = this.region.filter(
      (el: any) => el.pays.nom == newValue.value
    );
  }

  onChangeRegion(newValue: any) {
    this.communes = this.commune.filter(
      (el: any) => el.region.nom == newValue.value
    );
  }

  selectedStatut: string | null = null;
  //METHODE PERMETTANT DE CHANGER LES STATUTS
  onStatutChange(event: any) {
    this.selectedStatut = event.target.value;
    if (this.selectedStatut === 'A vendre') {
      this.form.periode = null; // Mettre la période à null si le statut est "A vendre"
    }
  }


  // onFileSelected(newValue: any) {
  //   this.files.push(newValue.target.files[0]);
  //   this.valuesFileCurrent = newValue.target.value;
  // }
  onSubmit(form: NgForm): void {
    const {
      commodite,
      type,
      commune,
      nb_piece,
      nom,
      chambre,
      cuisine,
      toilette,
      surface,
      prix,
      statut,
      description,
      quartier,
      rue,
      porte,
      periode,
      longitude,
      latitude,
      photo
    } = this.form;
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn',
        cancelButton: 'btn btn-danger',
      },
      heightAuto: false
    })

    if (this.form.commodite === null
      || this.form.type === null
      || this.form.commune === null
      || this.form.nb_piece === null
      || this.form.nom === null
      || this.form.chambre === null
      || this.form.cuisine === null
      || this.form.toilette === null
      || this.form.surface === null
      || this.form.prix === null
      || this.form.statut === null
      || this.form.description === null
      || this.form.quartier === null
      || this.form.rue === null
      || this.form.porte === null
      || this.form.photo === null) {
      swalWithBootstrapButtons.fire(
        this.message = " Tous les champs sont obligatoires !",
      )
      // console.error('Tous les champs sont obligatoires !');

    } else {
      swalWithBootstrapButtons.fire({
        text: "Etes-vous sûre de bien vouloir creer ce bien ?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler',
        reverseButtons: true
      }).then((result) => {
        if (result.isConfirmed) {
          // const user = this.storage.getUser();
        
          const user = this.storage.recupererUser();
          alert(user)
          if (user && user.token) {
            this.ajouterBien.setAccessToken(user.token);
            this.ajouterBien
              .registerBien(
                commodite,
                type,
                commune,
                nb_piece,
                nom,
                chambre,
                cuisine,
                toilette,
                surface,
                prix,
                statut,
                description,
                quartier,
                rue,
                porte,
                periode,
                longitude,
                latitude,
                photo
              )
              .subscribe({
                next: (data) => {
                  console.log(data);
                  // this.isSuccess = false;
                  console.log(this.form);
                  this.popUpConfirmation();
                },
                error: (err) => {
                  console.log(err);
                  // this.errorMessage = err.error.message;
                  // this.isSuccess = true;
                },
              });
          } else {
            console.error('Token JWT manquant');
          }
        }
      })
    }

  }

  //POPUP APRES CONFIRMATION
  popUpConfirmation() {
    let timerInterval = 2000;
    Swal.fire({
      position: 'center',
      text: 'Bien cree avec succès.',
      title: 'Creation de bien',
      icon: 'success',
      heightAuto: false,
      showConfirmButton: false,
      // confirmButtonText: "OK",
      confirmButtonColor: '#0857b5',
      showDenyButton: false,
      showCancelButton: false,
      allowOutsideClick: false,
      timer: timerInterval, // ajouter le temps d'attente
      timerProgressBar: true // ajouter la barre de progression du temps

    }).then((result) => {
      // this.path();
      // Après avoir réussi à candidater, mettez à jour l'état de la candidature

    })
  }
  // path() {
  //   this.router.navigate([routes.mylisting]);
  // }

  removeImage(index: number) {
    this.image.splice(index, 1); // Supprime l'image du tableau
    this.images.splice(index, 1); // Supprime le fichier du tableau 'images'
    this.checkImageCount(); // Appelle la fonction pour vérifier la limite d'images après la suppression
  }

  onPhotosSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.photo = Array.from(event.target.files);
    } else {
      this.photo = [];
    }
  }

}
