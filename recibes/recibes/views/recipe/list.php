<?php

$rcpsObj = new Recipes();
$recipes = $rcpsObj->all();
$rcpLinks = array_map("makeRecipeLink", $recipes);

?>
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
<a href="/recipe.php/add/">add a recipe</a>
<hr>

<ul>
<?php foreach($rcpLinks as $link) echo "<li>".$link."</li>"; ?>
</ul>

<hr>
</div>
</div>
</body>
</html>
<?php

function makeRecipeLink($rcp) {
    return "<a href='/recipe.php/".$rcp->id."/'>".$rcp->headline."</a>";
};

?>
