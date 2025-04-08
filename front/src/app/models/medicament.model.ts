export interface Medicament {
  id?: string;
  nom: string;
  description: string;
  categorie?: string;
  quantite: number;
  dateExpiration: any;
  prix: number;
  createdAt?: string;
  updatedAt?: string;
} 