import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ParsedDataService } from '../../normalization';
import {
  ParsedTrainingDataModel,
  ProductTeam,
  TrainingEntry,
} from '../../shared';
import { DataUtils } from '../data-util/data-utils';
import { DateTime } from 'luxon';

export type TrainingFilter = BaseFilter & {
  developerIds?: string[];
  technologyIds?: string[];
};

export type BaseFilter = {
  productTeamIds?: string[];
  snapshotDate?: Date;
};

export type BaseData = {
  productTeams: ProductTeam[];
};

export abstract class BaseFilterService<
  F extends BaseFilter,
  T extends BaseData
> {
  protected readonly _currentFilter$ = new BehaviorSubject<F | null>(null);

  get currentFilter$(): Observable<F | null> {
    return this._currentFilter$.asObservable();
  }

  abstract get filteredData$(): Observable<T>;

  public applyFilter(filter: F): void {
    this._currentFilter$.next(filter);
  }

  protected filterByProductTeam(data: T, productTeamIds: string[]): T {
    return {
      ...data,
      productTeams: data.productTeams.filter((productTeam) =>
        productTeamIds.includes(productTeam.id)
      ),
    };
  }
}

@Injectable({
  providedIn: 'root',
})
export class TrainingFilterService extends BaseFilterService<
  TrainingFilter,
  ParsedTrainingDataModel
> {
  constructor(private readonly parsedDataService: ParsedDataService) {
    super();
  }

  get filteredData$(): Observable<ParsedTrainingDataModel> {
    return combineLatest([
      this.parsedDataService.getParsedTrainingData$(),
      this._currentFilter$,
    ]).pipe(
      map(([data, filter]) => {
        if (!data) return {} as ParsedTrainingDataModel;

        if (filter?.developerIds) {
          data = this.filterByDevelopers(data, filter.developerIds);
        }

        if (filter?.productTeamIds) {
          data = this.filterByProductTeam(data, filter.productTeamIds);
        }

        if (filter?.technologyIds) {
          data = this.filterByTechnologies(data, filter.technologyIds);
        }

        if (filter?.snapshotDate) {
          data = this.filterBySnapshot(data, filter.snapshotDate);
        }

        return data;
      })
    );
  }

  private filterBySnapshot(
    data: ParsedTrainingDataModel,
    snapshotDate: Date
  ): ParsedTrainingDataModel {
    return {
      ...data,
      trainingEntries: data.trainingEntries.filter((t) =>
        this.trainingIsBeforeDate(t, snapshotDate)
      ),
    };
  }

  private trainingIsBeforeDate(
    training: TrainingEntry,
    snapshotDate: Date
  ): boolean {
    const referencedDate = DataUtils.isTrainingEntryCompleted(training)
      ? training.completedDate
      : training.scheduledDate;
    if (referencedDate == null) {
      return false;
    }

    const snapshotDateTime = DateTime.fromJSDate(snapshotDate).endOf('day');
    const referenceDateTime = DateTime.fromJSDate(referencedDate).endOf('day');

    return referenceDateTime <= snapshotDateTime;
  }

  private filterByDevelopers(
    data: ParsedTrainingDataModel,
    developerIds: string[]
  ): ParsedTrainingDataModel {
    return {
      ...data,
      developers: data.developers.filter((dev) =>
        developerIds.includes(dev.id)
      ),
    };
  }

  private filterByTechnologies(
    data: ParsedTrainingDataModel,
    technologyIds: string[]
  ): ParsedTrainingDataModel {
    return {
      ...data,
      technologies: data.productTeams.filter((technology) =>
        technologyIds.includes(technology.id)
      ),
    };
  }
}
