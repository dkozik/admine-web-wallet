
import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {Router} from "@angular/router";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
    selector: 'profile-support',
    templateUrl: './profile-support.html',
    styleUrls: ['./profile-support.css'],
    providers: [ HttpService ]
})
export class ProfileSupport implements OnInit {

    tokenTypesList: Array<Object>;
    displayedColumns = ['checkbox', 'id', 'login', 'email', 'mcn_amount', 'date_create', 'role'];
    dataSource: MatTableDataSource<any>;

    checkAllFlag: boolean = false;
    checkedRows: Object = {};

    formGroup: FormGroup;
    tokenTypeControl = new FormControl('', [Validators.required]);
    selectedTokenType: any = null;


    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpService, private router: Router) {
        document.title = "Support | Wallet AdMine";
    }

    ngAfterViewInit() {

    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    doCheckRow( row ): void {
        row.checked = !row.checked;
        if (row.checked) {
            this.checkedRows[row.id] = true;
        } else {
            delete(this.checkedRows[row.id]);
        }
    }

    doCheckAll(): void {
        this.checkedRows = {};
        if (this.checkAllFlag == true) {
            for (var i=0; i<this.dataSource.filteredData.length; i++) {
                var row = this.dataSource.filteredData[i];
                row.checked = this.checkAllFlag;
                this.checkedRows[row.id] = true;
            }
        } else {
            for (var i=0; i<this.dataSource.filteredData.length; i++) {
                this.dataSource.filteredData[i].checked = this.checkAllFlag;
            }
        }
    }

    resetForm(): void {
        this.formGroup.reset();
        for (var name in this.formGroup.controls) {
            var control = this.formGroup.controls[name];
            control.setErrors(null);
        }
        this.checkAllFlag = false;
        for (var i=0; i<this.dataSource.filteredData.length; i++) {
            this.dataSource.filteredData[i].checked = false;
        }
    }

    doSendTokens(): void {
        var userIds = Object.getOwnPropertyNames(this.checkedRows);
        if (userIds.length<=0) {
            alert("Need to select one ore more users");
            return;
        }

        this.http.sendTokens(userIds,
            this.formGroup.get('tokenType').value.mnemo,
            this.formGroup.get('tokenDescr').value,
            this.formGroup.get('amount').value).subscribe(function( data: any ) {
            if (data.ok) {
                alert("Tokens send successfuly");
                this.resetForm();
            } else if (data.error) {
                alert("Tokens transfere failed: "+ data.error);
            }
        }.bind(this));
    }

    getRowColor(row): string {
        if (row.role=='master') return 'RED';
        else if (row.role=='support') return 'GREEN';
        return '';
    }

    ngOnInit(): void {

        this.formGroup = new FormGroup({
            tokenType: new FormControl('', [Validators.required]),
            tokenDescr: new FormControl('', [Validators.required]),
            amount: new FormControl('', [Validators.required, function(input: FormControl) {
                return parseFloat(input.value)>0?null: { amountMismatch: true };
            }.bind(this)])
        });

        this.http.listUsers().subscribe(function( data: any ) {
            if (data.ok) {
                this.dataSource = new MatTableDataSource(data.users);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        }.bind(this));


        this.http.listTokenTypes().subscribe(function( data: any ) {
            if (data.ok) {
                this.tokenTypesList = data.types;
            }
        }.bind(this));
    }
}