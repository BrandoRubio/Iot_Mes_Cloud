import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { UiService } from '../services/ui.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  standalone: false,
  selector: 'app-devices',
  templateUrl: './devices.page.html',
  styleUrls: ['./devices.page.scss'],
})
export class DevicesPage implements OnInit {
  devices: any = []
  isModalOpen = false;
  device: any = {
    isNew: true,
    mac: "",
    sensors: []
  }
  iconList = [
    { name: 'thermometer-outline', label: 'Temperatura' },
    { name: 'water-outline', label: 'Humedad' },
    { name: 'speedometer-outline', label: 'Presión' },
    { name: 'sunny-outline', label: 'Luz' },
    { name: 'flash-outline', label: 'Energía' },
  ];
  constructor(
    private api: ApiService,
    private ui: UiService,
    private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
  }
  ionViewDidEnter() {
    this.getDevices()
  }
  getDevices() {
    this.ui.showLoading("Obteniendo dispositivos")
    this.api.Get("/devices/1221").then((response: any) => {
      this.devices = response.data
      Promise.all(
        this.devices.flatMap((device: any) =>
          device.sensors.map((sensor: any) =>
            this.api.Get(`/sensorData/${sensor.id}?limit=1`).then((response: any) => {
              //console.log(response);
              sensor.lastValue = response?.data?.data?.[0]?.value || null;
              sensor.lastDate = response?.data?.data?.[0]?.time || null;
            })
          )
        )
      ).then(() => {
        this.ui.dismissLoading()
      });

    })
  }
  addNewSensor() {
    this.device.sensors.push({
      icon: "thermometer-outline",
      name: "Temperatura"
    })
    this.changeDetector.detectChanges()
  }
  openAsNewDevice() {
    this.isModalOpen = true
    this.device.isNew = {
      isNew: true,
      mac: "",
      sensors: []
    }
  }
  openAsEditDevice(device: any) {
    this.isModalOpen = true
    this.device = JSON.parse(JSON.stringify(device))
    this.device.isNew = false
    console.log(this.device);
  }
  addNewDevice() {
    const deviceBody = {
      user: "1221",
      name: this.device.deviceName,
      mac: this.device.deviceMac,
      sw_version: "1.1.1"
    };

    this.api.Post("/devices", deviceBody).then((response: any) => {
      const deviceId = response.data.result.id;
      const sensorPromises = this.device.sensors.map((sensor: any) => {
        const sensorBody = {
          name: sensor.name,
          device_id: deviceId,
          icon: sensor.icon,
          interval: 60
        };
        return this.api.Post("/sensors", sensorBody);
      });
      Promise.all(sensorPromises).then((sensorResponses: any[]) => {
        this.getDevices()
        this.isModalOpen = false;
      });
    })
  }
  updateDevice() {
    const deviceBody = {
      name: this.device.deviceName,
      sw_version: "1.1.1"
    };
    //console.log(this.device.sensors);
    this.api.Update("/devices/" + this.device.deviceId, deviceBody).then((response: any) => {
      const newSensorsPromises = this.device.sensors
        .filter((sensor: any) => !sensor.id)
        .map((sensor: any) => {
          const sensorBody = {
            name: sensor.name,
            device_id: this.device.deviceId,
            icon: sensor.icon,
            interval: 60
          };
          return this.api.Post("/sensors", sensorBody);
        });
      const updateSensorPromises = this.device.sensors
        .filter((sensor: any) => sensor.id)
        .map((sensor: any) => {
          const sensorBody = {
            name: sensor.name,
            icon: sensor.icon,
            interval: 60
          };
          return this.api.Update(`/sensors/${sensor.id}`, sensorBody);
        });
      Promise.all([...newSensorsPromises, ...updateSensorPromises]).then((sensorResponses: any[]) => {
        this.getDevices()
        this.isModalOpen = false;
      });
    })
  }

  selectIcon(sensor: any, icon: string) {
    sensor.icon = icon
  }

  async pasteOnInputName() {
    const { type, value } = await Clipboard.read();
    this.device.deviceName = value
  }
  async pasteOnInputMac() {
    const { type, value } = await Clipboard.read();
    this.device.deviceMac = value
  }
  async copyFromInputName() {
    await Clipboard.write({
      string: this.device.deviceName
    });
  }
  async copyFromInputMac() {
    await Clipboard.write({
      string: this.device.deviceMac
    });
  }
  async deleteDevice() {
    if (await this.ui.ShowAlert("¿Deseas eliminar este dispositivo?", "Alerta", "Atrás", "Eliminar")) {
      this.api.Delete("/devices/" + this.device.deviceId).then((response: any) => {
        //console.log(response.data);
        this.getDevices()
        this.isModalOpen = false
        this.changeDetector.detectChanges()
      })
    }
  }
}
