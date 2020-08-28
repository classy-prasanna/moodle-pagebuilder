

function Column() {

}

Column.prototype = {

	element: function() {
		return '<i class="fa fa-mins"></i>';
	},

	thumb_output: function() {
		return '<div class="column-thumb {{CSS_CLASS.ELEMENTTHUMB}}">'+
			'<div class="img-block">'+
				'<i class="fa fa-column"></i>'+
			'</div>'+
			'<div class="element-title">'+
				'<span>Column</span>'+
			'</div>'+
		'</div>';
	},

	form_fields: function() {
		return [];
	}
};

