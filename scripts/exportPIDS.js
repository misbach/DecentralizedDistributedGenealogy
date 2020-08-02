// Exports an array of PIDs into a single JSON file

const util = require('util');
const fetch = require("node-fetch");
const fs = require('fs');
const streamPipeline = util.promisify(require('stream').pipeline)

var session = "a3599c7a-28c7-4c5e-bd5e-2a68f73590a3-prod";

// var pids = ["KWHH-HSW", "KWCR-B7J", "KWCB-KV1", "KWNF-8LZ", "9JTR-P86", "LCYQ-419", "LDJM-KRB", "LCJR-GZF", "KZQ3-2M7", "LDRW-154", "L5RP-Z7J", "LHDL-NLG"];
// var pids = ["KWCJ-FND", "LFXX-71D", "LH8M-TX3", "KGY4-8D5", "LZK2-LD4", "KCC5-JVD", "K2T2-QXR", "LYFH-GTV", "KDBK-Y4H", "LH5W-BDY", "K4FJ-GN8", "L5RP-Z7J"];
var pids = ["KWCC-9SJ", "KWZM-342", "KWNG-18V", "KWJ6-CLD", "LZF5-FFG", "LHDY-NTM", "LZBP-KZB", "LZHG-HDM", "LX94-669", "LHFN-XN7", "MHPW-XX5"];

let group = [];
const getPerson = async pid => {
	try {
		const rsp = await fetch("https://api.familysearch.org/platform/tree/persons/"+pid,
			{ headers: { 'Accept': 'application/json', 'Authorization': 'Bearer '+session, } }
		);
		const person = await rsp.json();
		group.push(person.persons[0]);

		// Save group file
		if (group.length == pids.length) {
			var dir = "scripts/data/";
			// if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
			var file = "scripts/data/group.json";
			fs.writeFile(file, JSON.stringify(group, null, 2), function(err) {
				if (err) { console.log("ERROR: "+err) }
				else { console.log("group file saved") }
			}); 
		}
	} catch (error) {
		console.log(error);
	}
};

// Loops through all PIDs
pids.forEach(function(pid) {
	getPerson(pid);

	(async ()=>{
		const response = await fetch("https://api.familysearch.org/platform/tree/persons/"+pid+"/portrait?default=http://vignette3.wikia.nocookie.net/grimm/images/a/a9/Unknown_Male.jpg", {
			headers: { 'Authorization': 'Bearer '+session }
		});
		if (!response.ok) throw new Error(`unexpected response ${response.statusText}`)
		await streamPipeline(response.body, fs.createWriteStream('scripts/data/'+pid+'.jpg'))
	})();

});
