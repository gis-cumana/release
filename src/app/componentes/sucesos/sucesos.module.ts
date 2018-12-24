import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SucesosComponent } from './sucesos.component';
import { SucesosService } from '../../services/sucesos.service';

import {
DialogModule,
GrowlModule,
ProgressBarModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

const sucesosRoutes : Routes = [
 { path: '', component: SucesosComponent},
]

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	RouterModule.forChild(sucesosRoutes),
	DialogModule,
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  providers: [SucesosService],
  declarations: [SucesosComponent]
})
export class SucesosModule { }