﻿// THIS CODE AND INFORMATION IS PROVIDED "AS IS" WITHOUT WARRANTY OF
// ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING BUT NOT LIMITED TO
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND/OR FITNESS FOR A
// PARTICULAR PURPOSE.
//
// Copyright (c) Microsoft Corporation. All rights reserved

(function () {
    "use strict";

    function TouchProviderConstructor(inputElement) {

        var recognizer = new Windows.UI.Input.GestureRecognizer();
        recognizer.gestureSettings = Windows.UI.Input.GestureSettings.manipulationRotate;

        this._manipulationUpdated = this._manipulationUpdated.bind(this);
        this._manipulationCompleted = this._manipulationCompleted.bind(this);

        inputElement.addEventListener("MSPointerDown", function (evt) {
            var pp = evt.currentPoint;
            recognizer.processDownEvent(pp);
        }, false);

        inputElement.addEventListener("MSPointerMove", function (evt) {
            var pps = evt.intermediatePoints;
            recognizer.processMoveEvents(pps);
        }, false);

        inputElement.addEventListener("MSPointerUp", function (evt) {
            var pp = evt.currentPoint;
            recognizer.processUpEvent(pp);
        }, false);

        recognizer.addEventListener("manipulationupdated", this._manipulationUpdated);
        recognizer.addEventListener("manipulationcompleted", this._manipulationCompleted);

        this.displayRotation = 0;
    }

    var touchProviderMembers = {

        setRotation: function () {
        },

        animateRotation: function () {
        },

        _manipulationUpdated: function (args) {
            var degrees = this.displayRotation + args.cumulative.rotation;
            this.setRotation(degrees);
        },

        _manipulationCompleted: function (args) {
            var degrees = args.cumulative.rotation;
            var adjustment = Math.round(degrees / 90) * 90;

            this.displayRotation = (this.displayRotation + adjustment) % 360;
            this.animateRotation(adjustment);
        }
    };

    WinJS.Namespace.define("Hilo.Rotate", {
        TouchProvider: WinJS.Class.define(TouchProviderConstructor, touchProviderMembers)
    });

})();