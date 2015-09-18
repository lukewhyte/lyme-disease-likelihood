import can from 'can';

export default can.Model.extend({
	findAll: 'GET /cases',
	findOne: 'GET /cases/{id}'
}, {});