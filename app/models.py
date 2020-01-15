from datetime import datetime

from app import db


class Location(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    osm_id = db.Column(db.Integer)
    lat = db.Column(db.Float)
    lon = db.Column(db.Float)

    street = db.Column(db.String(64))
    housenumber = db.Column(db.String(8))
    postcode = db.Column(db.String(12))
    city = db.Column(db.String(64))
    country = db.Column(db.String(8))

    name = db.Column(db.String(64))
    opening_hours = db.Column(db.String(64))
    website = db.Column(db.String(128))

    wheelchair = db.Column(db.Boolean)


class LogEntry(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    location_id = db.Column(db.String(64), db.ForeignKey('location.id'))
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'))

    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    type = db.Column(db.Integer)

    flag = db.Column(db.Integer)


class Item(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))


class InSubCategory(db.Model):
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'), primary_key=True)
    sub_category_id = db.Column(db.Integer, db.ForeignKey('sub_category.id'), primary_key=True)


class SubCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'))


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))


class SearchQuery(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item.id'))

    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
