
import {Component, OnInit, ViewChild} from "@angular/core";
import {HttpService} from "../http.service";
import {MatPaginator, MatSort, MatTableDataSource} from "@angular/material";

@Component({
    selector: 'profile-confirm',
    templateUrl: './profile-confirm.html',
    styleUrls: ['./profile-confirm.css'],
    providers: [ HttpService ]
})
export class ProfileConfirm implements OnInit {

    displayedColumns = ['checkbox', 'date_create', 'transfere_descr', 'eth_wallet_addr', 'amount', 'mcn_amount', 'dest_user_login', 'src_user_login'];
    dataSource: MatTableDataSource<any>;
    checkAllFlag: boolean = false;
    checkedRows: Object = {};
    rowsChecked: number = 0;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(private http: HttpService) {
        document.title = "Confirm internal amount | Wallet AdMine";
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
        this.http.listTokenRequest().subscribe(function( data: any ) {
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
        this.http.confirmTokens(Object.getOwnPropertyNames(this.checkedRows)).subscribe(function( data: any ) {
            if (data.ok) {
                alert("Transactions successfuly confirmed");
                this.resetForm();
            } else if (data.error) {
                alert(data.error);
            }
        }.bind(this));
    }

    doDeclineTtransactions(): void {
        this.http.declineTokens(Object.getOwnPropertyNames(this.checkedRows)).subscribe(function(data: any) {
            if (data.ok) {
                alert("Transactions successfuly declined");
                this.resetForm();
            } else if (data.error) {
                alert(data.error);
            }
        }.bind(this));
    }

}