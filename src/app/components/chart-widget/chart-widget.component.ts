import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { ChartConfiguration, CategoryScale, LinearScale, ChartData, ChartType, Chart, BarController, BarElement, Title, Tooltip, Legend, LineController, LineElement, PointElement } from 'chart.js';
import { IonIcon, IonItem, IonButton, IonButtons } from '@ionic/angular/standalone';
import { BaseChartDirective } from 'ng2-charts';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend, LineController, LineElement, PointElement, zoomPlugin);

interface SensorData {
  id: number;
  dispositivo: string;
  tipo_sensor: string;
  valor: string;
  fecha_hora: string;
}
@Component({
  selector: 'app-chart-widget',
  templateUrl: './chart-widget.component.html',
  styleUrls: ['./chart-widget.component.scss'],
  imports: [BaseChartDirective, CommonModule, IonIcon, IonItem, IonButton, IonButtons],
  styles: []
})
export class ChartWidgetComponent implements OnInit, OnChanges {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective | any;
  @Input() triggerResetZoom: boolean = false;
  @Input() sensorData: SensorData[] = [];

  public chartType: ChartType = 'line';

  public chartData: ChartData = {
    labels: [],
    datasets: []
  };

  public chartOptions: ChartConfiguration['options'] = {
    animation: false,
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Fecha/Hora'
        }
      },
      y: {
        min: 0,
        max: 100,
        title: {
          display: true,
        }
      }
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'xy', // o solo 'x' o 'y'
          modifierKey: 'ctrl' // opcional: pan solo con CTRL
        },
        zoom: {
          drag: {
            enabled: true
          },
          mode: 'xy',
          wheel: {
            enabled: false // zoom con la rueda del mouse
          },
          pinch: {
            enabled: true // zoom con dedos (pantallas touch)
          }
        }
      },
      legend: {
        display: true,
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ${value}°C`;
          }
        }
      }
    }
  };

  constructor() { }

  ngOnInit() {
    // Inicialización si es necesaria
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sensorData'] && changes['sensorData'].currentValue) {
      this.updateChartData();
    }
  }
  updateChartData() {
    if (!this.sensorData || this.sensorData.length === 0) return;

    const deviceMap = new Map<string, { valores: number[], fechas: string[], tipo_sensor: string }>();

    this.sensorData.forEach(item => {
      const key = item.tipo_sensor
      const valor = parseFloat(item.valor);
      const fecha = new Date(item.fecha_hora).toLocaleTimeString();

      if (!deviceMap.has(key)) {
        deviceMap.set(key, { valores: [], fechas: [], tipo_sensor: item.tipo_sensor });
      }

      const entry = deviceMap.get(key);
      entry?.valores.push(valor);
      entry?.fechas.push(fecha);
    });

    const labels = deviceMap.values().next().value?.fechas || [];

    // Actualizar labels en lugar de reemplazar objeto chartData
    this.chartData.labels = labels;
    this.chartData.datasets = [];
    const sensorColors = new Map<string, { borderColor: string, backgroundColor: string, borderDash?: number[] }>();

    let colorIndex = 0;
    deviceMap.forEach((data, key) => {
      if (!sensorColors.has(data.tipo_sensor)) {
        const color = this.generateColor(colorIndex++);
        sensorColors.set(data.tipo_sensor, {
          borderColor: color,
          backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.2)'),
          borderDash: []
        });
      }

      const colorConfig = sensorColors.get(data.tipo_sensor)!;

      this.chartData.datasets.push({
        label: key,
        data: data.valores,
        borderColor: colorConfig.borderColor,
        backgroundColor: colorConfig.backgroundColor,
        borderDash: colorConfig.borderDash,
        tension: 0.3
      });
    });

    // Forzar actualización suave del gráfico
    this.chart?.update();
  }
  generateColor(index: number): string {
    const palette = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
      'rgb(0, 128, 0)',
      'rgb(0, 0, 128)',
      'rgb(128, 0, 128)'
    ];
    return palette[index % palette.length];
  }
  resetZoom() {
    const chart = this.chart?.chart; // chart es la instancia de Chart.js
    chart?.resetZoom();
  }
}