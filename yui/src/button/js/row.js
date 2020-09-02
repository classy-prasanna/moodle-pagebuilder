

function Row() {

}

Row.prototype = {

	addtitle: 'Add Row',

	element_thumb: function() {
		return { id: 'row', icon: 'fa fa-list', title: 'Row' };
	},

	element_output: function() {
		return '<div class="element-row {{CSS_ATTR.ADDEDELEMENTCLASS}}" id="row" data-elementid="row">'+
					'<div class="row-bar col col-md-12">'+
						'<p class="bar-content">'+
							'<div class="left-options">'+
								'<ul class="column-counts" >'+
									'<li data-col="1"> 1 column </li>'+
									'<li data-col="2"> 2 column </li>'+
									'<li data-col="3"> 3 column </li>'+
									'<li data-col="4"> 4 column </li>'+
								'</ul>'+
							'</div>'+
							'<div class="right-options">{{ TEMPLATES.ELEMENT_DEFALT_OPTIONS }}</div>'+
						'</p>'+
						'<div class="row-elements">'+
							'<div class="row-contents"></div>'+
							'<div id="addelement">'+
								'<a href="javascript:void(0);" class="add-element-icon"> <i class="fa fa-plus"></i></a>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>';
	},

	element_event_register: function(element) {

	},


	form_fields: function() {
		return {
			tabs: [
				{
					name: 'general',
					title: 'General', //M.utill.get_string();
					fields: [
						{
							name: 'row_height',
							title: 'Row Height',
							type: 'select',
							default: '1',
							options: [
								{ value: 'default', title: 'Default from Theme Options' },
								{ value: 'auto', title: 'Equals the content height' },
								{ value: 'small', title: 'Small' },
								{ value: 'medium', title: 'Medium' },
								{ value: 'large', title: 'Large' },
								{ value: 'huge', title: 'Huge' },
								{ value: 'full', title: 'Full Screen' },
							]
						},
						{
							name: 'width',
							title: 'Full width content',
							type: 'checkbox',
							default: '0',
							options: [
								{ value: 1, title: 'Stretch content of this row to the screen width' }
							]

						},
						{
							name: 'bg_video',
							title: 'Background Video',
							type: 'text',
							default: '',
							placeholder: ''
						}
					]
				}
			]

		};
	}
};

