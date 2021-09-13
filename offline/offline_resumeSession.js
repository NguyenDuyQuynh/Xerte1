modelfilestrs['resumeSession'] = hereDoc(function(){/*!
<script type="text/javascript">

 
	// pageChanged & sizeChanged functions are needed in every model file
	// other functions for model should also be in here to avoid conflicts
	var resumeSession = new function() {
		// function called every time the page is viewed after it has initially loaded
		this.pageChanged = function() {
			
		};
		
		// function called every time the size of the LO is changed
		this.sizeChanged = function() {
			
		};
		
		this.init = function() {
			var $mainText = $("#mainText");
			var mainText = x_getLangInfo(x_languageData.find("resumeSession").find("resumeTxt")[0], "label", "<p>Welcome back. Do you want to resume the session of {date} {time}? Choose 'Yes' to resume the session. Choose 'No' to start a new session.</p>");
			var canResume = XTCanResume();
			var dt = new Date(canResume.date);
			var language = x_params.language.substr(0,2);
			var dtStr = Intl.DateTimeFormat(language, { weekday: 'long', month: 'long', year: 'numeric', day: 'numeric' }).format(dt);
            var timeStr = Intl.DateTimeFormat(language, { hour: 'numeric', minute: 'numeric' }).format(dt);
			mainText = mainText.replace("{date}", dtStr);
			mainText = mainText.replace("{time}", timeStr);
            $mainText.html(mainText);
            // ignores superscript support data in xml as it will do it automatically with <sub> <sup> tags

            var nolbl = (x_getLangInfo(x_languageData.find("resumeSession").find("noBtnLbl")[0], "label", "No"));
            var yeslbl = (x_getLangInfo(x_languageData.find("resumeSession").find("yesBtnLbl")[0], "label", "Yes"));
            var cancellbl = (x_getLangInfo(x_languageData.find("resumeSession").find("cancelBtnLbl")[0], "label", "Cancel"));
            $("#yesBtn").button({
                label: yeslbl
            }).click(function(){
                // Disable all the buttons and menu
                XTSetOption('resume', true);
                $('#noBtn').hide();
                $('#yesBtn').hide();
                $('#cancelBtn').hide();
                $mainText.html(x_getLangInfo(x_languageData.find("resumeSession").find("closeTxtYes")[0], "label", "<p>Close this window to resume the session.</p>"));
            });
            $("#noBtn").button({
                label: nolbl
            }).click(function(){
                // Disable all the buttons and menu
                XTSetOption('resume', false);
                $('#noBtn').hide();
                $('#yesBtn').hide();
                $('#cancelBtn').hide();
                $mainText.html(x_getLangInfo(x_languageData.find("resumeSession").find("closeTxtNo")[0], "label", "<p>Close this window to start a new session.</p>"));
            });
            $("#cancelBtn").button({
                label: cancellbl
            }).click(function(){
                // Disable all the buttons and menu
                XTSetOption('resume', false);
                state.finished = true;
                $('#noBtn').hide();
                $('#yesBtn').hide();
                $('#cancelBtn').hide();
                $('#x_footerRight button').button("disable");
                $('button.ui-dialog-titlebar-close').hide();
                $mainText.html(x_getLangInfo(x_languageData.find("resumeSession").find("cancelTxtYes")[0], "label", "<p>You can now close the browser window or browser tab.</p>"));
            });
		}
	};

    resumeSession.init();
	
</script>



<div id="resumeSessionHolder">
    <div class="panel right" id="infoHolder">
        <div id="mainText"></div>
        <div class="center"><button id="yesBtn"></button>&nbsp;<button id="noBtn"></button>&nbsp;<button id="cancelBtn"></button></div>
    </div>
</div>

*/});