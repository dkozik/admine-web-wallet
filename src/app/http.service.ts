import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from "@angular/common/http";
import { User } from "./user";
import { environment } from "../environments/environment";
import {AppComponent} from "./app.component";
import {URLSearchParams} from "@angular/http";

@Injectable()
export class HttpService {

    constructor(private http: HttpClient, private app: AppComponent) {

    }

    doLogin(user: any){
        const body = {
            login: user.login,
            password: user.password,
            remember: user.remember
        };
        return this.postQuery('/auth/login', body);
    }

    postQuery(restPoint: string, body?: any): any {
        var callbackFunc = function() {};
        var errFunc = function() {};
        var thenFunc = function() {};
        this.app.setSpinnerState(true);
        this.http.post(environment.restUrl+restPoint, body).subscribe(function() {
            // Проверять на отсутствие логина!
            this.app.setSpinnerState(false);
            return callbackFunc.apply(this, [].slice.apply(arguments)), thenFunc();
        }.bind(this), function() {
            this.app.setSpinnerState(false);
            return errFunc.apply(this, [].slice.apply(arguments)), thenFunc();
        }.bind(this));
        return {
            subscribe: function( callback, errCallback ) {
                callbackFunc = callback || callbackFunc;
                errFunc = errCallback || errFunc;
                return {
                    then: function( userThenFunc ) {
                        thenFunc = userThenFunc;
                    }
                }
            }
        }
    }

    getQuery(restPoint: string, params?: any): any {
        var callbackFunc = function() {};
        var errFunc = function() {};
        var thenFunc = function() {};
        this.app.setSpinnerState(true);

        // http://wallet.app/confirm-account?hash=2268cc8d8aa6bcc45132bf9f3
        var httpParams = new HttpParams();

        var paramsBuf = [ 'flushCache='+Date.now() ];
        if (params!=null) {
            for (var key in params) {
                httpParams.append(key, params[key]);
                paramsBuf.push(key+'='+params[key]);
            }
        }
        //console.log(httpParams);

//console.log('params: ', params);
        var url = environment.restUrl+restPoint+(paramsBuf.length?'?'+paramsBuf.join('&'):'')
        this.http.get(url).subscribe(function() {
        //this.http.get(environment.restUrl+restPoint, { params: httpParams }).subscribe(function() {
            // Проверять на отсутствие логина!
            this.app.setSpinnerState(false);
            return callbackFunc.apply(this, [].slice.apply(arguments)), thenFunc();
        }.bind(this), function() {
            this.app.setSpinnerState(false);
            return errFunc.apply(this, [].slice.apply(arguments)), thenFunc();
        }.bind(this));
        return {
            subscribe: function( callback, errCallback ) {
                callbackFunc = callback || callbackFunc;
                errFunc = errCallback || errFunc;
                return {
                    then: function( userThenFunc ) {
                        thenFunc = userThenFunc;
                    }
                }
            }
        }
    }

    getProfile() {
        return this.getQuery('/user/profile');
    }

    saveProfile( data: any ) {
        return this.postQuery('/user/update', data);
    }

    savePersonalEthWallet( walletAddr ) {
        return this.postQuery('/wallet/save_custom_eth_wallet', { addr: walletAddr });
    }

    removePersonalEthWallet() {
        return this.postQuery('/wallet/remove_custom_eth_wallet');
    }

    getProfileWallets() {
        return this.getQuery('/user/wallets');
    }

    getWalletsHistory() {
        return this.getQuery('/user/wallets_history');
    }

    register(data: any) {
        return this.postQuery('/auth/register', data);
    }

    addNewWallet(type: string) {
        return this.postQuery('/wallet/register_wallet', { type: type });
    }

    listUsers() {
        return this.getQuery('/wallet/list_users');
    }

    listTokenRequest() {
        return this.getQuery('/wallet/list_requests');
    }

    listExternalTokenRequest() {
        return this.getQuery('/wallet/list_external_requests');
    }

    listTokenTypes() {
        return this.getQuery('/wallet/list_token_type');
    }

    confirmTokens( transactions ) {
        return this.postQuery('/wallet/confirm_tokens', { transactions: transactions });
    }

    declineTokens( transactions ) {
        return this.postQuery('/wallet/decline_tokens', { transactions: transactions });
    }

    confirmExternalTokens( transactions ) {
        return this.postQuery('/wallet/confirm_external_tokens', { transactions: transactions });
    }

    declineExternalTokens( transactions ) {
        return this.postQuery('/wallet/decline_external_tokens', { transactions: transactions });
    }

    collectEther( walletAddr ) {
        return this.postQuery('/wallet/collect_ether', { addr: walletAddr });
    }

    sendTokens( userIds, tokenType, reason, amount ) {
        const body = {
            users: userIds,
            tokenType: tokenType,
            reason: reason,
            amount: amount
        };
        return this.postQuery('/wallet/broadcast_tokens', body);
    }

    sendMyTokens( walletFrom, toAddr, amount ) {
        return this.postQuery('/wallet/send_my_tokens', { from: walletFrom, addr: toAddr, amount: amount });
    }

    sendExternalTokens( addreses, tokenType, reason, amount ) {
        const body = {
            addr: addreses,
            tokenType: tokenType,
            reason: reason,
            amount: amount
        }
        return this.postQuery('/wallet/broadcast_external_tokens', body);
    }

    updateAdmineWallets() {
        return this.postQuery('/wallet/update_walets', {});
    }

    confirm( confirmHash ) {
        return this.getQuery('/auth/confirm', { code: confirmHash });
    }

    restoreAccount( email ) {
        return this.postQuery('/auth/restore', { email: email });
    }

    restoreState( hash ) {
        return this.getQuery('/auth/restore_state', { hash: hash });
    }

    resetPassword( hash, password ) {
        return this.postQuery('/auth/reset_password', {
            hash: hash,
            pwd: password
        });
    }

    getFullStats() {
        return this.getQuery('/stat/full');
    }

    getSKStats() {
        return this.getQuery('/stat/counters');
    }

    saveTemplate( html, text, content ) {
        return this.postQuery('/email/save_template');
    }

    loadTemplate( id ) {
        return this.getQuery('/email/load_template');
    }

    listEmailTemplates() {
        return this.getQuery('/email/template_list');
    }

    logout() {
        return this.getQuery('/auth/logout');
    }
}