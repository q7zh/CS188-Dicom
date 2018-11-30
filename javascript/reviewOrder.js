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

	 // read data from database
  function readData() {
    //.orderBy("time")
    db.collection("items").get().then((querySnapshot) => {
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

          subTotal += Math.round(data.price * 100) / 100;

          var serving = "";

          if (cur_quantity == 1) {
            serving = " Serving";
          } else {
            serving = " Servings";
          }

          $('#orderList').append('<div class="item">' +
            '<div class="item-title">' +
            cur_title + '</div>' +
            '<div class="item-price">$' + cur_price + '</div>' +
            '<div class="item-extra">' +
            '<div class="item-note">' + cur_notes + '</div>' +
            '<div class="item-number">' + cur_quantity + serving + '</div>' +
            '</div>' +
            '</div>');
        }
    });
  });

    //db.collection("orderTotal").get().then((querySnapshot) => {
    //  querySnapshot.forEach((doc) => {
    db.collection("orderTotal").doc("kevin's_badass_orderTotal").get().then(function(doc) {
      if (doc && doc.exists) {
        const myData = doc.data();

         // read item data
        var data = doc.data();
        var cur_subtotal = data.subtotal;
        var cur_tax = data.tax;
        var cur_bookingFee = data.bookingFee;
        var cur_total = data.total;

        var elem = document.getElementById("shared_button");

        $('#checkout').html(
          '<div class="checkout-item">' +
          '<div class="checkout-title">Subtotal</div>' +
          '<div class="checkout-price">$' + cur_subtotal + '</div>' +
          '</div>'+
          '<div class="checkout-item">' +
          '<div class="checkout-title">Tax</div>' +
          '<div class="checkout-price">$' + cur_tax + '</div>' +
          '</div>' +
          '<div class="checkout-item">' +
          '<div class="checkout-title">Booking Fee</div>' +
          '<div class="checkout-price">$' + cur_bookingFee +'</div>' +
          '</div>'
        )

        $('#total').html(
          '<div class="total-title">Total</div>' +
          '<div class="total-price">$' + cur_total + '</div>'
        )
      }
      else
        {
          console.log("kevin's_badass_orderTotal", "document in Firestore not found!");
        }
    }).catch(function (error) {
        console.log("Error loading item document from Firestore: ", error);
    });

    db.collection("extraInfo").doc("kevin's_sickass_extraInfo").get().then(function(doc) {
        if (doc && doc.exists) {

          // read item data
          var data = doc.data();
          var cur_restaurant = data.restaurant;
          var cur_shared = data.shared;
          var cur_expectedTime = data.expectedTime;
          var elem = document.getElementById("shared_button");

          if (cur_shared == "Shared"){
            elem.style.backgroundColor ='#F5A623';
          }
          else {            
            elem.style.backgroundColor ='#0066ff';
          }

          elem.value = cur_shared;

          $('#time').html(
            '<div class="time-text"><i class="far fa-clock"></i> Expected Arrival</div>' +
            '<div class="time-time">' + cur_expectedTime + '</div>'
          )

          $('#title').html(cur_restaurant)

      };
    });
  }

});
