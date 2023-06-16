import { Component, Input, OnChanges } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { TrainingFilterService } from '../../../analyzation';
import { ParsedDataService } from '../../../normalization';
import {
  ParsedModel,
  ParsedTrainingDataModel,
  ProductTeam,
  TrainingEntry,
} from '../../../shared';
import {
  RankedTrainingUnit,
  getScoredTrainingsForTeam,
} from '../../../shared/util/recommenders';
import { BaseRecommendedTraining } from 'src/training/developer-detail/developer-recommended-training/base-recommended-training';
import { getDeveloperAverageConfidence } from 'src/shared/util/confidence';

@Component({
  selector: 'app-team-recommended-training',
  templateUrl: './team-recommended-training.component.html',
  styleUrls: ['./team-recommended-training.component.scss'],
})
export class TeamRecommendedTrainingComponent
  extends BaseRecommendedTraining
  implements OnChanges
{
  @Input()
  currentTeam: ProductTeam | undefined;

  teamSizeFactor$: Observable<number> | undefined;
  rankedTrainings$: Observable<RankedTrainingUnit[]> | undefined;
  filteredData$: Observable<ParsedTrainingDataModel>;
  trainingData$: Observable<ParsedTrainingDataModel>;

  constructor(
    trainingFilterService: TrainingFilterService,
    private readonly parsedDataService: ParsedDataService
  ) {
    super(trainingFilterService);

    this.filteredData$ = trainingFilterService.filteredData$;
    this.trainingData$ = parsedDataService
      .getParsedTrainingData$()
      .pipe(filter((data): data is ParsedTrainingDataModel => !!data));
  }

  ngOnChanges() {
    this.teamSizeFactor$ = this.trainingData$.pipe(
      filter((data): data is ParsedModel => !!data),
      map((data) => {
        const devs = data.developers.filter(
          (dev) =>
            this.currentTeam &&
            dev.productTeamsIds.includes(this.currentTeam.id)
        );

        if (devs.length !== 0) {
          return 1 / devs.length;
        } else {
          return 0;
        }
      })
    );

    if (this.currentTeam) {
      const team = this.currentTeam;
      this.rankedTrainings$ = this.filteredData$.pipe(
        map((data) => getScoredTrainingsForTeam(data, team))
      );
    }
  }

  onScheduleClick(unitId: string, data: ParsedTrainingDataModel) {
    if (this.currentTeam) {
      const devs = data.developers.filter(
        (dev) =>
          this.currentTeam && dev.productTeamsIds.includes(this.currentTeam.id)
      );

      const newTrainingEntries: TrainingEntry[] = devs.map((dev) => {
        const entry: TrainingEntry = {
          developerId: dev.id,
          loggedTime: 0,
          scheduledDate: new Date(),
          trainingUnitId: unitId,
          completedDate: undefined,
          confidencePercentage: getDeveloperAverageConfidence(data, dev) + 0.05,
        };
        return entry;
      });

      data.trainingEntries.push(...newTrainingEntries);

      this.parsedDataService.setParsedTrainingData$({ ...data });
    }
  }
}
