// src/app/demo/pages/competition/models/competition.model.ts

export interface Competition {
  id?: number;
  nom: string;
  date: string;         // YYYY-MM-DD
  type: string;         // Sportive | Académique | Culturelle | Scientifique
  lieu?: string;
  description?: string;
  classements?: Classement[];
}

export interface Classement {
  id?: number;
  eleveId: number;
  eleveNom?: string;
  elevePrenom?: string;
  score: number;
  rang?: number;
  commentaire?: string;
  competition?: { id: number };
}

export type CompetitionType = 'Sportive' | 'Académique' | 'Culturelle' | 'Scientifique';
