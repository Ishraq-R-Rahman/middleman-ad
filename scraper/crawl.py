from scraper.spiders.meenaClick import MeenaclickSpider
from scraper.spiders.productSpider import ProductspiderSpider
import scrapy
import os
from scrapy.crawler import CrawlerProcess
# from scrapy.utils.project import get_project_settings
import sys
# from scrapy.settings import Settings

# from scraper import settings as my_settings



fileName = sys.argv[2]  # Date will be added here
print(sys.argv)

filePath = os.path.join(os.getcwd() , 'data' , fileName )


try:
    open(filePath, "w+")
except(OSError, IOError) as e:
    print('File Could not be created or overwritten')

# crawler_settings = Settings()
# crawler_settings.setmodule(my_settings)

# process = CrawlerProcess( settings=crawler_settings )

process = CrawlerProcess({
    'FEED_FORMAT': 'json',
    'FEED_URI': 'data/' + fileName
}
)


# process.crawl( ProductspiderSpider )
if (fileName.find('MeenaClick') != -1):
    process.crawl( MeenaclickSpider )
else:
    process.crawl( ProductspiderSpider )

process.start(stop_after_crawl=True)
# process.join()
# print("****************************************************************************")
# print( get_project_settings().attributes['BOT_NAME'] )

#Checking if the file is empty
# if (os.stat(fileName).st_size == 0):
#     os.remove(filePath)
