var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var concat = require('gulp-concat');
var clean = require('gulp-clean');
var nodemon = require('gulp-nodemon');
var usemin = require('gulp-usemin');
var es = require("event-stream");

gulp.task('clean', function() {
	return gulp.src(['./build'], {
			read: false
		})
		.pipe(clean());
});

gulp.task('build', [],function() {
	return es.merge(
			gulp.src('src/ecs/**/*.js'),
			gulp.src('src/client/**/*.js'),
			gulp.src('src/client/**/*.html')
				.pipe(templateCache('eternal-conflict' + '.tpl.js', {
					root: '',
					module: 'eternal-conflict' ,
					standalone: false
				}))
  			
		)
		.pipe(concat('eternal-conflict.js'))
		.pipe(gulp.dest('build/'));
});

gulp.task('index',['build'],function(){
	return 	gulp.src('index.html')
			.pipe(usemin({
				css: [/*minifyCss(),*/ 'concat'],
				html: [ /*minifyHtml({empty: true})*/ ],
				js: [ /*uglify(),rev()*/ ]
			})).pipe(gulp.dest('build/'));
});
	
gulp.task('default', ['index','watch'],function () {
  return nodemon({ script: 'src/server/server.js', ext: 'html js', ignore: ['ignored.js'] });
    
});
	
/*
gulp.task('reload', ['build'], function() {
	gulp.src(['./index.html','./build/eternal-conflict.js']).pipe(connect.reload());
});
*/
gulp.task('watch', function() {
	gulp.watch(['./index.html', './src/**/*'], ['index']);

});

