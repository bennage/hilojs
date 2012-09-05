// ===============================================================================
//  Microsoft patterns & practices
//  Hilo JS Guidance
// ===============================================================================
//  Copyright © Microsoft Corporation.  All rights reserved.
//  This code released under the terms of the 
//  Microsoft patterns & practices license (http://hilojs.codeplex.com/license)
// ===============================================================================

﻿describe("Rotate Appbar Presenter", function () {
	var appBarPresenter, el, saveButton, cancelButton, clockwiseButton, counterClockwiseButton;

	beforeEach(function () {
		saveButton = new Specs.WinControlStub();
		cancelButton = new Specs.WinControlStub();
		clockwiseButton = new Specs.WinControlStub();
		counterClockwiseButton = new Specs.WinControlStub();

		el = new Specs.WinControlStub();

		el.show = function () {
			el.show.wasCalled = true;
		};

		el.querySelector = function (selector) {
			if (selector === "#save") { return saveButton; }
			if (selector === "#cancel") { return cancelButton; }
			if (selector === "#clockwise") { return clockwiseButton; }
			if (selector === "#counterClockwise") { return counterClockwiseButton; }
		};

		appBarPresenter = new Hilo.Rotate.AppBarPresenter(el);
	});

	describe("when the rotate menu is initialized", function () {

		it("should disable the save button", function () {
			expect(saveButton.disabled).true;
		});

		it("should disable the cancel button", function () {
			expect(cancelButton.disabled).true;
		});

		it("should show the app bar", function () {
			expect(el.show.wasCalled).true;
		});
	});

	describe("when clicking rotate clockwise", function () {
		var imageRotateHandler;

		beforeEach(function(){
			imageRotateHandler = function (args) {
				imageRotateHandler.args = args.detail;
			};

			appBarPresenter.addEventListener("rotate", imageRotateHandler);

			clockwiseButton.dispatchEvent("click");
		});

		it("should trigger image rotation, 90 degrees", function () {
			expect(imageRotateHandler.args.rotateDegrees).equals(90);
		});

		it("should enable the save button", function () {
			expect(saveButton.disabled).equals(false);
		});

		it("should enable the cancel button", function(){
			expect(cancelButton.disabled).equals(false);
		});
	});

	describe("when clicking rotate counter-clockwise", function () {
		var imageRotateHandler;

		beforeEach(function(){
			imageRotateHandler = function (args) {
				imageRotateHandler.args = args.detail;
			};

			appBarPresenter.addEventListener("rotate", imageRotateHandler);

			counterClockwiseButton.dispatchEvent("click");
		});

		it("should trigger image rotation, -90 degrees", function () {
			expect(imageRotateHandler.args.rotateDegrees).equals(-90);
		});

		it("should enable the save button", function () {
			expect(saveButton.disabled).equals(false);
		});

		it("should enable the cancel button", function(){
			expect(cancelButton.disabled).equals(false);
		});
	});

	describe("when clicking save", function () {
		var saveHandler;

		beforeEach(function () {
			saveHandler = function () {
				saveHandler.wasCalled = true;
			}

			appBarPresenter._enableButtons();
			appBarPresenter.addEventListener("save", saveHandler);

			saveButton.dispatchEvent("click");
		});

		it("should trigger image save", function () {
			expect(saveHandler.wasCalled).true;
		});

		it("should disable the save button", function () {
			expect(saveButton.disabled).true;
		});

		it("should disable the cancel button", function () {
			expect(cancelButton.disabled).true;
		});
	});

	describe("when clicking cancel", function () {
		var cancelHandler, imageResetHandler;

		beforeEach(function () {
			cancelHandler = function () {
				cancelHandler.wasCalled = true;
			}

			imageResetHandler = function (args) {
				imageResetHandler.wasCalled = true;
			};

			appBarPresenter._enableButtons();
			appBarPresenter.addEventListener("reset", imageResetHandler);
			appBarPresenter.addEventListener("cancel", cancelHandler);

			cancelButton.dispatchEvent("click");
		});

		it("should trigger to cancel the image changes", function () {
			expect(cancelHandler.wasCalled).true;
		});

		it("should reset the rotation back to the default", function () {
			expect(imageResetHandler.wasCalled).true;
		});

		it("should disable the save button", function () {
			expect(saveButton.disabled).true;
		});

		it("should disable the cancel button", function () {
			expect(cancelButton.disabled).true;
		});
	});

});