//GLOBAL VARIABLES
//Functions are at the bottom.

var tense;
var url;
var dataToUse = {};
var id;
var tenseCount = 0;

//update this variable with the maxiumum number of tenses stored.
var tenseMax = 2;

$(document).ready(function() {
	console.log("sanity check. JS is working");

	$("input.verb-search").keydown(function handler(event) {
		if (event.which === 13) {
			// console.log("Hey there");
			var infinitive = $(this).val().toLowerCase();
			var family = infinitive.slice(infinitive.length-2, infinitive.length);
			if (family === "er" || family === "re" || family === "ir") {
				var url = "/api/verbname/" + infinitive;
				$.ajax({
					method: "GET",
					url: url,
					success: function (data) {
						//Checks that there is actually information to work with
						if (data.length > 0) {
							$(".search-error").empty();
							renderConjugation(data[0]);
							tense = "present";
						} else {
							$(".search-error").html("Dommage ! Il me semble que ce verbe n'existe pas.<br />" +
								"Oops! Looks like this verb doesn't exist yet.<br />" +
								"<button class='btn btn-primary new-verb'>Create?</button>");
							$("#verbs").empty();
						}
					},
					error: function (error) {
						console.log("search error: ", error);
						$("#verbs").empty();
						$(".search-error").html("Search currently unavailable.");
					}
				});
			} else {
				$("#verbs").empty();
				$(".search-error").html("Euh, je ne crois pas que ce soit un verbe.<br />Please type a valid infinitive.");
			}
		}
	});

	$("#verbs").on('click', '.present', function (event) {
		id = $(".row.verb-conjugation").attr('id');
		// console.log(id);
		$.ajax({
			method: "GET",
			data: {_id: id},
			url: "/api/verbid/" + id,
			success: function (data) {
				// console.log(data);
				tense = "present";
				$(".je").text(data.tense.present.je);
				$(".tu").text(data.tense.present.tu);
				$(".il").text(data.tense.present.il);
				$(".nous").text(data.tense.present.nous);
				$(".vous").text(data.tense.present.vous);
				$(".ils").text(data.tense.present.ils);
				$(".tense").removeClass("btn-success");
				$(".tense").addClass("btn-primary");
				$(".present").addClass("btn-success");
			},
			error: function (error) {
				console.log("Present tense error: ", error);
			}
		});
	});

	$("#verbs").on('click', '.imparfait', function (event) {
		id = $(".row.verb-conjugation").attr('id');
		// console.log(id);
		$.ajax({
			method: "GET",
			data: {_id: id},
			url: "/api/verbid/" + id,
			success: function (data) {
				// console.log(data);
				tense = "imparfait";
				$(".je").text(data.tense.imparfait.je);
				$(".tu").text(data.tense.imparfait.tu);
				$(".il").text(data.tense.imparfait.il);
				$(".nous").text(data.tense.imparfait.nous);
				$(".vous").text(data.tense.imparfait.vous);
				$(".ils").text(data.tense.imparfait.ils);
				$(".tense").removeClass("btn-success");
				$(".tense").addClass("btn-primary");
				$(".imparfait").addClass("btn-success");
			},
			error: function (error) {
				console.log("Imparfait tense error: ", error);
			}
		});
	});

	$("#verbs").on('click', '.edit-tense.edit', function (event) {
		$(".edit-tense.save").show();
		$(".edit-tense.edit").hide();
		var je = $(".je").text();
		var tu = $(".tu").text();
		var il = $(".il").text();
		var nous = $(".nous").text();
		var vous = $(".vous").text();
		var ils = $(".ils").text();
		$(".je").html("<input type='text' class='je'>");
		$("input.je").val(je);
		$(".tu").html("<input type='text' class='tu'>");
		$("input.tu").val(tu);
		$(".il").html("<input type='text' class='il'>");
		$("input.il").val(il);
		$(".nous").html("<input type='text' class='nous'>");
		$("input.nous").val(nous);
		$(".vous").html("<input type='text' class='vous'>");
		$("input.vous").val(vous);
		$(".ils").html("<input type='text' class='ils'>");
		$("input.ils").val(ils);
	});

	$("#verbs").on('click', '.edit-tense.save', function (event) {
		$(".edit-tense.edit").show();
		$(".edit-tense.save").hide();
		id = $(".row.verb-conjugation").attr('id');
		var je = $("input.je").val();
		var tu = $("input.tu").val();
		var il = $("input.il").val();
		var nous = $("input.nous").val();
		var vous = $("input.vous").val();
		var ils = $("input.ils").val();
		dataToUse.tense = tense;
		dataToUse.je = je;
		dataToUse.tu = tu;
		dataToUse.il = il;
		dataToUse.nous = nous;
		dataToUse.vous = vous;
		dataToUse.ils = ils;
		$.ajax({
			method: "PUT",
			url: "/api/verbid/" + id,
			data: dataToUse,
			success: function (data) {
				$("span.je").html(je);
				$("span.tu").html(tu);
				$("span.il").html(il);
				$("span.nous").html(nous);
				$("span.vous").html(vous);
				$("span.ils").html(ils);
			},
			error: function (error) {
				console.log(error);
			}
		});
	});

	$(".search-error").on('click', 'button.new-verb', function (event) {
		tense = "present";
		$("span.new-verb.je").html("<input class='new-verb je'>");
		$("span.new-verb.tu").html("<input class='new-verb tu'>");
		$("span.new-verb.il").html("<input class='new-verb il'>");
		$("span.new-verb.nous").html("<input class='new-verb nous'>");
		$("span.new-verb.vous").html("<input class='new-verb vous'>");
		$("span.new-verb.ils").html("<input class='new-verb ils'>");
		tenseCount = 1;
		tenseChecker(tenseCount);
		var infinitive = $("input.verb-search").val().toLowerCase();
		var family = infinitive.slice(infinitive.length-2, infinitive.length);
		var stem = infinitive.slice(0, infinitive.length-2);

		dataToUse.infinitive = infinitive;
		dataToUse.family = family;
		dataToUse.tense = {};

		$(".modal-title .new-infinitive").text(infinitive);
		$(".irregular-flag").prop('checked', false);

		//hiding buttons that are currently unnecessary
		$(".save-tense").show();
		$(".next-tense").hide();
		$("#createVerb").hide();
		$("#newVerbModal").modal("show");
		//Applies the appropriate logic to verbs depending on their family.
		conjugateVerb(infinitive, tenseChecker(tenseCount));
	});

	$(".save-tense").click(function (event) {
		//hides the save button and displays appropriate buttons to cycle between tense editors.
		$(".save-tense").hide();
		newVerbButtonCheck(tenseCount);
		tenseChecker(tenseCount);
		if (tenseCount === tenseMax) {
			$("#createVerb").show();
		}

		var je = $("input.new-verb.je").val();
		var tu = $("input.new-verb.tu").val();
		var il = $("input.new-verb.il").val();
		var nous = $("input.new-verb.nous").val();
		var vous = $("input.new-verb.vous").val();
		var ils = $("input.new-verb.ils").val();
		dataToUse.tense[tense] = {};
		dataToUse.tense[tense].je = je;
		dataToUse.tense[tense].tu = tu;
		dataToUse.tense[tense].il = il;
		dataToUse.tense[tense].nous = nous;
		dataToUse.tense[tense].vous = vous;
		dataToUse.tense[tense].ils = ils;
		dataToUse.tense[tense].irregular = $(".irregular-flag").prop('checked');
		// console.log(dataToUse);
		$("span.new-verb.je").html(je);
		$("span.new-verb.tu").html(tu);
		$("span.new-verb.il").html(il);
		$("span.new-verb.nous").html(nous);
		$("span.new-verb.vous").html(vous);
		$("span.new-verb.ils").html(ils);
	});
	
	$(".next-tense").click(function (event) {
		$(".save-tense").show();
		$(".next-tense").hide();
		$("span.new-verb.je").html("<input class='new-verb je'>");
		$("span.new-verb.tu").html("<input class='new-verb tu'>");
		$("span.new-verb.il").html("<input class='new-verb il'>");
		$("span.new-verb.nous").html("<input class='new-verb nous'>");
		$("span.new-verb.vous").html("<input class='new-verb vous'>");
		$("span.new-verb.ils").html("<input class='new-verb ils'>");
		tenseCount ++;
		$(".tense-progress").text(tenseCount);
		var infinitive = $(".new-infinitive").text();
		conjugateVerb(infinitive, tenseChecker(tenseCount));
	});

	$("#createVerb").click(function () {
		url = "/api/verbs";
		$.ajax({
			method: "POST",
			url: url,
			data: dataToUse,
			success: function (data) {
				$(".search-error").empty();
				$("#newVerbModal").modal("hide");

				renderConjugation(data);
			}
		});
	});
});

function renderConjugation(verb) {
	if ($(".verb-conjugation")) {
		$(".verb-conjugation").empty();
	}
	var conjugationGridHtml = 
	'				<div class="row verb-conjugation" id="' + verb._id + '">' +
	'		          <div class="col-md-6 col-md-offset-3">' +
	'		            <div class="col-md-6 center bottom">' +
	'		              <h1>Je</h1>' +
	'		              <span class="conjugation je">' + verb.tense.present.je + '</span>' +
	'		            </div>' +
	'		            <div class="col-md-6 bottom">' +
	'		              <h1>Nous</h1>' +
	'		              <span class="conjugation nous">' + verb.tense.present.nous + '</span>' +
	'		            </div>' +
	'		            <div class="col-md-6 center bottom">' +
	'		              <h1>Tu</h1>' + 
	'		              <span class="conjugation tu">' + verb.tense.present.tu + '</span>' +
	'		            </div>' +
	'		            <div class="col-md-6 bottom">' +
	'		              <h1>Vous</h1>' +
	'		              <span class="conjugation vous">' + verb.tense.present.vous + '</span>' +
	'		            </div>' +
	'		            <div class="col-md-6 center">' +
	'		              <h1>Il/Elle/On</h1>' +
	'		              <span class="conjugation il">' + verb.tense.present.il + '</span>' +
	'		            </div>' +
	'		            <div class="col-md-6">' +
	'		              <h1>Ils/Elles</h1>' +
	'		              <span class="conjugation ils">' + verb.tense.present.ils + '</span>' +
	'		            </div>' +
	'		          </div>' +
	'		          <div class="col-md-3 button-sidebar">' +
	'					<p>' +
	'		              <button class="btn btn-danger edit-tense edit">Mistake?</button>' +
	'		            </p>' +
						// This button starts out as hidden and will be unhidden on click of the Mistake? button.
	'					<p>' +
	'		              <button class="btn btn-success edit-tense save">Save Changes</button>' +
	'		            </p>' +
	'		            <p>' +
	'		              <button class="btn btn-success tense present">Present</button>' +
	'		            </p>' +
	'		            <p>' +
	'		              <button class="btn btn-primary tense imparfait">Imparfait</button>' +
	'		            </p>' +
	'		          </div>' +
	'		        </div>';
	$("#verbs").html(conjugationGridHtml);
	$(".edit-tense.save").hide();
}

//This function will be used in the POST for new verbs.
//It will store information for the appropriate tense in the appropriate category.
function tenseChecker(tenseCount) {
	if (tenseCount === 1) {
		tense = "present";
		$(".current-tense").text(tense);
		return tense;
	} else if (tenseCount === 2) {
		tense = "imparfait";
		$(".current-tense").text(tense);
		return tense;
	}
}

//This function will need to be updated as more tenses are added.
function conjugateVerb(infinitive, tense) {
	var family = infinitive.slice(infinitive.length-2, infinitive.length);
	var stem = infinitive.slice(0, infinitive.length-2);
	if (tense === "present") {
		if (family === "er") {
			$("input.new-verb.je").val(stem + "e");
			$("input.new-verb.tu").val(stem + "es");
			$("input.new-verb.il").val(stem + "e");
			$("input.new-verb.nous").val(stem + "ons");
			$("input.new-verb.vous").val(stem + "ez");
			$("input.new-verb.ils").val(stem + "ent");
		} else if (family === "re") {
			$("input.new-verb.je").val(stem + "s");
			$("input.new-verb.tu").val(stem + "s");
			$("input.new-verb.il").val(stem);
			$("input.new-verb.nous").val(stem + "ons");
			$("input.new-verb.vous").val(stem + "ez");
			$("input.new-verb.ils").val(stem + "ent");
		} else if (family === "ir") {
			$("input.new-verb.je").val(stem + "is");
			$("input.new-verb.tu").val(stem + "is");
			$("input.new-verb.il").val(stem + "it");
			$("input.new-verb.nous").val(stem + "issons");
			$("input.new-verb.vous").val(stem + "issez");
			$("input.new-verb.ils").val(stem + "issent");
		}
	} else if (tense === "imparfait") {
		if (infinitive === "être" || infinitive === "etre") {
			$("input.new-verb.je").val("étais");
			$("input.new-verb.tu").val("étais");
			$("input.new-verb.il").val("était");
			$("input.new-verb.nous").val("étions");
			$("input.new-verb.vous").val("étiez");
			$("input.new-verb.ils").val("étaient");
			$(".irregular-flag").prop('checked', true);
		} else {
			if (family === "er") {
				$("input.new-verb.je").val(stem + "ais");
				$("input.new-verb.tu").val(stem + "ais");
				$("input.new-verb.il").val(stem + "ait");
				$("input.new-verb.nous").val(stem + "ions");
				$("input.new-verb.vous").val(stem + "iez");
				$("input.new-verb.ils").val(stem + "aient");
			} else if (family === "re") {
				$("input.new-verb.je").val(stem + "ais");
				$("input.new-verb.tu").val(stem + "ais");
				$("input.new-verb.il").val(stem + "ait");
				$("input.new-verb.nous").val(stem + "ions");
				$("input.new-verb.vous").val(stem + "iez");
				$("input.new-verb.ils").val(stem + "aient");
			} else if (family === "ir") {
				$("input.new-verb.je").val(stem + "issais");
				$("input.new-verb.tu").val(stem + "issais");
				$("input.new-verb.il").val(stem + "issait");
				$("input.new-verb.nous").val(stem + "issions");
				$("input.new-verb.vous").val(stem + "issiez");
				$("input.new-verb.ils").val(stem + "issaient");
			}
		}
	}
}

function newVerbButtonCheck(tenseCount) {
	if (tenseCount > 1 ) {
		if (tenseCount < tenseMax) {
			$(".next-tense").show();
		}
	} else if (tenseCount === 1) {
		$(".next-tense").show();
	}
}