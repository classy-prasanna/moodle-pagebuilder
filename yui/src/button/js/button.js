
var component = 'atto_lmsace',

row_visual = '<div class="visual-content"> Plus test</div> ',

// plugins =  Row.prototype.get(),
ELEMENTS = [],

THUMB = [],

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
		
		return THUMB.join(" "); 
	}	

}, {
	ATTRS: {

		elements: {
			value: null
		}
	}
});