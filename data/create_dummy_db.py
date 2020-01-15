import sys
import random
import xml.etree.ElementTree as ET

sys.path.append('..')

from app import db
from app.models import Location, Item, LogEntry

print('Database will be deleted. Type ok.')
if input() != 'ok':
    print('Aborting.')
    exit()

Location.query.delete()
Item.query.delete()
LogEntry.query.delete()

root = ET.parse('out.osm').getroot()
for node in root.findall('node'):
    d = {
        'osm_id': node.attrib.get('id', None),
        'lat': node.attrib.get('lat', None),
        'lon': node.attrib.get('lon', None),
    }
    for tag in node.findall('tag'):
        k = tag.attrib.get('k')

        if k == 'addr:street':
            d['street'] = tag.attrib.get('v', None)
        elif k == 'addr:housenumber':
            d['housenumber'] = tag.attrib.get('v', None)
        elif k == 'addr:postcode':
            d['postcode'] = tag.attrib.get('v', None)
        elif k == 'addr:city':
            d['city'] = tag.attrib.get('v', None)
        elif k == 'addr:country':
            d['country'] = tag.attrib.get('v', None)

        elif k == 'name':
            d['name'] = tag.attrib.get('v', None)
        elif k == 'opening_hours':
            d['opening_hours'] = tag.attrib.get('v', None)
        elif k == 'wheelchair':
            d['wheelchair'] = True if tag.attrib.get('v') == 'yes' else False

    db.session.add(Location(**d))

db.session.add(Item(name='SimpyV'))
db.session.add(Item(name='Creme Vega'))
db.session.add(Item(name='Beyond Burger'))
db.session.add(Item(name='Reiswaffeln'))
db.session.add(Item(name='Bier'))

db.session.commit()

random.seed(0)
location_ids = [l.id for l in Location.query.all()]
item_ids = [i.id for i in Item.query.all()]
for item_id in item_ids:
    for location_id in location_ids:
        if random.random() > 0.2:
            continue
        db.session.add(LogEntry(location_id=location_id, item_id=item_id))

db.session.commit()

print('Created dummy database.')

item_mappings = [f'"{i.name}":{i.id}' for i in Item.query.all()]
with open('item_mappings.json', 'w') as f:
    f.write(f'{{{",".join(item_mappings)}}}')

print('Created json.')
