import {Component, OnInit} from "@angular/core";
import {HttpService} from "../http.service";

@Component({
    selector: 'profile-wallet-management',
    templateUrl: './profile-wallets-management.html',
    styleUrls: ['./profile-wallets-management.css'],
    providers: [ HttpService ]
})
export class ProfileWalletsManagement implements OnInit {

    walletAddr: string;
    errorStr: string;

    constructor(private http: HttpService) {
        document.title = "Wallets manager | Wallet AdMine";
    }

    doCollectEther(): void {
        if (this.walletAddr) {
            this.http.collectEther(this.walletAddr).subscribe(function(data: any) {
                if (data.ok) {
                    alert("Successful");
                } else if (data.error) {
                    this.errorStr = data.error;
                } else {
                    this.errorStr = "Internal server error";
                }
            }.bind(this), function(err) {
                this.errorStr = err.error.error;
            }.bind(this));
        }
    }

    ngOnInit(): void {
    }
}