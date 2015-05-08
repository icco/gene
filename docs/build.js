
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var marked = require('marked');
var example = require('marked-example');
var moduleInfo = require('get-module-info');
var footer = require('page-footer');
var cssstats = require('cssstats');
var filesize = require('filesize');
var pkg = require('../package.json');

var renderer = new marked.Renderer();

renderer.heading = function (text, level) {
  var name = _.kebabCase(text);
  var result;
  if (level < 4) {
    result =
      '<h' + level + ' id="' + name + '">'+
        '<a href="#' + name + '">'+ text + '</a>'+
      '</h' + level + '>';
  } else {
    result = '<h' + level + '>' + text + '</h' + level + '>';
  }
  return result;
}

renderer.code = example({});

var tpl = _.template(fs.readFileSync(path.join(__dirname, './template.html'), 'utf8'));
var css = fs.readFileSync(path.join(__dirname, '../css/gray.min.css'), 'utf8');

pkg.title = _.capitalize(pkg.name);
pkg.stats = cssstats(css);

pkg.gzip = filesize(pkg.stats.gzipSize);

var modules = [
  'basscss-base-reset',
  'basscss-base-typography',
  'basscss-utility-layout',
  'basscss-utility-typography',
  'basscss-white-space',
  //'basscss-defaults',
];

pkg.modules = modules.map(function(m) {
  var obj = moduleInfo(m, {
    dirname: path.join(__dirname, '..'),
  });
  obj.content = marked(obj.readme, { renderer: renderer });
  return obj;
});

pkg.pfx = function(str) {
  return str.replace(/^basscss\-|^Basscss\-/, '');
};

pkg.footer = footer;

var html = tpl(pkg);

fs.writeFileSync(path.join(__dirname, '../index.html'), html);

