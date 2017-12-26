
import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
    selector: 'profile-confirm-external',
    templateUrl: './profile-confirm-external.html',
    styleUrls: ['./profile-confirm-external.css'],
    providers: [ HttpService ]
})
export class ProfileConfirmExternal implements OnInit {

    displayedColumns = ['checkbox', 'date_create', 'transfere_descr', 'reason', 'ext_eth_address', 'amount', 'mcn_amount', 'src_user_login'];
    dataSource: MatTableDataSource<any>;
    checkAllFlag: boolean = false;
    checkedRows: Object = {};
    rowsChecked: number = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpService) {
        document.title = "Confirm external amount | Wallet AdMine";
    }

    ngAfterViewInit() {

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
            for (var i=0; i<this.dataSource.filteredData.length; i++) {
                var row = this.dataSource.filteredData[i];
                row.checked = this.checkAllFlag;
                this.checkedRows[row.id] = true;
            }
            this.rowsChecked = this.dataSource.filteredData.length;
        } else {
            for (var i=0; i<this.dataSource.filteredData.length; i++) {
                this.dataSource.filteredData[i].checked = this.checkAllFlag;
            }
            this.rowsChecked = 0;
        }
    }

    restruct(): void {
        this.http.listExternalTokenRequest().subscribe(function( data: any ) {
            if (data.ok) {
                this.dataSource = new MatTableDataSource(data.requests);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            }
        }.bind(this));
    }

    ngOnInit(): void {
        this.restruct();
    }

    resetForm(): void {
        this.restruct();
        this.checkAllFlag = false;
        for (var i=0; i<this.dataSource.filteredData.length; i++) {
            this.dataSource.filteredData[i].checked = false;
        }
        this.rowsChecked = 0;
    }

    doConfirmTransactions(): void {
        this.http.confirmExternalTokens(Object.getOwnPropertyNames(this.checkedRows)).subscribe(function( data: any ) {
            if (data.ok) {
                alert("Transactions successfuly confirmed");
                this.resetForm();
            } else if (data.error) {
                alert(data.error);
            }
        }.bind(this));
    }

    doDeclineTtransactions(): void {
        this.http.declineExternalTokens(Object.getOwnPropertyNames(this.checkedRows)).subscribe(function(data: any) {
            if (data.ok) {
                alert("Transactions successfuly declined");
                this.resetForm();
            } else if (data.error) {
                alert(data.error);
            }
        }.bind(this));
    }

}