import {Component, OnInit} from "@angular/core";
import { HttpService } from "./http.service";
import { User } from "./user";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {MediaMatcher} from "@angular/cdk/layout";

@Component({
    selector: 'login-form',
    templateUrl: './login-form.html',
    styleUrls: ['login-form.css'],
    providers: [ HttpService ]
})
export class LoginForm implements OnInit {

    user: User = new User();
    mobileQuery: MediaQueryList;
    formGroup: FormGroup;

    constructor(private httpService: HttpService, private router: Router, private media: MediaMatcher) {
        document.title = "Login | Wallet AdMine";
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
    }

    ngOnInit(): void {
        this.formGroup = new FormGroup({
            login: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required]),
            remember: new FormControl('')
        });
    }

    doLogin(user: User) {
        if (this.formGroup.valid) {
            var data = {
                login: this.formGroup.get('login').value,
                password: this.formGroup.get('password').value,
                remember: this.formGroup.get('remember').value
            };
            this.httpService.doLogin(data).subscribe(function(data: User) {
                this.router.navigateByUrl('profile/(content_page:info)');
            }.bind(this),
            function(error) {
                alert(error.error.error);
            });
        } else {
            alert('Please, enter login and password');
        }
    }
}