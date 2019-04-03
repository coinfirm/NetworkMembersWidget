import './amlt-widget.css';

/**
 *  Widget variables
 */
var widgetWrapper,
    widgetIframe,
    widgetSrc = 'https://platform.coinfirm.com/network-members/widget';

/**
 * Emit event to parent window
 * @param name
 * @param value
 */
function emitEvent(name, value) {
    var data = { name: name, value: value };
    widgetIframe.contentWindow.postMessage(data, "*");
}

/**
 *  Initialize widget
 */
function initialize() {
    widgetWrapper = document.getElementById('amlt-widget');
    var includeUserInput = widgetWrapper.getAttribute('data-user-input') === 'true';
    var logoUrl = widgetWrapper.getAttribute('data-logo');
    widgetIframe = document.createElement('iframe');
    widgetIframe.src =  widgetSrc + '?user_input='+includeUserInput+'&logo='+logoUrl;
    widgetIframe.scrolling = 'no';
    widgetIframe.style.display = 'none';
    widgetIframe.onload = function() {
        widgetWrapper.querySelector('img').remove();
        widgetIframe.style.display = 'block';
    };
    widgetWrapper.appendChild(widgetIframe);
}

/**
 *  Message API handlers
 */
window.addEventListener('message', function (event) {
    if (event.data.hasOwnProperty("name") && event.data.name === 'AMLT_Widget_Resize') {
        console.log(event.data.value);
        var widget = document.getElementById('amlt-widget');
        widget.style.height = event.data.value + "px";
        widget.querySelector('iframe').style.height = event.data.value + "px";
    }

    if (event.data.hasOwnProperty("name") && event.data.name === 'AMLT_Widget_Submit') {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", widgetWrapper.getAttribute('data-url'), true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify({
            value: event.data.value
        }));

        xhr.onreadystatechange = function() {
            if (xhr.readyState !== XMLHttpRequest.DONE) return;

            try {
                var response = JSON.parse(xhr.responseText);
                if (response.hasOwnProperty('message')) {
                    emitEvent('AMLT_Widget_Error', response.message);
                } else if (response.hasOwnProperty('success')) {
                    emitEvent('AMLT_Widget_Success', true);
                } else if (response.hasOwnProperty('error')) {
                    emitEvent('AMLT_Widget_Error', response.error);
                }
            } catch (error) {
                emitEvent('AMLT_Widget_Error', 'Undefined error');
            }
        };

        xhr.addEventListener('error', function(error) {
            console.log('Error', error);
        }, false);
    }
});

/**
 *  Initialize widget
 */
if (document.readyState !== 'loading') {
    initialize();
} else {
    document.addEventListener('DOMContentLoaded', initialize);
}
