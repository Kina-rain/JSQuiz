var timerRunning;
const theTimer = document.querySelector("#timer");
const startButton = document.querySelector("#quizStart");
const quizArea = document.querySelector("#quizArea");
var timer;
var userScore = 0;

startButton.addEventListener("click", function () {
	startButton.children[0].setAttribute("class", "d-none");

	var testDurration = quizData.length * 30;

	startTimer(testDurration, theTimer);
	startQuiz();
});


//  Start button to start timer and quiz.
function startQuiz() {

	//build quiz
	buildQuiz();

	// initialize the carousel object so we can move the slides forward
	$(".carousel").carousel({ interval: false });

	// any <a> button on click event to get user event
	$("a.btn").on("click", function () {

		var choice = $(this).find("input:hidden").val();
		var currentIndex = $(".carousel-item.active").index();

		//check to see if they were right and add to score if they are right or decrement if they are wrong
		if (checkAnswer(choice, currentIndex)) {
			userScore++;
		} else {
			if (userScore > 0) {
				userScore--;
			};
			timer -= 3;
		}

		//cycle to the next quest, but we need to check if its the last
		if ($(".carousel-item:last").hasClass("active")) {
			// log the score and ending quiz
			console.log(userScore);
			localStorage.setItem("userScore", userScore);
			endQuiz();

		} else {
			$(".carousel").carousel("next");
		}
	});
}

// checking user's answer with question answer.
function checkAnswer(userChoice, qIndex) {
	var correctOrNot;

	if (userChoice === quizData[qIndex].correct) {
		correctOrNot = true;
	} else {
		correctOrNot = false;
	}

	return correctOrNot;
}

function endQuiz() {
	userScore += timer;
	clearInterval(timerRunning);
	var quizCarousel = document.querySelector("#carousel-quiz");
	quizCarousel.setAttribute("class", "d-none");
}

function startTimer(duration, display) {

	var minutes, seconds;
	timer = duration;
	timerRunning = setInterval(function () {
		minutes = parseInt(timer / 60, 10);
		seconds = parseInt(timer % 60, 10);

		minutes = minutes < 10 ? "0" + minutes : minutes;
		seconds = seconds < 10 ? "0" + seconds : seconds;

		display.textContent = minutes + ":" + seconds;

		if (--timer < 0) {
			endQuiz();
		}
	}, 1000);
}

// Quiz Area build for carousel.  From sitepoint & stackoverflow & bootsnipp.
function buildQuiz() {
	const output = [];

	output.push(
		`<div class="row">
			<div class="col-3"></div>
			<div class="col-6">
			<div class="carousel slide" id="carousel-quiz" data-interval="false" data-wrap="false">
				<div class="carousel-inner">`
	);
	quizData.forEach((currentQuestion, questionNumber) => {
		const answers = [];

		for (letter in currentQuestion.answers) {
			answers.push(
				`<div class="mb-3 text-center">
						<a href="#" class="btn btn-lg bg-primary text-white"><input type="hidden" name="q_answer" value="${letter}">${letter} : ${currentQuestion.answers[letter]}</a>
				</div>`
			);
		}

		output.push(
			`<div class="carousel-item ${currentQuestion.active}">
				<div class="mb-3 text-center">
					<h3>${currentQuestion.question}</h3>
				</div>
				${answers.join("")}
			</div>`
		);
	});

	output.push(
		`</div>
		</div>
		</div>
		<div class="col-3"></div>
	</div>`
	);

	quizArea.innerHTML = output.join("");
}