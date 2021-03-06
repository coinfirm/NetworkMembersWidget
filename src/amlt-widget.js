import './amlt-widget.css';

/**
 *  Widget variables
 */
var widgetWrapper,
    widgetIframe,
    widgetSrc = 'https://widget.coinfirm.com/widget/frame';

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
function initialize(options) {
    widgetWrapper = document.getElementById('amlt-widget');
    var includeUserInput = widgetWrapper.getAttribute('data-user-input') === 'true';
    var logoUrl = widgetWrapper.getAttribute('data-logo');
    widgetIframe = document.createElement('iframe');

    var frameUrl = widgetSrc + '?user_input='+includeUserInput+'&logo=' + logoUrl;

    if (options && options.style) {
        frameUrl += '&styles=' + encodeURIComponent(JSON.stringify(options.style));
    }

    if (options && options.font) {
        frameUrl += '&font=' + encodeURIComponent(JSON.stringify(options.font));
    }

    widgetIframe.src = frameUrl;
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
window.amltWidget = function(options) {
    if (document.readyState !== 'loading') {
        initialize(options);
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            initialize(options);
        });
    }
};