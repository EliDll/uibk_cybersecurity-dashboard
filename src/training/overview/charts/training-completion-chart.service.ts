import { Injectable } from '@angular/core';
import { ChartData, ChartType } from 'chart.js';
import { DateTime } from 'luxon';
import { TrainingFilterService } from 'src/analyzation';
import { AbstractChartConfiguration, ColorType } from 'src/chart';
import { BaseChart } from 'src/chart/config/base-chart';
import { ParsedTrainingDataModel, TrainingEntry } from 'src/shared';
import { sortByDate, sortDatesArray } from 'src/utils/array.utils';

@Injectable({
  providedIn: 'root',
})
export class TrainingCompletionChartConfiguration extends AbstractChartConfiguration<
  ParsedTrainingDataModel,
  'line'
> {
  override chartTitle = 'Average Training Completion over time';
  override chartLegend = true;
  override chartType: ChartType = 'line';
  override chartOptions = {
    responsive: true,
    min: 0,
    scale: {
      beginAtZero: true,
      ticks: {
        precision: 0,
      },
    },
  };

  override dataSource$ = this.trainingFilterService.filteredData$;

  constructor(private readonly trainingFilterService: TrainingFilterService) {
    super();
  }

  protected override collectChartData(
    data: ParsedTrainingDataModel
  ): ChartData<'line'> {
    return getTrainingCompletionChartData(this, data.trainingEntries);
  }
}

export function getTrainingCompletionChartData<T>(
  chart: BaseChart<T, 'line'>,
  entries: TrainingEntry[]
): ChartData<'line'> {
  const sortedTrainings = sortByDate(entries, (it) => it.scheduledDate);

  if (sortedTrainings.length === 0) {
    return {
      datasets: [],
    };
  }

  const allDates = sortDatesArray([
    ...entries.map((it) => it.scheduledDate),
    ...entries
      .map((it) => it.completedDate)
      .filter((it): it is Date => !!it)
      .sort((a, b) => a.getTime() - b.getTime()),
  ]);

  const endMonth = DateTime.now().endOf('month');
  const startMonth = DateTime.fromJSDate(allDates[0]).endOf('month');

  const labels: string[] = [];
  const allScheduled: number[] = [];
  const allCompleted: number[] = [];

  let currentMonth = startMonth;

  while (
    currentMonth.month <= endMonth.month &&
    currentMonth.year <= endMonth.year
  ) {
    labels.push(currentMonth.toFormat('yyyy-MM'));

    const numberOfTrainings = getNumberOfTrainingUntil(
      sortedTrainings,
      currentMonth.toJSDate()
    );
    allScheduled.push(numberOfTrainings[0]);
    allCompleted.push(numberOfTrainings[1]);

    currentMonth = currentMonth
      .plus({
        months: 1,
      })
      .endOf('month');
  }

  return {
    labels: labels,
    datasets: [
      chart.createDataset(
        'Completed trainings',
        allCompleted,
        ColorType.Primary
      ),
      chart.createDataset(
        'Scheduled trainings',
        allScheduled,
        ColorType.Accent
      ),
    ],
  };
}

function getNumberOfTrainingUntil(
  entries: TrainingEntry[],
  date: Date
): [number, number] {
  const numScheduled = entries.filter((it) => it.scheduledDate <= date).length;
  const numCompleted = entries.filter(
    (it) => !!it.completedDate && it.completedDate <= date
  ).length;

  return [numScheduled, numCompleted];
}
