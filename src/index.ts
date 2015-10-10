/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />

namespace IncrementalApp {
    export interface IncrementalScope {
        resources: {[resource:string]:number};
    }

    export class IncrementalController {
        public static $inject:string[] = ["$scope", "dataStore"];

        constructor(private $scope:IncrementalScope, private dataStore:DataStore.DataStoreService) {
            let starterKit:DataStore.DataSnapshot = {
                "scrap": 2,
                "junk": 0,
                "scrapbot": 0
            };

            if (this.dataStore.current == {}) {
                this.dataStore.current = starterKit;
            }

            this.$scope.resources = this.dataStore.current;
        }
    }

    angular
        .module("incremental", ["incremental.directives", "incremental.services"])
        .controller("IncrementalController", IncrementalController);
}
