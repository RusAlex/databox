// import { InitContext } from '../../src/module-utils';
import Plugin from '../../src/modules/local';

const initContext = jest.fn().mockImplementation(() => ({
  context: { appState: { metrics: {} } }
}));

describe('local', () => {
  test('appState.metrics.local is defined after module initialization', () => {
    const m = new Plugin();
    const ctx = new initContext();
    m.init(ctx);
    expect(ctx.context.appState.metrics.local).toEqual([]);
  });
});
