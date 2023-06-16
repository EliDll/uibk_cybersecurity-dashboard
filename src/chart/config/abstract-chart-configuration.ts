import { filter, map, Observable, takeUntil } from 'rxjs';
import { ChartType } from 'chart.js';
import { BaseChart } from './base-chart';

export abstract class AbstractChartConfiguration<
  T,
  ChartT extends ChartType = ChartType
> extends BaseChart<T, ChartT> {
  abstract dataSource$: Observable<T>;

  override init() {
    this.chartData = this.dataSource$.pipe(
      takeUntil(this.destroy$),
      filter((data): data is T => !!data),
      map((data) => this.collectChartData(data))
    );
    this.chartData.subscribe();
  }
}
