<?php
include("header.php");

if (is_numeric($pathObj->rcp_id)) {
    $rcp = new Recipe($pathObj->rcp_id);
    $rcp->getIngredients();
    $rcp->getTags();
    $tpl = $rcp;
} else {
    $tpl = array("error" => "there was a problem");
}

echo json_encode($tpl);

?>

