﻿// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

describe("picture view", function () {

    var url, rubberBand, context, view, canvasSize;

    beforeEach(function () {
        url = "http://placekitten.com/300/200";
        rubberBand = new Specs.EventStub();
        canvasSize = {
            height: 800,
            width: 600
        };
    });

    describe("when initializing", function () {
        beforeEach(function (done) {
            context = {
                drawImage: function () {
                    context.drawImage.wasCalled = true;

                    // complete the async beforeEach
                    done();
                }
            };

            view = new Hilo.Crop.PictureView(context, rubberBand, url, canvasSize);
        });

        it("should show the picture", function () {
            expect(context.drawImage.wasCalled).equals(true);
        });
    });

});