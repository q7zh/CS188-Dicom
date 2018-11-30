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

	// read data from database
	function readData() {
    db.collection("extraInfo").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          // read item data
          var data = doc.data();
          var cur_restaurant = data.restaurant;
          var cur_expectedTime = data.expectedTime;

          $('#time').html(cur_expectedTime)

          $('#title').html(cur_restaurant)
      });
    });
	}

  function deleteData() {
    db.collection("items").delete()
    .catch(function(error) {
        console.error("Error removing document: ", error);
    });
  }

});
