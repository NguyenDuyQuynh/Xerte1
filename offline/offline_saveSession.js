modelfilestrs['saveSession'] = hereDoc(function(){/*!
<script type="text/javascript">

 
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var saveSession = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			
		};
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			
		};
		
		this.init = function() {
		    var lti_only = (typeof lti_enabled != "undefined" && lti_enabled && XTTrackingSystem()!=="xAPI");
			var $closeText = $("#closingText");
			var closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("trackingCloseTxt")[0], "label", "<p>Do you want to stop with this session and continue later? If so, please press the button below to save this session.</p>");
			if (lti_only)
            {
                closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("trackingCloseTxtLtiOnly")[0], "label", "<p>Do you want to stop with this session? If so, please press the button below to stop this session and send the grade to the LMS.</p>");
            }
            $closeText.html(closeHtml);
            // ignores superscript support data in xml as it will do it automatically with <sub> <sup> tags

            if (XTGetMode().indexOf("normal") >= 0 || XTTrackingSystem() === "xAPI" || lti_only)
            {
                var lbl = (x_getLangInfo(x_languageData.find("saveSession").find("btnLabelTxt")[0], "label", "Save this session"));
                if (lti_only)
                {
                    lbl = (x_getLangInfo(x_languageData.find("saveSession").find("btnLabelTxtLtiOnly")[0], "label", "Close this session"));
                }
                $("#closeBtn").button({
                    label: lbl
                }).click(function(){
                    // Disable all the buttons and menu
                    XTTerminate();
                    $('#x_footerRight button').button("disable");
                    $('#closeBtn').hide();
                    if (typeof x_params["embed"] != "undefined")
                    {
                        $closeText.addClass('closeTextEmbed');
                        closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("closeTxtEmbedded")[0], "label", "<p>Your session has been saved. You need to refresh or revisit this page to access the session again.</p>");
                        if (lti_only)
                        {
                            closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("closeTxtEmbeddedLtiOnly")[0], "label", "<p>Your session has been stopped. You need to refresh or revisit this page to restart the content again.</p>");
                        }
                        $closeText.html(closeHtml)
                    }
                    else {
                        closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("closeTxt")[0], "label", "<p>Your session has been saved. You can now close the browser window or browser tab of this LO.</p>");
                        if (lti_only)
                        {
                            closeHtml = x_getLangInfo(x_languageData.find("saveSession").find("closeTxtLtiOnly")[0], "label", "<p>Your session has been stopped. You can now close the browser window or browser tab of this LO.</p>")
                        }
                        $closeText.html(closeHtml);
                    }
                });
            }

		}
	};

    saveSession.init();
	
</script>



<div id="saveSessionHolder">
    <div class="panel right" id="infoHolder">
        <div id="closingText"></div>
        <div class="center"><button id="closeBtn"></button></div>
    </div>
</div>

*/});