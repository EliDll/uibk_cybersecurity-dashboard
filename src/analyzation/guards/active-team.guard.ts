import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { map } from 'rxjs';
import { RouteParameterKeys } from 'src/shared';
import { ParsedDataService } from 'src/normalization';
import { CompositeFilterService } from '../filter/composite-filter.service';

export const activeTeamSetGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot
) => {
  const dataService = inject(ParsedDataService);
  const filterService = inject(CompositeFilterService);

  return dataService.getParsedTrainingData$().pipe(
    map((data) => {
      if (!data) {
        return false;
      }

      const teamID = route.params[RouteParameterKeys.TEAM_ID];
      if (!teamID) {
        return false;
      }

      const dev = data.productTeams.find((t) => t.id === teamID);
      if (dev) {
        filterService.applyFilter({
          productTeamIds: [teamID],
        });
        return true;
      }
      return false;
    })
  );
};

export const activeTeamUnsetGuard: CanActivateFn = () => {
  inject(CompositeFilterService).applyFilter({});
  return true;
};
