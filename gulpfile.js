var gulp = require('gulp');
var exec = require('child_process').exec;

gulp.task('default', function() {
    exec('ng serve --disable-host-check');
});


gulp.task('build', function() {
    exec('ng build --prod --base-href /panel/');
});