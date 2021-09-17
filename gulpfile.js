let project_folder = "dist";
let source_folder = "#src";

let path = {
  build: {
    html: project_folder + "/",
    css: project_folder + "/css/",
    js: project_folder + "/js/",
    img: project_folder + "/img/",
    fonts: project_folder + "/fonts/",
  },
  src: {
    html: [source_folder + "/*.html", "!" + source_folder + "/_*.html"],
    css: source_folder + "/scss/style.scss",
    scss: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/script.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
    fonts: source_folder + "/fonts/*.ttf",
  },
  watch: {
    html: source_folder + "/**/*.html",
    css: source_folder + "/scss/**/*.scss",
    js: source_folder + "/js/**/*.js",
    img: source_folder + "/img/**/*.{jpg,png,svg,gif,ico,webp}",
  },
  clean: "./" + project_folder + "/"
}


let { src, dest } = require('gulp');
let gulp = require('gulp');
let browsersync = require("browser-sync").create();
let fileinclude = require("gulp-file-include");
let del = require("del");
let scss = require('gulp-sass')(require('sass'));
let group_media = require("gulp-group-css-media-queries");
let clean_css = require("gulp-clean-css");
let rename = require("gulp-rename");
let uglify = require("gulp-uglify-es").default;
let autoprefixer = require("gulp-autoprefixer");
let webp = require("gulp-webp");
let webphtml = require("gulp-webp-html");
let webpcss = require("gulp-webp-css");
var sourcemaps = require('gulp-sourcemaps');
let ttf2woff = require("gulp-ttf2woff");
let ttf2woff2 = require("gulp-ttf2woff2");

// let webp = require("gulp-webp");

function browserSync(params) {
  browsersync.init({
    server: {
      baseDir: "./" + project_folder + "/"
    },
    port: 3000,
    notify: false
  })
}

function html() {
  return src(path.src.html)
    .pipe(fileinclude())
    .pipe(webphtml())
    .pipe(dest(path.build.html))
    .pipe(browsersync.stream())
}

function css() {
  return src(path.src.css)
    .pipe(
      scss({ outputStyle: 'expanded' }).on('error', scss.logError)
    )
    .pipe(
      group_media()
    )
    .pipe(
      autoprefixer({
        overrideBrowserslist: ["last 5 versions"],
        cascade: true
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(clean_css())
    .pipe(
      rename({
        extname: ".min.css"
      })
    )
    .pipe(webpcss())
    .pipe(dest(path.build.css))
    .pipe(browsersync.stream())
}


function js() {
  return src(path.src.js)
    .pipe(fileinclude())
    .pipe(dest(path.build.js))
    .pipe(
      uglify()
    )
    .pipe(
      rename({
        extname: ".min.js"
      })
    )
    .pipe(dest(path.build.js))
    .pipe(browsersync.stream())
}

function images() {
  return src(path.src.img)
    .pipe(
      webp({
        quality: 70
      })
    )
    .pipe(dest(path.build.img))
    .pipe(src(path.src.img))
    .pipe(dest(path.build.img))
    .pipe(browsersync.stream())
}

function fonts() {
  return src(path.src.fonts)
    .pipe(ttf2woff2())
    .pipe(dest(path.build.fonts))
    .pipe(src(path.src.fonts))
    .pipe(ttf2woff())
    .pipe(dest(path.build.fonts))
}

function map() {
  return src(path.src.scss)
  .pipe(sourcemaps.init())
  .pipe(scss({ outputStyle: 'expanded' }).on('error', scss.logError)  )
  .pipe(sourcemaps.write('./'))
  .pipe(dest(path.build.css))
}

function watchFiles(param) {
  gulp.watch([path.watch.html], html);
  gulp.watch([path.watch.css], css);
  gulp.watch([path.watch.js], js);
  gulp.watch([path.watch.img], images);
}

function clean(param) {
  return del(path.clean);
}

let build = gulp.series(clean, gulp.parallel(js, css, html, images, map));
let watch = gulp.parallel(build, watchFiles, browserSync);

exports.fonts = fonts;
exports.images = images;
exports.js = js;
exports.css = css;
exports.htm = html;
exports.build = build;
exports.watch = watch;
exports.default = watch;