import {Component, OnInit} from "@angular/core";
import {HttpService} from "../http.service";
import {User} from "../user";
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";

interface JSONProfile {
    id: string;
    email: string;
    login: string;
    last_login_date: string;
    n_first: string;
    n_middle: string;
    n_last: string;
    wallets: Array<Object>;
    mcn_amount: string;
}

interface JSONProfileAnswer {
    profile: JSONProfile;
}

@Component({
    selector: 'profile-settings',
    templateUrl: './profile-settings.html',
    styleUrls: ['./profile-settings.css'],
    providers: [ HttpService ]
})
export class ProfileSettings implements OnInit {

    mobileQuery: MediaQueryList;
    user: User = new User();
    formGroup: FormGroup;
    errorStr: string = '';
    newPassword: string = '';
    newPasswordConfirm: string = '';

    constructor(private http: HttpService, private router: Router, private media: MediaMatcher) {
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
        document.title = "Personal info | Wallet AdMine";
    }


    ngOnInit(): void {
        this.formGroup = new FormGroup({
            nFirst: new FormControl(),
            nMiddle: new FormControl(),
            nLast: new FormControl(),
            password: new FormControl(),
            passwordConfirm: new FormControl('', [function( input: FormControl ) {
                if (this.formGroup) {
                    var pwdValue = this.formGroup.get('password').value;
                    if (pwdValue>'') {
                        return pwdValue==input.value?null:{ wrongPasswordConfirm:true };
                    }
                    return null;
                }
                return null;
            }.bind(this)])
        });

        var user = this.user;
        this.http.getProfile().subscribe(function(data: JSONProfileAnswer) {
            var profile = data.profile;
            user.id = profile.id;
            user.email = profile.email;
            user.login = profile.login;
            user.last_login_date = profile.last_login_date;
            user.n_first = profile.n_first;
            user.n_middle = profile.n_middle;
            user.n_last = profile.n_last;
            user.mcn_amount = profile.mcn_amount;
            //user.wallets = profile.wallets;
        }.bind(this), function(data) {
            // When session not authorized, or user not exists
            this.router.navigateByUrl('login');
        }.bind(this));
    }

    resetForm(): void {
//        this.formGroup.reset();
        for (var name in this.formGroup.controls) {
            var control = this.formGroup.controls[name];
            control.setErrors(null);
        }
    }

    doSave(): void {
        if (this.formGroup.valid) {
            var pack = {
                n_first: this.formGroup.get('nFirst').value,
                n_middle: this.formGroup.get('nMiddle').value,
                n_last: this.formGroup.get('nLast').value,
                password: this.formGroup.get('password').value
            };
            this.http.saveProfile(pack).subscribe(function(data: any) {
                if (data.ok) {
                    alert("Personal information successfuly updated");
                    this.newPassword = '';
                    this.newPasswordConfirm = '';
                    this.resetForm();
                } else if (data.error) {
                    this.errorStr = data.error;
                } else {
                    this.errorStr = 'Internal server error';
                }
            }.bind(this), function(err) {
                this.errorStr = err.error.error;
            }.bind(this));
        }
    }
}