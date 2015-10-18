/// <reference path="../../../typings/tsd.d.ts" />

namespace Ticker {
    export interface TickerInterface {
        tickCount: number;
        interval: number;
    }

    export interface TickerServiceInterface {
        data: TickerInterface;
        start: (now?:Date) => void;
        update: (now?:Date) => number;
    }

    export class TickerService implements TickerServiceInterface {
        public data:TickerInterface = {
            tickCount: 100,
            interval: 1000
        };

        private beginning: Date;
        private rate: number = 1000;
        private latest: Date;

        public static $inject:string[] = ["$timeout"];

        constructor(private $timeout:ng.ITimeoutService) {
        }

        public start = (now:Date = new Date()) => {
            console.log('ticker started', now);

            this.beginning = now;
            this.latest = now;
            this.data.tickCount = 0;

            this.$timeout(this.update, this.rate);
        };

        public update = (now:Date = new Date()) => {
            let ticks = Math.floor((now.getTime() - this.beginning.getTime()) / this.data.interval);
            let delta = ticks - this.data.tickCount;

            this.latest = now;
            this.data.tickCount = ticks;

            this.$timeout(this.update, this.rate);

            return delta;
        };
    }

    angular
        .module("incremental.ticker", [])
        .service("ticker", TickerService);
}
