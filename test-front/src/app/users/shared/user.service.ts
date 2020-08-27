import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {User} from '../../core/model/user.interafce';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiURL}/users`;
  private headers = new HttpHeaders({'Content-Type': 'application/json'});

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}`, {headers: this.headers});
  }

  getUserById(userId: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`, {headers: this.headers});
  }

  updateUser(userId: string, newName: string): Observable<User> {
    return this.http.put<any>(`${this.apiUrl}/${userId}`, {newName}, {headers: this.headers});
  }
}
