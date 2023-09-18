
export class CompanyDB {
  id: number;
  username: string;
  email: string;
  date_de_naissance: Date;
  telephone: string;
  // Ajoutez d'autres propriétés au besoin
  description: string;
  constructor(data: Partial<CompanyDB> = {}) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.date_de_naissance = data.date_de_naissance || null;
    this.telephone = data.telephone || '';
    // Initialisez d'autres propriétés au besoin
  }
}
