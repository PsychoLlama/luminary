import assert from 'minimalistic-assert';
import axios from 'axios';

/**
 * Sends a GraphQL request, and formats the response into a
 * reducer-friendly payload. Meant to be used with createAction(..).
 * @param  {String[]} parts - The query (invoked as a tagged template).
 * @return {Function} - Accepts the server URL and query variables.
 */
export default parts => {
  assert(parts, 'graphql(..) expects a query.');
  assert(parts.length === 1, 'Don\'t interpolate values in GraphQL queries.');
  const [query] = parts;

  return async (address, variables) => {
    assert(address, 'GQL server address is required for this action.');
    const body = { query, variables };

    const response = await axios.post(address, body).catch(response => {
      const { errors } = response.response.data;
      return Promise.reject(errors);
    });

    return response.data.data;
  };
};
