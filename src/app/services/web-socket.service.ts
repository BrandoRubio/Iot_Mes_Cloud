import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  //server = "ws://localhost:3000"
  server = "wss://sensores-api.onrender.com"
  Suscribe(dispositivo: string, onMessage: (data: any) => void): Promise<WebSocket> {
    console.log(JSON.stringify({ tipo: 'suscribirse', dispositivo }));
    
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(this.server);
      ws.onopen = () => {
        ws.send(JSON.stringify({ tipo: 'suscribirse', dispositivo }));
        resolve(ws);
      };
      ws.onerror = (err) => {
        console.error('Error en WebSocket', err);
        reject(err);
      };
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.tipo === 'nuevo_dato') {
            onMessage(msg.data);
          }
        } catch (e) {
          console.error('Error al procesar mensaje:', e);
        }
      };
    });
  }
}