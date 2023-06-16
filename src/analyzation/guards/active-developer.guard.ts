import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { TrainingFilterService } from '../public_api';
import { map } from 'rxjs';
import { RouteParameterKeys } from 'src/shared';
import { ParsedDataService } from 'src/normalization';

export const activeDeveloperSetGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const dataService = inject(ParsedDataService);
  const filterService = inject(TrainingFilterService);

  return dataService.getParsedTrainingData$().pipe(
    map((data) => {
      if (!data) {
        return false;
      }

      const devID = route.params[RouteParameterKeys.DEVELOPER_ID];
      if (!devID) {
        return false;
      }

      const dev = data.developers.find((d) => d.id === devID);
      if (dev) {
        filterService.applyFilter({
          developerIds: [devID],
        });
        return true;
      }
      return false;
    })
  );
};

export const activeDeveloperUnsetGuard: CanActivateFn = () => {
  inject(TrainingFilterService).applyFilter({});
  return true;
};
