import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { CategoriasComponent } from './categorias.component';
import { CategoriasService } from '../../services/categorias/categorias.service';
import { CrearCategoriasComponent } from './crear/crear.component';
import { BuscarCategoriasComponent } from './buscar/buscar.component';
import { ActualizarCategoriasComponent } from './actualizar/actualizar.component';
import { EliminarCategoriasComponent } from './eliminar/eliminar.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule
  ],
  declarations: [CategoriasComponent, CrearCategoriasComponent, BuscarCategoriasComponent, ActualizarCategoriasComponent, EliminarCategoriasComponent],
  exports: [CategoriasComponent, CrearCategoriasComponent, BuscarCategoriasComponent, ActualizarCategoriasComponent, EliminarCategoriasComponent],
  providers: [CategoriasService]
})
export class CategoriasModule { }