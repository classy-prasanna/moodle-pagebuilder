<?php


if (!function_exists('atto_lmsace_params_for_js')) {
	
	function atto_lmsace_params_for_js($elementid, $options, $fpoptions) {

		$context = $options['context'];
		if (!$context) {
			$context = context_system::instance();
		}

		$plugins = [
			'Row', 'Column'
		];


		return ['contextid' => $context->id, 'elements' => $plugins ];
	}

}