import { Injectable } from '@angular/core';
import { Observable, filter, map } from 'rxjs';
import { ParsedDataService } from 'src/normalization';
import {
  BreadcrumbConfig,
  BreadcrumbSegment,
  Developer,
  NextBreadcrumbSegment,
  ParsedTrainingDataModel,
  ProductTeam,
} from 'src/shared';
import { RouteData, RouteNames } from 'src/shared/util/routes';

@Injectable()
export class TrainingBreadcrumbsService extends BreadcrumbConfig {
  constructor(private readonly parsedData: ParsedDataService) {
    super();
  }

  public buildRootSegment(): Observable<BreadcrumbSegment> {
    return this.parsedData.getParsedTrainingData$().pipe(
      filter((it): it is ParsedTrainingDataModel => !!it),
      map(
        (parsedData) =>
          ({
            title: 'Training',
            route: [RouteNames.TRAINING_VIEW],
            next: parsedData.productTeams
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(
                (pt) =>
                  ({
                    title: pt.name,
                    route: [
                      RouteNames.TRAINING_VIEW,
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
    return this.parsedData.getParsedTrainingData$().pipe(
      filter((it): it is ParsedTrainingDataModel => !!it),
      map((it) => {
        switch (dataKey) {
          case RouteData.CURRENT_DEVELOPER:
            return this.buildDeveloperSegments(data as Developer, it);
          case RouteData.CURRENT_TEAM:
            return this.buildProductTeamSegment(data as ProductTeam, it);
          default:
            throw new Error('Not implemented!');
        }
      })
    );
  }

  private buildProductTeamSegment(
    productTeam: ProductTeam,
    parsedData: ParsedTrainingDataModel
  ): BreadcrumbSegment[] {
    const result: BreadcrumbSegment[] = [];

    const devsInTeam = parsedData.developers
      .filter((it) => it.productTeamsIds.includes(productTeam.id))
      .sort((a, b) => a.name.localeCompare(b.name));

    result.push({
      title: productTeam.name,
      route: [
        RouteNames.TRAINING_VIEW,
        RouteNames.TEAM_DETAIL_VIEW,
        productTeam.id,
      ],
      next: devsInTeam.map(
        (it) =>
          ({
            title: it.name,
            route: [
              RouteNames.TRAINING_VIEW,
              RouteNames.DEVELOPER_DETAIL_VIEW,
              it.id,
            ],
          } satisfies NextBreadcrumbSegment)
      ),
    });

    return result;
  }

  private buildDeveloperSegments(
    developer: Developer,
    parsedData: ParsedTrainingDataModel
  ): BreadcrumbSegment[] {
    const result: BreadcrumbSegment[] = [];
    const productTeam =
      developer.productTeamsIds.length > 0
        ? parsedData.productTeams.find(
            (it) => it.id === developer.productTeamsIds[0]
          )
        : undefined;
    if (productTeam) {
      result.push(...this.buildProductTeamSegment(productTeam, parsedData));
    }

    result.push({
      title: developer.name,
      route: [
        RouteNames.TRAINING_VIEW,
        RouteNames.DEVELOPER_DETAIL_VIEW,
        developer.id,
      ],
    } satisfies BreadcrumbSegment);

    return result;
  }
}
