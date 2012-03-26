//Application Window Component Constructor
exports.ApplicationWindow = function() {
	var geo = require('geo');
	
	//create object instance
	var self = Ti.UI.createWindow({
		backgroundColor:'#fff',
		fullscreen: false,
		exitOnClose: true
	});

	// create UI components
	var view = Ti.UI.createView({
		backgroundColor: '#800',
		height: '50dp',
		top: 0
	});
	var textfield = Ti.UI.createTextField({
		height: '40dp',
		top: '5dp',
		left: '5dp',
		right: '50dp',
		style: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
		hintText: 'Enter an address',
		backgroundColor: '#fff',
		paddingLeft: '5dp'
	});
	var button = Ti.UI.createButton({
		title: '+',
		font: {
			fontSize: '20dp',
			fontWeight: 'bold'	
		},
		top: '5dp',
		height: '40dp',
		width: '40dp',
		right: '5dp'
	});
	var mapview;
	
	// add map after window opens
	self.addEventListener('open', function() {
		// Make sure we only add the map once
		if (mapview !== undefined) {
			return;	
		}
		
		mapview = Titanium.Map.createView({
		    mapType: Titanium.Map.STANDARD_TYPE,
		    region: {
	    		latitude: geo.LATITUDE_BASE, 
	    		longitude: geo.LONGITUDE_BASE,
		        latitudeDelta: 0.1, 
		        longitudeDelta: 0.1
		    },
		    animate:true,
		    regionFit:true,
		    userLocation:false,
		    top: '50dp'
		});
		
		// Add initial annotation
		mapview.addAnnotation(Ti.Map.createAnnotation({
			animate: true,
			pincolor: Titanium.Map.ANNOTATION_RED,
			title: 'Appcelerator',
			latitude: geo.LATITUDE_BASE,
			longitude: geo.LONGITUDE_BASE,
			leftButton: '/images/delete.png'
		}));
		
		// Handle all map annotation clicks
		mapview.addEventListener('click', function(e) {
			if (e.annotation && (e.clicksource === 'leftButton' || e.clicksource == 'leftPane')) {  
				mapview.removeAnnotation(e.annotation);
			}         
		});
		self.add(mapview);
	});
	
	
	// Execute forward geocode on button click
	button.addEventListener('click', function() {	
		textfield.blur();
		geo.forwardGeocode(textfield.value, function(geodata) {
			mapview.addAnnotation(Ti.Map.createAnnotation({
		    	animate: true,
		    	pincolor: Titanium.Map.ANNOTATION_RED,
		    	title: geodata.title,
		    	latitude: geodata.coords.latitude,
		    	longitude: geodata.coords.longitude,
		    	leftButton: '/images/delete.png'
		    })); 
		    mapview.setLocation({
		    	latitude: geodata.coords.latitude, 
		    	longitude: geodata.coords.longitude,
		        latitudeDelta: 1, 
		        longitudeDelta: 1
		    });
		});
	});
	
	// assemble view hierarchy
	view.add(textfield);
	view.add(button);
	self.add(view);
	
	return self;
};
