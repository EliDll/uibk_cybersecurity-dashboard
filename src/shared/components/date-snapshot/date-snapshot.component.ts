import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { TrainingFilterProviderService } from 'src/analyzation';
import { CompositeFilterService } from 'src/analyzation/filter/composite-filter.service';

@Component({
  selector: 'app-date-filter',
  templateUrl: './date-snapshot.component.html',
  styleUrls: ['./date-snapshot.component.scss'],
})
export class DateSnapshotComponent implements OnDestroy {
  minDate$: Observable<Date | null>;
  maxDate = new Date();
  currentValue = this.maxDate;

  private subscriptions: Subscription[] = [];

  constructor(
    private readonly filterProvider: TrainingFilterProviderService,
    private readonly filterService: CompositeFilterService
  ) {
    this.minDate$ = this.filterProvider.snapshotMinDate$;
  }

  onDateChange($event: MatDatepickerInputEvent<Date, Date | null>) {
    const snapshot = $event.value;
    if (snapshot) {
      this.subscriptions.push(
        ...this.filterService.replaceFilter((it) => ({
          ...it,
          snapshotDate: snapshot,
        }))
      );
    }
  }

  onResetDate(): void {
    this.currentValue = this.maxDate;
    this.subscriptions.push(
      ...this.filterService.replaceFilter((it) => ({
        ...it,
        snapshotDate: undefined,
      }))
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((it) => it.unsubscribe());
  }
}
