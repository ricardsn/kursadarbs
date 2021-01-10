const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/vendor/app.js','public/js/vendor')
    .js('resources/js/water-map.js', 'public/js')
    .js('resources/js/map/create-map.js', 'public/js/map')
    .js('resources/js/map/edit-map.js', 'public/js/map')
    .js('resources/js/map/single-map.js', 'public/js/map')
    .js('resources/js/forum/comments', 'public/js/forum')
    .js('resources/js/forum/fish-listing', 'public/js/forum')
    .js('resources/js/fish/uploader', 'public/js/fish')
    .js('resources/js/fish/edit', 'public/js/fish')
    .js('resources/js/profile/edit', 'public/js/profile')
    .sass('resources/sass/app.scss', 'public/css');
