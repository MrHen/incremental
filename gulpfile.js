var del = require('del');
var gulp = require('gulp');
var gulp_bower = require('gulp-bower');
var gulp_gh_pages = require('gulp-gh-pages');
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
    test: "app/**/*.spec.js",
    deploy: "app/**/*"
};

////////
// CLEAN
////////

gulp.task('clean', function(callback) {
    run_sequence('clean:app', callback);
});

gulp.task('purge', function(callback) {
    run_sequence('clean:app', 'clean:tsd', callback);
});

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
// Build
////////

gulp.task('build', function(callback) {
    run_sequence('build:app', callback);
});

gulp.task('build:app', ['build:tsd', 'build:bower'], function(callback) {
    run_sequence('build:app:typescript', 'build:app:copy', callback);
});

gulp.task('build:app:copy', function() {
    var copyFilter = gulp_filter(['**/*.{html,css}']);

    return gulp.src(locations.sources)
        .pipe(copyFilter)
        .pipe(gulp.dest(locations.output));
});

gulp.task('build:app:typescript', function () {
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

gulp.task('build:test', ['build:tsd', 'build:app'], function(callback) {
    run_sequence('build:test:typescript', callback);
});

gulp.task('build:test:typescript', function () {
    var tsTestFilter = gulp_filter('**/*.spec.ts');

    var errors = false;
    var tsResult = gulp.src(locations.sources)
        .pipe(tsTestFilter)
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

gulp.task('build:bower', function () {
    return gulp_bower();
});

gulp.task('build:tsd', function (callback) {
    return gulp_tsd(configs.tsd, callback);
});

/////////
// Deploy
/////////

gulp.task('deploy', function(callback) {
    run_sequence('deploy:ghpages', callback);
});

gulp.task('deploy:ghpages', ['build:app', 'test:run'], function() {
    return gulp.src(locations.deploy)
        .pipe(gulp_gh_pages());
});

///////
// Test
///////

gulp.task('test', function(callback) {
    run_sequence('test:run', callback);
});

gulp.task('test:run', ['build:app', 'build:test'], function() {
    return gulp.src([locations.test])
        .pipe(gulp_spawn_mocha(configs.mocha));
});
