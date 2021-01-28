import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { throwError, Subject, Observable } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: "root",
})
export class WordService {
  private subject = new Subject();
  private REST_API_SERVER = /* environment.apiJDMUrl || */ "/";
  constructor(private httpClient: HttpClient) {}

  handleError(error: HttpErrorResponse) {
    let errorMessage = "Unknown error!";
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  public sendGetWordsListRequest(word: string){
    return this.httpClient.get(this.REST_API_SERVER + "list", {params: {mot: word}}).pipe(
      tap((data: []) => {
        catchError(this.handleError);
      })
    )
  }

  public sendGetWordsListRefinement(word: string, rel: string){
    return this.httpClient.get(this.REST_API_SERVER + "list/refinement", {params: {mot: word, rel: rel}}).pipe(
      tap((data: []) => {
        catchError(this.handleError);
      })
    )
  }

  public sendGetRequest(wordSent: string, rel: string) {
    return this.httpClient.get(this.REST_API_SERVER + "definition/"+ wordSent + "/" + rel).pipe(
      tap((data: []) => {
        catchError(this.handleError);
      })
    );
  }

  public getWords(searchValue: string){
    return this.httpClient.get(this.REST_API_SERVER + "search", {params: {searchValue: searchValue}}).pipe(
      tap((data: []) => {
        catchError(this.handleError);
      })
    )
  }

  sendMessage(data: []) {
    this.subject.next({ words: data });
  }

  clearMessages() {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
