
var component = 'atto_lmsace',

builder;

Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
	

	initializer: function() {
		
		this.addButton({

            title: 'Lmsace Builder',
            icon: 'e/lmsace_builder',
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
		codemirror = Y.M.atto_html.CodeMirror;
		console.log(codemirror);
		return 'test';
	}

});