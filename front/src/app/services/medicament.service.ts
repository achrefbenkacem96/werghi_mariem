import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Medicament } from '../models/medicament.model';

@Injectable({
  providedIn: 'root'
})
export class MedicamentService {
  private apiUrl = `${environment.apiUrl}/medicaments`;
  
  constructor(private http: HttpClient) { }
  
  getAllMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(this.apiUrl);
  }
  
  getMedicamentById(id: string): Observable<Medicament> {
    return this.http.get<Medicament>(`${this.apiUrl}/${id}`);
  }
  
  createMedicament(medicament: Medicament): Observable<Medicament> {
    return this.http.post<Medicament>(this.apiUrl, medicament);
  }
  
  updateMedicament(id: string, medicament: Medicament): Observable<Medicament> {
    return this.http.put<Medicament>(`${this.apiUrl}/${id}`, medicament);
  }
  
  deleteMedicament(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
  
  searchMedicaments(searchTerm: string): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/search?name=${searchTerm}`);
  }
  
  getMedicamentsByCategory(category: string): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/category/${category}`);
  }
  
  getExpiredMedicaments(): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/expired`);
  }
  
  getLowStockMedicaments(threshold: number = 5): Observable<Medicament[]> {
    return this.http.get<Medicament[]>(`${this.apiUrl}/low-stock`, { 
      params: { threshold: threshold.toString() } 
    });
  }
} 