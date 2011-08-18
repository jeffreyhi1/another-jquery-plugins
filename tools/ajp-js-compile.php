<?

if (isset($_SERVER['SERVER_NAME'])) {
	echo "run this script in a command line\n";
	exit(0);
}

$url = 'http://closure-compiler.appspot.com/compile';
$out = '../source/release/jquery.ajp.min.js';
$ver = '../VERSION.txt';
$hdr = 
'/*
	Copyright (c) 2011 Andrey O. Zbitnev (azbitnev@gmail.com)
	Licensed under the MIT License (LICENSE.txt).

	Version: ' . file_get_contents($ver) . '
*/
';


$params = array(
	'js_code' => file_get_contents('../source/release/jquery.ajp.js'),
	'compilation_level' => 'SIMPLE_OPTIMIZATIONS',
	'output_format' => 'json',
	'output_info' => array('compiled_code', 'warnings', 'errors', 'statistics'),
);


$curl_opts = array(
	CURLOPT_POST => true,
	CURLOPT_POSTFIELDS => preg_replace('/\%5B\d+\%5D=/', '=', http_build_query($params)),
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
	CURLOPT_FOLLOWLOCATION => true,
	CURLOPT_FRESH_CONNECT => true,
	CURLOPT_HTTPHEADER => array(
		"Expect:",
	),

	//CURLOPT_VERBOSE => true,
);


$ch = curl_init($url);
curl_setopt_array($ch, $curl_opts);
$response = curl_exec($ch);
curl_close($ch);

$response = @json_decode($response, true);

if (count(@$response['errors'])) foreach ($response['errors'] as $msg)
	echo "ERROR at line {$msg['lineno']}: {$msg['error']}\n----------------------------------------------\n{$msg['line']}\n----------------------------------------------\n";

if (count(@$response['warnings'])) foreach ($response['warning'] as $msg)
	echo "WARNING at line {$msg['lineno']}: {$msg['warning']}\n----------------------------------------------\n{$msg['line']}\n----------------------------------------------\n";

if (isset($response['compiledCode'])) {
	file_put_contents($out, $hdr . $response['compiledCode']);
	echo "DONE original size = {$response['statistics']['originalSize']}, compressed size = {$response['statistics']['compressedSize']}\n";
}

?>