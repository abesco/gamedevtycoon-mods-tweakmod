/*
GameDevTycoon Expansion Module
**********************************************************************************************************************************************************
Name:                 TweakMod
Description:          Allows to tweak various aspects of the game.
Copyright:            © 2013 Francesco Abbattista
Url:                  http://www.abesco.de/
Notes:                None.
Credits:              SirEverard for his contribution of the game speed control.
**********************************************************************************************************************************************************
Version:              0.1.0
Launch:               December 25th, 2013
Last Update:          December 25th, 2013
**********************************************************************************************************************************************************
*/

var TweakModAbescoUG = {};
(function (ul) {   
    var self                                = this;
    var notificationsSelectAllButtonState   = false;
    var initialized                         = false;
    
    self.pad = function (str, max) {
        return str.length < max ? m.pad("0" + str, max) : str;
    };

    self.printObject = function(o) {
      var out = '';
      for (var p in o) {
        out += p + ', ';
        // out += p +'\n';
      }
      alert(out);
    };

    self.beforeShowingNotification = function(e) {
        
    };

    // Unique ID for data storage
    self.idDataStorage  = 'TweakModAbescoUG';
    
    // Data Storage handler object
    var dataStorage = function(tweakMod){
        var self = this;
        
        this.store   = GDT.getDataStore(tweakMod.idDataStorage);
        
        // Create proper fields if required
        if(!this.store){
            this.store = tweakMod.settings;
        }
        
        // Reset settings in storage
        this.reset = function() {
            this.store.settings = tweakMod.settings;  
        };
        
        // Save settings to storage   
        this.save = function() {
            this.store.settings  = tweakMod.settings;  
            this.store.data      = this.store.settings;      
            
            DataStore.saveSettings();

        };       
        
        // Load / Reload settings from storage
        this.load = function() {
            this.store = GDT.getDataStore(tweakMod.idDataStorage);
        };

        // Applies the settings from storage to this instance    
        this.apply = function() {
            var settings = DataStore.settings.modData[tweakMod.idDataStorage];
        };
        
        return this;
    };
    
    // Tweaks the in-game settings UI using tabs for a better experience
    var tweakedSettingsUI = (function (tweakMod) {
        var self            = this;
        var setupDone       = false;
        var settingsPanel   = null; // settingsPanel   = $('#settingsPanel');
        var settingsPanelChildren = null; // settingsPanelChildren   = settingsPanel.children();
        var tweakModSettingsContainer = null; // tweakModSettingsContainer = $(caller.loadHtml('settings'));
        
        // Force the setup regardless if it has been already done
        self.forceSetup = function() {
            self.setupDone = false;
            self.setup();
        };
        
        // Setup and tweak the settings UI
        self.setup = function() {
            // Prevent multiple calls
            if(self.setupDone) {
                return;
            }

            // Create the tab contents.
            UltimateLib.Configuration.addTab('TweakModNotifications', "Notifications", self.createTabNotifications());

            // --> self.createTabMisc();
            self.createTabDebug();
                        
            // Read settings values into UI
            self.updateValues();
            
            // Setup event handlers
            self.setupEventHandlers();
            
            /*

                    
            $('#TweakModSettingsSpeedUpConferencesCheckBox').attr('disabled', self.settings.conferences.skip);
            

            $('#TweakModSettingsSpeedUpConferencesCheckBox').change(function(e){
                instance.settings.conferences.speedUp = !($(e.target).attr('checked') === undefined);

                instance.dataStorage.save();
                instance.dataStorage.apply();
            });
            */
            

                    
            
        };      
        
        // Update the values in the settings screen
        self.updateValues = function() {
            // Set default values for gamespeed
            $('#TweakModSettingsGamespeedText').html('Game Speed (Normal = 10): ' + (GameManager._oldTimeModifier * 10));

            // Set default values for notifications
            $('#TweakModSettingsTypeWriterDelayNumberBox').val(tweakMod.settings.notifications.typeWriterDelay);
            $('#TweakModSettingsSpeedUpNotificationsCheckBox').val(tweakMod.settings.notifications.speedUp);

            // Set default values for conferences
            $('#TweakModSettingsConferencesSelect').val(tweakMod.settings.notifications.conferenceSpeedUpMode);      
            
            // Set game speed value
            $("#TweakModSettingsGamespeedSlider").slider({value : tweakMod.settings.game.gamespeed});
                              
        };     
                
        // START --- Private members ---
        // -----------------------------
        
        // TAB: Default Settings Tab. Basically this encapsulates the regular settings panel content into the 
        //      tab panel by also extending it with additional options (like the gamespeed slider)
        self.createTabDefault = function(){

            
            var tabGame = $('#TweakModSettingsTabGame');
            
            tabGame.find('div.windowTitle').remove();

            var tabGameHtml = tabGame.html();
            tabGameHtml = tabGameHtml.replaceAll('<h2>','<h3>');
            tabGameHtml = tabGameHtml.replaceAll('</h2>','</h3><hr>');
            
            tabGame.html(tabGameHtml);

            var tabGameCenteredButtonWrapper  = tabGame.find('.centeredButtonWrapper').first();
            var tabGameToggleFullscreenButton = tabGameCenteredButtonWrapper.find('#toggleFullscreenButton').first();

            tabGameCenteredButtonWrapper.css({textAlign:'left', padding:0, margin:0, height:60});
            $('<h3>'+('Window'.localize())+'</h3><hr>').insertBefore(tabGameCenteredButtonWrapper);
            
            tabGame.find('small')[1].remove();
            
            // Now find the hints
            var gameplaySection         = tabGame.find('.hintsToggle').first();
            var gameplaySectionParent   = gameplaySection.parent();
            var gameplaySectionTitle    = gameplaySectionParent.find('h3').first().text();
            var gameplaySectionTable    = '<table border="0" cellpadding="0" cellspacing="0" width="100%">'+
                                            '<tr>' +
                                            '<td valign="top" align="left" width="50%">' + 
                                            '<h3>'+("Hints".localize()) +'</h3>' +
                                            '</td>' +
                                            '<td valign="top" align="left">' + 
                                            '<h3 id="TweakModSettingsGamespeedText">'+ "Game Speed (Normal = 10): " +'</h3>' +
                                            '</td>' +
                                            '</tr>' +
                                            '<tr>' +
                                            '<td valign="top" align="left"><span id="xxxxx"></span>' + 
                                            '<div id="TweakModSettingsGameplayHints"></div>' +
                                            '</td>' +
                                            '<td valign="top" align="left">' + 
                                            '<div id="TweakModSettingsGamespeed"><div id="TweakModSettingsGamespeedSlider" style="top:10px"></div></div>' +
                                            '</td>' +
                                            '</tr>' +
                                          '</table>';
                                            
           
            gameplaySectionParent.find('h3').first().remove();
            gameplaySectionParent.find('br').first().remove();
            gameplaySectionParent.append(gameplaySectionTable);
            
            //gameplaySectionParent.append(gameplaySectionTable);                                      
            $('#TweakModSettingsGameplayHints').append(gameplaySection);
            // $('#TweakModSettingsGamespeed').append(gamespeedSection);
            
                         
            $("#TweakModSettingsGamespeedSlider").slider({
                min : 5,
                max : 100,
                range : "min",
                value : GameManager._oldTimeModifier * 10,
                animate : false,
                slide : function (event, ui) {
                    var value = ui.value;
                    if (!isNaN(value)){
                        $('#TweakModSettingsGamespeedText').html('Game Speed (Normal = 10): ' + (value));
                        this.settings.general.gamespeed = value; 
                        value = value / 10;
                        GameManager._oldTimeModifier = value;
                    }
                    else  {
                        GameManager._oldTimeModifier    = self.settings.general.gamespeed / 10;
                    }
                    $('#xxxxx').text(value + " -- " + GameManager._oldTimeModifier);
                }
            });
                         
                       
            // alert($('#TweakModSettingsGameplayHints').find('h3').first().html());
            
        };      
        
        // TAB: Notification Settings Tab. Allows to control Notification related tweaks 
        self.createTabNotifications = function(){
            // Tab: Notifications        
            var tempHtmlNotifications = '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size:11px">';
            // Create a list with speedUp targets of the notifications section
            if(typeof self.settings != 'undefined' && typeof self.settings.notifications != 'undefined' && typeof self.settings.notifications.speedUpTargets != 'undefined'){
            
                $.each(self.settings.notifications.speedUpTargets, function(index, element){
                    tempHtmlNotifications += '<tr><td valign="middle" align="left" width="20">';
                    tempHtmlNotifications += '<input type="checkbox" id="" name="'+element.target+'" value="true" '+(element.enable ? 'checked="true"' : '')+' style="width:14px">';
                    tempHtmlNotifications += '</td><td valign="middle" align="left">';
                    tempHtmlNotifications += element.target;
                    tempHtmlNotifications += '</td></tr>';
                    
                });
            }
            tempHtmlNotifications += '</table>';
            
            // Setup styles of notification elements
            // $('#TweakModSettingsSpeedUpNotificationsList').css({display:this.settings.notifications.speedUp ? '' : 'none'}).append(tempHtmlNotifications);
            // $('#TweakModSettingsSpeedUpNotificationsListSelectButton').css({display:this.settings.notifications.speedUp ? '' : 'none'});

            return $('#TweakModConfigurationTabNotifications').append(tempHtmlNotifications);
        };
                
        // TAB: Miscellaneous Settings Tab. Allows to control various aspects of the game
        self.createTabMisc = function(){
            
        };
        
        self.createTabDebug = function(){
            
        };
                
        // Setup the event handlers for the settings values related to TweakMod
        self.setupEventHandlers = function() {
            // Event Handlers for: Settings > Norifications 
            $('#TweakModSettingsTypeWriterDelayNumberBox').change(function(e){
                self.settings.notifications.typeWriterDelay = $(e.target).val();

                self.dataStorage.save();
                self.dataStorage.apply();
            });

            $('#TweakModSettingsSpeedUpNotificationsCheckBox').change(function(e){
                this.settings.notifications.speedUp = $(e.target).is(':checked');

                $('#TweakModSettingsSpeedUpNotificationsList').css({display:this.settings.notifications.speedUp ? '' : 'none'});
                $('#TweakModSettingsSpeedUpNotificationsListSelectButton').css({display:this.settings.notifications.speedUp ? '' : 'none'});
                            
                self.dataStorage.save();
                self.dataStorage.apply();
            });

            $('#TweakModSettingsSpeedUpNotificationsListSelectButton').click(function(e){
                  $('#TweakModSettingsSpeedUpNotificationsList').find('input[type=checkbox]').removeAttr('checked');
                  
                  if(notificationsSelectAllButtonState){
                  }
                  else {
                      $('#TweakModSettingsSpeedUpNotificationsList').find('input[type=checkbox]').attr('checked', 'true');
                  }
                  
                  notificationsSelectAllButtonState = !notificationsSelectAllButtonState;
            });
            
            // Event Handlers for: Settings > Conferences
            $('#TweakModSettingsConferencesSelect').change(function(e){
                self.settings.conferences.speedUpMode = $(e.target).val();
                
                self.dataStorage.save();
                self.dataStorage.apply();
            });
            
        };           

        // -----------------------------
        // END --- Private members ---
        
        return self;
        
    })(this);
            
    // Settings object
    var settings = function(){
        
        var hasObjNotifications = self.dataStorage && self.dataStorage.store && self.dataStorage.store.notifications;
        var hasObjGame          = self.dataStorage && self.dataStorage.store && self.dataStorage.store.game;
        var hasObjMisc          = self.dataStorage && self.dataStorage.store && self.dataStorage.store.misc;
        var hasObjDebug         = self.dataStorage && self.dataStorage.store && self.dataStorage.store.debug;
        
        return {
        game:{
          gamespeed: 10  
        },
        notifications: {
            typeWriterDelay:    hasObjNotifications    ? self.dataStorage.store.notifications.typeWriterDelay  : 100, 
            speedUp:            hasObjNotifications    ? self.dataStorage.store.notifications.speedUp          : false,
            speedUpTargets:     [{target:'{PlatformReleaseNews}', enable:true},
                                 {target: 'News'.localize(), enable:true},
                                 {target: 'Game off the market.'.localize(), enable:true},
                                 {target: 'Game Conference'.localize(), enable:true},
                                 {target: 'Lab report'.localize(), enable:true},
                                 {target: 'New Research!'.localize(), enable:true},
                                 {target: 'Industry News'.localize(), enable:true},
                                 {target: 'Game Report'.localize(), enable:true},
                                 {target: 'Market Analysis'.localize(), enable:true},
                                 {target: 'Engine complete!'.localize(), enable:true},
                                 {target: 'Game review'.localize(), enable:true},
                                 {target: 'Sequel'.localize(), enable:true},
                                 {target: 'Tutorial'.localize(), enable:true},
                                 {target: 'Company\'s Best Game'.localize(), enable:true}
                                 ],
            conferenceSpeedUpMode:  hasObjNotifications ? self.dataStorage.store.notifications.conferenceSpeedUpMode   : 'none',
            reviewSpeedUpMode:      hasObjNotifications ? self.dataStorage.store.notifications.reviewSpeedUpMode       : 'none'
        },
        misc: {
        },
        debug: {
            ghg6:    hasObjDebug ? self.dataStorage.store.debug.ghg6    : 'none'
        }
        // GameFlags.ghg6 = true;
    
        };
    };
    
    self.loadHtml = function(name) {
        var retHtml = '';
        
        $.ajax({
                url: "./mods/TweakMod/html/"+name+".html",
                async: false 
            }).done(function(data) {
                retHtml = data;
            });


        return retHtml;
    }
    
    self.showCustomNotification = function(){
        
    };
       
    
    // ------- Main    
    try {

        // Prepare the settings UI
        tweakedSettingsUI.setup();

        // Create an override using the jQuery proxy pattern for the relevant "typewrite" method
        (function() {
            var proxied = $.fn.typewrite;
            $.fn.typewrite = function(b) {
                b.delay = self.settings.notifications.typeWriterDelay;
                return proxied.apply( this, arguments );
            };
        })();
            
        // Create an override using the jQuery proxy pattern for the relevant "conferences" method
        (function() {
            var proxied = UI._startGameConferenceAnimations;
            UI._startGameConferenceAnimations = function(b, e) {
                
                if (self.settings.conferences.skip){
                    $('#gameConferenceAnimationDialog').find(".okButton").click();
                    return;    
                }

                if(self.settings.conferences.speedUp){
                    var lastGames       = [];
                    var currentGame     = GameManager.company.getGameById(e);
                    var hasCurrentGame  = !(typeof currentGame === undefined) && !currentGame == null;
                    
                    var contentElement = $('#gameConferenceAnimationDialog').find('#content').empty();
                    var container       = $(document.createElement('div'));
                    var booth           = GameManager.company.booths.first(function(q){return q.id == e;});
                    var boothImageName  = 'small';
                    var bootCaptionsHtml   = '';
                    
                    var digitBg         = $(document.createElement('div'));

                    switch(booth.standFactor){
                        
                        // small booth
                        case 0.3:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'small';
                        bootCaptionsHtml  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:170px"><h3 class="boothDescription">'+GameManager.company.name+'</h3>';
                        
                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:94px"><h3>'+currentGame.title+'</h3>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:94px"><h3>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h3>';
                        }
                        break;

                        // medium booth
                        case 0.5:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'medium';
                        bootCaptionsHtml  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:140px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';

                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:20px"><h5>'+currentGame.title+'</h5>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:20px"><h5>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h5>';
                        }
                                            
                        break;

                        // large booth
                        case 1.3:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});

                        boothImageName = 'large';
                        bootCaptions  = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:88px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';

                        if (hasCurrentGame){
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:36px"><h4>'+currentGame.title+'</h4>';
                        }
                        else {
                            bootCaptionsHtml += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:36px"><h4>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h4>';
                        }
                                            
                        break;                    

                        // custom booth
                        case 2:
                        digitBg.css({width:377, height:101, position:'relative', left:214, top:10, background:'url(./images/superb/counter/panel.png) no-repeat center', backgroundSize:'cover'});
                        
                        boothImageName = 'custom';

                        if (hasCurrentGame){
                            bootCaptionsHtml = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:207px"><h5>'+currentGame.title+'</h5>';
                        }
                        else {
                            bootCaptionsHtml = '<div style="position:relative; width:100%; height: 20px; text-align:center; top:207px"><h5>'+(GameManager.company.gameLog && GameManager.company.gameLog.length > 0 ? GameManager.company.gameLog.last().title : '')+'</h5>';
                        }
                        bootCaptionsHtml  += '<div style="position:relative; width:100%; height: 20px; text-align:center; top:74px"><h3 class="boothCashCost">'+GameManager.company.name+'</h3>';
                        break;
                    }
                    
                    container.css({width:'100%', height:450, background:'url(./mods/NoTypeWriterMod/img/booth_'+boothImageName+'.png) no-repeat center'});
                    
                    
                    container.append(digitBg);
                    container.append(bootCaptionsHtml);
                    
                    contentElement.append(container);
                    
                    // Create digits
                    var digits = (''+b).split('').reverse();
                    
                    for(var i = 0; i < 8; i++){
                        var v = 0;
                        if (i < digits.length){
                            v = digits[i];
                        }
                        
                        var digitImgFile = './images/superb/counter/'+v+'.png';
                        var digitImg     = $(document.createElement('div'));
                        digitImg.css({  position:'relative', left:((7-i))-24, top: 14, width:42, height:73, float:'right', background:'url('+digitImgFile+')', backgroundSize:'cover'});
                        digitBg.append(digitImg);
                    }
                    
                    // Show OK button
                    $('#gameConferenceAnimationDialog').find(".okButton").slideDown("fast");                    
                }
                else {
                    proxied.apply( this, arguments );
                }

            };
        })();   
        
        // Create an override using the jQuery proxy pattern for creating a custom notification overlay
        (function() {
            var proxied = UI._showNotification;
            UI._showNotification = function (a, b) {
                proxied.apply( this, arguments );

                var notification = a;
                var name   = notification.header;
                var n      = $('#simplemodal-container').find('#notificationContent');
                var opt    = $('.notificationOption1').first();
                
                var win    = $(self.notifyWindow);

                $('#TweakModNotificationReplacement1').remove();
                $('#TweakModNotificationReplacement2').remove();
                $('#TweakModNotificationReplacement3').remove();

                var window1 = $(document.createElement('div'));
                var window2 = $(document.createElement('div'));
                var window3 = $(document.createElement('div'));

                window1.attr({id:'TweakModNotificationReplacement1'});
                window1.appendTo($('body'));

                window2.attr({id:'TweakModNotificationReplacement2'});
                window2.appendTo($('body'));
                
                window3.attr({id:'TweakModNotificationReplacement3'});
                window3.appendTo($('body'));

                
                var doc                 = $(document);
                var docWidth            = doc.width();
                var docHeight           = doc.height();
                var centerX             = (docWidth * 0.5)  - (230);
                var centerY             = (docHeight * 0.5) - (120);
                
                
                window1.css({position:'absolute', left:centerX, top:centerY, width:460, height:'auto', padding:5, backgroundColor:'#f0f0f0', opacity:'0.9', border:'4px solid rgb(255,209,123)', display:'none', zIndex:8000, boxShadow:'0 0 5px #888'});
                window2.css({position:'absolute', left:centerX, top:centerY, width:460, height:'auto', padding:5, backgroundColor:'#f0f0f0', opacity:'0.9', border:'4px solid rgb(255,209,123)', display:'none', zIndex:8000, boxShadow:'0 0 5px #888'});
                window3.css({position:'absolute', left:centerX, top:centerY, width:460, height:'auto', padding:5, backgroundColor:'#f0f0f0', opacity:'0.9', border:'4px solid rgb(255,209,123)', display:'none', zIndex:8000, boxShadow:'0 0 5px #888'});
                
                 if(self.settings.notifications.speedUp){
                     
                     switch (a.header) {
                         case "{ReleaseGame}":
                         alert("{ReleaseGame}");
                         break;
                         
                         case "{Reviews}":
                         alert("{Reviews}");
                         break;
                         
                         case "{PlatformReleaseNews}":
                         case "News".localize():
                         case "Game off the market.".localize():
                         case "Game Conference".localize():
                         case "Lab report".localize():
                         case "New Research!".localize():
                         case "Industry News".localize():
                         case "Game Report".localize():
                         case "Market Analysis".localize():
                         case "Engine complete!".localize():
                         case "Game review".localize():
                         case "Sequel".localize():
                         case "Tutorial".localize():
                         case "Company's Best Game".localize():
                            var html  = '<h3>'+a.header+'</h3>';
                                html += a.text.replace('\n','<br/><br/>');
                                
                                if( $('#TweakModNotificationReplacement2').is(':visible') ) {
                                    var w3t = window1.position.top() + window1.height() + 5;
                                    window3.css({top:w3t}); 
                                    
                                    window3.html(html).delay(500).fadeIn().delay(4000).fadeOut();
                                }
                                else if( $('#TweakModNotificationReplacement1').is(':visible') ) {
                                    var w2t = window1.position.top() + window1.height() + 5;
                                    window2.css({top:w2t}); 
                                    
                                    window2.html(html).delay(500).fadeIn().delay(4000).fadeOut();
                                }
                                else {
                                    window1.html(html).delay(500).fadeIn().delay(4000).fadeOut();
                                }
                                UI.closeModal();
                                GameManager.company.activeNotifications.remove(a);
                                GameManager.resume(!0);
                         break;
                     }

                 }
         };
        })();  
                
//        // Create an override using the jQuery proxy pattern for the UI.populateSettingsPanel method. This prepares the settings UI.
//        // Thanks to Sir Everard for pointing out
//        (function() {
//            var proxied = UI.populateSettingsPanel;
//            UI.populateSettingsPanel = function(panel) {
//                // Update values in settings UI
//                TweakedSettingsUI.updateValues();
//                
//                // Apply regular method
//                proxied.apply( this, arguments );
//
//                // Force first tab whenever the UI is called
//                $('#TweakModSettingsTabGDT').tabs('select', 0);
//            };
//        })();
                        
//         GDT.on(GDT.eventKeys.ui.beforeShowingNotification, function(e) {
//             var a = e.notification;
//             var n = $('#simplemodal-container').find('#notificationContent');
//             
//             alert(n.text());
//         });


        GDT.on(GDT.eventKeys.gameplay.weekProceeded, function(e) {
            // Apply gamespeed now, so the speed modifier applies
            GameManager._oldTimeModifier = self.settings.general.gamespeed / 10;
        });    

        
        // The GameFlags var is frozen, so you can't edit it directly.
        // Thanks to kristof1104 for this hint
        GameFlags = $.extend({}, GameFlags);
        
    }
    catch(ex) {
        //var trace = this.printStackTrace({e: ex});
        
        
        alert('TweakMod raised an exception!\n' + 'Message: ' + ex.message);// + '\nStack trace:\n' + trace.join('\n'));
    }
    finally {
        
    }                     
})(UltimateLib || {});