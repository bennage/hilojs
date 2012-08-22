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

    // RubberBand View Constructor
    // ---------------------------

    function RubberBandViewConstructor(canvasEl, rubberBandEl) {
        this.canvas = canvasEl;
        this.context = canvasEl.getContext("2d");
        this.boundingRect = canvasEl.getBoundingClientRect();
        this.rubberBand = rubberBandEl;
    }

    // RubberBand View Members
    // -----------------------

    var rubberBandViewMembers = {
        draw: function (rubberBandCoords) {

            var positioning = this.getPositioning(rubberBandCoords);
            var bounding = this.boundingRect;
            var rubberBandStyle = this.rubberBand.style;

            var top = bounding.top + positioning.top;
            var left = bounding.left + positioning.left;
            var height = positioning.height;
            var width = positioning.width;

            rubberBandStyle.left = left + "px";
            rubberBandStyle.top = top + "px";
            rubberBandStyle.width = width + "px";
            rubberBandStyle.height = height + "px";

            this.drawShadedBox(rubberBandCoords);
        },

        drawShadedBox: function (coords) {
            var offset = 2;
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

    // RubberBand View Definition
    // --------------------------

    WinJS.Namespace.define("Hilo.Crop", {
        RubberBandView: WinJS.Class.define(RubberBandViewConstructor, rubberBandViewMembers)
    });

})();