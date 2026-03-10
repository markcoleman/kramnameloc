(function () {
  "use strict";

  function sitePath(path) {
    var base = (window.siteConfig && window.siteConfig.baseUrl) || "";
    return "" + base + path;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function slugify(value) {
    return String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function formatDate(value) {
    var date = new Date(value + "T00:00:00");
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).format(date);
  }

  function initThemeToggle() {
    var button = document.getElementById("theme-toggle");
    if (!button) return;

    var storageEnabled = true;
    try {
      localStorage.getItem("theme");
    } catch (e) {
      storageEnabled = false;
    }

    function currentTheme() {
      return document.documentElement.getAttribute("data-theme");
    }

    function apply(next) {
      if (next === "light" || next === "dark") {
        document.documentElement.setAttribute("data-theme", next);
        if (storageEnabled) localStorage.setItem("theme", next);
        button.setAttribute("aria-pressed", String(next === "dark"));
        return;
      }

      document.documentElement.removeAttribute("data-theme");
      if (storageEnabled) localStorage.removeItem("theme");
      button.setAttribute("aria-pressed", "false");
    }

    button.addEventListener("click", function () {
      apply(currentTheme() === "dark" ? "light" : "dark");
    });

    button.setAttribute("aria-pressed", String(currentTheme() === "dark"));
  }

  function initPostToc() {
    var toc = document.querySelector("[data-post-toc]");
    if (!toc) return;

    var tocList = toc.querySelector("[data-post-toc-list]");
    var content = document.querySelector(".post-content");
    if (!tocList || !content) return;

    var headings = Array.prototype.slice.call(content.querySelectorAll("h2, h3"));
    if (headings.length < 3) {
      toc.hidden = true;
      return;
    }

    var used = new Set();
    headings.forEach(function (heading) {
      if (!heading.id) {
        var base = slugify(heading.textContent) || "section";
        var candidate = base;
        var count = 2;
        while (used.has(candidate) || document.getElementById(candidate)) {
          candidate = base + "-" + count;
          count += 1;
        }
        heading.id = candidate;
        used.add(candidate);
        return;
      }

      used.add(heading.id);
    });

    tocList.innerHTML = headings
      .map(function (heading) {
        var levelClass = heading.tagName.toLowerCase() === "h3" ? "toc-item toc-item-sub" : "toc-item";
        return (
          '<li class="' +
          levelClass +
          '"><a href="#' +
          escapeHtml(heading.id) +
          '">' +
          escapeHtml(heading.textContent.trim()) +
          "</a></li>"
        );
      })
      .join("");

    toc.hidden = false;
  }

  function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(value);
    }

    return new Promise(function (resolve, reject) {
      try {
        var input = document.createElement("textarea");
        input.value = value;
        input.setAttribute("readonly", "");
        input.style.position = "absolute";
        input.style.left = "-9999px";
        document.body.appendChild(input);
        input.select();
        var success = document.execCommand("copy");
        document.body.removeChild(input);
        if (success) {
          resolve();
          return;
        }
        reject(new Error("Copy command failed"));
      } catch (error) {
        reject(error);
      }
    });
  }

  function initShareTools() {
    var sections = Array.prototype.slice.call(document.querySelectorAll("[data-share-tools]"));
    if (sections.length === 0) return;

    sections.forEach(function (section) {
      var nativeButton = section.querySelector("[data-share-native]");
      var copyButton = section.querySelector("[data-copy-link]");
      var status = section.querySelector("[data-copy-status]");
      var shareUrl = (copyButton && copyButton.getAttribute("data-share-url")) || window.location.href;
      var shareTitle = document.querySelector(".post-header h1")
        ? document.querySelector(".post-header h1").textContent.trim()
        : document.title;

      function setStatus(message) {
        if (status) status.textContent = message;
      }

      if (nativeButton) {
        if (!navigator.share) {
          nativeButton.hidden = true;
        } else {
          nativeButton.addEventListener("click", function () {
            navigator
              .share({
                title: shareTitle,
                url: shareUrl
              })
              .catch(function () {
                return;
              });
          });
        }
      }

      if (copyButton) {
        copyButton.addEventListener("click", function () {
          copyText(shareUrl)
            .then(function () {
              setStatus("Link copied to clipboard.");
            })
            .catch(function () {
              setStatus("Unable to copy automatically. Please copy the URL manually.");
            });
        });
      }
    });
  }

  var discoveryCachePromise;
  function loadDiscoveryData() {
    if (discoveryCachePromise) {
      return discoveryCachePromise;
    }

    discoveryCachePromise = fetch(sitePath("/search.json"), {
      headers: {
        Accept: "application/json"
      }
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Could not load search index");
        }
        return response.json();
      })
      .catch(function () {
        return [];
      });

    return discoveryCachePromise;
  }

  function ensureOption(select, value) {
    if (!select || !value) return;
    var existing = Array.prototype.slice
      .call(select.options)
      .some(function (option) {
        return option.value === value;
      });

    if (!existing) {
      var option = document.createElement("option");
      option.value = value;
      option.textContent = value;
      select.appendChild(option);
    }
  }

  function renderDiscoveryCard(item) {
    var tags = Array.isArray(item.tags) ? item.tags : [];
    var tagsHtml =
      tags.length > 0
        ? '<ul class="tag-list" aria-label="Post tags">' +
          tags
            .map(function (tag) {
              var href = sitePath("/archive/") + "?tag=" + encodeURIComponent(tag);
              return '<li><a href="' + href + '">' + escapeHtml(tag) + "</a></li>";
            })
            .join("") +
          "</ul>"
        : "";

    var summary = item.summary ? '<p class="card-description">' + escapeHtml(item.summary) + "</p>" : "";

    return (
      '<article class="discover-card">' +
      '<p class="card-date">' +
      escapeHtml(formatDate(item.date)) +
      " \u00b7 " +
      escapeHtml(String(item.readTime || 1)) +
      ' min read</p>' +
      '<h3><a href="' +
      escapeHtml(item.url) +
      '">' +
      escapeHtml(item.title) +
      "</a></h3>" +
      summary +
      tagsHtml +
      "</article>"
    );
  }

  function initDiscovery() {
    var roots = Array.prototype.slice.call(document.querySelectorAll("[data-discovery-root]"));
    if (roots.length === 0) return;

    loadDiscoveryData().then(function (allPosts) {
      if (!Array.isArray(allPosts) || allPosts.length === 0) return;

      roots.forEach(function (root) {
        var queryInput = root.querySelector("[data-discovery-query]");
        var tagSelect = root.querySelector("[data-discovery-tag]");
        var yearSelect = root.querySelector("[data-discovery-year]");
        var results = root.querySelector("[data-discovery-results]");
        var empty = root.querySelector("[data-discovery-empty]");
        var limit = Number(root.getAttribute("data-discovery-limit") || 12);
        var skipFeatured = root.getAttribute("data-discovery-skip-featured") === "true";

        if (!results) return;

        var posts = skipFeatured ? allPosts.slice(1) : allPosts.slice();
        var params = new URLSearchParams(window.location.search);
        var initialQuery = (params.get("q") || "").trim();
        var initialTag = (params.get("tag") || "").trim();
        var initialYear = (params.get("year") || "").trim();

        if (tagSelect) ensureOption(tagSelect, initialTag);
        if (yearSelect) ensureOption(yearSelect, initialYear);

        if (queryInput) queryInput.value = initialQuery;
        if (tagSelect) tagSelect.value = initialTag;
        if (yearSelect) yearSelect.value = initialYear;

        function currentFilters() {
          var qRaw = queryInput ? queryInput.value.trim() : "";
          return {
            q: qRaw.toLowerCase(),
            qRaw: qRaw,
            tag: tagSelect ? tagSelect.value.trim() : "",
            year: yearSelect ? yearSelect.value.trim() : ""
          };
        }

        function updateQueryString(filters) {
          var next = new URLSearchParams(window.location.search);

          if (filters.qRaw) next.set("q", filters.qRaw);
          else next.delete("q");

          if (filters.tag) next.set("tag", filters.tag);
          else next.delete("tag");

          if (filters.year) next.set("year", filters.year);
          else next.delete("year");

          var query = next.toString();
          var nextUrl = window.location.pathname + (query ? "?" + query : "") + window.location.hash;
          window.history.replaceState({}, "", nextUrl);
        }

        function applyFilters() {
          var filters = currentFilters();
          var filtered = posts.filter(function (item) {
            var tags = Array.isArray(item.tags) ? item.tags : [];
            var haystack = (item.title + " " + item.summary + " " + tags.join(" ")).toLowerCase();

            if (filters.q && haystack.indexOf(filters.q) === -1) {
              return false;
            }

            if (filters.tag && tags.indexOf(filters.tag) === -1) {
              return false;
            }

            if (filters.year && String(item.year) !== filters.year) {
              return false;
            }

            return true;
          });

          updateQueryString(filters);

          if (filtered.length === 0) {
            results.innerHTML = "";
            if (empty) empty.hidden = false;
            return;
          }

          if (empty) empty.hidden = true;
          results.innerHTML = filtered.slice(0, limit).map(renderDiscoveryCard).join("");
        }

        if (queryInput) {
          queryInput.addEventListener("input", applyFilters);
        }
        if (tagSelect) {
          tagSelect.addEventListener("change", applyFilters);
        }
        if (yearSelect) {
          yearSelect.addEventListener("change", applyFilters);
        }

        applyFilters();
      });
    });
  }

  function init() {
    initThemeToggle();
    initPostToc();
    initShareTools();
    initDiscovery();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
