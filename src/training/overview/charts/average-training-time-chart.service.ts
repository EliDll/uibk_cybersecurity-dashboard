import { Injectable } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { TrainingFilterService } from 'src/analyzation';
import { AbstractChartConfiguration, ColorType } from 'src/chart';
import { ParsedTrainingDataModel } from 'src/shared';
import { averageArray } from 'src/utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class AverageTrainingTimeChartConfiguration extends AbstractChartConfiguration<
  ParsedTrainingDataModel,
  'bar'
> {
  override chartTitle = 'Average time spent per training';
  override chartLegend = true;
  override chartType: ChartType = 'bar';

  override dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super();
  }

  protected override collectChartData(
    data: ParsedTrainingDataModel
  ): ChartData<'bar'> {
    const groupedTrainingUnits = new Map(
      data.trainingUnits.map((it) => [it.id, it])
    );

    const groupedDurations: Map<string, number[]> = new Map();
    for (const entry of data.trainingEntries) {
      if (
        !entry.loggedTime ||
        !groupedTrainingUnits.has(entry.trainingUnitId)
      ) {
        continue;
      }

      let existing = groupedDurations.get(entry.trainingUnitId);
      if (!existing) {
        existing = [];
        groupedDurations.set(entry.trainingUnitId, existing);
      }

      existing.push(entry.loggedTime);
    }

    const labels = [...groupedTrainingUnits]
      .filter((it) => groupedDurations.has(it[0]))
      .map((it) => it[1].id)
      .sort((a, b) => a.localeCompare(b));

    const avgDurations = [...groupedDurations]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map((it) => averageArray(it[1]));

    return {
      labels: labels,
      datasets: [
        this.createDataset('Average time [h]', avgDurations, ColorType.Primary),
      ],
    };
  }
}
