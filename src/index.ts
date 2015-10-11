/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./directives/converter/converter.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />

namespace IncrementalApp {
    export interface IncrementalScope {
        converters: {
            cost:Converter.ConverterAmount[];
            description:string;
            name:string;
        }[];

        resources: DataStore.DataSnapshot;
    }

    export class IncrementalController {
        public static $inject:string[] = ["$scope", "dataStore"];

        constructor(private $scope:IncrementalScope, private dataStore:DataStore.DataStoreService) {
            let starterKit:DataStore.DataSnapshot = {
                "scrap": 2,
                "junk": 0,
                "scrapbot": 0
            };

            this.$scope.converters = [
                {
                    cost: [{resource: "scrap", count: 1}],
                    description: "+1 Scrap",
                    name: "collect"
                },
                {
                    cost: [{resource: "scrap", count: -2}, {resource: "junk", count: 1}],
                    description: "-2 Scrap, +1 Junk",
                    name: "convert"
                },
                {
                    cost: [{resource: "junk", count: -5}, {resource: "scrapbot", count: 1}],
                    description: "-5 Junk, +1 Scrapbot",
                    name: "build"
                },
                {
                    cost: [{resource: "scrapbot", count: -1}, {resource: "coal", count: 3}],
                    description: "-1 Scrapbot, +3 Coal",
                    name: "mine"
                },
                {
                    cost: [{resource: "scrapbot", count: -1}, {resource: "coal", count: -5}, {resource: "scrap", count: 30}],
                    description: "-1 Scrapbot, -5 Coal, +30 Scrap",
                    name: "gather"
                }
            ];

            if (_.isEmpty(this.dataStore.current)) {
                this.dataStore.current = starterKit;
            }

            this.$scope.resources = this.dataStore.current;
        }
    }

    angular
        .module("incremental", ["incremental.directives", "incremental.services"])
        .controller("IncrementalController", IncrementalController);
}
