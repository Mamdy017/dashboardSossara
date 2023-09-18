import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CryptoComponent } from "./crypto/crypto.component";
// import { DefaultComponent } from "./default/default.component";
// import { EcommerceComponent } from "./ecommerce/ecommerce.component";
// import { OnlineCourseComponent } from "./online-course/online-course.component";
import { SocialComponent } from "./social/social.component";

const routes: Routes = [
  {
    path: "",
    children: [
   
 
      {
        path: "admin",
        component: CryptoComponent,
      },
      {
        path: "super-admin",
        component: SocialComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
