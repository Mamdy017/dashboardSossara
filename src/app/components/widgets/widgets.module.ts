import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { WidgetsRoutingModule } from "./widgets-routing.module";
import { ChartComponent } from "./chart/chart.component";
// import { GeneralComponent } from "./general/general.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CarouselModule } from "ngx-owl-carousel-o";
import { ChartistModule } from "ng-chartist";
import { NgChartsModule } from "ng2-charts";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { CountToModule } from "angular-count-to";
import { NgApexchartsModule } from "ng-apexcharts";
import { DashboardModule } from "../dashboard/dashboard.module";
// import { FollowersGrowthComponent } from "./general/followers-growth/followers-growth.component";
// import { VisitorsComponent } from "./general/visitors/visitors.component";
import { CommonTopChartComponent } from "./chart/common-top-chart/common-top-chart.component";
import { MonthlyHistoryComponent } from "./chart/monthly-history/monthly-history.component";
import { UsesComponent } from "./chart/uses/uses.component";
import { MonthlySalesComponent } from "./chart/monthly-sales/monthly-sales.component";
import { OrderStatus2Component } from "./chart/order-status2/order-status2.component";
import { FinanceComponent } from "./chart/finance/finance.component";
import { StockMarketComponent } from "./chart/stock-market/stock-market.component";
import { CryptoAnnotationsComponent } from "./chart/crypto-annotations/crypto-annotations.component";
import { CryptocurrencyPricesComponent } from "./chart/cryptocurrency-prices/cryptocurrency-prices.component";
import { TurnOverComponent } from "./chart/turn-over/turn-over.component";
import { LiveProductsComponent } from "./chart/live-products/live-products.component";
import { OrderStatusComponent } from "./chart/order-status/order-status.component";
import { SkillStatusComponent } from "./chart/skill-status/skill-status.component";
// import { WidgestCoinsComponent } from './general/widgest-coins/widgest-coins.component';
// import { TotalUserswidgetsComponent } from './general/total-userswidgets/total-userswidgets.component';

@NgModule({
  declarations: [
    ChartComponent,
    // GeneralComponent,
    // FollowersGrowthComponent,
    // VisitorsComponent,
    CommonTopChartComponent,
    // MonthlyHistoryComponent,
    UsesComponent,
    MonthlySalesComponent,
    OrderStatus2Component,
    FinanceComponent,
    StockMarketComponent,
    CryptoAnnotationsComponent,
    CryptocurrencyPricesComponent,
    TurnOverComponent,
    LiveProductsComponent,
    OrderStatusComponent,
    SkillStatusComponent,
    // WidgestCoinsComponent,
    // TotalUserswidgetsComponent,
  ],
  imports: [CommonModule, WidgetsRoutingModule, NgbModule, CountToModule, CarouselModule, ChartistModule, NgChartsModule, FormsModule, SharedModule, NgApexchartsModule],
})
export class WidgetsModule {}
