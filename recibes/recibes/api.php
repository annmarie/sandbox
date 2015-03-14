<?php
require_once("conf/config.php");
require_once("tools/Database.class.php");
require_once("tools/PathParser.class.php");
require_once("models.php");
require_once("forms.php");

$dbObj = new Database($conf);

$urls = array(
    "^/recipe/add/?$"  => "add",
    "^/recipe/get/all/?$" => "list",
    "^/recipe/get/(?P<rcp_id>\d+)/?$" => "item",
    "^/recipe/del/(?P<rcp_id>\d+)/?$" => "delete",
    "^/recipe/search/?$" => "search"
);

$pathObj = new PathParser($urls);
if (!$pathObj->view) $pathObj->view = "error";

include("views/api/".$pathObj->view.".php");

exit();

?>

