import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";


import { ProductListComponent } from "./product-list/product-list.component";
import { ProductComponent } from "./product/product.component";
import { AjouterBiensComponent } from "./ajouter-biens/ajouter-biens.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "products",
        component: ProductComponent,
      },
     
      {
        path: "product/list",
        component: ProductListComponent,
      },
      { path: 'ajouteBien', component: AjouterBiensComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ECommerceRoutingModule {}
