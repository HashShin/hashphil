$(document).ready(function() {
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    color: '#80FF00',
    showConfirmButton: false,
    timer: 3000,
    width: 250,
    timerProgressBar: true,
    customClass: {
      popup: 'toast-popup',
      title: 'toast-title',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.stopTimer);
    }
  });


  $('.show-live-cvv').click(function() {
    var type = $('.show-live-cvv').attr('type');
    $('#cvv-go-here').slideToggle();
    if (type == 'show') {
      $('.show-live-cvv').html('<i class="fa fa-eye"></i>');
      $('.show-live-cvv').attr('type', 'hidden');
    } else {
      $('.show-live-cvv').html('<i class="fa fa-eye-slash"></i>');
      $('.show-live-cvv').attr('type', 'show');
    }
  });

  $('.show-live-ccn').click(function() {
    var type = $('.show-live-ccn').attr('type');
    $('#ccn-go-here').slideToggle();
    if (type == 'show') {
      $('.show-live-ccn').html('<i class="fa fa-eye"></i>');
      $('.show-live-ccn').attr('type', 'hidden');
    } else {
      $('.show-live-ccn').html('<i class="fa fa-eye-slash"></i>');
      $('.show-live-ccn').attr('type', 'show');
    }
  });

  $('.show-dead').click(function() {
    var type = $('.show-dead').attr('type');
    $('#dead-list').slideToggle();
    if (type == 'show') {
      $('.show-dead').html('<i class="fa fa-eye"></i>');
      $('.show-dead').attr('type', 'hidden');
    } else {
      $('.show-dead').html('<i class="fa fa-eye-slash"></i>');
      $('.show-dead').attr('type', 'show');
    }
  });

  $('.btn-cvv-trash').click(function() {
    $('#cvv-go-here').text('');
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Deleted Live List!</h6>',
      background: '#27293d'
    });
  });

  $('.btn-ccn-trash').click(function() {
    $('#ccn-go-here').text('');
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Deleted Ccn List!</h6>',
      background: '#27293d'
    });
  });

  $('.btn-dead-trash').click(function() {
    $('#dead-list').text('');
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Deleted Dead List!</h6>',
      background: '#27293d'
    });
  });

  $('.btn-copy-cvv').click(function() {
    var livecc = document.getElementById('cvv-go-here').innerText;
    var textarea = document.createElement("textarea");
    textarea.value = livecc;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Copied SUCCESS List!</h6>',
      background: '#27293d'
    });
  });

  $('.btn-copy-ccn').click(function() {
    var liveccn = document.getElementById('ccn-go-here').innerText;
    var textarea = document.createElement("textarea");
    textarea.value = liveccn;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Copied RETRY List!</h6>',
      background: '#27293d'
    });
  });

  $('.btn-play').click(async function() {
    var creditcard = $('.form-checker').val().trim();
    var api = $('#api').val();
    var array = creditcard.split('\n');
    var live = 0;
    var ccn = 0;
    var dead = 0;
    var tested = 0;
    txt = '';

    if (!creditcard) {
      Toast.fire({
        icon: 'error',
        title: '<h6 class="title mb-2">Error: Empty Input!</h6>',
        background: '#27293d'
      });
      return false;
    }

    if (!api) {
      Toast.fire({
        icon: 'error',
        title: '<h6 class="title mb-2">Error: Select Option!</h6>',
        background: '#27293d'
      });
      return false;
    }

    $('.cvv-count').text(0);
    $('.dead-count').text(0);
    $('.ccn-count').text(0);
    $('.tested-count').text(0);
    timestarted();
    document.getElementById("time").innerHTML = "waiting..";
    Toast.fire({
      icon: 'success',
      title: '<h6 class="title mb-2">Started..</h6>',
      background: '#27293d'
    });

    var raw = array.filter(function(value) {
      if (value.trim() !== "") {
        txt += value.trim() + '\n';
        return value.trim();
      }
    });

    var total = raw.length;
    $('.remaining').text(total);

    if (total > 6000000) {
      Toast.fire({
        icon: 'error',
        title: '<h6 class="title mb-2">Error: Limit Exceeded.</h6>',
        background: '#27293d'
      });
      return false;
    }

    $('.btn-play').attr('disabled', true);
    $('.btn-stop').attr('disabled', false);

    raw.forEach(function(data) {
      const xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if (xhttp.responseText.match("Success")) {
            Toast.fire({
              icon: 'success',
              title: '<h6 class="title mb-2">+1 SUCCESS!</h6>',
              background: '#27293d'
            });
            showlive(xhttp.responseText + "");
            removeline();
            live = live + 1;
          } else if (xhttp.responseText.match("Unable")) {
            showccn(xhttp.responseText + "");
            removeline();
            ccn = ccn + 1;
          } else {
            showdead(xhttp.responseText + "");
            removeline();
            dead = dead + 1;
          }

          setTime();
          tested = live + dead + ccn;
          $('.cvv-count').text(live);
          $('.dead-count').text(dead);
          $('.ccn-count').text(ccn);
          $('.tested-count').text(tested);

          if (tested == total) {
            notifyme();
            timefinished();
            Toast.fire({
              icon: 'success',
              title: '<h6 class="title mb-2">DONE!</h6>',
              background: '#27293d'
            });
            $('.btn-play').attr('disabled', false);
            $('.btn-stop').attr('disabled', true);
            xhttp.abort();
          }
        }
      };
      Array.prototype.randomElement = function() {
        return this[Math.floor(Math.random() * this.length)];
      };
      var key = $("#key").val();
      
      xhttp.open("GET", api + '?input=' + data + '&key=' + key, true);
      xhttp.send();
      $('.btn-stop').click(function() {
        timefinished();
        $('.btn-play').attr('disabled', false);
        $('.btn-stop').attr('disabled', true);
        Toast.fire({
          icon: 'warning',
          title: '<h6 class="title mb-2">Stopped!</h6>',
          background: '#27293d'
        });
        xhttp.abort();
        return false;
      });
    });
  });
});


function checkbin() {
  var ccb = $('#ccBIN').val();
  $('.bincheck').attr('disabled', true);

  if (!ccb) {
    $('#binname').val('Input A Valid Bin');
    $('#binbrand').val('-');
    $('#bintype').val('-');
    $('#binlevel').val('-');
    $('#bincountry').val('-');
    $('.bincheck').attr('disabled', false);
    return Promise.reject('Input a valid BIN');
  }

  return new Promise(function(resolve, reject) {
    $.ajax({
      url: "bin_api.php",
      method: "POST",
      data: {
        ccb: ccb
      },
      dataType: "JSON",
      success: function(data) {
        $('#binname').val(data.bank);
        $('#binbrand').val(data.brand);
        $('#bintype').val(data.type);
        $('#binlevel').val(data.level);
        $('#bincountry').val(data.country);
        $('.bincheck').attr('disabled', false);
        resolve();
      },
      error: function(textStatus, errorThrown) {
        $('#binname').val('Api is offline');
        $('#binbrand').val('Api is offline');
        $('#bintype').val('Api is offline');
        $('#binlevel').val('Api is offline');
        $('#bincountry').val('Api is offline');
        $('.bincheck').attr('disabled', false);
        reject('API error');
      }
    });
  });
}



function notifyme() {
  var useridInput = document.getElementById("userid");
  var useridValue = useridInput.value;
  var username = document.getElementById("username");
  var username = username.value;
  if (!useridValue) {
    useridValue = "#######";
  }
  if (!username) {
    username = "NoName"
  }
}

function checkUserID() {
  var useridInput = document.getElementById("userid");
  var useridValue = useridInput.value;
  var username = document.getElementById("username");
  var username = username.value;

  if (!useridValue) {
    useridValue = "";
  }

  if (!username) {
    username = "NoName"
  }

  var cvv = $('.cvv-count').text();
  var ccn = $('.ccn-count').text();

  if (useridValue == "") {
    //do nothing
  } else {
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "https://api.telegram.org//sendMessage?chat_id=" + useridValue + "&text=<b>" + username + ", Hurray! you have received my message now you will be notifed when the checker is done -_^</b>&parse_mode=HTML", true);
    xhttp.onreadystatechange = function() {
      if (this.readyState === 4) {
        if (this.status === 200) {
          document.getElementById("errorText").textContent = "message sent!";
          document.getElementById("errorText").classList.remove("errorcolor");
          document.getElementById("errorText").style.display = "block";
          document.getElementById("errorText").classList.add("errorsuccess");
        } else {
          var response = JSON.parse(this.responseText);
          document.getElementById("errorText").innerHTML = response.description;
          document.getElementById("errorText").classList.remove("errorsuccess");
          document.getElementById("errorText").style.display = "block";
          document.getElementById("errorText").classList.add("errorcolor");
        }
      }
    };
    xhttp.send();
  }
}

function showlive(string) {
  $('#cvv-go-here').append(string + '<br>');
}

function showccn(string) {
  $('#ccn-go-here').append(string + '<br>');
}

function showdead(string) {
  $('#dead-list').append(string + '<br>');
}

function getTimeStamp() {
  return new Date().toLocaleTimeString();
}

function stripegate(gate) {
  if (gate.value == "dedup.php") {
    document.getElementById("Stripe-hide").style.display = "block";
  } else if (gate.value == "clothing.php") {
    document.getElementById("Stripe-hide").style.display = "block";
  } else {
    document.getElementById("Stripe-hide").style.display = "none";
  }
}

function timestarted() {
  document.getElementById("started-time").innerHTML = getTimeStamp();
}

function countcc() {
  var text = $(".form-checker").val();
  var lines = text.split('\n');
  var count = lines.filter(line => line.trim() !== '').length;
  $('.total-count').text(count);
}

function timefinished() {
  document.getElementById("done-time").innerHTML = getTimeStamp();
}

function setTime() {
  countcc();
  document.getElementById("time").innerHTML = getTimeStamp();
}

var myVar = setInterval(function() {
  myTimer()
}, 1000);

function myTimer() {
  var d = new Date();
  document.getElementById("current-time").innerHTML = d.toLocaleTimeString();
}

function removeline() {
  countcc();
  var line = $('.form-checker').val().split('\n');
  line.splice(0, 1);
  $('.form-checker').val(line.join("\n"));
}

function genmodal() {
  $('#gen-modal').modal('show');
}

function bincmodal() {
  $('#modalBin').modal('show');
}

function loaded() {
  let timerInterval
  Swal.fire({
    title: '<h6 class="title mb-2 text-danger">please wait..</h6>',
    html: '<h6 class="title mb-2"> remaining time <b class="text-danger" ></b> milliseconds.</h6>',
    timer: 500,
    background: '#27293d',
    timerProgressBar: true,
    didOpen: () => {
      Swal.showLoading();
      const b = Swal.getHtmlContainer().querySelector('b');
      timerInterval = setInterval(() => {
        b.textContent = Swal.getTimerLeft();
      }, 100);
    },
    willClose: () => {
      clearInterval(timerInterval);
    }
  }).then((result) => {
    if (result.dismiss === Swal.DismissReason.timer) {
      console.log('i was closed by the timer');
    }
  });
}


var hours = 3;
function senpai() {
  var hours = new Date().getHours();
  var greet = '';

  if (hours >= 0 && hours < 2) {
    greet = 'waoh waoh get some sleep senpai!';
  }
  if (hours >= 2 && hours < 4) {
    greet = 'Senpai, it\'s really late, go to sleep! (｡≖‿≖)';
  }
  if (hours >= 5 && hours < 12) {
    greet = 'Ohayou senpai!';
  }
  if (hours >= 12 && hours < 18) {
    greet = 'Konnichiwa senpai!';
  }
  if (hours >= 18 || hours < 0) {
    greet = 'Konbanwa senpai!';
  }

  $('.senpai').text(greet);
}
senpai();



function onlyNumbers(event) {
  const inputValue = event.target.value;
  const sanitizedValue = inputValue.replace(/[^0-9x]/gi, '');
  event.target.value = sanitizedValue;
}

const ccpN = document.getElementById('ccpN');
ccpN.addEventListener('input', onlyNumbers);

const ccBIN = document.getElementById('ccBIN');
ccBIN.addEventListener('input', onlyNumbers);
