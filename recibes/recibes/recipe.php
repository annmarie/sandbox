<!DOCTYPE html>
<?php
require_once("conf/config.php");
require_once("tools/Database.class.php");
require_once("tools/PathParser.class.php");
require_once("models.php");

$dbObj = new Database($conf);

$urls = array(
    "^$"  => "list",
    "^/add/?$"  => "add",
    "^/(?P<rcp_id>\d+)/?$" => "item",
);

$pathObj = new PathParser($urls);
$pgObj = new PageObj($pathObj->view);
if (!$pathObj->view) $pathObj->view = "error";

include("views/recipe/".$pathObj->view.".php");

exit();

class PageObj {

    function __construct($view) {
        $this->view = $view;
        $this->setBreadCrumbs();
    }

    private function setBreadCrumbs() {
        $bc = '<a href="/">Home</a>';
        if ($this->view == "list") {
            $bc .= ' &gt; Recipes';
        } else {
            $bc .= ' &gt; <a href="/recipe.php">Recipes</a>';
        }
        if ($this->view == "item") $bc .= ' &gt; Recipe';
        $this->breadcrumbs = $bc;
    }

} // end class PageObj

?>

