(function($) {

  var breakTime = false;
  var countdownActive = false;
  var workInterval = null;
  var breakInterval = null;
  var startingWorkInterval = null;
  var startingBreakInterval = null;

  function formatTime(timeInSeconds) {
    var totalSeconds = timeInSeconds;
    var minutes = Math.floor( totalSeconds / 60 );
    var seconds = totalSeconds % 60;

    // corrections for displaying double-digits at all times
    if ( seconds < 10 ) {
      seconds = "0" + seconds;
    }
    if ( minutes < 10 ) {
      minutes = "0" + minutes;
    }

    return minutes + ":" + seconds;
  }

  function getProgress(current, total) {
    return current / total;
  }

  function isOnCountdown() {
    return countdownActive;
  }

  function isOnBreak() {
    return breakTime;
  }

  function toggleBreak() { // <-- this function needs to change class of progress bar
    if ( breakTime ) {
      breakTime = false;
      $('.progress-bar').removeClass('progress-break');
      $('.progress-bar').addClass('progress-work');
    } else {
      breakTime = true;
      $('.progress-bar').removeClass('progress-work');
      $('.progress-bar').addClass('progress-break');
    }
  }

  function isValidTime(inputValue) {
    return ( typeof( +inputValue ) === "number" && inputValue > 0 );
  }

  function formValid() {
    // if the work length / break length form is filled in correctly return true
    // otherwise return false
    var workValue = $('input[name*="work"]').val();
    var breakValue = $('input[name*="break"]').val();

    if ( isValidTime(workValue) && isValidTime(breakValue) ) {
      return true;
    }
    alert('You must enter an integer greater than 0 for the time interval(s)!');
    return false;
  }

  function startCountdown() {
    startingWorkInterval = $('input[name*="work"]').val() * 60;
    startingBreakInterval = $('input[name*="break"]').val() * 60;
    workInterval = startingWorkInterval;
    breakInterval = startingBreakInterval;
    countdownActive = true;
  }

  function stopCountdown() {
    countdownActive = false;
  }

  function tickCountdown() {
    if ( !isOnBreak() && workInterval > 0 ) {
      if ( breakInterval == 0 ) {
        breakInterval = $('input[name*="break"]').val() * 60;
        workInterval--;
      } else {
        workInterval--;
      }
    } else if ( !isOnBreak() && workInterval == 0 ) { // workInterval has reached 0
      toggleBreak();
      startingBreakInterval = $('input[name*="break"]').val() * 60;
      breakInterval = startingBreakInterval;
      // workInterval = $('input[name*="work"]').val() * 60;
    }
    if ( isOnBreak() && breakInterval > 0 ) {
        breakInterval--;
    } else if ( isOnBreak() && breakInterval == 0 ) {
      toggleBreak();
      startingWorkInterval = $('input[name*="work"]').val() * 60;
      workInterval = startingWorkInterval;
      workInterval--;
    }

    if ( !isOnBreak() ) {
      var progress = getProgress(workInterval, startingWorkInterval);
    } else {
      var progress = getProgress(breakInterval, startingBreakInterval);
    }

    var displayProgress = 100 - (progress * 100);
    $('.progress-bar').css('height', displayProgress + '%');
  }

  $('.pomodoro-button').on('click', function(event) {
    event.preventDefault();
    if ( !isOnCountdown() && formValid() ) {
      startCountdown();
      $('input').attr('disabled','disabled');
      $(this).toggleClass('pomodoro-button-on');
      $(this).text('stop');
    } else if ( isOnCountdown() ) {
      stopCountdown();
      $('input').removeAttr('disabled');
      breakTime = false;
      $(this).toggleClass('pomodoro-button-on');
      $(this).text('start');
    }
  });

  // form reacts on keypress of 'Num +' and 'Num -' to change values
  $('form').on('keydown', 'input', function(event) {

    if ( event.keyCode == 107 ) {
      event.preventDefault();
      if ( $(this).val() > 1 ) {
        $(this).val( +$(this).val() + 1 );
      }
    } else if ( event.keyCode == 109 ) {
      event.preventDefault();
      if ( $(this).val() > 1 ) {
        $(this).val( +$(this).val() - 1 );
      }
    }
  });


  // Interval logic machinery
  setInterval(function() {
    if ( !isOnCountdown() ) {
      return;
    } else {
      tickCountdown();
      if ( !isOnBreak() ) {
        $('.countdown').text( formatTime(workInterval) );
      } else {
        $('.countdown').text( formatTime(breakInterval) );
      }
    }
  }, 1000);


})(jQuery);
