import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { CapasComponent } from './capas.component';
import { CapasService } from '../../services/capas/capas.service';
import { CrearCapasComponent } from './crear/crear.component';
import { BuscarCapasComponent } from './buscar/buscar.component';
import { ActualizarCapasComponent } from './actualizar/actualizar.component';
import { EliminarCapasComponent } from './eliminar/eliminar.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule
  ],
  declarations: [CapasComponent, CrearCapasComponent, BuscarCapasComponent, ActualizarCapasComponent, EliminarCapasComponent],
  exports: [CapasComponent, CrearCapasComponent, BuscarCapasComponent, ActualizarCapasComponent, EliminarCapasComponent],
  providers: [CapasService]
})
export class CapasModule { }