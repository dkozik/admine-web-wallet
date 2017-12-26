
import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "./http.service";
import {User} from "./user";
import {MediaMatcher} from "@angular/cdk/layout";
import {FormControl, FormGroup} from "@angular/forms";
import {MatSidenav, MatTableDataSource} from "@angular/material";
import {Router} from "@angular/router";
import {GlobalVar} from "./global/global-var";
import {UtilsService} from "./global/utils";


@Component({
    selector: 'profile',
    templateUrl: './profile.html',
    styleUrls: ['profile.css'],
    providers: [ HttpService, UtilsService ]
})
export class ProfileForm implements OnInit {

    @ViewChild("snav") sideNav: MatSidenav;
    mobileQuery: MediaQueryList;
    mcnAmount: string = '0';
    groups: Array<string>;
    accessLevel: number = 0;
    loggedIn: boolean = false;

    constructor(private http: HttpService, private media: MediaMatcher, private router: Router,
                private util: UtilsService) {
        document.title = "Profile | Wallet AdMine";
        this.mobileQuery = media.matchMedia('(max-width: 600px)');
    }

    ngOnInit(): void {
        this.http.getProfile().subscribe(function( data: any ) {
            if (data.code==500) {
                this.router.navigateByUrl('login');
                return;
            }
            this.loggedIn = true;
            var profile = data.profile;
            this.mcnAmount = profile.mcn_amount;
            window['mcnAmount'] = profile.mcn_amount;

            this.groups = profile.groups;
            for (var i=0; i<profile.groups.length; i++) {
                var g = profile.groups[i];
                if (g=='support' && this.accessLevel<1) {
                    this.accessLevel = 1;
                } else if (g=='master' && this.accessLevel<2) {
                    this.accessLevel = 2;
                }
            }

        }.bind(this),
        function(data) {
            if (data.status==504) {
                // Gateway Time out, need to send message to client

            } else {
                this.loggedIn = false;
                this.router.navigateByUrl('login');
            }
            // When session not authorized, or user not exists
            //this.router.navigateByUrl('login');
        }.bind(this));
    }

    hideNav(): void {
        if (this.mobileQuery.matches) {
            this.sideNav.toggle();
        }
    }

    isSupprt(): boolean {
        //return this.groups.indexOf('master')
        return false;
    }

    doShowHowToBuy(): void {

    }

    doLogout(): void {
        this.http.logout().subscribe(function( data: any ) {
            this.router.navigateByUrl('login');
        }.bind(this));
    }

}