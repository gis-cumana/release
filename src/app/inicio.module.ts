import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { HeaderModule } from './componentes/header/header.module';

import { HomeComponent } from './componentes/home/home.component';
import { FooterComponent } from './componentes/footer/footer.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule,
 	HeaderModule
  ],
  declarations: [HomeComponent, FooterComponent]
})
export class InicioModule { }