import { Component, OnInit } from "@angular/core";
import { BienService } from "src/app/services/bien.service";
import * as chartData from "../../../../shared/data/dashboard/crypto";

@Component({
  selector: "app-crypto-left-content",
  templateUrl: "./crypto-left-content.component.html",
  styleUrls: ["./crypto-left-content.component.scss"],
})
export class CryptoLeftContentComponent implements OnInit {
  public averageSales = chartData.averageSales;
  public averageProfit = chartData.averageProfit;
  public averageVisits = chartData.averageVisits;
  bien: any;
  avendre: any;
  alouer: any;
  pourcentageALouer: number;
  pourcentageAvendre: number;

  constructor(private allBien: BienService) {
    // this.products = productDB.product;
  }

  ngOnInit(): void {
    this.allBien.allBien().subscribe((data) => {
      this.bien = data.biens.slice().reverse();
      this.avendre = data.biens
        .filter((bien) => bien.statut === "A vendre")
        .slice()
        .reverse();
      this.alouer = data.biens
        .filter((bien) => bien.statut === "A louer")
        .slice()
        .reverse();

      // console.log("mes produits de all "+JSON.stringify(this.bien, null, 2))
      // this.averageSales.series = [this.bien.length];
      this.averageSales.average = this.bien.length.toString();
      this.averageProfit.average = this.avendre.length.toString();
      this.averageVisits.average = this.alouer.length.toString();

      if (this.bien.length > 0) {
        this.pourcentageALouer = (this.alouer.length / this.bien.length) * 100;
        this.pourcentageAvendre =
          (this.avendre.length / this.bien.length) * 100;
      }

      this.averageVisits.series = [this.pourcentageALouer.toFixed(1)];
      this.averageProfit.series = [this.pourcentageAvendre.toFixed(1)];

      // console.log(
      //   "mes produits de vente",
      //   JSON.stringify(this.avendre, null, 2)
      // );
    });
  }
}
