﻿// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

(function () {
    "use strict";

    // Picture View Constructor
    // ------------------------

    function PictureViewConstructor(canvasEl, cropSelection, imageUrl) {
        this.canvasEl = canvasEl;
        this.canvasSize = canvasEl.getBoundingClientRect();
        this.context = canvasEl.getContext("2d");
        this.loadImage(imageUrl);

        // <SnippetHilojs_1702>
        cropSelection.addEventListener("move", this.drawImage.bind(this));
        // </SnippetHilojs_1702>
        canvasEl.addEventListener("click", this.click.bind(this));
    }

    // Picture View Members
    // --------------------

    var pictureViewMembers = {

        loadImage: function (imageUrl) {
            this.image = new Image();

            var self = this;
            this.image.onload = function () {

                self.imageSubset = {
                    startX: 0,
                    startY: 0,
                    endX: self.image.width,
                    endY: self.image.height
                };

                self.drawImage();
            };

            var imgEl = document.getElementById("image");
            if (imgEl) { imgEl.src = imageUrl; }

            this.image.src = imageUrl;
        },

        drawImage: function () {
            if (!this.image) { return; }

            var imageHeight = this.imageSubset.endY - this.imageSubset.startY;
            var imageWidth = this.imageSubset.endX - this.imageSubset.startX;

            this.context.drawImage(
                this.image,

                // cropped area of the image to draw
                this.imageSubset.startX, this.imageSubset.startY, imageWidth, imageHeight,

                // scale the cropped area in to the entire canvas
                0, 0, this.canvasSize.width, this.canvasSize.height
            );
        },

        setImageSubset: function (imageCoords) {
            this.imageSubset = imageCoords;
        },

        reset: function (scaledImageCoordinates) {
            this.canvasSize = this.canvasEl.getBoundingClientRect();
            this.setImageSubset(scaledImageCoordinates);
        },

        // <SnippetHilojs_1703>
        click: function () {
            this.dispatchEvent("preview");
        }
        // </SnippetHilojs_1703>
    };

    // Picture View Definition
    // -----------------------

    WinJS.Namespace.define("Hilo.Crop", {
        PictureView: WinJS.Class.mix(PictureViewConstructor, pictureViewMembers, WinJS.Utilities.eventMixin)
    });

})();
