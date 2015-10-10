/// <reference path="../../../typings/tsd.d.ts" />

namespace Converter {
    export interface ConverterAmount {
        resource:string;
        count:number;
    }

    export interface ConverterData {
        [resource:string]: number;
    }

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
                data: "=",
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
        public data: ConverterData;
        public dest: ConverterAmount[];
        public source: ConverterAmount[];
        public text: string;

        public convert() {
            let rejected = _.reject(this.source, source => this.data[source.resource] >= source.count);

            // TODO real warning system
            if (!_.isEmpty(rejected)) {
                console.log("not enough resources", rejected);
                return;
            }

            _.each(this.source, source => this.data[source.resource] = (this.data[source.resource] || 0) - source.count);
            _.each(this.dest, dest => this.data[dest.resource] = (this.data[dest.resource] || 0) + dest.count);
        }
    }

    angular
        .module("incremental.converter", [])
        .directive("converter", () => new ConverterDirective())
        .controller("ConverterController", ConverterController);
}
