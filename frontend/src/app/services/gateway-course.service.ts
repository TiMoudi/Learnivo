import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GatewayCourseService {
  private readonly gatewayUrl = 'http://localhost:8080/course/hello';

  constructor(private readonly http: HttpClient) {}

  getHelloCourse(): Observable<string> {
    return this.http.get(this.gatewayUrl, { responseType: 'text' });
  }
}
