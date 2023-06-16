import { Injectable } from '@angular/core';
import {
  BaseData,
  BaseFilter,
  BaseFilterService,
  TrainingFilterService,
} from './training-filter.service';
import { DevelopmentFilterService } from './development-filter.service';
import { Subscription, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CompositeFilterService {
  private readonly allServices: BaseFilterService<BaseFilter, BaseData>[];

  constructor(
    trainingFilterService: TrainingFilterService,
    developmentFilterService: DevelopmentFilterService
  ) {
    this.allServices = [trainingFilterService, developmentFilterService];
  }

  applyFilter<T extends BaseFilter>(filter: T): void {
    this.allServices.forEach((it) => it.applyFilter(filter));
  }

  replaceFilter(replacer: (old: BaseFilter) => BaseFilter): Subscription[] {
    return this.allServices.map((it) => {
      return it.currentFilter$.pipe(take(1)).subscribe((filter) => {
        let filterToUse = {} satisfies BaseFilter;
        if (filter) {
          filterToUse = filter;
        }
        it.applyFilter(replacer(filterToUse));
      });
    });
  }
}
