/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./directives/converter/converter.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />

namespace IncrementalApp {
    export interface IncrementalScope {
        converters: {
            cost:Converter.ConverterAmount[];
            description:string;
            gain:Converter.ConverterAmount[];
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
                    cost: [{resource: "scrap", count: 2}],
                    description: "-2 Scrap, +1 Junk",
                    gain: [{resource: "junk", count: 1}],
                    name: "convert"
                },
                {
                    cost: [{resource: "junk", count: 5}],
                    description: "-5 Junk, +1 Scrapbot",
                    gain: [{resource: "scrapbot", count: 1}],
                    name: "build"
                },
                {
                    cost: [{resource: "scrapbot", count: 1}],
                    description: "-1 Scrapbot, +3 Coal",
                    gain: [{resource: "coal", count: 3}],
                    name: "mine"
                },
                {
                    cost: [{resource: "scrapbot", count: 1}, {resource: "coal", count: 5}],
                    description: "-1 Scrapbot, -5 Coal, +30 Scrap",
                    gain: [{resource: "scrap", count: 30}],
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
