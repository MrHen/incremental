/// <reference path="../../../typings/tsd.d.ts" />

namespace DataStore {
    export interface DataSnapshot {
        [resource:string]: number;
    }

    export interface DataStoreServiceInterface {
        getCurrent: () => ng.IPromise<DataSnapshot>;
        setCurrent: (value:DataSnapshot) => ng.IPromise<DataSnapshot>;
    }

    interface DataStoreScope {
        current: DataSnapshot;
    }

    export class DataStoreService implements DataStoreServiceInterface {
        private cache:DataStoreScope = {
            current: {}
        };

        private promise:ng.IPromise<DataStoreScope> = null;

        private service:DataStoreServiceInterface = null;

        public static $inject:string[] = ["$q", "localDataStore"];

        constructor(private $q:ng.IQService, private localDataStore:DataStoreServiceInterface) {
            this.service = localDataStore;
        }

        // TODO work out how to handle cache hits
        public getCurrent():ng.IPromise<DataSnapshot> {
            return this.service.getCurrent().then((result) => {
                return this.cache.current = result; // TODO maybe should be angular.extend?
            });
        }

        public setCurrent(value:DataSnapshot):ng.IPromise<DataSnapshot> {
            console.log('setting current', value);
            return this.service.setCurrent(value).then((result) => {
                return this.cache.current = result;
            });
        }
    }

    export class MemoryDataStoreService implements DataStoreServiceInterface {
        private current:DataSnapshot = {};

        public static $inject:string[] = ["$q"];

        constructor(private $q:ng.IQService) {
        }

        public getCurrent():ng.IPromise<DataSnapshot> {
            return this.$q.when(this.current);
        }

        public setCurrent(value:DataSnapshot):ng.IPromise<DataSnapshot> {
            this.current = angular.copy(value);
            return this.getCurrent();
        }
    }

    export class LocalDataStoreService implements DataStoreServiceInterface {
        private current:DataSnapshot = {};

        public static $inject:string[] = ["$q", "localStorageService"];

        constructor(private $q:ng.IQService, private localStorageService:ng.local.storage.ILocalStorageService) {
        }

        public getCurrent():ng.IPromise<DataSnapshot> {
            return this.$q.when(this.localStorageService.get('current'));
        }

        public setCurrent(value:DataSnapshot):ng.IPromise<DataSnapshot> {
            this.localStorageService.set('current', value);
            return this.getCurrent();
        }
    }

    angular
        .module("incremental.dataStore", ['incremental.localDataStore'])
        .service("dataStore", DataStoreService);

    angular
        .module("incremental.memoryDataStore", [])
        .service("memoryDataStore", MemoryDataStoreService);

    angular
        .module("incremental.localDataStore", ["LocalStorageModule"])
        .config((localStorageServiceProvider:ng.local.storage.ILocalStorageServiceProvider) => {
                    localStorageServiceProvider.setPrefix('hen');
                })
        .service("localDataStore", LocalDataStoreService);
}
