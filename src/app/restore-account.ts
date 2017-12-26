
import {Component, OnInit} from "@angular/core";
import {HttpService} from "./http.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'restore-account',
    templateUrl: './restore-account.html',
    styleUrls: ['restore-account.css'],
    providers: [ HttpService ]
})
export class RestoreAccountForm implements OnInit {

    errorStr: string = null;
    email: string = null;
    formGroup: FormGroup;
    formGroupConfirm: FormGroup;
    onQuery: boolean = false;
    restoreSuccess: boolean = false;
    hashPresented: boolean = false;
    haveResponse: boolean = true;
    canChangePassword: boolean = false;
    confirmHash: string = null;

    constructor( private http: HttpService, private router: Router, private activatedRoute: ActivatedRoute ) {
        document.title = "Restore account | Wallet AdMine";
        this.activatedRoute.queryParams.subscribe(function( params: Params ) {
            if (params.hash > '') {
                this.hashPresented = true;
                this.haveResponse = false;
                this.http.restoreState(params.hash).subscribe(function(data: any) {
                    this.haveResponse = true;
                    if (data.ok) {
                        this.canChangePassword = true;
                        this.confirmHash = params.hash;
                    } else if (data.error) {
                        this.errorStr = data.error;
                    } else {
                        this.errorStr = 'Internal server error';
                    }
                }.bind(this), function(response) {
                    this.haveResponse = true;
                    this.errorStr = response.error.error;
                }.bind(this));
            }
        }.bind(this));
    }


    ngOnInit(): void {
        this.formGroup = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        });

        this.formGroupConfirm = new FormGroup({
            newPassword: new FormControl('', [Validators.required]),
            newPasswordConfirm: new FormControl('', [Validators.required, function(input: FormControl) {
                if (this.formGroupConfirm) {
                    return this.formGroupConfirm.get('newPassword').value == input.value?null: { musmatchPassword: true };
                }
                return null;
            }.bind(this)])
        });
    }

    doRestore(): void {
        this.onQuery = true;
        this.http.restoreAccount(this.formGroup.get('email').value).subscribe(function(data: any) {
            this.onQuery = false;
            if (data.ok) {
                this.restoreSuccess = true;
            } else if (data.error) {
                this.errorStr = data.error;
            }
        }.bind(this), function( data ) {
            this.onQuery = false;
            this.errorStr = data.error.error;
        }.bind(this));
    }

    doChangePass(): void {
        this.haveResponse = false;
        this.http.resetPassword(this.confirmHash, this.formGroupConfirm.get('newPasswordConfirm').value).subscribe(function( data: any ) {
            this.haveResponse = true;
            if (data.ok) {
                this.router.navigateByUrl('profile');
            } else if (data.error) {
                this.errorStr = data.error;
            } else {
                this.errorStr = 'Internal server error';
            }
        }.bind(this), function(data) {
            this.haveResponse = true;
            this.errorStr = data.error.error;
        }.bind(this));

    }
}