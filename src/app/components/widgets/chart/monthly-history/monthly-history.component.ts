import { Component, OnInit } from '@angular/core';
import * as chartData from '../../../../shared/data/widget/chart';

@Component({
  selector: 'app-monthly-history',
  templateUrl: './monthly-history.component.html',
  styleUrls: ['./monthly-history.component.scss']
})
export class MonthlyHistoryComponent implements OnInit {
  public monthlyHistory = chartData.monthlyHistory;
  avendre: any[] = [];

  ngOnInit(): void {
    // Supposons que vous avez un tableau de biens avec des propriétés 'statut' et 'date'
    const biens: any[] = [
      { id: 1, statut: "A vendre", date: "2023-01-15" },
      { id: 2, statut: "A vendre", date: "2023-02-20" },
      { id: 3, statut: "A vendre", date: "2023-04-05" },
      { id: 4, statut: "A vendre", date: "2023-06-10" },
      { id: 4, statut: "A vendre", date: "2023-012-10" },
      { id: 4, statut: "A vendre", date: "2023-012-10" },
      { id: 4, statut: "A vendre", date: "2023-012-10" },
      { id: 4, statut: "A vendre", date: "2023-012-10" },
      { id: 4, statut: "A vendre", date: "2023-012-10" },

      // ... Ajoutez plus de biens avec des dates différentes
    ];

    // Filtrer les biens "A vendre" uniquement
    this.avendre = biens.filter((bien) => bien.statut === "A vendre");

    const bienParMois = new Array(12).fill(0); // Tableau pour stocker le nombre de biens "A vendre" par mois (initialisé à 0)

    // Parcourez les biens "A vendre" et comptez-les par mois
    this.avendre.forEach((bien) => {
      const date = new Date(bien.date);
      const mois = date.getMonth(); // Obtenez le mois (0-11)

      // Incrémente le compteur du mois correspondant
      bienParMois[mois]++;
    });

    // Mettez à jour les données du graphique monthlyHistory avec les valeurs de bienParMois
    this.monthlyHistory.series[0].data = bienParMois;
  }
}
