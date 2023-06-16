import { Injectable } from '@angular/core';
import { AbstractChartConfiguration } from '../../../chart';
import { ChartData, ChartType } from 'chart.js/dist/types';
import { TrainingFilterService } from 'src/analyzation';
import { ParsedTrainingDataModel, ProductTeam } from '../../../shared';

@Injectable({
  providedIn: 'root',
})
export class TechnologyChartConfigurationService extends AbstractChartConfiguration<ParsedTrainingDataModel> {
  chartLegend = true;
  chartTitle = 'Relevant Technologies used across Teams';
  chartType: ChartType = 'bar';
  dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super();
  }

  protected collectChartData(data: ParsedTrainingDataModel): ChartData {
    const technologiesUsed = this.getSumTechnologiesUsedInTeams(data);
    return {
      labels: Array.from(technologiesUsed.keys()),
      datasets: [
        {
          data: Array.from(technologiesUsed.values()),
          label: 'Number of projects',
        },
      ],
    } as ChartData;
  }

  private getSumTechnologiesUsedInTeams(
    data: ParsedTrainingDataModel
  ): Map<string, number> {
    return new Map<string, number>(
      data.technologies.map((technology) => [
        technology.name,
        this.getNumberOfProductTeamsForTechnology(
          technology.id,
          data.productTeams
        ),
      ])
    );
  }

  private getNumberOfProductTeamsForTechnology(
    technologyId: string,
    productTeams: ProductTeam[]
  ): number {
    return productTeams.filter((productTeam) =>
      productTeam.technologyIds.includes(technologyId)
    ).length;
  }
}
