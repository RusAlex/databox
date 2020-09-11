// import { InitContext } from '../../src/module-utils';
import Plugin from '../../src/modules/github';

const initContext = jest.fn().mockImplementation(() => ({
  context: { appState: { metrics: {} } }
}));

describe('github', () => {
  test('appState.metrics.github is defined after module initialization', () => {
    const m = new Plugin();
    process.env.GITHUB_TOKEN = 'secret';
    const ctx = new initContext();
    m.init(ctx);
    expect(ctx.context.appState.metrics.github).toEqual([]);
  });
});
