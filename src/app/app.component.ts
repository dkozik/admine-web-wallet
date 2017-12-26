import { Component } from '@angular/core';
import { FormBuilder} from "@angular/forms";
import { SpinnerComponent } from "./components/spinner";
import { UtilsService } from "./global/utils";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'AdMine';
    showSpinner: boolean = true;

    constructor() {}

    addScript( src, onload = null ) {
        var scr = document.createElement('script');
        scr.src = src;
        scr.async = true;
        if (onload) {
            scr.onload = onload;
        }
        document.head.appendChild(scr);
    }

    addCss(src) {
        var link = document.createElement('link');
        link.href=src;
        link.rel='stylesheet';
        document.head.appendChild(link);
    }

    setSpinnerState( state: boolean ): void {
        this.showSpinner = (state==true);
    }
}
