import {Component, OnInit} from "@angular/core";
import {HttpService} from "../http.service";
import {UtilsService} from "../global/utils";

@Component({
    selector: 'profile-smart-contract',
    templateUrl: './profile-smart-contract.html',
    styleUrls: ['./profile-smart-contract.css'],
    providers: [ HttpService, UtilsService ]
})
export class ProfileSmartContract implements OnInit {

    totalSupply: string = '0';
    preSaleSupply: string = '0';
    icoSupply: string = '0';
    userGrowsPoolSupply: string = '0';
    auditSupply: string = '0';
    bountySupply: string = '0';
    admineTeamTokens: string = '0';
    admineAdvisorToken: string = '0';
    dhtmlxEnabled: boolean = false;
    requestLogGrid: any;
    errorStr: string;

    /*
    tp.mnemo, tp.descr as token_type, " +
            "tl.link_user_sender, su.login, " +
            "tl.eth_addr, tl.amount, tl.descr, tl.date, tl.link_user_dest
     */

    transferLogColumnsInfo = [
        { id: 'token_type', text: 'Token type', w_px: 100, type:'ro', sort:'str' },
        { id: 'link_user_sender', text: 'Sender ID', w_px: 100, type:'ro', sort:'str' },
        { id: 'login', text: 'Who pay', w_px: 100, type:'ro', sort:'str' },
        { id: 'eth_addr', text: 'Address', w_px: 300, type:'ro', sort:'str' },
        { id: 'amount', text: 'Amount', w_px: 100, type:'ro', sort:'str' },
        { id: 'descr', text: 'Describe', w_px: 200, type:'ro', sort:'str' },
        { id: 'date', text: 'Date', w_px: 110, type:'ro', sort:'str' },
        { id: 'link_user_dest', text: 'Receiver ID', w_px: 100, type:'ro', sort:'str' }

    ];

    constructor(private http: HttpService, private util: UtilsService) {
        document.title = "Smart-contract | Wallet AdMine";
    }


    ngOnInit(): void {
        this.http.getSKStats().subscribe(function(data: any) {
            if (data.ok) {
                var contract = data.contract;

                this.totalSupply = this.util.splitNum(contract.totalSupply) || '0';
                this.preSaleSupply = this.util.splitNum(contract.preSaleSupply) || '0';
                this.icoSupply = this.util.splitNum(contract.ICOSupply) || '0';
                this.userGrowsPoolSupply = this.util.splitNum(contract.userGrowsPoolSupply) || '0';
                this.auditSupply = this.util.splitNum(contract.auditSupply) || '0';
                this.bountySupply = this.util.splitNum(contract.bountySupply) || '0';
                this.admineTeamTokens = this.util.splitNum(contract.AdmineTeamTokens) || '0';
                this.admineAdvisorToken = this.util.splitNum(contract.AdmineAdvisorTokens) || '0';

            }
        }.bind(this));

    }

    doUpdateAdmineWalletsList(): void {
        this.http.updateAdmineWallets().subscribe(function(data:any) {
            if (data.ok) {
                alert("Successfuly");
            } else if (data.error) {
                this.errorStr = data.error;
            } else {
                this.errorStr = "Internal server error";
            }
        }.bind(this), function(data) {
            this.errorStr = data.error.error;
        }.bind(this));
    }

}