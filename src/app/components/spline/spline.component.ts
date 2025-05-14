import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexTooltip, ApexStroke, NgApexchartsModule } from "ng-apexcharts";
export interface SplineData {
  series?: {
    name: string;
    data: number[];
  }[];
  title?: string;
  categories?: string[];
  height?: number;
  width?: number;
  tooltipFormat?: string;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-spline',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './spline.component.html',
  styleUrls: ['./spline.component.scss'],
})
export class SplineComponent implements OnInit, OnChanges {
  @ViewChild("charts") chart: any;
  @Input() data: SplineData = {};
  @Input() refreshData: boolean = false;

  public chartOptions: ChartOptions;

  constructor(
    private changeDetector: ChangeDetectorRef) {
    // Configuración inicial predeterminada
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "area"
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        categories: []
      },
      tooltip: {
        x: {
          format: "dd/MM/yy HH:mm"
        }
      }
    };
  }

  ngOnInit() {
    this.initializeChart();
  }

  ngOnChanges(changes: SimpleChanges) {
    // Actualizar el gráfico cuando cambian los datos de entrada
    if (changes['data'] && !changes['data'].firstChange) {
      this.updateChart();
    }

    // Forzar actualización cuando refreshData cambia a true
    if (changes['refreshData'] && changes['refreshData'].currentValue === true) {
      this.updateChart();
    }
  }

  initializeChart() {
    if (this.data && Object.keys(this.data).length > 0) {
      this.updateChart();
    } else {
      // Si no hay datos proporcionados, usar datos de ejemplo
      this.loadDefaultData();
    }
  }

  updateChart() {
    // Actualizar solo las propiedades que vienen en los datos de entrada
    if (this.data.series) {
      this.chartOptions.series = this.data.series
    }
    if (this.data.categories) {
      this.chartOptions.xaxis.categories = this.data.categories;
    }
    if (this.data.height) {
      this.chartOptions.chart.height = this.data.height;
    }

    console.log(this.chartOptions);
    this.changeDetector.detectChanges()
    /*
    if (this.chart && this.chart.updateOptions) {

      this.chart.updateOptions(this.chartOptions);
    }*/
  }

  loadDefaultData() {
    // Cargar datos de ejemplo si no hay datos de entrada
    /*this.chartOptions.series = [
      {
        name: "series1",
        data: [31, 40, 28, 51, 42, 109, 100]
      },
      {
        name: "series2",
        data: [11, 32, 45, 32, 34, 52, 41]
      }
    ];
    
    this.chartOptions.xaxis.categories = [
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z"
    ];*/

    // Si el gráfico ya está inicializado, actualizar
    if (this.chart && this.chart.updateOptions) {
      this.chart.updateOptions(this.chartOptions);
    }
  }

  public generateData(baseval: number, count: number, yrange: { min: number, max: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = Math.floor(Math.random() * (750 - 1 + 1)) + 1;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
      var z = Math.floor(Math.random() * (75 - 15 + 1)) + 15;

      series.push([x, y, z]);
      baseval += 86400000;
      i++;
    }
    return series;
  }
}