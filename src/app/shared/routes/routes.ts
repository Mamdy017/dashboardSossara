import { Routes } from "@angular/router";

export const content: Routes = [
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../components/dashboard/dashboard.module").then(
        (m) => m.DashboardModule
      ),
  },
  {
    path: "widgets",
    loadChildren: () =>
      import("../../components/widgets/widgets.module").then(
        (m) => m.WidgetsModule
      ),
  },

  {
    path: "project",
    loadChildren: () =>
      import("../../components/apps/project/project.module").then(
        (m) => m.ProjectModule
      ),
  },
  {
    path: "ecommerce",
    loadChildren: () =>
      import("../../components/apps/e-commerce/e-commerce.module").then(
        (m) => m.ECommerceModule
      ),
  },

  {
    path: "user",
    loadChildren: () =>
      import("../../components/apps/users/users.module").then(
        (m) => m.UsersModule
      ),
  },
  {
    path: "blog",
    loadChildren: () =>
      import("../../components/apps/bookmarks/bookmarks.module").then(
        (m) => m.BookmarksModule
      ),
  },

  {
    path: "chart",
    loadChildren: () =>
      import("../../components/charts/charts.module").then(
        (m) => m.ChartModule
      ),
  },

  {
    path: "form",
    loadChildren: () =>
      import("../../components/forms/forms.module").then((m) => m.FormModule),
  },
  {
    path: "table",
    loadChildren: () =>
      import("../../components/table/table.module").then((m) => m.TableModule),
  },
  {
    path: "cards",
    loadChildren: () =>
      import("../../components/cards/cards.module").then((m) => m.CardsModule),
  },

  {
    path: "search-pages",
    loadChildren: () =>
      import("../../components/others/search-result/search-result.module").then(
        (m) => m.SearchResultModule
      ),
  },
];
