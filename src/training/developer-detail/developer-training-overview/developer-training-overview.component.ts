import { Component, Input, OnInit } from '@angular/core';
import {
  Developer,
  ParsedTrainingDataModel,
  TrainingEntry,
} from '../../../shared';
import { Observable, map } from 'rxjs';
import { TrainingFilterService } from '../../../analyzation';

type AugmentedTrainingEntry = TrainingEntry & {
  completed: boolean;
};

@Component({
  selector: 'app-developer-training-overview',
  templateUrl: './developer-training-overview.component.html',
  styleUrls: ['./developer-training-overview.component.scss'],
})
export class DeveloperTrainingOverviewComponent implements OnInit {
  @Input()
  currentDeveloper: Developer | undefined;

  filteredData$: Observable<ParsedTrainingDataModel>;

  trainings$: Observable<AugmentedTrainingEntry[]> | undefined;

  constructor(trainingFilterService: TrainingFilterService) {
    this.filteredData$ = trainingFilterService.filteredData$;
  }

  ngOnInit() {
    if (this.currentDeveloper) {
      const dev = this.currentDeveloper;
      this.trainings$ = this.filteredData$.pipe(
        map((data: ParsedTrainingDataModel) => this.getEntries(data, dev))
      );
    }
  }

  getEntries(
    data: ParsedTrainingDataModel,
    developer: Developer
  ): AugmentedTrainingEntry[] {
    const matchingEntries = data.trainingEntries.filter(
      (entry) => entry.developerId === developer.id
    );

    const augmentedEntries = matchingEntries.map((entry) => {
      return {
        ...entry,
        completed: entry.completedDate !== undefined,
        loggedTime: entry.loggedTime || 0,
      };
    });

    return augmentedEntries.sort((a) => (a.completed ? -1 : 1));
  }
}
