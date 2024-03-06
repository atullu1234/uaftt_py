from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tow_truck.db'
db = SQLAlchemy(app)

class TowTruck(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    available = db.Column(db.Boolean, default=True)

# API endpoint for requesting a tow truck
@app.route('/request_tow_truck', methods=['POST'])
def request_tow_truck():
    data = request.json
    user_location = (data['latitude'], data['longitude'])
    # Find the nearest available tow truck
    tow_truck = TowTruck.query.filter_by(available=True).first()
    if tow_truck:
        # In a real application, you would send a notification to the tow truck driver
        # and handle the ride request process
        return jsonify({'message': 'Tow truck on the way', 'tow_truck': {
            'name': tow_truck.name,
            'latitude': tow_truck.latitude,
            'longitude': tow_truck.longitude
        }})
    else:
        return jsonify({'message': 'No available tow trucks'})

# API endpoint for toggling user's availability for tow trucks
@app.route('/toggle_availability', methods=['POST'])
def toggle_availability():
    data = request.json
    # Assuming there is some form of user authentication and each user has an ID
    user_id = data.get('user_id')
    if user_id is None:
        return jsonify({'message': 'User ID not provided'}), 400

    user = TowTruck.query.get(user_id)
    if user is None:
        return jsonify({'message': 'User not found'}), 404

    user.available = not user.available
    db.session.commit()

    return jsonify({'message': 'Availability updated successfully'})

if __name__ == '__main__':
    app.run(debug=True)
