/// <reference path="../../../typings/tsd.d.ts" />

namespace ResourceList {
    export interface ResourceData {[resource:string]:number}

    export interface ResourceDeltas {
        [resource:string]: (tick:number) => number
    }

    export class ResourceListDirective implements ng.IDirective {
        public templateUrl: string;
        public restrict: string;
        public scope: any;
        public controller: any;
        public controllerAs: string;
        public bindToController: boolean;

        constructor () {
            this.templateUrl = "directives/resourceList/resourceList.html";
            this.restrict = "E";
            this.scope = {
                deltas: "=",
                tick: "=",
                resources: "="
            };
            this.controller = ResourceListController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class ResourceListController {
        public deltas: ResourceDeltas;
        public tick: number;
        public resources: ResourceData;

        public effectiveValue(resource:string) {
            console.log('resource list effective value', resource);
            return this.resources[resource] + (this.deltas && this.deltas[resource] ? this.deltas[resource](this.tick) : 0);
        }
    }

    angular
        .module("incremental.resourceList", [])
        .directive("resourcelist", () => new ResourceListDirective())
        .controller("ResourceListController", ResourceListController);
}
