﻿define('Hilo.pages.detail', function (require) {
    'use strict';

    var // WinJS
        ui = require('WinJS.UI'),
        nav = require('WinJS.Navigation'),
        pages = require('WinJS.UI.Pages'),
        // Hilo
        repo = require('Hilo.PicturesRepository');

    var page = {

        ready: function (element, selectedIndex) {        

            // TODO: expect this implementation to change

            var section = document.querySelector('section[role="main"]');
            section.innerHtml = '';

            var img = document.createElement('img');
            section.appendChild(img);
            img.addEventListener('load', function () {
                ui.Animation.fadeIn(img);
            });

            repo.getImageAt(selectedIndex).then(function (selected) {
                img.src = URL.createObjectURL(selected);
            });            
        },

        unload: function () {
            // TODO: unwire any events
        }
    };

    pages.define('/Hilo/pages/detail.html', page);
    return page;
});
