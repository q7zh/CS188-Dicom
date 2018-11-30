$( document ).ready(function() {

  // quantity selection
  $(".userQuantitySelection").click(function() {
    $(".userQuantityOptions").css('display', 'none');
    $("#topListItemText").html($(this).html());  
  });

  $(".userQuantityOptions").mouseleave(function() {
    $(this).css('display', ''); //resets display value to "blank"
    //https://stackoverflow.com/questions/1053418/jquery-temporarily-change-a-style-then-reset-to-original-class
  });

	// Initialize Firebase
	var config = {
    apiKey: "AIzaSyD7wc7mQw4uB1Lg_lwftU_iDe2il2fsbKs",
    authDomain: "cs-188-project-6dbc0.firebaseapp.com",
    databaseURL: "https://cs-188-project-6dbc0.firebaseio.com",
    projectId: "cs-188-project-6dbc0",
    storageBucket: "cs-188-project-6dbc0.appspot.com",
    messagingSenderId: "771159556171"
	};

	// Initialize the default app
	var defaultApp = firebase.initializeApp(config);

	// Initialize Cloud Firestore through Firebase
	var db = firebase.firestore();

	// Disable deprecated features
	db.settings({
  		timestampsInSnapshots: true
	});

  readData();

  // write data to database
  function writeData(cur_subtotal, cur_tax, cur_bookingFee, cur_total) {
    db.collection("orderTotal").add({
        subtotal: cur_subtotal,
        tax: cur_tax,
        bookingFee: cur_bookingFee,
        total: cur_total

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

	// read data from database
	function readData() {
		db.collection("Items").orderBy("time").get().then((querySnapshot) => {
    		querySnapshot.forEach((doc) => {

        // read item data
				var data = doc.data();
				var cur_title = data.title;
				var cur_price = data.price;
				var cur_quantity = data.quantity;
				var cur_notes = data.notes;

        subTotal += Math.round(data.price * 100) / 100;

        var serving = "";

        if (cur_quantity == 1) {
          serving = " Serving";
        } else {
          serving = " Servings";
        }

        $('#orderList').append( '<a href="../Order/6_editItem.html">' +
          '<div class="item">' +
					'<div class="item-title">' +
          cur_title + '</div>' +
					'<div class="item-price">$' + cur_price + '</div>' +
					'<div class="item-extra">' +
					'<div class="item-note">' + cur_notes + '</div>' +
					'<div class="item-number">' + cur_quantity + serving + '</div>' +
					'</div>' +
				  '</div>' + '</a>');
    		});

        tax = Math.round( 0.095 * subTotal * 100) / 100;
        bookingFee = Math.round( 4.99 * 100) / 100;
        total =  Math.round((subTotal + tax + bookingFee) * 100) / 100;

        var dt = new Date();
        var hour = dt.getHours();
        var minute = dt.getMinutes() + 30;
        var period  = "";
        var zero1 = "";
        var zero2 = "";

        if (hour == 24) {
          hour = 12;
          period = "AM";
        } else if (hour == 12){
          period = "PM";
        } else if (hour > 12 ) {
          hour -= 12;
          period = "PM";
        } else {
          period = "AM";
        }

        if (minute >= 60) {
          hour += 1;
          minute -= 60;
        }

        if (hour < 10) {
          zero1 = "0";
        }

        if (minute < 10) {
          zero2 = "0";
        }

        var time = zero1 + hour + ":" + zero2 + minute + " " + period;

        $('#time').html(
          '<div class="time-text"><i class="far fa-clock"></i> Expected Arrival</div>' +
          '<div class="time-time">' + time + '</div>'
        )

        $('#checkout').html(
          '<div class="checkout-item">' +
          '<div class="checkout-title">Subtotal</div>' +
          '<div class="checkout-price">$' + subTotal + '</div>' +
          '</div>'+
          '<div class="checkout-item">' +
          '<div class="checkout-title">Tax</div>' +
          '<div class="checkout-price">$' + tax + '</div>' +
          '</div>' +
          '<div class="checkout-item">' +
          '<div class="checkout-title">Booking Fee</div>' +
          '<div class="checkout-price">$' + bookingFee +'</div>' +
          '</div>'
        )

        $('#total').html(
          '<div class="total-title">Total</div>' +
          '<div class="total-price">$' + total + '</div>'
        )

        writeData(subTotal, tax, bookingFee, total);

		});
	}

});
