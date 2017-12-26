
import {Component, Inject, OnInit} from "@angular/core";
import {HttpService} from "../http.service";
import {Router} from "@angular/router";
import {GlobalVar} from "../global/global-var";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material";
import {FormControl, Validators} from "@angular/forms";
import {MediaMatcher} from "@angular/cdk/layout";
import {UtilsService} from "../global/utils";


@Component({
    selector: 'dialog-buy-tokens',
    templateUrl: './dialog-buy-tokens.html',
    styleUrls: ['./dialog-buy-tokens.css'],
    providers: [ UtilsService ]
})
export class DialogBuyTokens {
    isMobile: boolean = false;

    ethAddress: string;
    btcAddress: string;

    ethAmountValue: string;
    btcAmountValue: string;

    remindAmount: string;

    constructor(public dialogRef: MatDialogRef<DialogBuyTokens>,
                private util: UtilsService,
                @Inject(MAT_DIALOG_DATA) public data: any) {

        this.isMobile = data.isMobile;
        this.remindAmount = data.amount;
        /*
            {ETH: "773.059", BTC: "18799.8"}
         */
        //this.ethAddress = data.wallets
        var $mcnPrice = parseFloat(data.mcn_token_price) * parseFloat(data.amount);
        if (data.wallets) {
            for (var i = 0; i < data.wallets.length; i++) {
                var w = data.wallets[i];
                switch(w.type) {
                    case 'ETH':
                        this.ethAddress = w.addr;
                        var value = (1/parseFloat(data.prices.ETH) * $mcnPrice).toFixed(5);
                        this.ethAmountValue = value;
                        break;
                    case 'BTC':
                        this.btcAddress = w.addr;
                        this.btcAmountValue = (1/parseFloat(data.prices.BTC) * $mcnPrice).toFixed(5);
                        break;
                }
            }
        }

    }

    doCopyToClipboard(addr: any): void {
        this.util.copyToClipboard(addr);
        var message = "Address ["+addr+"] coppied to clipboard";
        alert(message);
/*        try {
            navigator.serviceWorker.register('/vendor/sw.js');
            Notification.requestPermission(function (result) {
                if (result === 'granted') {
                    navigator.serviceWorker.ready.then(function (registration) {
                        registration.showNotification(message);
                    });
                } else {
                    alert(message);
                }
            });
        } catch(e) {
            alert(message);
        }*/
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    doClose(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'profile-info',
    templateUrl: './profile-info.html',
    styleUrls: ['./profile-info.css'],
    providers: [ HttpService ]
})
export class ProfileInfo implements OnInit {

    mobileQuery: MediaQueryList;
    currencies: Array<Object> = [];
    amounts: Array<Object> = [];
    contributors: string = '0';
    usersCount: string = '0';
    mcnSell: string = '0';
    ethCollected: string = '0';
    btcCollected: string = '0';
    ethUsdCollected: string = '0';
    btcUsdCollected: string = '0';
    totalUsdCollected: string = '0';
    ethUsdCurrency: string = '0';
    btcUsdCurrency: string = '0';
    ethMcnCurrency: string = '0';
    btcMcnCurrency: string = '0;'
    tokenPrice: string = '0';
    userBalance: string = '0';

    amount = new FormControl('', [Validators.required]);
    mcnTokenPrice: string = '0';

    constructor(private http: HttpService, private router: Router, public dialog: MatDialog, private media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        document.title = "Info | Wallet AdMine";
    }


    ngOnInit(): void {

/*        this.currencies = [
            { name: 'ETH', mcn: '100', usd: 450 },
            { name: 'BTC', mcn: '12313123', usd: 17402 }
        ];*/

        this.http.getFullStats().subscribe(function( data: any ) {
            if (data.ok) {
                var metric = data.metric;
                if (metric.amounts) {
                    this.ethCollected = parseFloat(metric.amounts.ETH).toFixed(5);
                    this.btcCollected = parseFloat(metric.amounts.BTC).toFixed(5);

                    this.ethUsdCurrency = metric.usd_currencies.ETH;
                    this.btcUsdCurrency = metric.usd_currencies.BTC;

                    this.ethUsdCollected = (parseFloat(metric.amounts.ETH) * parseFloat(metric.usd_currencies.ETH)).toFixed(2);
                    this.btcUsdCollected = (parseFloat(metric.amounts.BTC) * parseFloat(metric.usd_currencies.BTC)).toFixed(2);

                    this.totalUsdCollected = (parseFloat(this.ethUsdCollected) + parseFloat(this.btcUsdCollected)).toFixed(2);

                    this.usersCount = metric.users_count;
                    this.contributors = metric.pay_users_count;

                    this.ethMcnCurrency = parseFloat(metric.mcn_currencies.ETH).toFixed(4);
                    this.btcMcnCurrency = parseFloat(metric.mcn_currencies.BTC).toFixed(4);

                    this.userBalance = window['mcnAmount'];

                    this.mcnSell = (parseFloat(metric.pre_sale_tokens)-parseFloat(metric.tokens.preSaleSupply)).toFixed(4);

                    this.tokenPrice = metric.mcn_usd_price;
                    this.mcnTokenPrice = metric.mcn_usd_price;

                    for (var key in metric.amounts) {
                        var c = metric.amounts[key];
                        this.amounts.push({
                            name: key,
                            value: metric.amounts[key]
                        });
                    }

                }
            }
        }.bind(this));
    }

    doShowHowToBuy(): void {
        this.http.getProfileWallets().subscribe(function( data:any ) {
            if (data.ok) {

                // this.ethUsdCurrency = metric.usd_currencies.ETH;
                // this.btcUsdCurrency = metric.usd_currencies.BTC;
                var dialogRef = this.dialog.open(DialogBuyTokens, {
                    width: '600px',
                    data: {
                        wallets: data.wallets,
                        prices: {
                            'ETH': this.ethUsdCurrency,
                            'BTC': this.btcUsdCurrency
                        },
                        amount: this.amount.value,
                        mcn_token_price: this.mcnTokenPrice,
                        isMobile: this.mobileQuery.matches
                    }
                });

                dialogRef.afterClosed().subscribe(function(result) {

                });
            }
        }.bind(this));
    }

    calcCurrency( curr ): void {
console.log(curr);
    }
}