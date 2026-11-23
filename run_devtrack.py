"""Run DevTrack without Werkzeug's Windows debug-reloader."""
import os
from dotenv import load_dotenv
from waitress import serve

load_dotenv()
from app import app  # noqa: E402 - load environment before importing the app

if not app.secret_key:
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
if not app.secret_key:
    raise RuntimeError('SECRET_KEY is missing. Add it to your local .env file.')

app.debug = False

if __name__ == '__main__':
    print('DevTrack running at http://127.0.0.1:5001')
    print('Press Ctrl+C to stop.')
    serve(app, host='127.0.0.1', port=5001, threads=4)
