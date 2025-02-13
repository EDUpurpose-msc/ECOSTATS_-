import _ from "lodash";
import { GenericFormFieldV3 } from "../types/forms/GenericFormTypes";
import { DatePicker, Input, Select } from "antd"

export const generateYearOptions = (startYear, endYear) => {
  return Array.from({ length: endYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    return {
      label: year,
      value: year,
    };
  }).reverse(); // Reverse the array to have the latest year first
};

export const generateYearOptionsFixed = generateYearOptions(2010, new Date().getFullYear());

export const municipalityOptions : any[] = [
  {
    label : "Boac",
    value : "Boac"
  },
  {
    label : "Mogpog",
    value : "Mogpog"
  },
  {
    label : "Gasan",
    value : "Gasan"
  },
  {
    label : "Sta. Cruz",
    value : "Sta. Cruz"
  },
  {
    label : "Torrijos",
    value : "Torrijos"
  },
  {
    label : "Buenavista",
    value : "Buenavista"
  },
];

export const generateColDefs = (fields : any[]) => {
  return fields?.map((field : any) => {
    const f : any =  {
      headerName: field.name,
      field: field.identifier,
      // editable : field.is_nested ? false : field.editable,
    }

    if(field.is_nested){
      f.children = field.is_nested && generateColDefs(field.children);
      return f;
    }
    else {
      f.editable = field.editable;
      f.field = field.identifier;
      if(["number", "text"].includes(field.input_type)){
        f.type = getColDefType(field.input_type);
      }
      if(field.input_type === "number"){
        f.valueFormatter = (params) => {
          console.log("paramvalue" , params)
          return parseFloat(params.value);
        }
      }
      if(field.input_type === "enum"){
        f.cellEditor = "agSelectCellEditor";
        f.cellEditorParams = {
          values : field.values
        }
      }
      if(field.input_type === "date"){
        f.cellEditor = "agDateCellEditor";
        f.valueFormatter = (params) => {
          const date = new Date(params.value);
          return date.toLocaleDateString();
        }
        f.valueParser = (params) => {
            return new Date(params.newValue).toISOString(); 
        }
      }
      return f
    }

  })
}


const getColDefType = (type : string) => {
  if(type == "text"){
    return "textColumn";
  }
  if(type == "number"){
    return "numberColumn"
  }
}


export const flattenFields = (fields) => {

   return _.flatMapDeep(fields, field => {
    // console.log("field", field);
      // Flatten the current field without `children`, so we only have primitive data in the output
      // if(!field) return null;
      const flatField: any = {
        name: null,
        identifier: null,
        input_type: null,
        editable: false,
        is_nested: false,
        values: null,
        default: null,
        computed_value: false,
        computed_values: null,
        computed_value_type: "sum"
      };
      
      if (field) {
        flatField.name = field.name || null;
        flatField.identifier = field.identifier ?? null;
        flatField.input_type = field.input_type || null;
        flatField.editable = field.editable || false;
        flatField.is_nested = field.is_nested || false;
        flatField.values = field.values;
        flatField.default = field.default || null;
        flatField.computed_value = field.computed_value ?? false;
        flatField.computed_values = field.computed_values ?? null;


        // If the field has children, recursively flatten them with the updated identifier path
        if (Array.isArray(field.children) && field.children.length > 0) {
            // Pass unique identifier path to each child for correct flattening
            return [flatField, ...flattenFields(field.children)];
        }
      }
      // console.log(flatField)
      return flatField;
  }).filter(field => field && field.identifier && field.name);
};

export const convertReportFilters = (filters : any) => {
  const _filters: Record<string, any> = {}; 
  for (const key in filters) {
    _filters[`data.${key}`] = filters[key]; 
  }
  return _filters; 
}

export function getRandomColor(index : number) {
  const colors = [
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6", "#FFD733", "#D733FF", "#FF8C33", "#8CFF33", "#338CFF",
    "#FF3368", "#33FF94", "#9433FF", "#33FFA8", "#FF8C33", "#A8FF33", "#FF338C", "#338CFF", "#D733FF", "#FF8C33",
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6", "#FFD733", "#FF33D7", "#D7FF33", "#33FFD7", "#57FF33",
    "#FF3357", "#33D7FF", "#FF57A1", "#A1FF33", "#33FF8C", "#8C33FF", "#FFD733", "#57FF33", "#FF338C", "#A8FF33",
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6", "#FFD733", "#D733FF", "#FF8C33", "#8CFF33", "#338CFF",
    "#FF3368", "#33FF94", "#9433FF", "#33FFA8", "#FF8C33", "#A8FF33", "#FF338C", "#338CFF", "#D733FF", "#FF8C33",
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6", "#FFD733", "#FF33D7", "#D7FF33", "#33FFD7", "#57FF33",
    "#FF3357", "#33D7FF", "#FF57A1", "#A1FF33", "#33FF8C", "#8C33FF", "#FFD733", "#57FF33", "#FF338C", "#A8FF33",
    "#FF5733", "#33FF57", "#3357FF", "#FF33A1", "#33FFF6", "#FFD733", "#D733FF", "#FF8C33", "#8CFF33", "#338CFF",
    "#FF3368", "#33FF94", "#9433FF", "#33FFA8", "#FF8C33", "#A8FF33", "#FF338C", "#338CFF", "#D733FF", "#FF8C33"
  ];
  
  return colors[index];
}
export function getRandomColorByScheme(index : number, colors : string[]) {
  if(index >= colors.length) index = 0;
  return colors[index];
}