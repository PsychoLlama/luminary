import assert from 'minimalistic-assert';
import axios from 'axios';
import R from 'ramda';

/**
 * Sends a GraphQL request, and formats the response into a
 * reducer-friendly payload. Meant to be used with createAction(..).
 * @param  {String[]} parts - The query (invoked as a tagged template).
 * @return {Function} - Accepts the server URL and query variables.
 */
export default parts => {
  assert(parts, 'graphql(..) expects a query.');
  assert(parts.length === 1, "Don't interpolate values in GraphQL queries.");
  const [query] = parts;

  return async (address, variables) => {
    assert(address, 'GQL server address is required for this action.');
    const body = { query, variables };

    // Send! Try to extract any GQL errors.
    const { data } = await axios.post(address, body).catch(error => {
      const errors = R.pathOr(error, ['response', 'data', 'errors'], error);
      return Promise.reject(errors);
    });

    return data.data;
  };
};
