const {
  registerRoute,
  extractAirpoirtsFromCsv,
  findBestRoute,
  connectAirports,
} = require('../../../modules/airport/airport-service');
const fs = require('fs');
const { INPUT_ROUTES_FILE_NAME } = process.env;

describe('Test airport-service', () => {
  test('if registerRoute() registers the route to YYY from XXX costing 10', async () => {
    expect(
      await registerRoute({ origin: 'XXX', destination: 'YYY', cost: 10 })
    ).toEqual('XXX -> YYY: 10');
  });

  test('if registerRoute() fails when trying to register a NaN cost', async () => {
    const error = await registerRoute({
      origin: 'XXX',
      destination: 'YYY',
      cost: 'ZZZ',
    });

    expect(error.message).toEqual('cost is not a number');
  });

  test('if extractAirpoirtsFromCsv() returns the airpoirts connections', async () => {
    expect(await extractAirpoirtsFromCsv({ file: null })).toEqual({
      XXX: { YYY: 10 },
    });
  });

  test('if extractAirportsFromCsv() fails when trying to read a not-existent or empty file', async () => {
    try {
      await extractAirpoirtsFromCsv({ file: 'sample.csv' });
    } catch (error) {
      expect(error.message).toEqual(
        `ENOENT: no such file or directory, open 'sample.csv'`
      );
    }
  });

  test('if extractAirportsFromCsv() fails when trying to read a not-csv file', async () => {
    const error = await extractAirpoirtsFromCsv({
      file:
        'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    });

    expect(error.message).toEqual('The given file is not a csv');
  });

  test('if findBestRoute() gets the lowest cost and the used route', async () => {
    expect(
      await findBestRoute({
        origin: 'XXX',
        destination: 'YYY',
      })
    ).toEqual({
      cost: 10,
      route: ['XXX', 'YYY'],
    });
  });

  test('if findBestRoute() fails when route does not exist', async () => {
    try {
      await findBestRoute({
        origin: 'WWW',
        destination: 'TTE',
      });
    } catch (error) {
      expect(error.message).toEqual('Route to TTE from WWW does not exist');
    }
  });

  test('if connectAirports() registers connections correctly', async () => {
    expect(
      await connectAirports({
        airports: [
          {
            origin: 'GRU',
            destinations: [{ destination: 'ORL', cost: 10 }],
          },
        ],
      })
    ).toEqual(['GRU -> ORL: 10']);
  });
});

afterAll(() => {
  if (INPUT_ROUTES_FILE_NAME) {
    fs.unlinkSync(
      `${__dirname}/../../../modules/airport/artifacts/${INPUT_ROUTES_FILE_NAME}`
    );
  }
});
