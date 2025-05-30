import { CommonModule } from '@angular/common';
import { Component, OnInit, OnChanges, SimpleChanges, ViewChild, Input, ChangeDetectorRef, EventEmitter, Output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgModel } from '@angular/forms';
//import { IonCard, IonCardHeader, IonText, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon, IonToolbar, IonPopover, IonContent, IonList, IonItem, IonFab, IonFabButton, IonHeader, IonTitle, IonSelect, IonSelectOption, IonModal } from '@ionic/angular/standalone';
import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexYAxis, ApexDataLabels, ApexTooltip, ApexStroke, NgApexchartsModule, ChartType, ChartComponent } from "ng-apexcharts";
import { NgxColorsModule } from 'ngx-colors';
import { FormsModule } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { WebSocketService } from 'src/app/services/web-socket.service';
import { IonicModule } from '@ionic/angular';
export interface SplineData {
  [key: string]: any;
}

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
};

@Component({
  selector: 'app-spline',
  standalone: true,
  imports: [NgxColorsModule, FormsModule, CommonModule, NgApexchartsModule, IonicModule/*, IonText, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButtons, IonButton, IonIcon, IonToolbar, IonPopover, IonContent, IonList, IonItem, IonFab, IonFabButton, IonHeader, IonTitle, IonSelect, IonSelectOption, IonModal*/],
  templateUrl: './spline.component.html',
  styleUrls: ['./spline.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SplineComponent implements OnInit {
  @ViewChild("splineChart", { static: false }) chart: ChartComponent | undefined;
  @Input() data: SplineData = {};
  @Input() refreshData: boolean = false;
  @Output() remove = new EventEmitter<number>();
  public chartOptions: ChartOptions;
  title = "Spline"
  sensors = [
    { id: 1, color: '#C00FFC' },
    { id: 2, color: '#336eff' }
  ];
  widgetData: any = {}
  copyWidgetData: any = {}
  devices: any
  isModalOpen = false;
  showChart: boolean = true;
  constructor(private changeDetector: ChangeDetectorRef,
    private ws: WebSocketService,
    private api: ApiService) {
    this.chartOptions = {
      series: [],
      chart: {
        animations: {
          enabled: true,
          speed: 1,
          animateGradually: {
            enabled: true,
            delay: 1
          },
          dynamicAnimation: {
            enabled: true,
            speed: 1
          }
        },
        height: 350,
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: window.innerWidth > 768,
            selection: true/*,
            zoom: window.innerWidth > 768, // Solo mostrar zoom en dispositivos con ancho > 768px
            zoomin: window.innerWidth > 768,
            zoomout: window.innerWidth > 768,
            pan: window.innerWidth > 768,
            reset: window.innerWidth > 768,*/
          }
        },
        zoom: {
          enabled: true,
          type: 'x'
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth"
      },
      xaxis: {
        type: "datetime",
        labels: {
          datetimeUTC: false,
          format: "hh:mm"
        }
      },
      yaxis: {
        min: 20,  // Valor mínimo en el eje Y
        max: 70,  // Valor máximo en el eje Y
      },
      tooltip: {
        x: {
          format: "dd/MM/yy hh:mm"
        }
      }
    };
  }

  ngOnInit() {
    this.widgetData = this.data
    this.initializeChart();
  }

  initializeChart() {
    if (this.widgetData.chartType) {
      this.chartOptions.chart.type = this.widgetData.chartType;
      this.chart?.updateOptions(this.chartOptions);
    }
    this.loadSensorData().then(() => {
      this.startSuscripcions();
    });
  }

  async loadSensorData() {
    const sensores = this.widgetData.sensors;
    const seriesData = await Promise.all(
      sensores.map((sensor: any) =>
        this.api.Get(`/sensorData/${sensor.id}?start=2025-05-28T00:00:00&end=2025-05-30T00:00:00`).then((response: any) => ({
          color: sensor.color,
          group: sensor.id, // ID único
          name: response.data.sensor,
          data: response.data.data.map((item: any) => ({
            x: new Date(item.time).getTime(),
            y: Number(item.value)
          }))
        }))
      )
    );
    this.chartOptions.series = seriesData;
    if (this.chart && this.chart.updateOptions) {
      this.chart.updateOptions(this.chartOptions);
    }
  }
  startSuscripcions() {
    const sensores = this.widgetData.sensors;
    sensores.forEach((sensor: any) => {
      const sensor_id = sensor.id;
      this.ws.suscribe(sensor_id, (data) => {
        const timestamp = new Date(data.value.time).getTime();
        const sensorId = data.value.sensor_id;
        const serie: any = this.chartOptions.series.find((s: any) => s.group == sensorId);
        //console.log(sensorId, serie.name);
        if (serie) {
          serie.data.unshift({ x: timestamp, y: Number(data.value.value) });
          if (serie.data.length > 100) {
            serie.data.pop();
          }
          if (this.chart && this.chart.updateSeries) {
            this.chart.updateSeries(this.chartOptions.series);
          }
        }
      });
    });
  }
  async addNewSensor() {
    this.copyWidgetData.sensors.push({ device: "", id: "", color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') })
  }
  updateChartDB() {
    const body = {
      name: this.copyWidgetData.name,
      parameters: {
        widgetType: this.copyWidgetData.widgetType,
        chartType: this.copyWidgetData.chartType,
        sensors: this.copyWidgetData.sensors,
      }
    }
    this.showChart = false;
    this.api.Update("/widgets/" + this.widgetData.id, body).then((response: any) => {
      console.log(response);
      this.widgetData = JSON.parse(JSON.stringify(this.copyWidgetData))
      this.data = this.widgetData
      this.showChart = true;
      this.initializeChart()
      this.isModalOpen = false
      this.changeDetector.detectChanges()
    })
  }
  deleteChart() {
    this.remove.emit(this.widgetData.id);
  }
  editChart() {
    this.copyWidgetData = JSON.parse(JSON.stringify(this.widgetData))
    this.api.Get("/devices/1221").then((response: any) => {
      this.devices = response.data
      this.isModalOpen = true;
      //this.newWidgetData.device = response.data[0].deviceId + ""
      //console.log(response.data[0].deviceId);
    })
  }
  getSensorsForDevice(deviceId: number) {
    const device: any = this.devices.find((d: any) => d.deviceId === deviceId);
    return device ? device.sensors : [];
  }
}