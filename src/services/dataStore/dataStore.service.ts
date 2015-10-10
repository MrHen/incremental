/// <reference path="../../../typings/tsd.d.ts" />

namespace DataStore {
    export function generateDataStoreInstance():DataStoreService {
        return new MemoryDataStoreService();
    }

    export interface DataSnapshot {
        [resource:string]: number;
    }

    export interface DataStoreService {
        tickCount: number;
        current: DataSnapshot;

        tick:(next:DataSnapshot, count?:number) => void;
    }

    export class MemoryDataStoreService implements DataStoreService {
        public tickCount:number = 0;
        public current: DataSnapshot = {
            "scrap": 2,
            "junk": 0
        };

        public tick(next:DataSnapshot, count:number = 1):void {
            this.tickCount += count;
            this.current = angular.extend(next);
        }
    }

    angular
        .module("incremental.dataStore", [])
        .factory("dataStore", generateDataStoreInstance);
}
