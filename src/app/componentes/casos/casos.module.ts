import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { CasosComponent } from './casos.component';

import {
GalleriaModule,
ButtonModule,
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
 	RouterModule.forRoot(casosRoutes),
 	GalleriaModule,
	ButtonModule,
	DialogModule,
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  declarations: [CasosComponent]
})
export class CasosModule { }