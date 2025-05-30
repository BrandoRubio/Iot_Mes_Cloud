import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { WebSocketService } from '../services/web-socket.service';
import { UiService } from '../services/ui.service';
import { ColorEvent } from 'ngx-color';

interface SensorData {
  id: number;
  dispositivo: string;
  tipo_sensor: string;
  valor: string;
  fecha_hora: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sensorData: SensorData[] = [];
  isModalOpen = false;
  newWidgetData: any = {
    name: "",
    device: "",
    sensors: [
      {
        device: "",
        id: "",
        color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
      }
    ],
    widgetType: "",
    chartType: ""
  }
  miData = {
    series: [
      {
        name: "W1",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W2",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W3",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W4",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W5",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W6",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W7",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W8",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W9",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W10",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W11",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W12",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W13",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W14",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      },
      {
        name: "W15",
        data: this.generateData(8, {
          min: 0,
          max: 90
        })
      }
    ],
    title: "Mapa de calor",
  }
  refreshData = false
  splineData: any = {
    series: [
      {
        name: "Ventas",
        data: [31, 40, 1, 51, 42, 7, 79]
      },
      {
        name: "Ventas 2",
        data: [31, 40, 28, 47, 42, 109, 100]
      }
    ],
    //title: "Mi gráfico de líneas",
    categories: [//Solo formato de fechas
      "2018-09-19T00:00:00.000Z",
      "2018-09-19T01:30:00.000Z",
      "2018-09-19T02:30:00.000Z",
      "2018-09-19T03:30:00.000Z",
      "2018-09-19T04:30:00.000Z",
      "2018-09-19T05:30:00.000Z",
      "2018-09-19T06:30:00.000Z"],
    type: "area"
    //tooltipFormat: "MMM yyyy"
  };
  user = "1221"
  widgets: any = []
  devices: any = []

  constructor(
    private wsService: WebSocketService,
    private api: ApiService,
    private ui: UiService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.sensorData.push();
  }

  ionViewDidEnter() {
    this.api.Get("/widgets/1221").then((response: any) => {
      this.widgets = response.data.dashboards.map((item: any, index: number) => ({
        index: index,
        id: item.id,
        name: item.name,
        jsonParams: { ...item.parameters, id: item.id, name: item.name }
      }));
    })
    this.api.Get("/devices/1221").then((response: any) => {
      this.devices = response.data
      this.newWidgetData.device = response.data[0].deviceId + ""
      //console.log(response.data[0].deviceId);
    })
    /*this.api.GetTEST().then((response: any) => {
      console.log(response);
      
      //console.log(response.data[0].deviceId);
    })*/

    /*const sensor_id = '1';
    this.wsService.suscribe(sensor_id, (data) => {
      console.log(data.value);
    }).then(ws => {
      //console.log('Conectado al socket');
    }).catch(err => {
      console.error('No se pudo conectar:', err);
    });*/
  }

  ShowChartData(data: any) {
    //this.chartData = data
  }
  onResetZoom() {
    //this.chartWidget.resetZoom();
  }
  Suscribe() {
    /*this.wsService.Suscribe("F0:00:TEST", (data) => {
      console.log(data);
      this.changeDetector.detectChanges();
    }).then(ws => {
      console.log('Conectado al socket 2');
    }).catch(err => {
      console.error('No se pudo conectar:', err);
    });*/
  }
  public generateData(count: any, yrange: any) {
    var i = 0;
    var series = [];
    while (i < count) {
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push(y);
      i++;
    }
    return series;
  }
  changeData() {
    this.splineData.type = this.splineData.type == "bar" ? "area" : "bar"
    this.miData.series.push({
      name: "AQ",
      data: this.generateData(8, {
        min: 0,
        max: 90
      })
    })
    this.refreshData = true
    setTimeout(() => {
      this.refreshData = false;
    }, 100);
    this.changeDetector.detectChanges()
  }

  setOpen(isOpen: boolean) {
    this.isModalOpen = isOpen;
    this.newWidgetData.name = "Widget " + (this.widgets.length + 1)
    this.newWidgetData.widgetType = "chart"
    this.newWidgetData.chartType = "area"
  }
  async addNewSensor() {
    this.newWidgetData.sensors.push({ device: "", id: "", color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0') })

  }
  getSensorsForDevice(deviceId: number) {
    const device = this.devices.find((d: any) => d.deviceId === deviceId);
    return device ? device.sensors : [];
  }
  async addNewWidget() {
    console.log(this.newWidgetData);

    //if (await this.ui.ShowAlert("¿Deseas agregar el nuevo widget?", "Alerta", "Atrás", "Agregar")) {
    let body: any = {}
    if (this.newWidgetData.widgetType == 'chart') {
      body = {
        "user_id": this.user,
        "name": this.newWidgetData.name,
        "parameters": {
          "widgetType": this.newWidgetData.widgetType,
          "chartType": this.newWidgetData.chartType,
          "sensors": this.newWidgetData.sensors,
        }
      }
    } else if (this.newWidgetData.widgetType == 'heatmap') {
      body = {
        "user_id": this.user,
        "name": this.newWidgetData.name,
        "parameters": {
          "widgetType": this.newWidgetData.widgetType
        }
      }
    }
    console.log(body);
    this.api.Post("/widgets", body).then((response: any) => {
      this.setOpen(false)
      console.log(response);
      body.parameters.index = response.data.id
      body.parameters.id = response.data.id
      body.parameters.name = response.data.name
      body.jsonParams = body.parameters
      this.widgets.push(body)
      this.newWidgetData = {
        name: "",
        device: "",
        sensors: [
          {
            device: "",
            id: "",
            color: '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0')
          }
        ],
        widgetType: "",
        chartType: ""
      }
      this.changeDetector.detectChanges()
    })
    //}
  }
  async removeWidget(id: number) {
    if (await this.ui.ShowAlert("¿Deseas eliminar este dashboard?", "Alerta", "Atrás", "Eliminar")) {
      this.api.Delete("/widgets/" + id).then((response: any) => {
        this.widgets = this.widgets.filter((w: any) => w.id !== id);
        this.changeDetector.detectChanges()
      })
    }
  }
}
