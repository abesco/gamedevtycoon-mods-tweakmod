/*
GameDevTycoon Expansion Module
**********************************************************************************************************************************************************
Name:                 TweakMod
Description:          Allows to tweak various aspects of the game.
Copyright:            � 2013 Francesco Abbattista
Url:                  http://www.abesco.de/
Notes:                None.
Credits:              SirEverard for his contribution of the game speed control.
**********************************************************************************************************************************************************
Version:              0.1.0
Launch:               December 25th, 2013
Last Update:          December 25th, 2013
**********************************************************************************************************************************************************
*/



/// --> New Ideas = 
//      ContextMenu opening time / delay (especially when a lot of mods are available)
//      Create Right Menu system


var TweakMod = {};
(function () {   
    //UltimateLib.Storage.clearCache();
    
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
    
    // Tweaks the in-game settings UI using tabs for a better experience
    self.TweakedSettingsUI = (function (tweakMod) {
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
            UltimateLib.Configuration.addTab('TweakModConfigurationTabNotifications', "Notifications", self.getContentTabNotifications());

            // --> self.createTabMisc();
            // self.createTabDebug();

            // Read settings values into UI
            self.updateValues();
                                          
            // Setup event handlers
            self.setupEventHandlers();
            
            // Apply settings to the underlying UltimateLib.Notifications class
            self.applySettings();

            /*

                    
            $('#TweakModSettingsSpeedUpConferencesCheckBox').attr('disabled', self.settings.conferences.skip);
            

            $('#TweakModSettingsSpeedUpConferencesCheckBox').change(function(e){
                instance.settings.conferences.speedUp = !($(e.target).attr('checked') === undefined);

                instance.dataStorage.save();
                instance.dataStorage.apply();
            });
            */
            

                    
            
        };      
        
        self.applySettings = function(){
            // Apply typewriter
            UltimateLib.Notifications.typeWriterDelay = TweakModSettings.settings.notifications.typeWriterDelay;
            
            // Apply notifications speed up targets
            UltimateLib.Notifications.Items = TweakModSettings.settings.notifications.speedUpTargets;
        };
        
        // Update the values in the settings screen 
        self.updateValues = function() {

            // Set default values for gamespeed
            $('#TweakModSettingsGamespeedText').html('Game Speed (Normal = 10): ' + (GameManager._oldTimeModifier * 10));

            // Set default values for notifications
            $('#TweakModSettingsTypeWriterDelayNumberBox').val(TweakModSettings.settings.notifications.typeWriterDelay);
            
            if(TweakModSettings.settings.notifications.speedUp){
                $('#TweakModSettingsSpeedUpNotificationsCheckBox').attr('checked','true');
                $.each(TweakModSettings.settings.notifications.speedUpTargets, function(index, element){
                    if(element.asOverlay){
                        $('#TweakModNotificationSpeedUpTarget-'+element.id).attr('checked','true');
                    }
                    else {
                        $('#TweakModNotificationSpeedUpTarget-'+element.id).removeAttr('checked');
                    }
                });
                             
            }
            else {
                $('#TweakModSettingsSpeedUpNotificationsCheckBox').removeAttr('checked');
            }

            // Set default values for conferences
            $('#TweakModSettingsTabNotificationsConferenceSelect').val(TweakModSettings.settings.notifications.conferenceSpeedUpMode);      
            
            // Update values for reviews
            $('#TweakModSettingsTabNotificationsReviewsSelect').val(TweakModSettings.settings.notifications.reviewSpeedUpMode);      
            
            // Update values for game speed 
            $("#TweakModSettingsGamespeedSlider").slider({value : TweakModSettings.settings.game.gamespeed});

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
                        TweakModSettings.settings.general.gamespeed = value; 
                        value = value / 10;
                        GameManager._oldTimeModifier = value;
                    }
                    else  {
                        GameManager._oldTimeModifier    = TweakModSettings.settings.general.gamespeed / 10;
                    }
                    $('#xxxxx').text(value + " -- " + GameManager._oldTimeModifier);
                }
            });
                         
                       
            // alert($('#TweakModSettingsGameplayHints').find('h3').first().html());
            
        };      
        
        // TAB: Notification Settings Tab. Allows to control Notification related tweaks 
        self.getContentTabNotifications = function(){
            // Tab: Notifications        
 
            var tempHtmlNotifications = '<table width="100%" border="0" cellpadding="0" cellspacing="0">';
                tempHtmlNotifications += '<tbody>';
                tempHtmlNotifications += '<tr>';
                tempHtmlNotifications += '<td align="left" valign="top" width="35%"><h3>Typewriter delay</h3></td>';
                tempHtmlNotifications += '<td align="left" valign="top"><input id="TweakModSettingsTypeWriterDelayNumberBox" type="number" name="typeWriterDelay" value="" min="0" max="250" style="width:80px"></td>';
                tempHtmlNotifications += '</tr>';
                tempHtmlNotifications += '<tr><td colspan="2"><hr></td></tr>';
                tempHtmlNotifications += '<tr>';
                tempHtmlNotifications += '<td align="left" valign="top"><h3>Speed up</h3></td>';
                tempHtmlNotifications += '<td align="left" valign="top"><h4><input id="TweakModSettingsSpeedUpNotificationsCheckBox" type="checkbox" name="speedUpNotifications" value="true" style="width:14px">Enable</h4>';
                tempHtmlNotifications += '<div id="TweakModSettingsSpeedUpNotificationsList" style="display:'+(TweakModSettings.settings.notifications.speedUp ? '' : 'none')+'; width:200px; height:120px; overflow: auto; border:1px solid #777777; background-color:white">{TweakModSettingsSpeedUpNotificationsList}</div>';
                tempHtmlNotifications += '<div id="TweakModSettingsSpeedUpNotificationsListSelectButton" class="baseButton orangeButton" style="display:'+(TweakModSettings.settings.notifications.speedUp ? '' : 'none')+'; font-size:10pt; font-weight:bold; height:20px; line-height:20px">Un-/Select all</div></td>';
                tempHtmlNotifications += '</tr>';
                tempHtmlNotifications += '<tr>';
                tempHtmlNotifications += '<td align="left" valign="top" width="35%"><h3>Conference dialog</h3></td>';
                tempHtmlNotifications += '<td align="left" valign="top"><select id="TweakModSettingsTabNotificationsConferenceSelect" size="1"><option value="none">Default</option><option value="speedUpConferences">Speed up</option><option value="skipConferences">Skip</option></select></td>';
                tempHtmlNotifications += '</tr>';
                tempHtmlNotifications += '<tr>';
                tempHtmlNotifications += '<td align="left" valign="top"><h3>Reviews dialog</h3></td>';
                tempHtmlNotifications += '<td align="left" valign="top"><select id="TweakModSettingsTabNotificationsReviewsSelect" size="1"><option value="none">Default</option><option value="speedUpReviews">Speed up</option><option value="speedUpAndOverlayReviews">Speed up + Overlay</option><option value="skipReviews">Skip</option></select></td>';
                tempHtmlNotifications += '</tr>';
                tempHtmlNotifications += '</tbody>';
                tempHtmlNotifications += '</table>';
        
            var tempHtmlNotificationsContent = '<table border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size:11px">';
            // Create a list with speedUp targets of the notifications section

            if(typeof TweakModSettings.settings != 'undefined' && typeof TweakModSettings.settings.notifications != 'undefined' && typeof TweakModSettings.settings.notifications.speedUpTargets != 'undefined'){
                $.each(TweakModSettings.settings.notifications.speedUpTargets, function(index, element){
                    tempHtmlNotificationsContent += '<tr><td valign="middle" align="left" width="20">';
                    tempHtmlNotificationsContent += '<input type="checkbox" id="TweakModNotificationSpeedUpTarget-'+element.id+'" value="true" '+(element.asOverlay ? 'checked="true"' : '')+' style="width:14px">';
                    tempHtmlNotificationsContent += '</td><td valign="middle" align="left">';
                    tempHtmlNotificationsContent += element.name;
                    tempHtmlNotificationsContent += '</td></tr>';
                    
                });
            }
            tempHtmlNotificationsContent += '</table>';
            tempHtmlNotifications = tempHtmlNotifications.replace('{TweakModSettingsSpeedUpNotificationsList}', tempHtmlNotificationsContent);

            return tempHtmlNotifications;
        };
                
        // TAB: Miscellaneous Settings Tab. Allows to control various aspects of the game
        self.createTabMisc = function(){
            
        };
        
        self.createTabDebug = function(){
            
        };
        // Setup the event handlers for the settings values related to TweakMod
        self.setupEventHandlers = function() {
            // Event Handlers for: Settings > Notifications 
            $('#TweakModSettingsTypeWriterDelayNumberBox').change(function(e){
                TweakModSettings.settings.notifications.typeWriterDelay = $(e.target).val();
                
                UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);
            });


            $('#TweakModSettingsSpeedUpNotificationsCheckBox').change(function(e){
                TweakModSettings.settings.notifications.speedUp = $(e.target).is(':checked');

                $('#TweakModSettingsSpeedUpNotificationsList').css({display:TweakModSettings.settings.notifications.speedUp ? '' : 'none'});
                $('#TweakModSettingsSpeedUpNotificationsListSelectButton').css({display:TweakModSettings.settings.notifications.speedUp ? '' : 'none'});
                            
                UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);
            });


            $('#TweakModSettingsSpeedUpNotificationsListSelectButton').click(function(e){
                $('#TweakModSettingsSpeedUpNotificationsList').find('input[type=checkbox]').removeAttr('checked');

                if(!notificationsSelectAllButtonState){
                    $('#TweakModSettingsSpeedUpNotificationsList').find('input[type=checkbox]').attr('checked', 'true');
                }

                notificationsSelectAllButtonState = !notificationsSelectAllButtonState;

                $('#TweakModSettingsSpeedUpNotificationsCheckBox').attr('checked','true');

               
                $.each(TweakModSettings.settings.notifications.speedUpTargets, function(index, element){
                    element.asOverlay = notificationsSelectAllButtonState;
                    UltimateLib.Notifications.setOverlay(element);
                });
                
                UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);
            });
            
            // Event Handlers for: Settings > Conferences
            $('#TweakModSettingsTabNotificationsConferenceSelect').change(function(e){
                TweakModSettings.settings.notifications.conferenceSpeedUpMode = $(e.target).val();
                UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);
            });
            
            $('#TweakModSettingsTabNotificationsReviewsSelect').change(function(e){
                TweakModSettings.settings.notifications.reviewSpeedUpMode = $(e.target).val();
                UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);                
            });
            
            
            $.each(TweakModSettings.settings.notifications.speedUpTargets, function(index, element){
                $('#TweakModNotificationSpeedUpTarget-'+element.id).change(function(e){
                    element.asOverlay = $('#TweakModNotificationSpeedUpTarget-'+element.id).is(':checked');
                    UltimateLib.Notifications.setOverlay(element);
                    UltimateLib.Storage.write('TweakMod', TweakModSettings.settings);
                });
            });
        };           

        // -----------------------------
        // END --- Private members ---
        
        return self;
        
    })(this);
    
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
    
    self.TweakModSettings =  (function () {   
        var instance            = this;
        
        instance.init = function(){
            instance.settings.notifications.speedUpTargets    = UltimateLib.Notifications.Items;
                    
            // Now trying to read and apply already stored settings, if not, use defaults
            var settingsFromStorage = UltimateLib.Storage.read('TweakMod', instance.settings);
            
            if(typeof settingsFromStorage !== undefined){
                instance.settings = settingsFromStorage;
            }  
        };
        
        // Settings object
        instance.settings = {
            game:{
              gamespeed: 10  
            },
            notifications: {
                typeWriterDelay:        100, 
                speedUp:                false,
                speedUpTargets:         {},
                conferenceSpeedUpMode:  'none',
                reviewSpeedUpMode:      'none'
            },
            misc: {
            },
            debug: {
                ghg6:   'none'
            }
            // GameFlags.ghg6 = true;
            };  
        
        return instance;
    })();    
    
    TweakMod.init = function(){
        self.TweakModSettings.init();
        self.TweakedSettingsUI.setup();
    };
    
    // ------- Main    
    try {
        
        //alert(TweakModSettings.settings.game.gamespeed);

        // Create an override using the jQuery proxy pattern for the relevant "conferences" method
        (function() {
            var proxied = UI._startGameConferenceAnimations;
            UI._startGameConferenceAnimations = function(b, e) {
                
                if (TweakModSettings.settings.conferenceSpeedUpMode == 'skipConferences'){
                    $('#gameConferenceAnimationDialog').find(".okButton").click();
                    return;    
                }

                if(TweakModSettings.settings.conferenceSpeedUpMode == 'speedUpConferences'){
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


//        GDT.on(GDT.eventKeys.gameplay.weekProceeded, function(e) {
//            // Apply gamespeed now, so the speed modifier applies
//            GameManager._oldTimeModifier = TweakModSettings.settings.general.gamespeed / 10;
//        });    

        
        // The GameFlags var is frozen, so you can't edit it directly.
        // Thanks to kristof1104 for this hint
        GameFlags = $.extend({}, GameFlags);
        
    }
    catch(ex) {
        //var trace = this.printStackTrace({e: ex});
        
        console.log(ex);
        alert('TweakMod raised an exception!\n' + 'Message: ' + ex.message);// + '\nStack trace:\n' + trace.join('\n'));
        
    }
    finally {
        
    }                     
})();