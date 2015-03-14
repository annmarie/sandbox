<?php
include("header.php");

$post = new AddRecipeFormRequest();
if ($post->is_valid ) {
    $tpl = $post->do_save();
} else {
    $tpl = array("error" => "there was a problem");
}

echo json_encode($tpl);

?>

