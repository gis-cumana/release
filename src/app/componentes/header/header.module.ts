import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap/collapse/collapse.module';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap/dropdown/dropdown.module';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap/accordion/accordion.module';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { CategoriasModule } from '../categorias/categorias.module';
import { CapasModule } from '../capas/capas.module';
import { ImportarModule } from '../capas/importar/importar.module';
import { HeaderComponent } from './header.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
    NgbCollapseModule.forRoot(),
    NgbDropdownModule.forRoot(),
    NgbAccordionModule.forRoot(),
 	FlashMessagesModule,
 	CategoriasModule,
 	CapasModule,
 	ImportarModule
  ],
  declarations: [HeaderComponent],
  exports: [HeaderComponent]
})
export class HeaderModule { }