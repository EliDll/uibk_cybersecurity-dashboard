import { plainToInstance, instanceToPlain } from 'class-transformer';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import {
  ParsedDevelopmentDataModel,
  ParsedModel,
  ParsedTrainingDataModel,
} from '../../shared';

const ParsedModelKey = 'ParsedDataModel';
@Injectable({
  providedIn: 'root',
})
export class ParsedDataService {
  private static readonly parsedTrainingData$ =
    new BehaviorSubject<ParsedTrainingDataModel | null>(null);

  private static readonly parsedDevelopmentData$ =
    new BehaviorSubject<ParsedDevelopmentDataModel | null>(null);

  private fullModel: ParsedModel = new ParsedModel();

  constructor() {
    const cachedData = localStorage.getItem(ParsedModelKey);
    if (cachedData) {
      const instance: ParsedModel = plainToInstance(
        ParsedModel,
        JSON.parse(cachedData)
      );
      this.fullModel = instance;
      ParsedDataService.parsedTrainingData$.next(
        instance as ParsedTrainingDataModel
      );
      ParsedDataService.parsedDevelopmentData$.next(
        instance as ParsedDevelopmentDataModel
      );
    }
  }

  getParsedTrainingData$(): Observable<ParsedTrainingDataModel | null> {
    return ParsedDataService.parsedTrainingData$.asObservable();
  }

  setParsedTrainingData$(parsedTrainingData: ParsedTrainingDataModel) {
    ParsedDataService.parsedTrainingData$.next(parsedTrainingData);
    this.fullModel = {
      ...this.fullModel,
      trainingEntries: parsedTrainingData.trainingEntries,
    };
    localStorage.setItem(
      ParsedModelKey,
      JSON.stringify(instanceToPlain(this.fullModel))
    );
  }

  get hasTrainingData$(): Observable<boolean> {
    return this.getParsedTrainingData$().pipe(map((data) => data != null));
  }

  getParsedDevelopmentData$(): Observable<ParsedDevelopmentDataModel | null> {
    return ParsedDataService.parsedDevelopmentData$.asObservable();
  }

  setParsedDevelopmentData$(parsedDevelopmentData: ParsedDevelopmentDataModel) {
    ParsedDataService.parsedDevelopmentData$.next(parsedDevelopmentData);
    this.fullModel = {
      ...this.fullModel,
      penTestFindings: parsedDevelopmentData.penTestFindings,
    };
    localStorage.setItem(
      ParsedModelKey,
      JSON.stringify(instanceToPlain(this.fullModel))
    );
  }

  get hasDevelopmentData$(): Observable<boolean> {
    return this.getParsedDevelopmentData$().pipe(map((data) => data != null));
  }
}
