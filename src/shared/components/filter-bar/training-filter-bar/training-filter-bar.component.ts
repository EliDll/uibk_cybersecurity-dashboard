import { Component } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import {
  FilterOption,
  TrainingFilterProviderService,
  TrainingFilterService,
} from 'src/analyzation';

@Component({
  selector: 'app-training-filter-bar',
  templateUrl: './training-filter-bar.component.html',
  styleUrls: ['./training-filter-bar.component.scss'],
})
export class TrainingFilterBarComponent {
  developerOptions$: Observable<FilterOption[]>;
  productTeamOptions$: Observable<FilterOption[]>;
  technologyOptions$: Observable<FilterOption[]>;
  selectedDeveloperIds: string[] = [];
  selectedProductTeamIds: string[] = [];
  selectedTechnologyIds: string[] = [];

  constructor(
    private readonly trainingFilterProvider: TrainingFilterProviderService,
    private readonly trainingFilterService: TrainingFilterService
  ) {
    this.developerOptions$ = this.trainingFilterProvider.developerOptions$;
    this.productTeamOptions$ = this.trainingFilterProvider.productTeamOptions$;
    this.technologyOptions$ = this.trainingFilterProvider.technologyOptions$;
  }

  onDevelopersChange(event: MatSelectChange): void {
    if (event.value === null || event.value === undefined) {
      return;
    }

    this.selectedDeveloperIds = event.value as string[];
    this.onFilterChange();
  }

  onProductTeamsChange(event: MatSelectChange): void {
    if (event.value === null || event.value === undefined) {
      return;
    }

    this.selectedProductTeamIds = event.value as string[];
    this.onFilterChange();
  }

  onTechnologiesChange(event: MatSelectChange): void {
    if (event.value === null || event.value === undefined) {
      return;
    }

    this.selectedTechnologyIds = event.value as string[];
    this.onFilterChange();
  }

  private onFilterChange(): void {
    this.trainingFilterService.applyFilter({
      developerIds:
        this.selectedDeveloperIds.length !== 0
          ? this.selectedDeveloperIds
          : undefined,
      productTeamIds:
        this.selectedProductTeamIds.length !== 0
          ? this.selectedProductTeamIds
          : undefined,
      technologyIds:
        this.selectedTechnologyIds.length !== 0
          ? this.selectedTechnologyIds
          : undefined,
    });
  }
}
