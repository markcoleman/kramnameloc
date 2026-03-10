---
layout: default
title: Archive
permalink: /archive/
---
{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}
{% assign sorted_tags = site.tags | sort %}

<section class="page-intro" aria-labelledby="archive-title">
  <p class="section-label">Archive</p>
  <h1 id="archive-title">Find posts by keyword, topic, or year</h1>
  <p>Use filters for quick discovery, or browse the full timeline below.</p>
</section>

<section class="discover-panel" aria-labelledby="archive-discovery-title" data-discovery-root data-discovery-limit="500">
  <div class="section-head">
    <h2 id="archive-discovery-title">Search all posts</h2>
    <a class="section-link" href="{{ '/feed.xml' | relative_url }}">RSS</a>
  </div>
  <form class="discover-form" data-discovery-form>
    <label>
      <span class="sr-only">Search posts</span>
      <input type="search" name="q" placeholder="Search posts" autocomplete="off" data-discovery-query />
    </label>
    <label>
      <span class="sr-only">Filter by topic</span>
      <select name="tag" data-discovery-tag>
        <option value="">All topics</option>
        {% for tag_item in sorted_tags %}
          <option value="{{ tag_item[0] }}">{{ tag_item[0] }}</option>
        {% endfor %}
      </select>
    </label>
    <label>
      <span class="sr-only">Filter by year</span>
      <select name="year" data-discovery-year>
        <option value="">All years</option>
        {% for year in posts_by_year %}
          <option value="{{ year.name }}">{{ year.name }}</option>
        {% endfor %}
      </select>
    </label>
  </form>
  <div class="discover-results" data-discovery-results></div>
  <p class="discover-empty" data-discovery-empty hidden>No posts match your filters yet.</p>
</section>

<nav class="archive-jump" aria-label="Jump to year">
  {% for year in posts_by_year %}
    <a href="#year-{{ year.name }}">{{ year.name }}</a>
  {% endfor %}
</nav>

<section class="archive-home" aria-label="Archive timeline">
  <div class="archive-groups">
    {% assign first_opened = false %}
    {% for year in posts_by_year %}
      {% if first_opened == false %}
        <details id="year-{{ year.name }}" class="archive-year" open>
        {% assign first_opened = true %}
      {% else %}
        <details id="year-{{ year.name }}" class="archive-year">
      {% endif %}
      <summary>
        <span class="archive-year-label">{{ year.name }}</span>
        <span class="archive-year-count">{{ year.items.size }} post{% if year.items.size != 1 %}s{% endif %}</span>
      </summary>
      <ul class="archive-list">
        {% for post in year.items %}
          {% assign summary = post.summary | default: post.description %}
          <li class="archive-item">
            <p class="archive-date">{{ post.date | date: "%b %-d" }}</p>
            <div class="archive-copy">
              <h3><a href="{{ post.url | relative_url }}">{{ post.title }}</a></h3>
              {% if summary and summary != '' %}
                <p>{{ summary | strip_html | truncate: 150 }}</p>
              {% endif %}
            </div>
          </li>
        {% endfor %}
      </ul>
      </details>
    {% endfor %}
  </div>
</section>
