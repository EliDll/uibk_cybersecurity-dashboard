import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainingOverviewComponent } from './overview/training-overview/training-overview.component';
import { RouterModule } from '@angular/router';
import { RouteParameterKeys, RouteNames, SharedModule } from '../shared';
import { DeveloperDetailViewComponent } from './developer-detail/developer-detail-view/developer-detail-view.component';
import { MatCardModule } from '@angular/material/card';
import { ChartModule } from '../chart';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  activeDeveloperSetGuard,
  activeDeveloperUnsetGuard,
} from 'src/analyzation/guards/active-developer.guard';
import { currentDeveloperResolver } from 'src/analyzation/resolver/current-developer.resolver';
import { TeamDetailViewComponent } from './team-detail/team-detail-view/team-detail-view.component';
import {
  activeTeamSetGuard,
  activeTeamUnsetGuard,
} from 'src/analyzation/guards/active-team.guard';
import { currentTeamResolver } from 'src/analyzation/resolver/current-team.resolver';
import { DeveloperRecommendedTrainingComponent } from './developer-detail/developer-recommended-training/developer-recommended-training.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TeamRecommendedTrainingComponent } from './team-detail/team-recommended-training/team-recommended-training.component';
import { TrainingBreadcrumbsService } from './services/training-breadcrumbs.service';
import { DetailHeaderComponent } from './common/detail-header/detail-header.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DeveloperTrainingOverviewComponent } from './developer-detail/developer-training-overview/developer-training-overview.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    ChartModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    RouterModule.forChild([
      {
        path: '',
        component: TrainingOverviewComponent,
      },
      {
        path: `${RouteNames.DEVELOPER_DETAIL_VIEW}/:${RouteParameterKeys.DEVELOPER_ID}`,
        component: DeveloperDetailViewComponent,
        canActivate: [activeDeveloperSetGuard],
        canDeactivate: [activeDeveloperUnsetGuard],
        resolve: {
          currentDeveloper: currentDeveloperResolver,
        },
      },
      {
        path: `${RouteNames.TEAM_DETAIL_VIEW}/:${RouteParameterKeys.TEAM_ID}`,
        component: TeamDetailViewComponent,
        canActivate: [activeTeamSetGuard],
        canDeactivate: [activeTeamUnsetGuard],
        resolve: {
          currentTeam: currentTeamResolver,
        },
      },
    ]),
    MatButtonModule,
    SharedModule,
  ],
  declarations: [
    TrainingOverviewComponent,
    DeveloperDetailViewComponent,
    TeamDetailViewComponent,
    DetailHeaderComponent,
    DeveloperRecommendedTrainingComponent,
    TeamRecommendedTrainingComponent,
    DeveloperTrainingOverviewComponent,
  ],
  providers: [TrainingBreadcrumbsService],
})
export class TrainingModule {}
