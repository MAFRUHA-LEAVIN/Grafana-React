/**
 * Check if the type of a variable is the one given as the type argument
 * @param type the wanted type of the variable
 * Supported types: number, string, integer, time (signYears:Days:Hours:Minutes:Seconds:Milliseconds)
 * @param value the value of the variable
 * @returns true if the type is matching, false if the type doesn't match
 */
export function validateType(type: string, value: any) {
  // If the type or value are null or if the value is empty return false
  if (type === null || value === null) {
    return false;
  } else if (value === undefined || type === undefined) {
    return false;
  } else if (value === '') {
    return false;
  } else {
    switch (type) {
      // Handle string type
      case 'string':
        if (typeof value !== 'string') {
          return false;
        }
        break;

      // Handle number type
      case 'number':
        if (isNaN(value)) {
          return false;
        } else if (typeof value === 'boolean') {
          return false;
        }
        break;

      // Handle integer type
      case 'int':
        if (!Number.isInteger(Number(value))) {
          return false;
        } else if (typeof value === 'boolean') {
          return false;
        }
        break;

      // Handle time type that is in format signYears:Days:Hours:Minutes:Seconds:Milliseconds
      case 'time':
        if (typeof value !== 'string') {
          return false;
        }
        let firstCharacter = value.charAt(0);

        // Also supports omitting sign.
        let firstCharacterIsANumber = Number.isInteger(Number(firstCharacter));
        const timeAmountsList = value.split(':');
        let list_correct = true;
        if (!(timeAmountsList.length === 6)) {
          list_correct = false;
        } else {
          for (let index = 0; index < timeAmountsList.length; index++) {
            if (
              index === 0 &&
              !(['-', '+'].includes(firstCharacter) || firstCharacterIsANumber)
            ) {
              list_correct = false;
            } else if (!Number.isInteger(Number(timeAmountsList[index]))) {
              list_correct = false;
            }
          }
        }
        if (!list_correct) {
          return false;
        }
        break;

      // Unrecognized type value is ignored for now
      default:
        console.log('Type validation not available for type: ' + type);
        break;
    }
  }
  // return true if the type is matching
  return true;
}
