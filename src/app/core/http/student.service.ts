import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { StudentModel } from 'src/app/shared/models/student.model';
import { ResponseModel } from 'src/app/shared/models/response.model'; 
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private BASE_URL = environment.API_KEY;

  constructor(private http: HttpClient) { }

  getStudents(): Observable<StudentModel[]> {
    return this.http.get<StudentModel[]>(`${this.BASE_URL}/api/Student`)
    .pipe(catchError(this.handleError));
  }

  getStudent(id: number): Observable<StudentModel> {
    return this.http.get<StudentModel>(`${this.BASE_URL}/api/Student/${id}`)
    .pipe(catchError(this.handleError));
  }

  createStudent(student: StudentModel): Observable<ResponseModel> {
    return this.http.post<ResponseModel>(
      `${this.BASE_URL}/api/Student`,
      student
    ).pipe(catchError(this.handleError));
  }

  updateStudent(student: StudentModel): Observable<ResponseModel> {
    return this.http.put<ResponseModel>(
      `${this.BASE_URL}/api/Student`,
      student
    ).pipe(catchError(this.handleError));
  }

  deleteStudent(id: number): Observable<ResponseModel> {
    return this.http.delete<ResponseModel>(
      `${this.BASE_URL}/api/Student/${id}`
    ).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }
    return throwError('Something went wrong; please try again later.');
  }

}
