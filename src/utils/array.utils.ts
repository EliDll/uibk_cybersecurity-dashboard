export function distinctArray<T>(arr: T[]): T[] {
  return arr.filter((it, index, array) => {
    return array.indexOf(it) === index;
  });
}

//https://stackoverflow.com/questions/42136098/array-groupby-in-typescript
export const groupArrayBy = <T>(list: T[], getKey: (item: T) => string) =>
  list.reduce((previous, currentItem) => {
    const group = getKey(currentItem);
    if (!previous[group]) previous[group] = [];
    previous[group].push(currentItem);
    return previous;
  }, {} as Record<string, T[]>);

export function averageArray(arr: number[]): number {
  if (arr.length === 0) {
    return 0;
  }
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function sortDatesArray(dates: Date[]): Date[] {
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

export function sortByDate<T>(arr: T[], acc: (it: T) => Date): T[] {
  return arr.sort((a, b) => acc(a).getTime() - acc(b).getTime());
}

export function sortStringArray(arr: string[]): string[] {
  return arr.sort((a, b) => a.localeCompare(b));
}
