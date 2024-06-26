/**
 * Represents a utility class for handling API features such as filtering, sorting, field selection, and pagination.
 */
class ApiFeatures {
	constructor(query, queryString) {
		this.query = query;
		this.queryString = queryString;
	}

	filter() {
		const queryObj = { ...this.queryString };
		const excludedFields = ['page', 'sort', 'limit', 'fields'];

		excludedFields.forEach(el => delete queryObj[el]);

		this.query = this.query.find(queryObj);

		return this;
	}

	sort() {
		if (this.queryString.sort) {
			const sortBy = this.queryString.sort.split(',').join(' ');
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort('-createdAt');
		}
		return this;
	}

	limitFields() {
		if (this.queryString.fields) {
			const fields = this.queryString.fields.split(',').join(' ');
			this.query = this.query.select(fields); // including only specific fields
		} else {
			this.query = this.query.select('-__v -updatedAt'); // excluding __v field
		}
		return this;
	}

	paginate() {
		const page = Number(this.queryString.page) || 1;
		const limit = Number(this.queryString.limit) || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);

		return this;
	}
}

export default ApiFeatures;
	