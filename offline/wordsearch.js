modelfilestrs['wordsearch'] = hereDoc(function(){/*!
<script type="text/javascript">


	// functions for model should be in here to avoid conflicts
	var wordsearch = new function () {

		var puzzle,
			words,
			hideSolveUntilTimer;

		// function called when timer reaches zero
		this.onTimerZero = function () {
			if (hideSolveUntilTimer) {
				$('#solve').show();
			}
		};

		this.init = function () {

			if(x_browserInfo.touchScreen){
				document.body.classList.add("stop-scrolling");
			}
			// add colour styles that can be changed by optional properties
			var colourStyles = "<style type='text/css'>",
				colour;

			function checkColour(colour) {
				if (colour == undefined || colour == "" || colour == "0x") {
					return false;
				} else {
					return true;
				}
			}

			colour = checkColour(x_currentPageXML.getAttribute("colour1")) ? x_getColour(x_currentPageXML.getAttribute("colour1")) : "#FFA500"; // default = orange
			colourStyles += "#puzzle .selected { background-color: " + colour + "; color: " + x_blackOrWhite(colour) + "; }";

			colour = checkColour(x_currentPageXML.getAttribute("colour2")) ? x_getColour(x_currentPageXML.getAttribute("colour2")) : "#0000FF"; // blue
			colourStyles += "#puzzle .found { background-color: " + colour + "; color: " + x_blackOrWhite(colour) + "; }";
			colourStyles += "#words .wordFound { color: " + colour + "; }";

			colour = checkColour(x_currentPageXML.getAttribute("colour3")) ? x_getColour(x_currentPageXML.getAttribute("colour3")) : "#800080"; // purple
			colourStyles += "#puzzle .solved { background-color: " + colour + "; color: " + x_blackOrWhite(colour) + "; }";

			colour = checkColour(x_currentPageXML.getAttribute("colour4")) ? x_getColour(x_currentPageXML.getAttribute("colour4")) : "#008000"; // green
			colourStyles += "#puzzle .complete { background-color: " + colour + "; color: " + x_blackOrWhite(colour) + "; }";
			colourStyles += "</style>";

			$("#pageContents").prepend(colourStyles);

			// Read optional parameters
			$("#textHolder").html(x_addLineBreaks(x_currentPageXML.getAttribute("text")));

			// Hide the solve button completely?
			var hideSolve = x_currentPageXML.getAttribute("hideSolve");
			hideSolve = (hideSolve === 'true') ? true : false;

			// Hide the solve button until the timer counts down?
			hideSolveUntilTimer = x_currentPageXML.getAttribute("hideSolveUntilTimer");
			hideSolveUntilTimer = (hideSolveUntilTimer === 'true') ? true : false;

			var hasTimer = (x_currentPageXML.getAttribute("timer") != null && x_currentPageXML.getAttribute("timer") != "");

			// Read language parameters if available
			solveBtnTxt = x_currentPageXML.getAttribute("solveBtnTxt");
			solveBtnTxt = (solveBtnTxt == undefined) ? "Solve Puzzle" : solveBtnTxt;
			retryBtnTxt = x_currentPageXML.getAttribute("retryBtnTxt");
			retryBtnTxt = (retryBtnTxt == undefined) ? "Restart Puzzle" : retryBtnTxt;

			// Load in the required scripts before we can begin
			$script.path(x_templateLocation + 'common_html5/js/wordfind/');
			$script(['wordfind.js', 'style.css'], function () {
				$script('wordfindgame.js', function () {
					wordsearch.begin();
				})
			});

			// Add a solve button and hide it if required
			$('<button>')
				.attr('id', 'solve')
				.click( function() {
					wordfindgame.solve(puzzle, words);
				})
				.text(solveBtnTxt)
				.toggle(!(hideSolve || hideSolveUntilTimer && hasTimer))
				.appendTo('#btnHolder');

			// Add a retry button
			$('<button>')
				.attr('id', 'retry')
				.click( function() {
					wordsearch.begin();
				})
				.text(retryBtnTxt)
				.appendTo('#btnHolder');

			$("#btnHolder button").button();
		}


		this.game = function () {
      var puzzleCase = x_currentPageXML.getAttribute('puzzleCase');

			// Get words and sort if required
      words = x_currentPageXML.getAttribute("words");

      // Force words case
      if (puzzleCase === 'lowercase' || puzzleCase === '' || puzzleCase === undefined)
        words = words.toLowerCase();
      else if (puzzleCase === 'uppercase' || puzzleCase == undefined)
        words = words.toUpperCase();

			words = $.trim(words).split("\n");
			switch(x_currentPageXML.getAttribute("order")) {
				case 'random':
					var tempWords = [];
					for (var i=0, len=words.length; i<len; i++) {
						var choice = Math.floor(Math.random() * words.length);
						tempWords.push(words[choice]);
						words.splice(choice, 1);
					}
					words = tempWords;
					break;

				case 'alphabetical':
					words.sort();
					break;

				default:
					break;
			}

			// Replace alphabet if the option is selectedIndex
			var options = {};
			if (x_currentPageXML.getAttribute('fillChars') !== undefined && x_currentPageXML.getAttribute('fillChars') !== '') {
				options.fillCharacters = x_currentPageXML.getAttribute('fillChars');
			}

				// start a word find game
				puzzle = wordfindgame.create(words, "#puzzle", "#words", options);

			// style the grid according to options

			if (puzzleCase !== '') {
				$("#puzzle .puzzleSquare").css('text-transform', (puzzleCase === 'lowercase' ? 'lowercase' : puzzleCase === 'uppercase' || puzzleCase == undefined ? 'uppercase' : 'initial') );
			}

			// hide word list or make sure word list height is no greater than wordsearch height
			if (x_currentPageXML.getAttribute('hideWords') == 'true') {
				$('#words').hide();
			}
			else if ($("#words").height() > $("#puzzle").height()) {
				var numCols = Math.ceil($("#words").height() / $("#puzzle").height()),
					maxW = 0;

				$("#words ul li").each(function() {
					if ($(this).width() > maxW) {
						maxW = $(this).width();
					}
				});
				maxW = (maxW / parseInt($("#puzzle").css("font-size"))) + 1;

				$("#words ul li").css({
					width: maxW + "em",
					float: "left"
				});

				$("#words ul").width(maxW * numCols + "em");
			}

			this.getSize();
		}

		this.begin = function () {
			wordsearch.game();
			// call this function in every model once everything's loaded
			x_pageLoaded();
		}

		this.sizeChanged = function() {
			this.getSize();
		}

		this.getSize = function() {
			// set minimum width for wordsearch panel so lines don't start breaking up
			var minW = 0;
			$("#puzzle div:first button").each(function() {
				minW += $(this).outerWidth();
			});
			minW += (parseInt($("#puzzle").css("padding-left")) + parseInt($("#puzzle").css("margin-left"))) * 2;
			minW += Math.ceil($("#words").outerWidth(true));

			$("#infoHolder").css("min-width", minW);
		}
	}

	wordsearch.init();
</script>

<div id="pageContents">

	<div id="infoHolder" class="panel x_floatRight">
		<div id="puzzleHolder">
			<div id="puzzle"></div>
			<div id="words"></div>
		</div>
		<div id="btnHolder"></div>
	</div>

	<div id="textHolder"></div>

</div>

*/});