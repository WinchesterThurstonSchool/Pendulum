import "./jquery-3.3.1.js";

var MQ = MathQuill.getInterface(MathQuill.getInterface.MAX);

$('.object-property-name').each(function () {
    MQ.MathField(this, {
        autoSubscriptNumerals: true,
    });
});

var latex = $('#basic-latex').bind('keydown keypress', function () {
    var prev = latex.val();
    setTimeout(function () {
        var now = latex.val();
        if (now !== prev) mq.latex(now);
    });
});
var mq = MQ.MathField($('#basic')[0], {
    autoSubscriptNumerals: true,
    handlers: {
        edit: function () {
            if (!latex.is(':focus')) latex.val(mq.latex());
        }
    }
});
latex.val(mq.latex());

