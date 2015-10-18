/// <reference path="../typings/tsd.d.ts" />
/// <reference path="./directives/converter/converter.ts" />
/// <reference path="./directives/resourceList/resourceList.ts" />
/// <reference path="./services/dataStore/dataStore.service.ts" />
/// <reference path="./services/ticker/ticker.service.ts" />

namespace IncrementalApp {
    export interface IncrementalScope extends ng.IScope {
        converters: {
            cost:Converter.ConverterAmount[];
            description:string;
            name:string;
        }[];

        deltas: ResourceList.ResourceDeltas,

        resources: DataStore.DataSnapshot;
        snapshotTime: Date;

        ticker: Ticker.TickerInterface;

        save: () => any;
    }

    export class IncrementalController {
        public static $inject:string[] = ["$scope", "dataStore", "ticker"];

        constructor(private $scope:IncrementalScope, private dataStore:DataStore.DataStoreService, private ticker:Ticker.TickerServiceInterface) {
            let starterKit:DataStore.DataSnapshot = {
                "scrap": 2,
                "junk": 0,
                "scrapbot": 0
            };

            console.log('starting main');
            this.dataStore.getCurrent()
                .then((result) => {
                          console.log('resolved data', result);
                          if (_.isEmpty(result)) {
                              return this.dataStore.setCurrent(starterKit);
                          } else {
                              return result;
                          }
                      })
                .then((result) => {
                          console.log('resolved default', result);
                          this.$scope.resources = result;
                      });

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
                    cost: [{resource: "scrapbot", count: -1},
                        {resource: "coal", count: -5},
                        {resource: "scrap", count: 30}],
                    description: "-1 Scrapbot, -5 Coal, +30 Scrap",
                    name: "gather"
                },
                {
                    cost: [{resource: "scrapbot", count: -10},
                        {resource: "autobot", count: 1}],
                    description: "-10 Scrapbot, +1 Autobot",
                    name: "upgrade"
                }
            ];

            this.$scope.deltas = {
                'scrap': (tick:number) => {
                    return this.$scope.resources['autobot'] * tick || 0;
                }
            };

            this.$scope.save = this.save;
            this.$scope.ticker = this.ticker.data;

            this.$scope.$on('convert', (result, args) => {
                this.$scope.snapshotTime = new Date();
                this.$scope.save();
            });

            this.dataStore.getStart()
                .then((result) => {
                          console.log('resolved start', result);
                          if (!result) {
                              return this.dataStore.setStart(new Date());
                          } else {
                              return result;
                          }
                      })
                .then((result) => {
                          console.log('resolved start post-default', result);
                          this.ticker.start(result);
                      });

            this.dataStore.getCurrentDate()
                .then((result) => {
                         this.$scope.snapshotTime = result;
                      });
        }

        private save = () => {
            this.dataStore.setCurrent(this.$scope.resources);
            this.dataStore.setCurrentDate(this.$scope.snapshotTime);
        };
    }

    angular
        .module("incremental", ["incremental.directives", "incremental.services"])
        .controller("IncrementalController", IncrementalController);
}
