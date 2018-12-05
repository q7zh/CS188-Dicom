$(document).ready(function(){

	///////////////////////////////////////////////////////////////////
	//Constants and functions to set up
	let firstTimeSavingItem;

	async function saveToDB(myDb, myDocRef, firstSaveForItem) {
		console.log("Initiating save to Firestore...");
		console.log($("#selectedQuantityValue").attr("value"));

		//See editItem.js for details on DB scheme
		await myDocRef.set({
			title: ITEMNAME,
			price: ITEMPRICE,
			quantity: $("#selectedQuantityValue").attr("value"),
			notes: $("#noteValue").val() //NOT .html(), see http://api.jquery.com/val/
		}).then(function() {
			console.log("Status saved!");
		}).catch(function(error) {
			console.log("Got an error saving to Firestore: ", error);
		});

		if (firstSaveForItem)
		{
			//And now... Let's update our dictionary with this newly created doc's id
	   		//(The collection must already contain this doc in order for update() to work)
	   		await myDb.collection(COLLECTIONNAME).doc("document_dictionary").update({
					[ITEMNAME]: myDocRef.id
				}).then(function() {
					console.log("Document Dictionary updated in Firestore!");
				}).catch(function(error) {
					console.log("Error updating Document Dictionary in Firestore: ", error);
			});
		}
	}

	async function getDocForItem(myDb, myName) {
		let myDocRef;

		//See "get()"--this returns a promise to a DocumentSnapshot object
        //https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentReference#get
        //Also:  https://firebase.google.com/docs/reference/js/firebase.firestore.DocumentSnapshot
        await myDb.collection(COLLECTIONNAME).doc("document_dictionary").get().then(async function(doc) {
	       	if (doc && doc.exists) {
	       		const myData = doc.data();
	       		
	       		if (doc.get(myName) != undefined)
	       		{
	       			console.log("Field exists for", myName, "in document_dictionary");
	       			firstTimeSavingItem = false;
	       			myDocRef = myDb.collection(COLLECTIONNAME).doc(doc.get(myName));
	       		}

	       		//Database doesn't contain doc for this item, so let's make it
	       		else 
	       		{
	       			console.log("Field does NOT exist for", myName, "in document_dictionary");
	       			firstTimeSavingItem = true;
       				myDocRef = myDb.collection(COLLECTIONNAME).doc();
	       		}
	       		console.log("Printing mydocRef right here");
	       		console.log(myDocRef);
		    }
	       	else
	       	{
	       		console.log("document_dictionary doesn't exist in Firestore. Let's go and make it...");
	       		//db.collection(COLLECTIONNAME).doc("document_dictionary").set(); //Creates the doc
	       	}

       }).catch(function (error) {
       	console.log("Error retrieving document_dictionary from Firestore: ", error)
       });

       	return myDocRef;
	}


	///////////////////////////////////////////////////////////////////
	//Check to see if this is the "edit" version of the page--if so,
	//go and change a few things
	//https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
	const urlParams = new URLSearchParams(window.location.search);
	let isEditPage = urlParams.get('isEditPage');
	if (isEditPage == null)
	{
		console.log("No value set for 'isEditPage' parameter!"); //Let's leave everything alone
		isEditPage = false;
	}
	else if (isEditPage == "yes")
	{
		console.log(isEditPage);
		isEditPage = true;
		$(".headerText").html("Edit Item");
		$("#addToCart").html("Update");
		$(".backButton").children("a").attr("href", "2_placeOrder.html");

	}
	else
	{
		console.log("Value set for isEditPage, but instead of 'yes', it's set to: ", isEditPage);
		isEditPage = false;
	}


	///////////////////////////////////////////////////////////////////
	//Initialize DB and do a read
	firebase.initializeApp({
		apiKey: "AIzaSyALZcFp77OEXeQVVxOXjsdAX0T9FDLpZo8",
	    authDomain: "cs188-project-6b18d.firebaseapp.com",
	    databaseURL: "https://cs188-project-6b18d.firebaseio.com",
	    projectId: "cs188-project-6b18d",
	    storageBucket: "cs188-project-6b18d.appspot.com",
	    messagingSenderId: "449496502426"
		//My values, above are Qiliang's
		//apiKey: "AIzaSyDmtlSHDnZwX2AF6jl2jx-SJCjyQnUTuts",
		//authDomain: "web-quickstart-f6007.firebaseapp.com",
		//projectId: "web-quickstart-f6007"
	});

    // Initialize Cloud Firestore through Firebase
    var db = firebase.firestore();
   	// Disable deprecated features
    db.settings({
        timestampsInSnapshots: true
    });

    //const docRef = db.doc("/test1/lod1CsUXdtSWoHFU0flD")


    getDocForItem(db, ITEMNAME).then(docRef => {
    	console.log("Printing from main loop");
		console.log(docRef);
		console.log(ITEMNAME);
		console.log(db);

       // Load from database
       docRef.get().then(function(doc) {
       	if (doc && doc.exists) {
       		const myData = doc.data();
       		if (myData.quantity == undefined)
       			$("#selectedQuantityValue").attr("value", "0");
       			//$("#topListItemText").html("0");
       		else 
       			$("#selectedQuantityValue").attr("value", myData.quantity);
       		$(".miniLoader").css('display', 'none');

       		if (myData.notes != undefined)
       			$("#noteValue").val(myData.notes)
       	}
       	else
       	{
       		console.log(ITEMNAME, "document in Firestore not found!");
       		$("#selectedQuantityValue").attr("value", "0");
       		$(".miniLoader").css('display', 'none');
       	}
       }).catch(function (error) {
       	console.log("Error loading item document from Firestore: ", error)
       });



        ///////////////////////////////////////////////////////////////////
        //Watch for Events
			$(".userQuantitySelection").click(function() {
				$(".userQuantityOptions").css('display', 'none');
				$("#topListItemText").html($(this).html());  
			});

			$(".userQuantityOptions").mouseleave(function() {
				$(this).css('display', ''); //resets display value to "blank"
				//https://stackoverflow.com/questions/1053418/jquery-temporarily-change-a-style-then-reset-to-original-class
			});

			$("#addToCart").click(async function () {
				$(".loader").css('display', '');
				console.log("Before saveToDB() call");
				await saveToDB(db, docRef, firstTimeSavingItem);
				console.log("After saveToDB() call");

				//Load next page
				//Refernece: https://stackoverflow.com/questions/133925/javascript-post-request-like-a-form-submit
				var form = $('<form></form>');

		    	form.attr("method", "get");
		    	if (isEditPage)
		    		form.attr("action", "./2_placeOrder.html");
		    	else
		    		form.attr("action", "./0_BCD_restaurantMenu.html");

		    //var parameters = {
		    //	"key1": "value1",
		    //	"key2": "value2"
		    //};

		    //http://api.jquery.com/jquery.each/
		    //$.each(parameters, function(key, value) {
		    //    var field = $('<input></input>');

		    //    field.attr("type", "hidden");
		    //    field.attr("name", key);
		    //    field.attr("value", value);

		    //    form.append(field);
		    //	});

		    // The form needs to be a part of the document in
		    // order for us to be able to submit it.
		    $(document.body).append(form);
		    form.submit();
		})

    }); //end getDocForItem promise resolve		        

});