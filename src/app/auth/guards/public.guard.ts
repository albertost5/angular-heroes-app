import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {tap} from 'rxjs';

export const publicGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const authService = inject(AuthService);

  return authService.checkAuthentication().pipe(
    tap(auth => {
      if(auth) router.navigate(['/heroes'])
    })
  );
};
