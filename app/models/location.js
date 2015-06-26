exports.definition = {

	config: {

		// For the sql-type these are the column names and types
		columns: {
			title: 'TEXT',
			longitude: 'REAL',
			latitude: 'REAL'
		},

		adapter: {

			// We use the built-in sql-type for SQLite
			type: 'sql',

			// For the sql-type, this is the table name
			collection_name: 'location'
		}
	},

	// You could leave out the next auto-generated part

	extendModel: function (Model) {
		_.extend(Model.prototype, {
			// extended functions and properties go here
		});

		return Model;
	},
	extendCollection: function (Collection) {
		_.extend(Collection.prototype, {
			// extended functions and properties go here

			// For Backbone v1.1.2, uncomment the following to override the
			// fetch method to account for a breaking change in Backbone.
			/*
			fetch: function(options) {
				options = options ? _.clone(options) : {};
				options.reset = true;
				return Backbone.Collection.prototype.fetch.call(this, options);
			}
			*/
		});

		return Collection;
	}
};
