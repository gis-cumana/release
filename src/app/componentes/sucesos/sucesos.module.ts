import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SucesosComponent } from './sucesos.component';

import {
GalleriaModule,
ButtonModule,
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
 	FlashMessagesModule,
 	RouterModule.forRoot(sucesosRoutes),
 	GalleriaModule,
	ButtonModule,
	DialogModule,
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  declarations: [SucesosComponent]
})
export class SucesosModule { }