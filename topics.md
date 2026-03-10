---
layout: default
title: Topics
permalink: /topics/
---
{% assign sorted_tags = site.tags | sort %}

<section class="page-intro" aria-labelledby="topics-title">
  <p class="section-label">Topics</p>
  <h1 id="topics-title">Browse by topic</h1>
  <p>Each topic links to filtered archive results and includes the latest related posts.</p>
</section>

<section class="topics-grid" aria-label="Topic links">
  {% for tag_item in sorted_tags %}
    {% assign tag_name = tag_item[0] %}
    {% assign posts = tag_item[1] | sort: 'date' | reverse %}
    <article id="topic-{{ tag_name | slugify }}" class="topic-card">
      <header>
        <h2>
          <a href="{{ '/archive/' | relative_url }}?tag={{ tag_name | uri_escape }}">{{ tag_name }}</a>
        </h2>
        <p>{{ posts.size }} post{% if posts.size != 1 %}s{% endif %}</p>
      </header>
      <ul class="topic-list">
        {% for post in posts limit: 4 %}
          <li>
            <a href="{{ post.url | relative_url }}">{{ post.title }}</a>
            <span>{{ post.date | date: "%Y" }}</span>
          </li>
        {% endfor %}
      </ul>
    </article>
  {% endfor %}
</section>
