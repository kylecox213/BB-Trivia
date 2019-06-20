
$("#welcome").trigger('play');
$(document).ready(function(){
  
	// event listeners
	
	$("#remaining-time").hide();
	$("#start").on('click', trivia.startGame);
	$(document).on('click' , '.option', trivia.guessChecker);
	
  })
  
  var trivia = {

    // trivia properties
    

	correct: 0,
	incorrect: 0,
	unanswered: 0,
	currentSet: 0,
	timer: 20,
	timerOn: false,
    timerId : '',
    
	// questions options and answers data


    questions: {
        q1: "Walter White is better known in the criminal underworld by which nickname?",
        q2: "What action did Walter take that set in motion the events ultimately led to his demise?",
        q3: "Walter purchased what type of business to launder his untaxed income?",
        q4: "Walter hired hitmen to assassinate twelve business associates, each housed in three different correctional facilities, in less than...?",
        q5: "What did Walter do to the men that killed Hank and were holding Jesse captive?",
        q6: "Walter lives at what street address?",
        q7: "Despite being the target of a nationwide manhunt, Walter returned to Albequerque in order to...?",
        q8: "What method did Walter use to eliminate his boss from the laundromat?",
        q9: "Walter initially convinced Jesse to cook methamphetamine with him because Walter witnessed Jesse doing what?",
        q10: "What did Walter do to Lydia's tea?"
    },

    options: {
        q1: ["Hatchetman", "Heisenberg", "Big Blue", "Captain Cook"],
        q2: ["Setting off an explosive device in a nursing home", "Poisoning a child with ricin", "Hiring hitmen to kill multiple incarcerated business associates", "Selling methamphetamine internationally"],
        q3: ["A grocery store", "A fast-food restaurant", " A laser tag and arcade", "A car wash"],
        q4: ["Ten minutes", "Two days", "Two minutes", "Six hours"],
        q5: ["Poisioned them all with ricin", "Set their compound on fire", "Shot them all with an M-60", "Hired hitmen to take them all out"],
        q6: ["408 Negra Arroyo Ln", "3971 Calle Azul St", "4991 Fuego Del Mar Rd", "94124 Carrera Roja Rd"],
        q7: ["Say farewell to his wife and son", "Set Jesse free from captivity", "Eliminate the hitmen that killed Walter's brother-in-law", "All of the above"],
        q8: ["Laced a cigarette with ricin", "Shot him in the face with a handgun", "Slit his throat with a box cutter", "Blew him up with a homemade explosive device"],
        q9: ["Escaping a DEA drug raid", "Hiding a body in a dumpster", "Using children to sell methamphetamine", "Stealing methamphetamine from a violent drug dealer"],
        q10:["Boiled it and threw it in her face", "Nothing, Walter put ricin in the Stevia packets that Lydia uses", "Poured strychnide in it", "Mixed two teapoons of sugar in it"]
    },

    answers: {
        q1: "Heisenberg",
        q2: "Poisoning a child with ricin",
        q3: "A car wash",
        q4: "Two minutes",
        q5: "Shot them all with an M-60",
        q6: "408 Negra Arroyo Ln",
        q7: "All of the above",
        q8: "Blew him up with a homemade explosive device",
        q9: "Escaping a DEA drug raid",
        q10: "Nothing, Walter put ricin in the Stevia packets that Lydia uses"
    },

    // trivia methods; method to initialize game
    

	startGame: function(){

      // restarting game results
      

	  trivia.currentSet = 0;
	  trivia.correct = 0;
	  trivia.incorrect = 0;
	  trivia.unanswered = 0;
	  clearInterval(trivia.timerId);

	  $("#music").trigger('play');
	  
      // show game section
      

	  $('#game').show();
	  
      //  empty last results
      

	  $('#results').html('');
	  
      // show timer
      

	  $('#timer').text(trivia.timer);
	  
      // remove start button
      

	  $('#start').hide();
  
	  $('#remaining-time').show();
	  
      // ask first question
      

	  trivia.nextQuestion();
	  
    },
    
    // method to loop through and display questions and options 
    

	nextQuestion : function(){
	  
      // set timer to () seconds for each question
      

	  trivia.timer = 10;
	   $('#timer').removeClass('last-seconds');
	  $('#timer').text(trivia.timer);
	  
      // prevents the timer from speeding up
      

	  if(!trivia.timerOn){
		trivia.timerId = setInterval(trivia.timerRunning, 1000);
	  }
	  
      // gets all the questions; indexes the current questions
      

	  var questionContent = Object.values(trivia.questions)[trivia.currentSet];
	  $('#question').text(questionContent);
	  
      // creates an array of all the user options for the current question
      

	  var questionOptions = Object.values(trivia.options)[trivia.currentSet];
	  
      // creates all the trivia guess options in the html
      

	  $.each(questionOptions, function(index, key){
		$('#options').append($('<button class="option btn btn-info btn-lg">'+key+'</button>'));
	  })
	  
    },
    
    // method to decrement counter and count unanswered if timer runs out
    

	timerRunning : function(){

      // if timer still has time remaining and there are still questions remaining


	  if(trivia.timer > -1 && trivia.currentSet < Object.keys(trivia.questions).length){
		$('#timer').text(trivia.timer);
		trivia.timer--;
		  if(trivia.timer === 4){
			$('#timer').addClass('last-seconds');
		  }
      }
      
      // the time has run out and increment unanswered; run result
      

	  else if(trivia.timer === -1){
		trivia.unanswered++;
		trivia.result = false;
		clearInterval(trivia.timerId);
		resultId = setTimeout(trivia.guessResult, 1000);
		$('#results').html('<h3>Out of time! The answer was '+ Object.values(trivia.answers)[trivia.currentSet] +'</h3>');
      }
      
      // if all the questions have been displayed; end game, display results
      

	  else if(trivia.currentSet === Object.keys(trivia.questions).length){
		
        // adds results of game (correct, incorrect, unanswered) to html
        

		$('#results')
		  .html('<h3>Thank you for playing!</h3>'+
		  '<p>Correct: '+ trivia.correct +'</p>'+
		  '<p>Incorrect: '+ trivia.incorrect +'</p>'+
		  '<p>Unanswered: '+ trivia.unanswered +'</p>'+
		  '<p>Give it another shot!</p>');
		
        // hide game section
        

		$('#game').hide();
		
        // display start button to begin new game
        

		$('#start').show();
	  }
	  
    },
    
    // method to evaluate the option clicked
    

	guessChecker : function() {
	  
      // timer ID for gameResult setTimeout
      

	  var resultId;
	  
      // the answer to the current question being asked
      

	  var currentAnswer = Object.values(trivia.answers)[trivia.currentSet];
	  
      // if the text of the option picked matches the answer of the current question, increment correct
      

	  if($(this).text() === currentAnswer){

        // turn button green for correct
        

		$(this).addClass('btn-success').removeClass('btn-info');
		
		trivia.correct++;
		clearInterval(trivia.timerId);
		resultId = setTimeout(trivia.guessResult, 1000);
		$('#results').html('<h3>Correct Answer!</h3>');
      }
      
      // else the user picked the wrong option, increment incorrect
      

	  else{

        // turn button clicked red for incorrect
        

		$(this).addClass('btn-danger').removeClass('btn-info');
		
		trivia.incorrect++;
		clearInterval(trivia.timerId);
		resultId = setTimeout(trivia.guessResult, 1000);
		$('#results').html('<h3>Better luck next time! '+ currentAnswer +'</h3>');
	  }
	  
    },
    
    // method to remove previous question results and options
    

	guessResult : function(){
	  
      // increment to next question set
      

	  trivia.currentSet++;
	  
      // remove the options and results
      

	  $('.option').remove();
	  $('#results h3').remove();
	  
      // begin next question
      

	  trivia.nextQuestion();
	}
  }