import { Injectable } from '@angular/core';
import { ChartType, ChartData } from 'chart.js';
import { TrainingFilterService } from 'src/analyzation';
import { AbstractResourceChartConfiguration, ResourceData } from 'src/chart';
import { Developer, ParsedTrainingDataModel } from 'src/shared';
import { RouteData } from 'src/shared/util/routes';
import { getTrainingCompletionChartData } from 'src/training/overview/charts/training-completion-chart.service';

@Injectable({
  providedIn: 'root',
})
export class DeveloperTrainingCompletionChartConfiguration extends AbstractResourceChartConfiguration<
  ParsedTrainingDataModel,
  Developer,
  'line'
> {
  override chartTitle = 'Training Completion over time';
  override chartLegend = true;
  override chartType: ChartType = 'line';
  override chartOptions = {
    responsive: true,
    scale: {
      beginAtZero: true,
      min: 0,
      ticks: {
        precision: 0,
      },
    },
  };

  override dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super(RouteData.CURRENT_DEVELOPER);
  }

  protected override collectChartData(
    dataWithResource: ResourceData<ParsedTrainingDataModel, Developer>
  ): ChartData<'line'> {
    const data = dataWithResource.data;
    const dev = dataWithResource.resource;

    return getTrainingCompletionChartData(
      this,
      data.trainingEntries.filter((it) => it.developerId === dev.id)
    );
  }
}
