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
    .sass('resources/sass/app.scss', 'public/css');
