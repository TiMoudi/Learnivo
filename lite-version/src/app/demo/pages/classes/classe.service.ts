// src/app/demo/pages/classes/services/classe.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe, Professeur } from './classe.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ClasseService {
  private classeUrl = `${environment.apiUrl}/classes`;
  private profUrl = `${environment.apiUrl}/professeurs`;

  constructor(private http: HttpClient) {}

  // ─── Classes ────────────────────────────────────────────────────────────────

  getAllClasses(niveau?: string): Observable<Classe[]> {
    let params = new HttpParams();
    if (niveau) params = params.set('niveau', niveau);
    return this.http.get<Classe[]>(this.classeUrl, { params });
  }

  getClasseById(id: number): Observable<Classe> {
    return this.http.get<Classe>(`${this.classeUrl}/${id}`);
  }

  createClasse(classe: Classe): Observable<Classe> {
    return this.http.post<Classe>(this.classeUrl, classe);
  }

  updateClasse(id: number, classe: Classe): Observable<Classe> {
    return this.http.put<Classe>(`${this.classeUrl}/${id}`, classe);
  }

  deleteClasse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.classeUrl}/${id}`);
  }

  // ─── Professeurs ────────────────────────────────────────────────────────────

  getAllProfesseurs(classeId?: number, matiere?: string): Observable<Professeur[]> {
    let params = new HttpParams();
    if (classeId) params = params.set('classeId', String(classeId));
    if (matiere)  params = params.set('matiere', matiere);
    return this.http.get<Professeur[]>(this.profUrl, { params });
  }

  getProfesseurById(id: number): Observable<Professeur> {
    return this.http.get<Professeur>(`${this.profUrl}/${id}`);
  }

  createProfesseur(prof: Professeur): Observable<Professeur> {
    return this.http.post<Professeur>(this.profUrl, prof);
  }

  updateProfesseur(id: number, prof: Professeur): Observable<Professeur> {
    return this.http.put<Professeur>(`${this.profUrl}/${id}`, prof);
  }

  deleteProfesseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.profUrl}/${id}`);
  }
}
