/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />

namespace IncrementalApp {
    export interface IncrementalScope {
        resources: {[resource:string]:number};
    }

    export class IncrementalController {
        public static $inject:string[] = ["$scope", "dataStore"];

        public scope:IncrementalScope;

        constructor(private $scope:IncrementalScope, private dataStore:DataStore.DataStoreService) {
            this.scope = $scope;

            $scope.resources = dataStore.current;
        }
    }

    angular
        .module("incremental", ["incremental.directives", "incremental.services"])
        .controller("IncrementalController", IncrementalController);
}
