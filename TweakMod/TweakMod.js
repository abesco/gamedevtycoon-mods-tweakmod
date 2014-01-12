(function () {
    var ready = function () {  
        TweakMod.init();
    };

    var error = function () {
    };

    <!-- Include one of jTable styles. -->
 
    GDT.loadJs(['mods/TweakMod/source/source.js'], ready, error);
})();