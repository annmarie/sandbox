<?php

$rcp = $pgObj->rcp;
$rcp->removeit();
if (!$rcp->id) {
    $tpl = array("message" => "recipe has been deleted");
} else { 
    $tpl = array("error" => "delete failed");
}

?>

