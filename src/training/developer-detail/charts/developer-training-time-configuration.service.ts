import { Injectable } from '@angular/core';
import { ChartData } from 'chart.js';
import {
  AbstractResourceChartConfiguration,
  ResourceData,
} from '../../../chart/config/abstract-resource-chart-configuration';
import {
  Developer,
  ParsedTrainingDataModel,
  TrainingEntry,
} from '../../../shared';
import { ChartType } from 'chart.js/dist/types';
import { RouteData } from '../../../shared/util/routes';
import { TrainingFilterService } from '../../../analyzation';
import { ColorType } from 'src/chart';

@Injectable({
  providedIn: 'root',
})
export class DeveloperTrainingTimeConfigurationService extends AbstractResourceChartConfiguration<
  ParsedTrainingDataModel,
  Developer,
  'pie'
> {
  dataSource$ = this.trainingFilterService.filteredData$;
  chartTitle = 'Time spent on OWASP risks';
  chartLegend = true;
  chartType: ChartType = 'pie';

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super(RouteData.CURRENT_DEVELOPER);
  }

  protected collectChartData(
    data: ResourceData<ParsedTrainingDataModel, Developer>
  ): ChartData<'pie'> {
    const completedTrainingEntries = data.data.trainingEntries.filter(
      (t) => t.developerId === data.resource.id && t.completedDate !== undefined
    );

    const timeSpentPerSecurityRisk = this.getTimeSpentPerSecurityRisk(
      completedTrainingEntries,
      data.data
    );

    return {
      labels: Array.from(timeSpentPerSecurityRisk.keys()),
      datasets: [
        this.createDataset(
          undefined,
          Array.from(timeSpentPerSecurityRisk.values()),
          ColorType.Primary
        ),
      ],
    };
  }

  private getTimeSpentPerSecurityRisk(
    trainings: TrainingEntry[],
    data: ParsedTrainingDataModel
  ): Map<string, number> {
    return trainings.reduce((acc, t) => {
      const addressedRiskIds =
        data.trainingUnits.find((unit) => unit.id == t.trainingUnitId)
          ?.addressedRiskIds ?? [];
      const securityRiskNames = data.securityRisks
        .filter((s) => addressedRiskIds.includes(s.id))
        .map((s) => s.id + ': ' + s.name);

      securityRiskNames.forEach((s) => {
        acc.set(s, (acc.get(s) ?? 0) + t.loggedTime);
      });
      return acc;
    }, new Map());
  }
}
