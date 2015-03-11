<html>
<head>
  <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
  <meta http-equiv="Pragma" content="no-cache" />
  <meta http-equiv="Expires" content="0" />
  <?php include("metatags.php"); ?>
  <?php include("css.php"); ?>
  <?php include("js.php"); ?>
  <title>Recibes</title>
</head>
<body>
<div id="mainContent">
<div class="navbar"><?php echo $pgObj->navbar; ?></div>

<div class="well">
<form action='' enctype='multipart/form-data' method='post'>
<div> <input type="input" size="75" name="headline" placeholder="Name it!"> </div>
<div> <textarea cols="75" rows="25" name="body">put your recipe here..</textarea> </div>
<div> <textarea cols="75" rows="4" name="notes"></textarea> </div>
<input type="submit" value="submit">
</form>


<hr>
</div>

</div>
</body>
</html>

<hr>
