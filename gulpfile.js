var gulp = require('gulp'); // 引入gulp插件
var concat = require('gulp-concat'); // 文件合并插件
var sass = require('gulp-sass'); // sass编辑插件
var rename = require('gulp-rename'); // 重命名插件
var uglify = require('gulp-uglify'); // 样式压缩插件
var minStyle = require('gulp-clean-css'); // 清除css插件
var imageMin = require('gulp-imagemin'); // 压缩图片插件
var spritesmith = require('gulp.spritesmith'); // 雪碧图插件


var paths = {
    sass: [
        'modules/**/*.scss'
    ]
};

// 预处理样式文件任务
gulp.task('sass', function () {
    return gulp.src(paths.sass)
        .pipe(sass({outputStyle: 'compact'}).on('error', sass.logError))
        .pipe(concat('all.css'))
        .pipe(minStyle())
        .pipe(rename('all.min.css'))
        .pipe(gulp.dest('./output/css'))
});

// 压缩图片任务
gulp.task('image', function () {
    return gulp.src('static/images/**/*.*')
        .pipe(imageMin({progressive: true}))
        .pipe(gulp.dest('./output/images'))
});

// 生成雪碧图任务
gulp.task('sprite', function () {
    return gulp.src('static/images/*.png') // 需要合并的图片地址
        .pipe(spritesmith({
            imgName: 'images/sprite.png', // 保存合并后图片的地址
            cssName: 'css/all.min.css', // 保存合并后对于css样式的地址
            padding: 10, // 合并时两个图片的间距
            algorithm: 'binary-tree',
            cssTemplate: function (data) {
                var arr = [];
                data.sprites.forEach(function (sprite) {
                    arr.push(".icon-" + sprite.name +
                        "{" +
                        "background-image: url('" + sprite.escaped_image + "');" +
                        "background-position: " + sprite.px.offset_x + "px " + sprite.px.offset_y + "px;" +
                        "width:" + sprite.px.width + ";" +
                        "height:" + sprite.px.height + ";" +
                        "}\n");
                });
                return arr.join("");
            }
        }))
        .pipe(gulp.dest('./output'))
});

gulp.task('sass-watch', function () {
    gulp.watch('./modules/**/*.scss', ['sass']);
    // gulp.watch('static/images/*.png', ['sprite']);
});

gulp.task('default', ['sprite'], function () {
    console.log('运行成功');
});