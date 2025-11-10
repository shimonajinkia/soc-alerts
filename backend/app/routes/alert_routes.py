from flask import Blueprint, jsonify, request
from app.models.alert import Alert

alert_blueprint = Blueprint("alerts", __name__)

# in-memory data (temporary)
alerts = [
    Alert(1, "Network", "High", "Suspicious traffic detected"),
    Alert(2, "System", "Medium", "CPU usage spike"),
    Alert(3, "Application", "Low", "User login failed 3 times")
]

# GET all alerts
@alert_blueprint.route("/", methods=["GET"])
def get_alerts():
    return jsonify([alert.to_dict() for alert in alerts])

# POST: create new alert
@alert_blueprint.route("/", methods=["POST"])
def create_alert():
    data = request.json

    new_id = len(alerts) + 1
    new_alert = Alert(
        id=new_id,
        type=data.get("type"),
        severity=data.get("severity"),
        description=data.get("description")
    )

    alerts.append(new_alert)

    return jsonify(new_alert.to_dict()), 201

