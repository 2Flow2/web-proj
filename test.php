<!DOCTYPE html>
<html>
	<body>
		<h1>This is some HTML outside the PHP code</h1>
		<?php
			//This is a comment
			echo "<h1>This is a string inside the PHP code.</h1>"; #This is also a comment.
			ECHO "Only the text after the ECHOs should be displayed.";
			$var2 = "This is a variable";
			eCHo $var2;

			$gVar = 2;

			function myFunc(){
				$lVar = "This is a local variable.";
				global $gVar;
				echo $lVar;
				echo $gVar;
				$gVar = $gVar + 3; //If I add to the global variable, does it save the change outside of the function?
			}

			function myFunc2(){
				global $gVar;
				echo $gVar;
			}
			myFunc();
			myFunc2();
		?>
	</body>
</html>
