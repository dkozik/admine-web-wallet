
import {Component, OnInit} from "@angular/core";
import {HttpService} from "./http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
    selector: 'account-confirm',
    templateUrl: './account-confirm.html',
    styleUrls: ['account-confirm.css'],
    providers: [ HttpService ]
})
export class AccountConfirmForm implements OnInit {

    errorStr: string = null;
    successStr: string = null;
    login: string = null;
    email: string = null;
    id: string = null;
    haveResponse: boolean = false;

    constructor( private http: HttpService, private router: Router, private activatedRoute: ActivatedRoute ) {
        document.title = "Confirm account | Wallet AdMine";

        this.activatedRoute.queryParams.subscribe(function( params: Params ) {
            if (params.hash>'') {
                this.http.confirm(params.hash).subscribe(function(data: any) {
                    this.haveResponse = true;
                    if (data.ok) {
                        this.successStr = "Success";
                        this.login = data.login;
                        this.email = data.email;
                        this.id = data.id;
                    } else if (data.error) {
                        this.errorStr = data.error;
                    } else {
                        this.errorStr = "Internal server error";
                    }
                }.bind(this), function( response ) {
                    this.haveResponse = true;
                    this.errorStr = response.error.error;
                }.bind(this));
            } else {
                this.haveResponse = true;
                this.errorStr = "Incorrect form usage or params definition, account confirmation denied.";
            }
        }.bind(this));
    }


    ngOnInit(): void {

    }
}