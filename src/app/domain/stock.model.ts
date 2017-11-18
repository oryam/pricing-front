export class Stock {
    refreshed = false;
    refreshExpiryDate: number;

    constructor(
        public id: number,
        public code: string,
        public price: number,
        public date: Date,
    ) { }

    refreshPrice( price: number, date: Date ) {
        this.price = price;
        this.date = date;
        this.refreshed = true;
        this.refreshExpiryDate = Date.now() + 500;
    }

    hasRefreshExpiried(): boolean {
        return this.refreshed && this.refreshExpiryDate < Date.now();
    }

    expireRefresh() {
        this.refreshed = false;
        this.refreshExpiryDate = 0;
    }
}
