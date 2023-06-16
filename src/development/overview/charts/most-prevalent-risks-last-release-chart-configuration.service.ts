import { Injectable } from '@angular/core';
import { AbstractChartConfiguration, ColorType } from '../../../chart';
import { ChartData, ChartType } from 'chart.js';
import { ParsedDevelopmentDataModel, ProductRelease } from 'src/shared';
import { DevelopmentFilterService } from 'src/analyzation/filter/development-filter.service';
import { sortByDate, sortStringArray } from 'src/utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class MostPrevalentRisksLastReleaseChartConfigurationService extends AbstractChartConfiguration<
  ParsedDevelopmentDataModel,
  'bar'
> {
  dataSource$ = this.filterService.filteredData$;
  chartLegend = true;
  chartTitle = 'Pentest Findings - Current releases';
  chartType: ChartType = 'bar';
  override chartOptions = {
    responsive: true,
    min: 0,
    scale: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  };

  constructor(private readonly filterService: DevelopmentFilterService) {
    super();
  }

  protected collectChartData(
    data: ParsedDevelopmentDataModel
  ): ChartData<'bar'> {
    const sortedReleases = sortByDate(
      data.productReleases,
      (it) => it.releaseDate
    );

    const lastReleasePerTeam = data.productTeams
      .map((team) => {
        const releases = sortedReleases.filter(
          (rel) => rel.productId === team.id
        );
        if (releases.length === 0) {
          return undefined;
        }
        return releases[releases.length - 1];
      })
      .filter((it): it is ProductRelease => !!it);

    const lasReleaseIDs = new Set(lastReleasePerTeam.map((it) => it.id));

    const sumRisks = data.securityRisks.map(
      (risk) =>
        data.penTestFindings.filter(
          (pen) =>
            pen.riskIds.includes(risk.id) && lasReleaseIDs.has(pen.releaseId)
        ).length
    );

    return {
      labels: sortStringArray(
        data.securityRisks.map((it) => `${it.id}: ${it.name}`)
      ),
      datasets: [
        this.createDataset(
          'Number of Pentest Findings',
          sumRisks,
          ColorType.Primary
        ),
      ],
    };
  }
}
