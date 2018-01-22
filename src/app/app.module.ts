import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './componentes/header/header.component';
import { HomeComponent } from './componentes/home/home.component';


import {GalleriaModule, ButtonModule} from 'primeng/primeng';
import { CapasComponent} from './componentes/capas/capas.component';
import { FooterComponent } from './componentes/footer/footer.component';

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
        RouterModule.forRoot(appRoutes),
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        GalleriaModule,
        ButtonModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
