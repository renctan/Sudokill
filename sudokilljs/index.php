<html>

<head>
  <title>Dr Ecco</title>

  <link rel="stylesheet" href="css/palette.css">
  <link rel="stylesheet" href="css/common.css">
  <link rel="stylesheet" href="css/prompt.css">
  <link rel="stylesheet" href="css/sudokill.css">
  <link rel="stylesheet" href="css/player_list.css">
  <link rel="stylesheet" href="css/flatbutton.css">
</head>

<body>
<div class="post">
  <h2 class="title"><a href="#">Sudokill</a></h2>
</div>

<div id="board"></div>
<script src="sudokill.js"></script>
<br /><br />

  <!-- display the last and best scores -->
	<!-- open the connection with the dabatase -->
	<?php 
		// functions.php in case of an opening in the same window
		// ../../functions.php in case of an opening in a new window
	
		include '../../functions.php';
		getScores("sudokilljs");
	?>

</body>
</html>

