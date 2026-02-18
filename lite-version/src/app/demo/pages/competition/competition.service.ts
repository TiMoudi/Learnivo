// src/app/demo/pages/competition/services/competition.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competition, Classement } from './competition.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CompetitionService {
  private compUrl = `${environment.apiUrl}/competitions`;
  private classementUrl = `${environment.apiUrl}/classements`;

  constructor(private http: HttpClient) {}

  // ─── Compétitions ────────────────────────────────────────────────────────────

  getAllCompetitions(type?: string): Observable<Competition[]> {
    let params = new HttpParams();
    if (type) params = params.set('type', type);
    return this.http.get<Competition[]>(this.compUrl, { params });
  }

  getCompetitionById(id: number): Observable<Competition> {
    return this.http.get<Competition>(`${this.compUrl}/${id}`);
  }

  createCompetition(comp: Competition): Observable<Competition> {
    return this.http.post<Competition>(this.compUrl, comp);
  }

  updateCompetition(id: number, comp: Competition): Observable<Competition> {
    return this.http.put<Competition>(`${this.compUrl}/${id}`, comp);
  }

  deleteCompetition(id: number): Observable<void> {
    return this.http.delete<void>(`${this.compUrl}/${id}`);
  }

  // ─── Classements ─────────────────────────────────────────────────────────────

  getClassementsByCompetition(competitionId: number): Observable<Classement[]> {
    return this.http.get<Classement[]>(this.classementUrl, {
      params: new HttpParams().set('competitionId', String(competitionId))
    });
  }

  getClassementsByEleve(eleveId: number): Observable<Classement[]> {
    return this.http.get<Classement[]>(this.classementUrl, {
      params: new HttpParams().set('eleveId', String(eleveId))
    });
  }

  addClassement(classement: Classement): Observable<Classement> {
    return this.http.post<Classement>(this.classementUrl, classement);
  }

  updateClassement(id: number, classement: Classement): Observable<Classement> {
    return this.http.put<Classement>(`${this.classementUrl}/${id}`, classement);
  }

  deleteClassement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.classementUrl}/${id}`);
  }
}