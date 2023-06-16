import { Component } from '@angular/core';
import { DevelopmentBreadCrumbService } from '../../services/development-bread-crumb.service';
import { map, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductTeam } from 'src/shared';
import { RouteData } from 'src/shared/util/routes';
import { CodeScanPenTestChartConfiguration } from '../charts/codescan-pentest-chart-configuration.service';
import { TeamPentestFindingsChartConfigurationService } from '../charts/team-pentest-findings-chart-configuration.service';
import { PentestDistributionChartConfiguration } from '../charts/pentest-distribution-chart-configuration.service';
import { PentestSeverityCountConfigurationService } from '../charts/pentest-severity-count-configuration.service';

@Component({
  selector: 'app-team-detail-view',
  templateUrl: './team-detail-view.component.html',
  styleUrls: ['./team-detail-view.component.scss'],
})
export class TeamDetailViewComponent {
  teamName$: Observable<string> = this.activatedRoute.data.pipe(
    map((it) => {
      return (it[RouteData.CURRENT_TEAM] as ProductTeam).name;
    })
  );

  product$: Observable<ProductTeam> = this.activatedRoute.data.pipe(
    map((it) => {
      return it[RouteData.CURRENT_TEAM] as ProductTeam;
    })
  );

  currentProduct$: Observable<ProductTeam | undefined>;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    readonly developmentBreadCrumbService: DevelopmentBreadCrumbService,
    public readonly codeScanPenTestChartConfiguration: CodeScanPenTestChartConfiguration,
    readonly teamPentestFindingsConfiguration: TeamPentestFindingsChartConfigurationService,
    readonly pentestDistributionChartConfiguration: PentestDistributionChartConfiguration,
    readonly pentestSeverityCountConfiguration: PentestSeverityCountConfigurationService
  ) {
    this.currentProduct$ = this.activatedRoute.data.pipe(
      map((it) => {
        return it[RouteData.CURRENT_TEAM];
      })
    );
  }
}
