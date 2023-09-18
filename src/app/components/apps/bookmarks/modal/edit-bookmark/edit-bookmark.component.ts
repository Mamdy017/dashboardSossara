import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  TemplateRef,
  PLATFORM_ID,
  Inject,
} from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { AgencesService } from "src/app/services/agences.service";
import { Router } from "@angular/router";
import { BlogService } from "src/app/shared/services/blog.service";
import { blog } from "src/app/shared/data/tables/product-list";
import { Observable } from "rxjs";
import Swal from "sweetalert2";

@Component({
  selector: "app-edit-bookmark",
  templateUrl: "./edit-bookmark.component.html",
  styleUrls: ["./edit-bookmark.component.scss"],
})
export class EditBookmarkComponent implements OnInit, OnDestroy {
  @ViewChild("editBookmark", { static: false }) EditBookmark: TemplateRef<any>;

  public closeResult: string;
  public modalOpen: boolean = false;

  public updateBlog: FormGroup;
  selectedId: number;
  public tableItem$: Observable<blog[]>;
  public searchText;
  public total$: Observable<number>;
  public blog: blog[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private modalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private agence: AgencesService,
    private blogService: BlogService
  ) {
    // Initialisation du formulaire pour la mise à jour du blog
    this.updateBlog = this.fb.group({
      titre: ["", [Validators.required]],
      description: ["", Validators.required],
      photo: new FormControl(""),
      fileSource: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit(): void {}

  // Fonction pour ouvrir la fenêtre modale de modification du blog
  openModal(id: number) {
    this.selectedId = id;
    if (isPlatformBrowser(this.platformId)) {
      // Vérifie si le navigateur est pris en charge
      this.modalService
        .open(this.EditBookmark, {
          size: "lg", // Taille de la fenêtre modale
          ariaLabelledBy: "modal-bookmark",
          centered: true, // Centrer la fenêtre modale
          windowClass: "modal-bookmark", // Classe CSS personnalisée pour la fenêtre modale
        })
        .result.then(
          (result) => {
            this.modalOpen = true;
            `Result ${result}`;
          },
          (reason) => {
            this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          }
        );
    }
  }

  // Fonction pour modifier un blog
  modifierBlog() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "",
        cancelButton: "",
      },
      heightAuto: false,
    });

    swalWithBootstrapButtons
      .fire({
        title:
          "<h1 style='font-size:.7em;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Etes vous sur de vouloir supprimer cet blog ?</h1>",
        showCancelButton: true,
        confirmButtonText: '<span style="font-size:.9em">OUI</span>',
        cancelButtonText: `<span style="font-size:.9em"> NON</span>`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          const formData = new FormData();
          const id = this.selectedId;
          formData.append("titre", this.updateBlog.value.titre);
          formData.append("description", this.updateBlog.value.description);
          formData.append("photo", this.updateBlog.value.fileSource);

          this.agence.modifierBlog(id, formData).subscribe(
            (data: any) => {
              this.modifierBlog = data;
              this.blog = data.blogs;

              this.blogService.setProductsData(this.blog); // Met à jour les données du service
              this.updateBlog.reset(); // Réinitialise le formulaire
              swalWithBootstrapButtons.fire(
                "",
                `<h1  style='font-size:1em; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${data.message}.</h1>`,
                "success"
              );
            },
            (error) => {
              console.error("Erreur lors de la connexion :", error);
              const errorMessage =
                error.error && error.error.message
                  ? error.error.message
                  : "Erreur inconnue";
              //message d'erreur.
              swalWithBootstrapButtons.fire(
                "",
                `<h1  style='font-size:1em; font-weight: bold;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>${errorMessage}</h1>`,
                "error"
              );
            }
          );
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire(
            "",
            "<h1 style='font-size:.9em; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Opération annulée</h1>",
            "error"
          );
        }
      });
  }

  // Fonction pour gérer le changement de fichier photo
  onFileChangePhoto(event: any) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.updateBlog.patchValue({
        fileSource: file,
      });
    }
  }

  // Fonction pour gérer la raison de la fermeture de la fenêtre modale
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnDestroy() {
    if (this.modalOpen) {
      this.modalService.dismissAll();
    }
  }
}
