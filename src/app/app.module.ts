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

import {GalleriaModule, ButtonModule} from 'primeng/primeng';
import { CapasComponent} from './componentes/capas/capas.component';
import { FooterComponent } from './componentes/footer/footer.component';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
//servicios
import {CapasService} from './services/capas.service';

const appRoutes : Routes = [
 { path: '', component: HomeComponent},
 { path: 'capas', component: CapasComponent}
]

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        HomeComponent,
        CapasComponent,
        FooterComponent
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
        ButtonModule,
        ProgressSpinnerModule
    ],
    providers: [CapasService],
    bootstrap: [AppComponent]
})
export class AppModule { }
