var json_program_string =  '{"days":{"Day 1 (Arms)":[{"Id":1,"Name":"Close-Grip Barbell Bench Press","History":[]},{"Id":2,"Name":"Close-Grip Pulldown","History":[]},{"Id":3,"Name":"Lying Triceps Press (Skull Crusher)","History":[]},{"Id":4,"Name":"Dumbbell Alternate Bicep Curl","History":[]},{"Id":5,"Name":"Dips","History":[]}],"Day 2 (Back)":[{"Id":6,"Name":"Pullups","History":[]},{"Id":7,"Name":"Deadlift","History":[]},{"Id":8,"Name":"Reverse Grip Bent-Over Rows","History":[]},{"Id":9,"Name":"Wide-Grip Lat Pulldown","History":[]},{"Id":10,"Name":"One-Arm Dumbbell Row","History":[]}],"Day 3 (Legs)":[{"Id":11,"Name":"Barbell Squat","History":[]},{"Id":12,"Name":"Leg Press","History":[]},{"Id":13,"Name":"Seated Leg Curl","History":[]},{"Id":14,"Name":"Leg Extensions","History":[]},{"Id":15,"Name":"Calf Raises","History":[]}],"Day 4 (Chest)":[{"Name":"Barbell Incline Bench Press Medium-Grip","History":[]},{"Id":16,"Name":"Dumbbell Bench Press","History":[]},{"Id":17,"Name":"Dumbbell Flys","History":[]},{"Id":18,"Name":"Bent-Arm Dumbbell Pullover","History":[]}],"Day 5 (Shoulders)":[{"Id":19,"Name":"Push Press","History":[]},{"Id":20,"Name":"Upright Barbell Row","History":[]},{"Id":21,"Name":"One-Arm Incline Lateral Raise","History":[]},{"Id":22,"Name":"Front Dumbbell Raise","History":[]},{"Id":23,"Name":"Bent Over Low-Pulley Side Lateral","History":[]}]}}';

var json_program_array = [];

var documentsDir;

var workoutFile;

function loadorCreateDataFile() {	
	tizen.filesystem.resolve('documents', function(dir) {
		documentsDir = dir;
		dir.listFiles(onsuccess, onerror);
	}, onerror, "rw");
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
	}, onerror, "UTF-8");	
		
	/*var history = { weight: 40, reps: 8, sets: 2, date: Date.now() };
	var strrr = JSON.stringify(history);
	console.log(strrr);*/
	
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
	}, onerror, "UTF-8");
}

function onerror(error) {
	console.log("Error: " + error.message);
}

