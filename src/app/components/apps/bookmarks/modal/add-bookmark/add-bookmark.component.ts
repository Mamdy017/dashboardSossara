import { Component, OnInit, OnDestroy, ViewChild, TemplateRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AgencesService } from 'src/app/services/agences.service';
import { BlogService } from 'src/app/shared/services/blog.service';
import { blog } from 'src/app/shared/data/tables/product-list';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-add-bookmark',
  templateUrl: './add-bookmark.component.html',
  styleUrls: ['./add-bookmark.component.scss']
})
export class AddBookmarkComponent implements OnInit, OnDestroy {

  @ViewChild("addBookmark", { static: false }) addBookmark: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;
  public addBlog: FormGroup;
  public tableItem$: Observable<blog[]>;
  public searchText;
  public total$: Observable<number>;
  public blog: blog[] = [];

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private blogService: BlogService,
    private agence: AgencesService) {
      // Initialisation du formulaire pour l'ajout de blog
      this.addBlog = this.fb.group({
        titre: ["", [Validators.required]],
        description: ["", Validators.required],
        photo: new FormControl(""),
        fileSource: new FormControl("", [Validators.required]),
      });
    }

  ngOnInit(): void {
  }

  // Fonction pour ouvrir la fenêtre modale d'ajout de blog
  openModal() {
    if (isPlatformBrowser(this.platformId)) { // Vérifie si le navigateur est pris en charge 
      this.modalService.open(this.addBookmark, { 
        size: 'lg', // Taille de la fenêtre modale
        ariaLabelledBy: 'modal-bookmark',
        centered: true, // Centrer la fenêtre modale
        windowClass: 'modal-bookmark' // Classe CSS personnalisée pour la fenêtre modale
      }).result.then((result) => {
        this.modalOpen = true;
        `Result ${result}`
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  // Fonction pour gérer la raison de la fermeture de la fenêtre modale
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  // Fonction pour gérer le changement de fichier photo
  onFileChangePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.addBlog.patchValue({
        fileSource: file,
      });
    }
  }

  // Fonction pour ajouter un blog
  ajouterBlock() {
    const formData = new FormData();
    formData.append("titre", this.addBlog.value.titre);
    formData.append("description", this.addBlog.value.description);
    formData.append("photo", this.addBlog.value.fileSource);

    this.agence.AjouterBlog(formData).subscribe((data: any) => {
      this.ajouterBlock = data;
      this.agence.blog().subscribe((data) => {
        this.blog = data.blogs;
        this.blogService.setProductsData(this.blog); // Met à jour les données via le service
      });
      console.log(this.ajouterBlock);
      this.addBlog.reset(); // Réinitialise le formulaire
    });
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
