﻿(function () {
    "use strict";

    // Imports And Constants
    // ---------------------

    // Private Methods
    // ---------------

    function FilmstripController(el, images) {
        this.el = el;
        this.winControl = el.winControl;
        this.setupControlHandlers();
        this.bindImages(images);
    }

    var filmstripController = {
        bindImages: function(images){
            this.winControl.itemDataSource = new WinJS.Binding.List(images).dataSource;
        },

        setupControlHandlers: function () {
            this.winControl.addEventListener("iteminvoked", this.itemClicked.bind(this));
        },

        getSelectedIndices: function(){
            return this.winControl.selection.getIndices();
        },

        itemClicked: function (args) {
            var selectedIndex = args.detail.itemIndex;
            this.dispatchEvent("imageInvoked", {
                itemIndex: selectedIndex
            });
        }
    }

    // Public API
    // ----------

    WinJS.Namespace.define("Hilo.Detail", {
        FilmstripController: WinJS.Class.mix(FilmstripController, filmstripController, WinJS.Utilities.eventMixin)
    });

})();