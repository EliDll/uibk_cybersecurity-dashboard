import { ChartType, ChartData } from 'chart.js';
import { Injectable } from '@angular/core';
import {
  AbstractResourceChartConfiguration,
  ColorType,
  ResourceData,
} from 'src/chart';
import { ParsedModel, ProductTeam } from 'src/shared';
import { RouteData } from 'src/shared/util/routes';
import { ParsedDataService } from 'src/normalization';
import { combineLatest, filter } from 'rxjs';
import {
  getAverageConfidence,
  getTeamAverageConfidence,
} from 'src/shared/util/confidence';
import { TrainingFilterService } from 'src/analyzation';

type Model = [ParsedModel, ParsedModel];

@Injectable({
  providedIn: 'root',
})
export class OwaspTeamCoverageChartConfiguration extends AbstractResourceChartConfiguration<
  Model,
  ProductTeam,
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
  dataSource$ = combineLatest([
    this.parsedDataService.getParsedTrainingData$(),
    this.filterService.filteredData$,
  ]).pipe(filter((it): it is Model => !!it[0]));

  constructor(
    private readonly parsedDataService: ParsedDataService,
    private readonly filterService: TrainingFilterService
  ) {
    super(RouteData.CURRENT_TEAM);
  }

  protected collectChartData(
    data: ResourceData<Model, ProductTeam>
  ): ChartData<'radar'> {
    const allData = data.data[0];
    const filteredData = data.data[1];

    const otherTeams = allData.productTeams.filter(
      (it) => it.id !== data.resource.id
    );
    const securityRisks = filteredData.securityRisks;

    return {
      labels: securityRisks.map(
        (securityRisk) => securityRisk.id + ': ' + securityRisk.name
      ),
      datasets: [
        this.createDataset(
          'Other teams average confidence',
          securityRisks.map(
            (it) =>
              getAverageConfidence(
                {
                  ...filteredData,
                  productTeams: otherTeams,
                },
                it
              ) * 100
          ),
          ColorType.Accent
        ),
        this.createDataset(
          `${data.resource.name} average confidence`,
          securityRisks.map(
            (it) =>
              getTeamAverageConfidence(filteredData, data.resource, it) * 100
          ),
          ColorType.Primary
        ),
      ],
    };
  }
}
