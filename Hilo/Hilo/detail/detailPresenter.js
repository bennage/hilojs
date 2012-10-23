﻿// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // Detail Presenter Constructor
    // ----------------------------
    // <SnippetHilojs_1205>
    function DetailPresenterConstructor(filmstripEl, flipviewEl, hiloAppBar) {
        this.flipviewEl = flipviewEl;
        this.filmstripEl = filmstripEl;
        this.hiloAppBar = hiloAppBar;
    }
    // </SnippetHilojs_1205>

    // Detail Presenter Members
    // ------------------------

    var detailPresenterMembers = {

        // <SnippetHilojs_1206>
        start: function (options) {
            var self = this;
            this.query = options.query;

            return this.query.execute()
                .then(this.bindImages.bind(this))
                .then(function () {
                    self.gotoImage(options.itemIndex, options.picture);
                });
            },
        // </SnippetHilojs_1206>

        // <SnippetHilojs_1207>
        bindImages: function (images) {

            this.flipview = new Hilo.Detail.FlipviewPresenter(this.flipviewEl, images);
            this.flipview.addEventListener("pageSelected", this.imageClicked.bind(this));

            this.filmstrip = new Hilo.Detail.FilmstripPresenter(this.filmstripEl, images);
            this.filmstrip.addEventListener("imageInvoked", this.imageClicked.bind(this));

            this.hiloAppBar.enableButtons();
        },
        // </SnippetHilojs_1207>

        imageClicked: function (args) {
            var self = this,
                itemIndex = args.detail.itemIndex;

            args.detail.itemPromise.then(function (item) {
                self.gotoImage(itemIndex, item.data);

                if (item.data.isCorrupt) {
                    self.hiloAppBar.disableButtons();
                } else {
                    self.hiloAppBar.enableButtons();
                }
            });

            this.dispatchEvent("pageSelected", {
                itemIndex: itemIndex
            });
        },

        gotoImage: function (itemIndex, picture) {

            this.flipview.showImageAt(itemIndex);

            this.hiloAppBar.setNavigationOptions({
                itemIndex: itemIndex,
                itemName: picture.name,
                query: this.query,
                picture: picture
            });
        }
    };

    // Detail Presenter Definition
    // ---------------------------

    // <SnippetHilojs_1204>
    WinJS.Namespace.define("Hilo.Detail", {
        DetailPresenter: WinJS.Class.mix(DetailPresenterConstructor, detailPresenterMembers, WinJS.Utilities.eventMixin)
    });
    // </SnippetHilojs_1204>
})();
