
import {Component, Inject, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {Router} from "@angular/router";
import {FormControl, Validators} from "@angular/forms";
import {
    MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatPaginator, MatSort,
    MatTableDataSource
} from "@angular/material";
import {MediaMatcher} from "@angular/cdk/layout";

interface WalletData {
    id: number;
    type: string;
    addr: string;
    amount: string;
}

@Component({
    selector: 'dialog-send-tokens',
    templateUrl: './dialog-send-tokens.html',
    styleUrls: ['./dialog-send-tokens.css'],
})
export class DialogSendTokens {

    mobileQuery: MediaQueryList;
    ethAddr = new FormControl('', [Validators.required]);
    amount = new FormControl('', [Validators.required]);

    constructor(public dialogRef: MatDialogRef<DialogSendTokens>,
                private media: MediaMatcher,
                @Inject(MAT_DIALOG_DATA) public data: any) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    doSendTokens(): void {
        this.data.ethAddr = this.ethAddr.value;
        this.data.amount = this.amount.value;
        this.dialogRef.close();
    }
}

@Component({
    selector: 'profile-wallets',
    templateUrl: './profile-wallets.html',
    styleUrls: ['./profile-wallets.css'],
    providers: [ HttpService ]
})
export class ProfileWallets implements OnInit {

    mobileQuery: MediaQueryList;
    wallets: WalletData[];
    walletTypes: string[] = ['ETH', 'BTC'];
    selectedWalletType: string;

    personalWalletPanelOpened: boolean = false;
    personalWalletPanelOpenedState: boolean = false;
    havePersonalETHWallet: boolean = false;
    parsonalWalletAddr: string = '';
    systemEthWallet: any;
    personalEthWallet: any;
    savePersonalWalletError: string = '';

    walletControl = new FormControl('', [Validators.required, function( input: FormControl ) {
        return /0x[a-zA-Z0-9]*$/.test(input.value)?null:{ invalidAddress: true };
    }]);

    walletsDisplayColumns: Array<string>;
    walletsDataSource: MatTableDataSource<any>;

    displayedColumns: Array<string>;
    dataSource: MatTableDataSource<any>;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpService,
                private router: Router,
                public dialog: MatDialog,
                private media: MediaMatcher) {
        document.title = "Wallets list | Wallet AdMine";
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        if (this.mobileQuery.matches) {
            this.walletsDisplayColumns = ['wallet'];
            this.displayedColumns = ['item'];
        } else {
            this.walletsDisplayColumns = ['type', 'addr', 'amount'];
            this.displayedColumns = ['date' ,'addr', 'amount', 'currency_type'];
        }
    }

    removeAllowedWalletTypes(type: string): void {
        var idx = this.walletTypes.indexOf(type);
        if (idx>=0) {
            // Удаление возможных для добавления кошелей
            this.walletTypes.splice(idx, 1);
        }
    }

    amoutToStr(amount:string): string {
        return parseFloat(amount).toFixed(5);
    }

    ngOnInit(): void {
        this.http.getProfileWallets().subscribe(function( data:any ) {
            if (data.ok) {
                this.wallets = data.wallets;
                this.walletsDataSource = new MatTableDataSource(data.wallets);

                for (var i=0; i<data.wallets.length; i++) {
                    if(data.wallets[i].type=='ETH') {
                        this.systemEthWallet = data.wallets[i];
                    }
                    this.removeAllowedWalletTypes(data.wallets[i].type);
                }

                if (data.personal.length>0) {
                    var personalWallet = data.personal[0];
                    this.havePersonalETHWallet = true;
                    this.personalWalletPanelOpened = true;
                    this.parsonalWalletAddr = personalWallet.addr;
                    this.personalEthWallet = personalWallet;
                }
            }
        }.bind(this), function(data) {
            // When session not authorized, or user not exists
            this.router.navigateByUrl('login');
        }).then(function() {
            this.http.getWalletsHistory().subscribe(function(data: any) {
                if (data.ok) {
                    this.dataSource = new MatTableDataSource(data.history);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                }
            }.bind(this));
        }.bind(this));
    }

/*    leadZero(val: any): string {
        return ('0'+val).substr(-2);
    }

    dtFormat(date: Date): string {
console.log('date: ('+typeof(date)+') ', date);
        return this.leadZero(date.getDate())+'.'+this.leadZero(1+date.getMonth())+'.'+date.getFullYear()
    }*/

    doRemovePersonalWallet(): void {
        this.http.removePersonalEthWallet().subscribe(function( data: any ) {
            if (data.ok) {
                this.parsonalWalletAddr = '';
                this.havePersonalETHWallet = false;
                this.savePersonalWalletError = '';
            } else if (data.error) {
                this.savePersonalWalletError = data.error;
            }
        }.bind(this), function(data) {
            this.savePersonalWalletError = data.error.error;
        }.bind(this));

    }

    doAddNewWallet(): void {
        /*
        var walletType = this.selectedWalletType;
        this.http.addNewWallet(walletType).subscribe(function(data: any) {
            this.wallets.push({
                id: data.id,
                addr: data.addr,
                type: walletType,
                amount: 0
            });
            this.removeAllowedWalletTypes(walletType);
        }.bind(this), function(data) {
            alert(data.error.error);
        });
        */
    }

    doAddPersonalEthWallet(): void {
        var walletAddr = this.walletControl.value;
        this.http.savePersonalEthWallet(walletAddr).subscribe(function(data: any) {
            if (data.ok) {
                this.havePersonalETHWallet = true;
                this.parsonalWalletAddr = walletAddr;
                this.savePersonalWalletError = '';
            } else if (data.error>'') {
                this.savePersonalWalletError = data.error;
            } else {
                this.savePersonalWalletError = 'Error on server, please try again later';
            }
        }.bind(this), function(data: any) {
            this.savePersonalWalletError = data.error.error;
        }.bind(this));
    }

    openDialog(): void {

        var wallets = [
            { addr: this.systemEthWallet.addr, amount: this.systemEthWallet.mcn_amount }
        ];
        if (this.personalEthWallet) {
            wallets.push({ addr: this.personalEthWallet.addr, amount: this.personalEthWallet.mcn_amount });
        }
        var data : any = {
            wallets: wallets
        };
        var dialogRef = this.dialog.open(DialogSendTokens, {
            width: '540px',
            data: data
        });

        dialogRef.afterClosed().subscribe(function( result ) {
            if (data.ethAddr && data.wallet_from) {
                this.http.sendMyTokens(data.wallet_from, data.ethAddr, data.amount).subscribe(function( data:any ) {
                    if (data.ok==true) {
                        alert("Tokens sent successful");
                    } else if (data.error) {
                        alert(data.error);
                    } else {
                        alert("Internal server error, tokens not sent");
                    }
                }.bind(this), function( data ) {
                    alert(data.error.error);
                });
            }
        }.bind(this));
    }

    doSendMyTokens(): void {
        this.openDialog();
    }
}

