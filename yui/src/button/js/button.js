	var COMPONENT = 'atto_lmsace',

	row_visual = '<div class="visual-content"> Plus test</div> ',

	// plugins =  Row.prototype.get(),
	ELEMENTS = [],

	THUMBLIST = Y.Node.create('<div class="elements-list-parent"> </div>'),

	elements_list_output = '',

	ELEMENTS_DIALOGUE = null,

	visual_output = '', // Compiled visual output template.

	THIS = null,

	CODEKEY = 'LMSACE', // sHORTCODE KEY.

	CSS_ATTR = {
		ELEMENTTHUMB: 'element-thumb-parent',
		ELEMENTADDED: 'added-element',
		TABCONTENT: 'tab-content',
		ELEMENTFORM: 'lmsaceElementForm',
		CODESLIST: 'codes-list',
		BUTTONSAVE: 'button-save'
	},

	SELECTORS = {
		ADDELEMENT: '#addelement a',
		ELEMENTTHUMB: '.' + CSS_ATTR.ELEMENTTHUMB,
		ELEMENTADDED: '#' + CSS_ATTR.ELEMENTADDED,
		TABCONTENT: '.' + CSS_ATTR.TABCONTENT,
		ELEMENTFORM: '#' + CSS_ATTR.ELEMENTFORM,
		CODESLIST: '#' + CSS_ATTR.CODESLIST,
		BUTTONSAVE: '#' + CSS_ATTR.BUTTONSAVE,
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
					'<div class="code-tab" > '+
						'<div class="codes-list" id="{{CSS_ATTR.CODESLIST}}" >' +

						'</div>' +
					'</div>' +
				'</div>',

		FORM: '<div class="lmsace-builder-form element-add-form">'+
				'<div class="form-parent-wrapper"> ' +
					'<form class="lmsace-element-form" id="{{CSS_ATTR.ELEMENTFORM}}" >'+
						'<ul class="nav nav-tabs" id="lmsace-builder-tabs">'+
						'{{#tabs}}'+
							'<li class="nav-item">'+
								'<a class="nav-link active" id="{{name}}-tab" data-toggle="tab" href="#{{name}}" role="tab" aria-controls="{{name}}" aria-selected="true">{{title}}</a>'+
							'</li>'+
						'{{/tabs}}'+
						'</ul>'+

						'<div class="{{CSS_ATTR.TABCONTENT}}" id="lmsace-builder-tabs">'+
							'{{#tabs}}'+
							'<div class="tab-pane" id="{{name}}" role="tabpanel" aria-labelledby="{{name}}-tab">'+
								'{{#fields}}'+
									'{{{formfield}}}'+
								'{{/fields}}'+
							'</div>'+
							'{{/tabs}}'+
						'</div>'+

						'<div class="element-save-parent" > '+
							'<button type="submit" class="btn btn-primary" id="{{CSS_ATTR.BUTTONSAVE}}" > SAVE </button> ' +
						'</div>' +
					'</form>'+
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

		},

		SHORTCODE: '[LMSACE '+
			'{{#params}}' +
				'{{params.name}}="{{params.value}}" ' +
			'{{/params}}' +
		' ]',
	},



	builder, ELEMENTFORM_DIALOGUE, ELEMENTS_DIALOGUE;

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
			// Builder dialogue.
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
			visual_output = funcobj._rendertemplate( TEMPLATES.VISUALLAYOUT );
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

			Y.Handlebars.registerHelper('formfield', function() {
				var type = this.type.toUpperCase();
				var content = TEMPLATES.FORM_FIELDS[type];
				return Y.Handlebars.render(content, this);
			})
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


			formfields.all(".form-parent-wrapper").each(function(form) {
				form.delegate('submit', function(e) {
					e.preventDefault();
					var data = $(SELECTORS.ELEMENTFORM).serializeArray();
					console.log(data);
					THIS._generate_shortcode_form( elem_obj.element_thumb().id, data );
				}, SELECTORS.ELEMENTFORM, THIS );
			});
			// formfields.all(SELECTORS.ELEMENTFORM).on('submit', function(e) {
			// 	e.preventDefault();
			// 	console.log( $(SELECTORS.ELEMENTFORM).serializeArray() );
			// 	console.log( e );
			// 	THIS._generate_shortcode_form( elem_obj.element_thumb().id, $(this).serializeArray() );
			// });
			ELEMENTS_DIALOGUE.hide();
			this._update_dialogue_content(elem_obj.addtitle, formfields);
		},

		/**
		 * Update the dialogue body content.
		 */
		_update_dialogue_content: function(title, bodycontent, width=50) {
			// this._dialogue = null;
			// ELEMENTFORM_DIALOGUE = this.getDialogue({
			// 	headerContent: title, // M.util.get_string('builderheading', component).
			// 	width:'50%',
			// 	bodyContent: bodycontent
			// });
			// ELEMENTFORM_DIALOGUE.show();
			ELEMENTS_DIALOGUE.set('headerContent', title);
			ELEMENTS_DIALOGUE.set('bodyContent', bodycontent).show();
			$(SELECTORS.TABCONTENT).find('.tab-pane:first').addClass('active');
			// ELEMENTS_DIALOGUE.all(".form-parent-wrapper").each(function(form) {
			// 	form.delegate('submit', function(e) {
			// 		e.preventDefault();
			// 		console.log("test");
			// 		var data = $(SELECTORS.ELEMENTFORM).serializeArray();
			// 		THIS._generate_shortcode_form( elem_obj.element_thumb(), data );
			// 	}, SELECTORS.ELEMENTFORM, THIS )
			// })
			// return dialoguecontent;
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
			if (ELEMENTS_DIALOGUE == null) {
				ELEMENTS_DIALOGUE = this.getDialogue({
					headerContent: 'Elements list', // M.util.get_string('builderheading', component).
					width: '50%',
					bodyContent: THUMBLIST
				});
			} else {
				ELEMENTS_DIALOGUE.set('bodyContent', THUMBLIST);
				ELEMENTS_DIALOGUE.set('headerContent', 'Elements List');
			}
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
		},

		/**
		 * Generate shortcode from the element form options,
		 */
		_generate_shortcode_form: function( element, formdata, add=true ) {
			console.log( formdata );
			var params = ' type="'+ element +'"';
			formdata.forEach(function(data) {
				params += ' '+ data.name + '="'+ data.value+'"';
			})
			shortcode = '['+ CODEKEY +' '+ params +'][/'+ CODEKEY +']';
			$(SELECTORS.CODESLIST).append(shortcode);
			if (add == true) {

			} else {

			}
			ELEMENTS_DIALOGUE.hide();
		}

	}, {
		ATTRS: {

			elements: {
				value: null
			}
		}
	});

