import { Component } from '@angular/core';
import { TechnologyChartConfigurationService } from '../charts/technology-chart-configuration.service';
import { AddressedRiskCategoriesChartConfigurationService } from '../charts/addressed-risk-categories-chart-configuration.service';
import { TrainingBreadcrumbsService } from 'src/training/services/training-breadcrumbs.service';
import { TimePerTrainingChartConfiguration } from '../charts/time-per-training-chart-configuration.service';
import { AverageTrainingTimeChartConfiguration } from '../charts/average-training-time-chart.service';
import { TrainingCompletionChartConfiguration } from '../charts/training-completion-chart.service';

@Component({
  selector: 'app-training-overview',
  templateUrl: './training-overview.component.html',
  styleUrls: ['./training-overview.component.scss'],
})
export class TrainingOverviewComponent {
  constructor(
    public technologyPieChartConfiguration: TechnologyChartConfigurationService,
    public addressedRiskCategoriesChartConfiguration: AddressedRiskCategoriesChartConfigurationService,
    public timePerTrainingChartConfiguration: TimePerTrainingChartConfiguration,
    public averageTrainingTimeChartConfiguration: AverageTrainingTimeChartConfiguration,
    public trainingCompletionChartConfiguration: TrainingCompletionChartConfiguration,
    public trainingBreadcrumbs: TrainingBreadcrumbsService
  ) {}
}
