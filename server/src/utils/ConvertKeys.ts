import _ from 'lodash';

export const convertKeys = (object : any) => {
    return _.mapKeys(object, (value, key) => _.camelCase(key));
}

export const convertKeysArray = (arrayObjects : any[]) => {
    return arrayObjects.map(object => {
        return _.mapKeys(object, (value, key) => _.camelCase(key));
    })
}