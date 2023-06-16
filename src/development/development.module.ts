import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DevelopmentViewComponent } from './overview/development-view/development-view.component';
import { RouteNames, RouteParameterKeys, SharedModule } from '../shared';
import { ChartModule } from '../chart';
import {
  activeTeamSetGuard,
  activeTeamUnsetGuard,
} from 'src/analyzation/guards/active-team.guard';
import { currentTeamResolver } from 'src/analyzation/resolver/current-team.resolver';
import { TeamDetailViewComponent } from './team-detail/team-detail-view/team-detail-view.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PentestGridComponent } from './team-detail/pentest-grid/pentest-grid.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatTooltipModule,
    RouterModule.forChild([
      {
        path: '',
        component: DevelopmentViewComponent,
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
    SharedModule,
    ChartModule,
  ],
  declarations: [
    DevelopmentViewComponent,
    TeamDetailViewComponent,
    PentestGridComponent,
  ],
})
export class DevelopmentModule {}
