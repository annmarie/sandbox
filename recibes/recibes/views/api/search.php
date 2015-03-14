<?php
include("header.php");

$searchform = new SearchFormRequest();
if ($searchform->is_valid ) {
    $tpl = $searchform->do_search();
} else {
    $tpl = array("error" => "there was a problem");
}

echo json_encode($tpl);

?>

