import {Component, ElementRef, Input, OnInit} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {environment} from "../../environments/environment";

@Component({
    selector: 'dhtmlx-table',
    template: '<div style="height: 100%; width: 100%;"></div>',
    styleUrls: ['./dhtmlx-table.css']
})
export class DhtmlxTable implements OnInit {

    requestLogGrid: any;

    @Input() columnsInfo: any;
    @Input() restPoint: string;

    constructor( private element: ElementRef, private sanitizer: DomSanitizer) {}


    ngOnInit(): void {}

    ngAfterContentInit(): void {
//console.log(this.columnsInfo);
        var dhtmlXGridObject = window['dhtmlXGridObject'];
        var prop = {
            ids: [],
            headers: [],
            widths: [],
            aligns: [],
            types: [],
            sorting: [],
            filters: []
        };
        for (var i=0; i<this.columnsInfo.length; i++) {
            var ci = this.columnsInfo[i];
            prop.ids.push(ci.id);
            prop.headers.push(ci.text);
            prop.widths.push(ci.w_px);
            prop.aligns.push('left');
            prop.types.push(ci.type);
            prop.sorting.push(ci.sort);
            prop.filters.push('#text_filter')
        }
        this.requestLogGrid = new dhtmlXGridObject(this.element.nativeElement.childNodes[0]);
        this.requestLogGrid.setImagePath("/vendor/imgs/");

        this.requestLogGrid.setColumnIds(prop.ids.join());
        this.requestLogGrid.setHeader(prop.headers.join());
        this.requestLogGrid.setInitWidths(prop.widths.join());
        this.requestLogGrid.setColAlign(prop.aligns.join());
        this.requestLogGrid.setColTypes(prop.types.join());
        this.requestLogGrid.setColSorting(prop.sorting.join());
        this.requestLogGrid.attachFooter(prop.filters.join());
        this.requestLogGrid.setSkin('material');
        this.requestLogGrid.init();
        this.requestLogGrid.enableSmartRendering(true,20);
        this.requestLogGrid.load(environment.restUrl+this.restPoint, 'json');
    }

}