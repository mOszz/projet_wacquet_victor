import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Pollution, PollutionFormValue } from '../models/pollution.model';

/**
 * CRUD access to the pollutions REST API (`{apiUrl}/pollutions`).
 * Create/update send multipart/form-data, so the photo is stored by the API.
 */
@Injectable({ providedIn: 'root' })
export class PollutionService {
  private readonly http = inject(HttpClient);
  private readonly url = `${environment.apiUrl}/pollutions`;

  getAll(): Observable<Pollution[]> {
    return this.http.get<Pollution[]>(this.url);
  }

  getById(id: number): Observable<Pollution> {
    return this.http.get<Pollution>(`${this.url}/${id}`);
  }

  create(value: PollutionFormValue): Observable<Pollution> {
    return this.http.post<Pollution>(this.url, toFormData(value));
  }

  update(id: number, value: PollutionFormValue): Observable<Pollution> {
    return this.http.put<Pollution>(`${this.url}/${id}`, toFormData(value));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}

/**
 * multipart/form-data body expected by the API: the fields as JSON in `data`
 * (keeps numbers as numbers), and the image file in `photo`.
 */
function toFormData({ pollution, photo, removePhoto }: PollutionFormValue): FormData {
  const body = new FormData();
  body.append('data', JSON.stringify({ ...pollution, removePhoto }));
  if (photo) {
    body.append('photo', photo);
  }
  return body;
}
