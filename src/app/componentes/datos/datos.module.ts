import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { DatosComponent } from './datos.component';
import { AgregarDatosComponent } from './agregar/agregar.component';
import { BuscarDatosComponent } from './buscar/buscar.component';
import { ActualizarDatosComponent } from './actualizar/actualizar.component';
import { EliminarDatosComponent } from './eliminar/eliminar.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule
  ],
  declarations: [DatosComponent, AgregarDatosComponent, BuscarDatosComponent, ActualizarDatosComponent, EliminarDatosComponent],
  exports: [DatosComponent, AgregarDatosComponent, BuscarDatosComponent, ActualizarDatosComponent, EliminarDatosComponent]
})
export class DatosModule { }