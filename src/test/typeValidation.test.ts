import { validateType } from 'utils/typeValidation';

describe('both undefined', () => {
  it('should return false', () => {
    expect(validateType(undefined, undefined)).toBeFalsy();
  });
});

describe('both null', () => {
  it('should return false', () => {
    expect(validateType(null, null)).toBeFalsy();
  });
});

describe('both empty', () => {
  it('should return false', () => {
    expect(validateType('', '')).toBeFalsy();
  });
});

describe('type empty', () => {
  it('should return true', () => {
    expect(validateType('', 'asdasd')).toBeTruthy();
  });
});

describe('type undefined', () => {
  it('should return false', () => {
    expect(validateType(undefined, 'asdasd')).toBeFalsy();
  });
});

describe('type null', () => {
  it('should return false', () => {
    expect(validateType(null, 'asdasd')).toBeFalsy();
  });
});

describe('number zero', () => {
  it('should return true', () => {
    expect(validateType('number', 0)).toBeTruthy();
  });
});

describe('number million', () => {
  it('should return true', () => {
    expect(validateType('number', 1000000)).toBeTruthy();
  });
});

describe('number minus million', () => {
  it('should return true', () => {
    expect(validateType('number', -1000000)).toBeTruthy();
  });
});

describe('number positive decimal', () => {
  it('should return true', () => {
    expect(validateType('number', 1.999)).toBeTruthy();
  });
});

describe('number negative decimal', () => {
  it('should return true', () => {
    expect(validateType('number', -1.999)).toBeTruthy();
  });
});

describe('number as string', () => {
  it('should return false', () => {
    expect(validateType('number', '1')).toBeTruthy();
  });
});

describe('number as string negative', () => {
  it('should return false', () => {
    expect(validateType('number', '-1')).toBeTruthy();
  });
});

describe('number exponent', () => {
  it('should return false', () => {
    expect(validateType('number', 0.0314e2)).toBeTruthy();
  });
});

describe('negative number exponent', () => {
  it('should return false', () => {
    expect(validateType('number', -0.0314e2)).toBeTruthy();
  });
});

describe('number negative exponent', () => {
  it('should return false', () => {
    expect(validateType('number', 0.0314e-2)).toBeTruthy();
  });
});

describe('negative number negative exponent', () => {
  it('should return false', () => {
    expect(validateType('number', -0.0314e-2)).toBeTruthy();
  });
});

describe('not a number', () => {
  it('should return false', () => {
    expect(validateType('number', ':D')).toBeFalsy();
  });
});

describe('not a number time', () => {
  it('should return false', () => {
    expect(validateType('number', '2000:12:20:20:20:999')).toBeFalsy();
  });
});

describe('not a number string', () => {
  it('should return false', () => {
    expect(validateType('number', 'notanumber')).toBeFalsy();
  });
});

describe('not a number boolean', () => {
  it('should return false', () => {
    expect(validateType('number', true)).toBeFalsy();
  });
});

describe('number empty', () => {
  it('should return false', () => {
    expect(validateType('number', '')).toBeFalsy();
  });
});

describe('number null', () => {
  it('should return false', () => {
    expect(validateType('number', null)).toBeFalsy();
  });
});

describe('number undefined', () => {
  it('should return false', () => {
    expect(validateType('number', undefined)).toBeFalsy();
  });
});

describe('string', () => {
  it('should return true', () => {
    expect(validateType('string', 'thisisastring')).toBeTruthy();
  });
});

describe('not a string number', () => {
  it('should return false', () => {
    expect(validateType('string', 1)).toBeFalsy();
  });
});

describe('not a string boolean', () => {
  it('should return false', () => {
    expect(validateType('string', true)).toBeFalsy();
  });
});

describe('string empty', () => {
  it('should return false', () => {
    expect(validateType('string', '')).toBeFalsy();
  });
});

describe('string null', () => {
  it('should return false', () => {
    expect(validateType('string', null)).toBeFalsy();
  });
});

describe('string undefined', () => {
  it('should return false', () => {
    expect(validateType('string', undefined)).toBeFalsy();
  });
});

describe('time', () => {
  it('should return true', () => {
    expect(validateType('time', '2000:12:12:20:20:999')).toBeTruthy();
  });
});

describe('time negative year', () => {
  it('should return true', () => {
    expect(validateType('time', '-2000:12:12:20:20:999')).toBeTruthy();
  });
});

describe('time positive year', () => {
  it('should return true', () => {
    expect(validateType('time', '+2000:12:12:20:20:999')).toBeTruthy();
  });
});

describe('time ms missing', () => {
  it('should return false', () => {
    expect(validateType('time', '2000:366:12:20:20')).toBeFalsy();
  });
});

describe('time s missing', () => {
  it('should return false', () => {
    expect(validateType('time', '2000:366:12:20:999')).toBeFalsy();
  });
});

describe('time number', () => {
  it('should return false', () => {
    expect(validateType('time', 200000000)).toBeFalsy();
  });
});

describe('time random string', () => {
  it('should return false', () => {
    expect(validateType('time', 'lmaorofl')).toBeFalsy();
  });
});

describe('time boolean', () => {
  it('should return false', () => {
    expect(validateType('time', true)).toBeFalsy();
  });
});

describe('time undefined', () => {
  it('should return false', () => {
    expect(validateType('time', undefined)).toBeFalsy();
  });
});

describe('time null', () => {
  it('should return false', () => {
    expect(validateType('time', null)).toBeFalsy();
  });
});

describe('time empty', () => {
  it('should return false', () => {
    expect(validateType('time', '')).toBeFalsy();
  });
});

describe('int', () => {
  it('should return true', () => {
    expect(validateType('int', 1)).toBeTruthy();
  });
});

describe('int negative', () => {
  it('should return true', () => {
    expect(validateType('int', -1)).toBeTruthy();
  });
});

describe('int millione', () => {
  it('should return true', () => {
    expect(validateType('int', 1000000)).toBeTruthy();
  });
});

describe('int minus millione', () => {
  it('should return true', () => {
    expect(validateType('int', -1000000)).toBeTruthy();
  });
});

describe('int zero', () => {
  it('should return true', () => {
    expect(validateType('int', 0)).toBeTruthy();
  });
});

describe('int decimal', () => {
  it('should return false', () => {
    expect(validateType('int', 1.0000009)).toBeFalsy();
  });
});

describe('int decimal negative', () => {
  it('should return false', () => {
    expect(validateType('int', -1.0000009)).toBeFalsy();
  });
});

describe('int exponent', () => {
  it('should return false', () => {
    expect(validateType('int', 0.0314e-2)).toBeFalsy();
  });
});

describe('int string', () => {
  it('should return false', () => {
    expect(validateType('int', 'lmaorofl')).toBeFalsy();
  });
});

describe('int boolean', () => {
  it('should return false', () => {
    expect(validateType('int', true)).toBeFalsy();
  });
});

describe('int undefined', () => {
  it('should return false', () => {
    expect(validateType('int', undefined)).toBeFalsy();
  });
});

describe('int null', () => {
  it('should return false', () => {
    expect(validateType('int', null)).toBeFalsy();
  });
});

describe('int empty', () => {
  it('should return false', () => {
    expect(validateType('int', '')).toBeFalsy();
  });
});
