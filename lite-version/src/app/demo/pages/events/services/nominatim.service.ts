import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org';

@Injectable({ providedIn: 'root' })
export class NominatimService {

  constructor(private http: HttpClient) {}

  search(query: string): Observable<{ lat: number; lon: number; displayName: string }[]> {
    if (!query || !query.trim()) {
      return new Observable(obs => { obs.next([]); obs.complete(); });
    }
    const url = `${NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(query.trim())}&limit=5`;
    return this.http
      .get<NominatimResult[]>(url, {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Learnivo-App/1.0'
        }
      })
      .pipe(
        map(results =>
          (results || []).map(r => ({
            lat: parseFloat(r.lat),
            lon: parseFloat(r.lon),
            displayName: r.display_name
          }))
        )
      );
  }

  reverse(lat: number, lon: number): Observable<string> {
    const url = `${NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}`;
    return this.http
      .get<{ display_name?: string }>(url, {
        headers: { 'Accept': 'application/json', 'User-Agent': 'Learnivo-App/1.0' }
      })
      .pipe(
        map(res => res.display_name || `${lat}, ${lon}`)
      );
  }
}
