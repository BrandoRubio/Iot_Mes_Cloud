import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon, IonToolbar, IonPopover, IonContent, IonList, IonItem } from '@ionic/angular/standalone';
import { ApexAxisChartSeries, ApexTitleSubtitle, ApexDataLabels, ApexChart, NgApexchartsModule, ApexXAxis, ApexYAxis, ApexPlotOptions, ApexTooltip } from "ng-apexcharts";
export interface HeatmapData {
  [key: string]: any;
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
  imports: [CommonModule, NgApexchartsModule, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon, IonToolbar, IonPopover, IonContent, IonList, IonItem],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.scss'],
})
export class HeatmapComponent implements OnInit, OnChanges {
  @ViewChild("heatmapChar") chart: any;
  @Input() data: HeatmapData = {};
  @Input() refreshData: boolean = false;
  @Output() remove = new EventEmitter<number>();
  public chartOptions: ChartOptions;
  title = "Heatmap"

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
        "#008FFB"
      ],
      xaxis: {
        type: "category",
        categories: []
      },
      title: {
        text: "Mapa de calor"
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
    this.loadDefaultData();
  }

  updateChart() {
    // Actualizar solo las propiedades que vienen en los datos de entrada
    /*if (this.data.series) {
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
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric2",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric3",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric4",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric5",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric6",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric7",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric8",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      },
      {
        name: "Metric9",
        data: this.generateData(18, {
          min: 0,
          max: 100
        })
      }
    ]

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
  Delete() {
    this.remove.emit(this.data['id']);
  }
}