
// src/app/demo/pages/competition/services/competition.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Competition, Classement } from './competition.model';
import { PageResponse } from '../shared/page-response.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CompetitionService {

  private compUrl       = `${environment.apiUrl}/competitions`;
  private classementUrl = `${environment.apiUrl}/classements`;

  constructor(private http: HttpClient) {}

  // ─── Compétitions ─────────────────────────────────────────────────────────

  getCompetitionsPaginated(
    page = 0, size = 9,
    sortBy = 'date', sortDir = 'desc',
    type?: string, search?: string
  ): Observable<PageResponse<Competition>> {
    let params = new HttpParams()
      .set('page', String(page)).set('size', String(size))
      .set('sortBy', sortBy).set('sortDir', sortDir);
    if (type)   params = params.set('type', type);
    if (search) params = params.set('search', search);
    return this.http.get<PageResponse<Competition>>(this.compUrl, { params });
  }

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

  // ─── Classements ──────────────────────────────────────────────────────────

  getClassementsByCompetition(competitionId: number): Observable<Classement[]> {
    return this.http.get<Classement[]>(this.classementUrl, {
      params: new HttpParams().set('competitionId', String(competitionId))
    });
  }

  addClassement(cl: any): Observable<Classement> {
    return this.http.post<Classement>(this.classementUrl, cl);
  }

  deleteClassement(id: number): Observable<void> {
    return this.http.delete<void>(`${this.classementUrl}/${id}`);
  }
}
