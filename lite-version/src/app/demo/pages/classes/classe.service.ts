
// src/app/demo/pages/classes/services/classe.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Classe, Professeur } from './classe.model';
import { PageResponse } from '../shared/page-response.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ClasseService {

  private classeUrl = `${environment.apiUrl}/classes`;
  private profUrl   = `${environment.apiUrl}/professeurs`;

  constructor(private http: HttpClient) {}

  // ─── Classes ──────────────────────────────────────────────────────────────

  // Paginé — utilisé par la liste principale
  getClassesPaginated(
    page = 0, size = 9,
    sortBy = 'nom', sortDir = 'asc',
    niveau?: string, annee?: string, search?: string
  ): Observable<PageResponse<Classe>> {
    let params = new HttpParams()
      .set('page', String(page)).set('size', String(size))
      .set('sortBy', sortBy).set('sortDir', sortDir);
    if (niveau) params = params.set('niveau', niveau);
    if (annee)  params = params.set('annee', annee);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<Classe>>(this.classeUrl, { params });
  }

  // Non paginé — rétrocompat (Feign, modals)
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

  // ─── Professeurs ──────────────────────────────────────────────────────────

  getProfesseursPaginated(
    page = 0, size = 10,
    sortBy = 'nom', sortDir = 'asc',
    classeId?: number, search?: string
  ): Observable<PageResponse<Professeur>> {
    let params = new HttpParams()
      .set('page', String(page)).set('size', String(size))
      .set('sortBy', sortBy).set('sortDir', sortDir);
    if (classeId) params = params.set('classeId', String(classeId));
    if (search)   params = params.set('search', search);
    return this.http.get<PageResponse<Professeur>>(this.profUrl, { params });
  }

  getAllProfesseurs(classeId?: number, matiere?: string): Observable<Professeur[]> {
    let params = new HttpParams();
    if (classeId) params = params.set('classeId', String(classeId));
    if (matiere)  params = params.set('matiere', matiere);
    return this.http.get<Professeur[]>(this.profUrl, { params });
  }

  createProfesseur(prof: any): Observable<Professeur> {
    return this.http.post<Professeur>(this.profUrl, prof);
  }

  deleteProfesseur(id: number): Observable<void> {
    return this.http.delete<void>(`${this.profUrl}/${id}`);
  }
}
