import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface KeyLabel { key: string | number; label: string; }
export interface IdLabel  { id: number; label: string; }

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private base = environment.catalogBaseUrl;
  private headers = new HttpHeaders({ Authorization: `Basic ${environment.catalogBasicAuth}` });
  constructor(private http: HttpClient) {}
  getMakes(): Observable<IdLabel[]> { return this.http.get<IdLabel[]>(`${this.base}/makes`, { headers: this.headers }); }
  getModels(makeId: number): Observable<IdLabel[]> { return this.http.get<IdLabel[]>(`${this.base}/make-id/${makeId}/models`, { headers: this.headers }); }
  getInteriorColors(makeId: number, modelId: number): Observable<KeyLabel[]> {
    return this.http.get<KeyLabel[]>(`${this.base}/make-id/${makeId}/model-id/${modelId}/interior-colors`, { headers: this.headers });
  }
}
