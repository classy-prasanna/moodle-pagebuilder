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
				for (var i=0; i < this._selected_point.length; i++) {
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


	

	

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
