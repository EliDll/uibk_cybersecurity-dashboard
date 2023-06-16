import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { ProductTeam } from '../../../shared';
import { RouteData } from 'src/shared/util/routes';
import { ProductTeamTrainingCompletionChartConfigurationService } from '../charts/product-team-training-completion-chart-configuration.service';
import { TrainingBreadcrumbsService } from 'src/training/services/training-breadcrumbs.service';
import { OwaspTeamCoverageChartConfiguration } from '../charts/owasp-coverage-chart-configuration.service';

@Component({
  selector: 'app-team-detail-view',
  templateUrl: './team-detail-view.component.html',
  styleUrls: ['./team-detail-view.component.scss'],
})
export class TeamDetailViewComponent {
  currentTeam$: Observable<ProductTeam | undefined>;
  headerTitle$: Observable<string> = this.activatedRoute.data.pipe(
    map((it) => {
      return (it[RouteData.CURRENT_TEAM] as ProductTeam).name;
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public owaspCoverage: OwaspTeamCoverageChartConfiguration,
    public productTeamTrainingCompletionChartConfigurationService: ProductTeamTrainingCompletionChartConfigurationService,
    public trainingBreadcrumbs: TrainingBreadcrumbsService
  ) {
    this.currentTeam$ = this.activatedRoute.data.pipe(
      map((it) => {
        return it[RouteData.CURRENT_TEAM];
      })
    );
  }
}
