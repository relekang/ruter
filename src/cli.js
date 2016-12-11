// @flow
/* eslint-disable global-require, no-unused-expressions, no-console */

import chalk from 'chalk';
import dateFns from 'date-fns';

import * as ruter from './';

const dot = chalk.bold(chalk.blue('·'));

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('trip [from] [to]', 'welcome ter yargs!', {
    from: { },
    to: { },
  }, ({ from, to }) => {
    ruter.travel({ from, to })
      .then((response) => {
        console.log(
          `Travel from ${chalk.bold(response.from.Name)} to ${chalk.bold(response.to.Name)}`
        );
        response.trips.forEach((trip) => {
          const departure = dateFns.format(new Date(trip.DepartureTime), 'HH:mm');
          const arrival = dateFns.format(new Date(trip.ArrivalTime), 'HH:mm');
          const diff = dateFns.differenceInMinutes(new Date(trip.ArrivalTime), new Date());
          const output = `${dot} ${departure} - ${arrival} (${trip.TotalTravelTime})`;
          console.log(
            diff < 5 ? output : chalk.dim(output)
          );
        });
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .help()
  .argv;
