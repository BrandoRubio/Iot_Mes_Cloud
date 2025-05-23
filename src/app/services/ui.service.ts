import { Injectable } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  constructor(private alertController: AlertController, public loadingCtrl: LoadingController) { }

  async ShowAlert(message: string, title: string = "Alerta", cancel: string = "Cancelar", confirm: string = "Aceptar") {//Alerta genérica para toma de desiciones
    const alert = await this.alertController.create({
      header: title,
      message: message,
      cssClass: "custom-alert",
      buttons: [
        {
          text: cancel,
          role: 'cancel',
        },
        {
          text: confirm,
          role: 'confirm',
        }
      ],
    });
    await alert.present();
    const { role } = await alert.onDidDismiss()
    return role
  }

  async showLoading(msj: string, b = true) {
    await this.loadingCtrl.getTop() ? this.loadingCtrl.dismiss() : null
    const loading = await this.loadingCtrl.create({
      message: msj,
      spinner: 'crescent',
      translucent: true,
      duration: b ? 30000 : 300000
    });
    loading.present();
  }
  async dismissLoading() {
    await this.loadingCtrl.getTop() ? this.loadingCtrl.dismiss() : null
  }
}
