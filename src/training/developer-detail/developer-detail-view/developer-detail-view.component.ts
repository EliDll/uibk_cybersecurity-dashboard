import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';
import { Developer } from '../../../shared';
import { RouteData } from 'src/shared/util/routes';
import { DeveloperTrainingTimeConfigurationService } from '../charts/developer-training-time-configuration.service';
import { TrainingBreadcrumbsService } from 'src/training/services/training-breadcrumbs.service';
import { DeveloperTrainingCompletionChartConfiguration } from '../charts/developer-training-completion-chart.service';
import { OwaspDeveloperCoverageChartConfiguration } from '../charts/owasp-coverage-chart-configuration.service';

@Component({
  selector: 'app-developer-detail-view',
  templateUrl: './developer-detail-view.component.html',
  styleUrls: ['./developer-detail-view.component.scss'],
})
export class DeveloperDetailViewComponent {
  currentDeveloper$: Observable<Developer | undefined>;

  headerTitle$: Observable<string> = this.activatedRoute.data.pipe(
    map((it) => {
      return (it[RouteData.CURRENT_DEVELOPER] as Developer).name;
    })
  );

  constructor(
    private activatedRoute: ActivatedRoute,
    public developerTrainingTimeConfigurationService: DeveloperTrainingTimeConfigurationService,
    public developerTrainingCompletionChartConfiguration: DeveloperTrainingCompletionChartConfiguration,
    public owaspCoverage: OwaspDeveloperCoverageChartConfiguration,
    public trainingBreadcrumbs: TrainingBreadcrumbsService
  ) {
    this.currentDeveloper$ = this.activatedRoute.data.pipe(
      map((it) => {
        return it[RouteData.CURRENT_DEVELOPER];
      })
    );
  }
}
