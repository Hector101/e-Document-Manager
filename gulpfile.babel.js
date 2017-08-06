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

gulp.task('dev', ['nodemon'], () => gulp.watch('server/**/*.js', ['build']));

gulp.task('build', () => gulp.src(['./server/**/*.js', '!./server/tests/**/*.js'])
  .pipe(babel({
    presets: ['es2015', 'stage-2']
  }))
  .pipe(gulp.dest('build')));

gulp.task('start', ['build'], shell.task([
  'cross-env NODE_ENV=production node ./build/',
]));

gulp.task('cleardb', shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate:undo:all',
]));

gulp.task('migrate', ['cleardb'], shell.task([
  'cross-env NODE_ENV=test sequelize db:migrate',
]));

gulp.task('seed', ['migrate'], shell.task([
  'cross-env NODE_ENV=test sequelize db:seed:all',
]));

gulp.task('coverage', shell.task([
  'NODE_ENV=test nyc mocha ./server/tests/**/*.js --timeout 20000',
]));

gulp.task('test', ['coverage']);

gulp.task('cleardb-dev', shell.task([
  'cross-env NODE_ENV=delelopment sequelize db:migrate:undo:all',
]));

gulp.task('migrate-dev', ['cleardb-dev'], shell.task([
  'cross-env NODE_ENV=delelopment sequelize db:migrate',
]));

gulp.task('seed-dev', ['migrate-dev'], shell.task([
  'cross-env NODE_ENV=delelopment sequelize db:seed:all',
]));
