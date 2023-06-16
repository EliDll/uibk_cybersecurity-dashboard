export enum ColorType {
  Primary,
  Secondary,
  Accent,
}

export const mapColorType = (colorType: ColorType | string): string => {
  switch (colorType) {
    case ColorType.Primary:
      return ChartColor.HILTI_RED;
    case ColorType.Secondary:
      return ChartColor.BURGUNDY;
    case ColorType.Accent:
      return ChartColor.WARM_CONCRETE;
    default:
      return colorType;
  }
};

export enum ChartColor {
  HILTI_RED = 'rgba(243,34,29,1)',
  HEAVY_CONCRETE = 'rgba(145,124,107,1)',
  WARM_CONCRETE = 'rgba(219,206,189,1)',
  BLACK = 'rgba(0,0,0,1)',
  BURGUNDY = 'rgba(111,23,63,1)',
  STEEL = 'rgba(84,77,84,1)',
}

export function getColorWithOpacity(
  color: ChartColor | string,
  opacity: number
): string {
  const values = color.split(',');
  values[3] = `${opacity})`;
  return values.join(',');
}

export function getSeverityColor(score: number): string {
  switch (score) {
    case 1:
      return 'rgb(57, 10, 6)';
    case 2:
      return 'rgb(82, 18, 12)';
    case 3:
      return 'rgb(105, 26, 17)';
    case 4:
      return 'rgb(127, 32, 21)';
    case 5:
      return 'rgb(150, 37, 24)';
    case 6:
      return 'rgb(171, 41, 27)';
    case 7:
      return 'rgb(193, 43, 28)';
    case 8:
      return 'rgb(214, 45, 28)';
    case 9:
      return 'rgb(234, 46, 27)';
    case 10:
      return 'rgb(255, 47, 26)';
    default:
      return 'rgba(0, 0, 0, 1)';
  }
}
