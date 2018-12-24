import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages/module';

import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';

import {
GalleriaModule,
ButtonModule,
DialogModule,
GrowlModule,
ProgressBarModule
} from 'primeng/primeng';
import {TableModule} from 'primeng/table';


import { AppComponent } from './app.component';

//servicios
import {AuthGuard} from './services/guard.service';

import {CasosService} from './services/casos.service';
import {SucesosService} from './services/sucesos.service';
import {AuthService} from './services/auth.service';

import { CategoriasService } from './services/categorias/categorias.service';

import { DatosService } from './services/datos/datos.service';

import { CapasService } from './services/capas/capas.service';

const appRoutes : Routes = [
 { path: '', loadChildren: './inicio.module#InicioModule'},
 { path: 'mapa', loadChildren: './componentes/mapa/mapa.module#MapaModule'},
 { path: 'casos', loadChildren: './componentes/casos/casos.module#CasosModule', canActivate: [AuthGuard]},
 { path: 'sucesos', loadChildren: './componentes/sucesos/sucesos.module#SucesosModule', canActivate: [AuthGuard]},
 { path: 'profile', loadChildren: './componentes/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
 { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        NgbModalModule.forRoot(),
        NgbPopoverModule.forRoot(),
        FlashMessagesModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        GalleriaModule,
        TableModule
    ],
    providers: [CapasService, CasosService, SucesosService, AuthService, AuthGuard, CategoriasService, DatosService],
    bootstrap: [AppComponent]
})
export class AppModule { }
