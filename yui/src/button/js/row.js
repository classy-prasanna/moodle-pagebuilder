

function Row() {

}

Row.prototype = {

	element: function() {
		return '<i class="fa fa-plus"></i>';
	},

	thumb_output: function() {
		return 'row Thumb';
	},

	form_fields: function() {
		return [];
	}
};

