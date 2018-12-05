$( document ).ready(function() {

	// Initialize Firebase
	var config = {
    apiKey: "AIzaSyALZcFp77OEXeQVVxOXjsdAX0T9FDLpZo8",
    authDomain: "cs188-project-6b18d.firebaseapp.com",
    databaseURL: "https://cs188-project-6b18d.firebaseio.com",
    projectId: "cs188-project-6b18d",
    storageBucket: "cs188-project-6b18d.appspot.com",
    messagingSenderId: "449496502426"
    // apiKey: "AIzaSyD7wc7mQw4uB1Lg_lwftU_iDe2il2fsbKs",
    // authDomain: "cs-188-project-6dbc0.firebaseapp.com",
    // databaseURL: "https://cs-188-project-6dbc0.firebaseio.com",
    // projectId: "cs-188-project-6dbc0",
    // storageBucket: "cs-188-project-6dbc0.appspot.com",
    // messagingSenderId: "771159556171"
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

  var subTotal = 0;
  var tax = 0;
  var bookingFee = 0;
  var total = 0;

  function writeOrderTotal(cur_subtotal, cur_tax, cur_bookingFee, cur_total) {
    // https://firebase.google.com/docs/firestore/manage-data/add-data
    // Let's just hardcode a doc to always check for now...
    //db.collection("orderTotal").add({ //Don't keep making new documents each time!!
    db.collection("orderTotal").doc("kevin's_badass_orderTotal").set({
        subtotal: cur_subtotal,
        tax: cur_tax,
        bookingFee: cur_bookingFee,
        total: cur_total

    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  function writeExtraInfo(cur_restaurant, cur_orderTime, cur_expectedTime, cur_shared, cur_notes) {
    //db.collection("extraInfo").add({
    db.collection("extraInfo").doc("kevin's_sickass_extraInfo").set({
        restaurant: cur_restaurant,
        orderTime: cur_orderTime,
        expectedTime: cur_expectedTime,
        shared: cur_shared,
        notes: cur_notes
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
  }

  let itemPageDictionary = {
    "Tofu": "1_BCD_tofu",
    "Fried Mandu": "1_BCD_friedMandu",
    "Egg Rolls": "1_BCD_eggRoll"
  }; // Note: This is a rather poor implementation since it depends on the names we 
     //       assign to each item in their respective html pages. But whatever, let's
     //       hardcode away... 


	// read data from database
	function readData() {
    
    //For testing--eg put "document_dictionary" here
    //db.collection("orderTotal").doc("JxaYzTqFxNbVjZwOLGNy").get().then(function(doc) {
    //  console.log(doc.data());
    //})

    //For manipulation purposes:
    //db.collection("items").doc("document_dictionary").delete();
    //db.collection("items").doc("document_dictionary").set( {testValue: "KevinPutThisHere!"});

    //Should do this in b/w .collection and .get() --> orderBy("time")
		db.collection("items").get().then((querySnapshot) => {
    		console.log(querySnapshot.size);
        querySnapshot.forEach((doc) => {

          // read item data
  				var data = doc.data();
  				var cur_title = data.title;
  				var cur_price = data.price;
  				var cur_quantity = data.quantity;
  				var cur_notes = data.notes;

          //Makes sure document_dictionary doesn't screw things up, since it's also in this collection
          if (cur_title != undefined && cur_quantity != 0 && cur_title != "Tofu Stew") 
          {
            console.log(cur_quantity);
            subTotal += (Math.round(data.price * 100) / 100) * cur_quantity;

            var serving = "";

            if (cur_quantity == 1) {
              serving = " Serving";
            } else {
              serving = " Servings";
            }

            let pageLink = '<form class="editItemForm" style="cursor:pointer;" action="./' 
                            + itemPageDictionary[cur_title] + '.html" method="get">'; 

            $('#orderList').append( pageLink +
              '<div class="item">' +
              '<div class="item-title">' +
              cur_title + '</div>' +
              '<div class="item-price">$' + cur_price + ' each</div>' +
              '<div class="item-extra">' +
              '<div class="item-note">' + cur_notes + '</div>' +
              '<div class="item-number">' + cur_quantity + serving + '</div>' +
              '</div>' +
              '</div>' + 
              '<input name="isEditPage" type="hidden" value="yes">' +
              '<input type="submit" style="display: none;"/>' +
              '</form>');

          }

        });

        tax = Math.round( 0.095 * subTotal * 100) / 100;
        bookingFee = Math.round( 4.99 * 100) / 100;
        total =  Math.round((subTotal + tax + bookingFee) * 100) / 100;

        $('#checkout').html(
          '<div class="checkout-item">' +
          '<div class="checkout-title">Subtotal</div>' +
          '<div class="checkout-price">$' + subTotal.toFixed(2) + '</div>' +
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

         console.log("About to write total");
         console.log(total);

        $(".editItemForm").click(function() {
          $(this).submit();
        });

        writeOrderTotal(subTotal, tax, bookingFee, total);

		});

    //db.collection("extraInfo").get().then((querySnapshot) => {
    db.collection("extraInfo").doc("kevin's_sickass_extraInfo").get().then(doc => {
        //querySnapshot.forEach((doc) => {

          // read item data
          var data = doc.data();
          var cur_shared = data.shared;
          var cur_notes = data.notes;
          var elem = document.getElementById("shared_button");

          if (cur_shared == "Shared"){
            elem.style.backgroundColor ='#F5A623';
          }
          else {            
            elem.style.backgroundColor ='#0066ff';
          }

          elem.value = cur_shared;
          document.getElementById("notes").value = data.notes;
        });
    //});
	}

  // expected time
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

  // continue onclick function
  document.getElementById('continue').onclick=function(){

    // shared
    var shared = document.getElementById("shared_button").value;

    // restaurant
    var restaurant = $('#restaurant').text();
    console.log(restaurant);

    // notes
    var notes = document.getElementById("notes").value;

    writeExtraInfo(restaurant, dt, time, shared, notes);
    window.location.href='3_reviewOrder.html';
  }

  // $( ".item" ).click(function() {
  //   $( this ).children(".submit();
  // });



});
