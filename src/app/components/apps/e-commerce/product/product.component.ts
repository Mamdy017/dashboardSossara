import { Component, Input, Output, OnInit, ViewChild } from "@angular/core";
import * as feather from "feather-icons";
import * as data from "../../../../shared/data/ecommerce/products";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder } from "@angular/forms";
import { AgencesService } from "src/app/services/agences.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Observable } from "rxjs";
import { blog } from "src/app/shared/data/tables/product-list";
// import { Blo } from "src/app/shared/services/blog.service";
import {BlogService} from "src/app/shared/services/blog.service"

const URL_PHOTO = environment.Url_PHOTO;
@Component({
  selector: "app-product",
  templateUrl: "./product.component.html",
  styleUrls: ["./product.component.scss"],
})
export class ProductComponent implements OnInit {
  @Input("icon") public icon;
  @Output() productDetail: any;

  public listData = data.product;
  openSidebar: boolean = false;
  OpenFilter: Boolean = false;

  sidebaron: boolean = false;
  show: boolean = false;
  open: boolean = false;
  public listView: boolean = false;
  public col_xl_12: boolean = false;
  public col_xl_2: boolean = false;

  public col_sm_3: boolean = false;
  public col_xl_3: boolean = true;
  public xl_4: boolean = true;
  public col_sm_4: boolean = false;
  public col_xl_4: boolean = false;
  public col_sm_6: boolean = true;
  public col_xl_6: boolean = false;
  public gridOptions: boolean = true;
  public active: boolean = false;
  // blog: any;

  public tableItem$: Observable<blog[]>;
  public searchText;
  public total$: Observable<number>;
  public blog: blog[] = []; // Utilisez le type Product

  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    public router: Router,
    private agence: AgencesService,
    public service:BlogService
  ) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
  }

  ngOnInit() {
    setTimeout(() => {
      feather.replace();
    });

    this.agence.blog().subscribe((data) => {
      this.blog = data.blogs;
      console.log("mes blogs", JSON.stringify(this.blog, null, 2));
      console.log("mes blogs", JSON.stringify(this.blog, null, 2));
      // console.log("mes produits", JSON.stringify(this.bien, null, 2));

      // Utilisez setProductsData pour alimenter les données du service ProductService
      this.service.setProductsData(this.blog);
      console.log(this.service);
      console.log("mon tableItem mes blogs",this.tableItem$)

      // Utilisez setProductsData pour alimenter les données du service ProductService
      // this.productService.setProductsData(this.bien);
      // console.log(this.productService);
      // console.log("mon tableItem",this.tableItem$)
    });
  }

  toggleListView(val) {
    this.listView = val;
  }

  sidebarToggle() {
    this.openSidebar = !this.openSidebar;
  }
  openFilter() {
    this.OpenFilter = !this.OpenFilter;
  }

  gridOpens() {
    this.listView = false;
    this.gridOptions = true;
    this.listView = false;
    this.col_xl_3 = true;

    this.xl_4 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = true;

    this.col_xl_2 = false;
    this.col_xl_12 = false;
  }
  listOpens() {
    this.listView = true;
    this.gridOptions = false;
    this.listView = true;
    this.col_xl_3 = true;
    this.xl_4 = true;
    this.col_xl_12 = true;
    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;
    this.col_xl_6 = false;
    this.col_sm_6 = true;
  }
  grid2s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;

    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = true;
    this.col_sm_6 = true;

    this.col_xl_12 = false;
  }
  grid3s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = false;
    this.col_xl_4 = true;
    this.col_sm_4 = true;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }
  grid6s() {
    this.listView = false;
    this.col_xl_3 = false;
    this.col_sm_3 = false;

    this.col_xl_2 = true;
    this.col_xl_4 = false;
    this.col_sm_4 = false;

    this.col_xl_6 = false;
    this.col_sm_6 = false;

    this.col_xl_12 = false;
  }

  openProductDetail(content: any, item: any) {
    this.modalService.open(content, { centered: true, size: "lg" });
    this.productDetail = item;
  }

  ngDoCheck() {
    this.col_xl_12 = this.col_xl_12;
    this.col_xl_2 = this.col_xl_2;
    this.col_sm_3 = this.col_xl_12;
    this.col_xl_3 = this.col_xl_3;
    this.xl_4 = this.xl_4;
    this.col_sm_4 = this.col_sm_4;
    this.col_xl_4 = this.col_xl_4;
    this.col_sm_6 = this.col_sm_6;
    this.col_xl_6 = this.col_xl_6;
  }
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + "/uploads/images/";
    return baseUrl + photoFileName;
  }

  handleAuthorImageError(event: any) {
    event.target.src =
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
  }
}
