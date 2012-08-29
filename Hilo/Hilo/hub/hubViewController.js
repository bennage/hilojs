// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿(function () {
    "use strict";
    
    // Imports And Constants
    // ---------------------
    
    var knownFolders = Windows.Storage.KnownFolders;

    // Hub View Controller Constructor
    // -------------------------------

    // The Hub view controller is an implementation of [the mediator pattern][1],
    // designed to coordinate multiple components of an individual page to
    // facilitate all of the functionality of that page. 
    //
    // The HubViewController requires 4 parameters for the constructor function:
    //
    // 1. `nav` - the `WinJS.Navigation` object, used to navigate to other pages
    // 2. `imageNav` - an instance of `Hilo.Controls.ImageNav.ImageNavController`
    // 3. `listView` - an instance of `Hilo.Hub.ListViewController`
    // 4. `queryBuilder` - an instance of `Hilo.ImageQueryBuilder`
    // 
    // Each individual component of the page is focused on one specific set 
    // of behaviors - both visually and in code. This creates a very clean
    // separation of concerns for each functional area of the screen. The 
    // mediator, then, brings all of the functionality of each component 
    // together. It listens to events from one component and determines what 
    // to do with the other components in response. 
    //
    // [1]: http://en.wikipedia.org/wiki/Mediator_pattern
    //
    function HubViewController(nav, imageNav, listview, queryBuilder) {
        this.nav = nav;
        this.imageNav = imageNav;
        this.listview = listview;
        this.queryBuilder = queryBuilder;
    };

    // Hub View Controller Methods
    // ---------------------------

    var hubViewControllerMethods = {

        // Starts processing the events from individual components, to 
        // facilitate the functionality of the other components.
        start: function () {

            // The [ECMASCript5 `bind`][2] function is used to ensure that the
            // context (the `this` variable) of each of the specified
            // callback functions is set correctly, when the event triggers
            // and the callback is executed.
            // 
            // [2]: http://msdn.microsoft.com/en-us/library/windows/apps/ff841995
            //
            this.listview.addEventListener("selectionChanged", this.selectionChanged.bind(this));
            this.listview.addEventListener("itemInvoked", this.itemClicked.bind(this));
        },

        // The callback method for item selection in the listview changing.
        // This function coordinates the selection changes with the 
        // ImageNavController to show and hide it appropriately.
        selectionChanged: function (args) {

            if (args.detail.hasItemSelected) {
                // If someone an image is selected, show the image nav
                // app bar with the "crop" and "rotate" buttons
                this.imageNav.setImageIndex(args.detail.itemIndex, true);
            } else {
                // If no images are selected, hide the app bar
                this.imageNav.clearImageIndex(true);
            }

        },

        // When an item is "invoked" (clicked or tapped), navigate to
        // the detail screen to display this image in the month-group
        // that it belongs to, based on the "ItemDate" of the picture.
        itemClicked: function (args) {

            // get the `Hilo.Picture` item that was bound to the invoked image
            var picture = args.detail.item.data;

            // Build various parameters to determine the image
            // index and the month and year it was taken.
            // TODO: get the actual item index based on the query that is built
            var itemIndex = picture.groupIndex;
            var dateTaken = picture.itemDate;
            // TODO: Perhaps we can pass the `getMonthYearFrom` as a dependency?
            var monthAndYear = Hilo.dateFormatter.getMonthYearFrom(picture.itemDate);

            // Build the query for the month and year of the invoked image
            var query = this.queryBuilder
                .bindable()
                .forMonthAndYear(monthAndYear)
                .build(knownFolders.picturesLibrary);

            // Navigate to the detail view, specifying the month query to
            // show, and the index of the individual item that was invoked
            this.nav.navigate("/Hilo/detail/detail.html", { itemIndex: itemIndex, query: query });
        }
    };

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Hub", {
        HubViewController: WinJS.Class.define(HubViewController, hubViewControllerMethods)
    });

})();
