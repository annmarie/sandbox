<?php

$rcpsObj = new Recipes();
$recipes = $rcpsObj->all();
$rcps = array();
foreach($recipes as $rcp) {
    $rcp->getIngredients();
    $rcp->getTags();
    $rcps[] = $rcp; 
}

$tpl = $rcps;

?>

