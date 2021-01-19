

function Column() {

}

Column.prototype = {


	element_thumb: function() {
		return {id: 'column', icon: 'fa fa-columns', title: 'Column'};
	},

	element_output: function() {
		return "";
	},

	element_event_register: function() {

	},

	thumb_output: function() {
		return '<div class="column-thumb {{CSS_ATTR.ELEMENTTHUMB}}">' +
			'<div class="img-block">' +
				'<i class="fa fa-column"></i>' +
			'</div>' +
			'<div class="element-title">' +
				'<span>Column</span>' +
			'</div>' +
		'</div>';
	},

	form_fields: function() {
		return [];
	}
};

