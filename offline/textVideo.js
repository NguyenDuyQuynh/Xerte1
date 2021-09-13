modelfilestrs['textVideo'] = hereDoc(function(){/*!
<script type="text/javascript">

	
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var textVideo = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			if ($("#pageVideo").hasClass('iframe') != true) {
				this.loadVideo();
			}
		}
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			var $pageVideo = $("#pageVideo");
			if ($pageVideo.hasClass('iframe')) {
				// scale the iframe so it stays the right aspect ratio & doesn't exceed the max size (60% of width by default but can be changed with opt property
				var iframeMax = x_currentPageXML.getAttribute("iframeMax");
				if ($.isNumeric(x_currentPageXML.getAttribute("iframeMax"))) {
					iframeMax = Number(x_currentPageXML.getAttribute("iframeMax"));
					iframeMax = Math.max(iframeMax, 0.1);
					iframeMax = Math.min(iframeMax, 1);
				} else {
					iframeMax = 0.6;
				}
				
				var maxW = x_browserInfo.mobile == true ? 1 : iframeMax,
					maxH = $x_pageHolder.height() - ($x_pageDiv.outerHeight() - $x_pageDiv.height()) - ($('.x_floatRight').outerHeight() - $('.x_floatRight').height());
				
				var width = $x_pageDiv.width() * maxW;
				var height = (width / Number($("#pageVideo").data('iframeRatio')[0])) * Number($("#pageVideo").data('iframeRatio')[1]) + 35;
				
				if (x_browserInfo.mobile != true && height > maxH) {
					height = maxH;
					width = ((height - 35) / Number($("#pageVideo").data('iframeRatio')[1])) * Number($("#pageVideo").data('iframeRatio')[0]);
				}
				$pageVideo
					.width(width)
					.height(height);
			}
		}
		
		this.init = function() {
			// text align
			$("#textHolder").html(x_addLineBreaks(x_currentPageXML.childNodes[0].nodeValue));
			var $panel = $("#pageContents .panel");
			
			var textAlign = x_currentPageXML.getAttribute("align"); // Left|Right|Top|Bottom
			if (textAlign == "Top" || textAlign == "Bottom") {
				if (textAlign == "Top") {
					$("#pageContents").prepend($("#textHolder"));
				}
				$("#pageContents .mobileAlign").addClass("centerAlign");
			} else if (textAlign == "Right") {
				$panel.addClass("x_floatLeft");
			} else {
				$panel.addClass("x_floatRight");
			}
			
			// transcript stuff
			var transcriptTxt = x_currentPageXML.getAttribute("transcript");
			if (transcriptTxt != undefined && transcriptTxt != "") {
				$("#transcript")
					.hide()
					.html(x_addLineBreaks(transcriptTxt));
				
				$("#transcriptBtn")
					.button({
						icons:	{secondary:"fa fa-x-btn-hide"},
						label:	(x_currentPageXML.getAttribute("transcriptTabTxt") != undefined ? x_currentPageXML.getAttribute("transcriptTabTxt") : "Transcript")
					})
					.attr("aria-expanded", false)
					.click(function() {
						$this = $(this);
						if ($this.attr("aria-expanded") == "false") {
							$("#transcript").slideDown();
							$this
								.attr("aria-expanded", true)
								.button({icons: {secondary:"fa fa-x-btn-show"}});
						} else {
							$("#transcript").slideUp();
							$this
								.attr("aria-expanded", false)
								.button({icons: {secondary:"fa fa-x-btn-hide"}});
						}
					});
			} else {
				$("#transcriptHolder").remove();
			}
			
			var $pageVideo = $("#pageVideo"),
				videoSrc = x_currentPageXML.getAttribute("url");
			
			if (videoSrc.substr(0,7) == "<iframe") {
				$("#pageContents .panel").removeClass("panel inline");
				
				$pageVideo
					.addClass('iframe')
					.append(videoSrc);
				
				if ($("#transcriptHolder").length > 0) {
					$("#transcript").width($pageVideo.width());
				}
				
				var iframeRatio = x_currentPageXML.getAttribute("iframeRatio") != "" && x_currentPageXML.getAttribute("iframeRatio") != undefined ? x_currentPageXML.getAttribute("iframeRatio") : '16:9';
				iframeRatio = iframeRatio.split(':');
				if (!$.isNumeric(iframeRatio[0]) || !$.isNumeric(iframeRatio[1])) {
					iframeRatio = [16,9];
				}
				$pageVideo.data('iframeRatio', iframeRatio);
				
			} else {
				var videoDimensions = [320,240];
				
				if (x_currentPageXML.getAttribute("movieSize") != "" && x_currentPageXML.getAttribute("movieSize") != undefined) {
					var dimensions = x_currentPageXML.getAttribute("movieSize").split(",");
					if (dimensions[0] != 0 && dimensions[1] != 0) {
						videoDimensions = dimensions;
					}
				}
				
				$pageVideo.data({
					"src"			:videoSrc,
					"dimensions"	:videoDimensions,
					"startEndFrame"	:[Number(x_currentPageXML.getAttribute("startFrame")), Number(x_currentPageXML.getAttribute("endFrame"))]
				});
				
				this.loadVideo();
				
				//controls toggle
				$(".panel.inline.x_floatRight")
					.mouseover(function(){
						$(".mejs-controls").show();
					})
					.mouseout(function(){
						$(".mejs-controls").hide();
					});
				
				if ($("#transcriptHolder").length > 0) {
					$("#transcript").width(videoDimensions[0]);
				}
			}
			
			textVideo.sizeChanged();
			x_pageLoaded();
		}
		
		this.loadVideo = function() {
			var $video = $("#pageVideo");
			$video.mediaPlayer({
				type			:"video",
				source			:$video.data("src"),
				width			:Number($video.data("dimensions")[0]),
				height			:Number($video.data("dimensions")[1]),
				startEndFrame	:$video.data("startEndFrame"),
				title			:x_currentPageXML.getAttribute("tip")
			});
		}
	}
	
	textVideo.init();
	
</script>


<div id="pageContents">
	
	<div class="mobileAlign"> <!-- this tag is only used when viewed on mobiles to change layout -->
		<div class="panel inline">
			<div id="pageVideo"></div>
			<div id="transcriptHolder">
				<button id="transcriptBtn"></button>
				<div id="transcript"></div>
			</div>
		</div>
	</div>
	
	<div id="textHolder"></div>
	
</div>

*/});