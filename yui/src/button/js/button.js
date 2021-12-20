YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {

	"use strict"

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
		DELETEITEM: 'delete_element_item',
		ELEMENTSHORTCODE: 'element-shortcode',
		ELEMENTITEM: 'lmsace-builder-item',
		VISUALTAB: 'visual-tab',
		EDITINGMOVE: 'editing_move',
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
		DELETEITEM: '[data-func="'+ CSS_ATTR.DELETEITEM +'"]',
		ELEMENTSHORTCODE: 'input[name="'+ CSS_ATTR.ELEMENTSHORTCODE+'"]',
		ELEMENTITEM: '.' + CSS_ATTR.ELEMENTITEM,
		EDITINGMOVE: '.editing_move',
		VISUALTAB: '.' + CSS_ATTR.VISUALTAB,
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
						'<ul class="elements-list" id="{{CSS_ATTR.ELEMENTADDED}}" >' +
						'</ul>' +
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

        ELEMENT_ITEM_DIV: '<li class="lmsace-builder-item element-{{id}}" id="{{uid}}" data-elementid="{{id}}">'+
							'<span class="editing_move"><i class="icon fa fa-arrows fa-fw iconsmall"></i></span>'+
                            '<div class="builder-item-options"> {{{BUILDERITEMTOPTIONS}}} </div>' +
                            '<div class="builder-maincontnt" > {{{output}}}</div>'+
							'<input name="element-shortcode" type="hidden" value="{{shortcode}}"> </li>',

		SHORTCODE: '[LMSACE:element={{element}} '+
			'{{#params}}' +
				'{{params.name}}="{{params.value}}" ' +
			'{{/params}}' +
		' ]',
	},

	BUILDER_DIALOGUE, ELEMENTFORM_DIALOGUE, ELEMENTS_DIALOGUE, SELECTION_DATA;


	var DRAGREORDER = function () {
		DRAGREORDER.superclass.constructor.apply(this, arguments);
	};

	Y.extend(DRAGREORDER, M.core.dragdrop, {

		initializer: function() {
			this.groups = ['resource'];


			this.samenodeclass = CSS_ATTR.ELEMENTITEM;
        	this.parentnodeclass = CSS_ATTR.VISUALTAB;

			// Go through all sections
			this.setup_for_section();

			var del = new Y.DD.Delegate({
				container: SELECTORS.VISUALTAB,
				nodes: SELECTORS.ELEMENTITEM,
				target: true,
				handles: [SELECTORS.EDITINGMOVE],
				dragConfig: {groups: this.groups}
			});
			console.log(del);
			

			del.dd.plug(Y.Plugin.DDProxy, {
				// Don't move the node at the end of the drag
				moveOnEnd: false,
				cloneNode: true
			});
			del.dd.plug(Y.Plugin.DDConstrained, {
				// Keep it inside the .mod-quiz-edit-content
				constrain: SELECTORS.VISUALTAB
			});
			del.dd.plug(Y.Plugin.DDWinScroll);
		},

		/**
		 * Apply dragdrop features to the specified selector or node that refers to section(s)
		 *
		 * @method setup_for_section
		 * @param {String} baseselector The CSS selector or node to limit scope to
		 */
		setup_for_section: function() {
			Y.Node.all('#lmsbuilder-visual .visual-tab ul.elements-list').each(function(resources) {
				resources.setAttribute('data-draggroups', this.groups.join(' '));
				// Define empty ul as droptarget, so that item could be moved to empty list
				new Y.DD.Drop({
					node: resources,
					groups: this.groups,
					padding: '20 0 20 0'
				});
	
				// Initialise each resource/activity in this section
				this.setup_for_resource('li.lmsace-builder-item');
			}, this);
		},
	
		/**
		 * Apply dragdrop features to the specified selector or node that refers to resource(s)
		 *
		 * @method setup_for_resource
		 * @param {String} baseselector The CSS selector or node to limit scope to
		 */
		setup_for_resource: function(baseselector) {
			Y.Node.all(baseselector).each(function(resourcesnode) {
				// Replace move icons.
				var move = resourcesnode.one('span.' + CSS_ATTR.EDITINGMOVE);
				if (move) {
					var resourcedraghandle = this.get_drag_handle(
						M.util.get_string('move', 'moodle'),
						CSS_ATTR.EDITINGMOVE,
						'iconsmall',
						true
					);
					move.replace(resourcedraghandle);
				}
			}, this);
		},

		drop_hit: function(e) {
			self._updateShortCodeList();
		}

	}, {
		NAME: 'atto_lmsace-dragdrop-reorder',
		ATTRS: {}
	});

	M.atto_lmsace = M.atto_lmsace || {};
	M.atto_lmsace.dragdrop_reorder = function(params) {
		return new DRAGREORDER(params);
	};

	Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {

		_selected_point: null,

		_host: null,

		selectedNode: null,

		contextid: null,

		host: null,

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

			var bodycontent = null, 
			codeslist = null;
			var visualUpdated = false;
			

			if (self.contextid == null) {
				this.contextid = this.get('contextid');
			}

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
				focusOnPreviousTargetAfterHide: true,
				focusAfterHide: false,
				
			});

			ELEMENTS_DIALOGUE.after("visibleChange", function(e) {
				if (!ELEMENTS_DIALOGUE.get('visible')) {
					// ELEMENTS_DIALOGUE.destroy(true);
					console.log(window);
					// BUILDER_DIALOGUE.focus();
					// this = null;
				}
			});

			this._registerformfields();
			self._initDragDrop();
		},


		build_dialogue_body: function(codeslist='') {
			var funcobj = this;
            var option = {codelist: codeslist};
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

			visual_output.delegate('click', function(e) {
				var uid = e.currentTarget.getAttribute('data-codeuid');
				Y.one(".lmsace-builder-item#"+uid).remove();
                self._updateShortCodeList();
            }, SELECTORS.DELETEITEM);

			return visual_output;
		},

		// Load visual body and short code from selection when open the button with selection.
		_load_shortcode_visual_body: function() {
			if (SELECTION_DATA != null) {

				var visualcontent = '', shortcodes = '';
				var shortcoderegex = /\[LMSACE:(.+?)?\]?(.+?)?(\[\/LMSACE\])/g;
				while ((elementslist = shortcoderegex.exec(SELECTION_DATA)) !== null) {
					var uid = THIS._generate_uid();
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
						var visualparams = THIS._render_visual_content( elementType, uid, elem_obj, JSON.stringify(visualData), visualData);
						visualparams.uid = uid;
						visualparams.shortcode = elementslist[0];
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
			var config = Y.merge({
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
				console.log(thumb);
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
				var field = TEMPLATES.FORM_FIELDS[key];
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
			var uid = editElement.attr('data-codeuid');
			var params = editElement.attr('data-params');
			if (typeof ELEMENTS[type]  != "undefined") {
				var elem_obj = ELEMENTS[type];
				self._triggerElementDialogue(type, elem_obj, uid, params);
			}
		},

		_triggerElementDialogue: function(type, elem_obj, edit=false, options="" ) {
			var headerContent= elem_obj.element_thumb().title
			var formcontent = Y.Node.create('<div class="element-form-dialogue"></div>');

			require(['jquery', 'core/fragment', 'core/templates'], function($, Fragment, Templates) {
				// alert(self.contextid)
				Fragment.loadFragment('atto_lmsace', 'getform', self.contextid, {element: type, formdata: options} ).then((html, newJS) => {
					formcontent.setHTML(html);
					if (formcontent.all("form.mform").length == 0) {
						THIS._convertFormToCode( elem_obj, {}, edit );
					}

					formcontent.all("form.mform").each(function(form) {
						console.log(form);
						form.on('submit', function(e) {
							e.preventDefault();
							var formid = e.target.get('id');
							var data = $('#'+formid).serializeArray();
							THIS._convertFormToCode( elem_obj, data, edit );
						}, SELECTORS.ELEMENTFORM, THIS );
					});

					ELEMENTS_DIALOGUE
						.set('bodyContent', formcontent)
						.set('headerContent', headerContent)
						.show();
					Templates.runTemplateJS(newJS);
				})
			})
		},
		/**
		 * Generate shortcode from the element form options,
		 */
		 _convertFormToCode: function( elem_obj, formdata, editUid=false ) {

			var uid = THIS._generate_uid();
			var element = elem_obj.element_thumb().id;
			var visualData = {};
			var params = ' type="'+ element +'"';
			params = ' id="'+uid+'"';
			var removeparams = ['_qf__builder_element_'+element,'sesskey','id'];
			
			formdata.forEach(function(data) {
			 	if (data.name.includes('[')) {
					data.name = data.name.replace('[', '_').replace(']', '');
				}
				if ( !(removeparams.includes(data.name)) ) {
					params += ' '+ data.name + '="'+ data.value+'"';
					visualData[data.name] = data.value;
				}
			})
			var shortcode = '['+ CODEKEY +':element="'+element+'" '+ params +'][/'+ CODEKEY +']';
			// Add shortcode on codeslist.
			// $(SELECTORS.CODESLIST).append(shortcode);
			// Add selements visual output for userinterface.
            // console.log(THIS._rendertemplate( elem_obj.element_output()));
			var visualcontent = THIS._render_visual_content(element, uid, elem_obj, JSON.stringify(visualData), visualData);
			visualcontent.shortcode = shortcode;
			this._update_visual_content(visualcontent, editUid);

			ELEMENTS_DIALOGUE.hide();
			BUILDER_DIALOGUE.focus();
		},


		_render_visual_content: function(element, uid, elem_obj, params, visualData ) {
			console.log(params);
			var visualcontent = {
				output: THIS._rendertemplate( elem_obj.element_output(), visualData ).get('outerHTML'),
				id: element,
				uid: uid,
				BUILDERITEMTOPTIONS: THIS._rendertemplate( TEMPLATES.BUILDERITEMTOPTIONS, { id : element, uid: uid, params: params } ).get('outerHTML'),
			};
			return visualcontent;
		},

		_update_visual_content: function(visualcontent, edit=false) {
			console.log(visualcontent);
			var html = THIS._rendertemplate( TEMPLATES.ELEMENT_ITEM_DIV, visualcontent );
			if (edit) {
				console.log(edit);
				Y.one('#'+edit).replace(html);
			} else {
				visual_output.one(SELECTORS.ELEMENTADDED).append( html );
			}
			
			self._updateShortCodeList();
		},

		_updateShortCodeList: function() {
			var codes = '';
			Y.all(SELECTORS.ELEMENTSHORTCODE).each(function(element) {
				console.log(element);
				codes += element.get('value');
			});
			console.log(SELECTORS.ELEMENTSHORTCODE);;
			Y.one(SELECTORS.CODESLIST).setHTML(codes);
		},

		_initDragDrop: function() {
			M.atto_lmsace.dragdrop_reorder();
			/* var dd = new Y.DD.Drag({
				node: SELECTORS.ELEMENTITEM
			});

			var drop = new Y.DD.Drop({
				node: SELECTORS.ELEMENTADDED
			}); */
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
					focusAfterHide: false,
					focusOnPreviousTargetAfterHide: true,
				});

				ELEMENTS_DIALOGUE.on('hide', function() {
					this.destroy();
					alert();
				})
			} else {
				ELEMENTS_DIALOGUE.set('bodyContent', THUMBLIST);
				ELEMENTS_DIALOGUE.set('headerContent', 'Elements List');
			}

			ELEMENTS_DIALOGUE.show();

		},



		_insert_builder_content: function() {
			var codelist = $(SELECTORS.CODESLIST).html();
			console.log(codelist);
			
			BUILDER_DIALOGUE.hide();
			this._host.focus();
			this.editor.focus();
			alert(this.editor);
			// host.restoreSelection();
			this._host.restoreSelection();
			if (this.selectedNode) {
				var selection = this._host.getSelectionFromNode(this.selectedNode);
				// console.log(selection);
				this.get('host').setSelection(selection);
			} else {
				this._host.setSelection(this._selected_point);
			}

			// Focus on the previous selection.
			codelist = '[LMSACEBUILDER]' + codelist + '[/LMSACEBUILDER]';
			this._host.insertContentAtFocusPoint(codelist);
			// this.markUpdated();
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


	

	

}, '@VERSION@', {"requires": ["moodle-core-dragdrop", "moodle-editor_atto-plugin", "acebuilder_element_header"]});
