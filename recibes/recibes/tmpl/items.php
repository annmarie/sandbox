<!DOCTYPE html>
<html>
<head>
  <?php include("metatags.php"); ?>
  <?php include("css.php"); ?>
  <?php include("js.php"); ?>
  <title>Recibes</title>
</head>
<body>
<div id="mainContent">
<div class="breadcrumbs"><?php echo $pgObj->breadcrumbs; ?></div>
<div class="well">
<a href="/add">add a recipe</a>
<hr>

<ul>
<?php 
    $rcpLinks = array_map("makeRecipeLink", $pgObj->recipes);
    foreach($rcpLinks as $link) echo "<li>".$link."</li>"; 
?>
</ul>

<hr>
</div>
</div>
</body>
</html>
<?php
    function makeRecipeLink($rcp) {
        return "<a href='/".$rcp->id."/'>".$rcp->headline."</a>";
    }
?>
