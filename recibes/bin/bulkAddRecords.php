<?php

$BASEURL = "http://recibes-vagrant.local/";

$datalst = array();
$datalst[] = array( 'headline' => 'apple pie', 
                    'ingredient' => array('apple'), 
                    'tag'=> array('bob', 'july'));
$datalst[] = array( 'headline' => 'blueberry pie', 
                    'ingredient' => array('blueberries'), 
                    'tag'=> array('dig', 'july'));

$results = array_map("addRecord", $datalst);

print_r($results);

exit();

function addRecord($data) {
    global $BASEURL;
    $url = rtrim($BASEURL, "/") . '/api.php/recipe/add/';
    $options = array(
        'http' => array(
            'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
            'method'  => 'POST',
            'content' => http_build_query($data),
        ),
    );
    $context  = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    return trim($result);
}

?>

