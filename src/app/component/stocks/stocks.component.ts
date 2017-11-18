import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { StockService } from '../../spi/stock.service';
import { Stock } from '../../domain/stock.model';

@Component( {
    selector: 'prc-stocks',
    templateUrl: './stocks.component.html',
    styleUrls: ['./stocks.component.scss']
} )
export class StocksComponent implements OnInit {

    refreshIntervalMs = 40;
    stocks: Stock[];
    private stockUpdateSubscription: Subscription;
    private refreshStockFlagsTimer;

    constructor( private stockService: StockService ) { }

    ngOnInit() {
        this.loadStocks();
    }

    onStartStreamStocksChanges() {
        this.reloadStockChanges();
    }

    onStopStreamStocksChanges() {
        this.stopStockChanges();
    }

    private loadStocks() {
        this.stockService.getStocks().subscribe(( values: Stock[] ) => this.stocks = values );
    }

    private reloadStockChanges() {
        this.enableRefreshStockFlags();

        this.stockUpdateSubscription = this.stockService.getStockUpdate().subscribe(( value: Stock ) => {
            this.updateStocks( value, this.stocks );
            this.stocks.splice( 1, 0 );
        } );
    }

    private updateStocks( value: Stock, list: Stock[] ) {
        const index = list.findIndex(( stock: Stock ) => stock.id === value.id );
        if ( index !== -1 ) {
            list[index].refreshPrice( value.price, value.date );
        }
    }

    private enableRefreshStockFlags() {
        this.refreshStockFlagsTimer = setInterval(( event ) => {
            this.clearStockRefreshFlags( this.stocks );
        }, this.refreshIntervalMs );
    }

    private disableRefreshStockFlags() {
        clearInterval( this.refreshStockFlagsTimer );
    }

    private stopStockChanges() {
        this.disableRefreshStockFlags();
        this.stockUpdateSubscription.unsubscribe();
        this.stockService.closeStockUpdate();
    }

    private clearStockRefreshFlags( refreshable: Stock[] ) {
        refreshable.forEach(( value: Stock ) => {
            if ( value && value.hasRefreshExpiried() ) {
                value.expireRefresh();
            }
        } );

        refreshable.splice( 1, 0 );
    }

}
