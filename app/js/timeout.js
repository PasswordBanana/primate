var idleTime = 0;
$(document).ready(function () {
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(timerIncrement, 60000); // 1 minute
});

function timerIncrement() {
    idleTime = idleTime + 1;
	if (idleTime ==1){
	alert("Time out soon. Please save your file first");
	}
    if (idleTime > 2) { 
		alert("Time out. Please log in again")
        window.location.reload();
    }
}