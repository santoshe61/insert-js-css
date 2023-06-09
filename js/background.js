"use strict";
chrome.storage.onChanged.addListener(function () {
  window.location.reload();
});
var libsCache = [];
getData(function (i) {
  var e = new Protos("data"),
    t = !1;
  if (0 !== Object.keys(i).length) {
    if (!i.hasOwnProperty("sites") && !i.hasOwnProperty("libs"))
      for (var s in ((t = !0), i))
        if ("sites" != s && "libs" != s) {
          var n = JSON.parse(i[s]);
          (n.libs = n.jquery ? ["jQuery 3"] : null),
            n.hasOwnProperty("jquery") && delete n.jquery,
            (e.sites[s] = n);
        }
    if (!i.hasOwnProperty("settings")) {
      t = !0;
      var r = [];
      for (var o in i.libs) {
        var a = i.libs[o];
        ~a.src.indexOf("chrome-extension://") ||
          r.push({ name: o, src: a.src });
      }
      0 < r.length && (e.libs = e.libs.concat(r)),
        0 == Object.keys(e.sites).length && (e.sites = i.sites);
      var c = [];
      for (var g in e.sites) {
        var l = e.sites[g],
          d = l.libs;
        if (d && d.length)
          for (var f = 0; f < d.length; f++)
            "jQuery 3.0.0" == d[f] && (e.sites[g].libs[f] = "jQuery 3");
        (l.id = g),
          l.draftjs && delete l.draftjs,
          l.draftcss && delete l.draftcss,
          c.push(l);
      }
      delete e.sites, (e.sites = c), (e.settings.version = 3);
    }
    if (
      !t &&
      i.hasOwnProperty("settings") &&
      i.settings.hasOwnProperty("version")
    ) {
      if (i.settings.version < 4) {
        (t = !0),
          (i.settings.version = 4),
          (i.settings.badgeCounter = e.settings.badgeCounter),
          (i.settings.editorConfig.showPrintMargin =
            e.settings.editorConfig.showPrintMargin),
          (i.settings.editorConfig.useSoftTabs =
            e.settings.editorConfig.useSoftTabs),
          (i.settings.editorConfig.useWorker =
            e.settings.editorConfig.useWorker);
        var u = getIndex("name", i.libs, "jQuery 3");
        ~u && (i.libs[u].src = i.libs[u].src.replace("@js/", "@")), (e = i);
      }
      if (4 == i.settings.version) {
        (t = !0), (i.settings = mergeDeep(e.settings, i.settings));
        for (var h = 0; h < i.sites.length; h++) {
          i.sites[h] = mergeDeep(new Protos("site"), i.sites[h]);
          var v = i.sites[h].id,
            b = getSite(v, i.sites);
          i.sites[h].disabled && ((b.options.on = !1), (i.sites[h] = b)),
            delete i.sites[h].disabled;
        }
        (i.settings.version = 5), (e = i);
      }
      if (5 == i.settings.version) {
        (t = !0), (i.settings = mergeDeep(e.settings, i.settings));
        for (var p = 0; p < i.sites.length; p++)
          (i.sites[p] = mergeDeep(new Protos("site"), i.sites[p])),
            (i.sites[p].options.altCSS = !0),
            (i.sites[p].options.altJS = !0);
        (i.settings.version = 6), (e = i);
      }
      if (
        (6 != i.settings.version ||
          t ||
          ((t = !0),
          (i.settings = mergeDeep(e.settings, i.settings)),
          (i.settings.version = 7),
          (e = i)),
        7 == i.settings.version && !t)
      ) {
        (t = !0), (i.settings = mergeDeep(e.settings, i.settings));
        for (var m = 0; m < i.sites.length; m++) {
          var S = i.sites[m];
          S.css &&
            S.options.autoImportant &&
            (i.sites[m].compiledCss = cssApplyImportant(S.css));
        }
        (i.settings.version = 8), (e = i);
      }
    }
  } else t = !0;
  if (
    (t && chrome.storage.local.set(e, function () {}),
    chrome.runtime.onMessage.addListener(function (e, t, s) {
      "Insert JS & CSS - Santosh" === e.id &&
        "run" === e.state &&
        (function (l, d) {
          if (urlMatch(d.url, "http*") && l && l.hasOwnProperty("sites")) {
            var f = getSitesByUrl(l.sites, d.url);
            f.length &&
              (function () {
                function i(e) {
                  var t = getIndex("url", libsCache, e);
                  (a += ";" + libsCache[t].code), 0 === (o -= 1) && s();
                }
                var s = function () {
                    0 === o &&
                      (a
                        ? chrome.tabs.executeScript(
                            d.id,
                            { code: a },
                            function () {
                              runOnInteractive(e);
                            }
                          )
                        : runOnInteractive(e));
                  },
                  e = function () {
                    if (0 < n.js.length) {
                      n.js.unshift(
                        "if(typeof chrome !== 'undefined') { chrome = null; }"
                      );
                      for (var e = 0; e < n.js.length; e++)
                        chrome.tabs.executeScript(
                          d.id,
                          { code: n.js[e] },
                          function () {}
                        );
                    }
                  },
                  n = getAndSort({ sites: f, items: l, alt: !0 });
                if (0 < n.css.length) {
                  for (var t = "", r = 0; r < n.css.length; r++)
                    t += n.css[r] + "\n";
                  chrome.tabs.insertCSS(
                    d.id,
                    { code: t, runAt: "document_start" },
                    function () {}
                  );
                }
                var o = n.libs.length,
                  a = "";
                if ((s(), 0 < n.libs.length))
                  for (
                    var c = function (e) {
                        var t = n.libs[e];
                        if (~getIndex("url", libsCache, t)) i(t);
                        else {
                          var s = new XMLHttpRequest();
                          s.open("GET", t, !0),
                            (s.onreadystatechange = function () {
                              4 == s.readyState &&
                                (libsCache.push({
                                  url: t,
                                  code: s.responseText,
                                }),
                                i(t));
                            }),
                            (s.onerror = function () {
                              chrome.tabs.executeScript(
                                d.id,
                                {
                                  code: "console.log('[Insert JS & CSS - Santosh] Unable to load external JS!');",
                                },
                                function () {}
                              );
                            }),
                            s.send();
                        }
                      },
                      g = 0;
                    g < n.libs.length;
                    g++
                  )
                    c(g);
              })();
          }
        })(i, t.tab),
        s(void 0);
    }),
    i.settings.badgeCounter)
  ) {
    var y = function () {
      chrome.tabs.query({ active: !0, currentWindow: !0 }, function (e) {
        if (e[0]) {
          var t = e[0].url;
          if (urlMatch(t, "http*")) {
            var s = getSitesByUrl(i.sites, t).length || "";
            chrome.browserAction.setBadgeBackgroundColor({ color: "#f44336" }),
              chrome.browserAction.setBadgeText({ text: s.toString() });
          } else chrome.browserAction.setBadgeText({ text: "" });
        }
      });
    };
    chrome.tabs.onUpdated.addListener(y),
      chrome.tabs.onActivated.addListener(y);
  }
});
