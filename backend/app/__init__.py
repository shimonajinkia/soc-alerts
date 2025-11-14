from flask import Flask, redirect
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # allow requests from frontend

    # import blueprint
    from app.routes.alert_routes import alert_blueprint
    app.register_blueprint(alert_blueprint, url_prefix="/api/alerts")

    # redirect root URL to /api/alerts
    @app.route("/")
    def index():
        return redirect("/api/alerts")

    return app
