'use strict';

// based on 'gulp-lazysizes-srcset';

var through = require('through2');
var cheerio = require('cheerio');
var objectAssign = require('object-assign');

var reImageSrc = /^((?:(?:http|https):\/\/)?(?:.+))(\.(?:gif|png|jpg|jpeg))$/;

var defaultOptions = {
	decodeEntities: false,
	data_src: 'data-bg'
}
 
var lazyBgSetWebP = function(options){

	options = objectAssign({}, defaultOptions, options);

	return through.obj(function(file, enc, cb){
		if (file.isNull()){
			cb(null, file);
			return;
		}

		if (file.isStream()){
			cb(new gutil.PluginError('gulp-lazysizes-srcset', 'Streaming not supported'));
			return;
		}

		var content = file.contents.toString();

		var $ = cheerio.load( content, options );

		var imgList = $('[data-bg]');

		imgList.each(function(item){
			var _this = $(this);
			var _src = _this.attr(options.data_src);
			var tmpSrc = [];
			var match = _src.match(reImageSrc);

			// not a valid src attribute
			if (match === null){
				return true;
			}
		 
			let renameImage = _src.replace('.jpg', '.webp').replace('.png', '.webp').replace('.gif', '.webp').replace('.jpeg', '.webp');
			tmpSrc.push(renameImage +' [type: image/webp]');
			tmpSrc.push(_src);
			_this.removeAttr('data-bg').attr('data-bgset', tmpSrc.join(' | '));

		});

		file.contents = new Buffer( $.html() );

		cb(null, file);
	});
}


module.exports = lazyBgSetWebP;