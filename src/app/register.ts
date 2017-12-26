import {Component, OnInit} from "@angular/core";
import {HttpService} from "./http.service";
import {ErrorStateMatcher} from "@angular/material";
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from "@angular/forms";
import {User} from "./user";
import {Router} from "@angular/router";
import {environment} from "../environments/environment";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
    selector: 'register',
    templateUrl: './register.html',
    styleUrls: ['register.css'],
    providers: [ HttpService ]
})
export class RegisterForm implements OnInit {
    user: User = new User();

    mobileQuery: MediaQueryList;
    formGroup: FormGroup;
    metricScriptLink1: string = environment.registerMetricScriptLink1;
    metricScriptLink2: string = environment.registerMetricScriptLink2;
    metricImgLink1: string = environment.registerMetricImgLink1;
    metricImgLink2: string = environment.registerMetricImgLink2;

    ebRand: number = Math.random();

    constructor(private http: HttpService, private router: Router, private media: MediaMatcher) {

        document.title = "Register | Wallet AdMine";
        this.mobileQuery = media.matchMedia('(max-width: 600px)');

        this.ebRand = this.ebRand * 1000000;
        var script = document.createElement('script');
        script.src = "HTTP://"+environment.registerCompleteMetricHost1+"/Serving/ActivityServer.bs?cn=as&ActivityID=1114781&rnd="+this.ebRand;
        document.body.appendChild(script);
    }

    // CPA support
    ngAfterViewInit(): void {
        var script = document.createElement('script');
        script.src = this.metricScriptLink1;
        document.body.appendChild(script);

        script = document.createElement('script');
        script.src = this.metricScriptLink2;
        document.body.appendChild(script);
    }

    ngOnInit(): void {
        // https://www.concretepage.com/angular-2/angular-2-formgroup-example
        this.formGroup = new FormGroup({
            login: new FormControl('', [Validators.required]),
            email: new FormControl('', [Validators.required, Validators.email]),
            emailConfirm: new FormControl('', [Validators.required, function(input: FormControl) {
                if (this.formGroup) {
                    return this.formGroup.get('email').value==input.value? null: { mismatchedPassword: true };
                }
                return null;
                //return this.email.value==input.value? null: { mismatchedPassword: true };
            }.bind(this)]),
            password: new FormControl('', [Validators.required]),
            passwordConfirm: new FormControl('', [Validators.required, function(input: FormControl) {
                if (this.formGroup) {
                    return this.formGroup.get('password').value==input.value? null: { mismatchedPassword: true }
                }
                return null;
                //return this.password.value==input.value? null: { mismatchedPassword: true };
            }.bind(this)])
        })
    }

    get email(): any {
        return this.formGroup.get('email');
    }

    get emailConfirm(): any {
        return this.formGroup.get('emailConfirm');
    }

    doRegister(user: User) {
        if (!this.formGroup.valid) {
            this.formGroup.setErrors(this.formGroup.errors);
        } else {
            var data = {
                login: this.formGroup.get('login').value,
                email: this.formGroup.get('email').value,
                password: this.formGroup.get('password').value
            };

            this.http.register(data).subscribe(function(result: any) {
                if (result.ok) {
                    if (result.confirm_sent) {
                        this.router.navigateByUrl('register-complete');
                    } else {
                        this.router.navigateByUrl('profile/(content_page:info)');
                    }

                } else if (result.error) {
                    alert(result.error);
                }
            }.bind(this), function( result: any ) {
                var error = result.error;
                alert(error.error);
            });
        }
    }
}