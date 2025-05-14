import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { WebSocketService } from '../services/web-socket.service';

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
  newSensorData: SensorData = {
    "id": 1823,
    "dispositivo": "F0:08:D1:C5:B8:CC",
    "tipo_sensor": "temperatura",
    "valor": "25.80",
    "fecha_hora": "2025-05-09T20:08:17.710Z"
  };
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
  constructor(
    private wsService: WebSocketService,
    private api: ApiService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.sensorData.push();
  }

  ionViewDidEnter() {
    this.Suscribe()
    this.api.Get("/sensores?cantidad=20").then((response: any) => {
      console.log(response);
      localStorage.setItem("response", response.status)
      this.sensorData = response.data/*response.data.map((item: any) => ({
        id: item.id,
        dispositivo: item.dispositivo,
        tipo_sensor: item.tipo_sensor,
        valor: item.valor,
        fecha_hora: item.fecha_hora
      }));*/
      this.changeDetector.detectChanges();
    })

    const dispositivo = 'F0:08:D1:C5:B8:CC';
    /*this.wsService.Suscribe(dispositivo, (data) => {
      //console.log(data);
      const objSensorData: SensorData = data
      this.sensorData = [...this.sensorData, objSensorData];

      this.changeDetector.detectChanges();
      //this.chartData.push(data); // o actualizar UI, etc.
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
}
