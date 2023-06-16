import { ChartType, ChartData } from 'chart.js';
import { Injectable } from '@angular/core';
import {
  AbstractResourceChartConfiguration,
  ColorType,
  ResourceData,
} from 'src/chart';
import { Developer, ParsedModel } from 'src/shared';
import { RouteData } from 'src/shared/util/routes';
import {
  getDeveloperAverageConfidence,
  getTeamAverageConfidence,
} from 'src/shared/util/confidence';
import { averageArray } from 'src/utils/array.utils';
import { ParsedDataService } from 'src/normalization';
import { combineLatest, filter } from 'rxjs';
import { TrainingFilterService } from 'src/analyzation';

type Model = [ParsedModel, ParsedModel];

@Injectable({
  providedIn: 'root',
})
export class OwaspDeveloperCoverageChartConfiguration extends AbstractResourceChartConfiguration<
  Model,
  Developer,
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
    super(RouteData.CURRENT_DEVELOPER);
  }

  protected collectChartData(
    data: ResourceData<Model, Developer>
  ): ChartData<'radar'> {
    const allData = data.data[0];
    const filteredData = data.data[1];

    const teams = allData.productTeams.filter((it) =>
      data.resource.productTeamsIds.includes(it.id)
    );
    const teamIDs = new Set(teams.map((it) => it.id));
    const teamDevelopers = allData.developers.filter((dev) =>
      dev.productTeamsIds.some((teamID) => teamIDs.has(teamID))
    );
    const securityRisks = filteredData.securityRisks;

    return {
      labels: securityRisks.map(
        (securityRisk) => securityRisk.id + ': ' + securityRisk.name
      ),
      datasets: [
        this.createDataset(
          'Team average confidence',
          securityRisks.map(
            (risk) =>
              averageArray(
                teams.map((team) =>
                  getTeamAverageConfidence(
                    {
                      trainingUnits: filteredData.trainingUnits,
                      trainingEntries: filteredData.trainingEntries,
                      developers: teamDevelopers,
                    },
                    team,
                    risk
                  )
                )
              ) * 100
          ),
          ColorType.Accent
        ),
        this.createDataset(
          `${data.resource.name} average confidence`,
          securityRisks.map(
            (it) =>
              getDeveloperAverageConfidence(filteredData, data.resource, it) *
              100
          ),
          ColorType.Primary
        ),
      ],
    };
  }
}
