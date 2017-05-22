var json_program_string = '{"days":{"Day 1 (Arms)":[{"Id":1,"Name":"Close-Grip Barbell Bench Press"},{"Id":2,"Name":"Close-Grip Pulldown"},{"Id":3,"Name":"Lying Triceps Press (Skull Crusher)"},{"Id":4,"Name":"Dumbbell Alternate Bicep Curl"},{"Id":5,"Name":"Dips"}],"Day 2 (Back)":[{"Id":6,"Name":"Pullups"},{"Id":7,"Name":"Deadlift"},{"Id":8,"Name":"Reverse Grip Bent-Over Rows"},{"Id":9,"Name":"Wide-Grip Lat Pulldown"},{"Id":10,"Name":"One-Arm Dumbbell Row"}],"Day 3 (Legs)":[{"Id":11,"Name":"Barbell Squat"},{"Id":12,"Name":"Leg Press"},{"Id":13,"Name":"Seated Leg Curl"},{"Id":14,"Name":"Leg Extensions"},{"Id":15,"Name":"Calf Raises"}],"Day 4 (Chest)":[{"Id":16,"Name":"Barbell Incline Bench Press Medium-Grip"},{"Id":17,"Name":"Dumbbell Bench Press"},{"Id":18,"Name":"Dumbbell Flys"},{"Id":19,"Name":"Bent-Arm Dumbbell Pullover"}],"Day 5 (Shoulders)":[{"Id":20,"Name":"Push Press"},{"Id":21,"Name":"Upright Barbell Row"},{"Id":22,"Name":"One-Arm Incline Lateral Raise"},{"Id":23,"Name":"Front Dumbbell Raise"},{"Id":24,"Name":"Bent Over Low-Pulley Side Lateral"}]}}';

var json_program_array = [];

var documentsDir;

var workoutFile;

function loadOrCreateDataFile() {
	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		dir.listFiles(onsuccess, onerror);
	}, onError, "rw");
}

function onsuccess(files) {
	var fileLoaded = false;

	for (var i = 0; i < files.length; i++) {
		if (files[i].name === "workoutData.json") {
			fileLoaded = true;
			workoutFile = files[i];
			console.log("File found, " + files[i].name);
		}
	}

	if (!fileLoaded) {
		console.log("File not found, creating...");
		workoutFile = documentsDir.createFile("workoutData.json");
		json_program_array = JSON.parse(json_program_string);
		saveToFile();
	}

	workoutFile.readAsText(function(str) {
		json_program_array = JSON.parse(str);
		console.log("the file = " + workoutFile);
		console.log("the file, parsed = " + json_program_array);
		loadDays();
	}, onError, "UTF-8");
}

function saveToFile() {

	var jsonString = JSON.stringify(json_program_array);

	console.log("the file, stringified = " + jsonString);

	workoutFile.openStream("w", function(fs) {
		fs.write(jsonString);
		fs.position = 0;
		fs.read(fs.fileSize);
		fs.close();
		console.log("writing to file");
	}, onError, "UTF-8");
}

function loadThenDeleteDataFile() {
	tizen.filesystem.resolve('documents', function(dir) {
		dir.listFiles(function(files) {
			files
					.forEach(function(file) {
						if (!file.isDirectory) {
							if (file.name === "workoutData.json") {
								console.log("File found, deleting...");
								dir.deleteFile(file.fullPath, onDeleteSuccess,
										onError);
							}
						}
					})
		});
	});
}

function onDeleteSuccess() {
	var wipeToast = document.getElementById("wipeToast");
	tau.openPopup(wipeToast);
	loadOrCreateDataFile();
}

function onError(error) {
	console.log("Error: " + error.message);
}
