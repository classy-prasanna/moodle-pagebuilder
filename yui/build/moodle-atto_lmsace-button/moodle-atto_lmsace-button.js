YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {


var component = 'atto_lmsace',

row_visual = '<div class="visual-content"> Plus test</div> ',

// plugins =  Row.prototype.get(),
ELEMENTS = [],

THUMB = [],

vishualLayout = '<div id="lmsbuilder-visual" >'+
					'<div class="visual-tab">'+
						'<div id="addelement">'+
							'<a href="javascript:void(0);" class="add-element-icon"> <i class="fa fa-plus"></i></a>'+
						'</div>'+
					'</div>'+
				'</div>';

builder;

Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
	

	initializer: function() {
		
		this.addButton({

            title: 'pluginname',
            icon: 'i/addblock',
            // Watch the following tags and add/remove highlighting as appropriate:
            callback: this.show_builder
        });
	},

	show_builder: function() {		
		builder = this.getDialogue({
			headerContent: 'LMSACE Builder', // M.util.get_string('builderheading', component).
			width: '80%',
			bodyContent: this.build_dialogue_body()
		});

		builder.show();
	},

	build_dialogue_body: function() {

		var elements = this.get('elements');
		for (let i=0; i < elements.length; i++ ) {
			var element = elements[i];
			console.log(element);
			var elem_obj = new Y.Base.mix(Y.M.atto_lmsace.Button, [eval(element)]);
			THUMB.push({
				'name': element, 
				'thumb': elem_obj.prototype.element()
			});
			ELEMENTS[element] = elem_obj
		}		
		
		return 
	}	

}, {
	ATTRS: {

		elements: {
			value: null
		}
	}
});

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



function Column() {

}

Column.prototype = {

	element: function() {
		return '<i class="fa fa-mins"></i>';
	},

	thumb_output: function() {
		return 'Column output';
	},

	form_fields: function() {
		return [];
	}
};



}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
