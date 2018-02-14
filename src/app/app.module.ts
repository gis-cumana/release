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

import {GalleriaModule, ButtonModule, DialogModule, GrowlModule, ProgressBarModule} from 'primeng/primeng';
import { CapasComponent} from './componentes/capas/capas.component';
import { FooterComponent } from './componentes/footer/footer.component';
import {TableModule} from 'primeng/table';
//servicios
import {CapasService} from './services/capas.service';
import {CasosService} from './services/casos.service';
import {SucesosService} from './services/sucesos.service';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './services/guard.service';



import { CasosComponent } from './componentes/casos/casos.component';
import { SucesosComponent } from './componentes/sucesos/sucesos.component';

const appRoutes : Routes = [
 { path: '', component: HomeComponent},
 { path: 'capas', component: CapasComponent},
 { path: 'casos', component: CasosComponent, canActivate: [AuthGuard]},
 { path: 'sucesos', component: SucesosComponent, canActivate: [AuthGuard]}
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
        TableModule,
        ProgressBarModule
    ],
    providers: [CapasService, CasosService, SucesosService, AuthService, AuthGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }
