import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {Observable, tap} from 'rxjs';

export const authGuard: CanActivateFn = (route, state): boolean | Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuthentication().pipe(
    tap(auth => {
      if (!auth) router.navigate(['/auth/login']);
    })
  );
};
