import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Product } from "../../../../shared/data/tables/product-list";
import { BienService } from "src/app/services/bien.service";
import { environment } from "src/environments/environment";
import { ProductService } from "src/app/shared/services/product.service";
import { Observable } from "rxjs";
import { AgencesService } from "src/app/services/agences.service";

const URL_PHOTO = environment.Url_PHOTO;

@Component({
  selector: "app-product-list",
  templateUrl: "./product-list.component.html",
  styleUrls: ["./product-list.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListComponent implements OnInit {
  public tableItem$: Observable<Product[]>;
  searchText = '';
  public total$: Observable<number>;
  public bien: Product[] = []; // Utilisez le type Product
  public show: boolean = false 
  term: any;
  bienVedu: any;
  bienLouer: any;
  bienVendu: any;


  toggle() {
    this.show = !this.show
  }

  public isDescriptionCollapsed: { [key: number]: boolean } = {};

  constructor(
    private allBien: BienService,
    private cdRef: ChangeDetectorRef,
    public productService: ProductService, // Utilisez productService pour accéder aux méthodes du service ProductService
    private agence: AgencesService
  ) {
    this.tableItem$ = productService.tableItem$;
    this.total$ = productService.total$;
 
    this.tableItem$.subscribe((items) => {
      items.forEach((item) => {
        this.isDescriptionCollapsed[item.id] = true;
      });
    });
  }

  ngOnInit() {
    
    this.cdRef.detectChanges();
    
    this.allBien.allBien().subscribe((data) => {
      this.bien = data.biens.slice().reverse();
      console.log("mes produits", JSON.stringify(this.bien, null, 2));

      // Utilisez setProductsData pour alimenter les données du service ProductService
      this.productService.setProductsData(this.bien);
      console.log(this.productService);
      // console.log("mon tableItem"+bien)
    });
   

    this.generateImageUrl;
    this.toggleDescription;

    // this.allBien.bienVendu().subscribe((data)=>{
    // this.bienVendu=data.biens.slice().reverse()
    // console.log("mes produits vendu", JSON.stringify(this.bienVendu, null, 2));

    // this.productService.setProduitVenduData(this.bienVedu);
    // console.log("produit vendu",this.productService);
    
    // })

    // this.allBien.bienLouer().subscribe((data)=>{
    //   this.bienLouer=data.biens.slice().reverse()
    //   console.log("mes produits louer", JSON.stringify(this.bienLouer, null, 2));
  
    //   this.productService.setProduitLouerVenduData(this.bienLouer);
    //   console.log("produit louer",this.productService);
      
    //   })
  }

  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + "/uploads/images/";
    return baseUrl + photoFileName;
  }

  handleAuthorImageError(event: any) {
    event.target.src =
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
  }

  toggleDescription(bienId: number) {
    if (this.isDescriptionCollapsed[bienId] === undefined) {
      this.isDescriptionCollapsed[bienId] = false;
    } else {
      this.isDescriptionCollapsed[bienId] =
        !this.isDescriptionCollapsed[bienId];
    }
  }

    
  public campaigns = [
    {
      colorClass: "facebookv",
      icon: "facebook",
      name: "Jane Cooper",
      country: "UK",
      growth: "45.6",
      growthArrow: "trending-up",
      amount: "9,786",
      badge: "Active"
    },
    {
      colorClass: "instagram",
      icon: "instagram",
      name: "Floyd Miles",
      country: "DE",
      growth: "12.3",
      growthArrow: "trending-down",
      amount: "19,7098",
      badge: "Active"
    },
    {
      colorClass: "pinterest",
      icon: "pinterest",
      name: "Guy Hawkins",
      country: "ES",
      growth: "65.6",
      growthArrow: "trending-up",
      amount: "90,986",
      badge: "Active"
    },
    {
      colorClass: "twitter",
      icon: "twitter",
      name: "Travis Wright",
      country: "ES",
      growth: "35.6",
      growthArrow: "trending-down",
      amount: "23,654",
      badge: "Inactive"
    },
    {
      colorClass: "you-tube",
      icon: "youtube-play",
      name: "Mark Green",
      country: "UK",
      growth: "45.6",
      growthArrow: "trending-up",
      amount: "12,796",
      badge: "Inactive"
    },
  ]
}
