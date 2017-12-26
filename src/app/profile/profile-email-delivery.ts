import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
    selector: 'profile-email-delivery',
    templateUrl: './profile-email-delivery.html',
    styleUrls: ['./profile-email-delivery.css'],
    providers: [ HttpService ]
})
export class ProfileEmailDelivery implements OnInit {

    templateDisplayedColumns = [ 'name', 'date', 'descr' ];
    templatesDataSource: MatTableDataSource<any>;
    checkAllFlag: boolean = false;
    checkedRows: Object = {};
    rowsChecked: number = 0;
    editor: Object;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor( private http: HttpService ) {
        document.title = "Email delivery | Wallet AdMine";
    }

    doCheckRow( row ): void {
        row.checked = !row.checked;
        if (row.checked) {
            this.checkedRows[row.id] = true;
        } else {
            delete(this.checkedRows[row.id]);
        }
        this.rowsChecked = Object.getOwnPropertyNames(this.checkedRows).length;
    }

    doCheckAll(): void {
        this.checkedRows = {};
        if (this.checkAllFlag == true) {
            for (var i=0; i<this.templatesDataSource.filteredData.length; i++) {
                var row = this.templatesDataSource.filteredData[i];
                row.checked = this.checkAllFlag;
                this.checkedRows[row.id] = true;
            }
            this.rowsChecked = this.templatesDataSource.filteredData.length;
        } else {
            for (var i=0; i<this.templatesDataSource.filteredData.length; i++) {
                this.templatesDataSource.filteredData[i].checked = this.checkAllFlag;
            }
            this.rowsChecked = 0;
        }
    }

    ngOnInit(): void {
        var Quill = window['Quill'];
        if (Quill) {
            var container = document.getElementById('editor');
            var toolBar = document.getElementById('toolbar');
            this.editor = new Quill(container, {
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
                        ['blockquote', 'code-block'],

                        [{ 'header': 1 }, { 'header': 2 }],               // custom button values
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
                        [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
                        [{ 'direction': 'rtl' }],                         // text direction

                        [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['link', 'image', 'video'],

                        [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
                        [{ 'font': [] }],
                        [{ 'align': [] }],

                        ['clean']                                         // remove formatting button
                    ]
                },
                //placeholder: 'Compose an epic...',
                readOnly: false,
                theme: 'snow'
            });
        }
    }
}