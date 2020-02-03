export class GraphDataset {
  data: any[] = [];
  label: any[] = [];
  backgroundColor: any[] = [];
  hoverBackgroundColor: any[] = [];

  constructor(data: any[], label: any[], backgroundColor: any[], hoverBackgroundColor: any[]) {
    this.data = data;
    this.label = label;
    this.backgroundColor = backgroundColor;
    this.hoverBackgroundColor = hoverBackgroundColor;
  }
}
