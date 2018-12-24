import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { ImportarCapasComponent, ImportarCapasContent } from './importar.component';

@NgModule({
  imports: [
    CommonModule,
 	FormsModule,
 	FlashMessagesModule
  ],
  declarations: [ImportarCapasComponent, ImportarCapasContent],
  exports: [ImportarCapasComponent, ImportarCapasContent],
  entryComponents: [
	ImportarCapasContent
  ],
})
export class ImportarModule { }