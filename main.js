// i suck at variable naming

clickTimes = [];
deviations = [];
timediffs = [];
testrunning = false;
function beginTest() {
    testrunning = true;
    clickLimit = Math.round(parseInt(document.getElementById('clickNum').value));
	timeLimit = Math.round(parseInt(document.getElementById('clickTime').value));
	if (timeLimit < 2)
	{
		alert("Please enter a value larger than 2");
		testrunning = false;
		return false;
	}
    if (clickLimit < 3)
    {
        alert("Please enter a value larger than 3");
        testrunning = false;
        return false;
    }
    clickTimes.length = 0;
    deviations.length = 0;
    timediffs.length = 0;
    beginTime = -1;
    key1 = $('#key1').val();
    key2 = $('#key2').val();
    $("div#status").html("Test ready, press key 1 or key 2 to begin.");
    $("div#Result").html("\
        Tap Speed: 0 taps / 0 seconds<br>\
        Stream Speed: 0 bpm<br>\
        Unstable Rate: 0.\
    ");
    localStorage.setItem('clickLimit', clickLimit);
	localStorage.setItem('timeLimit', timeLimit);
    localStorage.setItem('key1', key1);
    localStorage.setItem('key2', key2);
    std = 0;
	$("button#submit").hide();
	$("button#stopbtn").show();
    return true;
}

function radiof(num) {
	if (num == 1) {
		$("#numClicks").show();
		$("#timeClicks").hide();
	}
	if (num == 2) { // Not using else because maybe implement a both option
		$("#timeClicks").show();
		$("#numClicks").hide();
	}
}

function endTest() {
	testrunning = false;
	update(false);
	beginTime = -1;
	$("button#submit").html("Retry");
	$("div#status").html("Test Finished. Hit the Retry button or press Enter to try again.");
	//clearInterval(myVar);
	if ($("input[name='roption']:checked").val() == "time")
		window.clearInterval(endTimer);
	window.clearInterval(updater);
	$("button#submit").show();
	$("button#stopbtn").hide();
	return;
}

function update(click) {
	if (click) {
		if (timediffs.length > 0)
		{
			sum = timediffs.reduce(function(a, b){return a + b});
			avg = sum / timediffs.length;
			$.each(timediffs, function(i,v) {
				deviations[i] = (v - avg) * (v - avg);
			});
			variance = deviations.reduce(function(a, b) {return a + b;});
			std = Math.sqrt(variance / deviations.length);
			unstableRate = std * 10;
		}
		clickTimes.push(Date.now());
		if (clickTimes.length > 1)
			timediffs.push(clickTimes[clickTimes.length - 1] - clickTimes[clickTimes.length - 2]);

		//streamtime = (Date.now() - beginTime)/1000;
		//$("div#Result").html("\
		//	Tap Speed: " + (clickTimes.length.toString() + " taps / " + streamtime) + " seconds.<br>\
		//	Stream Speed: " + (Math.round((((clickTimes.length) / (Date.now() - beginTime) * 60000)/4) * 100) / 100) + " bpm.<br>\
		//	Unstable Rate: " + (Math.round(unstableRate * 100000) / 100000) + ".\
		//");
	} else {
		streamtime = (Date.now() - beginTime)/1000;
		if (timediffs.length < 2) {
			$("div#Result").html("\
			Tap Speed: " + (clickTimes.length.toString() + " taps / " + streamtime.toFixed(3)) + " seconds.<br>\
			Stream Speed: " + (Math.round((((clickTimes.length) / (Date.now() - beginTime) * 60000)/4) * 100) / 100).toFixed(2) + " bpm.<br>\
			Unstable Rate: n/a.\
		");
		} else {
		$("div#Result").html("\
			Tap Speed: " + (clickTimes.length.toString() + " taps / " + streamtime.toFixed(3)) + " seconds.<br>\
			Stream Speed: " + (Math.round((((clickTimes.length) / (Date.now() - beginTime) * 60000)/4) * 100) / 100).toFixed(2) + " bpm.<br>\
			Unstable Rate: " + (Math.round(unstableRate * 100000) / 100000).toFixed(3) + "\
		");
		}
	}
}

$(document).keypress(function(event)
{
    if (event.keyCode == 13 && testrunning == false) // unnecessary -> if (true == true)
        beginTest();
    if (testrunning == true) // if (true == true)
    {
        //if (String.fromCharCode(event.which) == key1 || String.fromCharCode(event.which) == key2)
        //{
            if ((String.fromCharCode(event.which) == key1) || (String.fromCharCode(event.which) == key2)) // Any reason there are two of these?
            {
                switch (beginTime)
                {
                    case -1:
                        beginTime = Date.now();
                        //clickTimes[0] = beginTime;
                        $("div#status").html("Test currently running.");
						updater = setInterval(function() { update(false); }, 16.6);
						
						if ($("input[name='roption']:checked").val() == "time") {
							endTimer = setTimeout(function() {
								endTest();
							}, timeLimit * 1000);
						}
                    default:
                        update(true);
                        break;
                }
                if ((clickTimes.length == clickLimit) && ($("input[name='roption']:checked").val() == "clicks"))
                {
                    endTest();
					return;
                }
            }
        //}
    }
});

$(document).ready(function() {
    if(!localStorage.getItem('clickLimit'))
        $("input#clickNum").val("20");
    else
        $("input#clickNum").val(localStorage.getItem('clickLimit'));
    if(!localStorage.getItem('key1'))
        $("input#key1").val("z");
    else
        $("input#key1").val(localStorage.getItem('key1'));
    if(!localStorage.getItem('key2'))
        $("input#key2").val("x");
    else
        $("input#key2").val(localStorage.getItem('key2'));
	if(!localStorage.getItem('timeLimit'))
		$("input#clickTime").val("10");
	else
		$("input#clickTime").val(localStorage.getItem('timeLimit'));
});