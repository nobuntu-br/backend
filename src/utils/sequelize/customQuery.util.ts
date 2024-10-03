import { WhereOptions, Op, Model, ModelStatic } from 'sequelize';

// Interfaces para tipar os filtros
interface FilterParameter {
  parameter: string;
  value: any;
}

interface VariableInfo {
  name: string;
  type: string;
}

interface FilterValue {
  filterParameter: FilterParameter;
  variableInfo: VariableInfo;
}

// Função principal tipada
async function findDataByCustomQuery<T extends Model>(
  filterValues: FilterValue[],
  filterConditions: string[],
  model: typeof Model
): Promise<T[]> {
  return new Promise(async (resolve, reject) => {
    let filterQueries: WhereOptions[] = [];

    if (filterValues.length <= 0) {
      return reject(new Error("Não contém filtros para ser realizado a busca"));
    }

    filterValues.forEach(filterValue => {
      if (
        filterValue.filterParameter &&
        filterValue.variableInfo &&
        filterValue.variableInfo.name &&
        filterValue.variableInfo.type
      ) {
        let newQuery: WhereOptions | null = null;

        if (!filterValue.filterParameter.value.start) {
          newQuery = createQueryBasedOnType(
            filterValue.variableInfo.type,
            filterValue.filterParameter.parameter,
            filterValue.filterParameter.value,
            null,
            filterValue.variableInfo.name
          );
        } else {
          newQuery = createQueryBasedOnType(
            filterValue.variableInfo.type,
            filterValue.filterParameter.parameter,
            filterValue.filterParameter.value.start,
            filterValue.filterParameter.value.end,
            filterValue.variableInfo.name
          );
        }

        if (newQuery) {
          filterQueries.push(newQuery);
        }
      }
    });

    const combinedQuery = createQueryWithConditions(filterConditions, filterQueries);

    try {
      const data = await (model as ModelStatic<Model>).findAll({
        where: combinedQuery
      });
      resolve(data as T[]);
    } catch (error) {
      reject(error);
    }
  });
}

function createQueryWithConditions(filterConditions: string[], filterParams: WhereOptions[]): WhereOptions {
  let query: WhereOptions = {};
  let newFilterParams: WhereOptions[] = [];
  let filterConditionIndex = 0;

  for (let i = 0; i <= filterParams.length - 2; i += 2) {
    let param: WhereOptions = {};

    const filterParam1 = filterParams[i];
    const filterParam2 = filterParams[i + 1];

    switch (filterConditions[filterConditionIndex]) {
      case 'or':
        param = { [Op.or]: [filterParam1, filterParam2] };
        break;
      case 'and':
        param = { [Op.and]: [filterParam1, filterParam2] };
        break;
      default:
        param = { [Op.or]: [filterParam1, filterParam2] };
        break;
    }

    newFilterParams.push(param);
    filterConditionIndex += 2;
  }

  if (newFilterParams.length > 0) {
    filterParams = newFilterParams;
  }

  if (filterParams.length > 1) {
    filterParams = [createQueryWithConditions(filterConditions.slice(1), filterParams)];
  }

  return filterParams[0];
}

function createQueryBasedOnType(
  variableType: string,
  parameter: string,
  value1: any,
  value2: any,
  variableName: string
): WhereOptions | null {
  switch (variableType) {
    case 'string':
      return createTextQuery(parameter, value1, variableName);
    case 'number':
      return !isNaN(parseFloat(value1)) ? createNumberQuery(parameter, value1, value2, variableName) : null;
    case 'Date':
      return createDateQuery(parameter, value1, value2, variableName);
    case 'boolean':
      return createBooleanQuery(parameter, value1, variableName);
    default:
      return null;
  }
}

function createTextQuery(parameter: string, value: string, variableName: string): WhereOptions {
  const param: WhereOptions = {};
  switch (parameter) {
    case 'equal':
      param[variableName] = { [Op.eq]: value };
      break;
    case 'different':
      param[variableName] = { [Op.ne]: value };
      break;
    case 'contains':
      param[variableName] = { [Op.like]: `%${value}%` };
      break;
    case 'dontContains':
      param[variableName] = { [Op.notLike]: `%${value}%` };
      break;
    default:
      param[variableName] = { [Op.like]: `%${value}%` };
      break;
  }
  return param;
}

function createNumberQuery(parameter: string, value1: number, value2: number, variableName: string): WhereOptions {
  const param: WhereOptions = {};
  switch (parameter) {
    case 'equal':
      param[variableName] = { [Op.eq]: value1 };
      break;
    case 'between':
      param[variableName] = { [Op.between]: [value1, value2] };
      break;
    default:
      param[variableName] = { [Op.eq]: value1 };
      break;
  }
  return param;
}

function createDateQuery(parameter: string, value1: string, value2: string, variableName: string): WhereOptions {
  const param: WhereOptions = {};
  const date1 = new Date(value1);
  const date2 = new Date(value2);

  switch (parameter) {
    case 'between':
      param[variableName] = { [Op.between]: [date1, date2] };
      break;
    default:
      param[variableName] = { [Op.eq]: date1 };
      break;
  }
  return param;
}

function createBooleanQuery(parameter: string, value: boolean, variableName: string): WhereOptions {
  return {
    [variableName]: value
  };
}

export default findDataByCustomQuery;
