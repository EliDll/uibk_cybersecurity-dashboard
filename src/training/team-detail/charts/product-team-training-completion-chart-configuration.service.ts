import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ChartData, ChartType } from 'chart.js/dist/types';
import {
  Developer,
  ParsedTrainingDataModel,
  ProductTeam,
  RouteNames,
} from '../../../shared';
import { TrainingFilterService } from 'src/analyzation';
import { ChartClickedEvent } from 'src/chart/config/base-chart';
import {
  AbstractResourceChartConfiguration,
  ResourceData,
} from '../../../chart/config/abstract-resource-chart-configuration';
import { RouteData } from '../../../shared/util/routes';
import { ColorType } from 'src/chart';

const LABEL_COMPLETED_TRAINING_UNITS = 'Completed Training Units';
const LABEL_INCOMPLETE_TRAINING_UNITS = 'Incomplete Training Units';

@Injectable({
  providedIn: 'root',
})
export class ProductTeamTrainingCompletionChartConfigurationService extends AbstractResourceChartConfiguration<
  ParsedTrainingDataModel,
  ProductTeam,
  'bar'
> {
  chartLegend = true;
  chartTitle = 'Training Completion';
  chartType: ChartType = 'bar';
  override chartOptions = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
  dataSource$ = this.trainingFilterService.filteredData$;

  developersInTeam: Developer[] = [];

  constructor(
    private router: Router,
    private readonly trainingFilterService: TrainingFilterService
  ) {
    super(RouteData.CURRENT_TEAM);
  }

  override onChartClicked(e: ChartClickedEvent): void {
    const devIndex: number | undefined =
      e.active && e.active.length > 0 ? e.active[0].index : undefined;
    if (devIndex !== undefined && devIndex >= 0) {
      this.router.navigate([
        RouteNames.TRAINING_VIEW,
        RouteNames.DEVELOPER_DETAIL_VIEW,
        this.developersInTeam[devIndex].id,
      ]);
    }
  }

  override collectChartData(
    data: ResourceData<ParsedTrainingDataModel, ProductTeam>
  ): ChartData<'bar'> {
    this.developersInTeam = this.getDevelopersInTeam(data);

    const completedData = this.developersInTeam.map(
      (dev) =>
        data.data.trainingEntries.filter(
          (t) => t.developerId === dev.id && t.completedDate !== undefined
        ).length
    );
    const incompleteData = this.developersInTeam.map(
      (dev) =>
        data.data.trainingEntries.filter(
          (t) => t.developerId === dev.id && t.completedDate === undefined
        ).length
    );

    return {
      labels: this.developersInTeam.map((dev) => dev.name),
      datasets: [
        this.createDataset(
          LABEL_COMPLETED_TRAINING_UNITS,
          completedData,
          ColorType.Primary
        ),
        this.createDataset(
          LABEL_INCOMPLETE_TRAINING_UNITS,
          incompleteData,
          ColorType.Accent
        ),
      ],
    };
  }

  private getDevelopersInTeam(
    data: ResourceData<ParsedTrainingDataModel, ProductTeam>
  ) {
    return data.data.developers.filter((dev) =>
      dev.productTeamsIds.includes(data.resource.id)
    );
  }
}
