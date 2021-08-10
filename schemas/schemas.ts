import schemaTypes from 'all:part:@sanity/base/schema-type';
import createSchema from 'part:@sanity/base/schema-creator';

import * as documents from './documents';
import * as modules from './modules';

import { mapObjectToSchema } from '../utils/mapToProps';

export default createSchema({
  name: 'default',
  types: schemaTypes
    .concat(mapObjectToSchema(documents))
    .concat(mapObjectToSchema(modules)),
});
