YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {

	var COMPONENT = 'atto_lmsace',

	row_visual = '<div class="visual-content"> Plus test</div> ',

	// plugins =  Row.prototype.get(),
	ELEMENTS = [],

	THUMBLIST = Y.Node.create('<div class="elements-list-parent"> </div>'),

	elements_list_output = '',

	ELEMENTS_DIALOGUE = null,

	visual_output = '', // Compiled visual output template.

	THIS = null, self = null,

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
						'<textarea class="codes-list" id="{{CSS_ATTR.CODESLIST}}" >{{codelist}}' +                            
						'</textarea>' +
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

        ELEMENT_ITEM_DIV: '<div class="lmsace-builder-item element-{{id}}" id="{{uid}}" data-elementid="{{id}}">'+
                            '<div class="builder-item-options"> {{{BUILDERITEMTOPTIONS}}} </div>' + 
                            '<div class="builder-maincontnt" > {{{output}}}</div>'+
							'<input name="element-shortcode" type="hidden" value="{{shortcode}}"> </div>',

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

		selectedNode: null,

		contextid: null,

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
			self = this;

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

			this._selected_point = this.get('host').getSelection();

			if (!this._selected_point) {
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

			var bodycontent = codeslist = null;
			var visualUpdated = false;
			this.contextid = this.get('contextid');

			this._loadAllElements();			

			var codes = this.get('host').getSelectedNodes();			
			this.selectedNode = codes.item(0);
			// generate and load body content from selection data.
			this._selected_point = this.get('host').getSelection();

			if (this._selected_point.length) {
				for ( var i=0; i < this._selected_point.length; i++ ) {

					SELECTION_DATA = this._selected_point[i].startContainer.data;
					console.log(SELECTION_DATA);
					if ( typeof SELECTION_DATA != undefined && SELECTION_DATA != null && SELECTION_DATA.includes('[LMSACEBUILDER]') ) {
                        visualUpdated = this._load_shortcode_visual_body();
					}
				}
			}

			if (visualUpdated) {
				bodycontent = visual_output;
			} else {
            	bodycontent = this.build_dialogue_body(codeslist);
			}

			// Builder dialogue.
			if ( BUILDER_DIALOGUE == null ) {
				this._dialogue = null;
				BUILDER_DIALOGUE = this.getDialogue();
			}
			BUILDER_DIALOGUE.set('headerContent', 'LMSACE Builder' );

			BUILDER_DIALOGUE.set('width', '80%');
			BUILDER_DIALOGUE.set('bodyContent', bodycontent );

			BUILDER_DIALOGUE.show();

			this._dialogue = null; // Make previous dialogue null to open new one.
			ELEMENTS_DIALOGUE = this.getDialogue({
				headerContent: 'Elements list', // M.util.get_string('builderheading', component).
				width: '50%',
				focusAfterHide: null
			});
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

		// Load visual body and short code from selection when open the button with selection.
		_load_shortcode_visual_body: function() {
			if (SELECTION_DATA != null) {

				var visualcontent = '', shortcodes = '';
				var shortcoderegex = /\[LMSACE:(.+?)?\]?(.+?)?(\[\/LMSACE\])/g;
				var uid = 1;
				while ((elementslist = shortcoderegex.exec(SELECTION_DATA)) !== null) {
					shortcodes += elementslist[0];
					var visualData = {};
					var params = '';
					typeRex = /\[LMSACE:element="([^"]*)"/g;
					var elementType = typeRex.exec(elementslist[0]);
					if (elementType !== null && typeof elementType[1] != 'undefined' ) {
						elementType = elementType[1];
						var paramRegex = /([\w-]+)="([^"]*)"/g;
						while ((m = paramRegex.exec(elementslist[0])) !== null) {
							visualData[ m[1] ] = m[2];
							params += ' '+ m[1] + '="'+ m[2] +'"';
						}

						if (typeof ELEMENTS[elementType] == "undefined") continue;

						// Update the visual content for the shortcode. in visual body.
						var elem_obj =  ELEMENTS[elementType];
						var visualparams = THIS._render_visual_content( elementType, visualData['id'], elem_obj, params, visualData);
						visualparams.uid = uid;
						visualcontent += THIS._rendertemplate( TEMPLATES.ELEMENT_ITEM_DIV, visualparams ).get('outerHTML');
					}
				}
				this.build_dialogue_body(shortcodes);

				visual_output.one(SELECTORS.ELEMENTADDED).append(visualcontent);
				// Update the shortcodes in the shortcode list.
				$(SELECTORS.CODESLIST).val(shortcodes);

                return true;
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

			$('body').delegate(SELECTORS.EDITITEM, 'click', function() {
				self._triggerEditElement($(this));
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
			var type = elem_obj.element_thumb().id;
			self._triggerElementDialogue( type, elem_obj);
			/* var formfields = THIS._rendertemplate( TEMPLATES.FORM, elem_obj.form_fields() );

			formfields.all(".form-parent-wrapper").each(function(form) {
				form.delegate('submit', function(e) {
					e.preventDefault();
					var data = $(SELECTORS.ELEMENTFORM).serializeArray();
					THIS._generate_shortcode_form( elem_obj, data );
				}, SELECTORS.ELEMENTFORM, THIS );
			});

            if ( elem_obj.form_fields() != "") {
			    this._update_dialogue_content(elem_obj.element_thumb().title, formfields);
            } */
		},
		_triggerEditElement: function(editElement) {
			var type = editElement.attr('data-elementid');
			if (typeof ELEMENTS[type]  != "undefined") {
				var elem_obj = ELEMENTS[type];
				_triggerElementDialogue(type, elem_obj);
			}
		},

		_triggerElementDialogue: function(type, elem_obj) {
			var headerContent= elem_obj.element_thumb().title
			var formcontent = Y.Node.create('<div class="element-form-dialogue"></div>');

			require(['jquery', 'core/fragment'], function($, Fragment) {
				// alert(self.contextid)
				Fragment.loadFragment('atto_lmsace', 'getform', self.contextid, {element: type } ).then((html, js) => {
					formcontent.setHTML(html);
					formcontent.all("form.mform").each(function(form) {
						console.log(form);
						form.on('submit', function(e) {
							e.preventDefault();
							var formid = e.target.get('id');
							var data = $('#'+formid).serializeArray();
							console.log(data);
							THIS._convertFormToCode( elem_obj, data );
						}, SELECTORS.ELEMENTFORM, THIS );
					});

					ELEMENTS_DIALOGUE
						.set('bodyContent', formcontent)
						.set('headerContent', headerContent)
						.show();
				})
			})
		},
		/**
		 * Generate shortcode from the element form options,
		 */
		 _convertFormToCode: function( elem_obj, formdata, add=true ) {
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
			// $(SELECTORS.CODESLIST).append(shortcode);
			// Add selements visual output for userinterface.
            // console.log(THIS._rendertemplate( elem_obj.element_output()));
			var visualcontent = THIS._render_visual_content(element, uid, elem_obj, params, visualData);
			visualcontent.shortcode = shortcode;
			this._update_visual_content(visualcontent);
			
			ELEMENTS_DIALOGUE.hide();
			BUILDER_DIALOGUE.focus();
		},

		
		_render_visual_content: function(element, uid, elem_obj, shortcode, params, visualData ) {
			var visualcontent = {
				output: THIS._rendertemplate( elem_obj.element_output(), visualData ).get('outerHTML'),
				id: element,
				BUILDERITEMTOPTIONS: THIS._rendertemplate( TEMPLATES.BUILDERITEMTOPTIONS, { id : element, uid: uid, params: params } ).get('outerHTML'),
			};
			return visualcontent;
		},

		_update_visual_content: function(visualcontent) {
			console.log(visualcontent);
			visual_output.one(SELECTORS.ELEMENTADDED).append( THIS._rendertemplate( TEMPLATES.ELEMENT_ITEM_DIV, visualcontent ) );
		},

		_generate_uid: function() {
			return 'yui_' + Date.now();
		},       

		/**
		 * Update the dialogue body content.
		 */
		_update_dialogue_content: function(title, bodycontent, width=50) {
			ELEMENTS_DIALOGUE.set('bodyContent', bodycontent)
			ELEMENTS_DIALOGUE.set('headerContent', title).show();
			// ELEMENTS_DIALOGUE.update();
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
					bodyContent: THUMBLIST,
					focusAfterHide: null
				});
			} else {
				ELEMENTS_DIALOGUE.set('bodyContent', THUMBLIST);
				ELEMENTS_DIALOGUE.set('headerContent', 'Elements List');
			}
			ELEMENTS_DIALOGUE.show();

		},

		

		_insert_builder_content: function() {
			var codelist = $(SELECTORS.CODESLIST).html();
			console.log(codelist);
			var host = this.get('host');
			BUILDER_DIALOGUE.hide();
			host.focus();
			this.editor.focus();
			// host.restoreSelection();
			host.restoreSelection();
			if (this.selectedNode) {
				var selection = host.getSelectionFromNode(this.selectedNode);
				// console.log(selection);
				this.get('host').setSelection(selection);
			} else {
				host.setSelection(this._selected_point);
			}
			
			// Focus on the previous selection.
			codelist = '[LMSACEBUILDER]' + codelist + '[/LMSACEBUILDER]';
			host.insertContentAtFocusPoint(codelist);
			this.markUpdated();
		}

	}, {
		ATTRS: {

			elements: {
				value: null
			},

			contextid: {
				value: null
			}
		}
	});


}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin", "acebuilder_element_header"]});
