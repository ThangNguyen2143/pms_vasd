export type Config = {
  id: number;
  code: string;
  name: string;
  statisticColumns: StatistCol[];
  statisticParas: StatistPara[];
};
export type StatistCol = {
  code: string;
  display: string;
};
export type StatistPara = {
  field: string;
  type: string;
  system?: string;
};
