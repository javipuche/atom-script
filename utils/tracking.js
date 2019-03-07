module.exports = {
    model: {
        acc: 0,
        scroll: {
            scroll25: false,
            scroll50: false,
            scroll75: false

        }
    },
    trackEvent: function (eventLabel, eventAction, eventCategory, eventValue) {
        if (window.location.href.indexOf('http://localhost') > -1) {
            console.log('Analytics -> %o', {
                eventLabel: eventLabel,
                eventAction: eventAction,
                eventCategory: eventCategory,
                eventValue: eventValue
            });
        }
        if (window.ga) {
            ga('send', {
                hitType: 'event',
                eventCategory: eventCategory,
                eventAction: eventAction,
                eventLabel: eventLabel,
                eventValue: eventValue
            });
        }
        if (window.gtag) {
            gtag('event', eventAction, {
                'event_category': eventCategory,
                'event_label': eventLabel,
                'event_value': eventValue
            });
        }
    },
    timeEvent: function () {
        this.model.acc += 30;
        this.trackEvent(window.location.href, 'reading', 'Session Time', this.model.acc);
    },
    scrollDepthEvent: function (percent) {
        if (!this.model.scroll['scroll' + percent]) {
            this.trackEvent(window.location.href, 'scrolled ' + percent, 'Scroll', percent);
            this.model.scroll['scroll' + percent] = true;
        }

    },
    getScrollPercent: function () {
        var h = document.documentElement,
            b = document.body,
            st = 'scrollTop',
            sh = 'scrollHeight';
        return Math.round((h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100);
    },
    scrollDepthEventListener: function () {
        var that = this;
        document.addEventListener('scroll', function () {
            var percent = that.getScrollPercent();
            if (percent % 25 === 0 && percent !== 0) {
                that.scrollDepthEvent(percent);
            }
        });
    },
    bindClickEvents: function () {
        var that = this;
        document.addEventListener('click', function (e) {
            if (e.target.matches('a, button')) {
                that.trackEvent(window.location.href, 'button: ' + e.target.innerText, 'Click Event', that.model.acc);
            }
        });
    },
    basicEvents: function () {
        setTimeout(this.timeEvent, 30000);
        this.scrollDepthEventListener();
        this.bindClickEvents();
    }
};