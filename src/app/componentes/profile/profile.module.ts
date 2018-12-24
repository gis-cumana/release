import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from './profile.component';

import {
GrowlModule,
ProgressBarModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';

const profRoutes : Routes = [
 { path: '', component: ProfileComponent},
]


@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	RouterModule.forChild(profRoutes),
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }