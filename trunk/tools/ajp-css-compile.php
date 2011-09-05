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
$result_css = '';

global $path;

function mkdataurl($m) {
	global $path;
	if (preg_match('/^\'?data\:/', $m[1]))
		return $m[0];
	$file = str_replace("\\", '/', "$path/{$m[1]}");
	return "url(data:image/png;base64," . base64_encode(file_get_contents($file)) . ")";
}

foreach($files as $f) {
	$path = dirname($f);
	$css = file_get_contents($f);
	$result_css .= preg_replace_callback('/url\(([^)]+)\)/', 'mkdataurl', $css);
}

file_put_contents($result, $result_css);

?>