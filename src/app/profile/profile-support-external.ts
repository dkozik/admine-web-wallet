import {HttpService} from "../http.service";
import {Component, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'profile-support-external',
    templateUrl: './profile-support-external.html',
    styleUrls: ['./profile-support-external.css'],
    providers: [ HttpService ]
})
export class ProfileSupportExternal implements OnInit {

    tokenTypesList: Array<Object>;
    listAddr: Array<string> = [];
    hashAddr = {};
    externalEthAddreses = [
//        {id: '0xB01E1FdA2B2f88BEE3BF2c5e7b79575b53c80d61'},
//        {id: '0xC3799B5c1aA4A70807ec958FF76A7d1683049439'},
//        {id: '0xC3799B5c1aA4A70807ec958FF76A7d1683049439'}
        ];
    walletControl = new FormControl('', [function(input: FormControl) {
        return /0x[a-zA-Z0-9]{5}/.test(input.value)?null: { incorrectValue: true };
    }]);
    errorString: string = '';
    selectedTokenType: any = null;

    formGroup: FormGroup;

    constructor( private http: HttpService ) {
        document.title = "Support external | Wallet AdMine";
    }


    ngOnInit(): void {
        this.formGroup = new FormGroup({
            tokenType: new FormControl('', [Validators.required]),
            tokenDescr: new FormControl('', [Validators.required]),
            amount: new FormControl('', [Validators.required, function(input: FormControl) {
                return parseFloat(input.value)>0?null: { amountMismatch: true };
            }.bind(this)])
        });

        this.http.listTokenTypes().subscribe(function( data: any ) {
            if (data.ok) {
                this.tokenTypesList = data.types;
            }
        }.bind(this));
    }

    doAddExternalEthAddress(): void {
        var addr = this.walletControl.value;
        if (this.listAddr.indexOf(addr)<0) {
            this.hashAddr[addr] = this.externalEthAddreses.push( {id: addr} )-1;
            this.errorString= '';
            this.listAddr.push(addr);
            this.walletControl.setValue('');
        } else {
            this.errorString = 'Address '+addr+' already added';
        }

    }

    doRemoveAddr(item): void {
        if (!item) return;
        this.externalEthAddreses.splice(this.hashAddr[item.id], 1);
        delete(this.hashAddr[item.id]);
        delete(this.listAddr[this.listAddr.indexOf(item.id)]);
    }

    resetForm(): void {
        this.externalEthAddreses = [];
        this.hashAddr = {};
        this.listAddr = [];
        this.errorString = '';
    }

    doSendTokens(): void {
        var addresses = [];
        for (var i=0; i<this.externalEthAddreses.length; i++) {
            addresses.push(this.externalEthAddreses[i].id);
        }

        this.http.sendExternalTokens(addresses,
            this.formGroup.get('tokenType').value.mnemo,
            this.formGroup.get('tokenDescr').value,
            this.formGroup.get('amount').value).subscribe(function( data: any ) {
                if (data.ok) {
                    alert("Tokens successfuly sent");
                    this.resetForm();
                } else if (data.error) {

                }
            }.bind(this), function(data) {
                alert("Tokens transfere failed: "+ data.error.error);
            }.bind(this));

    }

}