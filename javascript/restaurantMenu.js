$( document ).ready(function() {

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

	// write data to database
	function writeData(cur_title, cur_price, cur_quantity, cur_notes, cur_time) {
		db.collection("Items").add({
	    	title: cur_title,
	    	price: cur_price,
	    	quantity: cur_quantity,
	    	notes: cur_notes,
        time: cur_time
		})
		.catch(function(error) {
    		console.error("Error adding document: ", error);
		});
	}

	$("#pr3__clear").click(function() {
   	// 	$("tr.wrong").remove();
   	// 	$("tr.correct").remove();
    //
   	// 	db.collection("history").get().then((querySnapshot) => {
    // 		querySnapshot.forEach((doc) => {
    // 			deleteData(doc.id);
    // 		});
		// });
	})

});
