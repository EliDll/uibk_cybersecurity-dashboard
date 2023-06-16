import { Component, Input, OnInit } from '@angular/core';
import { BaseChart } from '../config/base-chart';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chart-container',
  templateUrl: './chart-container.component.html',
  styleUrls: ['./chart-container.component.scss'],
})
export class ChartContainerComponent<T> implements OnInit {
  @Input()
  configuration!: BaseChart<T>;
  @Input()
  title?: string;

  constructor(private readonly activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.configuration.init(this.activatedRoute);
    if (this.title) this.configuration.chartTitle = this.title;
  }
}
