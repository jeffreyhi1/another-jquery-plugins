<?

if (isset($_SERVER['SERVER_NAME'])) {
	echo "run this script in a command line\n";
	exit(0);
}

$files = array(
	'../source/css/release/jquery.ajp.css',
	'../source/css/release/theme/jquery.ajp.css',
);

$result = '../source/css/release/jquery.ajp.inline.css';

$ver = '../VERSION.txt';

$hdr = 
'/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	Project home: http://code.google.com/p/another-jquery-plugins/

	Version: ' . file_get_contents($ver) . '
*/
';

$result_css = $hdr;

global $path;

function mkdataurl($m) {
	global $path;
	if (preg_match('/^\'?data\:/', $m[1]))
		return $m[0];
	$file = str_replace("\\", '/', "$path/{$m[1]}");
	return "url(data:image/png;base64," . base64_encode(file_get_contents($file)) . ")";
}

class css_packer {

	protected static function replacement($m) {
		$h = preg_replace('/[\s\r\n\t]+/m', ' ', trim($m[1]));
		$h = preg_replace('/\s*([:;])\s*/', '$1', $h);
		$h = preg_replace('/;$/', '', $h);
		$h = preg_replace('/:0(em|px|pt)$/', ':0', $h);
		return '{' . $h . '}';
	}

	public static function pack($css, $keep_comments = true) {
		$css = preg_replace_callback('/\{((?:[^\}]|[\s\t\r\n])*)\}/m', array('css_packer', 'replacement'), $css);
		if (!$keep_comments)
			$css = preg_replace('/\/\*((?:.|[\s\t\r\n])*?)\*\//m', '', $css);
		$css = preg_replace('/[\r\n]+/', "\n", $css);
		return trim($css);
	}
}

foreach($files as $f) {
	$path = dirname($f);
	$css = file_get_contents($f);
	$result_css .= css_packer::pack($css, false);
}

$result_css = preg_replace_callback('/url\(([^)]+)\)/', 'mkdataurl', preg_replace('/\t/', '', preg_replace('/\/\*.*\*\//', '', $result_css)));

file_put_contents($result, $result_css);

?>