<?php

$post = new AddRecipeFormRequest();
if ($post->is_valid ) {
    $tpl = $post->do_save();
}

?>

