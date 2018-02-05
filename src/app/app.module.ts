import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeComponent } from './componentes/home/home.component';
import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import {GalleriaModule, ButtonModule, DialogModule, InputTextModule, DropdownModule, GrowlModule, InputMaskModule} from 'primeng/primeng';
import { CapasComponent} from './componentes/capas/capas.component';
import { FooterComponent } from './componentes/footer/footer.component';
import {TableModule} from 'primeng/table';
//servicios
import {CapasService} from './services/capas.service';
import {CasosService} from './services/casos.service';
import {SucesosService} from './services/sucesos.service';

import { CasosComponent } from './componentes/casos/casos.component';
import { SucesosComponent } from './componentes/sucesos/sucesos.component';

const appRoutes : Routes = [
 { path: '', component: HomeComponent},
 { path: 'capas', component: CapasComponent},
 { path: 'casos', component: CasosComponent},
 { path: 'sucesos', component: SucesosComponent}
]

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        CapasComponent,
        FooterComponent,
        CasosComponent,
        SucesosComponent
    ],
    imports: [
        NgbModalModule.forRoot(),
        FlashMessagesModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        GalleriaModule,
        DialogModule,
        ButtonModule,
        GrowlModule,
        TableModule
    ],
    providers: [CapasService, CasosService, SucesosService],
    bootstrap: [AppComponent]
})
export class AppModule { }
