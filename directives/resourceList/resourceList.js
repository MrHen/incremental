/// <reference path="../../../typings/tsd.d.ts" />
var ResourceList;
(function (ResourceList) {
    var app = angular
        .module("incremental.resourceList", [])
        .directive('resourcelist', function () { return new ResourceListDirective(); })
        .controller("ResourceListController", ResourceListController);
    var ResourceListDirective = (function () {
        function ResourceListDirective() {
            this.templateUrl = 'directives/resourceList/resourceList.html';
            this.restrict = 'E';
            this.scope = {
                resources: "="
            };
            this.controller = ResourceListController;
            this.controllerAs = "vm";
            this.bindToController = true;
        }
        return ResourceListDirective;
    })();
    ResourceList.ResourceListDirective = ResourceListDirective;
    var ResourceListController = (function () {
        function ResourceListController() {
        }
        return ResourceListController;
    })();
    ResourceList.ResourceListController = ResourceListController;
})(ResourceList || (ResourceList = {}));
