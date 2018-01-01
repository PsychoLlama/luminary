import axios from 'axios';

import graphql from '../graphql';

jest.mock('axios');

describe('GraphQL', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    const response = Promise.resolve({
      // Axios response body.
      data: {
        // GraphQL response data.
        data: {
          groups: [{ id: 1 }, { id: 2 }],
        },
      },
    });

    axios.post.mockReturnValue(response);
  });

  it('passes sanity checks', () => {
    expect(graphql).toEqual(expect.any(Function));
  });

  it('throws if called without arguments', () => {
    const fail = () => graphql();

    expect(fail).toThrow(/query/);
  });

  it('throws if the string is interpolated', () => {
    const fail = () => graphql`first ${1} second`;

    expect(fail).toThrow(/interpolate?/);
  });

  it('returns a function', () => {
    const result = graphql`query loadStuff() {}`;

    expect(result).toEqual(expect.any(Function));
  });

  it('throws if the address is omitted', async () => {
    const query = graphql`GQL strings aren't validated here :)`;

    await expect(query()).rejects.toMatchObject(expect.any(Error));
  });

  it('returns the query promise', () => {
    const query = graphql`contents`;
    const result = query('http://stuff.whatever/');

    expect(result).toEqual(expect.any(Promise));
  });

  it('queries the GQL server', async () => {
    const contents = 'query body';
    const query = graphql([contents]);
    const url = 'http://ultron/';
    const variables = { id: 6 };

    expect(axios.post).not.toHaveBeenCalled();
    await query(url, variables);
    expect(axios.post).toHaveBeenCalledWith(url, {
      query: contents,
      variables,
    });
  });

  it('resolves with the query data', async () => {
    const query = graphql`whatevs`;
    const result = await query('http://ultron/');

    expect(result).toEqual({
      groups: [{ id: 1 }, { id: 2 }],
    });
  });

  it('returns the error data if rejected', async () => {
    const query = graphql`stuff`;
    const errors = ['Your query is syntactically inaccurate.'];
    const response = Promise.reject({
      response: { data: { errors } },
    });

    axios.post.mockReturnValue(response);

    await expect(query('http://ultron/')).rejects.toEqual(errors);
  });
});
