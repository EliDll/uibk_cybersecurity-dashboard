import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { RouteNames } from 'src/shared';
import { ParsedDataService } from '../../normalization';

export const hasDataGuard: CanActivateFn = () => {
  const router = inject(Router);
  const dataSubjectService = inject(ParsedDataService);

  return dataSubjectService.hasTrainingData$.pipe(
    map((has) => {
      if (!has) {
        router.navigate([RouteNames.IMPORT]);
      }
      return has;
    })
  );
};
