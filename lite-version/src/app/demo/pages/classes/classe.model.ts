// src/app/demo/pages/classes/models/classe.model.ts

export interface Classe {
  id?: number;
  nom: string;
  niveau: string;
  capacite: number;
  anneeScolaire?: string;
}

export interface Professeur {
  id?: number;
  nom: string;
  prenom: string;
  matiere: string;
  email?: string;
  classe?: { id: number };
}
