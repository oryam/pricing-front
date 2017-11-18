import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { StocksComponent } from './component/stocks/stocks.component';

import { StockService } from './spi/stock.service';


@NgModule( {
    declarations: [
        AppComponent,
        StocksComponent,
    ],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
        AppRoutingModule,
    ],
    providers: [
        StockService,
    ],
    bootstrap: [
        AppComponent,
    ]
} )
export class AppModule { }
