import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Data, Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  map,
  of,
} from 'rxjs';
import { RouteData } from 'src/shared/util/routes';

export type BreadcrumbSegment = {
  title: string;
  route: string[];
  next?: NextBreadcrumbSegment[];
};

export type NextBreadcrumbSegment = {
  title: string;
  route: string[];
};

export abstract class BreadcrumbConfig {
  abstract buildSegment<T>(
    dataKey: RouteData,
    data: T
  ): Observable<BreadcrumbSegment[]>;

  abstract buildRootSegment(): Observable<BreadcrumbSegment>;
}

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss'],
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {
  @Input()
  config!: BreadcrumbConfig;

  currentSegments$: BehaviorSubject<Observable<BreadcrumbSegment[]> | null> =
    new BehaviorSubject<Observable<BreadcrumbSegment[]> | null>(null);

  private currentSegmentSub: Subscription | null = null;

  constructor(
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentSegmentSub = combineLatest([
      this.router.events,
      this.activatedRoute.data,
    ]).subscribe((it) => {
      this.currentSegments$.next(this.mapRouteData(it[1]));
    });
  }

  ngOnDestroy(): void {
    this.currentSegmentSub?.unsubscribe();
  }

  navigateTo(route: string[]): void {
    this.router.navigate(route);
  }

  private mapRouteData(data: Data): Observable<BreadcrumbSegment[]> {
    const root$ = this.config.buildRootSegment();
    let rest$: Observable<BreadcrumbSegment[]> | null = null;

    for (const entry of Object.entries(data)) {
      if (entry[0] === RouteData.CURRENT_DEVELOPER) {
        rest$ = this.config.buildSegment(RouteData.CURRENT_DEVELOPER, entry[1]);
        break;
      }

      if (entry[0] === RouteData.CURRENT_TEAM) {
        rest$ = this.config.buildSegment(RouteData.CURRENT_TEAM, entry[1]);
        break;
      }
    }

    return combineLatest([root$, rest$ ?? of(null)]).pipe(
      map((it) => {
        const root = it[0];
        const rest = it[1];

        const result = [root];
        if (rest) {
          result.push(...rest);
        }
        return result;
      })
    );
  }
}
