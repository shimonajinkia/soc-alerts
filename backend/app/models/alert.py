class Alert:
    def __init__(self, id, type, severity, description):
        self.id = id
        self.type = type
        self.severity = severity
        self.description = description

    def to_dict(self):
        return {
            "id": self.id,
            "type": self.type,
            "severity": self.severity,
            "description": self.description
        }
