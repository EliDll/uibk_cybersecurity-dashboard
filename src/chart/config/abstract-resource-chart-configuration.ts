import { ActivatedRoute } from '@angular/router';
import { ChartType } from 'chart.js';
import { RouteData } from 'src/shared/util/routes';
import { combineLatest, filter, map, Observable, takeUntil } from 'rxjs';
import { BaseChart } from './base-chart';

export type ResourceData<D, R> = {
  data: D;
  resource: R;
};

export abstract class AbstractResourceChartConfiguration<
  T,
  E,
  ChartT extends ChartType = ChartType
> extends BaseChart<ResourceData<T, E>, ChartT> {
  abstract dataSource$: Observable<T>;

  constructor(private readonly routeData: RouteData) {
    super();
  }

  override init(activatedRoute: ActivatedRoute): void {
    this.chartData = combineLatest([
      this.dataSource$,
      activatedRoute.data,
    ]).pipe(
      takeUntil(this.destroy$),
      map((it) => [it[0], it[1][this.routeData]]),
      filter((it): it is [T, E] => !!it[0] && !!it[1]),
      map((it) =>
        this.collectChartData({
          data: it[0],
          resource: it[1],
        } satisfies ResourceData<T, E>)
      )
    );
    this.chartData.subscribe();
  }
}
