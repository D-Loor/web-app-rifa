import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { appConfig } from 'src/app/config';
import { TokenService } from '../services/utils/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  ignorePaths = ['',''];
  constructor(private tokenService: TokenService, private route: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excepciones = appConfig.excepciones;
    const authToken = this.tokenService.getToken();

    const ignora = excepciones.some(excepcion => req.url.includes(excepcion));

    if (authToken && !ignora) {
      const authReq = req.clone({
        setHeaders: {
          Accept : 'application/json',
          Authorization: `Bearer ${authToken}`
        }
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 405 || error.status === 401) {
            this.tokenService.revokeToken();
            this.route.navigate(['/']); 
            console.error('Error 405: Method Not Allowed');
          }
          return throwError(() => error);
        })
      );
    }

    return next.handle(req);
  }
}
