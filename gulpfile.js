var del = require('del');
var gulp = require('gulp');
var gulp_filter = require("gulp-filter");
var gulp_spawn_mocha = require('gulp-spawn-mocha');
var gulp_tsd = require('gulp-tsd');
var gulp_typescript = require('gulp-typescript');
var run_sequence = require('run-sequence');

var configs = {
    mocha: {},

    tsd: {
        command: 'reinstall',
        config: 'tsd.json'
    },

    typescript: {
        noImplicitAny: true,
        noEmitOnError: true,
        module: 'commonjs',
        target: 'ES5'
    }
};

var locations = {
    sources: "src/**",
    output: "app",
    tests: "app/**/*.spec.js"
};

gulp.task('clean', function(callback) {
    del(['app/*'], callback);
});

gulp.task('build', function(callback) {
    run_sequence('typescript:app', 'build:copy', callback);
});

gulp.task('build:copy', function() {
    var copyFilter = gulp_filter(['**/*.{html,css}']);

    return gulp.src(locations.sources)
        .pipe(copyFilter)
        .pipe(gulp.dest(locations.output));
});

gulp.task('purge', function(callback) {
    run_sequence('clean', 'tsd:uninstall', callback);
});

gulp.task('tsd:install', function (callback) {
    gulp_tsd(configs.tsd, callback);
});

gulp.task('tsd:uninstall', function (callback) {
    del(['typings/*'], callback);
});

gulp.task('test', function(callback) {
    run_sequence('tsd:install', 'typescript:app', 'typescript:tests', 'tests:run', callback);
});

gulp.task('tests:run', function() {
    return gulp.src([locations.tests])
        .pipe(gulp_spawn_mocha(configs.mocha));
});

gulp.task('typescript:app', function () {
    var tsFilter = gulp_filter(['**/*.ts', '!**/*.spec.ts']); // non-test TypeScript files

    var errors = false;
    var tsResult = gulp.src(locations.sources)
        .pipe(tsFilter)
        .pipe(gulp_typescript(configs.typescript))
        .on('error', function() {
            errors = true;
        })
        .on('end', function() {
            if (errors) {
                process.exit(1);
            }
        });

    return tsResult.js.pipe(gulp.dest(locations.output));
});

gulp.task('typescript:tests', function () {
    var tsTestsFilter = gulp_filter('**/*.spec.ts');

    var errors = false;
    var tsResult = gulp.src(locations.sources)
        .pipe(tsTestsFilter)
        .pipe(gulp_typescript(configs.typescript))
        .on('error', function() {
            errors = true;
        })
        .on('end', function() {
            if (errors) {
                process.exit(1);
            }
        });

    return tsResult.js.pipe(gulp.dest(locations.output));
});
