import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'profile-email-templates',
    templateUrl: './profile-email-templates.html',
    styleUrls: ['./profile-email-templates.css'],
    providers: [ HttpService ]
})
export class ProfileEmailTemplates implements OnInit {

    errorStr: string;
    templateDisplayedColumns = [ 'name', 'date', 'descr', 'action' ];
    templatesDataSource: MatTableDataSource<any>;
    checkAllFlag: boolean = false;
    checkedRows: Object = {};
    rowsChecked: number = 0;
    editor: any;
    editorContainer: HTMLElement;

    formGroup: FormGroup;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor( private http: HttpService ) {
        document.title = "Email templates | Wallet AdMine";
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

        this.formGroup = new FormGroup({
            templateName: new FormControl('', [Validators.required]),
            descr: new FormControl('', [Validators.required])
        });


        this.http.listEmailTemplates().subscribe(function( data: any ) {
            if (data.ok) {
                /*var templates = [
                    {name: 'Welcome', date: '2017-12-14', descr: 'Describe' }
                ];*/
                this.templatesDataSource = new MatTableDataSource(data.templates);
                this.templatesDataSource.paginator = this.paginator;
                this.templatesDataSource.sort = this.sort;
            } else if (data.error) {
                this.errorStr = data.error;
            } else {
                this.errorStr = 'Internal server error';
            }
        }.bind(this), function(data:any) {
            this.errorStr = data.error.error;
        }.bind(this));


        var Quill = window['Quill'];
        if (Quill) {
            this.editorContainer = document.getElementById('editor');
            var toolBar = document.getElementById('toolbar');
            this.editor = new Quill(this.editorContainer, {
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

    doEditTemplate( row ): void {

console.log(row);
    }

    doSaveTemplate(): void {
        var html = this.editorContainer.querySelector('div.ql-editor').innerHTML;
        var content = this.editor.getContents();
        var text = this.editor.getText();
        this.http.saveTemplate(html, text, content).subscribe(function( data: any ) {
            if (data.ok) {

            } else if (data.error) {
                this.errorStr = data.error;
            } else {
                this.errorStr = 'Internal server error';
            }
        }.bind(this), function(data) {
            this.errorStr = data.error.error;
        }.bind(this));
    }

    doAddTemplate(): void {

    }
}