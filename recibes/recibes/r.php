<html>
<body>
<form action='/api.php/recipe/add/' enctype='application/x-www-form-urlencoded' method='post'>
<div> <input type="input" size="75" name="headline" placeholder="Name it!"> </div>
<div> <input type="input" size="75" name="ingredient[]" placeholder="add ingredient to it!"> </div>
<div> <input type="input" size="75" name="ingredient[]" placeholder="add ingredient to it!"> </div>
<div> <input type="input" size="75" name="tag[]" placeholder="tag it!"> </div>
<div> <input type="input" size="75" name="tag[]" placeholder="tag it!"> </div>
<input type="submit" value="submit">
</form>
</body>
</html>


<?php
exit();
include('../sdk/RecibesApi.php');

$baseurl = "http://recibes-vagrant.local/";
$rcpAPI = new Recibes\ApiCalls($baseurl);

$datalst = array();
$datalst[] = array( 'headline' => 'apple pie', 
                    'body' => "bla bla bla ... then you have apple pie",
                    'ingredient' => array('apple'), 
                    'tag'=> array('bob', 'july'));
$datalst[] = array( 'headline' => 'blueberry cake', 
                    'body' => "bla bla bla ... then you have blueberry cake",
                    'ingredient' => array('blueberries', 'flour'), 
                    'tag'=> array('dig', 'july'));

$results = array_map(array($rcpAPI, "addIt"), $datalst);

print_r($results);

exit();

?>

