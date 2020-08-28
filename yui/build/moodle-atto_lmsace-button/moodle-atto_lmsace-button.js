YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {


var component = 'atto_lmsace',

row_visual = '<div class="visual-content"> Plus test</div> ',

// plugins =  Row.prototype.get(),
ELEMENTS = [],

THUMB = [],

elements_list_output = '',

CSS_ATTR = {
	ELEMENTTHUMB: 'element-thumb-parent',
	// ELEMENTTHUMBTITLE: 'element-thumb-title',
},

SELECTORS = {
	ADDELEMENT: '#addelement a',
	ELEMENTTHUMB: '.' + CSS_ATTR.ELEMENTTHUMB,
},

visualLayout = '<div id="lmsbuilder-visual" >'+
					'<div class="visual-tab">'+
						'<div id="addelement">'+
							'<a href="javascript:void(0);" class="add-element-icon"> <i class="fa fa-plus"></i></a>'+
						'</div>'+
					'</div>'+
				'</div>',

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
		this._dialogue = null;
		var builder = this.getDialogue({
			headerContent: 'LMSACE Builder', // M.util.get_string('builderheading', component).
			width: '80%',
			bodyContent: this.build_dialogue_body()
		}, true);

		builder.show();
	},

	build_dialogue_body: function() {
		var funcobj = this;
		var elements = this.get('elements');
		for (let i=0; i < elements.length; i++ ) {
			var element = elements[i];
			console.log(element);
			var elem_obj = new Y.Base.mix(Y.M.atto_lmsace.Button, [eval(element)]);
			THUMB.push({
				'name': element,
				'thumb': elem_obj.prototype.thumb_output()
			});
			ELEMENTS[element] = elem_obj
		}
		var init_template = Y.Handlebars.compile(visualLayout);
		var visual_output = Y.Node.create(init_template());

		visual_output.all(SELECTORS.ADDELEMENT).on('click', function() {
			funcobj._display_elements_list();
		}, funcobj);

		return visual_output;
	},

	_display_elements_list: function() {
		var this_obj = this;
		elements_list_output = '';
		THUMB.forEach( element => {
			elements_list_output += element.thumb
		});
		// alert();
		this._dialogue = null; // Make previous dialogue null to open new one.
		// this._show_elements_dialogue(elements_list);
		var elements_dialogue = this.getDialogue({
			headerContent: 'Elements list', // M.util.get_string('builderheading', component).
			width: '50%',
			bodyContent: elements_list_output,
		});
		/*var elements_dialogue = new M.core.dialogue({
			headerContent: 'Elements list', // M.util.get_string('builderheading', component).
			width: '50%',
			bodyContent: "elements_list_output",
			visible: false,
			modal: true,
			close: true,
			draggable: true
		});*/
		console.log(elements_dialogue);
		elements_dialogue.show();
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



}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
