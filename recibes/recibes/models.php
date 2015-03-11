<?php


class Recipes {

    public function __construct($whitelist=null) {
        # TODO: get whitelist working 
        if(is_array($whitelist)) $this->whitelist = $whitelist;
    }

    public function search($phrase) {
        if (!$phrase) return;
        $q = "SELECT id FROM recipe WHERE rcp_headline LIKE '%".$phrase."%'";
        return $this->fetch($q);
    }

    public function all() {
        $q = "SELECT id FROM recipe";
        return $this->fetch($q);
    }

    private function fetch($q) {
        if (!$q) return;
        $items = array();
        $a = $this->db()->fetch_all_array($q);
        foreach ($a as $row) {
            $id = (int)$row['id'];
            if ($id) $items[] = new Recipe($id);
        }
        return $items;
    }

    private function db() { global $dbObj; return $dbObj; }
}


class Recipe {

    public function __construct($id=0) {
        $this->id = (int)$id;
        $this->headline = "";
        $this->body  = "";
        $this->notes  = "";
        $this->fetch();
    }

    public function saveIt() {
        if ($this->id) {
            $q = "UPDATE recipe SET";
            $q .= " rcp_headline='".$this->headline."',";
            $q .= " rcp_body='".$this->body."',";
            $q .= " rcp_notes='".$this->notes."'";
            $q .= " WHERE id=" . $this->id;
            $this->db()->query($q);
        } else {
            if (!$this->headline) return;
            $q = "INSERT INTO recipe";
            $q .= " (rcp_headline, rcp_body, rcp_notes)";
            $q .= " VALUES ";
            $q .= "('".$this->headline."','". $this->body."','".$this->notes."')";
            $this->db()->query($q);
            $this->id = $this->db()->last_id();
        }
        $this->fetch();
    }

    public function removeIt() {
        if (!$this->id) return;
        $q = "DELETE FROM recipe where id=". $this->id;
        $this->db()->query($q);
        $q = "DELETE FROM recipe_ingredient WHERE rcp_id=". $this->id;
        $this->db()->query($q);
        $q = "DELETE FROM recipe_tag WHERE rcp_id=". $this->id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if (!$this->id) return;
        $q = "SELECT * from recipe where id =". $this->id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id'];
            $this->headline = $a[0]['rcp_headline'];
            $this->body = $a[0]['rcp_body'];
            $this->notes = $a[0]['rcp_notes'];
            $this->image_id = (int)$a[0]['rcp_img_id'];
            $this->updated = $a[0]['updated'];
            $this->created = $a[0]['created'];
        } else {
            $this->id = 0;
        }
    }

    public function getIngredients() {
        if (!$this->id) return;
        $this->ingredients = array();
        $q = "SELECT ingr_id FROM recipe_ingredient WHERE rcp_id=". $this->id;
        $q .= " ORDER BY ingr_order";
        $a = $this->db()->fetch_all_array($q);
        foreach ($a as $i) {
            $rcpingr = new RecipeIngredient($this->id, $i['ingr_id']);
            if ($rcpingr->id) {
                $ingr = new Ingredient($rcpingr->ingr_id);
                if ($ingr->id) {
                    $rcpingr->ingrObj = $ingr; 
                    $this->ingredients[] = $rcpingr; 
                }
            }
        }
        return $this->ingredients;
    }

    public function addIngredient($item) {
        if (!$item) return;
        $ingr = new Ingredient();
        $ingr->item = $item;
        $ingr->saveIt();
        $rcpingr = new RecipeIngredient($this->id, $ingr->id);
        $rcpingr->saveIt();
        return $rcpingr;
    }

    public function getTags() {
        if (!$this->id) return;
        $this->tags = array();
        $q = "SELECT tag_id FROM recipe_tag WHERE rcp_id=". $this->id;
        $q .= " ORDER BY tag_rank";
        $a = $this->db()->fetch_all_array($q);
        foreach ($a as $i) {
            $rcptag = new RecipeTag($this->id, $i['tag_id']);
            if ($rcptag->id) {
                $tag = new Tag($rcptag->tag_id);
                if ($tag->id) {
                    $rcptag->tagObj = $tag; 
                    $this->tags[] = $rcptag; 
                }
            }
        }
        return $this->tags;
    }

    public function addTag($item) {
        if (!$item) return;
        $tag = new Tag();
        $tag->item = $item;
        $tag->saveIt();
        $rcptag = new RecipeTag($this->id, $tag->id);
        $rcptag->saveIt();
        return $rcptag; 
    }

    private function db() { global $dbObj; return $dbObj; }
}


class Ingredient {

    public function __construct($id=0) {
        $this->id = (int)$id;
        $this->item = ""; 
        $this->fetch();
    }

    public function saveIt() {
        if (!$this->item) return;
        $this->fetch();
        if ($this->id) {
            $q = "UPDATE ingredient SET";
            $q .= " ingr_item='".$this->item."'";
            $q .= " WHERE id=" . $this->id;
            $this->db()->query($q);
        } else {
            $item = strtolower($this->item);
            $q = "SELECT * FROM ingredient WHERE ingr_item='". $item ."'";
            $a = $this->db()->fetch_all_array($q);
            $this->id = ($a) ? $a[0]['id'] : null;
            if(!$this->id) {
                $q = "INSERT INTO ingredient (ingr_item) VALUES ('". $item ."')";
                $this->db()->query($q);
                $this->id = $this->db()->last_id();
            }
        }
        $this->fetch();
    }

    public function removeIt() {
        if (!$this->id) return;
        $q = "DELETE ingredient where id=". $this->id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if (!$this->id) return;
        $q = "SELECT * from ingredient where id =". $this->id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id'];
            $this->item = $a[0]['ingr_item'];
            $this->image_id = (int)$a[0]['ingr_img_id'];
            $this->updated = $a[0]['updated'];
            $this->created = $a[0]['created'];
        } else {
            $this->id = 0; 
        }
    }

    private function db() { global $dbObj; return $dbObj; }
}

class RecipeIngredient {

    public function __construct($rcp_id=0, $ingr_id=0) {
        $this->id = 0;
        $this->rcp_id = (int)$rcp_id;
        $this->ingr_id = (int)$ingr_id;
        $this->amount = ""; 
        $this->order = 0; 
        $this->fetch();
    }

    public function saveIt() {
        if ($this->id) {
            if ((!$this->amount) and (!$this->order)) return;
            $q = "UPDATE recipe_ingredient SET";
            $q .= " ingr_amount='".$this->amount."',";
            $q .= " ingr_order=".$this->order;
            $q .= " WHERE rpc_id=" . $this->rcp_id;
            $q .= " AND ingr_id=" . $this->ingr_id;
            $this->db()->query($q);
        } else {
            $q = "SELECT id FROM recipe WHERE id=".$this->rcp_id; 
            $a = $this->db()->fetch_all_array($q);
            $this->rcp_id = ($a) ? $a[0]['id'] : 0;
            $q = "SELECT id FROM ingredient WHERE id=".$this->ingr_id; 
            $a = $this->db()->fetch_all_array($q);
            $this->ingr_id = ($a) ? $a[0]['id'] : 0;
            if ((!$this->rcp_id) and (!$this->ingr_id)) return;
            $q = "INSERT INTO recipe_ingredient (rcp_id,ingr_id,ingr_amount,ingr_order) ";
            $q .= "VALUES (".$this->rcp_id.",".$this->ingr_id.",'".$this->amount."',".$this->order.")";
            $this->db()->query($q);
            $this->id = $this->db()->last_id();
        }
        $this->fetch();
    }

    public function removeIt() {
        if ((!$this->rcp_id) and (!$this->ingr_id)) return;
        $q = "DELETE recipe_ingredient WHERE rcp_id=". $this->rcp_id;
        $q .= " AND ingr_id=". $this->ingr_id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if ((!$this->rcp_id) and (!$this->ingr_id)) return;
        $q = "SELECT * FROM recipe_ingredient  WHERE rcp_id=". $this->rcp_id; 
        $q .= " AND ingr_id=". $this->ingr_id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id'];
            $this->rcp_id = (int)$a[0]['rcp_id'];
            $this->ingr_id = (int)$a[0]['ingr_id'];
            $this->amount = $a[0]['ingr_amount'];
            $this->order = (int)$a[0]['ingr_order'];
            $this->updated = $a[0]['updated'];
            $this->created = $a[0]['created'];
        } else {
            $this->id = 0; 
        }
    }

    private function db() { global $dbObj; return $dbObj; }
}


class Tag {

    public function __construct($id=0) {
        $this->id = (int)$id;
        $this->item = ""; 
        $this->fetch();
    }

    public function saveIt() {
        if (!$this->item) return;
        if ($this->id) {
            $q = "UPDATE tag SET";
            $q .= " ingr_item='".$this->item."',";
            $q .= " WHERE id=" . $this->id;
            $this->db()->query($q);
        } else {
            $item = strtolower($this->item);
            $q = "SELECT id FROM tag WHERE tag_item='". $item ."'";
            $a = $this->db()->fetch_all_array($q);
            $this->id = ($a) ? $a[0]['id'] : null;
            if(!$this->id) {
                $q = "INSERT INTO tag (tag_item) VALUES ('". $item ."')";
                $this->db()->query($q);
                $this->id = $this->db()->last_id();
            }
        }
        $this->fetch();
    }

    public function removeIt() {
        if (!$this->id) return;
        $q = "DELETE tag where id=". $this->id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if (!$this->id) return;
        $q = "SELECT * from tag where id =". $this->id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id'];
            $this->item = $a[0]['tag_item'];
            $this->image_id = (int)$a[0]['tag_img_id'];
        } else {
            $this->id = 0; 
        }
    }

    private function db() { global $dbObj; return $dbObj; }
}

class RecipeTag {

    public function __construct($rcp_id=0, $tag_id=0) {
        $this->id = 0;
        $this->rcp_id = (int)$rcp_id;
        $this->tag_id = (int)$tag_id;
        $this->rank = 0;
        $this->fetch();
    }

    public function saveIt() {
        if ($this->id) {
            if (!$this->rank) return;
            $q = "UPDATE recipe_tag SET";
            $q .= " tag_rank=".$this->rank.",";
            $q .= " WHERE rpc_id=" . $this->rcp_id;
            $q .- " AND tag_id=" . $this->tag_id;
            $this->db()->query($q);
        } else {
            $q = "SELECT id FROM recipe WHERE id=".$this->rcp_id; 
            $a = $this->db()->fetch_all_array($q);
            $this->rcp_id = ($a) ? $a[0]['id'] : 0;
            $q = "SELECT id FROM tag WHERE id=".$this->tag_id; 
            $a = $this->db()->fetch_all_array($q);
            $this->tag_id = ($a) ? $a[0]['id'] : 0;
            if ((!$this->rcp_id) and (!$this->tag_id)) return;
            $q = "INSERT INTO recipe_tag (rcp_id,tag_id,tag_rank) ";
            $q .= "VALUES (".$this->rcp_id.",".$this->tag_id.",".$this->rank.")";
            $this->db()->query($q);
            $this->id = $this->db()->last_id();
        }
        $this->fetch();
    }

    public function removeIt() {
        if ((!$this->rcp_id) and (!$this->tag_id)) return;
        $q = "DELETE recipe_tag WHERE rcp_id=". $this->rcp_id;
        $q .= " AND tag_id=". $this->tag_id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if ((!$this->rcp_id) and (!$this->tag_id)) return;
        $q = "SELECT * FROM recipe_tag  WHERE rcp_id=". $this->rcp_id; 
        $q .= " AND tag_id=". $this->tag_id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id']; 
            $this->rcp_id = (int)$a[0]['rcp_id'];
            $this->tag_id = (int)$a[0]['tag_id'];
            $this->rank = (int)$a[0]['tag_rank'];
            $this->updated = $a[0]['updated'];
            $this->created = $a[0]['created'];
        } else {
            $this->id = 0; 
        }
    }

    private function db() { global $dbObj; return $dbObj; }
}

class Image {

    public function __construct($id=0) {
        $this->id = (int)$id;
        $this->fetch();
    }

    public function removeIt() {
        if (!$this->id) return;
        $q = "DELETE image where id=". $this->id;
        $this->db()->query($q);
        $this->id = 0;
    }

    private function fetch() {
        if (!$this->id) return;
        $q = "SELECT * from image where id =". $this->id;
        $a = $this->db()->fetch_all_array($q);
        if ($a) {
            $this->id = (int)$a[0]['id'];
            $this->filepath = $a[0]['tag_filepath'];
            $this->updated = $a[0]['updated'];
            $this->created = $a[0]['created'];
        } else {
            $this->id = 0; 
        }
    }

    private function db() { global $dbObj; return $dbObj; }
}

?>

