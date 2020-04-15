YUI.add('moodle-atto_lmsace-button', function (Y, NAME) {

Y.namespace('M.atto_lmsace').Button = Y.Base.create('button', Y.M.editor_atto.EditorPlugin, [], {
	initializer: function() {
		this.addBasicButton({
            exec: 'strikeThrough',
            icon: 'e/strikethrough',

            // Watch the following tags and add/remove highlighting as appropriate:
            tags: 'strike'
        });
	}
});

}, '@VERSION@', {"requires": ["moodle-editor_atto-plugin"]});
