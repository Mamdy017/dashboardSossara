import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { ContentComponent } from "./shared/components/layout/content/content.component";
import { FullComponent } from "./shared/components/layout/full/full.component";
import { full } from "./shared/routes/full.routes";
import { content } from "./shared/routes/routes";

import { AdminGuard } from './shared/guard/admin.guard';
import { MaintenanceComponent } from './pages/maintenance/maintenance.component';
import { ForgetPasswordComponent } from './pages/authentication/forget-password/forget-password.component';
import { ResetPasswordComponent } from './pages/authentication/reset-password/reset-password.component';
// import{ AddListingComponent } from './components/apps/e-commerce/ajouter-bien/add-listing.component'
import { AjouterBiensComponent } from './components/apps/e-commerce/ajouter-biens/ajouter-biens.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: '',
    component: ContentComponent,
    canActivate: [AdminGuard],
    children: content
  },
  
  {
    path: '',
    component: FullComponent,
    canActivate: [AdminGuard],
    children: full
  },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'reset-password/:token', component: ResetPasswordComponent },
  // { path: 'ajouteBien', component: AjouterBiensComponent },


  {
    path: '**',
    redirectTo: ''
  },

];

@NgModule({
  imports: [[RouterModule.forRoot(routes, {
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
})],
],
  exports: [RouterModule]
})
export class AppRoutingModule { }
