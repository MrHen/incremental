/// <reference path="../../../typings/tsd.d.ts" />

namespace Converter {
    export class ConverterDirective implements ng.IDirective {
        public templateUrl: string;
        public restrict: string;
        public scope: any;
        public controller: any;
        public controllerAs: string;
        public bindToController: boolean;

        constructor () {
            this.templateUrl = "directives/converter/converter.html";
            this.restrict = "E";
            this.scope = {
                dest: "=",
                source: "=",
                text: "="
            };
            this.controller = ConverterController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class ConverterController {
        public dest: number;
        public source: number;
        public text: string;

        public convert():void {
            if (this.source > 0) {
                this.source--;
                this.dest++;
            }
        }
    }

    angular
        .module("incremental.converter", [])
        .directive("converter", () => new ConverterDirective())
        .controller("ConverterController", ConverterController);
}
