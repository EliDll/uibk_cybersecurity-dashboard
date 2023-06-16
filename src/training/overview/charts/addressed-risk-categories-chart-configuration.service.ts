import { Injectable } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { AbstractChartConfiguration, ColorType } from '../../../chart';
import { ParsedTrainingDataModel } from '../../../shared';
import { TrainingFilterService } from '../../../analyzation';
import { getAverageConfidence } from 'src/shared/util/confidence';

@Injectable({
  providedIn: 'root',
})
export class AddressedRiskCategoriesChartConfigurationService extends AbstractChartConfiguration<
  ParsedTrainingDataModel,
  'radar'
> {
  chartLegend = true;
  chartTitle = 'OWASP Confidence Radar';
  chartType: ChartType = 'radar';
  override chartOptions = {
    responsive: true,
    scale: {
      min: 0,
      max: 100,
      ticks: {
        stepSize: 10,
      },
    },
  };
  dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super();
  }

  protected collectChartData(
    data: ParsedTrainingDataModel
  ): ChartData<'radar'> {
    const securityRisks = data.securityRisks;

    return {
      labels: securityRisks.map(
        (securityRisk) => securityRisk.id + ': ' + securityRisk.name
      ),
      datasets: [
        this.createDataset(
          'Industry average confidence',
          securityRisks.map((it) => it.industryPercentage * 100),
          ColorType.Accent
        ),
        this.createDataset(
          'Our average confidence',
          securityRisks.map((it) => getAverageConfidence(data, it) * 100),
          ColorType.Primary
        ),
      ],
    };
  }
}
