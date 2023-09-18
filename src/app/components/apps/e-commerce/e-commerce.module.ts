import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GalleryModule } from '@ks89/angular-modal-gallery';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { Ng5SliderModule } from 'ng5-slider';
// import { CarouselModule } from 'ngx-owl-carousel-o';
import { NgxPrintModule } from 'ngx-print';
import { SharedModule } from "../../../shared/shared.module";
import { ECommerceRoutingModule } from './e-commerce-routing.module';


import { ProductListComponent } from './product-list/product-list.component';
import { ProductComponent } from './product/product.component';

import 'hammerjs';
import 'mousetrap';
// import { AjouterBienComponent } from './ajouter-bien/ajouter-bien.component';
import { AjouterBiensComponent } from './ajouter-biens/ajouter-biens.component';


@NgModule({
    declarations: [
 
        ProductListComponent,

        ProductComponent,
        //  AjouterBienComponent,
         AjouterBiensComponent,

    ],
    imports: [
        CommonModule,
        ECommerceRoutingModule,
        // NgxDatatableModule,
        SharedModule,
        CommonModule,
        // CarouselModule,
        NgbModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        NgxPrintModule,
        Ng5SliderModule,
        Ng2SearchPipeModule,
        GalleryModule
    ],
    providers: [NgbActiveModal]
})
export class ECommerceModule { }
