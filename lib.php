<?php


if (!function_exists('atto_lmsace_params_for_js')) {

	function atto_lmsace_params_for_js($elementid, $options, $fpoptions) {
		global $PAGE, $CFG;
		$context = $options['context'];
		if (!$context) {
			$context = $PAGE->context;
		}

		$plugins = [
			'Row', 'Column'
		];

		require_once($CFG->dirroot.'/local/acetools/addons/builder/lib.php');
		$plugins = aceaddon_builder_load_elements();

		return ['contextid' => $context->id, 'elements' => $plugins ];
	}

}


function atto_lmsace_output_fragment_getform($args) {
	global $CFG;
	if ($args['context']) {
		$elementtype = $args['element'];
		$formdata = json_decode($args['formdata']);
		require_once($CFG->dirroot.'/local/acetools/addons/builder/lib.php');
		$form = aceaddon_builder_edit_form($elementtype, $formdata);
		return $form;
	}
}