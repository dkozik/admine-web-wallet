import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginForm } from "./login-form";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormField, MatFormFieldControl, MatIconRegistry } from "@angular/material";
import { HttpModule } from '@angular/http';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterModule, Routes } from "@angular/router";

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    MatStepperModule,
} from '@angular/material';

import { AppComponent } from './app.component';
import { HttpClientModule } from "@angular/common/http";
import { ProfileForm } from "./profile";
import { RegisterForm } from "./register";
import { ProfileWallets, DialogSendTokens } from "./profile/profile-wallets";
import { ProfileSupport } from "./profile/profile-support";
import { ProfileWalletsManagement } from "./profile/profile-wallets-management";
import { ProfileSettings } from "./profile/profile-settings";
import { SpinnerComponent } from "./components/spinner";
import { ProfileConfirm } from "./profile/profile-confirm";
import { ProfileSmartContract } from "./profile/profile-smart-contract";
import { RegisterComplete } from "./register-complete";
import { AccountConfirmForm } from "./account-confirm";
import { ProfileEmailDelivery } from "./profile/profile-email-delivery";
import { ProfileSupportExternal } from "./profile/profile-support-external";
import { ProfileConfirmExternal } from "./profile/profile-confirm-external";
import { RestoreAccountForm } from "./restore-account";
import {DialogBuyTokens, ProfileInfo} from "./profile/profile-info";
import { ProfileEmailTemplates } from "./profile/profile-email-templates";
import { DhtmlxTable } from "./components/dhtmlxtable";

@NgModule({
    exports: [
        CdkTableModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatStepperModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule
    ]
})
export class PlunkerMaterialModule {}

const appRoutes: Routes = [
    { path: 'login', component: LoginForm, data: { title: 'Login form' } },
    {
        path: 'profile', component: ProfileForm,
        children: [
            { path: 'info', component: ProfileInfo, outlet: 'content_page' },
            { path: 'wallet', component: ProfileWallets, outlet: 'content_page' },
            { path: 'settings', component: ProfileSettings, outlet: 'content_page' },
            { path: 'support', component: ProfileSupport, outlet: 'content_page' },
            { path: 'support-external', component: ProfileSupportExternal, outlet: 'content_page' },
            { path: 'confirm', component: ProfileConfirm, outlet: 'content_page' },
            { path: 'confirm-external', component: ProfileConfirmExternal, outlet: 'content_page' },
            { path: 'wallets-management', component: ProfileWalletsManagement, outlet: 'content_page' },
            { path: 'smart-contract', component: ProfileSmartContract, outlet: 'content_page' },
            { path: 'email-delivery', component: ProfileEmailDelivery, outlet: 'content_page' },
            { path: 'email-templates', component: ProfileEmailTemplates, outlet: 'content_page' }
        ]
    },
    { path: 'register', component: RegisterForm },
    { path: 'register-complete', component: RegisterComplete },
    { path: 'restore-account', component: RestoreAccountForm },
    { path: 'confirm-account', component: AccountConfirmForm },
//    { path: 'profile/wallets', component: ProfileWallets },
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];

@NgModule({
    declarations: [
        SpinnerComponent,
        AppComponent,
        LoginForm,
        RegisterComplete,
        AccountConfirmForm,
        ProfileForm,
        RegisterForm,
        RestoreAccountForm,
        ProfileInfo,
        ProfileWallets,
        ProfileSupport,
        ProfileSupportExternal,
        ProfileSettings,
        ProfileWalletsManagement,
        ProfileConfirm,
        ProfileConfirmExternal,
        ProfileSmartContract,
        ProfileEmailDelivery,
        ProfileEmailTemplates,
        DialogSendTokens,
        DialogBuyTokens,
        DhtmlxTable
    ],
    entryComponents: [
        DialogSendTokens,
        DialogBuyTokens
    ],
    imports: [
        RouterModule.forRoot(
            appRoutes,
            { enableTracing: false }
        ),
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        PlunkerMaterialModule,
        MatNativeDateModule,
        ReactiveFormsModule,
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
