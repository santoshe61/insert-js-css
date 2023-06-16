"use strict";
$(function () {
  var s = {
    removeDomain: _gm("removeDomain"),
    urlEmpty: _gm("urlEmpty"),
    urlExist: _gm("urlExist"),
    dataEmpty: _gm("dataEmpty"),
    saveSuccessful: _gm("saveSuccessful"),
    compileError: _gm("compileError"),
  };
  var o = null,
    r = null,
    scss = null,
    l = $("#siteId"),
    c = getUrlParam("site");
  c && ((c = decodeURIComponent(c)), l.val(c));

  function compileLessSass(){
    return scssTocssFetch()
     .catch((err) => (msgGlobal("is-warning", s.compileError), console.log(err)));
  }

  Split(["#jsCol", "#cssCol", "#scssCol"], {
    gutterSize: 1,
    minSize: 10,
    onDrag: function () {
      o.resize(), r.resize(), scss.resize();
    },
  });
  var e = new Protos("site");
  for (var t in e.options)
    if ("altJS" != t && "altCSS" != t) {
      var i = makeCheckBox({ class: "siteOption", name: t, text: _gm(t) || t });
      $("#libraries").find(".additional").append(i),
        $('#libraries input[name="' + t + '"]').prop("checked", e.options[t]);
    }
  for (var n in e.options)
    if ("altJS" == n || "altCSS" == n) {
      var a = makeCheckBox({ class: "siteOption", name: n, text: _gm(n) || n });
      $("#libraries").find(".alternate").append(a),
        $('#libraries input[name="' + n + '"]').prop("checked", e.options[n]);
    }
  function u(ev, css) {
    !(function (t, i, n, a) {
      var e = !1;
      if (!i)
        return msgGlobal("is-warning", s.urlEmpty), l.addClass("is-danger");
      ((t && t != i) || !t) && (e = !0);
      n
        ? e
          ? getData(function (e) {
              ~getIndex("id", e.sites, i)
                ? (msgGlobal("is-warning", s.urlExist), l.addClass("is-danger"))
                : saveProps(i, n, function () {
                    removeDomain(t, function () {
                      setUrlParam("site", i),
                        (c = getUrlParam("site")),
                        a && a();
                    });
                  });
            })
          : saveProps(t, n, function () {
              a && a();
            })
        : msgGlobal("is-warning", s.dataEmpty);
    })(
      c,
      l.val(),
      (function () {
        if(css){
          r.setValue(css, 1);
        }
        var e = o.getValue() || "",
          t = r.getValue() || "",
          sc = scss.getValue() || "",
          i = $("#ruleName").val() || "",
          n = l.val();
        if (n && (e || t || scss)) {
          var a = new Protos("site");
          return (
            (a.id = n),
            (a.js = e),
            (a.scss = sc),
            (a.css = t),
            (a.name = i),
            t && (a.compiledCss = cssApplyImportant(t)),
            $(".lib:checked").length &&
              $(".lib:checked").each(function (e) {
                a.libs.push($(this).val());
              }),
            $(
              "#libraries .additional .siteOption, #libraries .alternate .siteOption"
            ).each(function () {
              var e = $(this).attr("name");
              a.options[e] = $(this).prop("checked");
            }),
            a
          );
        }
        return !1;
      })(),
      function () {
        msgGlobal("is-success", s.saveSuccessful),
          $("#btnSubmit").removeClass("button_primary");
      }
    );
  }
  function m() {
    $("#btnSubmit").addClass("button_primary");
  }
  getData(function (e) {
    if (
      ($("body").addClass(e.settings.editorConfig.theme.replace(/.*\//i, "")),
      (o = setEditor("js", "javascript", e.settings)),
      (scss = setEditor("scss", "scss", e.settings)),
      (r = setEditor("css", "css", e.settings)),
      $(window).on("resize", function () {
        o.resize(), r.resize();
      }),
      e.libs.length)
    )
      for (var t = 0; t < e.libs.length; t++) {
        var i = e.libs[t],
          n = makeCheckBox({ class: "lib", value: i.name, text: i.name });
        $("#libraries .libs").append(n);
      }
    if (c && ~getIndex("id", e.sites, c)) {
      var a = getSite(c, e.sites);
      for (var s in (a.libs &&
        a.libs.forEach(function (e) {
          $('.lib[value="' + e + '"]').prop("checked", !0);
        }),
      a.options))
        $(
          '#libraries .additional input[name="' +
            s +
            '"], #libraries .alternate input[name="' +
            s +
            '"]'
        ).prop("checked", a.options[s]);
      o.setValue(a.js, 1), r.setValue(a.css, 1), scss.setValue(a.scss, 1), $("#ruleName").val(a.name);
    }
    e.settings.supportBtn && $(".support-link").parent().hide(),
      o.on("change", m),
      scss.on("change", m),
      r.on("change", m),
      document.addEventListener("change", m),
      $("input").on("keyup", m),
      $(".loader").addClass("loader_off"),
      setTimeout(function () {
        $(".loader").hide();
      }, 350);
  }),
    $(document).on("keydown", function (e) {
      return (
        (("s" != String.fromCharCode(e.which).toLowerCase() ||
          (!e.ctrlKey && !e.metaKey)) &&
          19 != e.which) ||
        (u(), e.preventDefault(), !1)
      );
    }),
    $(document).on("click", "#btnSubmit", function(e){
      var cssEditor = ace.edit("css");
      var beautify = ace.require("ace/ext/beautify");
      cssEditor.session.setMode("ace/mode/css");
      compileLessSass().then((css) => {
        u(e, css);
        beautify.beautify(cssEditor.session);
      })
    }),
    $(document).on("click", "#btnCompile", function(){
        var cssEditor = ace.edit("css");
        var beautify = ace.require("ace/ext/beautify");
        cssEditor.session.setMode("ace/mode/css");
        compileLessSass().then((css) => {
          cssEditor.setValue(css,1);
          beautify.beautify(cssEditor.session);
          msgGlobal("is-success", "Code compiled and pasted to css, click save to perform save")
    })
    }),
    $(window).keypress(function(e) {
      if (e.which == 115 && e.ctrlKey){
        var cssEditor = ace.edit("css");
        var beautify = ace.require("ace/ext/beautify");
        cssEditor.session.setMode("ace/mode/css");
        compileLessSass().then((css) => {
          u(e, css);
          beautify.beautify(cssEditor.session);
        });
        return false;
      }
    }),
    $("#btnClear").on("click", function () {
      confirm(s.removeDomain) &&
        removeDomain(c, function () {
          window.location = chrome.runtime.getURL("options.html");
        });
    });
});
