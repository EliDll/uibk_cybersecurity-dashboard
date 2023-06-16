import { Injectable } from '@angular/core';
import {
  BreadcrumbConfig,
  BreadcrumbSegment,
  NextBreadcrumbSegment,
  ParsedModel,
  ProductTeam,
  RouteNames,
} from '../../shared';
import { RouteData } from '../../shared/util/routes';
import { Observable, filter, map, of } from 'rxjs';
import { ParsedDataService } from 'src/normalization';

@Injectable({
  providedIn: 'root',
})
export class DevelopmentBreadCrumbService extends BreadcrumbConfig {
  constructor(private readonly parsedDataService: ParsedDataService) {
    super();
  }

  buildRootSegment(): Observable<BreadcrumbSegment> {
    return this.parsedDataService.getParsedDevelopmentData$().pipe(
      filter((it): it is ParsedModel => !!it),
      map(
        (parsedData) =>
          ({
            title: 'Development',
            route: [RouteNames.DEVELOPMENT_VIEW],
            next: parsedData.productTeams
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(
                (pt) =>
                  ({
                    title: pt.name,
                    route: [
                      RouteNames.DEVELOPMENT_VIEW,
                      RouteNames.TEAM_DETAIL_VIEW,
                      pt.id,
                    ],
                  } satisfies NextBreadcrumbSegment)
              ),
          } satisfies BreadcrumbSegment)
      )
    );
  }

  override buildSegment<T>(
    dataKey: RouteData,
    data: T
  ): Observable<BreadcrumbSegment[]> {
    switch (dataKey) {
      case RouteData.CURRENT_TEAM:
        return of(this.buildProductTeamSegment(data as ProductTeam));
      default:
        throw new Error(dataKey + ' implemented!');
    }
  }

  private buildProductTeamSegment(
    productTeam: ProductTeam
  ): BreadcrumbSegment[] {
    const result: BreadcrumbSegment[] = [];

    result.push({
      title: productTeam.name,
      route: [
        RouteNames.DEVELOPMENT_VIEW,
        RouteNames.TEAM_DETAIL_VIEW,
        productTeam.id,
      ],
    });

    return result;
  }
}
