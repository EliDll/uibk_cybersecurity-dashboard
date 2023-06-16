import { Injectable } from '@angular/core';
import {
  AbstractChartConfiguration,
  ChartColor,
  ColorType,
} from '../../../chart';
import {
  ParsedDevelopmentDataModel,
  ParsedTrainingDataModel,
  SecurityRisk,
} from '../../../shared';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TrainingFilterService } from '../../../analyzation';
import { DevelopmentFilterService } from '../../../analyzation/filter/development-filter.service';
import { getReleaseLabel } from '../../../shared/util/formats';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { getAverageConfidenceAtDate } from 'src/shared/util/confidence';

type Data = [
  ParsedTrainingDataModel,
  ParsedDevelopmentDataModel,
  SecurityRisk | undefined
];

@Injectable({
  providedIn: 'root',
})
export class ConfidenceAndFindingsChartConfigurationService extends AbstractChartConfiguration<
  Data,
  'line'
> {
  private readonly currentRisk$: BehaviorSubject<SecurityRisk | undefined> =
    new BehaviorSubject<SecurityRisk | undefined>(undefined);

  dataSource$ = combineLatest([
    this.trainingFilterService.filteredData$,
    this.developmentFilterService.filteredData$,
    this.currentRisk$,
  ]);
  chartLegend = true;
  chartTitle = 'Confidence vs. Findings over time';
  chartType: ChartType = 'line';
  override chartOptions: ChartConfiguration['options'] = {
    scales: {
      y: {
        position: 'left',
        grid: {
          display: false,
        },
        ticks: {
          stepSize: 2,
        },
        stacked: true,
      },
      y1: {
        position: 'right',
        min: 0,
        max: 100,
        ticks: {
          stepSize: 10,
          color: ChartColor.HILTI_RED,
        },
      },
    },
  };

  set currentRisk(risk: SecurityRisk | undefined) {
    this.currentRisk$.next(risk);
  }

  constructor(
    private developmentFilterService: DevelopmentFilterService,
    private trainingFilterService: TrainingFilterService
  ) {
    super();
  }

  protected collectChartData(data: Data): ChartData<'line'> {
    const trainingData = data[0];
    const developmentData = data[1];
    const currentRisk = data[2];
    const releases = developmentData.productReleases.sort((a, b) =>
      a.releaseDate > b.releaseDate ? 1 : -1
    );

    const pentestNumbers = releases.map((release) =>
      developmentData.penTestFindings
        .filter((finding) => {
          if (finding.releaseId !== release.id) {
            return false;
          }

          if (currentRisk) {
            return finding.riskIds.includes(currentRisk.id);
          }
          return true;
        })
        .reduce((a, curr) => (a += curr.severity), 0)
    );

    const codescanNumbers = releases.map(
      (release) =>
        developmentData.codeScanFindings.filter((finding) => {
          if (finding.releaseId !== release.id) {
            return false;
          }

          if (currentRisk) {
            return finding.riskIds.includes(currentRisk.id);
          }
          return true;
        }).length
    );

    const confidences = releases.map(
      (it) =>
        getAverageConfidenceAtDate(trainingData, it.releaseDate, currentRisk) *
        100
    );

    return {
      labels: releases.map((release) => getReleaseLabel(release)),
      datasets: [
        {
          ...this.createDataset(
            'Developer Confidence',
            confidences,
            ColorType.Primary
          ),
          yAxisID: 'y1',
          fill: undefined,
        },
        {
          ...this.createDataset(
            'Static Analysis Findings',
            codescanNumbers,
            ColorType.Accent
          ),
          yAxisID: 'y',
          fill: 'origin',
        },
        {
          ...this.createDataset(
            'Pentest Findings',
            pentestNumbers,
            ColorType.Secondary
          ),
          yAxisID: 'y',
          fill: 'origin',
        },
      ],
    };
  }
}
