const readline = require('readline');
const { findBestRoute } = require('./airport-service');

const inputController = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const handleInput = ({ input }) => {
  const [origin, destination] = input.split('-');

  if (!origin || !destination) {
    throw new Error(
      'Invalid input. Please follow the pattern: ORIGIN-DESTINATION'
    );
  }

  return {
    origin,
    destination,
  };
};

const restart = ({ file }) => {
  inputController.question(
    '✨ Do you want to choose a new route? [y/n] ',
    (input) => (input === 'y' ? chooseRoute({ file }) : process.exit())
  );
};

const chooseRoute = ({ file }) => {
  inputController.question(
    '📍 Please enter the route: [ORIGIN-DESTINATION] ',
    async (input) => {
      try {
        const handledInput = handleInput({ input });
        const bestRoute = await findBestRoute({ ...handledInput, file });

        if (bestRoute instanceof Error) {
          throw new Error(bestRoute.message);
        }

        console.log(
          `✈️ Best Route: ${bestRoute.route.join(' - ')} > ${bestRoute.cost}$`
        );
      } catch (err) {
        console.log(`😟 ${err.message}`);
      } finally {
        restart({ file });
      }
    }
  );
};

(async () => {
  try {
    const [, , file] = process.argv;
    chooseRoute({ file });
  } catch (err) {
    console.log(err.message);
    process.exit();
  }
})();
