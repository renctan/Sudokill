<html>

<head>
  <title>Dr Ecco</title>

  <link rel="stylesheet" href="games/sudokilljs/css/palette.css">
  <link rel="stylesheet" href="games/sudokilljs/css/common.css">
  <link rel="stylesheet" href="games/sudokilljs/css/prompt.css">
  <link rel="stylesheet" href="games/sudokilljs/css/sudokill.css">
  <link rel="stylesheet" href="games/sudokilljs/css/player_list.css">
  <link rel="stylesheet" href="games/sudokilljs/css/flatbutton.css">
</head>

<body>
<div class="post">
  <h2 class="title"><a href="#">Sudokill</a></h2>
</div>

<div id="board"></div>
<script src="games/sudokilljs/sudokill.js"></script>
<br /><br />

  <!-- display the last and best scores -->
	<!-- open the connection with the dabatase -->
	<?php 
		// functions.php in case of an opening in the same window
		// ../../functions.php in case of an opening in a new window
	
		include 'functions.php';
		getScores("sudokilljs");
	?>

</body>
</html>

