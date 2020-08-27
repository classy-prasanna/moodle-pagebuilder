YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {


var component = 'atto_lmsace',

var row_visual = '<div class="visual-content"> Plus </div> ';

builder;

Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
	

	initializer: function() {
		
		this.addButton({

            title: 'Lmsace Builder',
            icon: 'e/lmsace_builder',
            // Watch the following tags and add/remove highlighting as appropriate:
            callback: this.show_builder()
        });
	},

	show_builder: function() {		
		builder = this.getDialogue({
			headerContent: 'LMSACE Builder', 
			width: '80%',
			bodyContent: this.build_dialogue_body()
		});
	},

	
	build_dialogue_body: function() {
		return added_element_visual();		
	},

	// Visual look of elements added in page.
	added_element_visual: function() {

		return visual_output;
	}
	
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
