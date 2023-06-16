import { Injectable } from '@angular/core';
import { BaseFilter, BaseFilterService } from './training-filter.service';
import {
  ParsedDevelopmentDataModel,
  PenTestFinding,
  ProductRelease,
} from 'src/shared';
import { Observable, combineLatest, map } from 'rxjs';
import { ParsedDataService } from 'src/normalization';
import { DateTime } from 'luxon';

export type DevelopmentFilter = BaseFilter;

@Injectable({
  providedIn: 'root',
})
export class DevelopmentFilterService extends BaseFilterService<
  DevelopmentFilter,
  ParsedDevelopmentDataModel
> {
  constructor(private readonly parsedDataService: ParsedDataService) {
    super();
  }

  get filteredData$(): Observable<ParsedDevelopmentDataModel> {
    return combineLatest([
      this.parsedDataService.getParsedDevelopmentData$(),
      this._currentFilter$,
    ]).pipe(
      map(([data, filter]) => {
        if (!data) return {} as ParsedDevelopmentDataModel;

        if (filter?.productTeamIds) {
          data = this.filterByProductTeam(data, filter.productTeamIds);
        }

        if (filter?.snapshotDate) {
          data = this.filterBySnapshot(data, filter.snapshotDate);
        }

        return data;
      })
    );
  }

  private filterBySnapshot(
    data: ParsedDevelopmentDataModel,
    snapshotDate: Date
  ): ParsedDevelopmentDataModel {
    return {
      ...data,
      productReleases: data.productReleases.filter((t) =>
        this.releaseIsBeforeDate(t, snapshotDate)
      ),
      penTestFindings: data.penTestFindings.map((finding) => {
        return this.resolveIsBeforeDate(finding, snapshotDate)
          ? finding
          : { ...finding, resolvedDate: undefined };
      }),
    };
  }

  private releaseIsBeforeDate(
    training: ProductRelease,
    snapshotDate: Date
  ): boolean {
    const snapshotDateTime = DateTime.fromJSDate(snapshotDate).endOf('day');
    const referenceDateTime = DateTime.fromJSDate(training.releaseDate).endOf(
      'day'
    );

    return referenceDateTime <= snapshotDateTime;
  }

  private resolveIsBeforeDate(
    pentestFinding: PenTestFinding,
    snapshotDate: Date
  ): boolean {
    const snapshotDateTime = DateTime.fromJSDate(snapshotDate).endOf('day');
    if (pentestFinding.resolvedDate) {
      const referenceDateTime = DateTime.fromJSDate(
        pentestFinding.resolvedDate
      ).endOf('day');

      return referenceDateTime <= snapshotDateTime;
    } else {
      return true;
    }
  }
}
