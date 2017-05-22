var currentDay = "";
var currentExercise = [];

var currentProgram = [];
var currentHistory = [];

var currentWeightValue = 0;
var currentRepsValue = 0;
var currentSetsValue = 0;

var vList;

(function(tau) {
	window.addEventListener("pageshow", function(e) {

		page = e.target;

		if (page.id === "main") {
			console.log("page-main");
			if (vList) {
				vList.destroy();
			}
			loadOrCreateDataFile();
			// loadDays();
		}

		if (page.id === "program") {
			console.log("page-program");
			if (vList) {
				vList.destroy();
			}
			loadExercises();
		}

		if (page.id === "exercise") {
			console.log("page-exercise");
			loadHistory();
		}

	});

	window.addEventListener("pagehide", function() {
		vList.destroy();
	});

}(tau));

function loadDays() {

	var elList = document.getElementById("dayList");

	elList.innerHTML = '';

	console.log(json_program_array);

	var data = Object.keys(json_program_array.days);

	vList = tau.widget.VirtualListview(elList, {
		dataLength : data.length,
		bufferSize : 40
	});

	vList.setListItemUpdater(function(elListItem, newIndex) {
		elListItem.innerHTML = '<a href="program.html" '
				+ 'onclick="navigateDay(\'' + data[newIndex] + '\');" '
				+ 'class="btn-text ui-btn ui-inline">' + data[newIndex]
				+ '</a>';
	});

	vList.draw();

	currentDay = "";
}

function loadExercises(day) {

	var elList = document.getElementById("exerciseList");

	elList.innerHTML = '';

	console.log("List Cleared");

	var vlist = tau.widget.VirtualListview(elList, {
		dataLength : currentProgram.length,
		bufferSize : 40
	});

	vlist.setListItemUpdater(function(elListItem, newIndex) {
		var data = currentProgram[newIndex];

		elListItem.innerHTML = '<a href="exercise.html" '
				+ 'onclick="navigateExercise(\'' + data.Id + '\');" '
				+ 'class="btn-text ui-btn ui-inline">' + data.Name + '</a>';
	});

	vlist.draw();
}

function populateLasts(weight, reps, sets) {
	var lastWeight = document.getElementById("lastWeight");
	var lastReps = document.getElementById("lastReps");
	var lastSets = document.getElementById("lastSets");

	lastWeight.innerHTML = weight;
	lastReps.innerHTML = reps;
	lastSets.innerHTML = sets;
}

function populateCurrents() {
	var currentWeight = document.getElementById("currentWeight");
	var currentReps = document.getElementById("currentReps");
	var currentSets = document.getElementById("currentSets");

	currentWeight.innerHTML = currentWeightValue.toFixed(1);
	currentReps.innerHTML = currentRepsValue;
	currentSets.innerHTML = currentSetsValue;
}

function wipeDataPrompt() {
	var wipePrompt = document.getElementById("wipePrompt");
	tau.openPopup(wipePrompt);
}

function wipeDataCancel() {
	tau.closePopup()
}

function wipeDataConfirm() {
	loadThenDeleteDataFile();
}

function loadHistory() {

	console.log(currentProgram);
	console.log("currentExercise:" + currentExercise);

	currentWeightValue = 30;
	currentRepsValue = 10;
	currentSetsValue = 3;

	var lastHistory = [];

	if (!currentExercise.History) {
		currentHistory = [];
		populateLasts("None", "None", "None");
		populateCurrents();
	} else {
		var maxDate = 0;
		currentExercise.History.forEach(function(item, index) {
			if (item.date > maxDate) {
				maxDate = item.date;
				lastHistory = item;
			}
		})

		if (lastHistory) {
			currentWeightValue = lastHistory.weight;
			currentRepsValue = lastHistory.reps;
			currentSetsValue = lastHistory.sets;
			populateLasts(lastHistory.weight.toFixed(1), lastHistory.reps,
					lastHistory.sets);
			populateCurrents();
		}
	}

	console.log("lastHistory:" + lastHistory);

	var exerciseTitle = document.getElementById("exerciseTitle");

	exerciseTitle.innerHTML = currentExercise.Name;
}

function logEntry() {

	var entry = {
		weight : currentWeightValue,
		reps : currentRepsValue,
		sets : currentSetsValue,
		date : Date.now()
	};
	if (!currentExercise.History) {
		currentExercise.History = [];
	}
	currentExercise.History.push(entry);
	saveToFile();
	
	var logToast = document.getElementById("logToast");
	tau.openPopup(logToast);	
}

function navigateDay(day) {

	console.log("Day:" + day);

	currentDay = day;

	currentProgram = [];

	currentProgram = json_program_array.days[day];

	return false;
}

function navigateExercise(id) {

	currentProgram.forEach(function(item, index) {
		if (item.Id) {
			if (item.Id.toString() === id.toString()) {
				currentExercise = item;
			}
		}
	});

	return false;
}

function weightUp() {
	currentWeightValue -= 0.5;
	populateCurrents();
}

function weightDown() {
	currentWeightValue += 0.5;
	populateCurrents();
}

function repsUp() {
	currentRepsValue -= 1;
	populateCurrents();
}

function repsDown() {
	currentRepsValue += 1;
	populateCurrents();
}

function setsUp() {
	currentSetsValue += 1;
	populateCurrents();
}

function setsDown() {
	currentSetsValue -= 1;
	populateCurrents();
}
