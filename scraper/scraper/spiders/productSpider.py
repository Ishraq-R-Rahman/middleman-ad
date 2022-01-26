import scrapy
import os
import sys

productName = sys.argv[1].lower().replace(
    '_', ' ')  # NEED TO BE DEFINED GLOBALLY ???


class ProductspiderSpider(scrapy.Spider):

    urls = "https://chaldal.com/search/"
    # searchURL = [ s for s in urls if productName in s ]

    name = 'productSpider'
    allowed_domains = ['chaldal.com']
    start_urls = [urls + productName]

    def parse(self, response):
        # print("*****************")
        # print(response.url)

        products = response.xpath("//div[@class = 'product']/div")

        for product in products:
            originalPrice = product.xpath(
                ".//descendant::div[@class='price']/span[2]/text()").get()
            finalPrice = product.xpath(
                ".//descendant::div[@class='discountedPrice']/span[2]/text()").get()
            if finalPrice is None:
                discount = 0
            else:
                discount = (int(originalPrice) - int(finalPrice)) / \
                    int(originalPrice)

            # sometimes has weird space.
            added = product.xpath(".//div[@class='name']/text()").getall()
            name = " ".join(product.xpath(
                ".//div[@class='name']/em/text()").getall()) + added[len(added) - 1]

            size = product.xpath(".//div[@class='subText']/text()").get()


            # Out of stock check
            if originalPrice is None:
                continue

            if finalPrice is None:
                finalPrice = originalPrice

            
                
            if productName in name.lower():
                yield {
                    'name':  name + ' ' + size,
                    'source': 'Chaldal',
                    'originalPrice': originalPrice,
                    'finalPrice': finalPrice,
                    'discount': discount * 100,
                    'url': response.urljoin(product.xpath(".//following-sibling::span/a[1]/@href").get())
                }
                # Return only the first one. Will be modified later to return best priced one.
                return

    #         urls = response.xpath("//div[@class='overlay text']/span/a[1]")

    #         for val in urls:
    #             url = response.urljoin( val.xpath(".//@href").get() )
    #             yield response.follow( url = url , callback = self.parse_description )

    # def parse_description( self , response ):
    #         if( response.xpath("//div[@class='outOfStockBtn']").getall() ):
    #             instock = "Out of Stock"
    #         else :
    #             instock = "In stock"

    #         # Have to check if the names contain the search tag, otherwise includes unrelated products
    #         name = response.xpath("//div[@class='nameAndSubtext']/h1/text()").get()

    #         brand = productName

    #         finalPrice = response.xpath("//span[@itemprop='price']/span/text()").get()
    #         originalPrice = response.xpath("//div[@class='fullPrice']/span[2]/text()").get()
    #         discount = 0

    #         yield {
    #             'name' : name,
    #             'brand': brand,
    #             'size' : response.xpath("//div[@class='nameAndSubtext']/span/text()").get(),
    #             'final_price' : finalPrice,
    #             'original_price': originalPrice,
    #             'discount' : discount,
    #             'stock' : instock,
    #             'description': response.xpath("//div[@itemprop='description']/p/text()").getall(),
    #             'bannerImage' : response.xpath("//img[@itemprop='image']/@src").get(),
    #             'url' : response.url
    #         }
