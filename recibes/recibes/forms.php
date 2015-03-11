<?php

class AddRecipeFormRequest {

    function __construct() {
        $this->headline = htmlentities(@$_POST['headline']);
        $this->body = htmlentities(@$_POST['body']);
        $this->notes = htmlentities(@$_POST['notes']);
        $this->ingredient = $this->parseArray('ingredients');
        $this->tag = $this->parseArray('tag');
        $this->is_valid = ($this->headline) ? 1 : 0;
    }

    public function do_save() {
        $rcp = new Recipe();
        $rcp->headline = $this->headline;
        $rcp->body = $this->body;
        $rcp->notes = $this->notes;
        $rcp->saveIt();
        if ($rcp->id) {
            if ($this->ingredient) {
                foreach ($this->ingredient as $ingr) {
                    $rcp->addIngredient($ingr);
                }
                $rcp->getIngredients();
            }
            if ($this->ingredient) {
                foreach ($post->tag as $tag) {
                    $rcp->addTag($tag);
                }
                $rcp->getTags();
            }
        }
        return $rcp;
    }

    private function parseArray($key) {
        if (!is_array(@$_POST[$key])) return array();
        return array_map("htmlentities", $_POST[$key]);
    }
}

?>

