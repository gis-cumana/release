import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { HeaderModule } from './componentes/header/header.module';
import { HomeComponent } from './componentes/home/home.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

const inicioRoutes : Routes = [
 { path: '', component: HomeComponent},
]

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule,
 	NgbModalModule.forRoot(),
 	RouterModule.forChild(inicioRoutes),
 	HeaderModule
  ],
  declarations: [HomeComponent, FooterComponent]
})
export class InicioModule { }