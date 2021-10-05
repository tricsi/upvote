# -*- coding: utf-8 -*-
import scrapy


class EntriesSpider(scrapy.Spider):
    name = 'entries'
    allowed_domains = ['js13kgames.com']
    start_urls = [
        'https://js13kgames.com/entries'
    ]

    def parse(self, response):
        for link in response.css('article.entry > a::attr(href)'):
            yield response.follow(link, self.parse_entry)

    def parse_entry(self, response):
        yield {
            'login': response.css('li.github > a::text').re_first(r"git[^.]*.com/([^/]+)"),
            'data': {
                'url': response.css('a.launch::attr(href)').get(),
                'title': response.css('div.info > h2::text').get(),
                'author': response.css('div.info > h3::text').get(),
                'description': ''.join(response.css('div.description > p').getall()),
                'category': response.css('div.description > strong::text').re(r"(desktop|mobile|server|webxr|web monetization|decentralized|unfinished)"),
                'image': response.css('article.single-entry > img::attr(src)').get()
            }
        }
