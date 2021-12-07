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

	CODEKEY = 'LMSACE', // sHORTCODE KEY.

	CSS_ATTR = {
		ELEMENTTHUMB: 'element-thumb-parent',
		ELEMENTADDED: 'added-element',
		TABCONTENT: 'tab-content',
		ELEMENTFORM: 'lmsaceElementForm',
		CODESLIST: 'codes-list',
		BUTTONSAVE: 'button-save',
		SAVELAYOUT: 'save_layout',
		CANCELLAYOUT: 'cancel_layout',        
        EDITITEM: 'edit_element_item',
	},

	SELECTORS = {
		ADDELEMENT: '#addelement a',
		ELEMENTTHUMB: '.' + CSS_ATTR.ELEMENTTHUMB,
		ELEMENTADDED: '#' + CSS_ATTR.ELEMENTADDED,
		TABCONTENT: '.' + CSS_ATTR.TABCONTENT,
		ELEMENTFORM: '#' + CSS_ATTR.ELEMENTFORM,
		CODESLIST: '#' + CSS_ATTR.CODESLIST,
		BUTTONSAVE: '#' + CSS_ATTR.BUTTONSAVE,
		SAVELAYOUT: '#' + CSS_ATTR.SAVELAYOUT,
		CANCELLAYOUT: '#' + CSS_ATTR.CANCELLAYOUT,
        EDITITEM: '[data-func="'+ CSS_ATTR.EDITITEM +'"]',
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
						'<div class="codes-list" id="{{CSS_ATTR.CODESLIST}}" > {{codelist}}' +                            
						'</div>' +
					'</div>' +
					'<div class="save-button-layout">' +
						'<input type="button" id="{{CSS_ATTR.SAVELAYOUT}}" value="Save" >' +
						'<input type="button" id="{{CSS_ATTR.CANCELLAYOUT}}" value="Cancel" >' +
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
							'<div class="tab-pane {{class}}" id="{{name}}" role="tabpanel" aria-labelledby="{{name}}-tab">'+
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

        BUILDERITEMTOPTIONS: '<div class="list"> '+
                        '<p class="edit-element-item" data-func="edit_element_item" data-elementid="{{id}}" data-codeuid="{{uid}}" data-params="{{params}}" > Edit </p>'+
                        '<p class="edit-element-item" data-func="delete_element_item" data-elementid="{{id}}" data-codeuid="{{uid}}" > Delete </p> '+
                        '</div> ',

        ELEMENT_ITEM_DIV: '<div class="lmsace-builder-item element-{{id}}" id="{{id}}" data-elementid="{{id}}">'+
                            '<div class="builder-item-options"> {{{BUILDERITEMTOPTIONS}}} </div>' + 
                            '<div class="builder-maincontnt" > {{{output}}}</div></div>',

		SHORTCODE: '[LMSACE:element={{element}} '+
			'{{#params}}' +
				'{{params.name}}="{{params.value}}" ' +
			'{{/params}}' +
		' ]',
	},

	BUILDER_DIALOGUE, ELEMENTFORM_DIALOGUE, ELEMENTS_DIALOGUE, SELECTION_DATA;

	Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

		_selected_point: null,

		_host: null,

        // #1. 
		initializer: function() {
			this._host = this.get('host');
			this.addButton({
				title: 'pluginname',
				icon: 'i/addblock',
				// Watch the following tags and add/remove highlighting as appropriate:
				callback: this.show_builder
			});
			THIS = this;

			// Highlight the buttons.
			this.get('host').on('atto:selectionchanged', function() {
                if (this.isBuilderContent()) {
                    this.highlightButtons();
                } else {
                    this.unHighlightButtons();
                }
            }, this);
		},

		isBuilderContent: function() {

			var selectedNode = this.get('host').getSelectionParentNode();
			this._selected_point = this.get('host').getSelection();

			if (!selectedNode) {
				return false;
			}

			if (this._selected_point.length) {
				for (var i=0; i < this._selected_point.length; i++ ) {

					SELECTION_DATA = this._selected_point[i].startContainer.data;
					console.log(SELECTION_DATA);
					if ( typeof SELECTION_DATA != undefined && SELECTION_DATA != null && (SELECTION_DATA.includes('[LMSACEBUILDER]') || SELECTION_DATA.includes('[LMSACE]'))) {
                       return true;
					}
				}
			}
			return false;
		},

        /**
         * Show builder popup.
         */
		show_builder: function() {
			bodycontent = codeslist = null;
			this._loadAllElements();

			// generate and load body content from selection data.
			this._selected_point = this.get('host').getSelection();

			if (this._selected_point.length) {
				for (var i=0; i < this._selected_point.length; i++ ) {

					SELECTION_DATA = this._selected_point[i].startContainer.data;
					console.log(SELECTION_DATA);
					if ( typeof SELECTION_DATA != undefined && SELECTION_DATA != null && SELECTION_DATA.includes('[LMSACEBUILDER]') ) {
						// bodycontent = 
                        codeslist = this._load_shortcode_visual_body();
					}
				}
			}

            bodycontent = this.build_dialogue_body(codeslist);

			// Builder dialogue.
			if ( BUILDER_DIALOGUE == null ) {
				this._dialogue = null;
				BUILDER_DIALOGUE = this.getDialogue();
			}
			BUILDER_DIALOGUE.set('headerContent', 'LMSACE Builder' );
			BUILDER_DIALOGUE.set('width', '80%');
			BUILDER_DIALOGUE.set('bodyContent', bodycontent );

			BUILDER_DIALOGUE.show();
			this._registerformfields();
			
		},


		build_dialogue_body: function(codeslist='') {
			var funcobj = this;
            option = {codelist: codeslist};
			visual_output = funcobj._rendertemplate( TEMPLATES.VISUALLAYOUT, option );
            // Register add element icon event.
            // Display the element list when the add element clicked.
			visual_output.all(SELECTORS.ADDELEMENT).on('click', function() {
				funcobj._display_elements_list();
			}, funcobj);
            // Register event to save content. Add the generated shortcode to the editor.
			visual_output.one(SELECTORS.SAVELAYOUT).on('click', function() {
				THIS._insert_builder_content();
			});

            visual_output.delegate('click', function() {
                dataset = this.get('dataset');
            }, SELECTORS.EDITITEM);

			return visual_output;
		},

		_load_shortcode_visual_body: function() {
			if (SELECTION_DATA != null) {
				// shortcoderegex = /\[LMSACE (.+?)?\](?:(.+?)?\[\/LMSACE\])?/g;
				// elementslist = SELECTION_DATA.match(shortcodere);
				// console.log(elementslist);
                var element_item_code = '';
				var shortcoderegex = /\[LMSACE:(.+?)?\]?(.+?)?(\[\/LMSACE\])/g;
				while ((elementslist = shortcoderegex.exec(SELECTION_DATA)) !== null) {
					element_item_code += elementslist[0];
					var params = {};
					typeRex = /\[LMSACE:element="([^"]*)"/g;
					var elementType = typeRex.exec(elementslist[0]);
					if (elementType !== null && typeof elementType[1] != 'undefined' ) {
						elementType = elementType[1];
						var paramRegex = /([\w-]+)="([^"]*)"/g;
						while ((m = paramRegex.exec(str)) !== null) {
							params[ m[1] ] = m[2];
						}
						THIS._rendertemplate( ELEMENTS[elementType].form_fields(), params );
						THIS._update_visual_content(element, uid, elem_obj, params, visualData);
						// TODO
					}
				}
                return element_item_code;
			}
 		},

		_rendertemplate: function(html, option=null) {
			var template = Y.Handlebars.compile(html);
			config = Y.merge({
				CSS_ATTR : CSS_ATTR,
				SELECTORS: SELECTORS,
				COMPONENT: COMPONENT,
				TEMPLATES: TEMPLATES,
			}, option);
            console.log(option);
			var output = Y.Node.create(
				template(config)
			);
			console.log(output);
			return output;
		},

		// Append selected element into visual output list.
		_register_editevent: function() {
			// one("[data-elementid=" + elem_obj.element_thumb().id + "]");
			THUMBLIST.all(SELECTORS.ELEMENTTHUMB).each(function(thumb) {
				// console.log(thumb);
				thumb.on('click', function(e) {
					e.preventDefault();
					var id = this.getAttribute('data-elementid');
					var elem_obj = ELEMENTS[id];
					THIS._add_selected_element( elem_obj );
				});
			});
		},

        // Register the form input fields.
		_registerformfields: function() {
			// console.log(TEMPLATES.FORM_FIELDS);
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

			if (elem_obj.form_fields() == null) {
				THIS._generate_shortcode_form( elem_obj, {} );
				return;
			}
			var formfields = THIS._rendertemplate( TEMPLATES.FORM, elem_obj.form_fields() );

			formfields.all(".form-parent-wrapper").each(function(form) {
				form.delegate('submit', function(e) {
					e.preventDefault();
					var data = $(SELECTORS.ELEMENTFORM).serializeArray();
					THIS._generate_shortcode_form( elem_obj, data );
				}, SELECTORS.ELEMENTFORM, THIS );
			});
			// formfields.all(SELECTORS.ELEMENTFORM).on('submit', function(e) {
			// 	e.preventDefault();
			// 	console.log( $(SELECTORS.ELEMENTFORM).serializeArray() );
			// 	console.log( e );
			// 	THIS._generate_shortcode_form( elem_obj.element_thumb().id, $(this).serializeArray() );
			// });
			// ELEMENTS_DIALOGUE.hide();
            if ( elem_obj.form_fields() != "") {
			    this._update_dialogue_content(elem_obj.addtitle, formfields);
            }
		},

		/**
		 * Update the dialogue body content.
		 */
		_update_dialogue_content: function(title, bodycontent, width=50) {
			ELEMENTS_DIALOGUE.set('bodyContent', bodycontent)
			ELEMENTS_DIALOGUE.set('headerContent', title)
				.show();
			$(SELECTORS.TABCONTENT).find('.tab-pane:first').addClass('active');
		},

		_loadAllElements: function() {
			var this_obj = this;
			elements_list_output = [];
			var avail_elements = this.get('elements');
			if (Object.keys(ELEMENTS).length <= 0 ) {
				for (let i=0; i < avail_elements.length; i++ ) {
					var element = avail_elements[i];
					var elem_obj = M.aceaddon_builder[element].init();
					var element_thumb = { DATA: elem_obj.element_thumb() };
					var elementtemplate = this_obj._rendertemplate( TEMPLATES.THUMBBOX, element_thumb );
					elem_obj.element_event_register( elementtemplate );
					THUMBLIST.append( elementtemplate );
					console.log(Object.getPrototypeOf(elem_obj));
					ELEMENTS[ element.toLowerCase() ] = Object.getPrototypeOf(elem_obj);
					// console.log(ELEMENTS);
				}
				// console.log(ELEMENTS[row]);
				this_obj._register_editevent();
			}
		},

		_display_elements_list: function() {

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
			ELEMENTS_DIALOGUE.show();
		},

		/**
		 * Generate shortcode from the element form options,
		 */
		_generate_shortcode_form: function( elem_obj, formdata, add=true ) {
			var uid = THIS._generate_uid();
			var element = elem_obj.element_thumb().id;
			var visualData = {};
			var params = ' type="'+ element +'"';
			params = ' id="'+uid+'"';
			formdata.forEach(function(data) {
				params += ' '+ data.name + '="'+ data.value+'"';
				visualData[data.name] = data.value;
			})
			shortcode = '['+ CODEKEY +':element="'+element+'" '+ params +'][/'+ CODEKEY +']';
			// Add shortcode on codeslist.
			$(SELECTORS.CODESLIST).append(shortcode);
			// Add selements visual output for userinterface.
            // console.log(THIS._rendertemplate( elem_obj.element_output()));
			THIS._update_visual_content(element, uid, elem_obj, params, visualData);
			if (add == true) {
			} else {
			}
			ELEMENTS_DIALOGUE.hide();
		},

		// TODO: Need to update the content
		_update_visual_content: function(element, uid, elem_obj, params, visualData ) {
			var visualcontent = {
				output: THIS._rendertemplate( elem_obj.element_output(), visualData ).get('outerHTML'),
				id: element,
				BUILDERITEMTOPTIONS: THIS._rendertemplate( TEMPLATES.BUILDERITEMTOPTIONS, { id : element, uid: uid, params: params } ).get('outerHTML'),
			};
			visual_output.one(SELECTORS.ELEMENTADDED).append( THIS._rendertemplate( TEMPLATES.ELEMENT_ITEM_DIV, visualcontent ) );

		},

		_generate_uid: function() {
			return 'yui_' + Date.now();
		},

		_insert_builder_content: function() {
			var codelist = $(SELECTORS.CODESLIST).html();
			this.get('host').setSelection(this._selected_point);
			codelist = '[LMSACEBUILDER]' + codelist + '[/LMSACEBUILDER]';
			this.get('host').insertContentAtFocusPoint(codelist);
			BUILDER_DIALOGUE.hide();
		}

	}, {
		ATTRS: {

			elements: {
				value: null
			}
		}
	});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin", "acebuilder_element_header"]});
