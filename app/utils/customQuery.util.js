async function findDataByCustomQuery(filterValues, filterConditions, mongooseModel) {
  return new Promise(async (resolve, reject) => {
    let filterQuerys = [];
    
    if (filterValues.length <= 0) {
      return Error("Não contém filtros para ser realizado a busca");
    }

    filterValues.forEach(filterValue => {
      if (filterValue.hasOwnProperty('filterParameter')
        && filterValue.filterParameter != null
        && filterValue.hasOwnProperty('variableInfo')
        && filterValue.variableInfo.name != null
        && filterValue.variableInfo.type != null) {


        if (filterValue.filterParameter.hasOwnProperty('value') && !filterValue.filterParameter.value.hasOwnProperty('start')) {
          newQuery = createQueryBasedToType(filterValue.variableInfo.type, filterValue.filterParameter.parameter, filterValue.filterParameter.value, null, filterValue.variableInfo.name, 'i');
        } else {
          newQuery = createQueryBasedToType(filterValue.variableInfo.type, filterValue.filterParameter.parameter, filterValue.filterParameter.value.start, filterValue.filterParameter.value.end, filterValue.variableInfo.name, 'i');
        }

        if (newQuery != null) {
          filterQuerys.push(newQuery);
        }

      }
    });


    let _filterQuerys = createQueryWithConditions(filterConditions, filterQuerys);

    console.log("Dados da query:", _filterQuerys);
    await mongooseModel.find(_filterQuerys[0])
      .then(data => {
        resolve(data);
      })
      .catch(error => {
        reject(error);
      });

  });

}

function createQueryWithConditions(filterConditions, filterParams) {
  var query = [];
  let newFilterParams = [];
  let newFilterConditions = [];
  var filterConditionIndex = 0;

  for (let filterParamIndex = 0; filterParamIndex <= filterParams.length - 2; filterParamIndex = filterParamIndex + 2) {
    var param = {};

    let filterParam1 = filterParams[filterParamIndex];
    let filterParam2 = filterParams[filterParamIndex + 1];

    switch (filterConditions[filterConditionIndex]) {
      case "or":
        param = { $or: [filterParam1, filterParam2] };
        break;
      case "and":
        param = { $and: [filterParam1, filterParam2] };
        break;

      default:
        param = { $or: [filterParam1, filterParam2] };
        break;
    }

    newFilterParams.push(param);
    filterConditionIndex = filterConditionIndex + 2;
  }

  if (newFilterParams.length > 0) {
    filterParams = newFilterParams;
  }

  for (let filterConditionIndex = 1; filterConditionIndex < filterConditions.length; filterConditionIndex++) {
    if (filterConditionIndex % 2 != 0) {
      newFilterConditions.push(filterConditions[filterConditionIndex])
    }
  }

  if (filterParams.length > 1) {
    filterParams = createQueryWithConditions(newFilterConditions, filterParams);
  }

  return filterParams;

}

function createQueryBasedToType(variableType, parameter, value1, value2, variableName, options) {

  switch (variableType) {
    case "string":
      return createTextQuery(parameter, value1, variableName, options);
      break;
    case "number":
      if(!isNaN(parseFloat(value1))){
        return createNumberQuery(parameter, value1, value2, variableName);
      } else {
        return null;
      }
      break;
    case "Date":
      return createDateQuery(parameter, value1, value2, variableName);
      break;
    case "boolean":
      return createBooleanQuery(parameter, value1, variableName);
      break;
    default:
      return null;
      break;
  }

  return null;
}

function createTextQuery(parameter, value, variableName, options) {

  var param = {};

  switch (parameter) {
    case "equal":
      param[variableName] = { $regex: "^" + value + "$", $options: options };
      break;
    case "different":
      param[variableName] = { $not: { $regex: "^" + value + "$", $options: options } };
      break;
    case "startWith":
      param[variableName] = { $regex: "^" + value, $options: options };
      break;
    case "endWith":
      param[variableName] = { $regex: value + "$", $options: options };
      break;
    case "contains":
      param[variableName] = { $regex: value, $options: options };
      break;
    case "dontContains":
      param[variableName] = { $not: { $regex: value, $options: options } };
      break;
    case "match":
      param[variableName] = { $text: { $search: value } };
    default:
      param[variableName] = { $regex: value, $options: options };
      break;
  }
  return param;
};

function createNumberQuery(parameter, value1, value2, variableName) {

  var param = {};

  switch (parameter) {
    case "equal":
      param[variableName] = { $eq: value1 };
      break;
    case "different":
      param[variableName] = { $ne: value1 };
      break;
    case "biggerThan":
      param[variableName] = { $gt: value1 };
      break;
    case "biggerOrEqualThan":
      param[variableName] = { $gte: value1 };
      break;
    case "smallerThan":
      param[variableName] = { $lt: value1 };
      break;
    case "smallerOrEqualThan":
      param[variableName] = { $lte: value1 };
      break;
    case "between":
      param = { $and: [{ [variableName]: { $gte: value1 } }, { [variableName]: { $lte: value2 } }] }
      break;

    default:
      param[variableName] = { $eq: value1 };
      break;
  }

  return param;
};
function createBooleanQuery(parameter, value, variableName) {
  var param = {};

  switch (parameter) {
    case "equal":
      param[variableName] = value;
      break;

    default:
      param[variableName] = value;
      break;
  }

  return param;
}
function createDateQuery(parameter, value1, value2, variableName) {

  var param = {};
  switch (parameter) {
    case "day":
      param = { $expr: { $eq: [{ $dayOfMonth: '$' + variableName }, value1] } };
      break;
    case "month":
      if (value1 >= 1 && value1 <= 12) {
        param = { $expr: { $eq: [{ $month: '$' + variableName }, value1] } };
      } else {
        return null;
      }
      break;
    case "year":
      param = { $expr: { $eq: [{ $year: '$' + variableName }, value1] } };
      break;
    case "week":
      if (value1 >= 0 && value1 <= 53) {
        param = { $expr: { $eq: [{ $week: '$' + variableName }, value1] } };
      } else {
        return null;
      }
      break;

    case "different":
      param[variableName] = { $ne: new Date(value1) };
      break;
    case "afterThan":
      param[variableName] = { $gt: new Date(value1) };
      break;
    case "afterOrEqualThan":
      param[variableName] = { $gte: new Date(value1) };
      break;
    case "beforeThan":
      param[variableName] = { $lt: new Date(value1) };
      break;
    case "beforeOrEqualThan":
      param[variableName] = { $lte: new Date(value1) };
      break;
    case "between":
      param = { $and: [{ [variableName]: { $gte: new Date(value1) } }, { [variableName]: { $lte: new Date(value2) } }] }
      break;

    default:
      param[variableName] = { $eq: new Date(value1) };
      break;
  }
  return param;
};

module.exports = findDataByCustomQuery;