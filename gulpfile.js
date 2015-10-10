var del = require('del');
var gulp = require('gulp');
var gulp_angular_filesort = require('gulp-angular-filesort');
var gulp_bower = require('gulp-bower');
var gulp_changed = require('gulp-changed');
var gulp_gh_pages = require('gulp-gh-pages');
var gulp_inject = require('gulp-inject');
var gulp_filter = require("gulp-filter");
var gulp_spawn_mocha = require('gulp-spawn-mocha');
var gulp_tsd = require('gulp-tsd');
var gulp_tslint = require('gulp-tslint');
var gulp_typescript = require('gulp-typescript');
var gulp_util = require('gulp-util');
var gulp_nodemon = require('gulp-nodemon');
var main_bower_files = require('main-bower-files');

var configs = {
    inject : {
        angular: {
            name: 'angular',
            ignorePath: 'app/'
        },
        bower: {
            name: 'bower'
        }
    },

    mocha: {},

    tsd: {
        command: 'reinstall',
        config: 'tsd.json'
    },

    tslint: {
        configuration: __dirname + '/tslint.json',
        emitError: true,
        reportLimit: 3
    },

    typescript: {
        noImplicitAny: true,
        noEmitOnError: true,
        module: 'commonjs',
        target: 'ES5'
    },

    watcher: {
        interval: 1000
    }
};

var locations = {
    sources: "src/**/*",

    output: "app",
    test: "app/**/*.spec.js",
    deploy: "app/**/*",
    start: "app/app.js",
    bower: "app/bower_components",

    inject: {
        dest: 'app',
        src: 'app/index.html',
        angular: ['app/**/*.js', '!app/app.js', '!app/**/*.spec.js', '!app/bower_components/**/*']
    },

    filters: {
        copy: ['**/*.{html,css}'],
        typescript: ['**/*.ts', '!**/*.spec.ts'],
        typescriptTests: ['**/*.spec.ts']
    },

    watch: {
        restart: ["app/**/*"]
    }
};

////////
// Clean
////////

gulp.task('clean', ['clean:app', 'clean:deploy'], function() {});

gulp.task('purge', ['clean:app', 'clean:deploy', 'clean:tsd'], function() {});

gulp.task('clean:app', function(callback) {
    del(['app/*'], callback);
});

gulp.task('clean:deploy', function(callback) {
    del(['.publish/*'], callback);
});

gulp.task('clean:tsd', function (callback) {
    del(['typings/*'], callback);
});

////////
// Watch
////////

gulp.task('watch', ['build'], function() {
    return gulp.watch(locations.sources, configs.watcher, ['build'])
        .on('change', function (event) {
            gulp_util.log("[" + gulp_util.colors.cyan("watch") + "]", 'File ' + event.path + ' was ' + event.type);
        });
});

////////
// Build
////////

gulp.task('build', ['build:app'], function() {});

gulp.task('build:app', ['build:app:typescript', 'build:app:copy', 'build:app:inject'], function() {});

gulp.task('build:app:copy', function() {
    var copyFilter = gulp_filter(locations.filters.copy);

    return gulp.src(locations.sources)
        .pipe(copyFilter)
        .pipe(gulp_changed(locations.output))
        .pipe(gulp.dest(locations.output));
});

var tsProject = gulp_typescript.createProject(configs.typescript);

gulp.task('build:app:typescript', ['build:tsd'], function (callback) {
    var tsFilter = gulp_filter(locations.filters.typescript); // non-test TypeScript files

    var errors = null;
    var tsResult = gulp.src(locations.sources)
        .pipe(gulp_changed(locations.output, {extension: '.js'}))
        .pipe(tsFilter)
        .pipe(gulp_typescript(tsProject))
        .on('error', function(e) {
            errors = e;
        })
        .on('end', function() {
            if (errors) {
                callback(errors);
            }
        });

    tsResult.js.pipe(gulp.dest(locations.output))
        .on('end', function() {
            if (!errors) {
                callback();
            }
        });
});

gulp.task('build:test', ['build:test:typescript'], function() {});

gulp.task('build:test:typescript', ['build:tsd', 'build:app'], function (callback) {
    var tsTestFilter = gulp_filter(locations.filters.typescriptTests);

    var errors = null;
    var tsResult = gulp.src(locations.sources)
        .pipe(gulp_changed(locations.output))
        .pipe(tsTestFilter)
        .pipe(gulp_typescript(configs.typescript))
        .on('error', function(e) {
            errors = e;
        })
        .on('end', function() {
            if (errors) {
                callback(errors);
            }
        });

    tsResult.js.pipe(gulp.dest(locations.output))
        .on('end', function() {
            if (!errors) {
                callback();
            }
        });
});

gulp.task('build:bower', function () {
    return gulp_bower().pipe(gulp.dest(locations.bower));
});

gulp.task('build:tsd', function (callback) {
    return gulp_tsd(configs.tsd, callback);
});

gulp.task('build:app:inject', ['build:app:inject:angular', 'build:app:inject:bower'], function() {});

gulp.task('build:app:inject:angular', ['build:app:copy', 'build:app:typescript'], function() {
    return gulp.src(locations.inject.src)
        .pipe(gulp_inject(gulp.src(locations.inject.angular).pipe(gulp_angular_filesort()), configs.inject.angular))
        .pipe(gulp.dest(locations.inject.dest));
});

gulp.task('build:app:inject:bower', ['build:bower', 'build:app:copy'], function() {
    return gulp.src(locations.inject.src)
        .pipe(gulp_inject(gulp.src(main_bower_files(), {read: false}), configs.inject.bower))
        .pipe(gulp.dest(locations.inject.dest));
});

///////
// Lint
///////

gulp.task('lint', ['lint:typescript'], function () {});

gulp.task('lint:typescript', ['build:app'], function () {
    var tsFilter = gulp_filter(locations.filters.typescript);

    return gulp.src(locations.sources)
        .pipe(tsFilter)
        .pipe(gulp_tslint(configs.tslint))
        .pipe(gulp_tslint.report('prose'));
});

//////
// Run
//////

gulp.task('start', ['start:app'], function() {});

gulp.task('start:app', ['build'], function() {
    gulp_nodemon({
        script: locations.start,
        env: {
            NODE_ENV: process.env.NODE_ENV
        },
        watch: locations.watch.restart,
        verbose: true
    });
});

/////////
// Deploy
/////////

gulp.task('deploy', ['deploy:ghpages'], function() {});

gulp.task('deploy:ghpages', ['build', 'test', 'lint'], function() {
    return gulp.src(locations.deploy)
        .pipe(gulp_gh_pages());
});

///////
// Test
///////

gulp.task('test', ['test:run'], function() {});

gulp.task('test:run', ['build', 'build:test'], function() {
    return gulp.src([locations.test])
        .pipe(gulp_spawn_mocha(configs.mocha));
});
