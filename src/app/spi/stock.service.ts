import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as EventSource from 'eventsource';

import { Stock } from '../domain/stock.model';

@Injectable()
export class StockService {

    stocksEventSource: EventSource;
    stocksSubj = new Subject<Stock>();
    stocksObs: Observable<Stock>;

    constructor( private http: HttpClient ) {
        this.stocksObs = this.stocksSubj.asObservable();
    }

    getStocks(): Observable<Stock[]> {
        return this.http
            .get<Stock[]>( '/api/stocks' )
            .map(( stocks: Stock[] ) =>
                stocks.map(( stock: Stock ) =>
                    new Stock( stock.id, stock.code, stock.price, stock.date ) ) );
    }

    getStockUpdate(): Observable<Stock> {
        this.stocksEventSource = new EventSource( '/api/stocks/stream' );
        this.stocksEventSource.addListener( 'message', ( event ) => {
            // console.log( 'event data', event );
            this.stocksSubj.next( JSON.parse( event.data ) );
        } );
        return this.stocksObs;
    }

    closeStockUpdate() {
        if ( this.stocksEventSource ) {
            this.stocksEventSource.close();
        }
    }

}
