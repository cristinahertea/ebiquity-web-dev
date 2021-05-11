function processData(
  lookup_table, //camelCase everything
  data_object,
  media_array,
  hierarchyLookupTable
) {
  var processedObject = {} //var declarations leak out of function scope. Not bad inherently, just outdated
  processedObject.media = [] // mutations, i'd keep this immutable
  processedObject.data = []

  for (var level in hierarchyLookupTable) {
    // waste of iterator, we can just forEach (or map, but we dont seem to return an array, instead we went with side effects) over the array
    processedObject[hierarchyLookupTable[level]] = []
  }

  for (var entry in data_object) {
    // same as above, with the added 'benefit' of going quadratic
    for (var media_value in media_array) {
      if (data_object[entry].medium[0] === lookup_table.media[media_value]) {
        for (level in hierarchyLookupTable) {
          var current_level = hierarchyLookupTable[level]
          processedObject[current_level].push(
            lookup_table[current_level][media_value]
          )
        }
        processedObject.media.push(lookup_table.media[media_value]) // mutations
        processedObject.data.push(data_object[entry].data)
      }
    }
  }
  return processedObject
} // this whole function could be replaced by a .reduce()

function generateDataarray(processedObject, hierarchyLookupTable) {
  var values_array = [] // same as above, var
  var raw_object = { media: [], model: [], budget: [] }

  for (var i = 0; i < hierarchyLookupTable.length; i++) {
    raw_object[hierarchyLookupTable[i]] = []
  } // same as above, forEach if we want to keep side effects, map if we want to make this FP

  var processed_array = [{}]
  for (var i = 0; i < Object.keys(raw_object).length; i++) {
    // a map() would be great to replace this
    processed_array[0][Object.keys(raw_object)[i]] = Object.keys(raw_object)[i]
  }

  var column_headers = [processed_array[0]]
  var x = 0
  while (!Object.entries(processedObject.data[x][0].values)[0][1]) {
    x++
  } // this can be replaced by a find() or filter()

  for (
    // .map() would be a great replacement here
    var i = 0;
    i <
    Object.entries(Object.entries(processedObject.data[x][0].values)[0][1])
      .length;
    i++
  ) {
    values_array.push(
      Object.entries(Object.entries(processedObject.data[x][0].values)[0][1])[
        i
      ][0]
    )
    column_headers[0][values_array[i]] = values_array[i]
  }

  for (var i = 0; i < values_array.length; i++) {
    // reduce() to return a new object, or just map through keys
    raw_object[values_array[i]] = []
  }

  for (var i = 0; i < processedObject.data.length; i++) {
    // this blows up into quadratic again  - O(n)
    var data_entry = processedObject.data[i]

    for (var j = 0; j < Object.entries(data_entry).length; j++) {
      // O(n)
      var budget_entry = Object.entries(data_entry)[j][1]
      for (var k = 0; k < Object.entries(budget_entry.values).length; k++) {
        // O(n^2)
        var model_entry = Object.entries(budget_entry.values)[k][1]

        if (!model_entry) {
          for (var l = 0; l < values_array.length; l++) {
            raw_object[values_array[l]].push(null) // mutations
          }
        } else {
          // a clever use of guard clauses could help with the indentation
          for (var l = 0; l < Object.entries(model_entry).length; l++) {
            raw_object[Object.entries(model_entry)[l][0]].push(
              Object.entries(model_entry)[l][1][0] // mutations
            )
          }
        }
        raw_object.media.push(processedObject.media[i]) // mutations
        if (Object.keys(budget_entry.values)[0] == 0) {
          raw_object.model.push(null) // mutations
        } else {
          raw_object.model.push(Object.entries(budget_entry.values)[k][0])
        }
        for (var level in hierarchyLookupTable) {
          var current_level = hierarchyLookupTable[level]
          raw_object[current_level].push(processedObject[current_level][i]) // mutations
        }
        raw_object.budget.push(budget_entry.budget[0]) // mutations
      }
    }
  }
  for (var i = 0; i < raw_object['media'].length; i++) {
    // quadratic, map() or reduce() depending on wether we want to work with an array or an object
    var row = {}
    for (var j = 0; j < Object.keys(raw_object).length; j++) {
      row[Object.keys(raw_object)[j]] =
        raw_object[Object.keys(raw_object)[j]][i]
    }
  }
  processed_array.push(row)
  processed_array.sort(function (a, b) {
    // best case here would be to replace the long chain of if/else with guard clauses. would halven the number of lines of code and escape the function faster
    if (a.media === b.media) {
      if (a.model === b.model) {
        return a.budget < b.budget ? -1 : a.budget > b.budget ? 1 : 0
      } else if (a.model === null) {
        return 1
      } else if (b.model === null) {
        return -1
      } else {
        return a.model < b.model ? -1 : 1
      }
    } else {
      return a.media < b.media ? -1 : 1
    }
  })
  processed_array.unshift(column_headers[0]) // unshift is ... interesting, we can use a clever spread operator here to add to the begining of the array [newElement, ...oldArray]
  return processed_array
}

const lookup_table = {
  brand: ['Brand 1', 'Brand 2'],
  budget: [13400, 40000],
  media: ['Brand 1 Product 2 TV', 'Brand 2 Product 1 Radio'],
  mediaType: ['TV', 'Radio'],
  product: ['Product 2', 'Product 1'],
  Profit: [3400, 10000],
  Sales: [10000, 30000],
}

const data_object = {
  TV: {
    data: [
      {
        spend: 0,
        budget: 0,
        values: {
          'TV Web': {
            Profit: 0,
            Sales: 0,
          },
        },
      },
    ],
    medium: 'TV',
  },
  RADIO: {
    data: [
      {
        spend: [0],
        budget: [0],
        values: {
          'Radio Web': {
            Profit: [0],
            Sales: [0],
          },
        },
      },
    ],
    medium: 'RADIO',
  },
}

const media_array = ['Brand 1 Product 2 TV', 'Brand 2 Product 1 Radio']
const hierarchyLookupTable = ['brand', 'product', 'media type']
