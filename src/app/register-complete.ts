import {Component, OnInit} from "@angular/core";
import {HttpService} from "./http.service";
import {environment} from "../environments/environment";
import {Router} from "@angular/router";

@Component({
    selector: 'register-complete',
    templateUrl: './register-complete.html',
    styleUrls: ['register-complete.css'],
    providers: [ HttpService ]
})
export class RegisterComplete implements OnInit {

    metricScriptLink1: string = environment.registerCompleteLink1;
    metricScriptLink2: string = environment.registerCompleteLink2;
    metricImgLink: string = environment.registerCompleteImgLink;

    metricHost1: string = environment.registerCompleteMetricHost1;
    metricHost2: string = environment.registerCompleteMetricHost2;

    ebRand: number = Math.random();


    constructor( private http: HttpService, private router: Router ) {
        document.title = "Register complete | Wallet AdMine";

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
    }

    doGoToLogin(): void {
        this.router.navigateByUrl('login');
    }
}