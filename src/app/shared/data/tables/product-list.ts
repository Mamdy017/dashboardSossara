export interface Product {
  id: number;
  nb_piece: number;
  surface: number;
  nom: string;
  periode: {
    id: number;
    nom: string;
  };
  
  chambre: number;
  // photos: Photo[];
  
  cuisine: number;
  toilette: number;
  prix: number;
  description: string;
  statut: string;
  // utilisateur: Utilisateur;
  typeImmo: {
    id: number;
    nom: string;
  };
  // adresse: Adresse;
  createdAt: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  updateAt: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  commodite: {
    id: number;
    nom: string;
    icone: string;
  }[];
  favoris: {
    id: number;
  }[];
}



export interface Agent {
  id: number;
  nom: string;
  email: string;
  roles: string[];
  telephone: string;
  dateNaissance: {
    date: string;
    timezone_type: number;
    timezone: string;
  };
  photo: string | null;
  is_certified: boolean;
  agentsParId: Record<string, any>;
  totalLouer: number; // Ajout de la propriété 'totalLouer'
  totalVente: number; // Ajout de la propriété 'totalVente'
  favoris: { id: number }[];
  agents: { id: number }[];
  parent: any | null; // Remarque : vous devrez peut-être définir un type approprié pour "parent".
  adresse: any[]; // Vous pouvez également définir un type approprié pour "adresse".
}

// Exemple d'utilisation de l'interface
const agentData: Agent[] = [
  
];

export interface blog {
  id :number;
  titre: string;
  description:string;
}