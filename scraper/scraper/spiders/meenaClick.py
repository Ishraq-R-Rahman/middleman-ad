import scrapy
import os
import sys
from scrapy_splash import SplashRequest
import urllib.parse
import re  # too slow


productName = sys.argv[1].lower().replace(
    '_', ' ')  # NEED TO BE DEFINED GLOBALLY ???
# productName = 'dove beauty bar'


class MeenaclickSpider(scrapy.Spider):

    # urls = os.environ.get('START_URLS').split(',') # HERE WE GET THE VALUES FROM THE CONFIG.ENV FILE
    urls = 'https://meenaclick.com/search/'

    name = 'meenaClick'

    custom_settings = {
        "DOWNLOADER_MIDDLEWARES": {
            'scrapy_splash.SplashCookiesMiddleware': 723,
            'scrapy_splash.SplashMiddleware': 725,
            'scrapy.downloadermiddlewares.httpcompression.HttpCompressionMiddleware': 810,
        },
        "SPIDER_MIDDLEWARES": {
            'scrapy_splash.SplashDeduplicateArgsMiddleware': 100,
        },
        'BOT_NAME': 'scraper',
        'DUPEFILTER_CLASS': 'scrapy_splash.SplashAwareDupeFilter',
        'NEWSPIDER_MODULE': 'scraper.spiders',
        'ROBOTSTXT_OBEY': True,
        'SPIDER_MODULES': ['scraper.spiders'],
        "SPLASH_URL": 'https://evening-bastion-61436.herokuapp.com'
    }

    allowed_domains = ['meenaclick.com']
    head_url = "https://meenaclick.com/"
    start_urls = [urls + productName]

    script = '''
        function main(splash, args)
            splash.private_mode_enabled = false
            assert(splash:go(args.url))
            assert(splash:wait(5))
            splash:set_viewport_full()
            return splash:html()
        end
    '''

    def start_requests(self):
        yield SplashRequest(url=self.start_urls[0], callback=self.parse, endpoint='execute', args={
            'lua_source': self.script
        })

    def parse(self, response):
        products = response.xpath("//a[contains(@href,'product')]")

        for product in products:
            name = product.xpath(".//div/div/h1/text()").get()

            url = urllib.parse.urljoin(
                self.head_url, product.xpath('.//@href').get())

            regularPrice = product.xpath(
                ".//div/div/div/div/span[1]/text()").get()

            if(regularPrice is None):
                continue # means out of stock
            else:
                regularPrice = re.findall(r"\d*\.\d+|\d+", regularPrice)[0]

            offPrice = product.xpath(".//div/div/div/div/span[2]/text()").get()

            originalPrice = regularPrice

            if offPrice is None:
                
                finalPrice = originalPrice
                discount = 0

            else:
                finalPrice = re.findall(r"\d*\.\d+|\d+", offPrice)[0]
                # finalPrice = offPrice
                discount = (int(originalPrice) - int(finalPrice)) / \
                    int(originalPrice)


            if productName in name.lower():
                yield {
                    'name': name,
                    'source': 'Meenaclick',
                    'finalPrice': finalPrice,
                    'originalPrice': originalPrice,
                    'discount': discount * 100,
                    'url': url
                }
                # Return only the first one. Will be modified later to return best priced one.
                return
