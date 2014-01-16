(function () {
    var ready = function () {  
        TweakMod.init();
    };

    var error = function () {
    };

    GDT.loadJs(['mods/TweakMod/source/source.js'], ready, error);
})();