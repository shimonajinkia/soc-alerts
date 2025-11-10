from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # allow requests from Vite frontend

    # ✅ IMPORT BLUEPRINT HERE
    from app.routes.alert_routes import alert_blueprint

    # ✅ REGISTER BLUEPRINT WITH API PREFIX
    app.register_blueprint(alert_blueprint, url_prefix="/api/alerts")

    return app
