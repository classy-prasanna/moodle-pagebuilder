<?php


if (!function_exists('atto_lmsace_params_for_js')) {
	
	function atto_lmsace_params_for_js($elementid, $options, $fpoptions) {
		global $PAGE, $CFG;
		$context = $options['context'];
		if (!$context) {
			$context = context_system::instance();
		}

		$plugins = [
			'Row', 'Column'
		];

		require_once($CFG->dirroot.'/local/acetools/addons/builder/lib.php');
		$plugins = aceaddon_builder_load_elements();
		
		return ['contextid' => $context->id, 'elements' => $plugins ];
	}

}