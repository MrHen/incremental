/// <reference path="../../../typings/tsd.d.ts" />

namespace DataStore {
    export interface DataSnapshot {
        [resource:string]: number;
    }

    export interface DataStoreServiceInterface {
        getCurrent: () => ng.IPromise<DataSnapshot>;
        setCurrent: (value:DataSnapshot) => ng.IPromise<DataSnapshot>;

        getCurrentDate: () => ng.IPromise<Date>;
        setCurrentDate: (value:Date) => ng.IPromise<Date>;

        getStart: () => ng.IPromise<Date>;
        setStart: (value:Date) => ng.IPromise<Date>;
    }

    interface DataStoreScope {
        current: DataSnapshot;
        currentDate: Date;
        start: Date;
    }

    export class DataStoreService implements DataStoreServiceInterface {
        private cache:DataStoreScope = {
            current: {},
            currentDate: null,
            start: null
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

        public getCurrentDate():ng.IPromise<Date> {
            return this.service.getCurrentDate().then((result) => {
                return this.cache.currentDate = result;
            });
        }

        public setCurrentDate(value:Date):ng.IPromise<Date> {
            return this.service.setCurrentDate(value).then((result) => {
                return this.cache.currentDate = result;
            });
        }

        public getStart():ng.IPromise<Date> {
            return this.service.getStart().then((result) => {
                return this.cache.start = result; // TODO maybe should be angular.extend?
            });
        }

        public setStart(value:Date):ng.IPromise<Date> {
            return this.service.setStart(value).then((result) => {
                return this.cache.start = result;
            });
        }
    }

    export class MemoryDataStoreService implements DataStoreServiceInterface {
        private current:DataSnapshot = {};
        private currentDate:Date = null;
        private start:Date = null;

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

        public getCurrentDate():ng.IPromise<Date> {
            return this.$q.when(this.currentDate);
        }

        public setCurrentDate(value:Date):ng.IPromise<Date> {
            this.currentDate = value;
            return this.getCurrentDate();
        }

        public getStart():ng.IPromise<Date> {
            return this.$q.when(this.start);
        }

        public setStart(value:Date):ng.IPromise<Date> {
            this.start = angular.copy(value);
            return this.getStart();
        }
    }

    export class LocalDataStoreService implements DataStoreServiceInterface {
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

        public getCurrentDate():ng.IPromise<Date> {
            let currentDate:string = this.localStorageService.get<string>('currentDate');
            return this.$q.when(currentDate ? new Date(currentDate) : currentDate);
        }

        public setCurrentDate(value:Date):ng.IPromise<Date> {
            this.localStorageService.set('currentDate', value);
            return this.getCurrentDate();
        }

        public getStart():ng.IPromise<Date> {
            let start:string = this.localStorageService.get<string>('start');
            return this.$q.when(start ? new Date(start) : start);
        }

        public setStart(value:Date):ng.IPromise<Date> {
            this.localStorageService.set('start', value);
            return this.getStart();
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
