import { DateTime } from 'luxon';
import { Observable, map } from 'rxjs';
import { TrainingFilterService } from 'src/analyzation';

export abstract class BaseRecommendedTraining {
  isDateFiltered$: Observable<boolean>;

  constructor(trainingFilterService: TrainingFilterService) {
    this.isDateFiltered$ = trainingFilterService.currentFilter$.pipe(
      map((filter) => {
        const date = filter?.snapshotDate;
        if (!date) {
          return false;
        }

        // Day implies year and month
        return !DateTime.now().hasSame(DateTime.fromJSDate(date), 'day');
      })
    );
  }
}
