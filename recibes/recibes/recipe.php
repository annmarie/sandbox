<!DOCTYPE html>
<?php

require_once("conf/config.php");
require_once("tools/Database.class.php");
require_once("models.php");

$dbObj = new Database($conf);
$pgObj = new RecipePageObj($conf);

if ($pgObj->pagetype) {
    include("recipe/".$pgObj->pagetype.".php");
}

exit();

class RecipePageObj {

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
        $key = @$pathkeys[1];
        if (is_numeric($key)) {
            $rcp = new Recipe($key);
            if ($rcp->id) {
                $this->rcp = $rcp;
                $this->pagetype = "item";
            }
        } elseif ($key == "add") {
            $this->pagetype = "add";
        }
        if (empty($this->pagetype)) {
            $this->pagetype = "list";
        }
    }

    private function getPathKeys() {
        return explode("/", trim($_SERVER['REQUEST_URI'], "/"));
    }
}

?>

