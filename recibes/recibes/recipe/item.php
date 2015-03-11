<?php 

    $rcp = $pgObj->rcp;
    $rcp->getIngredients();
    $rcp->getTags();

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

<div class="navbar"><?php echo $pgObj->navbar; ?></div>

<div class="well">
<hr>
<pre><?php print_r($rcp); ?></pre>
<hr>
</div>

</div>
</body>
</html>


