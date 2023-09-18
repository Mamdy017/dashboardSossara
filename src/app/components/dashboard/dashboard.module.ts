import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { CKEditorModule } from "@ckeditor/ckeditor5-angular";
import { CountToModule } from "angular-count-to";
import { ChartistModule } from "ng-chartist";
import { NgChartsModule } from "ng2-charts";
import { CarouselModule } from "ngx-owl-carousel-o";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule } from "@angular/forms";
import { SharedModule } from "../../shared/shared.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { GoogleMapsModule } from "@angular/google-maps";

// import { MonthlyHistoryComponent } from "./chart/monthly-history/monthly-history.component";

import { CryptoComponent } from './crypto/crypto.component';
import { CryptoLeftContentComponent } from './crypto/crypto-left-content/crypto-left-content.component';
import { CryptoMiddleContentComponent } from './crypto/crypto-middle-content/crypto-middle-content.component';
import { CryptoRightContentComponent } from './crypto/crypto-right-content/crypto-right-content.component';
import { AverageComponent } from './crypto/crypto-left-content/average/average.component';
import { TransactionsComponent } from './crypto/crypto-left-content/transactions/transactions.component';
import { CoinComponent } from './crypto/crypto-middle-content/coin/coin.component';
import { MarketGraphComponent } from './crypto/crypto-middle-content/market-graph/market-graph.component';
import { CurrenciesComponent } from './crypto/crypto-middle-content/currencies/currencies.component';
import { BuyCoinsComponent } from './crypto/crypto-middle-content/buy-coins/buy-coins.component';
import { SellCoinsComponent } from './crypto/crypto-middle-content/sell-coins/sell-coins.component';
import { BalanceProfileComponent } from './crypto/crypto-right-content/balance-profile/balance-profile.component';
import { PortfolioComponent } from './crypto/crypto-right-content/portfolio/portfolio.component';
import { ActivitiesComponent } from './crypto/crypto-right-content/activities/activities.component';
import { SocialComponent } from './social/social.component';
import { SocialUserProfileComponent } from './social/social-user-profile/social-user-profile.component';
import { MobileApplicationComponent } from './social/mobile-application/mobile-application.component';
import { SocialMediaComponent } from './social/social-media/social-media.component';
import { SocialMediaChartComponent } from './social/social-media/social-media-chart/social-media-chart.component';
import { SubscribersComponent } from './social/social-media/subscribers/subscribers.component';
import { ClicksChartsComponent } from './social/social-media/clicks-charts/clicks-charts.component';
import { FollowerGenderComponent } from './social/follower-gender/follower-gender.component';
import { CampaignComponent } from './social/campaign/campaign.component';
import { AllCampaignsComponent } from './social/all-campaigns/all-campaigns.component';
import { ViewsComponent } from './social/views/views.component';
import { MonthlyHistoryComponent } from "../widgets/chart/monthly-history/monthly-history.component";
// import { CoursesComponent } from './online-course/hello-name/courses/courses.component';
// import { SaleStatusComponent } from './ecommerce/left-content/order-board/sale-status/sale-status.component';
@NgModule({
  declarations: [

    CryptoComponent,
    CryptoLeftContentComponent,
    CryptoMiddleContentComponent,
    CryptoRightContentComponent,
    AverageComponent,
    TransactionsComponent,
    CoinComponent,
    MarketGraphComponent,
    CurrenciesComponent,
    BuyCoinsComponent,
    SellCoinsComponent,
    BalanceProfileComponent,
    PortfolioComponent,
    ActivitiesComponent,
    SocialComponent,
    SocialUserProfileComponent,
    MobileApplicationComponent,
    SocialMediaComponent,
    SocialMediaChartComponent,
    SubscribersComponent,
    ClicksChartsComponent,
    FollowerGenderComponent,
    CampaignComponent,
    AllCampaignsComponent,
    ViewsComponent,
    MonthlyHistoryComponent,
    // CoursesComponent,
    // SaleStatusComponent,
  ],
  imports: [CommonModule, ChartistModule, CarouselModule, NgChartsModule, NgApexchartsModule, SharedModule, GoogleMapsModule, CKEditorModule, CountToModule, NgbModule, FormsModule, DashboardRoutingModule],
  exports: [
    CoinComponent,
    // ProductStatusChartBoxComponent,
    // CoursesComponent,
    SocialMediaChartComponent,
    // OrdersComponent,
    // ProfitComponent,
    // SaleStatusComponent,
    BalanceProfileComponent,
    // CalendarComponent,
    AverageComponent,
    // TotalUsersComponent
  ]
})
export class DashboardModule {}
