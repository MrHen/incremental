/// <reference path="../typings/tsd.d.ts" />

module IncrementalApp {
    export interface IncrementalScope {
        resources: {[resource:string]:number};
    }

    export class IncrementalController {
        public scope: IncrementalScope;

        public static $inject:string[] = ["$scope"];

        constructor(private $scope:IncrementalScope) {
            this.scope = $scope;

            $scope.resources = {
                'scrap': 0,
                'junk': 0
            };
        }
    }

    var app = angular
        .module("incremental", ['incremental.directives'])
        .controller("IncrementalController", IncrementalController);
}
