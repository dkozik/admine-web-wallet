'use strict';

export interface GlobalVarInterface {
    userBalance: number;
}


export class GlobalVar {

    gvar = {};

    getVar(name): any {
        return this.gvar[name];
    }

    putVar(name, value): void {
        this.gvar[name] = value;
    }
}