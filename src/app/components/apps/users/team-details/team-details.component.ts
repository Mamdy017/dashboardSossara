import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Agent } from "../../../../shared/data/tables/product-list";
import { Observable } from "rxjs";
import { AgencesService } from "src/app/services/agences.service";
import { BienService } from "src/app/services/bien.service";
import { environment } from "src/environments/environment";
import { TasksService } from "src/app/shared/services/tasks.service";

const URL_PHOTO = environment.Url_PHOTO;
@Component({
  selector: "app-team-details",
  templateUrl: "./team-details.component.html",
  styleUrls: ["./team-details.component.scss"],
})
export class TeamDetailsComponent implements OnInit {
  // afficherAgence: any;
  AfficherListeAgentParAgence: any;

  public tableItem$: Observable<Agent[]>;
  public searchText;
  public total$: Observable<number>;
  public afficherAgence: Agent[] = []; // Utilisez le type Product

  constructor(public router: Router, private agnece: AgencesService,private allBien: BienService,public service:TasksService) {
    this.tableItem$ = service.tableItem$;
    this.total$ = service.total$;
  }


  ngOnInit() {
    this.agnece.allAgence().subscribe((data) => {
      this.afficherAgence = data.agences.slice().reverse();
      console.log("mes agences", JSON.stringify(this.afficherAgence, null, 2));
      // console.log("mes produits", JSON.stringify(this.bien, null, 2));

      // Utilisez setProductsData pour alimenter les données du service ProductService
      this.service.setProductsData(this.afficherAgence);
      console.log(this.service);
      console.log("mon tableItem",this.tableItem$)

      // Une fois que vous avez récupéré les agences, vous pouvez parcourir chaque agence
      // et récupérer les agents par agence pour chaque agence

      // console.log("mes agents",this.afficherAgence.agents)
      this.afficherAgence.forEach(agence => {
        this.agnece.AfficherListeAgentParAgence(agence.id).subscribe((agentData) => {
          // Ici, vous pouvez stocker les agents associés à cette agence, par exemple, dans une propriété d'agence
          agence.agents = agentData; // Assurez-vous que votre modèle d'agence a une propriété "agents" pour stocker les agents
          // console.log("mes agents pour l'agence " + agence.id, JSON.stringify(agentData, null, 2));
        });



        this.agnece.AfficherAgenceParId(agence.id).subscribe(agentData => {
          // Ici, vous recevez les données des agents associés à cette agence dans la variable `agentData`
          
          // Vous pouvez stocker les agents dans une propriété d'agence, assurez-vous que votre modèle d'agence a une propriété "agents" pour cela
          agence.agentsParId = agentData; 
        
          // Vous pouvez également vérifier la longueur des tableaux biens_agence et biens_agents dans `agentData` si nécessaire
          const biensAgenceLouer = agentData.biens_agence.filter((bien) => bien.statut === "A louer").length;
          const biensAgentsLouer = agentData.biens_agents.filter((bien) => bien.statut === "A louer").length;
          const total1 =biensAgentsLouer+biensAgenceLouer
          agence.totalLouer = total1;

          const biensAgenceVente = agentData.biens_agence.filter((bien) => bien.statut === "A vendre").length;
          const biensAgentsVente = agentData.biens_agents.filter((bien) => bien.statut === "A vendre").length;
          
          const total2 =biensAgenceVente+biensAgentsVente
          agence.totalVente = total2;

          // Vous pouvez imprimer la longueur des tableaux si nécessaire
          // console.log("Nombre de biens par agence " + agence.id + ": biens_agence  " + JSON.stringify(agentData, null, 2));
        });
        
      });

      
    });
  }

  handleAuthorImageError(event: any) {
    event.target.src =
      "https://media.istockphoto.com/id/1337144146/vector/default-avatar-profile-icon-vector.jpg?s=612x612&w=0&k=20&c=BIbFwuv7FxTWvh5S3vB6bkT0Qv8Vn8N5Ffseq84ClGI=";
  }
  generateImageUrl(photoFileName: string): string {
    const baseUrl = URL_PHOTO + "/uploads/images/";
    return baseUrl + photoFileName;
  }
}
