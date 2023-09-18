import { Component, OnInit, ViewChild } from '@angular/core';
import { AddBookmarkComponent } from "./modal/add-bookmark/add-bookmark.component";
import { EditBookmarkComponent } from "./modal/edit-bookmark/edit-bookmark.component";
import { CreateTagComponent } from "./modal/create-tag/create-tag.component";
import { blog } from 'src/app/shared/data/tables/product-list';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { AgencesService } from 'src/app/services/agences.service';
import { Router } from '@angular/router';
import { BlogService } from 'src/app/shared/services/blog.service';
import { environment } from "src/environments/environment";
import Swal from 'sweetalert2';
const URL_PHOTO = environment.Url_PHOTO;

@Component({
  selector: 'app-bookmarks',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  @ViewChild("addbookmark") AddBookmark: AddBookmarkComponent;
  @ViewChild("editbookmark") EditBookmark: EditBookmarkComponent;
  @ViewChild("createTag") CreateTag: CreateTagComponent;

  public listBookmark: boolean = false;
  public tableItem$: Observable<blog[]>;
  public searchText;
  public total$: Observable<number>;
  public blog: blog[] = []; // Utilisez le type Product
  public isDescriptionCollapsed: { [key: number]: boolean } = {};
  constructor( private fb: FormBuilder,
    public router: Router,
    private agence: AgencesService,
    public service:BlogService
  ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
    
    this.tableItem$.subscribe((items) => {
      items.forEach((item) => {
        this.isDescriptionCollapsed[item.id] = true;
      });
    });
  }

  ngOnInit() {
    this.agence.blog().subscribe((data) => {
      this.blog = data.blogs;
      // console.log("mes blogs", JSON.stringify(this.blog, null, 2));
      // console.log("mes blogs", JSON.stringify(this.blog, null, 2));
      // console.log("mes produits", JSON.stringify(this.bien, null, 2));

      // Utilisez setProductsData pour alimenter les données du service ProductService
      this.service.setProductsData(this.blog);
      // console.log(this.service);
      // console.log("mon tableItem mes blogs",this.tableItem$)

      // Utilisez setProductsData pour alimenter les données du service ProductService
      // this.productService.setProductsData(this.bien);
      // console.log(this.productService);
      // console.log("mon tableItem",this.tableItem$)
    });
  }

  supprimer(idBlog: number) {
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
          this.agence.SupprimerBlog(idBlog).subscribe((data: any) => {
            this.supprimer = data;
            this.agence.blog().subscribe((data) => {
              this.blog = data.blogs;
              this.service.setProductsData(this.blog);
            })
            swalWithBootstrapButtons.fire(
              "",
              `<h1  style='font-size:1em; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Blog supprimé avec succès.</h1>`,
              "success"
            );
          });
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




  


  changeLayoutBookmark() {
    this.listBookmark = !this.listBookmark
  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + "/uploads/images/";
    return baseUrl + photoFileName;
  }

  handleAuthorImageError(event: any) {
    event.target.src =
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
  }
  toggleDescription(blogId: number) {
    if (this.isDescriptionCollapsed[blogId] === undefined) {
      this.isDescriptionCollapsed[blogId] = false;
    } else {
      this.isDescriptionCollapsed[blogId] =
        !this.isDescriptionCollapsed[blogId];
    }
  }
}
