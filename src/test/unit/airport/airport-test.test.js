const {
  registerRoute,
  extractAirpoirtsFromCsv,
  findBestRoute,
} = require('../../../modules/airport/airport-service');
const fs = require('fs');
const { INPUT_ROUTES_FILE_NAME } = process.env;

describe('Test airport-service functions', () => {
  test('if registerRoute() registers the route to YYY from XXX costing 10', async () => {
    expect(
      await registerRoute({ origin: 'XXX', destination: 'YYY', cost: 10 })
    ).toEqual('XXX -> YYY: 10');
  });

  test('if extractAirpoirtsFromCsv() returns the airpoirts connections', async () => {
    expect(await extractAirpoirtsFromCsv()).toEqual({
      XXX: { YYY: 10 },
    });
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
});

afterAll(() => {
  if (INPUT_ROUTES_FILE_NAME) {
    fs.unlinkSync(
      `${__dirname}/../../../modules/airport/artifacts/${INPUT_ROUTES_FILE_NAME}`
    );
  }
});
