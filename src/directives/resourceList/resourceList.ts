/// <reference path="../../../typings/tsd.d.ts" />

namespace ResourceList {
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
                resources: "="
            };
            this.controller = ResourceListController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
    }

    export class ResourceListController {
        public resources: {[resource:string]:number};
    }

    angular
        .module("incremental.resourceList", [])
        .directive("resourcelist", () => new ResourceListDirective())
        .controller("ResourceListController", ResourceListController);
}
