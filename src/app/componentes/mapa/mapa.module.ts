import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import {
GalleriaModule,
ButtonModule,
DialogModule,
GrowlModule,
ProgressBarModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

import { PopupModalContentComponent } from './popup-modal-content.component';

import { HeaderModule } from '../header/header.module';
import { DatosModule } from '../datos/datos.module';

import { MapaComponent } from './mapa.component';


const mapRoutes : Routes = [
 { path: '', component: MapaComponent},
]


@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule,
 	RouterModule.forRoot(mapRoutes),
 	HeaderModule,
 	DatosModule
  ],
  declarations: [MapaComponent, PopupModalContentComponent],
  entryComponents: [
	PopupModalContentComponent
  ],
})
export class MapaModule { }