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
                ratio: "=",
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
        public ratio: number;
        public text: string;

        public convert() {
            let sourceRatio = this.ratio && this.ratio > 0 ? this.ratio : 1;
            let destRatio = 1;

            if (sourceRatio < 1) {
                destRatio = sourceRatio / 1;
                sourceRatio = 1;
            }

            if (this.source >= sourceRatio) {
                this.source -= sourceRatio;
                this.dest += destRatio;
            }
        }
    }

    angular
        .module("incremental.converter", [])
        .directive("converter", () => new ConverterDirective())
        .controller("ConverterController", ConverterController);
}
