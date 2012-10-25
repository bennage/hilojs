﻿// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    // CropSelection View Constructor
    // ---------------------------

    function CropSelectionViewConstructor(cropSelection, canvasEl, cropSelectionEl) {
        this.cropSelection = cropSelection;
        this.canvas = canvasEl;
        this.context = canvasEl.getContext("2d");
        this.cropSelectionEl = cropSelectionEl;

        this.reset(cropSelection.getCoords());

        cropSelection.addEventListener("reset", this.reset.bind(this));
    }

    // CropSelection View Members
    // -----------------------

    var cropSelectionViewMembers = {
        cropSelectionMove: function(args){
            this.draw(args.detail.coords);
        },

        reset: function () {
            var coords = this.cropSelection.getCoords();
            this.draw(coords);
        },

        draw: function (coords) {
            this.boundingRect = this.canvas.getBoundingClientRect();

            this.cropSelectionEl.style.display = "block";

            var positioning = this.getPositioning(coords);
            var bounding = this.boundingRect;
            var cropSelectionStyle = this.cropSelectionEl.style;

            var top = bounding.top + positioning.top;
            var left = bounding.left + positioning.left;
            var height = positioning.height;
            var width = positioning.width;

            cropSelectionStyle.left = left + "px";
            cropSelectionStyle.top = top + "px";
            cropSelectionStyle.width = width + "px";
            cropSelectionStyle.height = height + "px";

            this.drawShadedBox(coords);
        },

        drawShadedBox: function (coords) {
            var offset = 1;
            var boundHeight = this.boundingRect.height;
            var boundWidth = this.boundingRect.width;

            this.context.save();
            this.context.beginPath();

            // outer box, clockwise
            this.context.moveTo(0, 0);

            this.context.lineTo(boundWidth, 0);
            this.context.lineTo(boundWidth, boundHeight);
            this.context.lineTo(0, boundHeight);

            this.context.closePath();

            // inner box, counter-clockwise

            this.context.moveTo(coords.startX + offset, coords.startY + offset);

            this.context.lineTo(coords.startX + offset, coords.endY + offset);
            this.context.lineTo(coords.endX + offset, coords.endY + offset);
            this.context.lineTo(coords.endX + offset, coords.startY + offset);

            this.context.closePath();

            // Fill & cutout
            this.context.fillStyle = "rgba(0, 0, 0, 0.75)";
            this.context.fill();

            this.context.restore();
        },

        getPositioning: function (coords) {
            var left = coords.startX;
            var top = coords.startY;

            var width = coords.endX - left;
            var height = coords.endY - top;

            return {
                left: left,
                top: top,
                width: width,
                height: height
            };
        }

    };

    // CropSelection View Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        CropSelectionView: WinJS.Class.define(CropSelectionViewConstructor, cropSelectionViewMembers)
    });

})();
