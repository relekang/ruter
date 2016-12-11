// @flow
/* globals fetch */
import 'isomorphic-fetch';

type Params = { [key: string]: string };

function stringifyParams(params: Params) {
  const keys = Object.keys(params);
  return keys.reduce(
    (lastValue, key) => [...lastValue, `${key}=${params[key]}`],
    []
  ).join('&');
}

function createUrl(path: string, params?: Params) {
  return `http://reisapi.ruter.no${path}${params ? `?${stringifyParams(params)}` : ''}`;
}

type Options = {
  params?: Params,
};

function request(path: string, opts: ?Options) {
  const { params, ...options } = opts || {};
  return fetch(createUrl(path, params), {
    ...options,
    method: 'GET',
  })
  .then(response => response.json());
}

export function place(name: string) {
  return request(`/Place/GetPlaces/${encodeURI(name)}`);
}

export async function travel(
  { from, to }: { from: string, to: string },
) {
  const [fromPlace] = await place(from);
  const [toPlace] = await place(to);

  const trip = await request(
    `/Travel/GetTravels?fromPlace=${fromPlace.ID}&toPlace=${toPlace.ID}&isafter=true`
  );

  return {
    from: fromPlace,
    to: toPlace,
    trips: trip.TravelProposals,
  };
}
