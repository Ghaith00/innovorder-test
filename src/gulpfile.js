const gulp 			= require('gulp');
const clean 		= require('gulp-clean');
const concat 		= require('gulp-concat');
const ngdocs 		= require('gulp-ngdocs');
const uglify 		= require('gulp-uglify-es').default;
const download 		= require("gulp-download");
const runSequence 	= require('run-sequence');
const gutil			= require('gulp-util');

const buildDir 		= 'bin/';
const remoteDepsJS 	= [
						'https://use.fontawesome.com/96f065634a.js',
						'https://code.jquery.com/jquery-3.2.1.slim.min.js',
						'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
						'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
						'https://ajax.googleapis.com/ajax/libs/angularjs/1.6.7/angular.min.js',
						'https://unpkg.com/@uirouter/angularjs/release/angular-ui-router.min.js',
						'https://cdn.rawgit.com/AngularClass/angular-websocket/v2.0.0/dist/angular-websocket.min.js'
					];
const depsJS        = [
						'public/vendor/96f065634a.js',
						'public/vendor/jquery-3.2.1.slim.min.js',
						'public/vendor/popper.min.js',
						'public/vendor/bootstrap.min.js',
						'public/vendor/angular.min.js',
						'public/vendor/angular-ui-router.min.js',
						'public/vendor/angular-websocket.min.js'
					];
const appJS 		= [
						'public/app.js',
						'public/controllers/order.js',
						'public/controllers/schedule.js',
					];

					
/** tasks **/
gulp.task('remoteDeps', () => {
	return download(remoteDepsJS)
			.pipe(gulp.dest('./public/vendor/'));
})
gulp.task('devDeps', () => {

	let depsjs = gulp.src(depsJS);

	return depsjs
			.pipe(concat('mcuDeps.min.js'))
			.pipe(uglify())
			.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
			.pipe(gulp.dest('./public/build/'));
});
gulp.task('appJs', () => {
	
	let appjs = gulp.src(appJS);

	return appjs
			.pipe(concat('mcu.min.js'))
			.pipe(uglify({ mangle: false }))
			.on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
			.pipe(gulp.dest('./public/build/'));
});

/** css tasks **/ 
gulp.task('remoteCss', () => {
	return download('https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css')
			.pipe(gulp.dest('./public/vendor/'));
})
gulp.task('devCSS', () => {
	return gulp.src([
				'public/vendor/bootstrap.min.css',
				'public/stylesheets/styles.css'
			])
			.pipe(concat('mcu.min.css'))
			.pipe(gulp.dest('./public/build/css/'));
});
gulp.task('buildStyles', (callback) => {
	runSequence('remoteCss', 'devCSS', callback);
});

/** initialize */
gulp.task('default', (callback) => {
	runSequence('remoteDeps', 'devDeps', 'appJs', 'buildStyles', callback);
});