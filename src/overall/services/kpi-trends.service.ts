import { Injectable } from '@angular/core';
import { DateTime } from 'luxon';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ParsedDataService } from 'src/normalization';
import {
  ParsedDevelopmentDataModel,
  ParsedTrainingDataModel,
  ProductRelease,
} from 'src/shared';
import { getAverageConfidenceAtDate } from 'src/shared/util/confidence';

export type KpiTrend = { current: number; last: number; delta: number };

function createTrend(current: number, last: number): KpiTrend {
  return { current, last, delta: ((current - last) / last) * 100 };
}

@Injectable({
  providedIn: 'root',
})
export class KpiTrends {
  constructor(private readonly parsedDataService: ParsedDataService) {}

  get trainingKpis$(): Observable<KpiTrend> {
    return this.parsedDataService
      .getParsedTrainingData$()
      .pipe(filter((data): data is ParsedTrainingDataModel => !!data))
      .pipe(
        map((data) => {
          const today = new Date();
          const lastMonth = new Date();
          lastMonth.setMonth(today.getMonth() - 1);
          lastMonth.setDate(1);

          const curr = getAverageConfidenceAtDate(data, today);
          const last = getAverageConfidenceAtDate(data, lastMonth);

          return createTrend(curr * 100, last * 100);
        })
      );
  }

  get developmentKpis$(): Observable<KpiTrend> {
    return this.parsedDataService
      .getParsedDevelopmentData$()
      .pipe(filter((data): data is ParsedDevelopmentDataModel => !!data))
      .pipe(
        map((data) => {
          const today = new Date();
          const lastMonth = new Date();
          lastMonth.setMonth(today.getMonth() - 1);
          lastMonth.setDate(1);

          const currentReleases = this.getNewestReleasesAtDate(data, today);
          const lastMonthReleases = this.getNewestReleasesAtDate(
            data,
            lastMonth
          );

          const currentSeverities = this.getTotalSeverityPerRelease(
            data,
            currentReleases
          );
          const lastMonthSeverities = this.getTotalSeverityPerRelease(
            data,
            lastMonthReleases
          );

          const currentTotal = currentSeverities.reduce(
            (sum, curr) => sum + curr,
            0
          );
          const lastMonthTotal = lastMonthSeverities.reduce(
            (sum, curr) => sum + curr,
            0
          );

          return createTrend(currentTotal, lastMonthTotal);
        })
      );
  }

  private getTotalSeverityPerRelease(
    data: ParsedDevelopmentDataModel,
    releases: ProductRelease[]
  ): number[] {
    const releasesTotalSeverity = releases.map((r) => {
      const findings = data.penTestFindings.filter((x) => x.releaseId === r.id);

      return findings
        .map((x) => x.severity)
        .reduce((sum, curr) => sum + curr, 0);
    });
    return releasesTotalSeverity;
  }

  private getNewestReleasesAtDate(
    data: ParsedDevelopmentDataModel,
    cutoff: Date
  ): ProductRelease[] {
    const cutoffDateTime = DateTime.fromJSDate(cutoff).endOf('day');

    const productIds = data.productTeams.map((x) => x.id);
    let mostRecentReleases: ProductRelease[] = productIds
      .map((pid) => data.productReleases.find((r) => r.productId === pid))
      .filter((r) => r !== undefined)
      .map((r) => r as ProductRelease);

    mostRecentReleases = mostRecentReleases.map((current) => {
      const pid = current?.productId;
      const others = data.productReleases.filter((x) => x.productId === pid);

      let newest = current;
      others.map((candidate) => {
        const currentDateTime = DateTime.fromJSDate(current?.releaseDate).endOf(
          'day'
        );
        const candidateDateTime = DateTime.fromJSDate(
          candidate.releaseDate
        ).endOf('day');

        if (
          candidateDateTime > currentDateTime &&
          cutoffDateTime > candidateDateTime
        ) {
          newest = candidate;
        }
      });

      return newest;
    });

    return mostRecentReleases;
  }
}
