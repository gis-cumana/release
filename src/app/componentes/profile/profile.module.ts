import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { ProfileComponent } from './profile.component';

import {
GalleriaModule,
ButtonModule,
DialogModule,
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
 	FlashMessagesModule,
 	RouterModule.forRoot(profRoutes),
 	GalleriaModule,
	ButtonModule,
	DialogModule,
	GrowlModule,
	ProgressBarModule,
	TableModule
  ],
  declarations: [ProfileComponent]
})
export class ProfileModule { }