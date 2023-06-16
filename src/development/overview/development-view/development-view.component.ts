import { Component } from '@angular/core';
import { DevelopmentBreadCrumbService } from '../../services/development-bread-crumb.service';
import { MostPrevalentRisksChartConfigurationService } from '../charts/most-prevalent-risks-chart-configuration.service';
import { ConfidenceAndFindingsChartConfigurationService } from '../charts/confidence-and-findings-chart-configuration.service';
import { TrainingFilterService } from '../../../analyzation';
import { ParsedTrainingDataModel, SecurityRisk } from '../../../shared';
import { Observable } from 'rxjs';
import { MostPrevalentRisksLastReleaseChartConfigurationService } from '../charts/most-prevalent-risks-last-release-chart-configuration.service';

@Component({
  selector: 'app-development-view',
  templateUrl: './development-view.component.html',
  styleUrls: ['./development-view.component.scss'],
})
export class DevelopmentViewComponent {
  trainingData$: Observable<ParsedTrainingDataModel> =
    this.trainingFilterService.filteredData$;
  constructor(
    readonly developmentBreadCrumbService: DevelopmentBreadCrumbService,
    readonly confidenceAndFindingsChartConfiguration: ConfidenceAndFindingsChartConfigurationService,
    readonly mostPrevalentRisksConfiguration: MostPrevalentRisksChartConfigurationService,
    readonly mostPrevalentRisksLastReleaseChartConfigurationService: MostPrevalentRisksLastReleaseChartConfigurationService,
    private trainingFilterService: TrainingFilterService
  ) {}

  onTabChange(index: number, risks: SecurityRisk[]): void {
    if (index === 0) {
      this.confidenceAndFindingsChartConfiguration.currentRisk = undefined;
    } else if (index > 0) {
      this.confidenceAndFindingsChartConfiguration.currentRisk =
        risks[index - 1];
    }
  }
}
