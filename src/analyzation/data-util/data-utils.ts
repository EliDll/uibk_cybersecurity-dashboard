import { TrainingEntry } from '../../shared';

export class DataUtils {
  public static isTrainingEntryCompleted(
    trainingEntry: TrainingEntry
  ): boolean {
    return trainingEntry.completedDate != null;
  }
}
