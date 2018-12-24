import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { FlashMessagesModule } from 'angular2-flash-messages/module';
import { AppComponent } from './app.component';

import {AuthGuard} from './services/guard.service';
import {AuthService} from './services/auth.service';

const appRoutes : Routes = [
 { path: '', loadChildren: './inicio.module#InicioModule'},
 { path: 'mapa', loadChildren: './componentes/mapa/mapa.module#MapaModule'},
 { path: 'casos', loadChildren: './componentes/casos/casos.module#CasosModule', canActivate: [AuthGuard]},
 { path: 'sucesos', loadChildren: './componentes/sucesos/sucesos.module#SucesosModule', canActivate: [AuthGuard]},
 { path: 'profile', loadChildren: './componentes/profile/profile.module#ProfileModule', canActivate: [AuthGuard]},
 { path: '**', redirectTo: '', pathMatch: 'full' }
]

@NgModule({
    declarations: [AppComponent],
    imports: [
        FlashMessagesModule.forRoot(),
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [AuthService, AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }