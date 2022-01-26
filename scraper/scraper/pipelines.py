# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import pymongo
import os
import sys
from collections import OrderedDict
import json
from urllib.parse import urlparse


class MongodbPipeline(object):
    collection_name = 'scrapedData'

    def open_spider(self, spider):
        self.client = pymongo.MongoClient(os.environ.get('MONGODB_URI'))

        self.db = self.client["Chaldal"]

        collectionNames = self.db.list_collection_names()
        if self.collection_name not in collectionNames:
            self.db.create_collection(self.collection_name)

        # with open('./scraper/models/scrapedData.json', 'r') as j:
        #     self.vexpr = json.loads(j.read())
        self.vexpr = {
            "$jsonSchema": {
                "bsonType": "object",
                            "required": ["name", "source", "final_price", "url"],
                            "properties": {
                                "name": {
                                    "bsonType": "string",
                                    "description": "must be a string and is required"
                                },
                                "source": {
                                    "bsonType": "string",
                                    "description": "can only be one of the enum values and is required"
                                },
                                "final_price": {
                                    "bsonType": "string",
                                    "description": "must be a string and is required"
                                },
                                "original_price": {
                                    "bsonType": "string",
                                    "description": "must be a string and is not required"
                                },

                                "discount": {
                                    "bsonType": "int",
                                    "minimum": 0,
                                    "description": "must be an integer and is required"
                                },

                                "url": {
                                    "bsonType": "string",
                                    "description": "must be a url and is required"
                                }
                            }
            }
        }

        self.cmd = OrderedDict([('collMod', self.collection_name),
                                ('validator', self.vexpr),
                                ('validationLevel', 'moderate')])

        self.db.command(self.cmd)

        self.db[self.collection_name].create_index("name", unique=True)

    def close_spider(self, spider):
        self.client.close()

    def process_item(self, item, spider):
        # checking valid url here
        if not urlparse(item['url']).scheme:
            return

        self.db[self.collection_name].insert_one(item)
        return item
