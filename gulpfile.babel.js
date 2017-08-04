import gulp from 'gulp';
import nodemon from 'gulp-nodemon';
import babel from 'gulp-babel';
import shell from 'gulp-shell';

gulp.task('nodemon', ['build'], () => {
  nodemon({
    script: 'build/index.js',
    ext: 'js',
    ignore: ['README.md', 'node_modules/**', '.DS_Store'],
    watch: ['server']
  });
});

gulp.task('build', () => gulp.src(['./server/**/*.js', '!./server/tests/**/*.js'])
  .pipe(babel({
    presets: ['es2015', 'stage-2']
  }))
  .pipe(gulp.dest('build')));

gulp.task('copyConfig', () => (
  gulp.src('server/**/*.json')
  .pipe(gulp.dest('build'))
));

gulp.task('default', ['copyConfig', 'nodemon'], () => gulp.watch('server/**/*.js', ['build']));

gulp.task('cleardb', shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate:undo:all',
]));

gulp.task('migrate', ['cleardb'], shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate',
]));

gulp.task('seed', ['migrate'], shell.task([
  'cross-env NODE_ENV=test sequelize db:seed:all',
]));

gulp.task('coverage', ['seed'], shell.task([
  'cross-env NODE_ENV=test nyc mocha ./server/tests/**/*.js',
]));

gulp.task('test', ['coverage']);
