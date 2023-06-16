import { plainToInstance } from 'class-transformer';
import { Injectable } from '@angular/core';
import { FileEntry } from '../index';
import { ParseFactory } from '../parse/parse.factory';
import { Router } from '@angular/router';
import { ParsedModel } from '../../shared';
import { ParsedDataService } from '../parse/parsed-data.service';

@Injectable({
  providedIn: 'root',
})
export class ImportService {
  constructor(
    private router: Router,
    private parseFactory: ParseFactory<ParsedModel>,
    private parsedDataHolder: ParsedDataService
  ) {}

  handleImport(file: FileEntry) {
    const parser = this.parseFactory.getStrategy(file.fileName);

    //Initialize reference object for typechecking during parsing
    const dataObj = plainToInstance(ParsedModel, {
      developers: [
        {
          id: '',
          name: '',
          productTeamsIds: [],
        },
      ],
      productTeams: [{ id: '', name: '', technologyIds: [] }],
      securityRisks: [{ id: '', name: '', url: '', industryPercentage: 0 }],
      technologies: [{ id: '', name: '' }],
      trainingUnits: [{ addressedRiskIds: [], id: '' }],
      trainingEntries: [
        {
          completedDate: new Date(),
          developerId: '',
          loggedTime: 0,
          scheduledDate: new Date(),
          trainingUnitId: '',
          confidencePercentage: 0,
        },
      ],
      productReleases: [
        {
          id: '',
          productId: '',
          releaseDate: new Date(),
        },
      ],
      codeScanFindings: [
        {
          releaseId: '',
          riskIds: [],
        },
      ],
      penTestFindings: [
        {
          releaseId: '',
          riskIds: [],
          severity: 1,
          ignored: true,
          resolvedDate: new Date(),
        },
      ],
    } satisfies ParsedModel);

    const success = parser.parseInto(file.content, dataObj);

    if (success) {
      this.applyMigrations(dataObj);
      this.parsedDataHolder.setParsedTrainingData$(dataObj);
      this.parsedDataHolder.setParsedDevelopmentData$(dataObj);
      console.log(dataObj);
      this.router.navigate(['overall']);
    } else {
      console.log('Could not parse file correctly');
    }
  }

  applyMigrations(dataObj: ParsedModel) {
    //Custom typecasting
    for (const entry of dataObj.trainingEntries) {
      entry.completedDate = entry.completedDate
        ? this.excelDateToJSDate(entry.completedDate as unknown as number)
        : undefined;
      entry.scheduledDate = this.excelDateToJSDate(
        entry.scheduledDate as unknown as number
      );

      if (typeof entry.confidencePercentage === 'string') {
        entry.confidencePercentage = Number(entry.confidencePercentage);
      }
    }

    for (const risk of dataObj.securityRisks) {
      if (typeof risk.industryPercentage === 'string') {
        risk.industryPercentage = Number(risk.industryPercentage);
      }
    }

    for (const release of dataObj.productReleases) {
      release.releaseDate = this.excelDateToJSDate(
        release.releaseDate as unknown as number
      );
    }

    for (const penTest of dataObj.penTestFindings) {
      penTest.resolvedDate =
        penTest.resolvedDate !== undefined
          ? this.excelDateToJSDate(penTest.resolvedDate as unknown as number)
          : undefined;
    }
  }

  //https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
  excelDateToJSDate = (serial: number) => {
    const utc_days = Math.floor(serial - 25569);
    const utc_value = utc_days * 86400;
    const date_info = new Date(utc_value * 1000);

    const fractional_day = serial - Math.floor(serial) + 0.0000001;

    let total_seconds = Math.floor(86400 * fractional_day);

    const seconds = total_seconds % 60;

    total_seconds -= seconds;

    const hours = Math.floor(total_seconds / (60 * 60));
    const minutes = Math.floor(total_seconds / 60) % 60;

    return new Date(
      date_info.getFullYear(),
      date_info.getMonth(),
      date_info.getDate(),
      hours,
      minutes,
      seconds
    );
  };
}
