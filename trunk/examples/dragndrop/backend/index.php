<?php

/* $Id$ */

function safe_name($name) {
	$sname = '';
	$name = preg_replace('/((\.\.)?\/|\/+)/', '_', $name);
	for ($i = 0; $i < strlen($name); $i ++) {
		$c = $name[$i];
		if (preg_match('/[\s\r\n]/', $c))
			$c = '_';
		else if (!preg_match('/[a-zA-Z0-9\,\.\_\+\=\(\)\[\]\-\{\}\*\&\^\%\!\"\']/', $c))
			$c = sprintf('x%02X', ord($c));
		$sname .= $c;
	}
	return $sname;
}

$file_name = @$_GET['name'];
$name = 'uploads/' . safe_name($file_name);

$file_content = @file_get_contents('php://input');
@file_put_contents($name, $file_content);
echo "<a href=\"./backend/$name\" target=\"_blank\">$file_name</a><br/>";

?>