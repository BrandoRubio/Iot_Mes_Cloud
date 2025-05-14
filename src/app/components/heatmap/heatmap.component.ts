import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexChart, NgApexchartsModule, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexTooltip } from "ng-apexcharts";
export interface HeatmapData {
  series?: {
    name: string;
    data: Array<{ x: string, y: number }>;
  }[];
  title?: string;
  colors?: string[];
  height?: number;
  width?: number;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  dataLabels: ApexDataLabels;
  title: ApexTitleSubtitle;
  grid: ApexGrid;
  plotOptions: ApexPlotOptions;
  tooltip: ApexTooltip;
  colors: string[];
};

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements OnInit, OnChanges {
  @ViewChild("chart") chart: any;
  @Input() data: HeatmapData = {};
  @Input() refreshData: boolean = false;
  public chartOptions: ChartOptions;

  constructor() {
    // Configuración inicial predeterminada
    this.chartOptions = {
      series: [],
      chart: {
        height: 350,
        type: "heatmap"
      },
      dataLabels: {
        enabled: false
      },
      colors: [
        "#F3B415",
        "#F27036",
        "#663F59",
        "#6A6E94",
        "#4E88B4",
        "#00A7C6",
        "#18D8D8",
        "#A9D794",
        "#46AF78",
        "#A93F55",
        "#8C5E58",
        "#2176FF",
        "#33A1FD",
        "#7A918D",
        "#BAFF29"
      ],
      xaxis: {
        type: "category",
        categories: [
          "10:00",
          "10:30",
          "11:00",
          "11:30",
          "12:00",
          "12:30",
          "01:00",
          "01:30"
        ]
      },
      title: {
        text: "HeatMap Chart (Different color shades for each series)"
      },
      grid: {
        padding: {
          right: 20
        }
      },
      yaxis: {},
      plotOptions: {},
      tooltip: {}
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
    if (this.data) {
      this.updateChart();
    } else {
      // Si no hay datos proporcionados, usar datos de ejemplo
      this.loadDefaultData();
    }
  }

  updateChart() {
    // Actualizar solo las propiedades que vienen en los datos de entrada
    if (this.data.series) {
      this.chartOptions.series = this.data.series;
    }

    if (this.data.title) {
      this.chartOptions.title = {
        ...this.chartOptions.title,
        text: this.data.title
      };
    }

    if (this.data.colors) {
      this.chartOptions.colors = this.data.colors;
    }

    if (this.data.height) {
      this.chartOptions.chart = {
        ...this.chartOptions.chart,
        height: this.data.height
      };
    }
    console.log(this.chartOptions);
    /*console.log(this.chart);

    // Si el gráfico ya está inicializado, actualizar
    if (this.chart && this.chart.updateOptions) {
      this.chart.updateOptions(this.chartOptions);
    }*/
  }

  loadDefaultData() {
    // Cargar datos de ejemplo si no hay datos de entrada
    this.chartOptions.series = [
      {
        name: "Metric1",
        data: this.generateData(18, { min: 0, max: 90 })
      },
      {
        name: "Metric2",
        data: this.generateData(18, { min: 0, max: 90 })
      },
      {
        name: "Metric3",
        data: this.generateData(18, { min: 0, max: 90 })
      }
    ];

    // Si el gráfico ya está inicializado, actualizar
    if (this.chart && this.chart.updateOptions) {
      this.chart.updateOptions(this.chartOptions);
    }
  }

  generateData(count: number, yrange: { min: number, max: number }) {
    var i = 0;
    var series = [];
    while (i < count) {
      var x = "w" + (i + 1).toString();
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push({
        x: x,
        y: y
      });
      i++;
    }
    return series;
  }
}