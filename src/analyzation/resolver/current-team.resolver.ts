import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { ProductTeam } from 'src/shared';
import { TrainingFilterService } from '../public_api';
import { combineLatest, map } from 'rxjs';
import { DevelopmentFilterService } from '../filter/development-filter.service';

export const currentTeamResolver: ResolveFn<ProductTeam | undefined> = () => {
  const trainingFilter = inject(TrainingFilterService);
  const developmentFilter = inject(DevelopmentFilterService);

  return combineLatest([
    trainingFilter.filteredData$,
    developmentFilter.filteredData$,
  ]).pipe(
    map((it) => {
      const team = getFilteredTeam(it[0].productTeams);
      if (!team) {
        return getFilteredTeam(it[1].productTeams);
      }
      return team;
    })
  );
};

const getFilteredTeam = (teams: ProductTeam[]): ProductTeam | undefined => {
  if (teams.length !== 1) {
    return undefined;
  }
  return teams[0];
};
