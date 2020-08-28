

function Row() {

}

Row.prototype = {

	element: function() {
		return '<i class="fa fa-plus"></i>';
	},

	thumb_output: function() {
		return '<div class="column-thumb {{CSS_CLASS.ELEMENTTHUMB}}">'+
			'<div class="img-block">'+
				'<i class="fa fa-row"></i>'+
			'</div>'+
			'<div class="element-title">'+
				'<span class="{{elementthumbtitle}}">Row</span>'+
			'</div>'+
		'</div>';
	},

	form_fields: function() {
		return [];
	}
};

