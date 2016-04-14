// The contents of this file will be executed before any of
// your view controllers are ever executed, including the index.
// You have access to all functionality on the `Alloy` namespace.
//
// This is a great place to do any initialization for your app
// or create any global variables/functions that you'd like to
// make available throughout your app. You can easily make things
// accessible globally by attaching them to the `Alloy.Globals`
// object. For example:
//
// Alloy.Globals.someGlobalFunction = function(){};

// Since this file will be compiled to Titanium's bootstrap in Resources/app.js
// any variables will polute the global scope. Therefor, it's best practice to
// wrap your code in a self-executing function.
(function (global) {

	// On iOS views start behind the 20dp high statusBar. we use this
	// global in styles/app.tss to make sure our canvas starts under it.
	Alloy.Globals.canvasTop = OS_IOS ? 20 : 0;

	// We pass `this` so you could use `global.foo` to force a global variable.
})(this);
