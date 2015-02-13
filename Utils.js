
(function() {

    // IE protection
    if( window.console == undefined || window.console.log == undefined ) {
        window.console = { log: function() {} };
    }

    // Format: { messages: "message<br/>...", color: css-color }
    var _messageBuffer = [];

    // message panel name
    var _panelName = "alertPanel";

    // timer ids
    var __alertMessageSetup;
    var __alertMessageUpdate;

    // Builds generic div
    function createDiv( id, style ){
        function applyStyle(object,styles) {
            for( var key in styles ) {
                var value = styles[key];
                if( typeof value == "object" ) {
                    applyStyle( object[key], value);
                } else {
                    object[key] = value;
                }
            }
        }
        var div = document.createElement("div");
        div.id = id;
        applyStyle(div.style,style);
        return div;
    }

    // Generic add to message buffer
    function addMessage(msgs,color) {
        var id = (new Date()).getTime() + ':' + Math.round(Math.random() * 10000);
        var messages = msgs.join("<br/>");
        _messageBuffer.push( { messages: messages, color: color } );
    }

    // Creates message continer div in body of document
    // and starts message pump routine
    function initializeAlertComponents() { 
        if (document.body != null) {
            console.log("Ready");
            clearInterval( __alertMessageSetup);
            var panel = createDiv( _panelName,  {"text-shadow": '-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF',"z-index":10000,"position":'absolute',"border-radius": '5px',"float":'center',"margin": 'auto auto',"width":'50%',"left":'25%',"top":'0px'} );
            document.body.appendChild(panel);
            // start processing messages
            __alertMessageUpdate = setInterval( outputMessages, 500 );
        } else { 
            console.log("Not Ready");
        }
    }

    // Pump routine that removes message from message buffer
    // and adds it to the message panel
    function outputMessages() {
        // closure for saving timeout variables
        function clearBufferCallback(i) {
            var id = i;
            return function() {
                var element = document.getElementById(id)
                element.parentNode.removeChild(element);
            }
        }

        var panel = document.getElementById(_panelName);
        for( var i=0; i < _messageBuffer.length; i++ ) {
            var id = (new Date()).getTime() + ':' + Math.round(Math.random() * 10000);
            var data = _messageBuffer[i];
            var msgPanel = createDiv( id, {"text-align":'center'} );
            msgPanel.innerHTML = data.messages;
            msgPanel.style['background-color'] = data.color;
            panel.appendChild(msgPanel);
            setTimeout(clearBufferCallback(id),5000);
        }
        _messageBuffer = [];
    }

    // -----------------------------------------------------------------------------------
    // Public interface

    // Backwards compatibility wrapper
    window.displayAlertMessage = function() {
        // pass through
        window.displayExceptionMessage.apply(
            this,
            Array.prototype.slice.call(arguments)
        );
    };

    // Red alert
    window.displayExceptionMessage = function() {
        addMessage(
            Array.prototype.slice.call(arguments),
            "rgba(255,0,0,0.3)" 
        );
    };

    // Orange alert
    window.displayWarningMessage = function() {
        addMessage(
            Array.prototype.slice.call(arguments),
            "rgba(255,155,155,0.3)" 
        )
    };

    // Gray alert
    window.displayDebugMessage = function() {
        addMessage(
            Array.prototype.slice.call(arguments),
            "rgba(155,155,155,0.3)" 
        )
    };

    // Blue alert
    window.displayInfoMessage = function() {
        addMessage(
            Array.prototype.slice.call(arguments),
            "rgba(0,0,255,0.3)" 
        )
    };

    // Custom Color
    window.displayCustomMessage = function(messages,color) {
        addMessage(
            Array.prototype.slice.call(arguments),
            "rgba(0,0,255,0.3)" 
        )
    };

    __alertMessageSetup = setInterval( initializeAlertComponents, 250 );
})();