<?php
require_once("conf/config.php");
require_once("tools/Database.class.php");
require_once("models.php");
require_once("forms.php");

if (!headers_sent()) {
    header('Content-type: application/json; charset=utf-8');
    header("Cache-Control: max-age=0, s-maxage=0, no-cache, no-store, must-revalidate, post-check=0, pre-check=0, private");
    header('Access-Control-Allow-Origin: *');
}

$dbObj = new Database($conf);
$pgObj = new ApiPageObj($conf);

if ($pgObj->pagetype) {
    include("api/".$pgObj->pagetype.".php");
}

if (!@$tpl) {
    $tpl = array("error" => "invalid request");
}

echo json_encode($tpl);

exit();

class ApiPageObj {

    function __construct($conf) {
        $this->setPageType();
        $this->setNavBar();
    }

    private function setNavBar() {
        $bar = '<a href="/">Home</a>'; 
        if ($this->pagetype == "list") {
            $bar .= ' &gt; Recipes';
        } else {
            $bar .= ' &gt; <a href="/recipe.php">Recipes</a>';
        }
        if ($this->pagetype == "item") $bar .= ' &gt; Recipe';
        $this->navbar = $bar;
    }

    private function setPageType() {
        $pathkeys = $this::getPathKeys(); 
        $app = @$pathkeys[1];
        $act = @$pathkeys[2];
        $key = @$pathkeys[3];

        if ($app == "recipe") {
            $pagetype = $this->getRecipePageType($key, $act);
        } else {
            $pagetype = "";
        }
        $this->pagetype = $pagetype;
    }

    private function getRecipePageType($key, $act) {
        $pagetype = "";
        if (is_numeric($key)) {
            $rcp = new Recipe($key);
            if (!$rcp->id) return;
            $this->rcp = $rcp;
            switch ($act) {
                case "get";
                    $pagetype = "item";
                    break;
                case "del";
                    $pagetype = "delete";
                    break;
            }
        } elseif ((strtolower($key)) == "all") {
            if ($act == "get") $pagetype = "list";
        } else {
            if ($act == "add") $pagetype = "add";
        }
        return $pagetype;
    }

    private function getPathKeys() {
        return explode("/", trim($_SERVER['REQUEST_URI'], "/"));
    }

}

?>

