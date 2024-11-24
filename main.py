from flask import Flask, jsonify, render_template

app = Flask(__name__)

company_data = {
    "companies": [
        {"id": 1, "name": "TechCorp"},
        {"id": 2, "name": "TechMicro"}
    ],
    "departments": [
        {"id": 1, "name": "Engineering", "companyId": 1},
        {"id": 2, "name": "Marketing", "companyId": 1},
        {"id": 3, "name": "Sales", "companyId": 2},
        {"id": 4, "name": "HR", "companyId": 2}
    ],
    "employees": [
        {"id": 1, "firstname": "Alice", "lastname": "Smith", "email": "alice@techcorp.com", "departmentId": 1, "departmentName": "Engineering", "companyName": "TechCorp"},
        {"id": 2, "firstname": "Bob", "lastname": "Brown", "email": "bob@techcorp.com", "departmentId": 1, "departmentName": "Engineering", "companyName": "TechCorp"},
        {"id": 3, "firstname": "Charlie", "lastname": "Davis", "email": "charlie@techcorp.com", "departmentId": 2, "departmentName": "Marketing", "companyName": "TechCorp"},
        {"id": 4, "firstname": "David", "lastname": "Wilson", "email": "david@techmicro.com", "departmentId": 3, "departmentName": "Sales", "companyName": "TechMicro"},
        {"id": 5, "firstname": "Mary", "lastname": "Johnson", "email": "mary@techmicro.com", "departmentId": 4, "departmentName": "HR", "companyName": "TechMicro"}
    ]
}


@app.route('/data', methods=['GET'])
def get_data():
    # Sample data to send to the frontend
    return jsonify(company_data)


@app.route('/')
def index():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)
