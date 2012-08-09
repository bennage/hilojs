﻿(function () {
    "use strict";

    // Imports And Variables
    // ---------------------
    var templates = Windows.UI.Notifications.TileTemplateType,
        tileUpdateManager = Windows.UI.Notifications.TileUpdateManager;

    // Private Methods
    // ---------------

    function buildWideTile(thumbnailFilePaths) {

        // For more information about the `TileWideImageCollection` template, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx#TileWideImageCollection
        var template = templates.tileWideImageCollection;

        var xml = tileUpdateManager.getTemplateContent(template);
        var images = xml.getElementsByTagName("image");

        thumbnailFilePaths.forEach(function (thumbnailFilePath, index) {
            var element = images.getAt(index);
            element.attributes.getNamedItem("src").innerText = thumbnailFilePath;
        });

        return xml;
    }

    function buildSquareTile(thumbnailFilePath) {
        // For more information about the `TileSquareImage` template, see:
        // http://msdn.microsoft.com/en-us/library/windows/apps/hh761491.aspx#square_image-only_templates
        var template = templates.tileSquareImage;
        var xml = tileUpdateManager.getTemplateContent(template);

        var imageTags = xml.getElementsByTagName("image");
        imageTags[0].setAttribute("src", thumbnailFilePath);

        return xml;
    }

    // Export Public API
    // -----------------

    WinJS.Namespace.define("Hilo.Tiles.populateTemplate", {
        wideTile: buildWideTile,
        squareTile: buildSquareTile
    });

})();