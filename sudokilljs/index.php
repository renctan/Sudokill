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

  <br />
  <br />

  <!-- scraped directly from https://github.com/renctan/Sudokill/wiki/How-to-Play -->
  <h1>How to Play</h1>

  <h2>Sudoku Rules</h2>

  <p>A standard Sudoku game plays in a 9x9 board. And the board can be further subdivided into 9 sectors, each sectors containing non-overlapping 3x3 cells. The objective of the game is to fill the entire board while following these constraints:</p>

  <ol>
    <li>Only numbers 1-9 can be used.</li>
    <li>There should be no repeating numbers within a row.</li>
    <li>There should be no repeating numbers within a column.</li>
    <li>There should be no repeating numbers within a sector.</li>
  </ol>

  <h2>Sudokill Rules</h2>

  <p>While the standard Sudoku is meant for a single player, Sudokill is meant for multiple players competing with each other. It still follows the standard Sudoku rules, with some additional rules:</p>

  <ol>
    <li>The first player can select which ever cells he/she wants to play on.</li>
    <li>The succeeding players should select a new cell that aligns with the last played move horizontally or vertically. The only exception to this rule is if the row and cells is completely filled.</li>
    <li>If a player cannot make any legal moves on his turn, he gets eliminated. Once a player get eliminated, the next player can choose where ever he wants to make a move.</li>
    <li>The last player that remains is the winner.</li>
  </ol>

  <h2>Playing with the Sudokill App</h2>

  <h3>Adding players</h3>

  <p>In order to start playing, there should at least be 2 players. To add a player, simply type in a name in the input box right above the add player button, then press the add player button. You can add as many player as you like. However, you cannot add a new player with the same name with the ones already in the list.</p>

  <p>The order of players will be from top to bottom of this list. If a player gets eliminated, he will simply be skipped. You can modify the order of the list by clicking the up and down buttons right next to the player's name. You can also remove a player from the list by clicking on the x button. Once the game starts, modifying the list will not affect the game order.</p>

  <h3>Playing the actual game</h3>

  <p>To start playing, just press the start game button once there are at least two players. The grey cells indicate cells that you cannot place a move on while a beige means the cell is playable. A cell will also be marked with an 'X' if there are no legal moves available for that cell.</p>

</body>
</html>

