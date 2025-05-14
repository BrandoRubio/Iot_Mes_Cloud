import { Injectable } from '@angular/core';
import { CapacitorHttp, HttpResponse } from '@capacitor/core';
import { LoadingController } from '@ionic/angular';
import { Toast } from '@capacitor/toast';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //server = "http://localhost:3000"
  server = "https://sensores-api.onrender.com"
  constructor(public loadingCtrl: LoadingController) { }

  async Get(endPoint: string) {
    this.ShowLoading("Procesando")
    const auth = {
      url: this.server+"/api" + endPoint,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const response: HttpResponse = await CapacitorHttp.get(auth);
    if (response.status == 200) {
    } else if (response.status == 404) {
      this.ShowToast("Error en la URL")
    } else if (response.status == 401) {
      this.ShowToast("Error de autenticación")
    }
    await this.loadingCtrl.getTop() ? this.loadingCtrl.dismiss() : null
    return response
  }

  async ShowLoading(msj: string, b = true) {
    await this.loadingCtrl.getTop() ? this.loadingCtrl.dismiss() : null
    const loading = await this.loadingCtrl.create({
      message: msj,
      spinner: 'crescent',
      translucent: true,
      duration: b ? 30000 : 300000
    });
    loading.present();
  }

  async ShowToast(msj: string) {
    await Toast.show({
      text: msj,
    });
  };
}
