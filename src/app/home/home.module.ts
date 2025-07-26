import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { ChartWidgetComponent } from '../components/chart-widget/chart-widget.component';
import { NgApexchartsModule } from 'ng-apexcharts';
import { HeatmapComponent } from '../components/heatmap/heatmap.component';
import { SplineComponent } from '../components/spline/spline.component';
import { BarComponent } from '../components/bar/bar.component';
import { ThermometerComponent } from '../components/thermometer/thermometer.component';
import { NgxColorsModule } from 'ngx-colors';
import { GaugeComponent } from '../components/gauge/gauge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    ChartWidgetComponent,
    HeatmapComponent,
    NgApexchartsModule,
    SplineComponent,
    BarComponent,
    ThermometerComponent,
    GaugeComponent,
    NgxColorsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [HomePage]
})
export class HomePageModule { }
