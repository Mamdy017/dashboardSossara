import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { BasicComponent } from "./bootstrap-tables/basic/basic.component";
import { TableComponentsComponent } from "./bootstrap-tables/table-components/table-components.component";
import { BasicDataTableComponent } from "./data-tables/basic-data-table/basic-data-table.component";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "bootstrap-tables",
        children: [
          {
            path: "basic",
            component: BasicComponent,
          },
          {
            path: "table-components",
            component: TableComponentsComponent,
          },
        ],
      },
      {
        path: "datatable",
        component: BasicDataTableComponent,
      },
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableRoutingModule {}
