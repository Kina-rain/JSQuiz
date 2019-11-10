const theTimer = document.querySelector("#timer");
const startButton = document.querySelector("#quizStart");
const highScoreBtn = document.querySelector("#highScoreBtn");
const topScoreArea = document.querySelector("#topScore");
const quizArea = document.querySelector("#quizArea");
const storeScoreBtn = document.querySelector("#storeScoreBtn");
const userScoreLabel = document.querySelector("#userScoreLabel");
const scoreContainer = document.querySelector("#scoreContainer");
const highScore = document.querySelector("#highScore");

var timerRunning;
var timer;
var userScore = 0;

// event listener for score and disappearing display and start timer
startButton.addEventListener("click", function () {
	startButton.children[0].setAttribute("class", "d-none");
	highScoreBtn.children[0].setAttribute("class", "d-none");
	topScoreArea.setAttribute("class", "container d-none");

	var testDurration = quizData.length * 30;
	userScore = 0;

	startTimer(testDurration, theTimer);
	startQuiz();
});

//  high score button and event Listener and show scores
highScoreBtn.addEventListener("click", function () {
	showScoreArea(false, 0);
});

// score button and click and storage the value
storeScoreBtn.addEventListener("click", function () {
	var userInit = document.querySelector("#initialUser").value;
	localStorage.setItem(userInit, userScore);
	displayScore();
});


// clears the scores to start quiz and show initials at the end of the Quiz
function showScoreArea(showInitials, quizScore) {
	userScoreLabel.innerHTML = "";

	if (showInitials) {
		userScoreLabel.innerHTML = "Your Score was: " + quizScore;

		// Quiz scores and display button with disappear event
		topScoreArea.setAttribute("class", "container");
		scoreContainer.setAttribute("class", "input-group mb-3");
		highScoreBtn.children[0].innerHTML = "Hide High Score";
	} else {
		if (highScoreBtn.children[0].innerHTML === "Quiz High Scores") {
			topScoreArea.setAttribute("class", "container");
			scoreContainer.setAttribute("class", "input-group mb-3 d-none");
			highScoreBtn.children[0].innerHTML = "Hide High Scores";
		} else {
			topScoreArea.setAttribute("class", "container d-none");
			scoreContainer.setAttribute("class", "input-group mb-3 d-none");
			highScoreBtn.children[0].innerHTML = "Quiz High Scores";
		}
	}

	displayScore();
}

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
			// end the quiz
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

//  adds up score stores it, stops timer, and hides test area.
function endQuiz() {
	userScore += timer;
	clearInterval(timerRunning);
	var quizCarousel = document.querySelector("#carousel-quiz");
	quizCarousel.setAttribute("class", "d-none");


	//  resets timer
	startButton.children[0].setAttribute("class", "btn btn-primary btn-lg btn-block");
	highScoreBtn.children[0].setAttribute("class", "btn btn-primary btn-lg btn-block");
	theTimer.innerHTML = "00:00";

	// shows the score area
	showScoreArea(true, userScore);
}


//  displays scores, stores info, adds info to score board and local storage info
function displayScore() {
	var scoreDisplay = [];

	if (localStorage.length > 0) {
		scoreDisplay.push("<div><h5>High Scores</h5></div>");

		for (var i = 0; i < localStorage.length; i++) {
			scoreDisplay.push("<div>" + localStorage.key(i) + ":" + localStorage.getItem(localStorage.key(i)) + "</div><hr>");
		}
		//  found code $('body').append(localStorage.key(i)));
		highScore.children[0].innerHTML = scoreDisplay.join("");
	}
}

//  start Time function and display
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
//  found ` to string code for carousel
function buildQuiz() {
	var output = [];

	output.push(
		`<div class="row">
			<div class="col-3"></div>
			<div class="col-6">
			<div class="carousel slide" id="carousel-quiz" data-interval="false" data-wrap="false">
				<div class="carousel-inner">`
	);
	quizData.forEach((currentQuestion, questionNumber) => {
		var answers = [];

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