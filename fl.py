from app import app, db
from app.models import Location, LogEntry, Item


@app.shell_context_processor
def make_shell_context():
    return {'db': db, 'Location': Location, 'LogEntry': LogEntry, 'Item': Item}
