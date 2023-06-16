import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ParsedDataService } from '../../normalization';

export type FilterOption = {
  label: string;
  id: string;
};

@Injectable({ providedIn: 'root' })
export class FilterProviderService {
  constructor(private readonly subject: ParsedDataService) {}

  get developerOptions$(): Observable<FilterOption[]> {
    return this.subject
      .getParsedTrainingData$()
      .pipe(
        map(
          (data) =>
            data?.developers.map(
              (dev) => ({ label: dev.name, id: dev.id } as FilterOption)
            ) ?? []
        )
      );
  }

  get productTeamOptions$(): Observable<FilterOption[]> {
    return this.subject
      .getParsedTrainingData$()
      .pipe(
        map(
          (data) =>
            data?.productTeams.map(
              (team) => ({ label: team.name, id: team.id } as FilterOption)
            ) ?? []
        )
      );
  }

  get technologyOptions$(): Observable<FilterOption[]> {
    return this.subject
      .getParsedTrainingData$()
      .pipe(
        map(
          (data) =>
            data?.technologies.map(
              (technology) =>
                ({ label: technology.name, id: technology.id } as FilterOption)
            ) ?? []
        )
      );
  }

  get snapshotMinDate$(): Observable<Date | null> {
    return this.subject.getParsedTrainingData$().pipe(
      map((data) => {
        if (!data) {
          return null;
        }

        const allDates = [
          ...data.trainingEntries.map((it) => it.scheduledDate.getTime()),
          ...data.trainingEntries
            .map((it) => it.completedDate)
            .filter((it): it is Date => !!it)
            .map((it) => it.getTime()),
        ];

        return new Date(Math.min(...allDates));
      })
    );
  }
}
