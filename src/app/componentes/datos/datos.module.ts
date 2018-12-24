import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { DatosComponent } from './datos.component';
import { CrearDatosComponent } from './crear/crear.component';
import { BuscarDatosComponent } from './buscar/buscar.component';
import { ActualizarDatosComponent } from './actualizar/actualizar.component';
import { EliminarDatosComponent } from './eliminar/eliminar.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule
  ],
  declarations: [DatosComponent, CrearDatosComponent, BuscarDatosComponent, ActualizarDatosComponent, EliminarDatosComponent],
  exports: [DatosComponent, CrearDatosComponent, BuscarDatosComponent, ActualizarDatosComponent, EliminarDatosComponent]
})
export class DatosModule { }