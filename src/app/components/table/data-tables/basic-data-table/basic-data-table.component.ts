import { Component, OnInit, Pipe, QueryList, ViewChildren } from "@angular/core";
import { Observable } from "rxjs";
import {
  NgbdSortableHeader,
  SortEvent,
} from "src/app/shared/directives/NgbdSortableHeader";
import { TableService } from "src/app/shared/services/table.service";
import { CompanyDB } from "../../../../shared/data/tables/company";
import { AgencesService } from "src/app/services/agences.service";
import { environment } from "src/environments/environment";
import Swal from "sweetalert2";
const URL_PHOTO = environment.Url_PHOTO;
@Component({
  selector: "app-basic-data-table",
  templateUrl: "./basic-data-table.component.html",
  styleUrls: ["./basic-data-table.component.scss"],
})


export class BasicDataTableComponent implements OnInit {
  public selected = [];

  public tableItem$: Observable<CompanyDB[]>;
  searchText="";
  total$: Observable<number>;
  agents: any;

  constructor(public service: TableService, private agence: AgencesService) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
  
    // this.service.setUserData(COMPANYDB);
  }

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = "";
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  ngOnInit() {
    this.agence.AfficherListeAgentAll().subscribe((data) => {
      this.agents = data.agents;
      this.service.setUserData(this.agents);
      
      // Mettre à jour les données des agents dans le service

      console.log("srvice agents",this.service)
    });
  }

  deleteData(id: number) {
    this.tableItem$.subscribe((data: any) => {
      data.map((elem: any, i: any) => {
        elem.id == id && data.splice(i, 1);
      });
    });
  }
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + "/uploads/images/";
    return baseUrl + photoFileName;
  }

  supprimer(idAgent: number) {
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
          "<h1 style='font-size:.7em;font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Etes vous sur de vouloir supprimer cet agent ?</h1>",
        showCancelButton: true,
        confirmButtonText: '<span style="font-size:.9em">OUI</span>',
        cancelButtonText: `<span style="font-size:.9em"> NON</span>`,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this.agence.SupprimerAgent(idAgent).subscribe((data: any) => {
            this.supprimer = data;
            swalWithBootstrapButtons.fire(
              "",
              `<h1  style='font-size:1em; font-family: Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;'>Agent supprimé avec succès.</h1>`,
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
}
