YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {

	var COMPONENT = 'atto_lmsace',

	row_visual = '<div class="visual-content"> Plus test</div> ',

	// plugins =  Row.prototype.get(),
	ELEMENTS = [],

	THUMBLIST = Y.Node.create('<div class="elements-list-parent"> </div>'),

	elements_list_output = '',

	ELEMENTS_DIALOGUE = null,

	visual_output = '', // Compiled visual output template.

	THIS = null,

	CSS_ATTR = {
		ELEMENTTHUMB: 'element-thumb-parent',
		ELEMENTADDED: 'added-element',
	},

	SELECTORS = {
		ADDELEMENT: '#addelement a',
		ELEMENTTHUMB: '.' + CSS_ATTR.ELEMENTTHUMB,
		ELEMENTADDED: '#' + CSS_ATTR.ELEMENTADDED,
	},

	TEMPLATES = {

		THUMBBOX: '<div class="element-thumb {{CSS_ATTR.ELEMENTTHUMB}}" data-elementid="{{DATA.id}}">'+
						'<div class="img-block">'+
							'<i class="{{DATA.icon}}"></i>'+
						'</div>'+
						'<div class="element-title">'+
							'<span>{{DATA.title}}</span>'+
						'</div>'+
					'</div>',
		VISUALLAYOUT: '<div id="lmsbuilder-visual" >'+
					'<div class="visual-tab">'+
						'<div class="elements-list" id="{{CSS_ATTR.ELEMENTADDED}}" >' +
						'</div>' +
						'<div id="addelement">'+
							'<a href="javascript:void(0);" class="add-element-icon"> <i class="fa fa-plus"></i></a>'+
						'</div>'+
					'</div>'+
				'</div>',

		FORM: '<div class="lmsace-builder-form element-add-form">'+
					'<ul class="nav nav-tabs" id="lmsace-builder-tabs">'+
					'{{#tabs}}'+
						'<li class="nav-item">'+
							'<a class="nav-link active" id="{{name}}-tab" data-toggle="tab" href="#{{name}}" role="tab" aria-controls="{{name}}" aria-selected="true">{{title}}</a>'+
						'</li>'+
					'{{/tabs}}'+
					'</ul>'+

					'<div class="tab-content" id="lmsace-builder-tabs">'+
						'{{#tabs}}'+
						'<div class="tab-pane fade" id="{{name}}" role="tabpanel" aria-labelledby="{{name}}-tab">'+
							'{{#fields}}'+
								'{{> this.type }}'+
							'{{/fields}}'+
						'</div>'+
						'{{/tabs}}'+
					'</div>'+
				'</div>',

		FORM_FIELDS: {

			TEXT: '<div class="lmsace_builder_field form-field-text">'+
							'<label for="{{name}}">{{title}}</label>'+
							'<input type="text" name="{{name}}" id="{{name}}" placeholder="" value="{{default}}" >'+
						'</div>',

			SELECT: '<div class="lmsace_builder_field form-field-select">'+
							'<label for="{{name}}">{{title}}</label>'+
							'<select name="{{name}}" id="{{name}}" class="form-control" >'+
								'{{#options}}'+
									'<option value="{{value}}" > {{title}} </option>'+
								'{{/options}}'+
							'</select>'+
						'</div>',
			CHECKBOX: '<div class="lmsace_builder_field form-field-checkbox">'+
								'<label for="{{name}}">{{title}}</label>'+
								'{{#options}}'+
									'<input type="checkbox" name="{{name}}" value="{{options.value}}"  > <label> {{options.title}}</label>'+
								'{{/options}}'+
							'</div>',

		}
	},



	builder;

	Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {


		initializer: function() {

			this.addButton({

				title: 'pluginname',
				icon: 'i/addblock',
				// Watch the following tags and add/remove highlighting as appropriate:
				callback: this.show_builder
			});

			THIS = this;
		},

		show_builder: function() {
			this._dialogue = null;
			var builder = this.getDialogue({
				headerContent: 'LMSACE Builder', // M.util.get_string('builderheading', component).
				width: '80%',
				bodyContent: this.build_dialogue_body()
			}, true);

			builder.show();
			this._registerformfields();

		},

		build_dialogue_body: function() {
			var funcobj = this;

			visual_output = funcobj._rendertemplate(TEMPLATES.VISUALLAYOUT);

			visual_output.all(SELECTORS.ADDELEMENT).on('click', function() {
				funcobj._display_elements_list();
			}, funcobj);

			return visual_output;
		},

		_rendertemplate: function(html, option=null) {
			var template = Y.Handlebars.compile(html);
			config = Y.merge({
				CSS_ATTR:CSS_ATTR,
				SELECTORS: SELECTORS,
				COMPONENT: COMPONENT
			}, option)
			var output = Y.Node.create(
				template(config)
			);
			// console.log(output);
			return output;
		},

		// Append selected element into visual output list.
		_register_editevent: function() {
			// one("[data-elementid=" + elem_obj.element_thumb().id + "]");
			THUMBLIST.all(SELECTORS.ELEMENTTHUMB).each(function(thumb) {
				// console.log(thumb);
				thumb.on('click', function(e) {
					e.preventDefault();
					// alert(this);
					var id = this.getAttribute('data-elementid');
					var elem_obj = ELEMENTS[id];
					console.log( elem_obj );
					console.log( elem_obj.form_fields() );
					THIS._add_selected_element( elem_obj );
				})
			})
		},

		_registerformfields: function() {
			console.log(TEMPLATES.FORM_FIELDS);
			for ( var key in TEMPLATES.FORM_FIELDS) {
				field = TEMPLATES.FORM_FIELDS[key];
				Y.Handlebars.registerPartial(key, field);
			}
		},

		/**
		 * Add selected element into builder and change the dialogue content with element fields.
		 * @param {Node} element_template
		 * @param {element class object} elem_obj
		 */
		_add_selected_element: function( elem_obj ) {
			visual_output.one(SELECTORS.ELEMENTADDED).append( THIS._rendertemplate( elem_obj.element_output() ) );
			console.log( elem_obj.form_fields() );
			var formfields = THIS._rendertemplate( TEMPLATES.FORM, elem_obj.form_fields() );
			ELEMENTS_DIALOGUE.hide();
			this._update_dialogue_content(elem_obj.addtitle, formfields);
		},

		/**
		 * Update the dialogue body content.
		 */
		_update_dialogue_content: function(title, bodycontent, width=50) {
			this._dialogue = null;
			var dialoguecontent = this.getDialogue({
				headerContent: title, // M.util.get_string('builderheading', component).
				width:'50%',
				bodyContent: bodycontent
			});
			dialoguecontent.show();
			return dialoguecontent;
		},


		_display_elements_list: function() {
			var this_obj = this;
			elements_list_output = [];
			var avail_elements = this.get('elements');
			if (Object.keys(ELEMENTS).length <= 0 ) {
				for (let i=0; i < avail_elements.length; i++ ) {
					var element = avail_elements[i];
					// var elem_obj = new Y.Base.mix(Y.M.atto_lmsace.Button, [eval(element)]);
					var elem_obj = eval(element);
					var element_thumb = { DATA: elem_obj.prototype.element_thumb() };
					var elementtemplate = this_obj._rendertemplate( TEMPLATES.THUMBBOX, element_thumb );
					// Register default element events.
					// console.log( elem_obj.prototype.form_fields() );
					// this_obj._register_editevent( elementtemplate );
					// Register elements extra events.
					elem_obj.prototype.element_event_register( elementtemplate );
					THUMBLIST.append( elementtemplate );
					ELEMENTS[ element.toLowerCase() ] = elem_obj.prototype;
					console.log(ELEMENTS);
				}
				// console.log(ELEMENTS[row]);
				this_obj._register_editevent();
			}


			// alert();
			this._dialogue = null; // Make previous dialogue null to open new one.
			// this._show_elements_dialogue(elements_list);
			ELEMENTS_DIALOGUE = this.getDialogue({
				headerContent: 'Elements list', // M.util.get_string('builderheading', component).
				width: '50%',
				bodyContent: THUMBLIST
			});
			// elements_dialogue.set('bodyContent', THUMBLIST);
			/*var elements_dialogue = new M.core.dialogue({
				headerContent: 'Elements list', // M.util.get_string('builderheading', component).
				width: '50%',
				bodyContent: "elements_list_output",
				visible: false,
				modal: true,
				close: true,
				draggable: true
			});*/
			// console.log(elements_dialogue);
			ELEMENTS_DIALOGUE.show();
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



function Column() {

}

Column.prototype = {



	element_thumb: function() {
		return {id: 'column', icon: 'fa fa-columns', title: 'Column'};
	},

	element_output: function() {

	},

	element_event_register: function() {

	},

	thumb_output: function() {
		return '<div class="column-thumb {{CSS_ATTR.ELEMENTTHUMB}}">'+
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
