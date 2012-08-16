﻿(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    var storage = Windows.Storage,
        promise = WinJS.Promise,
        thumbnailMode = storage.FileProperties.ThumbnailMode,
        knownFolders = Windows.Storage.KnownFolders;

    var getMonthYearFrom = Hilo.dateFormatter.getMonthYearFrom;

    // Private Methods
    // ---------------

    function setupMonthGroupListView(groups, members) {
        var listview = document.querySelector("#monthgroup").winControl;
        listview.groupDataSource = groups;
        listview.itemDataSource = members;
        listview.addEventListener("iteminvoked", itemInvoked);
    }

    function setupYearGroupListView(groups, members) {
        var listview = document.querySelector("#yeargroup").winControl;
        listview.itemDataSource = members;
        listview.groupDataSource = groups;
        listview.layout.maxRows = 3;
    }

    function interim_solution() {

        var queryBuilder = new Hilo.ImageQueryBuilder();

        var monthGroups = new Hilo.month.Groups(queryBuilder, knownFolders.picturesLibrary, getMonthYearFrom);
        var monthGroupMembers = new Hilo.month.Members(queryBuilder, knownFolders.picturesLibrary, getMonthYearFrom);

        var yearGroupMembers = WinJS.UI.computeDataSourceGroups(monthGroups, function (item) {
            return item.groupKey
        }, function (item) {
            return { title: item.groupKey }
        });
        var yearGroups = yearGroupMembers.groups;

        setupMonthGroupListView(monthGroups, monthGroupMembers);
        setupYearGroupListView(yearGroups, yearGroupMembers);
    }

    function itemInvoked(args) {
        args.detail.itemPromise.then(function (item) {

            // Build a query to represent the month/year group that was selected
            var queryBuilder = new Hilo.ImageQueryBuilder();
            queryBuilder
                .bindable()                          // ensure the images are data-bind-able
                .forMonthAndYear(item.data.name);    // only load images for the month and year group we selected

            var query = queryBuilder.build(knownFolders.picturesLibrary);
            var selected = 0; //HACK: pretend we clicked on the first image in the group

            // Navigate to the detail view to show the results of this query with the selected item
            WinJS.Navigation.navigate("/Hilo/detail/detail.html", { query: query, itemIndex: selected });
        });
    }

    // Public API
    // ----------
    var page = {
        ready: function (element, options) {

            // I18N resource binding for this page
            WinJS.Resources.processAll();

            interim_solution();
        },

        updateLayout: function (element, viewState, lastViewState) {
        },

        unload: function () {
        }
    };

    WinJS.UI.Pages.define("/Hilo/month/month.html", page);
})();
