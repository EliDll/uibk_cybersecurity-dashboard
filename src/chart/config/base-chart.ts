import { ChartData, ChartType } from 'chart.js/dist/types';
import { ChartConfiguration, ChartDataset, DefaultDataPoint } from 'chart.js';
import { Directive, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ColorType, getColorWithOpacity, mapColorType } from '../public_api';

export type ActiveElement = {
  dataSetIndex?: number;
  index?: number;
};

export type ChartClickedEvent = {
  active?: ActiveElement[];
};

@Directive()
export abstract class BaseChart<T, ChartT extends ChartType = ChartType>
  implements OnDestroy
{
  abstract chartTitle: string;
  abstract chartLegend: boolean;
  abstract chartType: ChartType;

  protected destroy$ = new Subject<void>();
  chartData!: Observable<ChartData>;

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
  };

  protected abstract collectChartData(data: T): ChartData<ChartT>;

  abstract init(route: ActivatedRoute): void;

  ngOnDestroy() {
    this.destroy$.next();
  }

  onChartClicked(event: ChartClickedEvent): void {
    console.log(event);
    return; // do nothing by default
  }

  public createDataset(
    label: string | undefined,
    data: DefaultDataPoint<ChartT>,
    color: ColorType | string,
    filled?: boolean,
    noSpacing?: boolean,
    fill?: string | boolean
  ): ChartDataset<ChartT> {
    const borderColor = mapColorType(color);
    const backgroundColor = filled
      ? getColorWithOpacity(borderColor, 0.7)
      : getColorWithOpacity(borderColor, 0.5);

    return {
      label,
      data,
      backgroundColor,
      borderColor,
      borderWidth: 2,
      pointBackgroundColor: borderColor,
      fill: fill ?? 'origin',
      pointRadius: 6,
      pointHoverRadius: 8,
      barPercentage: noSpacing ? 0.99 : 0.9,
      categoryPercentage: noSpacing ? 0.99 : 0.9,
    } as unknown as ChartDataset<ChartT>;
  }
}
