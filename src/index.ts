/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />

module IncrementalApp {
    export interface IncrementalScope {
        resources: {[resource:string]:number};
    }

    export class IncrementalController {
        public scope: IncrementalScope;

        public static $inject:string[] = ["$scope", "dataStore"];

        constructor(private $scope:IncrementalScope, private dataStore:DataStore.DataStoreService) {
            this.scope = $scope;

            $scope.resources = dataStore.current;
        }
    }

    var app = angular
        .module("incremental", ['incremental.directives', 'incremental.services'])
        .controller("IncrementalController", IncrementalController);
}
