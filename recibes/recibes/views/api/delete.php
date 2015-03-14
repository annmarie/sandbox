<?php
include("header.php");

if (is_numeric($pathObj->rcp_id)) {
    $rcp = new Recipe($pathObj->rcp_id);
    $rcp->removeit();
    if (!$rcp->id) {
        $tpl = array("message" => "recipe has been deleted");
    } else { 
        $tpl = array("error" => "delete failed");
    }
} else {
    $tpl = array("error" => "there was a problem");
}

echo json_encode($tpl);

?>

