import os
import json
import xml.etree.ElementTree as ET

from flask import render_template, Response, request, jsonify
from app import app, db
from app.models import Location, LogEntry, Item


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/_search_item')
def search():
    item_id = request.args.get('item_id', 0, type=int)
    entries = db.session.\
        query(Location, LogEntry).\
        filter(LogEntry.item_id == item_id).\
        filter(LogEntry.location_id == Location.id).\
        all()
    entries = [
        {
            'id': location.id,
            'lat': location.lat,
            'lon': location.lon,
            'name': location.name,

            'street': location.street,
            'housenumber': location.housenumber,
            'postcode': location.postcode,
            'city': location.city,

            'last_timestamp': log_entry.timestamp
        }
        for location, log_entry in entries
    ]
    return jsonify(entries)


@app.route('/_get_search_hints')
def get_search_hints():
    term = request.args.get('term', '', type=str).lower()
    print(term)
    hints = [{'label': i.name, 'value': i.id} for i in Item.query.filter(Item.name.ilike(f'%{term}%')).all()]
    print(hints)
    return jsonify(hints)


@app.route('/_get_locations')
def get_locations():
    west = request.args.get('west', 0, type=float)
    south = request.args.get('south', 0, type=float)
    east = request.args.get('east', 0, type=float)
    north = request.args.get('north', 0, type=float)
    locations = Location.query.\
        filter(Location.lat < north).\
        filter(Location.lat > south).\
        filter(Location.lon < east).\
        filter(Location.lon > west).\
        all()
    locations = [
        {
            'id': location.id,
            'lat': location.lat,
            'lon': location.lon,
            'name': location.name,

            'street': location.street,
            'housenumber': location.housenumber,
            'postcode': location.postcode,
            'city': location.city
        }
        for location in locations
    ]
    return jsonify(locations)


@app.route('/_add_log_entry')
def add_log_entry():
    location_id = request.args.get('location_id', 0, type=int)
    item_id = request.args.get('item_id', 0, type=int)

    db.session.add(LogEntry(location_id=location_id, item_id=item_id))
    db.session.commit()
    return jsonify(True)
