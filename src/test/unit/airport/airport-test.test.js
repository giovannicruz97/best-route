const { registerRoute } = require('../../../modules/airport/airport-service');
const fs = require('fs');
const { INPUT_ROUTES_FILE_NAME } = process.env;

describe('Test airport-service functions', () => {
  test('Test registerRoute()', async () => {
    expect(
      await registerRoute({ origin: 'XXX', destination: 'YYY', value: 10 })
    ).toEqual('Route XXX to YYY for 10');
  });
});

afterAll(() => {
  fs.unlinkSync(
    `${__dirname}/../../../modules/airport/artifacts/${INPUT_ROUTES_FILE_NAME}`
  );
});
