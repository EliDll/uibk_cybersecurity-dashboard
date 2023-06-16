import { Injectable } from '@angular/core';
import { AbstractChartConfiguration, ColorType } from '../../../chart';
import { ChartData, ChartType } from 'chart.js/dist/types';
import { TrainingFilterService } from 'src/analyzation';
import { ParsedTrainingDataModel } from '../../../shared';
import { groupArrayBy } from '../../../utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class TimePerTrainingChartConfiguration extends AbstractChartConfiguration<
  ParsedTrainingDataModel,
  'bar'
> {
  chartLegend = false;
  chartTitle = 'Average time spent on Training Units';
  chartType: ChartType = 'bar';
  override chartOptions = {
    responsive: true,
    scales: {
      y: { title: { text: 'Average man-hours', display: true } },
      x: {},
    },
  };
  dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super();
  }

  protected collectChartData(data: ParsedTrainingDataModel): ChartData<'bar'> {
    const groupedEntries = groupArrayBy(
      data.trainingEntries.filter((e) => e.completedDate !== undefined),
      (entry) => entry.trainingUnitId
    );

    const labels: string[] = Object.keys(groupedEntries);
    const dataPoints: number[] = Object.values(groupedEntries).map(
      (entries) => {
        const timeArr = entries.map((entry) => entry.loggedTime);
        const total = timeArr.reduce((sum, curr) => sum + curr, 0);
        return total / timeArr.length;
      }
    );

    return {
      labels: labels,
      datasets: [
        this.createDataset('Average man-hours', dataPoints, ColorType.Primary),
      ],
    };
  }
}
