// @flow
/* eslint-disable global-require, no-unused-expressions, no-console */

import chalk from 'chalk';
import dateFns from 'date-fns';

import * as ruter from './';

const dot = chalk.bold(chalk.blue('·'));

require('yargs')
  .usage('$0 <cmd> [args]')
  .command('trip [from] [to]', { from: {}, to: {} }, 'Find a trip', ({ from, to }) => {
    ruter.travel({ from, to })
      .then((response) => {
        console.log(
          `Travel from ${chalk.bold(response.from.Name)} to ${chalk.bold(response.to.Name)}`
        );

        response.trips.forEach((trip) => {
          const departure = dateFns.format(new Date(`${trip.DepartureTime}+01:00`), 'HH:mm');
          const arrival = dateFns.format(new Date(`${trip.ArrivalTime}+01:00`), 'HH:mm');
          const diff = dateFns.differenceInMinutes(
            new Date(`${trip.DepartureTime}+01:00`),
            new Date()
          );
          const output = `${dot} ${departure} - ${arrival} (${trip.TotalTravelTime})`;
          console.log(
            diff < 5 ? chalk.dim(output) : output
          );
        });
      })
      .catch((error) => {
        console.error(error);
      });
  })
  .help()
  .argv;
