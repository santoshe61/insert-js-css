"use strict";
function msgGlobal(t, i, n) {
  (n = n || 700),
    $('<div class="fixed-screen notification ' + t + '">' + i + "</div>")
      .hide()
      .appendTo("body")
      .fadeIn(200),
    setTimeout(function () {
      $(".fixed-screen.notification").fadeOut(500, function () {
        $(this).remove();
      });
    }, n);
}
var timerBlink = !1;
function blinkIndicator() {
  $(".blink-indicator.save").addClass("blink-indicator_on"),
    timerBlink && clearTimeout(timerBlink),
    (timerBlink = setTimeout(function () {
      $(".blink-indicator.save").removeClass("blink-indicator_on");
    }, 1e3));
}
window.jQuery &&
  $(function () {
    var i = "tabs__tab",
      n = "tabs__content",
      e = "_active";
    $("." + i).length &&
      $("." + i).on("click", function () {
        $("." + i).removeClass(i + e), $(this).addClass(i + e);
        var t = $(this).data("tab");
        $("." + n + e).removeClass(n + e),
          $("." + n + '[data-tab="' + t + '"]').addClass(n + e);
      }),
      $("*[data-msg]").each(function () {
        var t = chrome.i18n.getMessage($(this).attr("data-msg")),
          i = $(this).attr("data-msg-attr");
        i ? $(this).attr(i, t) : $(this).text(t);
      }),
      $(document).on(
        "click",
        ".fixed-screen.notification button.delete",
        function () {
          $(this).parent().remove();
        }
      ),
      "ru" == chrome.i18n.getUILanguage() &&
        ($(".doc.doc_ru").show(), $(".doc.doc_en").hide());
  });
