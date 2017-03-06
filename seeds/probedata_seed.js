
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('table_name').del()
    .then(function () {
      // Inserts seed entries
      return knex('table_name').insert([
        {id: 1, colName: 'rowValue1'},
        {id: 2, colName: 'rowValue2'},
        {id: 3, colName: 'rowValue3'}
      ]);
    });
};

// NEW

exports.seed = function(knex, Promise) {
    return knex('probedata').del() // Deletes ALL existing entries
        .then(function() { // Inserts seed entries one by one in series
            return knex('probedata').insert({
                ph: 7.2,
                ec: 11.4,
                do: 87.9,
                orp: 3.2,
                tempuw: 80.98,
                tempamb: 22.5,
                humidity: 80.0,
                created_at: new Date('2017-02-27T21:25:16.000Z')
            });
        }).then(function () {
            return knex('probedata').insert({
                ph: 2.2,
                ec: 4.4,
                do: 27.1,
                orp: 9.7,
                tempuw: 55.23,
                tempamb: 18.5,
                humidity: 90.0,
                created_at: new Date('2017-02-27T21:26:16.000Z')
            });
        }).then(function () {
            return knex('probedata').insert({
                ph: 4.2,
                ec: 8.4,
                do: 47.7,
                orp: 11.6,
                tempuw: 80.98,
                tempamb: 22.5,
                humidity: 80.0,
                created_at: new Date('2017-02-27T21:27:16.000Z')
            });
        }).then(function () {
            return knex('probedata').insert({
                ph: 5.2,
                ec: 1.4,
                do: 27.0,
                orp: 33.3,
                tempuw: 80.98,
                tempamb: 22.5,
                humidity: 80.0,
                created_at: new Date('2017-02-27T21:28:16.000Z')
            });
        });
};

