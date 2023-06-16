import { Injectable } from '@angular/core';
import { AbstractChartConfiguration, ColorType } from '../../../chart';
import { ChartData, ChartType } from 'chart.js';
import { ParsedDevelopmentDataModel } from 'src/shared';
import { DevelopmentFilterService } from 'src/analyzation/filter/development-filter.service';
import { sortStringArray } from 'src/utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class MostPrevalentRisksChartConfigurationService extends AbstractChartConfiguration<
  ParsedDevelopmentDataModel,
  'bar'
> {
  dataSource$ = this.filterService.filteredData$;
  chartLegend = true;
  chartTitle = 'Pentest Findings - All time';
  chartType: ChartType = 'bar';

  constructor(private readonly filterService: DevelopmentFilterService) {
    super();
  }

  protected collectChartData(
    data: ParsedDevelopmentDataModel
  ): ChartData<'bar'> {
    const sumRisks = data.securityRisks.map(
      (it) =>
        data.penTestFindings.filter((pen) => pen.riskIds.includes(it.id)).length
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
