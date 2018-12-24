import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CasosComponent } from './casos.component';
import { CasosService } from '../../services/casos.service';

import {
DialogModule,
GrowlModule,
ProgressBarModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

const casosRoutes : Routes = [
 { path: '', component: CasosComponent},
]

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	RouterModule.forChild(casosRoutes),
 	DialogModule,
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  providers: [CasosService],
  declarations: [CasosComponent]
})
export class CasosModule { }