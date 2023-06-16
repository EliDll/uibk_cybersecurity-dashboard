import { Component, Input, OnChanges } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import {
  Developer,
  ParsedTrainingDataModel,
  TrainingEntry,
} from '../../../shared';
import { TrainingFilterService } from '../../../analyzation';
import { ParsedDataService } from '../../../normalization';
import {
  RankedTrainingUnit,
  getScoredTrainingsForDeveloper,
} from '../../../shared/util/recommenders';
import { BaseRecommendedTraining } from './base-recommended-training';
import { getDeveloperAverageConfidence } from 'src/shared/util/confidence';

@Component({
  selector: 'app-developer-recommended-training',
  templateUrl: './developer-recommended-training.component.html',
  styleUrls: ['./developer-recommended-training.component.scss'],
})
export class DeveloperRecommendedTrainingComponent
  extends BaseRecommendedTraining
  implements OnChanges
{
  @Input()
  currentDeveloper: Developer | undefined;

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
    if (this.currentDeveloper) {
      const dev = this.currentDeveloper;
      console.log(this.currentDeveloper);
      this.rankedTrainings$ = this.filteredData$.pipe(
        map((data) => getScoredTrainingsForDeveloper(data, dev))
      );
    }
  }

  onScheduleClick(unitId: string, data: ParsedTrainingDataModel) {
    if (!this.currentDeveloper) {
      return;
    }

    const newTrainingEntry: TrainingEntry = {
      developerId: this.currentDeveloper.id,
      loggedTime: 0,
      scheduledDate: new Date(),
      trainingUnitId: unitId,
      completedDate: undefined,
      confidencePercentage:
        getDeveloperAverageConfidence(data, this.currentDeveloper) + 0.05,
    };

    data.trainingEntries.push(newTrainingEntry);
    this.parsedDataService.setParsedTrainingData$({ ...data });
  }
}
